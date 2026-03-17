import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    setupLivingRoom, setupBedroom
} from '../src/entities/room-setups.js';
import {
    setupOffice, setupBathroom, setupHallway
} from '../src/entities/room-setups-extended.js';
import {
    setupBasement, setupAttic, setupGarage, setupNursery, setupKitchen
} from '../src/entities/room-setups-new.js';

// Mock THREE.js
vi.mock('three', () => ({
    BoxGeometry: class {},
    CylinderGeometry: class {},
    PlaneGeometry: class {},
    Mesh: class {
        constructor(geo, mat) {
            this.geometry = geo;
            this.material = mat;
            this.position = { set: vi.fn(), x: 0, y: 0, z: 0 };
            this.castShadow = false;
        }
    },
    MeshStandardMaterial: class { constructor(opts) { Object.assign(this, opts); } },
    Color: class { constructor(r, g, b) { this.r = r; this.g = g; this.b = b; } }
}));

// Mock TextureFactory
vi.mock('../src/core/textures.js', () => ({
    TextureFactory: {
        generateGrid: vi.fn(() => ({})),
        generateTiles: vi.fn(() => ({}))
    }
}));

describe('Room Setups', () => {
    let mockRoom;

    beforeEach(() => {
        mockRoom = {
            dimensions: { x: 12, y: 6, z: 12 },
            group: { add: vi.fn() },
            objects: [],
            addRug: vi.fn(),
            addObj: vi.fn(() => ({ position: { set: vi.fn() } })),
            addPlant: vi.fn()
        };
    });

    describe('setupLivingRoom', () => {
        it('adds rug', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.addRug).toHaveBeenCalled();
        });

        it('adds sofa components', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
        });

        it('adds coffee table', () => {
            setupLivingRoom(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(5);
        });

        it('adds plant', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.addPlant).toHaveBeenCalled();
        });

        it('creates TV screen and stores reference', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.tvScreen).toBeDefined();
        });

        it('creates painting and stores reference', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.painting).toBeDefined();
        });

        it('adds TV screen to group', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.group.add).toHaveBeenCalled();
        });

        it('creates curtains and stores reference', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.curtains).toBeDefined();
        });

        it('creates mirror and stores reference', () => {
            setupLivingRoom(mockRoom);
            expect(mockRoom.mirror).toBeDefined();
        });
    });

    describe('setupBedroom', () => {
        it('adds rug', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.addRug).toHaveBeenCalled();
        });

        it('adds headboard', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
        });

        it('adds mattress with texture', () => {
            setupBedroom(mockRoom);
            const calls = mockRoom.addObj.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
        });

        it('adds pillows', () => {
            setupBedroom(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(3);
        });

        it('adds nightstands', () => {
            setupBedroom(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(5);
        });

        it('adds plant', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.addPlant).toHaveBeenCalled();
        });

        it('creates nightstand lamps array with 2 items', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.nightstandLamps).toBeDefined();
            expect(mockRoom.nightstandLamps).toHaveLength(2);
        });

        it('creates dresser and stores reference', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.dresser).toBeDefined();
        });

        it('creates mirror and stores reference', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.mirror).toBeDefined();
        });

        it('creates closet and stores reference', () => {
            setupBedroom(mockRoom);
            expect(mockRoom.closet).toBeDefined();
        });
    });

    describe('setupKitchen', () => {
        it('adds rug', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.addRug).toHaveBeenCalled();
        });

        it('adds tile backsplash to group', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.group.add).toHaveBeenCalled();
        });

        it('adds cabinets', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
        });

        it('adds stove', () => {
            setupKitchen(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(2);
        });

        it('adds countertop', () => {
            setupKitchen(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(3);
        });

        it('adds burners', () => {
            setupKitchen(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(7);
        });

        it('adds plant', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.addPlant).toHaveBeenCalled();
        });

        it('creates faucet and stores reference', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.faucet).toBeDefined();
        });

        it('creates wall clock and stores reference', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.clock).toBeDefined();
        });

        it('creates upper cabinets array with 3 items', () => {
            setupKitchen(mockRoom);
            expect(mockRoom.cabinets).toBeDefined();
            expect(mockRoom.cabinets).toHaveLength(3);
        });
    });

    describe('setupOffice', () => {
        it('adds rug', () => {
            setupOffice(mockRoom);
            expect(mockRoom.addRug).toHaveBeenCalled();
        });

        it('adds desk legs and top', () => {
            setupOffice(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(5);
        });

        it('adds monitor components', () => {
            setupOffice(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(8);
        });

        it('adds chair with legs', () => {
            setupOffice(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(12);
        });

        it('adds plants', () => {
            setupOffice(mockRoom);
            expect(mockRoom.addPlant).toHaveBeenCalledTimes(2);
        });

        it('creates bookshelf and stores reference', () => {
            setupOffice(mockRoom);
            expect(mockRoom.bookshelf).toBeDefined();
        });

        it('creates ceiling fan and stores reference', () => {
            setupOffice(mockRoom);
            expect(mockRoom.ceilingFan).toBeDefined();
        });

        it('creates monitor and stores reference', () => {
            setupOffice(mockRoom);
            expect(mockRoom.monitor).toBeDefined();
        });
    });

    describe('setupBathroom', () => {
        it('adds rug', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.addRug).toHaveBeenCalled();
        });

        it('adds tile backsplash to group', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.group.add).toHaveBeenCalled();
        });

        it('adds vanity legs', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
        });

        it('adds vanity body and countertop', () => {
            setupBathroom(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(5);
        });

        it('adds toilet components', () => {
            setupBathroom(mockRoom);
            const calls = mockRoom.addObj.mock.calls.length;
            expect(calls).toBeGreaterThan(8);
        });

        it('adds plant', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.addPlant).toHaveBeenCalled();
        });

        it('creates mirror and stores reference', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.mirror).toBeDefined();
        });

        it('creates shower curtain and stores reference', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.showerCurtain).toBeDefined();
        });

        it('creates towels array with 3 items', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.towels).toBeDefined();
            expect(mockRoom.towels).toHaveLength(3);
        });

        it('creates faucet and stores reference', () => {
            setupBathroom(mockRoom);
            expect(mockRoom.faucet).toBeDefined();
        });
    });

    describe('setupHallway', () => {
        it('adds decorative element', () => {
            setupHallway(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalled();
        });

        it('positions element at room edge', () => {
            setupHallway(mockRoom);
            expect(mockRoom.addObj).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number)
            );
        });

        it('creates coat rack and stores reference', () => {
            setupHallway(mockRoom);
            expect(mockRoom.coatRack).toBeDefined();
        });

        it('creates wall photos array with 3 items', () => {
            setupHallway(mockRoom);
            expect(mockRoom.wallPhotos).toBeDefined();
            expect(mockRoom.wallPhotos).toHaveLength(3);
        });

        it('creates console table and stores reference', () => {
            setupHallway(mockRoom);
            expect(mockRoom.consoleTable).toBeDefined();
        });
    });

    describe('setupBasement', () => {
        it('creates storageBoxes array with 5 items', () => {
            setupBasement(mockRoom);
            expect(mockRoom.storageBoxes).toBeDefined();
            expect(mockRoom.storageBoxes).toHaveLength(5);
        });

        it('creates waterHeater and stores reference', () => {
            setupBasement(mockRoom);
            expect(mockRoom.waterHeater).toBeDefined();
        });

        it('calls addObj more than 8 times', () => {
            setupBasement(mockRoom);
            expect(mockRoom.addObj.mock.calls.length).toBeGreaterThan(8);
        });
    });

    describe('setupAttic', () => {
        it('creates oldFurniture array with 3 items', () => {
            setupAttic(mockRoom);
            expect(mockRoom.oldFurniture).toBeDefined();
            expect(mockRoom.oldFurniture).toHaveLength(3);
        });

        it('creates cobwebs array with 4 items', () => {
            setupAttic(mockRoom);
            expect(mockRoom.cobwebs).toBeDefined();
            expect(mockRoom.cobwebs).toHaveLength(4);
        });

        it('calls addObj more than 8 times', () => {
            setupAttic(mockRoom);
            expect(mockRoom.addObj.mock.calls.length).toBeGreaterThan(8);
        });
    });

    describe('setupGarage', () => {
        it('creates car.body and stores reference', () => {
            setupGarage(mockRoom);
            expect(mockRoom.car).toBeDefined();
            expect(mockRoom.car.body).toBeDefined();
        });

        it('creates car.wheels array with 4 items', () => {
            setupGarage(mockRoom);
            expect(mockRoom.car.wheels).toHaveLength(4);
        });

        it('creates workbench and stores reference', () => {
            setupGarage(mockRoom);
            expect(mockRoom.workbench).toBeDefined();
        });

        it('creates tools array with 5 items', () => {
            setupGarage(mockRoom);
            expect(mockRoom.tools).toBeDefined();
            expect(mockRoom.tools).toHaveLength(5);
        });
    });

    describe('setupNursery', () => {
        it('creates crib and stores reference', () => {
            setupNursery(mockRoom);
            expect(mockRoom.crib).toBeDefined();
        });

        it('creates toys array with 5 items', () => {
            setupNursery(mockRoom);
            expect(mockRoom.toys).toBeDefined();
            expect(mockRoom.toys).toHaveLength(5);
        });

        it('creates rockingChair and stores reference', () => {
            setupNursery(mockRoom);
            expect(mockRoom.rockingChair).toBeDefined();
        });

        it('creates mobile and stores reference', () => {
            setupNursery(mockRoom);
            expect(mockRoom.mobile).toBeDefined();
        });
    });
});
