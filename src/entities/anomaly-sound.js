/**
 * Sound triggering for anomaly events.
 * Extracted from AnomalyManager to keep anomaly.js under the 200-line cap.
 */

/**
 * Play a positional sound for the given anomaly.
 * @param {object} soundManager
 * @param {object} anomaly
 * @param {object|null} cameraPosition
 */
export function playSoundForAnomaly(soundManager, anomaly, cameraPosition = null) {
    if (!soundManager || !soundManager.ctx) return;

    // Distance-based volume falloff (max 20 units)
    let volume = 0.15;
    if (cameraPosition && anomaly.target && anomaly.target.position) {
        const dx = anomaly.target.position.x - cameraPosition.x;
        const dy = (anomaly.target.position.y || 0) - (cameraPosition.y || 0);
        const dz = (anomaly.target.position.z || 0) - (cameraPosition.z || 0);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        volume = Math.max(0, 1 - dist / 20) * 0.2;
    }

    switch (anomaly.type) {
        case 'phone_ringing':
            soundManager._tone(880, 'square', 0.3, volume, 0);
            soundManager._tone(660, 'square', 0.3, volume, 0.4);
            break;
        case 'dripping_faucet':
            soundManager._tone(1200, 'sine', 0.05, volume * 0.5, 0);
            break;
        case 'radio_static':
            soundManager._tone(300, 'sawtooth', 0.2, volume * 0.3, 0);
            break;
        case 'door_ajar':
            soundManager._tone(150, 'sawtooth', 0.4, volume * 0.6, 0);
            break;
        case 'rocking_chair':
            soundManager._tone(200, 'triangle', 0.3, volume * 0.4, 0);
            break;
        default:
            break;
    }
}
