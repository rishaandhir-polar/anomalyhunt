import * as THREE from 'three';
import { applyObjectAnomaly, resolveObjectAnomaly, OBJECT_ANOMALY_TYPES } from './anomaly-types/object-anomalies.js';
import { applyAutonomousAnomaly, resolveAutonomousAnomaly, AUTONOMOUS_ANOMALY_TYPES } from './anomaly-types/autonomous-anomalies.js';
import { applyEnvironmentalAnomaly, resolveEnvironmentalAnomaly, ENVIRONMENTAL_ANOMALY_TYPES } from './anomaly-types/environmental-anomalies.js';
import { applyElectronicAnomaly, resolveElectronicAnomaly, ELECTRONIC_ANOMALY_TYPES } from './anomaly-types/electronic-anomalies.js';
import { playSoundForAnomaly as _playSoundForAnomaly } from './anomaly-sound.js';
import { serialize as _serialize, deserialize as _deserialize, updateIntensity as _updateIntensity, applyIntensityModifier as _applyIntensityModifier } from './anomaly-persistence.js';

export const DIFFICULTY_TIERS = {
    obvious:  ['intruder','extra','missing','light','all_electronics_on','fog_room','red_tint'],
    moderate: ['displaced','painting','tv','chair_floor','lamp_flickering','door_ajar','rocking_chair','spinning_fan','swinging_light','temperature_drop','gravity_shift','tv_on_empty_room','monitor_glitch','phone_ringing','radio_static'],
    subtle:   ['books_floating','cushion_displaced','curtains_moving','mirror_reflection','dripping_faucet','crawling_shadow','time_freeze','static_noise'],
};

export const ANOMALY_TYPES = { DISPLACED:'displaced', EXTRA:'extra', LIGHT:'light', INTRUDER:'intruder', MISSING:'missing', PAINTING:'painting', TV:'tv' };

export const CONFLICT_MATRIX = {
    light:['red_tint','fog_room'], red_tint:['light','fog_room'], fog_room:['light','red_tint','static_noise'],
    static_noise:['fog_room'], displaced:['missing','extra'], missing:['displaced','extra'], extra:['displaced','missing'],
    time_freeze:['rocking_chair','spinning_fan','dripping_faucet','swinging_light','crawling_shadow'],
    rocking_chair:['time_freeze'], spinning_fan:['time_freeze'], dripping_faucet:['time_freeze'],
    swinging_light:['time_freeze'], crawling_shadow:['time_freeze'],
};

const BASE = ['displaced','extra','light','intruder','missing','temperature_drop','fog_room','red_tint','gravity_shift','time_freeze','static_noise'];
export const ROOM_ANOMALY_COMPATIBILITY = {
    'living-room': [...BASE,'painting','tv','chair_floor','books_floating','lamp_flickering','cushion_displaced','curtains_moving','mirror_reflection','rocking_chair','swinging_light','crawling_shadow','tv_on_empty_room','all_electronics_on'],
    'kitchen':  [...BASE,'dripping_faucet'],
    'bedroom':  [...BASE,'curtains_moving','mirror_reflection','swinging_light','crawling_shadow','monitor_glitch','all_electronics_on'],
    'office':   [...BASE,'books_floating','chair_floor','spinning_fan','crawling_shadow','monitor_glitch','all_electronics_on'],
    'bathroom': [...BASE,'mirror_reflection','dripping_faucet'],
    'hallway':  [...BASE,'swinging_light','crawling_shadow'],
    'basement': [...BASE,'dripping_faucet','swinging_light','crawling_shadow','all_electronics_on'],
    'attic':    [...BASE,'rocking_chair','swinging_light','crawling_shadow'],
    'garage':   [...BASE,'door_ajar','all_electronics_on'],
    'nursery':  [...BASE,'rocking_chair','swinging_light','crawling_shadow','phone_ringing'],
};

function getCategory(type) {
    if (OBJECT_ANOMALY_TYPES.includes(type)) return 'object';
    if (AUTONOMOUS_ANOMALY_TYPES.includes(type)) return 'autonomous';
    if (ENVIRONMENTAL_ANOMALY_TYPES.includes(type)) return 'environmental';
    if (ELECTRONIC_ANOMALY_TYPES.includes(type)) return 'electronic';
    return 'object';
}

function spawnIntruder(room, anomaly) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    g.add(body);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eyeGeo = new THREE.SphereGeometry(0.06);
    const lEye = new THREE.Mesh(eyeGeo, eyeMat); lEye.position.set(-0.2, 0.7, 0.45);
    const rEye = new THREE.Mesh(eyeGeo, eyeMat); rEye.position.set(0.2, 0.7, 0.45);
    g.add(lEye, rEye);
    g.position.set(-2, 1, -2);
    room.group.add(g);
    anomaly.ghost = g;
    return true;
}

export class AnomalyManager {
    constructor(rooms) {
        this.rooms = rooms;
        this.activeAnomalies = [];
        this.undetectedCount = 0;
        this.totalTriggered = 0;
        this.totalResolved = 0;
        this.roomLog = {};
        this.soundManager = null;
        this.difficultyWeights = { obvious: 0.4, moderate: 0.4, subtle: 0.2 };
        this.studyMode = false;
        this.detectionHistory = [];
    }

    checkConflict(type, roomName) {
        const conflicts = CONFLICT_MATRIX[type] || [];
        return this.activeAnomalies.some(a => a.room === roomName && conflicts.includes(a.type));
    }

    getDifficulty(type) {
        if (DIFFICULTY_TIERS.obvious.includes(type)) return 'obvious';
        if (DIFFICULTY_TIERS.moderate.includes(type)) return 'moderate';
        if (DIFFICULTY_TIERS.subtle.includes(type)) return 'subtle';
        return 'moderate';
    }

    setSoundManager(sm) { this.soundManager = sm; }
    playSoundForAnomaly(anomaly, cameraPosition = null) { _playSoundForAnomaly(this.soundManager, anomaly, cameraPosition); }
    serialize() { return _serialize(this); }
    deserialize(json) { return _deserialize(this, json); }
    updateIntensity() { _updateIntensity(this); }
    applyIntensityModifier(anomaly) { _applyIntensityModifier(anomaly); }
    getCompatibleTypes(roomName) { return ROOM_ANOMALY_COMPATIBILITY[roomName] || []; }

    triggerRandomAnomaly() {
        const roomKeys = Object.keys(this.rooms);
        const roomName = roomKeys[Math.floor(Math.random() * roomKeys.length)];
        const room = this.rooms[roomName];
        const compatibleTypes = ROOM_ANOMALY_COMPATIBILITY[roomName] || ['displaced','extra','light','missing'];

        const rand = Math.random();
        const selectedTier = rand < this.difficultyWeights.obvious ? 'obvious'
            : rand < this.difficultyWeights.obvious + this.difficultyWeights.moderate ? 'moderate' : 'subtle';

        const tieredPool = compatibleTypes.filter(t => DIFFICULTY_TIERS[selectedTier]?.includes(t));
        const pool0 = tieredPool.length > 0 ? tieredPool : compatibleTypes;
        const nonConflicting = pool0.filter(t => !this.checkConflict(t, roomName) && !this.activeAnomalies.some(a => a.room === roomName && a.type === t));
        const noConflict = pool0.filter(t => !this.checkConflict(t, roomName));
        const pool = nonConflicting.length > 0 ? nonConflicting : noConflict.length > 0 ? noConflict : pool0;
        const type = pool[Math.floor(Math.random() * pool.length)];

        const anomaly = {
            id: Date.now(), room: roomName, type, category: getCategory(type),
            difficulty: this.getDifficulty(type),
            target: room.objects[Math.floor(Math.random() * room.objects.length)],
            originalState: null, ghost: null, triggerTime: Date.now(), intensity: 1.0,
        };

        if (this.applyAnomaly(room, anomaly) === null) return null;
        this.activeAnomalies.push(anomaly);
        if (!this.studyMode) {
            this.undetectedCount++;
            this.totalTriggered++;
            if (!this.roomLog[roomName]) this.roomLog[roomName] = { triggered: 0, resolved: 0 };
            this.roomLog[roomName].triggered++;
        }
        console.log(`[SYSTEM] Anomaly triggered in ${roomName}: ${type}`);
        this.playSoundForAnomaly(anomaly);
        return anomaly;
    }

    applyAnomaly(room, anomaly) {
        try {
            if (anomaly.type === 'intruder') return spawnIntruder(room, anomaly);
            const cat = anomaly.category || getCategory(anomaly.type);
            switch (cat) {
                case 'object':        return applyObjectAnomaly(room, anomaly);
                case 'autonomous':    return applyAutonomousAnomaly(room, anomaly);
                case 'environmental': return applyEnvironmentalAnomaly(room, anomaly);
                case 'electronic':    return applyElectronicAnomaly(room, anomaly);
                default:              return applyObjectAnomaly(room, anomaly);
            }
        } catch (error) {
            console.warn(`[SYSTEM] Failed to apply ${anomaly.type} in ${anomaly.room}:`, error.message);
            this.activeAnomalies = this.activeAnomalies.filter(a => a.id !== anomaly.id);
            this.undetectedCount = Math.max(0, this.undetectedCount - 1);
            return null;
        }
    }

    resolveAnomaly(roomName, type) {
        const index = this.activeAnomalies.findIndex(a => a.room === roomName && a.type === type);
        if (index === -1) return false;
        const anomaly = this.activeAnomalies[index];
        const room = this.rooms[roomName];

        if (anomaly.type === 'intruder') {
            if (anomaly.ghost) room.group.remove(anomaly.ghost);
        } else {
            const cat = anomaly.category || getCategory(anomaly.type);
            switch (cat) {
                case 'object':        resolveObjectAnomaly(room, anomaly); break;
                case 'autonomous':    resolveAutonomousAnomaly(room, anomaly); break;
                case 'environmental': resolveEnvironmentalAnomaly(room, anomaly); break;
                case 'electronic':    resolveElectronicAnomaly(room, anomaly); break;
                default:              resolveObjectAnomaly(room, anomaly); break;
            }
        }

        this.activeAnomalies.splice(index, 1);
        this.undetectedCount--;
        this.totalResolved++;
        if (this.roomLog[roomName]) this.roomLog[roomName].resolved++;

        const duration = Date.now() - anomaly.triggerTime;
        this.detectionHistory.push({ room: roomName, type: anomaly.type, duration });
        if (this.roomLog[roomName]) {
            const times = this.detectionHistory.filter(h => h.room === roomName).map(h => h.duration);
            this.roomLog[roomName].avgDetectionTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
            this.roomLog[roomName].fastestDetection = Math.min(...times);
            this.roomLog[roomName].slowestDetection = Math.max(...times);
        }
        return true;
    }
}
