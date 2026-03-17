import * as THREE from 'three';
import { Room } from '../entities/room.js';
import { AnomalyManager } from '../entities/anomaly.js';
import { setupBasement, setupAttic, setupGarage, setupNursery } from '../entities/room-setups-new.js';

export class GameEngine {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });

        this.rooms = {};
        this.currentCamIndex = 0;
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.setupRooms();
        this.switchCamera(0);

        // Global ambient so dark rooms aren't pitch black
        const ambient = new THREE.AmbientLight(0xffffff, 0.35);
        this.scene.add(ambient);

        window.addEventListener('resize', () => this.onResize());
    }

    setupRooms() {
        this.rooms['living-room'] = new Room('Living Room', new THREE.Vector3(12, 6, 12), 0xffffff, 'living-room');
        this.rooms['living-room'].group.position.set(0, 0, 0);

        this.rooms['kitchen'] = new Room('Kitchen', new THREE.Vector3(10, 6, 10), 0xffffee, 'kitchen');
        this.rooms['kitchen'].group.position.set(20, 0, 0);

        this.rooms['bedroom'] = new Room('Bedroom', new THREE.Vector3(10, 6, 12), 0x88bbff, 'bedroom');
        this.rooms['bedroom'].group.position.set(40, 0, 0);

        this.rooms['hallway'] = new Room('Hallway', new THREE.Vector3(6, 6, 20), 0xfff5e0, 'hallway');
        this.rooms['hallway'].group.position.set(60, 0, 0);

        this.rooms['office'] = new Room('Office', new THREE.Vector3(8, 6, 8), 0xffeeaa, 'office');
        this.rooms['office'].group.position.set(80, 0, 0);

        this.rooms['bathroom'] = new Room('Bathroom', new THREE.Vector3(6, 6, 6), 0xccffff, 'bathroom');
        this.rooms['bathroom'].group.position.set(100, 0, 0);

        this.rooms['basement'] = new Room('Basement', new THREE.Vector3(12, 5, 12), 0x888888, 'basement');
        this.rooms['basement'].group.position.set(120, 0, 0);
        setupBasement(this.rooms['basement']);

        this.rooms['attic'] = new Room('Attic', new THREE.Vector3(10, 4, 10), 0xbbaa99, 'attic');
        this.rooms['attic'].group.position.set(140, 0, 0);
        setupAttic(this.rooms['attic']);

        this.rooms['garage'] = new Room('Garage', new THREE.Vector3(14, 6, 14), 0xaaaaaa, 'garage');
        this.rooms['garage'].group.position.set(160, 0, 0);
        setupGarage(this.rooms['garage']);

        this.rooms['nursery'] = new Room('Nursery', new THREE.Vector3(9, 5, 9), 0xffddee, 'nursery');
        this.rooms['nursery'].group.position.set(180, 0, 0);
        setupNursery(this.rooms['nursery']);

        Object.values(this.rooms).forEach(r => this.scene.add(r.group));

        this.anomalyManager = new AnomalyManager(this.rooms);
    }

    switchCamera(index) {
        const roomKeys = Object.keys(this.rooms);
        const room = this.rooms[roomKeys[index]];

        // CCTV Position (High corner)
        this.camera.position.set(
            room.group.position.x + room.dimensions.x / 2 - 1,
            room.group.position.y + room.dimensions.y - 1,
            room.group.position.z + room.dimensions.z / 2 - 1
        );
        this.camera.lookAt(room.group.position.x, room.group.position.y + 1, room.group.position.z);
        this.currentCamIndex = index;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
