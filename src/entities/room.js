import * as THREE from 'three';
import { TextureFactory } from '../core/textures.js';
import {
    setupLivingRoom, setupBedroom, setupKitchen,
    setupOffice, setupBathroom, setupHallway
} from './room-setups.js';

export class Room {
    constructor(name, dimensions, lightColor = 0xffffff, type = 'generic') {
        this.name = name;
        this.dimensions = dimensions;
        this.group = new THREE.Group();
        this.objects = [];
        this.lightColor = lightColor;
        this.type = type;
        this.init();
    }

    init() {
        const { x: W, y: H, z: D } = this.dimensions;
        const isLight = ['living-room', 'kitchen', 'bedroom', 'office', 'bathroom', 'hallway'].includes(this.type);

        // ── Floor (y=0.02 so it never shares a face with the wall box bottom at y=0) ──
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(W, D),
            new THREE.MeshStandardMaterial({ color: isLight ? 0xcca677 : 0x444444, roughness: 0.9 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.02;
        floor.receiveShadow = true;
        this.group.add(floor);

        // ── Walls (BackSide box — bottom face at y=0, floor at y=0.02, no Z-fight) ──
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(W, H, D),
            new THREE.MeshStandardMaterial({ color: isLight ? 0xfaf7f0 : 0x777777, side: THREE.BackSide })
        );
        walls.position.y = H / 2;
        this.group.add(walls);

        // ── Lights ──────────────────────────────────────────────────────────────────
        const intensity = this.type === 'hallway' ? 25 : 15;
        const light = new THREE.PointLight(this.lightColor, intensity, 30);
        light.position.set(0, H - 0.5, 0);
        light.castShadow = true;
        this.group.add(light);
        this.light = light;

        // Second fill light for the long hallway
        if (this.type === 'hallway') {
            const fill = new THREE.PointLight(this.lightColor, 20, 20);
            fill.position.set(0, H - 0.5, D / 4);
            this.group.add(fill);
        }

        // ── Wall decor & furniture ───────────────────────────────────────────────
        this.addWallDecor();
        this.addDecor();
    }

    // Stripe + arch — flat planes 5cm off wall face (physically clear of wall face)
    addWallDecor() {
        const { x: W, y: H, z: D } = this.dimensions;
        const backZ = -D / 2 + 0.05;

        const stripes = new THREE.Mesh(
            new THREE.PlaneGeometry(W, H),
            new THREE.MeshStandardMaterial({
                map: TextureFactory.generateStripes(512, 45),
                transparent: true, opacity: 0.9
            })
        );
        stripes.position.set(0, H / 2, backZ);
        this.group.add(stripes);

        const arch = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 4),
            new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        arch.position.set(-3, 2, backZ + 0.01); // 1cm in front of stripes
        this.group.add(arch);
    }

    addDecor() {
        const map = {
            'living-room': setupLivingRoom,
            'bedroom': setupBedroom,
            'kitchen': setupKitchen,
            'office': setupOffice,
            'bathroom': setupBathroom,
            'hallway': setupHallway,
        };
        map[this.type]?.(this);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    addRug(x, z, w, d) {
        const rug = new THREE.Mesh(
            new THREE.PlaneGeometry(w, d),
            new THREE.MeshStandardMaterial({ map: TextureFactory.generateStripes(512, 0) })
        );
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(x, 0.04, z); // 0.04 — sits above floor (0.02), clear separation
        this.group.add(rug);
        this.objects.push(rug);
        return rug;
    }

    // Center-position shorthand: x/y/z are the mesh center
    addObj(geo, colorOrMat, x, y, z) {
        const mat = colorOrMat instanceof THREE.Material
            ? colorOrMat
            : new THREE.MeshStandardMaterial({ color: colorOrMat });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = mesh.receiveShadow = true;
        this.group.add(mesh);
        this.objects.push(mesh);
        return mesh;
    }

    addPlant(x, offsetY, z) {
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.25, 0.55),
            new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        pot.position.set(x, offsetY + 0.275, z);
        this.group.add(pot);
        this.objects.push(pot);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
        for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * Math.PI * 2;
            const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.1, 6), leafMat);
            leaf.position.set(x + Math.sin(ang) * 0.12, offsetY + 1.0, z + Math.cos(ang) * 0.12);
            leaf.rotation.z = Math.sin(ang) * 0.35;
            leaf.rotation.x = Math.cos(ang) * 0.35;
            this.group.add(leaf);
            this.objects.push(leaf);
        }
    }

    // Legacy compat for anomaly.js
    addObject(geo, colorOrMat, pos) {
        return this.addObj(geo, colorOrMat, pos.x, pos.y, pos.z);
    }
}
