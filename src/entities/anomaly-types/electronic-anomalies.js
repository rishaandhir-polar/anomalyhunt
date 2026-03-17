import * as THREE from 'three';

export const ELECTRONIC_ANOMALY_TYPES = [
    'tv_on_empty_room',
    'monitor_glitch',
    'phone_ringing',
    'radio_static',
    'all_electronics_on'
];

export function applyElectronicAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'tv_on_empty_room':
            if (!room.tvScreen) return false;
            anomaly.originalState = {
                color: room.tvScreen.material.color.getHex(),
                emissiveIntensity: room.tvScreen.material.emissiveIntensity
            };
            room.tvScreen.material.color.setHex(0x99bbff);
            room.tvScreen.material.emissive.setHex(0x4466cc);
            room.tvScreen.material.emissiveIntensity = 2.5;
            break;

        case 'monitor_glitch':
            if (!room.monitor) return false;
            anomaly.originalState = { color: room.monitor.material.color.getHex() };
            room.monitor.material.color.setHex(0x00ff00);
            break;

        case 'phone_ringing':
            anomaly.target = room.objects[Math.floor(Math.random() * room.objects.length)];
            anomaly.originalState = { pos: anomaly.target.position.clone() };
            anomaly.target.position.x += 0.1;
            break;

        case 'radio_static':
            anomaly.originalState = { intensity: room.light.intensity };
            room.light.intensity = 0.8;
            break;

        case 'all_electronics_on':
            anomaly.originalState = {
                tvColor: room.tvScreen?.material.color.getHex(),
                tvEmissive: room.tvScreen?.material.emissiveIntensity
            };
            if (room.tvScreen) {
                room.tvScreen.material.color.setHex(0x99bbff);
                room.tvScreen.material.emissive.setHex(0x4466cc);
                room.tvScreen.material.emissiveIntensity = 1.5;
            }
            break;

        default:
            return false;
    }
    return true;
}

export function resolveElectronicAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'tv_on_empty_room':
            if (room.tvScreen) {
                room.tvScreen.material.color.setHex(anomaly.originalState.color);
                room.tvScreen.material.emissive.setHex(0x000000);
                room.tvScreen.material.emissiveIntensity = anomaly.originalState.emissiveIntensity;
            }
            break;

        case 'monitor_glitch':
            if (room.monitor) room.monitor.material.color.setHex(anomaly.originalState.color);
            break;

        case 'phone_ringing':
            if (anomaly.target) anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'radio_static':
            if (room.light) room.light.intensity = anomaly.originalState.intensity;
            break;

        case 'all_electronics_on':
            if (room.tvScreen && anomaly.originalState.tvColor != null) {
                room.tvScreen.material.color.setHex(anomaly.originalState.tvColor);
                room.tvScreen.material.emissive.setHex(0x000000);
                room.tvScreen.material.emissiveIntensity = anomaly.originalState.tvEmissive;
            }
            break;
    }
}
