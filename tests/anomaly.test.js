import { describe, it, expect, vi } from 'vitest';
import { AnomalyManager, ANOMALY_TYPES } from '../src/entities/anomaly.js';

describe('Anomaly Manager', () => {
    const mockRooms = {
        'test-room': {
            objects: [{ position: { x: 0, clone: () => ({ x: 0 }), copy: vi.fn() } }],
            light: { intensity: 1, color: { setHex: vi.fn(), getHex: () => 0xffffff } },
            group: { add: vi.fn(), remove: vi.fn() }
        }
    };

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
