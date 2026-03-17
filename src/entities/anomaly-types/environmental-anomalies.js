import * as THREE from 'three';

export const ENVIRONMENTAL_ANOMALY_TYPES = [
    'temperature_drop',
    'fog_room',
    'red_tint',
    'gravity_shift',
    'time_freeze',
    'static_noise',
    'light'
];

export function applyEnvironmentalAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'temperature_drop':
            anomaly.originalState = {
                color: room.light.color.getHex(),
                intensity: room.light.intensity
            };
            room.light.color.setHex(0x88ccff);  // strong icy blue
            room.light.intensity *= 0.4;         // much dimmer — clearly noticeable
            break;

        case 'fog_room':
            anomaly.originalState = { intensity: room.light.intensity };
            room.light.intensity = 0.05;
            break;

        case 'red_tint':
            anomaly.originalState = { color: room.light.color.getHex(), intensity: room.light.intensity };
            room.light.color.setHex(0xff0000);
            room.light.intensity *= 2.0;  // brighter red — hard to miss
            break;

        case 'gravity_shift': {
            if (!room.objects || room.objects.length === 0) return false;
            // Only lift floor-level objects (y < 1.5) so the effect is obvious
            const candidates = room.objects.filter(o => o.position.y < 1.5 && o.position.y > 0.05);
            const target = candidates.length > 0
                ? candidates[Math.floor(Math.random() * candidates.length)]
                : room.objects[Math.floor(Math.random() * room.objects.length)];
            anomaly.target = target;
            anomaly.originalState = { pos: target.position.clone() };
            target.position.y += 2.5;  // float at eye level — very visible
            break;
        }

        case 'time_freeze':
            anomaly.originalState = { frozen: false };
            anomaly.frozen = true;
            console.log('[Anomaly] time_freeze applied — room frozen');
            break;

        case 'static_noise':
            anomaly.originalState = {
                intensity: room.light.intensity,
                color: room.light.color.getHex()
            };
            // Rapid flicker effect: alternate between bright white and near-dark
            room.light.color.setHex(0xffffff);
            room.light.intensity = 8;  // bright flash — distinct from fog
            break;

        case 'light':
            anomaly.originalState = {
                intensity: room.light.intensity,
                color: room.light.color.getHex()
            };
            if (Math.random() > 0.5) {
                room.light.intensity = 0;
            } else {
                room.light.intensity = 5;
                room.light.color.setHex(0xff00ff);
            }
            break;
    }
    return true;
}

export function resolveEnvironmentalAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'temperature_drop':
            room.light.color.setHex(anomaly.originalState.color);
            room.light.intensity = anomaly.originalState.intensity;
            break;

        case 'fog_room':
            room.light.intensity = anomaly.originalState.intensity;
            break;

        case 'red_tint':
            room.light.color.setHex(anomaly.originalState.color);
            break;

        case 'gravity_shift':
            if (anomaly.target) anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'time_freeze':
            anomaly.frozen = false;
            break;

        case 'static_noise':
            room.light.intensity = anomaly.originalState.intensity;
            room.light.color.setHex(anomaly.originalState.color);
            break;

        case 'light':
            room.light.intensity = anomaly.originalState.intensity;
            room.light.color.setHex(anomaly.originalState.color);
            break;
    }
}
