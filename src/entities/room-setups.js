import * as THREE from 'three';
import { TextureFactory } from '../core/textures.js';

/**
 * Room furniture & decor setup functions.
 * Each receives the Room instance as `r` so they can call r.addObj / r.addRug / r.addPlant.
 * Kept as standalone exports so room.js stays under the 200-line cap.
 */

export function setupLivingRoom(r) {
    const bz = -r.dimensions.z / 2;

    r.addRug(0, 0, 8, 5);

    // Sofa — seat, backrest, arms (no overlap)
    r.addObj(new THREE.BoxGeometry(5.5, 1.0, 2.0), 0xdddddd, 0, 0.5, -2.5);
    r.addObj(new THREE.BoxGeometry(5.5, 1.6, 0.4), 0xdddddd, 0, 1.0, -3.4);
    r.addObj(new THREE.BoxGeometry(0.4, 1.0, 2.0), 0xbbbbbb, 2.95, 0.5, -2.5);
    r.addObj(new THREE.BoxGeometry(0.4, 1.0, 2.0), 0xbbbbbb, -2.95, 0.5, -2.5);

    // Coffee table — legs then top
    r.addObj(new THREE.BoxGeometry(2.4, 0.08, 1.4), 0x111111, 0, 0.86, 1.0);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, -1.1, 0.43, 0.55);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, 1.1, 0.43, 0.55);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, -1.1, 0.43, 1.45);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, 1.1, 0.43, 1.45);

    // Side cabinet + plant
    r.addObj(new THREE.BoxGeometry(1.6, 1.8, 1.2), 0xcca677, -4.3, 0.9, -2.5);
    r.addPlant(-4.3, 1.8, -2.0);

    // ── TV (facing sofa) ─────────────────────────────────────────────────────
    const tvZ = 4.0; // front of room, facing back
    r.addObj(new THREE.BoxGeometry(0.5, 0.9, 0.5), 0x111111, 0, 0.45, tvZ);          // stand
    r.addObj(new THREE.BoxGeometry(4.2, 2.4, 0.18), 0x111111, 0, 1.9, tvZ);          // bezel/body

    // Screen — stored for anomaly
    const tvMat = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: new THREE.Color(0, 0, 0), emissiveIntensity: 0 });
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.1, 0.05), tvMat);
    tvScreen.position.set(0, 1.9, tvZ - 0.09);
    tvScreen.castShadow = true;
    r.group.add(tvScreen);
    r.objects.push(tvScreen);
    r.tvScreen = tvScreen; // anomaly target

    // ── Painting (back wall, right side) ─────────────────────────────────────
    // Frame
    r.addObj(new THREE.BoxGeometry(2.2, 1.6, 0.06), 0x3b2a1a, 3.5, 3.8, bz + 0.08);
    // Canvas — stored for anomaly
    const paintMat = new THREE.MeshStandardMaterial({ color: 0x1a3a6b });
    const painting = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 0.05), paintMat);
    painting.position.set(3.5, 3.8, bz + 0.12);
    r.group.add(painting);
    r.objects.push(painting);
    r.painting = painting; // anomaly target
}

export function setupBedroom(r) {
    const bz = -r.dimensions.z / 2;

    r.addRug(0, 0, 7, 5);

    // Headboard — thin slab against back wall
    r.addObj(new THREE.BoxGeometry(4.6, 2.0, 0.2), 0xcca677, 0, 1.8, bz + 0.1);

    // Mattress
    r.addObj(
        new THREE.BoxGeometry(4.4, 0.9, 5.8),
        new THREE.MeshStandardMaterial({ map: TextureFactory.generateGrid(), color: 0xffffff }),
        0, 0.45, bz + 3.1
    );

    // Pillows (on top of mattress)
    r.addObj(new THREE.BoxGeometry(1.6, 0.2, 1.0), 0xffffff, -1.1, 1.0, bz + 0.8);
    r.addObj(new THREE.BoxGeometry(1.6, 0.2, 1.0), 0xffffff, 1.1, 1.0, bz + 0.8);

    // Nightstands
    r.addObj(new THREE.BoxGeometry(1.0, 0.9, 0.9), 0x111111, -3.2, 0.45, bz + 0.95);
    r.addObj(new THREE.BoxGeometry(1.0, 0.9, 0.9), 0x111111, 3.2, 0.45, bz + 0.95);

    r.addPlant(3.2, 0, 4.0);
}

export function setupKitchen(r) {
    const W = r.dimensions.x;
    const bz = -r.dimensions.z / 2;

    r.addRug(0, 0, 7, 3);

    // Tile backsplash — flat plane 5cm off wall
    const tilePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.05, 1.5),
        new THREE.MeshStandardMaterial({ map: TextureFactory.generateTiles() })
    );
    tilePlane.position.set(0, 2.25, bz + 0.05);
    r.group.add(tilePlane);

    const CAB_H = 1.5, CAB_D = 1.5;

    // Left + right cabinet sections (gap for stove)
    const cw = W / 2 - 1.25 - 0.1;
    r.addObj(new THREE.BoxGeometry(cw, CAB_H, CAB_D), 0xffffff, -(cw / 2 + 1.35), CAB_H / 2, bz + CAB_D / 2);
    r.addObj(new THREE.BoxGeometry(cw, CAB_H, CAB_D), 0xffffff, cw / 2 + 1.35, CAB_H / 2, bz + CAB_D / 2);

    // Stove (fills gap exactly)
    r.addObj(new THREE.BoxGeometry(2.5, CAB_H, CAB_D), 0x222222, 0, CAB_H / 2, bz + CAB_D / 2);

    // Countertop slab ON TOP of cabinets
    const CT_H = 0.12;
    r.addObj(new THREE.BoxGeometry(W, CT_H, CAB_D + 0.15), 0xcca677, 0, CAB_H + CT_H / 2, bz + (CAB_D + 0.15) / 2);

    // Stove burners ON TOP of countertop
    const burnerY = CAB_H + CT_H + 0.03;
    [[-0.6, bz + 0.5], [0.6, bz + 0.5], [-0.6, bz + 1.1], [0.6, bz + 1.1]].forEach(([bx, bzp]) => {
        r.addObj(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16), 0x111111, bx, burnerY, bzp);
    });

    // Vent hood above stove
    r.addObj(new THREE.BoxGeometry(2.5, 3.0, 1.2), 0x999999, 0, CAB_H + CT_H + 1.5 + 1.5, bz + 0.75);

    // Kettle + sink
    r.addObj(new THREE.CylinderGeometry(0.25, 0.3, 0.6), 0x111111, -2.5, CAB_H + CT_H + 0.3, bz + 0.9);
    r.addObj(new THREE.BoxGeometry(1.4, 0.08, 1.0), 0x555555, 3.0, CAB_H + CT_H + 0.04, bz + 0.8);

    r.addPlant(4.5, 0, 1.5);
}

export function setupOffice(r) {
    r.addRug(0, 0, 6, 5);

    // Desk — legs then top
    const DESK_H = 1.4;
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, -2.3, DESK_H / 2, -2.6);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, 2.3, DESK_H / 2, -2.6);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, -2.3, DESK_H / 2, -1.0);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, 2.3, DESK_H / 2, -1.0);
    r.addObj(new THREE.BoxGeometry(4.7, 0.1, 1.7), 0xcca677, 0, DESK_H + 0.05, -1.8);

    // Monitor — base, neck, screen
    const monBaseY = DESK_H + 0.1;
    r.addObj(new THREE.BoxGeometry(0.8, 0.08, 0.6), 0x111111, 0, monBaseY + 0.04, -2.4);
    r.addObj(new THREE.BoxGeometry(0.1, 0.8, 0.1), 0x111111, 0, monBaseY + 0.48, -2.4);
    r.addObj(new THREE.BoxGeometry(2.0, 1.2, 0.08), 0x111111, 0, monBaseY + 1.48, -2.4);

    // Chair — seat, back, four legs
    r.addObj(new THREE.BoxGeometry(1.4, 0.1, 1.4), 0x333333, 0, 0.9, 0.0);
    r.addObj(new THREE.BoxGeometry(1.4, 1.8, 0.1), 0x333333, 0, 1.8, 0.65);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, -0.6, 0.45, -0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, 0.6, 0.45, -0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, -0.6, 0.45, 0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, 0.6, 0.45, 0.6);

    r.addPlant(-3.5, 0, 0);
    r.addPlant(3.5, 0, -2.5);
}

export function setupBathroom(r) {
    const W = r.dimensions.x;
    const bz = -r.dimensions.z / 2;

    r.addRug(0.5, 0, 4, 2.5);

    // Tile backsplash — flat plane 5cm off wall
    const tilePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.05, 1.8),
        new THREE.MeshStandardMaterial({ map: TextureFactory.generateTiles() })
    );
    tilePlane.position.set(0, 2.2, bz + 0.05);
    r.group.add(tilePlane);

    // Vanity — legs, body, countertop
    const VAN_H = 1.5, VAN_W = 3.5, VAN_D = 1.5, VAN_X = 1.2;
    [[VAN_X - VAN_W / 2 + 0.1, bz + 0.1], [VAN_X + VAN_W / 2 - 0.1, bz + 0.1],
    [VAN_X - VAN_W / 2 + 0.1, bz + VAN_D - 0.1], [VAN_X + VAN_W / 2 - 0.1, bz + VAN_D - 0.1]
    ].forEach(([lx, lz]) => r.addObj(new THREE.BoxGeometry(0.1, 0.3, 0.1), 0xeeeeee, lx, 0.15, lz));

    r.addObj(new THREE.BoxGeometry(VAN_W, VAN_H - 0.3, VAN_D), 0xffffff, VAN_X, 0.3 + (VAN_H - 0.3) / 2, bz + VAN_D / 2);
    r.addObj(new THREE.BoxGeometry(VAN_W + 0.2, 0.1, VAN_D + 0.1), 0xffffff, VAN_X, VAN_H + 0.05, bz + VAN_D / 2);

    // Toilet — pedestal, seat, tank
    const TX = -2.0;
    r.addObj(new THREE.CylinderGeometry(0.4, 0.45, 1.0, 16), 0xffffff, TX, 0.5, bz + 1.5);
    r.addObj(new THREE.BoxGeometry(1.0, 0.14, 1.0), 0xffffff, TX, 1.07, bz + 1.5);
    r.addObj(new THREE.BoxGeometry(1.0, 0.9, 0.5), 0xffffff, TX, 0.9, bz + 0.35);

    r.addPlant(-2.0, 1.0, bz + 0.6);
}

export function setupHallway(r) {
    r.addObj(new THREE.BoxGeometry(0.15, 3.0, 1.8), 0x442200, -r.dimensions.x / 2 + 0.15, 1.5, 0);
}
