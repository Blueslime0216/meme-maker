
import type { EffectType, RotateParams, StampParams } from '../types';
import { EXPORT_CANVAS_SIZE, EXPORT_FRAME_RATE } from '../constants';

// Declare global variables from scripts loaded in index.html
declare const GIF: any;
declare const UPNG: any;

const drawRotateFrame = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, params: RotateParams, frame: number, totalFrames: number) => {
    const w = EXPORT_CANVAS_SIZE;
    const h = EXPORT_CANVAS_SIZE;
    ctx.clearRect(0, 0, w, h);
    if (!params.isTransparent) {
        ctx.fillStyle = params.backgroundColor;
        ctx.fillRect(0, 0, w, h);
    }
    
    const angle = (frame / totalFrames) * 2 * Math.PI * (params.direction === 'left' || params.direction === 'up' ? -1 : 1);

    const ar = image.width / image.height;
    let iw, ih;
    if (ar >= 1) {
        iw = w * 0.8;
        ih = iw / ar;
    } else {
        ih = h * 0.8;
        iw = ih * ar;
    }

    ctx.save();
    ctx.translate(w / 2, h / 2);

    if (params.direction === 'right' || params.direction === 'left') {
        ctx.rotate(angle);
    } else if (params.direction === 'up' || params.direction === 'down') {
        ctx.scale(1, Math.cos(angle));
    }
    
    ctx.drawImage(image, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();
};

const drawStampFrame = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, params: StampParams, frame: number, totalFrames: number) => {
    const w = EXPORT_CANVAS_SIZE;
    const h = EXPORT_CANVAS_SIZE;
    ctx.clearRect(0, 0, w, h);

    if(frame < params.initialDelayFrames) return;
    
    const animationFrame = frame - params.initialDelayFrames;
    const ar = image.width / image.height;
    let iw, ih;
    if (ar >= 1) { iw = w * 0.8; ih = iw / ar; } else { ih = h * 0.8; iw = ih * ar; }
            
    const easeOutBack = (x: number): number => {
        const c1 = 1.70158; const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    let scale = 1.0;
    const animDuration = 20;
    if (animationFrame < animDuration) {
        const progress = animationFrame / animDuration;
        const easedProgress = easeOutBack(progress);
        scale = 4.0 - 3.0 * easedProgress;
    }

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(params.angle * Math.PI / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();

    if(animationFrame >= animDuration - 5 && animationFrame < animDuration + 10) {
         const echoFrame = animationFrame - (animDuration - 5);
         const echoProgress = echoFrame / 15;
         const echoScale = 1.0 + echoProgress * 0.15;
         const echoAlpha = 1.0 - echoProgress;
         ctx.save();
         ctx.globalAlpha = echoAlpha;
         ctx.translate(w / 2, h / 2);
         ctx.rotate(params.angle * Math.PI / 180);
         ctx.scale(echoScale, echoScale);
         ctx.drawImage(image, -iw / 2, -ih / 2, iw, ih);
         ctx.restore();
    }
};

const downloadBlob = (blob: Blob, format: 'gif' | 'apng') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animation.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


export const generateAnimation = async (
    image: HTMLImageElement,
    effectType: EffectType,
    params: RotateParams | StampParams,
    format: 'gif' | 'apng'
) => {
    const canvas = document.createElement('canvas');
    canvas.width = EXPORT_CANVAS_SIZE;
    canvas.height = EXPORT_CANVAS_SIZE;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');

    let totalFrames: number;
    let durationSeconds: number;
    
    if (effectType === 'rotate') {
        const p = params as RotateParams;
        durationSeconds = (10.5 - p.speed) / 3;
        totalFrames = Math.round(durationSeconds * EXPORT_FRAME_RATE);
    } else {
        const p = params as StampParams;
        durationSeconds = (p.initialDelayFrames / EXPORT_FRAME_RATE) + (20 / EXPORT_FRAME_RATE) + (p.loopDelayMs / 1000);
        totalFrames = Math.round(durationSeconds * EXPORT_FRAME_RATE);
    }
    const frameDelay = 1000 / EXPORT_FRAME_RATE;
    
    if (format === 'gif') {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: EXPORT_CANVAS_SIZE,
            height: EXPORT_CANVAS_SIZE,
            transparent: (params as RotateParams).isTransparent ? 0x00FF00 : null,
        });

        for (let i = 0; i < totalFrames; i++) {
            if (effectType === 'rotate') {
                drawRotateFrame(ctx, image, params as RotateParams, i, totalFrames);
            } else {
                drawStampFrame(ctx, image, params as StampParams, i, totalFrames);
            }
            gif.addFrame(ctx, { copy: true, delay: frameDelay });
        }
        
        gif.on('finished', (blob: Blob) => {
            downloadBlob(blob, 'gif');
        });
        gif.render();

    } else if (format === 'apng') {
        const frames: ArrayBuffer[] = [];
        const delays: number[] = [];

        for (let i = 0; i < totalFrames; i++) {
             if (effectType === 'rotate') {
                drawRotateFrame(ctx, image, params as RotateParams, i, totalFrames);
            } else {
                drawStampFrame(ctx, image, params as StampParams, i, totalFrames);
            }
            frames.push(ctx.getImageData(0, 0, EXPORT_CANVAS_SIZE, EXPORT_CANVAS_SIZE).data.buffer);
            delays.push(frameDelay);
        }
        
        const apngData = UPNG.encode(frames, EXPORT_CANVAS_SIZE, EXPORT_CANVAS_SIZE, 0, delays);
        const blob = new Blob([apngData], { type: 'image/apng' });
        downloadBlob(blob, 'apng');
    }
};
