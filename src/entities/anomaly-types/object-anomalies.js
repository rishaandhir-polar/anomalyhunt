import * as THREE from 'three';

export const OBJECT_ANOMALY_TYPES = [
    'displaced',
    'extra',
    'missing',
    'painting',
    'tv',
    'chair_floor',
    'books_floating',
    'lamp_flickering',
    'cushion_displaced',
    'door_ajar',
    'curtains_moving',
    'mirror_reflection'
];

export function applyObjectAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'displaced': {
            // Only displace floor-level objects (y center < 1.5) to avoid
            // wall-mounted items (mirrors, paintings, curtains) floating mid-air
            const floorObjs = room.objects.filter(o => o.position.y < 1.5);
            const target = floorObjs.length > 0
                ? floorObjs[Math.floor(Math.random() * floorObjs.length)]
                : anomaly.target;
            anomaly.target = target;
            anomaly.originalState = { pos: target.position.clone() };
            target.position.x += (Math.random() > 0.5 ? 3 : -3);
            target.position.z += (Math.random() > 0.5 ? 2 : -2);
            break;
        }

        case 'extra': {
            const ghost = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 1.8, 0.8),
                new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.85 })
            );
            ghost.position.set(
                (Math.random() - 0.5) * 4,
                0.9,
                (Math.random() - 0.5) * 4
            );
            room.group.add(ghost);
            anomaly.ghost = ghost;
            break;
        }

        case 'missing':
            anomaly.target.visible = false;
            break;

        case 'painting':
            if (!room.painting) return false;
            anomaly.originalState = { color: room.painting.material.color.getHex() };
            const paintColors = [0xff2222, 0x22ff22, 0xff8800, 0xaa00ff, 0x00ffee];
            room.painting.material.color.setHex(
                paintColors[Math.floor(Math.random() * paintColors.length)]
            );
            break;

        case 'tv':
            if (!room.tvScreen) return false;
            anomaly.originalState = {
                color: room.tvScreen.material.color.getHex(),
                emissiveIntensity: room.tvScreen.material.emissiveIntensity,
            };
            room.tvScreen.material.color.setHex(0x99bbff);
            room.tvScreen.material.emissive.setHex(0x4466cc);
            room.tvScreen.material.emissiveIntensity = 1.8;
            break;

        case 'chair_floor':
            anomaly.originalState = { rotation: anomaly.target.rotation.clone() };
            anomaly.target.rotation.z = Math.PI / 2;
            break;

        case 'books_floating':
            if (!room.books || room.books.length === 0) return false;
            anomaly.target = room.books[0];
            anomaly.originalState = { pos: anomaly.target.position.clone() };
            anomaly.target.position.y += 1.5;
            break;

        case 'lamp_flickering':
            if (!room.lamp) return false;
            anomaly.target = room.lamp;
            anomaly.originalState = { visible: anomaly.target.visible };
            break;

        case 'cushion_displaced':
            if (!room.cushions || room.cushions.length === 0) return false;
            anomaly.target = room.cushions[0];
            anomaly.originalState = { pos: anomaly.target.position.clone() };
            anomaly.target.position.y = 0.1;
            break;

        case 'door_ajar':
            anomaly.originalState = { rotation: anomaly.target.rotation.clone() };
            anomaly.target.rotation.y = Math.PI / 6;
            break;

        case 'curtains_moving':
            if (!room.curtains) return false;
            anomaly.target = room.curtains;
            anomaly.originalState = { pos: anomaly.target.position.clone() };
            break;

        case 'mirror_reflection':
            if (!room.mirror) return false;
            anomaly.target = room.mirror;
            anomaly.originalState = { color: anomaly.target.material.color.getHex() };
            anomaly.target.material.color.setHex(0xff0000);
            break;
    }
    return true;
}

export function resolveObjectAnomaly(room, anomaly) {
    switch (anomaly.type) {
        case 'displaced':
            anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'extra':
            if (anomaly.ghost) room.group.remove(anomaly.ghost);
            break;

        case 'missing':
            anomaly.target.visible = true;
            break;

        case 'painting':
            if (room.painting) room.painting.material.color.setHex(anomaly.originalState.color);
            break;

        case 'tv':
            if (room.tvScreen) {
                room.tvScreen.material.color.setHex(anomaly.originalState.color);
                room.tvScreen.material.emissive.setHex(0x000000);
                room.tvScreen.material.emissiveIntensity = anomaly.originalState.emissiveIntensity;
            }
            break;

        case 'chair_floor':
            anomaly.target.rotation.copy(anomaly.originalState.rotation);
            break;

        case 'books_floating':
            if (anomaly.target) anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'lamp_flickering':
            if (anomaly.target) anomaly.target.visible = anomaly.originalState.visible;
            break;

        case 'cushion_displaced':
            if (anomaly.target) anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'door_ajar':
            anomaly.target.rotation.copy(anomaly.originalState.rotation);
            break;

        case 'curtains_moving':
            if (anomaly.target) anomaly.target.position.copy(anomaly.originalState.pos);
            break;

        case 'mirror_reflection':
            if (anomaly.target) anomaly.target.material.color.setHex(anomaly.originalState.color);
            break;
    }
}
