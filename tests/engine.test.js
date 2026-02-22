import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameEngine } from '../src/core/engine.js';

// Mock THREE.js
vi.mock('three', () => {
    class FakeScene {
        add = vi.fn();
    }
    class FakeCamera {
        constructor() {
            this.position = { set: vi.fn(), x: 0, y: 0, z: 0 };
            this.aspect = 1;
            this.updateProjectionMatrix = vi.fn();
        }
        lookAt = vi.fn();
    }
    class FakeRenderer {
        constructor() {
            this.domElement = { style: {} };
            this.shadowMap = { enabled: false, type: null };
        }
        setSize = vi.fn();
        setPixelRatio = vi.fn();
        render = vi.fn();
    }
    class FakeLight {
        constructor() {}
    }
    return {
        Scene: FakeScene,
        PerspectiveCamera: FakeCamera,
        WebGLRenderer: FakeRenderer,
        AmbientLight: FakeLight,
        PCFShadowMap: 1,
        Vector3: class { constructor(x, y, z) { this.x = x; this.y = y; this.z = z; } }
    };
});

// Mock Room
vi.mock('../src/entities/room.js', () => ({
    Room: class {
        constructor(name, dims, color, id) {
            this.name = name;
            this.dimensions = dims;
            this.group = { position: { set: vi.fn(), x: 0, y: 0, z: 0 } };
        }
    }
}));

// Mock AnomalyManager
vi.mock('../src/entities/anomaly.js', () => ({
    AnomalyManager: class {
        constructor(rooms) {
            this.rooms = rooms;
        }
    }
}));

describe('GameEngine', () => {
    let container, engine;

    beforeEach(() => {
        global.window = {
            innerWidth: 1024,
            innerHeight: 768,
            devicePixelRatio: 2,
            addEventListener: vi.fn()
        };

        container = {
            appendChild: vi.fn()
        };

        engine = new GameEngine(container);
    });

    describe('constructor', () => {
        it('initializes scene, camera, and renderer', () => {
            expect(engine.scene).toBeDefined();
            expect(engine.camera).toBeDefined();
            expect(engine.renderer).toBeDefined();
        });

        it('stores container reference', () => {
            expect(engine.container).toBe(container);
        });

        it('initializes rooms object', () => {
            expect(engine.rooms).toBeDefined();
            expect(typeof engine.rooms).toBe('object');
        });

        it('sets currentCamIndex to 0', () => {
            expect(engine.currentCamIndex).toBe(0);
        });
    });

    describe('init', () => {
        it('configures renderer size', () => {
            expect(engine.renderer.setSize).toHaveBeenCalledWith(1024, 768);
        });

        it('enables shadow mapping', () => {
            expect(engine.renderer.shadowMap.enabled).toBe(true);
            expect(engine.renderer.shadowMap.type).toBe(1);
        });

        it('sets pixel ratio with max of 2', () => {
            expect(engine.renderer.setPixelRatio).toHaveBeenCalledWith(2);
        });

        it('appends renderer to container', () => {
            expect(container.appendChild).toHaveBeenCalledWith(engine.renderer.domElement);
        });

        it('adds ambient light to scene', () => {
            expect(engine.scene.add).toHaveBeenCalled();
        });

        it('registers resize listener', () => {
            expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
        });
    });

    describe('setupRooms', () => {
        it('creates 6 rooms', () => {
            const roomKeys = Object.keys(engine.rooms);
            expect(roomKeys.length).toBe(6);
        });

        it('creates living-room', () => {
            expect(engine.rooms['living-room']).toBeDefined();
        });

        it('creates kitchen', () => {
            expect(engine.rooms['kitchen']).toBeDefined();
        });

        it('creates bedroom', () => {
            expect(engine.rooms['bedroom']).toBeDefined();
        });

        it('creates hallway', () => {
            expect(engine.rooms['hallway']).toBeDefined();
        });

        it('creates office', () => {
            expect(engine.rooms['office']).toBeDefined();
        });

        it('creates bathroom', () => {
            expect(engine.rooms['bathroom']).toBeDefined();
        });

        it('adds all rooms to scene', () => {
            const addCalls = engine.scene.add.mock.calls.length;
            expect(addCalls).toBeGreaterThanOrEqual(6);
        });

        it('initializes anomaly manager with rooms', () => {
            expect(engine.anomalyManager).toBeDefined();
            expect(engine.anomalyManager.rooms).toBe(engine.rooms);
        });
    });

    describe('switchCamera', () => {
        it('updates currentCamIndex', () => {
            engine.switchCamera(2);
            expect(engine.currentCamIndex).toBe(2);
        });

        it('positions camera in room corner', () => {
            engine.switchCamera(0);
            expect(engine.camera.position.set).toHaveBeenCalled();
        });

        it('makes camera look at room center', () => {
            engine.switchCamera(1);
            expect(engine.camera.lookAt).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        it('calls renderer.render with scene and camera', () => {
            engine.render();
            expect(engine.renderer.render).toHaveBeenCalledWith(engine.scene, engine.camera);
        });
    });

    describe('onResize', () => {
        it('updates camera aspect ratio', () => {
            window.innerWidth = 1920;
            window.innerHeight = 1080;
            engine.onResize();
            expect(engine.camera.aspect).toBe(1920 / 1080);
        });

        it('updates projection matrix', () => {
            engine.onResize();
            expect(engine.camera.updateProjectionMatrix).toHaveBeenCalled();
        });

        it('resizes renderer', () => {
            window.innerWidth = 800;
            window.innerHeight = 600;
            engine.onResize();
            expect(engine.renderer.setSize).toHaveBeenCalledWith(800, 600);
        });
    });
});
