import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextureFactory } from '../src/core/textures.js';

// Mock THREE.js
vi.mock('three', () => {
    class FakeCanvasTexture {
        constructor(canvas) {
            this.canvas = canvas;
            this.wrapS = null;
            this.wrapT = null;
        }
    }
    return {
        CanvasTexture: FakeCanvasTexture,
        RepeatWrapping: 1000
    };
});

describe('TextureFactory', () => {
    let mockCanvas, mockCtx;

    beforeEach(() => {
        mockCtx = {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            fillRect: vi.fn(),
            strokeRect: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn()
        };

        mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn(() => mockCtx)
        };

        global.document = {
            createElement: vi.fn(() => mockCanvas)
        };
    });

    describe('generateGrid', () => {
        it('creates canvas with correct size', () => {
            TextureFactory.generateGrid(256, 8);
            expect(mockCanvas.width).toBe(256);
            expect(mockCanvas.height).toBe(256);
        });

        it('uses default parameters when none provided', () => {
            TextureFactory.generateGrid();
            expect(mockCanvas.width).toBe(256);
            expect(mockCanvas.height).toBe(256);
        });

        it('draws grid lines', () => {
            TextureFactory.generateGrid(256, 8);
            expect(mockCtx.moveTo).toHaveBeenCalled();
            expect(mockCtx.lineTo).toHaveBeenCalled();
            expect(mockCtx.stroke).toHaveBeenCalled();
        });

        it('returns texture with RepeatWrapping', () => {
            const tex = TextureFactory.generateGrid();
            expect(tex.wrapS).toBe(1000);
            expect(tex.wrapT).toBe(1000);
        });
    });

    describe('generateStripes', () => {
        it('creates canvas with correct size', () => {
            TextureFactory.generateStripes(512, 45);
            expect(mockCanvas.width).toBe(512);
            expect(mockCanvas.height).toBe(512);
        });

        it('uses default parameters', () => {
            TextureFactory.generateStripes();
            expect(mockCanvas.width).toBe(512);
        });

        it('applies rotation transformation', () => {
            TextureFactory.generateStripes(512, 45);
            expect(mockCtx.rotate).toHaveBeenCalledWith(45 * Math.PI / 180);
        });

        it('draws stripe pattern', () => {
            TextureFactory.generateStripes(512, 45);
            expect(mockCtx.fillRect).toHaveBeenCalled();
        });

        it('returns texture with RepeatWrapping', () => {
            const tex = TextureFactory.generateStripes();
            expect(tex.wrapS).toBe(1000);
            expect(tex.wrapT).toBe(1000);
        });
    });

    describe('generateTiles', () => {
        it('creates canvas with correct size', () => {
            TextureFactory.generateTiles(512, 8, 12);
            expect(mockCanvas.width).toBe(512);
            expect(mockCanvas.height).toBe(512);
        });

        it('uses default parameters', () => {
            TextureFactory.generateTiles();
            expect(mockCanvas.width).toBe(512);
        });

        it('draws tile grid', () => {
            TextureFactory.generateTiles(512, 8, 12);
            expect(mockCtx.strokeRect).toHaveBeenCalled();
        });

        it('returns texture with RepeatWrapping', () => {
            const tex = TextureFactory.generateTiles();
            expect(tex.wrapS).toBe(1000);
            expect(tex.wrapT).toBe(1000);
        });
    });
});
