import * as THREE from 'three';

export const AUTONOMOUS_ANOMALY_TYPES = [
    'rocking_chair',
    'spinning_fan',
    'dripping_faucet',
    'swinging_light',
    'crawling_shadow'
];

export function applyAutonomousAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'rocking_chair': {
            const target = room.rockingChair || anomaly.target;
            if (!target) return false;
            anomaly.target = target;
            anomaly.animationState = { phase: 0, direction: 1, speed: 1.5 };
            break;
        }

        case 'spinning_fan': {
            const target = room.ceilingFan || anomaly.target;
            if (!target) return false;
            anomaly.target = target;
            anomaly.animationState = { phase: 0, direction: 1, speed: 3.0 };
            break;
        }

        case 'dripping_faucet': {
            if (!room.faucet) return false;
            anomaly.target = room.faucet;
            anomaly.animationState = { phase: 0, direction: 1, speed: 1.0 };
            break;
        }

        case 'swinging_light': {
            if (!room.light) return false;
            anomaly.target = room.light;
            anomaly.originalState = { pos: room.light.position.clone() };
            anomaly.animationState = { phase: 0, direction: 1, speed: 1.2 };
            break;
        }

        case 'crawling_shadow': {
            const ghost = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.05, 1),
                new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.7 })
            );
            room.group.add(ghost);
            anomaly.ghost = ghost;
            anomaly.animationState = { phase: 0, direction: 1, speed: 0.8 };
            break;
        }

        default:
            return false;
    }
    return true;
}

export function resolveAutonomousAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'rocking_chair':
            if (anomaly.target) anomaly.target.rotation.x = 0;
            break;

        case 'spinning_fan':
            if (anomaly.target) anomaly.target.rotation.y = 0;
            break;

        case 'dripping_faucet':
            break;

        case 'swinging_light':
            if (room.light && anomaly.originalState) {
                room.light.position.copy(anomaly.originalState.pos);
            }
            break;

        case 'crawling_shadow':
            if (anomaly.ghost) room.group.remove(anomaly.ghost);
            break;
    }
}

export function updateAutonomousAnomaly(anomaly, deltaTime) {
    if (!anomaly.animationState || typeof anomaly.animationState.phase !== 'number') {
        console.warn('updateAutonomousAnomaly: invalid animationState, resetting', anomaly.type);
        anomaly.animationState = { phase: 0, direction: 1, speed: 1.0 };
    }

    const state = anomaly.animationState;

    switch (anomaly.type) {
        case 'rocking_chair':
            state.phase += deltaTime * state.speed;
            if (anomaly.target) anomaly.target.rotation.x = Math.sin(state.phase) * 0.15;
            break;

        case 'spinning_fan':
            state.phase += deltaTime * state.speed;
            if (anomaly.target) anomaly.target.rotation.y = state.phase;
            break;

        case 'dripping_faucet':
            state.phase += deltaTime;
            if (state.phase >= 2.0) {
                // spawn water drop effect (visual placeholder)
                state.phase = 0;
            }
            break;

        case 'swinging_light':
            state.phase += deltaTime * state.speed;
            if (anomaly.target) anomaly.target.rotation.z = Math.sin(state.phase) * 0.3;
            break;

        case 'crawling_shadow':
            state.phase += deltaTime * state.speed;
            if (anomaly.ghost) anomaly.ghost.position.x = Math.sin(state.phase) * 5;
            break;
    }
}
