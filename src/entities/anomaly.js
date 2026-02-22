import * as THREE from 'three';

export const ANOMALY_TYPES = {
    DISPLACED: 'displaced',
    EXTRA: 'extra',
    LIGHT: 'light',
    INTRUDER: 'intruder',
    MISSING: 'missing',
    PAINTING: 'painting',
    TV: 'tv',
};

export class AnomalyManager {
    constructor(rooms) {
        this.rooms = rooms;
        this.activeAnomalies = [];
        this.undetectedCount = 0;
        this.totalTriggered = 0;
        this.totalResolved = 0;
        this.roomLog = {}; // { roomName: { triggered, resolved } }
    }

    triggerRandomAnomaly() {
        const roomKeys = Object.keys(this.rooms);
        const roomName = roomKeys[Math.floor(Math.random() * roomKeys.length)];
        const room = this.rooms[roomName];

        // Build type pool for this specific room
        const types = ['displaced', 'extra', 'light', 'intruder', 'missing'];
        if (room.painting) types.push('painting');
        if (room.tvScreen) types.push('tv');

        const type = types[Math.floor(Math.random() * types.length)];

        const anomaly = {
            id: Date.now(),
            room: roomName,
            type,
            target: room.objects[Math.floor(Math.random() * room.objects.length)],
            originalState: null,
            ghost: null,
        };

        this.applyAnomaly(room, anomaly);
        this.activeAnomalies.push(anomaly);
        this.undetectedCount++;
        this.totalTriggered++;

        if (!this.roomLog[roomName]) this.roomLog[roomName] = { triggered: 0, resolved: 0 };
        this.roomLog[roomName].triggered++;

        console.log(`[SYSTEM] Anomaly triggered in ${roomName}: ${type}`);
        return anomaly;
    }

    applyAnomaly(room, anomaly) {
        switch (anomaly.type) {
            case 'displaced':
                anomaly.originalState = { pos: anomaly.target.position.clone() };
                anomaly.target.position.x += (Math.random() > 0.5 ? 2 : -2);
                break;

            case 'light':
                anomaly.originalState = {
                    intensity: room.light.intensity,
                    color: room.light.color.getHex()
                };
                if (Math.random() > 0.5) {
                    room.light.intensity = 0; // blackout
                } else {
                    room.light.intensity = 5;
                    room.light.color.setHex(0xff00ff); // ominous purple
                }
                break;

            case 'extra': {
                const ghost = new THREE.Mesh(
                    new THREE.SphereGeometry(0.5),
                    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
                );
                ghost.position.set(2, 1, 2);
                room.group.add(ghost);
                anomaly.ghost = ghost;
                break;
            }

            case 'intruder': {
                const intruderGroup = new THREE.Group();
                const body = new THREE.Mesh(
                    new THREE.CapsuleGeometry(0.5, 1),
                    new THREE.MeshStandardMaterial({ color: 0x000000 })
                );
                intruderGroup.add(body);
                const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const eyeGeo = new THREE.SphereGeometry(0.06);
                const lEye = new THREE.Mesh(eyeGeo, eyeMat);
                const rEye = new THREE.Mesh(eyeGeo, eyeMat);
                lEye.position.set(-0.2, 0.7, 0.45);
                rEye.position.set(0.2, 0.7, 0.45);
                intruderGroup.add(lEye, rEye);
                intruderGroup.position.set(-2, 1, -2);
                room.group.add(intruderGroup);
                anomaly.ghost = intruderGroup;
                break;
            }

            case 'missing':
                anomaly.target.visible = false;
                break;

            case 'painting':
                if (!room.painting) break;
                anomaly.originalState = { color: room.painting.material.color.getHex() };
                const paintColors = [0xff2222, 0x22ff22, 0xff8800, 0xaa00ff, 0x00ffee];
                room.painting.material.color.setHex(
                    paintColors[Math.floor(Math.random() * paintColors.length)]
                );
                break;

            case 'tv':
                if (!room.tvScreen) break;
                anomaly.originalState = {
                    color: room.tvScreen.material.color.getHex(),
                    emissiveIntensity: room.tvScreen.material.emissiveIntensity,
                };
                room.tvScreen.material.color.setHex(0x99bbff);
                room.tvScreen.material.emissive.setHex(0x4466cc);
                room.tvScreen.material.emissiveIntensity = 1.8;
                break;
        }

        console.log(`[SYSTEM] Anomaly triggered in ${anomaly.room}: ${anomaly.type}`);
    }

    resolveAnomaly(roomName, type) {
        const index = this.activeAnomalies.findIndex(a => a.room === roomName && a.type === type);
        if (index === -1) return false;

        const anomaly = this.activeAnomalies[index];
        const room = this.rooms[roomName];

        switch (anomaly.type) {
            case 'displaced':
                anomaly.target.position.copy(anomaly.originalState.pos);
                break;
            case 'light':
                room.light.intensity = anomaly.originalState.intensity;
                room.light.color.setHex(anomaly.originalState.color);
                break;
            case 'missing':
                anomaly.target.visible = true;
                break;
            case 'painting':
                if (room.painting) room.painting.material.color.setHex(anomaly.originalState.color);
                break;
            case 'tv':
                if (room.tvScreen) {
                    room.tvScreen.material.color.setHex(anomaly.originalState.color);
                    room.tvScreen.material.emissive.setHex(0x000000);
                    room.tvScreen.material.emissiveIntensity = anomaly.originalState.emissiveIntensity;
                }
                break;
            default:
                if (anomaly.ghost) room.group.remove(anomaly.ghost);
        }

        this.activeAnomalies.splice(index, 1);
        this.undetectedCount--;
        this.totalResolved++;
        if (this.roomLog[roomName]) this.roomLog[roomName].resolved++;
        return true;
    }
}
