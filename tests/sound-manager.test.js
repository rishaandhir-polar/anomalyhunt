import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoundManager } from '../src/core/sound-manager.js';

describe('SoundManager', () => {
    let sm, mockOsc, mockGain, mockCtx;

    beforeEach(() => {
        mockOsc = {
            type: '',
            frequency: { value: 0 },
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn()
        };

        mockGain = {
            gain: {
                value: 0,
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
                cancelScheduledValues: vi.fn(),
                linearRampToValueAtTime: vi.fn()
            },
            connect: vi.fn()
        };

        mockCtx = {
            currentTime: 0,
            destination: {},
            createOscillator: vi.fn(() => mockOsc),
            createGain: vi.fn(() => mockGain)
        };

        global.AudioContext = class {
            constructor() {
                return mockCtx;
            }
        };
        sm = new SoundManager();
    });

    it('initializes with null context', () => {
        expect(sm.ctx).toBeNull();
        expect(sm._ambient).toBeNull();
    });

    describe('init', () => {
        it('creates AudioContext and starts ambient', () => {
            sm.init();
            expect(sm.ctx).toBe(mockCtx);
            expect(mockCtx.createOscillator).toHaveBeenCalled();
            expect(mockOsc.start).toHaveBeenCalled();
        });

        it('does not reinitialize if already initialized', () => {
            sm.init();
            const firstCtx = sm.ctx;
            sm.init();
            expect(sm.ctx).toBe(firstCtx);
        });

        it('sets ambient oscillator to 52Hz sine wave', () => {
            sm.init();
            expect(mockOsc.type).toBe('sine');
            expect(mockOsc.frequency.value).toBe(52);
        });
    });

    describe('setAmbientTension', () => {
        it('does nothing if ambient not initialized', () => {
            sm.setAmbientTension(true);
            expect(mockGain.gain.linearRampToValueAtTime).not.toHaveBeenCalled();
        });

        it('raises ambient volume when on=true', () => {
            sm.init();
            sm.setAmbientTension(true);
            expect(mockGain.gain.cancelScheduledValues).toHaveBeenCalled();
            expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.06, expect.any(Number));
        });

        it('lowers ambient volume when on=false', () => {
            sm.init();
            sm.setAmbientTension(false);
            expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.025, expect.any(Number));
        });
    });

    describe('playAnomalySpawn', () => {
        it('does nothing if not initialized', () => {
            sm.playAnomalySpawn();
            expect(mockCtx.createOscillator).not.toHaveBeenCalled();
        });

        it('plays 900Hz triangle tone', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playAnomalySpawn();
            expect(mockOsc.type).toBe('triangle');
            expect(mockOsc.frequency.value).toBe(900);
        });
    });

    describe('playAlert', () => {
        it('plays two 880Hz square tones', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playAlert();
            expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
            expect(mockOsc.type).toBe('square');
            expect(mockOsc.frequency.value).toBe(880);
        });
    });

    describe('playSuccess', () => {
        it('plays ascending sine tones', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playSuccess();
            expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
        });
    });

    describe('playFail', () => {
        it('plays low sawtooth buzz', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playFail();
            expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
            expect(mockOsc.type).toBe('sawtooth');
        });
    });

    describe('playWin', () => {
        it('plays 4 ascending tones', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playWin();
            expect(mockCtx.createOscillator).toHaveBeenCalledTimes(4);
        });
    });

    describe('playLoss', () => {
        it('plays 4 descending tones', () => {
            sm.init();
            vi.clearAllMocks();
            sm.playLoss();
            expect(mockCtx.createOscillator).toHaveBeenCalledTimes(4);
            expect(mockOsc.type).toBe('sawtooth');
        });
    });
});
