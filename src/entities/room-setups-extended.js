import * as THREE from 'three';
import { TextureFactory } from '../core/textures.js';

/**
 * Extended room setup functions: Office, Bathroom, Hallway (enhanced),
 * plus future rooms (Basement, Attic, Garage, Nursery) added in task 5.
 */

export function setupOffice(r) {
    r.addRug(0, 0, 6, 5);

    // Desk — legs then top
    const DESK_H = 1.4;
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, -2.3, DESK_H / 2, -2.6);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, 2.3, DESK_H / 2, -2.6);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, -2.3, DESK_H / 2, -1.0);
    r.addObj(new THREE.BoxGeometry(0.08, DESK_H, 0.08), 0xcca677, 2.3, DESK_H / 2, -1.0);
    r.addObj(new THREE.BoxGeometry(4.7, 0.1, 1.7), 0xcca677, 0, DESK_H + 0.05, -1.8);

    // Monitor — base, neck, screen (screen assigned to r.monitor)
    const monBaseY = DESK_H + 0.1;
    r.addObj(new THREE.BoxGeometry(0.8, 0.08, 0.6), 0x111111, 0, monBaseY + 0.04, -2.4);
    r.addObj(new THREE.BoxGeometry(0.1, 0.8, 0.1), 0x111111, 0, monBaseY + 0.48, -2.4);
    const monScreen = r.addObj(new THREE.BoxGeometry(2.0, 1.2, 0.08), 0x111111, 0, monBaseY + 1.48, -2.4);
    r.monitor = monScreen;

    // Chair — seat, back, four legs
    r.addObj(new THREE.BoxGeometry(1.4, 0.1, 1.4), 0x333333, 0, 0.9, 0.0);
    r.addObj(new THREE.BoxGeometry(1.4, 1.8, 0.1), 0x333333, 0, 1.8, 0.65);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, -0.6, 0.45, -0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, 0.6, 0.45, -0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, -0.6, 0.45, 0.6);
    r.addObj(new THREE.BoxGeometry(0.1, 0.9, 0.1), 0x222222, 0.6, 0.45, 0.6);

    // Bookshelf on wall (new, anomaly target)
    const bookshelf = r.addObj(new THREE.BoxGeometry(1.2, 3.5, 0.4), 0xcca677, -r.dimensions.x / 2 + 0.6, 1.75, -2.0);
    r.bookshelf = bookshelf;

    // Desk lamp on desk (new, anomaly target)
    const deskLamp = r.addObj(new THREE.CylinderGeometry(0.08, 0.08, 0.8), 0x333333, 1.8, DESK_H + 0.5, -2.2);
    r.deskLamp = deskLamp;

    // Filing cabinet (new, anomaly target)
    const filingCabinet = r.addObj(new THREE.BoxGeometry(0.8, 1.8, 1.0), 0x888888, r.dimensions.x / 2 - 0.8, 0.9, -2.5);
    r.filingCabinet = filingCabinet;

    // Ceiling fan (new, anomaly target)
    const ceilingFan = r.addObj(new THREE.CylinderGeometry(1.2, 1.2, 0.1), 0x555555, 0, r.dimensions.y - 0.2, 0);
    r.ceilingFan = ceilingFan;

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

    // Mirror above vanity (new, anomaly target)
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xccddff });
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(VAN_W, 1.4, 0.06), mirrorMat);
    mirror.position.set(VAN_X, VAN_H + 1.0, bz + 0.1);
    r.group.add(mirror);
    r.objects.push(mirror);
    r.mirror = mirror;

    // Faucet above sink (new, anomaly target)
    const faucet = r.addObj(new THREE.CylinderGeometry(0.04, 0.04, 0.5), 0x888888, VAN_X, VAN_H + 0.35, bz + 0.4);
    r.faucet = faucet;

    // Shower curtain (new, anomaly target)
    const scMat = new THREE.MeshStandardMaterial({ color: 0xddddff });
    const showerCurtain = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.5, 2.0), scMat);
    showerCurtain.position.set(-W / 2 + 0.1, 1.5, 1.5);
    r.group.add(showerCurtain);
    r.objects.push(showerCurtain);
    r.showerCurtain = showerCurtain;

    // Towels (new, anomaly targets)
    const t1 = r.addObj(new THREE.BoxGeometry(0.8, 0.06, 0.4), 0xff9999, W / 2 - 0.3, 2.5, 0.5);
    const t2 = r.addObj(new THREE.BoxGeometry(0.8, 0.06, 0.4), 0x99ff99, W / 2 - 0.3, 2.8, 0.5);
    const t3 = r.addObj(new THREE.BoxGeometry(0.8, 0.06, 0.4), 0x9999ff, W / 2 - 0.3, 3.1, 0.5);
    r.towels = [t1, t2, t3];

    // Toilet — pedestal, seat, tank
    const TX = -2.0;
    r.addObj(new THREE.CylinderGeometry(0.4, 0.45, 1.0, 16), 0xffffff, TX, 0.5, bz + 1.5);
    r.addObj(new THREE.BoxGeometry(1.0, 0.14, 1.0), 0xffffff, TX, 1.07, bz + 1.5);
    r.addObj(new THREE.BoxGeometry(1.0, 0.9, 0.5), 0xffffff, TX, 0.9, bz + 0.35);

    r.addPlant(-2.0, 1.0, bz + 0.6);
}

export function setupHallway(r) {
    // Original decorative element
    r.addObj(new THREE.BoxGeometry(0.15, 3.0, 1.8), 0x442200, -r.dimensions.x / 2 + 0.15, 1.5, 0);

    // Coat rack (new, anomaly target)
    const coatRack = r.addObj(new THREE.CylinderGeometry(0.06, 0.06, 2.2), 0x333333, r.dimensions.x / 2 - 0.5, 1.1, -r.dimensions.z / 2 + 0.5);
    r.coatRack = coatRack;

    // Shoe rack (new, anomaly target)
    const shoeRack = r.addObj(new THREE.BoxGeometry(1.2, 0.4, 0.5), 0x8b6914, r.dimensions.x / 2 - 0.8, 0.2, -r.dimensions.z / 2 + 0.5);
    r.shoeRack = shoeRack;

    // Wall photos (new, anomaly targets)
    const p1 = r.addObj(new THREE.BoxGeometry(0.5, 0.4, 0.04), 0x222222, -1.0, 3.5, -r.dimensions.z / 2 + 0.1);
    const p2 = r.addObj(new THREE.BoxGeometry(0.5, 0.4, 0.04), 0x222222, 0, 3.5, -r.dimensions.z / 2 + 0.1);
    const p3 = r.addObj(new THREE.BoxGeometry(0.5, 0.4, 0.04), 0x222222, 1.0, 3.5, -r.dimensions.z / 2 + 0.1);
    r.wallPhotos = [p1, p2, p3];

    // Console table (new, anomaly target)
    const consoleTable = r.addObj(new THREE.BoxGeometry(1.5, 0.9, 0.5), 0xcca677, 0, 0.45, -r.dimensions.z / 2 + 0.5);
    r.consoleTable = consoleTable;
}
