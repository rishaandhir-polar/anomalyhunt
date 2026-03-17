import * as THREE from 'three';
import { TextureFactory } from '../core/textures.js';

export function setupBasement(r) {
    const box1 = r.addObj(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0x888888, -3, 0.5, -3);
    const box2 = r.addObj(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0x888888, -2, 0.5, -3);
    const box3 = r.addObj(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0x888888, -1, 0.5, -3);
    const box4 = r.addObj(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0x888888,  0, 0.5, -3);
    const box5 = r.addObj(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0x888888,  1, 0.5, -3);
    r.storageBoxes = [box1, box2, box3, box4, box5];
    r.waterHeater = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 1.8), 0x666666, 3.5, 0.9, -3.5);
    r.addObj(new THREE.BoxGeometry(2.0, 3.0, 0.4), 0x999999, -4.0, 1.5, -4.5);
    r.addObj(new THREE.BoxGeometry(2.0, 3.0, 0.4), 0x999999,  4.0, 1.5, -4.5);
    r.addObj(new THREE.CylinderGeometry(0.08, 0.08, 4.0), 0x777777, -1.5, 2.0, -4.5);
    r.addObj(new THREE.CylinderGeometry(0.08, 0.08, 4.0), 0x777777,  1.5, 2.0, -4.5);
}

export function setupAttic(r) {
    const of1 = r.addObj(new THREE.BoxGeometry(1.5, 1.0, 1.0), 0x8b7355, -3, 0.5, -2);
    const of2 = r.addObj(new THREE.BoxGeometry(1.0, 1.5, 0.8), 0x8b7355,  0, 0.75, -3);
    const of3 = r.addObj(new THREE.BoxGeometry(2.0, 0.8, 1.2), 0x8b7355,  3, 0.4, -2);
    r.oldFurniture = [of1, of2, of3];
    const cw1 = r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.02), 0xdddddd, -4.5, 3.6, -4.5);
    const cw2 = r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.02), 0xdddddd,  4.5, 3.6, -4.5);
    const cw3 = r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.02), 0xdddddd, -4.5, 3.6,  4.5);
    const cw4 = r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.02), 0xdddddd,  4.5, 3.6,  4.5);
    r.cobwebs = [cw1, cw2, cw3, cw4];
    r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.8), 0xaaaaaa, -2, 0.4, 2);
    r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.8), 0xaaaaaa, -1, 0.4, 2);
    r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.8), 0xaaaaaa,  0, 0.4, 2);
    r.addObj(new THREE.BoxGeometry(0.8, 0.8, 0.8), 0xaaaaaa,  1, 0.4, 2);
    r.addObj(new THREE.BoxGeometry(1.5, 1.0, 0.1), 0x88aacc, 0, 4.0, -r.dimensions.z / 2 + 0.1);
}

export function setupGarage(r) {
    const carBody = r.addObj(new THREE.BoxGeometry(4.0, 1.2, 2.0), 0x2244aa, 0, 0.8, 0);
    const w1 = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 0.3), 0x111111, -1.5, 0.4, -1.1);
    const w2 = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 0.3), 0x111111,  1.5, 0.4, -1.1);
    const w3 = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 0.3), 0x111111, -1.5, 0.4,  1.1);
    const w4 = r.addObj(new THREE.CylinderGeometry(0.4, 0.4, 0.3), 0x111111,  1.5, 0.4,  1.1);
    r.car = { body: carBody, wheels: [w1, w2, w3, w4] };
    r.workbench = r.addObj(new THREE.BoxGeometry(3.0, 1.0, 1.0), 0xcca677, -4.0, 0.5, -4.0);
    const t1 = r.addObj(new THREE.BoxGeometry(0.3, 0.8, 0.1), 0x888888, -4.5, 1.4, -4.0);
    const t2 = r.addObj(new THREE.BoxGeometry(0.3, 0.8, 0.1), 0x888888, -4.2, 1.4, -4.0);
    const t3 = r.addObj(new THREE.BoxGeometry(0.3, 0.8, 0.1), 0x888888, -3.9, 1.4, -4.0);
    const t4 = r.addObj(new THREE.BoxGeometry(0.3, 0.8, 0.1), 0x888888, -3.6, 1.4, -4.0);
    const t5 = r.addObj(new THREE.BoxGeometry(0.3, 0.8, 0.1), 0x888888, -3.3, 1.4, -4.0);
    r.tools = [t1, t2, t3, t4, t5];
    r.addObj(new THREE.BoxGeometry(2.0, 3.0, 0.4), 0x999999, 4.0, 1.5, -4.5);
}

export function setupNursery(r) {
    r.crib = r.addObj(new THREE.BoxGeometry(2.0, 1.2, 1.0), 0xffffff, 0, 0.6, -3.5);
    const toy1 = r.addObj(new THREE.BoxGeometry(0.4, 0.4, 0.4), 0xff6666, -2.0, 0.2, 0);
    const toy2 = r.addObj(new THREE.BoxGeometry(0.4, 0.4, 0.4), 0x66ff66, -1.5, 0.2, 0);
    const toy3 = r.addObj(new THREE.BoxGeometry(0.4, 0.4, 0.4), 0x6666ff, -1.0, 0.2, 0);
    const toy4 = r.addObj(new THREE.BoxGeometry(0.4, 0.4, 0.4), 0xffff66, -0.5, 0.2, 0);
    const toy5 = r.addObj(new THREE.BoxGeometry(0.4, 0.4, 0.4), 0xff66ff,  0.0, 0.2, 0);
    r.toys = [toy1, toy2, toy3, toy4, toy5];
    r.rockingChair = r.addObj(new THREE.BoxGeometry(1.0, 1.2, 1.0), 0xcca677, 3.5, 0.6, 2.0);
    r.mobile = r.addObj(new THREE.CylinderGeometry(0.6, 0.6, 0.1), 0xffaaaa, 0, 2.5, -3.5);
    r.addObj(new THREE.BoxGeometry(1.8, 1.2, 0.8), 0xffeedd, -3.5, 0.6, -3.5);
    r.addObj(new THREE.BoxGeometry(0.6, 0.6, 0.05), 0xffcccc, -2, 3.5, -r.dimensions.z / 2 + 0.1);
    r.addObj(new THREE.BoxGeometry(0.6, 0.6, 0.05), 0xccffcc,  0, 3.5, -r.dimensions.z / 2 + 0.1);
    r.addObj(new THREE.BoxGeometry(0.6, 0.6, 0.05), 0xccccff,  2, 3.5, -r.dimensions.z / 2 + 0.1);
}

export function setupKitchen(r) {
    const W = r.dimensions.x;
    const bz = -r.dimensions.z / 2;
    r.addRug(0, 0, 7, 3);
    const tilePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.05, 1.5),
        new THREE.MeshStandardMaterial({ map: TextureFactory.generateTiles() })
    );
    tilePlane.position.set(0, 2.25, bz + 0.05);
    r.group.add(tilePlane);
    const CAB_H = 1.5, CAB_D = 1.5;
    const cw = W / 2 - 1.25 - 0.1;
    r.addObj(new THREE.BoxGeometry(cw, CAB_H, CAB_D), 0xffffff, -(cw / 2 + 1.35), CAB_H / 2, bz + CAB_D / 2);
    r.addObj(new THREE.BoxGeometry(cw, CAB_H, CAB_D), 0xffffff,  (cw / 2 + 1.35), CAB_H / 2, bz + CAB_D / 2);
    r.addObj(new THREE.BoxGeometry(2.5, CAB_H, CAB_D), 0x222222, 0, CAB_H / 2, bz + CAB_D / 2);
    const CT_H = 0.12;
    r.addObj(new THREE.BoxGeometry(W, CT_H, CAB_D + 0.15), 0xcca677, 0, CAB_H + CT_H / 2, bz + (CAB_D + 0.15) / 2);
    const burnerY = CAB_H + CT_H + 0.03;
    [[-0.6, bz + 0.5], [0.6, bz + 0.5], [-0.6, bz + 1.1], [0.6, bz + 1.1]].forEach(([bx, bzp]) => {
        r.addObj(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16), 0x111111, bx, burnerY, bzp);
    });
    r.addObj(new THREE.BoxGeometry(2.5, 3.0, 1.2), 0x999999, 0, CAB_H + CT_H + 1.5 + 0.06, bz + 0.75);
    r.addObj(new THREE.CylinderGeometry(0.25, 0.3, 0.6), 0x111111, -2.5, CAB_H + CT_H + 0.3, bz + 0.9);
    r.addObj(new THREE.BoxGeometry(1.4, 0.08, 1.0), 0x555555, 3.0, CAB_H + CT_H + 0.04, bz + 0.8);
    r.faucet = r.addObj(new THREE.CylinderGeometry(0.05, 0.05, 0.6), 0x888888, 3.0, CAB_H + CT_H + 0.6, bz + 0.5);
    r.clock  = r.addObj(new THREE.CylinderGeometry(0.35, 0.35, 0.08), 0x333333, -4.0, 4.5, bz + 0.1);
    const ucY = CAB_H + CT_H + 1.2;
    r.cabinets = [
        r.addObj(new THREE.BoxGeometry(cw, 1.0, 0.6), 0xffffff, -(cw / 2 + 1.35), ucY, bz + 0.3),
        r.addObj(new THREE.BoxGeometry(2.5, 1.0, 0.6), 0xffffff, 0, ucY, bz + 0.3),
        r.addObj(new THREE.BoxGeometry(cw, 1.0, 0.6), 0xffffff,  (cw / 2 + 1.35), ucY, bz + 0.3),
    ];
    r.addPlant(4.5, 0, 1.5);
}
