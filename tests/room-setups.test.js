import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    setupLivingRoom, setupBedroom, setupKitchen,
    setupOffice, setupBathroom, setupHallway
} from '../src/entities/room-setups.js';

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
    });
});
