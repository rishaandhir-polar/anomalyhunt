import * as THREE from 'three';
import { TextureFactory } from '../core/textures.js';

/**
 * Room furniture & decor setup functions (living room, bedroom).
 * setupKitchen lives in room-setups-new.js.
 * setupOffice, setupBathroom, setupHallway live in room-setups-extended.js.
 */

export function setupLivingRoom(r) {
    const bz = -r.dimensions.z / 2;

    r.addRug(0, 0, 8, 5);

    // Sofa — seat, backrest, arms
    r.addObj(new THREE.BoxGeometry(5.5, 1.0, 2.0), 0xdddddd, 0, 0.5, -2.5);
    r.addObj(new THREE.BoxGeometry(5.5, 1.6, 0.4), 0xdddddd, 0, 1.0, -3.4);
    r.addObj(new THREE.BoxGeometry(0.4, 1.0, 2.0), 0xbbbbbb, 2.95, 0.5, -2.5);
    r.addObj(new THREE.BoxGeometry(0.4, 1.0, 2.0), 0xbbbbbb, -2.95, 0.5, -2.5);

    // Sofa cushions (anomaly targets)
    const cushion1 = r.addObj(new THREE.BoxGeometry(1.2, 0.3, 1.2), 0xcccccc, -1.5, 1.15, -2.5);
    const cushion2 = r.addObj(new THREE.BoxGeometry(1.2, 0.3, 1.2), 0xcccccc, 0, 1.15, -2.5);
    const cushion3 = r.addObj(new THREE.BoxGeometry(1.2, 0.3, 1.2), 0xcccccc, 1.5, 1.15, -2.5);
    r.cushions = [cushion1, cushion2, cushion3];

    // Coffee table
    r.addObj(new THREE.BoxGeometry(2.4, 0.08, 1.4), 0x111111, 0, 0.86, 1.0);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, -1.1, 0.43, 0.55);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, 1.1, 0.43, 0.55);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, -1.1, 0.43, 1.45);
    r.addObj(new THREE.BoxGeometry(0.08, 0.86, 0.08), 0x111111, 1.1, 0.43, 1.45);

    // Books on coffee table (anomaly target)
    const book1 = r.addObj(new THREE.BoxGeometry(0.4, 0.05, 0.6), 0x8b0000, -0.5, 0.92, 1.0);
    const book2 = r.addObj(new THREE.BoxGeometry(0.4, 0.05, 0.6), 0x00008b, 0, 0.92, 1.0);
    const book3 = r.addObj(new THREE.BoxGeometry(0.4, 0.05, 0.6), 0x006400, 0.5, 0.92, 1.0);
    r.books = [book1, book2, book3];

    // Side cabinet + plant
    r.addObj(new THREE.BoxGeometry(1.6, 1.8, 1.2), 0xcca677, -4.3, 0.9, -2.5);
    r.addPlant(-4.3, 1.8, -2.0);

    // Side table near sofa (new)
    r.addObj(new THREE.BoxGeometry(0.8, 0.7, 0.8), 0xcca677, 3.8, 0.35, -2.5);

    // Floor lamp (anomaly target)
    const lampPole = r.addObj(new THREE.CylinderGeometry(0.05, 0.05, 3.5), 0x222222, 4.5, 1.75, -3.0);
    const lampShade = r.addObj(new THREE.CylinderGeometry(0.6, 0.4, 0.8), 0xffffcc, 4.5, 3.6, -3.0);
    r.lamp = { pole: lampPole, shade: lampShade };

    // Wall clock (anomaly target)
    const clock = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 0.1), 0x333333, -3.0, 4.5, bz + 0.1);
    r.clock = clock;

    // Curtains on side wall (new, anomaly target)
    const curtainsMat = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
    const curtains = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.0, 3.0), curtainsMat);
    curtains.position.set(-r.dimensions.x / 2 + 0.1, 2.5, 0);
    r.group.add(curtains);
    r.objects.push(curtains);
    r.curtains = curtains;

    // Mirror on wall (new, anomaly target)
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xccddff });
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.06), mirrorMat);
    mirror.position.set(r.dimensions.x / 2 - 0.1, 2.5, 1.0);
    r.group.add(mirror);
    r.objects.push(mirror);
    r.mirror = mirror;

    // TV setup
    const tvZ = 4.0;
    r.addObj(new THREE.BoxGeometry(0.5, 0.9, 0.5), 0x111111, 0, 0.45, tvZ);
    r.addObj(new THREE.BoxGeometry(4.2, 2.4, 0.18), 0x111111, 0, 1.9, tvZ);

    const tvMat = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: new THREE.Color(0, 0, 0), emissiveIntensity: 0 });
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.1, 0.05), tvMat);
    tvScreen.position.set(0, 1.9, tvZ - 0.09);
    tvScreen.castShadow = true;
    r.group.add(tvScreen);
    r.objects.push(tvScreen);
    r.tvScreen = tvScreen;

    // Painting (back wall)
    r.addObj(new THREE.BoxGeometry(2.2, 1.6, 0.06), 0x3b2a1a, 3.5, 3.8, bz + 0.08);
    const paintMat = new THREE.MeshStandardMaterial({ color: 0x1a3a6b });
    const painting = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 0.05), paintMat);
    painting.position.set(3.5, 3.8, bz + 0.12);
    r.group.add(painting);
    r.objects.push(painting);
    r.painting = painting;

    // Second painting (anomaly target)
    r.addObj(new THREE.BoxGeometry(1.8, 1.4, 0.06), 0x3b2a1a, -3.5, 3.8, bz + 0.08);
    const paint2Mat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const painting2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.05), paint2Mat);
    painting2.position.set(-3.5, 3.8, bz + 0.12);
    r.group.add(painting2);
    r.objects.push(painting2);
    r.painting2 = painting2;
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

    // Nightstand lamps (new, anomaly targets)
    const nsLamp1 = r.addObj(new THREE.CylinderGeometry(0.12, 0.12, 0.6), 0xffffcc, -3.2, 1.2, bz + 0.95);
    const nsLamp2 = r.addObj(new THREE.CylinderGeometry(0.12, 0.12, 0.6), 0xffffcc, 3.2, 1.2, bz + 0.95);
    r.nightstandLamps = [nsLamp1, nsLamp2];

    // Wall art (new, anomaly target)
    const wallArtMat = new THREE.MeshStandardMaterial({ color: 0x6a4c93 });
    const wallArt = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.06), wallArtMat);
    wallArt.position.set(0, 4.0, bz + 0.1);
    r.group.add(wallArt);
    r.objects.push(wallArt);
    r.wallArt = wallArt;

    // Dresser (new, anomaly target)
    const dresser = r.addObj(new THREE.BoxGeometry(2.0, 1.4, 0.9), 0xcca677, -4.0, 0.7, 2.0);
    r.dresser = dresser;

    // Mirror on wall (new, anomaly target)
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xccddff });
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 0.06), mirrorMat);
    mirror.position.set(-4.0, 2.5, 2.0);
    r.group.add(mirror);
    r.objects.push(mirror);
    r.mirror = mirror;

    // Closet (new, anomaly target)
    const closet = r.addObj(new THREE.BoxGeometry(2.4, 4.0, 1.0), 0xddccbb, 4.0, 2.0, bz + 0.5);
    r.closet = closet;

    r.addPlant(3.2, 0, 4.0);
}

