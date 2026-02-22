import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnomalyManager } from '../src/entities/anomaly.js';

// ── THREE mock: constructors MUST be actual classes for `new` to work ─────────
vi.mock('three', () => {
    class FakeMesh {
        constructor(geo, mat) {
            this.geometry = geo;
            this.material = mat;
            this.position = { set: vi.fn(), clone: () => ({ x: 0 }), copy: vi.fn(), x: 0 };
            this.visible = true;
        }
    }
    class FakeGroup {
        constructor() { this.add = vi.fn(); this.remove = vi.fn(); this.children = []; this.position = { set: vi.fn() }; }
    }
    class FakeMat { constructor(opts) { Object.assign(this, opts); } }
    class FakeBasicMat { constructor(opts) { Object.assign(this, opts); } }
    class FakeSphereGeo { constructor() { } }
    class FakeCapsuleGeo { constructor() { } }

    return {
        Mesh: FakeMesh,
        Group: FakeGroup,
        MeshStandardMaterial: FakeMat,
        MeshBasicMaterial: FakeBasicMat,
        SphereGeometry: FakeSphereGeo,
        CapsuleGeometry: FakeCapsuleGeo,
    };
});

// ── Fake room factory ─────────────────────────────────────────────────────────
function makeRoom() {
    return {
        group: { add: vi.fn(), remove: vi.fn() },
        objects: [
            { position: { clone: () => ({ x: 0 }), copy: vi.fn(), x: 0 }, visible: true },
            { position: { clone: () => ({ x: 1 }), copy: vi.fn(), x: 1 }, visible: true },
        ],
        light: {
            intensity: 15,
            color: { getHex: () => 0xffffff, setHex: vi.fn() }
        }
    };
}

// ── applyAnomaly tests ────────────────────────────────────────────────────────
describe('AnomalyManager – applyAnomaly branches', () => {
    let mgr, room;

    beforeEach(() => {
        room = makeRoom();
        mgr = new AnomalyManager({ 'test-room': room });
        vi.restoreAllMocks();
    });

    it('displaced: moves target.position.x by ±2', () => {
        const target = room.objects[0];
        const origX = target.position.x;
        const anomaly = { type: 'displaced', target, room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(Math.abs(target.position.x - origX)).toBeGreaterThanOrEqual(2);
        expect(anomaly.originalState).not.toBeNull();
    });

    it('extra: adds a ghost mesh to the room group', () => {
        const anomaly = { type: 'extra', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(room.group.add).toHaveBeenCalled();
        expect(anomaly.ghost).toBeDefined();
    });

    it('intruder: adds an intruder group to the room', () => {
        const anomaly = { type: 'intruder', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(room.group.add).toHaveBeenCalled();
        expect(anomaly.ghost).toBeDefined();
    });

    it('light – blackout: Math.random > 0.5 → intensity 0', () => {
        // anomaly.js line 53: `if (Math.random() > 0.5)` { intensity = 0 } (blackout)
        vi.spyOn(Math, 'random').mockReturnValue(0.9);
        const anomaly = { type: 'light', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(anomaly.originalState.intensity).toBe(15);
        expect(room.light.intensity).toBe(0);
    });

    it('light – strobe: Math.random <= 0.5 → intensity 5 + purple', () => {
        // anomaly.js: else branch (random <= 0.5) sets intensity=5 and color=purple
        vi.spyOn(Math, 'random').mockReturnValue(0.3);
        const anomaly = { type: 'light', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(room.light.intensity).toBe(5);
        expect(room.light.color.setHex).toHaveBeenCalledWith(0xff00ff);
    });

    it('missing: sets target.visible to false', () => {
        const target = room.objects[0];
        const anomaly = { type: 'missing', target, room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(target.visible).toBe(false);
    });
});

// ── resolveAnomaly tests ──────────────────────────────────────────────────────
describe('AnomalyManager – resolveAnomaly', () => {
    let mgr, room;

    beforeEach(() => {
        room = makeRoom();
        mgr = new AnomalyManager({ 'test-room': room });
    });

    it('removes ghost from room group on resolve (extra/intruder)', () => {
        const ghost = { id: 'ghost-obj' };
        mgr.activeAnomalies = [{ room: 'test-room', type: 'extra', ghost, originalState: null }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('test-room', 'extra');
        expect(result).toBe(true);
        expect(room.group.remove).toHaveBeenCalledWith(ghost);
        expect(mgr.undetectedCount).toBe(0);
    });

    it('restores missing object visibility on resolve', () => {
        const target = { visible: false, position: { copy: vi.fn() } };
        mgr.activeAnomalies = [{ room: 'test-room', type: 'missing', target, originalState: null }];
        mgr.undetectedCount = 1;
        mgr.resolveAnomaly('test-room', 'missing');
        expect(target.visible).toBe(true);
    });

    it('returns false for mismatched room/type', () => {
        mgr.activeAnomalies = [{ room: 'test-room', type: 'extra', ghost: {}, originalState: null }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('bathroom', 'extra');
        expect(result).toBe(false);
        expect(mgr.undetectedCount).toBe(1);
    });
});

// ── painting & tv anomaly tests ──────────────────────────────────────────────
describe('AnomalyManager – painting & tv anomalies', () => {
    let mgr, room;

    beforeEach(() => {
        room = {
            group: { add: vi.fn(), remove: vi.fn() },
            objects: [{ position: { clone: () => ({ x: 0 }), copy: vi.fn(), x: 0 }, visible: true }],
            light: { intensity: 15, color: { getHex: () => 0xffffff, setHex: vi.fn() } },
            painting: {
                material: {
                    color: { getHex: () => 0xaabbcc, setHex: vi.fn() }
                }
            },
            tvScreen: {
                material: {
                    color: { getHex: () => 0x000000, setHex: vi.fn() },
                    emissive: { setHex: vi.fn() },
                    emissiveIntensity: 0.5
                }
            }
        };
        mgr = new AnomalyManager({ 'test-room': room });
    });

    it('painting: changes painting color to random from palette', () => {
        const anomaly = { type: 'painting', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(anomaly.originalState.color).toBe(0xaabbcc);
        expect(room.painting.material.color.setHex).toHaveBeenCalled();
    });

    it('painting: skips if room.painting is missing', () => {
        delete room.painting;
        const anomaly = { type: 'painting', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(anomaly.originalState).toBeNull();
    });

    it('tv: changes tvScreen color and emissive intensity', () => {
        const anomaly = { type: 'tv', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(anomaly.originalState.color).toBe(0x000000);
        expect(anomaly.originalState.emissiveIntensity).toBe(0.5);
        expect(room.tvScreen.material.color.setHex).toHaveBeenCalledWith(0x99bbff);
        expect(room.tvScreen.material.emissive.setHex).toHaveBeenCalledWith(0x4466cc);
        expect(room.tvScreen.material.emissiveIntensity).toBe(1.8);
    });

    it('tv: skips if room.tvScreen is missing', () => {
        delete room.tvScreen;
        const anomaly = { type: 'tv', target: room.objects[0], room: 'test-room', originalState: null };
        mgr.applyAnomaly(room, anomaly);
        expect(anomaly.originalState).toBeNull();
    });
});

// ── resolveAnomaly: painting & tv branches ────────────────────────────────────
describe('AnomalyManager – resolve painting & tv', () => {
    let mgr, room;

    beforeEach(() => {
        room = {
            group: { add: vi.fn(), remove: vi.fn() },
            objects: [],
            light: { intensity: 15, color: { getHex: () => 0xffffff, setHex: vi.fn() } },
            painting: { material: { color: { setHex: vi.fn() } } },
            tvScreen: {
                material: {
                    color: { setHex: vi.fn() },
                    emissive: { setHex: vi.fn() },
                    emissiveIntensity: 1.8
                }
            }
        };
        mgr = new AnomalyManager({ 'test-room': room });
    });

    it('resolves painting anomaly and restores original color', () => {
        mgr.activeAnomalies = [{
            room: 'test-room',
            type: 'painting',
            originalState: { color: 0xaabbcc }
        }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('test-room', 'painting');
        expect(result).toBe(true);
        expect(room.painting.material.color.setHex).toHaveBeenCalledWith(0xaabbcc);
        expect(mgr.undetectedCount).toBe(0);
    });

    it('resolves tv anomaly and restores original state', () => {
        mgr.activeAnomalies = [{
            room: 'test-room',
            type: 'tv',
            originalState: { color: 0x000000, emissiveIntensity: 0.5 }
        }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('test-room', 'tv');
        expect(result).toBe(true);
        expect(room.tvScreen.material.color.setHex).toHaveBeenCalledWith(0x000000);
        expect(room.tvScreen.material.emissive.setHex).toHaveBeenCalledWith(0x000000);
        expect(room.tvScreen.material.emissiveIntensity).toBe(0.5);
        expect(mgr.undetectedCount).toBe(0);
    });

    it('handles painting resolve when room.painting is missing', () => {
        delete room.painting;
        mgr.activeAnomalies = [{
            room: 'test-room',
            type: 'painting',
            originalState: { color: 0xaabbcc }
        }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('test-room', 'painting');
        expect(result).toBe(true);
        expect(mgr.undetectedCount).toBe(0);
    });

    it('handles tv resolve when room.tvScreen is missing', () => {
        delete room.tvScreen;
        mgr.activeAnomalies = [{
            room: 'test-room',
            type: 'tv',
            originalState: { color: 0x000000, emissiveIntensity: 0.5 }
        }];
        mgr.undetectedCount = 1;
        const result = mgr.resolveAnomaly('test-room', 'tv');
        expect(result).toBe(true);
        expect(mgr.undetectedCount).toBe(0);
    });
});
