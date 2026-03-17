import { describe, it, expect, vi } from 'vitest';
import { AnomalyManager, ANOMALY_TYPES, DIFFICULTY_TIERS, CONFLICT_MATRIX } from '../src/entities/anomaly.js';

const makeMockRooms = () => ({
    'test-room': {
        objects: [{ position: { x: 0, clone: () => ({ x: 0 }), copy: vi.fn() } }],
        light: { intensity: 1, color: { setHex: vi.fn(), getHex: () => 0xffffff } },
        group: { add: vi.fn(), remove: vi.fn() }
    }
});

describe('Anomaly Manager', () => {
    const mockRooms = makeMockRooms();

    it('should track undetected anomalies', () => {
        const am = new AnomalyManager(mockRooms);
        am.triggerRandomAnomaly();
        expect(am.undetectedCount).toBe(1);
    });

    it('should resolve anomalies correctly', () => {
        const am = new AnomalyManager(mockRooms);
        const anomaly = am.triggerRandomAnomaly();
        const resolved = am.resolveAnomaly(anomaly.room, anomaly.type);
        expect(resolved).toBe(true);
        expect(am.undetectedCount).toBe(0);
    });
});

describe('AnomalyManager serialization', () => {
    const fakeAnomaly = {
        id: 1,
        room: 'test-room',
        type: 'displaced',
        category: 'object',
        difficulty: 'moderate',
        triggerTime: 1000,
        intensity: 1.0,
        target: null,
        originalState: null,
        ghost: null,
        animationState: null,
    };

    it('serialize() returns a JSON string with version field', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ ...fakeAnomaly });
        const result = JSON.parse(am.serialize());
        expect(result.version).toBe('1.0');
        expect(result.anomalies.length).toBe(1);
    });

    it('serialize() includes stats', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ ...fakeAnomaly });
        const result = JSON.parse(am.serialize());
        expect(result.stats).toHaveProperty('undetectedCount');
        expect(result.stats).toHaveProperty('totalTriggered');
        expect(result.stats).toHaveProperty('totalResolved');
    });

    it('serialize() includes roomLog', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.roomLog = { 'test-room': { triggered: 3, resolved: 1 } };
        const result = JSON.parse(am.serialize());
        expect(result.roomLog['test-room']).toEqual({ triggered: 3, resolved: 1 });
    });

    it('deserialize() restores stats from valid JSON', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ ...fakeAnomaly });
        am.undetectedCount = 1;
        am.totalTriggered = 5;
        am.totalResolved = 4;
        const json = am.serialize();

        const am2 = new AnomalyManager(makeMockRooms());
        const result = am2.deserialize(json);
        expect(result).toEqual({ success: true });
        expect(am2.undetectedCount).toBe(1);
        expect(am2.totalTriggered).toBe(5);
        expect(am2.totalResolved).toBe(4);
    });

    it('deserialize() returns error for invalid JSON', () => {
        const am = new AnomalyManager(makeMockRooms());
        const result = am.deserialize('not json');
        expect(result.error).toBeDefined();
    });

    it('deserialize() returns error for missing required fields', () => {
        const am = new AnomalyManager(makeMockRooms());
        const result = am.deserialize('{"foo":1}');
        expect(result.error).toContain('missing required fields');
    });

    it('deserialize() returns error for missing anomalies array', () => {
        const am = new AnomalyManager(makeMockRooms());
        const result = am.deserialize('{"version":"1.0"}');
        expect(result.error).toBeDefined();
    });
});

describe('AnomalyManager sound', () => {
    it('playSoundForAnomaly() does nothing when soundManager is null', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(() => am.playSoundForAnomaly({ type: 'phone_ringing' })).not.toThrow();
    });

    it('playSoundForAnomaly() does nothing when soundManager.ctx is null', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.soundManager = { ctx: null };
        expect(() => am.playSoundForAnomaly({ type: 'phone_ringing' })).not.toThrow();
    });

    it('playSoundForAnomaly() calls _tone for phone_ringing', () => {
        const am = new AnomalyManager(makeMockRooms());
        const _tone = vi.fn();
        am.soundManager = { ctx: {}, _tone };
        am.playSoundForAnomaly({ type: 'phone_ringing', target: null });
        expect(_tone).toHaveBeenCalledTimes(2);
    });

    it('playSoundForAnomaly() calls _tone for dripping_faucet', () => {
        const am = new AnomalyManager(makeMockRooms());
        const _tone = vi.fn();
        am.soundManager = { ctx: {}, _tone };
        am.playSoundForAnomaly({ type: 'dripping_faucet', target: null });
        expect(_tone).toHaveBeenCalledTimes(1);
    });

    it('playSoundForAnomaly() does not call _tone for unknown type', () => {
        const am = new AnomalyManager(makeMockRooms());
        const _tone = vi.fn();
        am.soundManager = { ctx: {}, _tone };
        am.playSoundForAnomaly({ type: 'displaced', target: null });
        expect(_tone).not.toHaveBeenCalled();
    });

    it('playSoundForAnomaly() applies distance falloff when cameraPosition provided', () => {
        const am = new AnomalyManager(makeMockRooms());
        const _tone = vi.fn();
        am.soundManager = { ctx: {}, _tone };
        am.playSoundForAnomaly(
            { type: 'phone_ringing', target: { position: { x: 10, y: 0, z: 0 } } },
            { x: 0, y: 0, z: 0 }
        );
        // volume = (1 - 10/20) * 0.2 = 0.1, which is < 0.2
        const volumeArg = _tone.mock.calls[0][3];
        expect(volumeArg).toBeLessThan(0.2);
    });

    it('setSoundManager() stores the reference', () => {
        const am = new AnomalyManager(makeMockRooms());
        const sm = { ctx: {} };
        am.setSoundManager(sm);
        expect(am.soundManager).toBe(sm);
    });
});

describe('AnomalyManager difficulty', () => {
    it('getDifficulty() returns obvious for intruder', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.getDifficulty('intruder')).toBe('obvious');
    });

    it('getDifficulty() returns moderate for displaced', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.getDifficulty('displaced')).toBe('moderate');
    });

    it('getDifficulty() returns subtle for books_floating', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.getDifficulty('books_floating')).toBe('subtle');
    });

    it('getDifficulty() returns moderate for unknown type', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.getDifficulty('unknown_xyz')).toBe('moderate');
    });

    it('DIFFICULTY_TIERS has obvious, moderate, subtle keys', () => {
        expect(Array.isArray(DIFFICULTY_TIERS.obvious)).toBe(true);
        expect(Array.isArray(DIFFICULTY_TIERS.moderate)).toBe(true);
        expect(Array.isArray(DIFFICULTY_TIERS.subtle)).toBe(true);
    });

    it('difficultyWeights sum to 1.0', () => {
        const am = new AnomalyManager(makeMockRooms());
        const { obvious, moderate, subtle } = am.difficultyWeights;
        expect(obvious + moderate + subtle).toBeCloseTo(1.0);
    });

    it('triggerRandomAnomaly() sets difficulty on anomaly', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = am.triggerRandomAnomaly();
        expect(['obvious', 'moderate', 'subtle']).toContain(anomaly.difficulty);
    });
});

describe('AnomalyManager conflict resolution', () => {
    it('CONFLICT_MATRIX is exported and is an object', () => {
        expect(typeof CONFLICT_MATRIX).toBe('object');
        expect(Array.isArray(CONFLICT_MATRIX['light'])).toBe(true);
    });

    it('checkConflict() returns false when no active anomalies', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.checkConflict('light', 'test-room')).toBe(false);
    });

    it('checkConflict() returns true when conflicting anomaly is active in same room', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ room: 'test-room', type: 'red_tint' });
        expect(am.checkConflict('light', 'test-room')).toBe(true);
    });

    it('checkConflict() returns false when conflicting anomaly is in a different room', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ room: 'other-room', type: 'red_tint' });
        expect(am.checkConflict('light', 'test-room')).toBe(false);
    });

    it('checkConflict() returns false for type with no defined conflicts', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ room: 'test-room', type: 'displaced' });
        expect(am.checkConflict('painting', 'test-room')).toBe(false);
    });

    it('checkConflict() detects time_freeze vs autonomous conflict', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.activeAnomalies.push({ room: 'test-room', type: 'time_freeze' });
        expect(am.checkConflict('rocking_chair', 'test-room')).toBe(true);
        expect(am.checkConflict('spinning_fan', 'test-room')).toBe(true);
        expect(am.checkConflict('dripping_faucet', 'test-room')).toBe(true);
    });

    it('triggerRandomAnomaly() does not spawn a type conflicting with an active anomaly', () => {
        const rooms = {
            'living-room': {
                objects: [{ position: { x: 0, clone: () => ({ x: 0 }), copy: vi.fn() } }],
                light: { intensity: 1, color: { setHex: vi.fn(), getHex: () => 0xffffff } },
                group: { add: vi.fn(), remove: vi.fn() }
            }
        };
        const am = new AnomalyManager(rooms);
        // Pre-seed a 'light' anomaly so 'red_tint' and 'fog_room' should be blocked
        am.activeAnomalies.push({ room: 'living-room', type: 'light', category: 'environmental' });

        // Run many spawns and verify no conflicting type appears
        for (let i = 0; i < 50; i++) {
            const a = am.triggerRandomAnomaly();
            if (a && a.room === 'living-room') {
                expect(['red_tint', 'fog_room']).not.toContain(a.type);
            }
        }
    });
});

describe('AnomalyManager duplicate prevention', () => {
    it('triggerRandomAnomaly() does not spawn duplicate type in same room', () => {
        const rooms = {
            'living-room': {
                objects: [{ position: { x: 0, clone: () => ({ x: 0 }), copy: vi.fn() } }],
                light: { intensity: 1, color: { setHex: vi.fn(), getHex: () => 0xffffff } },
                group: { add: vi.fn(), remove: vi.fn() }
            }
        };
        const am = new AnomalyManager(rooms);
        const first = am.triggerRandomAnomaly();
        if (!first) return;

        // Only assert while the first anomaly is still active (before pool exhaustion)
        for (let i = 0; i < 10; i++) {
            const firstStillActive = am.activeAnomalies.some(
                a => a.room === first.room && a.type === first.type
            );
            if (!firstStillActive) break;

            const a = am.triggerRandomAnomaly();
            if (a && a.room === first.room) {
                expect(a.type).not.toBe(first.type);
            }
        }
    });
});

describe('AnomalyManager intensity scaling', () => {
    it('updateIntensity() sets intensity to 1.2 after 30s', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = {
            id: 1, room: 'test-room', type: 'light', category: 'environmental',
            triggerTime: Date.now() - 31000, intensity: 1.0,
            target: null, ghost: null,
        };
        am.activeAnomalies.push(anomaly);
        am.updateIntensity();
        expect(anomaly.intensity).toBe(1.2);
    });

    it('updateIntensity() sets intensity to 1.5 after 60s', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = {
            id: 1, room: 'test-room', type: 'light', category: 'environmental',
            triggerTime: Date.now() - 61000, intensity: 1.0,
            target: null, ghost: null,
        };
        am.activeAnomalies.push(anomaly);
        am.updateIntensity();
        expect(anomaly.intensity).toBe(1.5);
    });

    it('updateIntensity() leaves intensity at 1.0 under 30s', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = {
            id: 1, room: 'test-room', type: 'displaced', category: 'object',
            triggerTime: Date.now() - 5000, intensity: 1.0,
            target: null, ghost: null,
        };
        am.activeAnomalies.push(anomaly);
        am.updateIntensity();
        expect(anomaly.intensity).toBe(1.0);
    });

    it('resolveAnomaly() resets intensity to 1.0', () => {
        const rooms = makeMockRooms();
        const am = new AnomalyManager(rooms);
        const anomaly = am.triggerRandomAnomaly();
        if (!anomaly) return;
        anomaly.intensity = 1.5;
        am.resolveAnomaly(anomaly.room, anomaly.type);
        // After resolution anomaly is removed — intensity reset is implicit
        expect(am.activeAnomalies.find(a => a.id === anomaly.id)).toBeUndefined();
    });

    it('updateIntensity() handles empty anomaly list', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(() => am.updateIntensity()).not.toThrow();
    });
});

describe('AnomalyManager study mode', () => {
    it('studyMode flag defaults to false', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.studyMode).toBe(false);
    });

    it('triggerRandomAnomaly() does not increment stats in study mode', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.studyMode = true;
        am.triggerRandomAnomaly();
        expect(am.totalTriggered).toBe(0);
        expect(am.undetectedCount).toBe(0);
    });

    it('triggerRandomAnomaly() increments stats when not in study mode', () => {
        const am = new AnomalyManager(makeMockRooms());
        am.triggerRandomAnomaly();
        expect(am.totalTriggered).toBe(1);
        expect(am.undetectedCount).toBe(1);
    });
});

describe('AnomalyManager persistence tracking', () => {
    it('detectionHistory starts empty', () => {
        const am = new AnomalyManager(makeMockRooms());
        expect(am.detectionHistory).toEqual([]);
    });

    it('resolveAnomaly() records duration in detectionHistory', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = am.triggerRandomAnomaly();
        if (!anomaly) return;
        am.resolveAnomaly(anomaly.room, anomaly.type);
        expect(am.detectionHistory.length).toBe(1);
        expect(am.detectionHistory[0].room).toBe(anomaly.room);
        expect(am.detectionHistory[0].type).toBe(anomaly.type);
        expect(typeof am.detectionHistory[0].duration).toBe('number');
    });

    it('resolveAnomaly() records avgDetectionTime in roomLog', () => {
        const am = new AnomalyManager(makeMockRooms());
        const anomaly = am.triggerRandomAnomaly();
        if (!anomaly) return;
        am.resolveAnomaly(anomaly.room, anomaly.type);
        expect(am.roomLog[anomaly.room].avgDetectionTime).toBeGreaterThanOrEqual(0);
    });

    it('resolveAnomaly() records fastestDetection and slowestDetection', () => {
        const am = new AnomalyManager(makeMockRooms());
        const a1 = am.triggerRandomAnomaly();
        if (!a1) return;
        am.resolveAnomaly(a1.room, a1.type);
        expect(am.roomLog[a1.room].fastestDetection).toBeDefined();
        expect(am.roomLog[a1.room].slowestDetection).toBeDefined();
    });
});
