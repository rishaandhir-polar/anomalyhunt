import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Room } from '../src/entities/room.js';

// Mock THREE.js
vi.mock('three', () => {
    class FakeMesh {
        constructor(geo, mat) {
            this.geometry = geo;
            this.material = mat;
            this.position = { set: vi.fn(), x: 0, y: 0, z: 0 };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.castShadow = false;
            this.receiveShadow = false;
        }
    }
    class FakeGroup {
        constructor() {
            this.add = vi.fn();
            this.position = { set: vi.fn(), x: 0, y: 0, z: 0 };
        }
    }
    class FakeLight {
        constructor() {
            this.position = { set: vi.fn(), x: 0, y: 0, z: 0 };
            this.castShadow = false;
        }
    }
    return {
        Mesh: FakeMesh,
        Group: FakeGroup,
        PointLight: FakeLight,
        PlaneGeometry: class {},
        BoxGeometry: class {},
        CylinderGeometry: class {},
        ConeGeometry: class {},
        MeshStandardMaterial: class { constructor(opts) { Object.assign(this, opts); } },
        Material: class {},
        BackSide: 1,
        Vector3: class { constructor(x, y, z) { this.x = x; this.y = y; this.z = z; } }
    };
});

// Mock TextureFactory
vi.mock('../src/core/textures.js', () => ({
    TextureFactory: {
        generateStripes: vi.fn(() => ({}))
    }
}));

// Mock room setups
vi.mock('../src/entities/room-setups.js', () => ({
    setupLivingRoom: vi.fn(),
    setupBedroom: vi.fn(),
    setupKitchen: vi.fn(),
    setupOffice: vi.fn(),
    setupBathroom: vi.fn(),
    setupHallway: vi.fn()
}));

describe('Room', () => {
    let room;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('constructor', () => {
        it('stores name and dimensions', () => {
            room = new Room('Test Room', { x: 10, y: 6, z: 10 }, 0xffffff, 'generic');
            expect(room.name).toBe('Test Room');
            expect(room.dimensions).toEqual({ x: 10, y: 6, z: 10 });
        });

        it('creates a THREE.Group', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            expect(room.group).toBeDefined();
        });

        it('initializes empty objects array', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            expect(room.objects).toEqual([]);
        });

        it('stores light color', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 }, 0xff0000);
            expect(room.lightColor).toBe(0xff0000);
        });

        it('stores room type', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 }, 0xffffff, 'kitchen');
            expect(room.type).toBe('kitchen');
        });
    });

    describe('init', () => {
        it('adds floor to group', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            expect(room.group.add).toHaveBeenCalled();
        });

        it('adds walls to group', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            const addCalls = room.group.add.mock.calls.length;
            expect(addCalls).toBeGreaterThanOrEqual(2);
        });

        it('creates and stores light', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            expect(room.light).toBeDefined();
        });

        it('adds extra light for hallway type', () => {
            room = new Room('Hallway', { x: 6, y: 6, z: 20 }, 0xffffff, 'hallway');
            const addCalls = room.group.add.mock.calls.length;
            expect(addCalls).toBeGreaterThan(5);
        });
    });

    describe('addWallDecor', () => {
        it('adds stripes and arch to group', () => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            const addCalls = room.group.add.mock.calls.length;
            expect(addCalls).toBeGreaterThanOrEqual(4);
        });
    });

    describe('addDecor', () => {
        it('calls room setup function for living-room type', async () => {
            const { setupLivingRoom } = await import('../src/entities/room-setups.js');
            room = new Room('Living', { x: 12, y: 6, z: 12 }, 0xffffff, 'living-room');
            expect(setupLivingRoom).toHaveBeenCalledWith(room);
        });

        it('calls room setup function for kitchen type', async () => {
            const { setupKitchen } = await import('../src/entities/room-setups.js');
            room = new Room('Kitchen', { x: 10, y: 6, z: 10 }, 0xffffff, 'kitchen');
            expect(setupKitchen).toHaveBeenCalledWith(room);
        });

        it('calls room setup function for bedroom type', async () => {
            const { setupBedroom } = await import('../src/entities/room-setups.js');
            room = new Room('Bedroom', { x: 10, y: 6, z: 12 }, 0xffffff, 'bedroom');
            expect(setupBedroom).toHaveBeenCalledWith(room);
        });
    });

    describe('addRug', () => {
        beforeEach(() => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            vi.clearAllMocks();
        });

        it('adds rug to group', () => {
            room.addRug(0, 0, 4, 3);
            expect(room.group.add).toHaveBeenCalled();
        });

        it('adds rug to objects array', () => {
            const rug = room.addRug(0, 0, 4, 3);
            expect(room.objects).toContain(rug);
        });

        it('returns the rug mesh', () => {
            const rug = room.addRug(0, 0, 4, 3);
            expect(rug).toBeDefined();
            expect(rug.position).toBeDefined();
        });
    });

    describe('addObj', () => {
        beforeEach(() => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            vi.clearAllMocks();
        });

        it('creates mesh with geometry and color', () => {
            const geo = {};
            const obj = room.addObj(geo, 0xff0000, 1, 2, 3);
            expect(obj.geometry).toBe(geo);
        });

        it('sets position', () => {
            const obj = room.addObj({}, 0xff0000, 1, 2, 3);
            expect(obj.position.set).toHaveBeenCalledWith(1, 2, 3);
        });

        it('enables shadows', () => {
            const obj = room.addObj({}, 0xff0000, 0, 0, 0);
            expect(obj.castShadow).toBe(true);
            expect(obj.receiveShadow).toBe(true);
        });

        it('adds to group and objects array', () => {
            const obj = room.addObj({}, 0xff0000, 0, 0, 0);
            expect(room.group.add).toHaveBeenCalled();
            expect(room.objects).toContain(obj);
        });

        it('returns the mesh', () => {
            const obj = room.addObj({}, 0xff0000, 0, 0, 0);
            expect(obj).toBeDefined();
        });
    });

    describe('addPlant', () => {
        beforeEach(() => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            vi.clearAllMocks();
        });

        it('adds pot to group', () => {
            room.addPlant(0, 0, 0);
            expect(room.group.add).toHaveBeenCalled();
        });

        it('adds pot to objects array', () => {
            const initialLength = room.objects.length;
            room.addPlant(0, 0, 0);
            expect(room.objects.length).toBeGreaterThan(initialLength);
        });

        it('adds 4 leaves', () => {
            const initialCalls = room.group.add.mock.calls.length;
            room.addPlant(0, 0, 0);
            const newCalls = room.group.add.mock.calls.length - initialCalls;
            expect(newCalls).toBe(5); // 1 pot + 4 leaves
        });
    });

    describe('addObject (legacy)', () => {
        beforeEach(() => {
            room = new Room('Test', { x: 10, y: 6, z: 10 });
            vi.clearAllMocks();
        });

        it('calls addObj with position components', () => {
            const spy = vi.spyOn(room, 'addObj');
            room.addObject({}, 0xff0000, { x: 1, y: 2, z: 3 });
            expect(spy).toHaveBeenCalledWith({}, 0xff0000, 1, 2, 3);
        });

        it('returns mesh from addObj', () => {
            const result = room.addObject({}, 0xff0000, { x: 0, y: 0, z: 0 });
            expect(result).toBeDefined();
        });
    });
});
