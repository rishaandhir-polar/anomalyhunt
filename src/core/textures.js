import * as THREE from 'three';

export const TextureFactory = {
    generateGrid(size = 256, lines = 8) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 2;

        const step = size / lines;
        for (let i = 0; i <= size; i += step) {
            ctx.moveTo(i, 0); ctx.lineTo(i, size);
            ctx.moveTo(0, i); ctx.lineTo(size, i);
        }
        ctx.stroke();

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    },

    generateStripes(size = 512, angle = 45) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        const stripeWidth = 40;

        ctx.translate(size / 2, size / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-size, -size);

        for (let i = 0; i < size * 4; i += stripeWidth * 2) {
            ctx.fillRect(i, 0, stripeWidth, size * 4);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    },

    generateTiles(size = 512, cols = 8, rows = 12) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;

        const w = size / cols;
        const h = size / rows;

        for (let r = 0; r < rows; r++) {
            const offset = (r % 2) * (w / 2);
            for (let c = -1; c <= cols; c++) {
                ctx.strokeRect(c * w + offset, r * h, w, h);
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }
};
