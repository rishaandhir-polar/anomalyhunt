/**
 * SoundManager — synthesised sounds via Web Audio API.
 * No external files needed. Must call init() after a user gesture.
 */
export class SoundManager {
    constructor() {
        this.ctx = null;
        this._ambient = null;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new AudioContext();
        this._startAmbient();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    _tone(freq, type = 'sine', duration = 0.3, volume = 0.3, startDelay = 0) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime + startDelay;
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + duration + 0.05);
    }

    _startAmbient() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 52; // low creepy hum
        gain.gain.value = 0.025;
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        this._ambient = { osc, gain };
    }

    // Slowly raise/lower ambient volume to hint that something is wrong
    setAmbientTension(on) {
        if (!this._ambient) return;
        const { gain } = this._ambient;
        gain.gain.cancelScheduledValues(this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(on ? 0.06 : 0.025, this.ctx.currentTime + 2);
    }

    // ── Public sounds ─────────────────────────────────────────────────────────

    playAnomalySpawn() {
        // Quiet click / creak — barely perceptible
        this._tone(900, 'triangle', 0.08, 0.06);
    }

    playAlert() {
        // Two short sharp beeps
        this._tone(880, 'square', 0.12, 0.12, 0);
        this._tone(880, 'square', 0.12, 0.12, 0.25);
    }

    playSuccess() {
        // Soft ascending confirmation
        this._tone(440, 'sine', 0.18, 0.25, 0);
        this._tone(660, 'sine', 0.18, 0.25, 0.18);
    }

    playFail() {
        // Low harsh buzz — wrong report
        this._tone(200, 'sawtooth', 0.35, 0.2, 0);
        this._tone(180, 'sawtooth', 0.35, 0.2, 0.05);
    }

    playWin() {
        [440, 550, 660, 880].forEach((f, i) =>
            this._tone(f, 'sine', 0.3, 0.28, i * 0.15)
        );
    }

    playLoss() {
        [440, 330, 220, 110].forEach((f, i) =>
            this._tone(f, 'sawtooth', 0.5, 0.2, i * 0.22)
        );
    }
}
