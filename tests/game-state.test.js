import { describe, it, expect, vi } from 'vitest';
import { GameState } from '../src/core/game-state.js';

// Minimal engine mock
const makeEngine = (anomalies = []) => ({
    anomalyManager: {
        activeAnomalies: anomalies,
        undetectedCount: 0,
        totalTriggered: 0,
        totalResolved: 0,
        roomLog: {},
        triggerRandomAnomaly: vi.fn(),
    },
    render: vi.fn(),
});

const makeSoundManager = () => ({
    init: vi.fn(),
    playAnomalySpawn: vi.fn(),
    playAlert: vi.fn(),
    playWin: vi.fn(),
    playLoss: vi.fn(),
    setAmbientTension: vi.fn(),
});

describe('GameState.formatTime', () => {
    const gs = new GameState(makeEngine(), makeSoundManager());

    it('formats midnight correctly', () => {
        expect(gs.formatTime(0)).toBe('12:00 AM');
    });

    it('formats noon correctly', () => {
        expect(gs.formatTime(43200)).toBe('12:00 PM');
    });

    it('formats 1:30 AM correctly', () => {
        expect(gs.formatTime(5400)).toBe('01:30 AM');
    });
});

describe('GameState.getSpawnDelay', () => {
    const gs = new GameState(makeEngine(), makeSoundManager());

    it('returns value between 30000 and 50000', () => {
        for (let i = 0; i < 100; i++) {
            const delay = gs.getSpawnDelay();
            expect(delay).toBeGreaterThanOrEqual(30000);
            expect(delay).toBeLessThanOrEqual(50000);
        }
    });
});

describe('GameState.updateAutonomousAnomalies', () => {
    it('calls updateAutonomousAnomaly for autonomous anomalies', () => {
        const anomaly = {
            category: 'autonomous',
            type: 'rocking_chair',
            target: { rotation: { x: 0 } },
            animationState: { phase: 0, direction: 1, speed: 1.5 },
        };
        const engine = makeEngine([anomaly]);
        const gs = new GameState(engine, makeSoundManager());

        gs.updateAutonomousAnomalies(0.1);

        // phase should have advanced
        expect(anomaly.animationState.phase).toBeCloseTo(0.15, 5);
    });

    it('does not update non-autonomous anomalies', () => {
        const anomaly = {
            category: 'object',
            type: 'displaced',
            animationState: { phase: 0 },
        };
        const engine = makeEngine([anomaly]);
        const gs = new GameState(engine, makeSoundManager());

        gs.updateAutonomousAnomalies(0.5);

        // phase should be unchanged
        expect(anomaly.animationState.phase).toBe(0);
    });

    it('handles empty anomaly list without error', () => {
        const gs = new GameState(makeEngine([]), makeSoundManager());
        expect(() => gs.updateAutonomousAnomalies(0.1)).not.toThrow();
    });

    it('updates spinning_fan rotation continuously', () => {
        const anomaly = {
            category: 'autonomous',
            type: 'spinning_fan',
            target: { rotation: { y: 0 } },
            animationState: { phase: 0, direction: 1, speed: 3.0 },
        };
        const gs = new GameState(makeEngine([anomaly]), makeSoundManager());
        gs.updateAutonomousAnomalies(0.1);
        expect(anomaly.target.rotation.y).toBeCloseTo(0.3, 5);
    });

    it('updates crawling_shadow position', () => {
        const ghost = { position: { x: 0 } };
        const anomaly = {
            category: 'autonomous',
            type: 'crawling_shadow',
            ghost,
            animationState: { phase: 0, direction: 1, speed: 0.8 },
        };
        const gs = new GameState(makeEngine([anomaly]), makeSoundManager());
        gs.updateAutonomousAnomalies(1.0);
        // phase = 0.8, sin(0.8) * 5 ≈ 3.588
        expect(anomaly.ghost.position.x).toBeCloseTo(Math.sin(0.8) * 5, 3);
    });
});
