
import React, { useRef, useEffect } from 'react';
import type { EffectType, RotateParams, StampParams } from '../types';
import { PREVIEW_CANVAS_SIZE } from '../constants';

interface PreviewWindowProps {
    image: HTMLImageElement;
    effectType: EffectType;
    params: RotateParams | StampParams;
}

const PreviewWindow: React.FC<PreviewWindowProps> = ({ image, effectType, params }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = PREVIEW_CANVAS_SIZE;
        const h = PREVIEW_CANVAS_SIZE;
        canvas.width = w;
        canvas.height = h;

        let frame = 0;

        const render = () => {
            ctx.clearRect(0, 0, w, h);

            if (effectType === 'rotate') {
                drawRotate(ctx, frame);
            } else if (effectType === 'stamp') {
                drawStamp(ctx, frame);
            }
            
            frame++;
            animationFrameId.current = requestAnimationFrame(render);
        };

        const drawRotate = (context: CanvasRenderingContext2D, currentFrame: number) => {
            const p = params as RotateParams;
            if (!p.isTransparent) {
                context.fillStyle = p.backgroundColor;
                context.fillRect(0, 0, w, h);
            }

            const speed = p.speed / 500;
            const angle = currentFrame * speed * (p.direction === 'left' || p.direction === 'up' ? -1 : 1);
            
            const ar = image.width / image.height;
            let iw, ih;
            if (ar >= 1) {
                iw = w * 0.8;
                ih = iw / ar;
            } else {
                ih = h * 0.8;
                iw = ih * ar;
            }

            context.save();
            context.translate(w / 2, h / 2);
            
            if (p.direction === 'right' || p.direction === 'left') {
                context.rotate(angle);
            } else if (p.direction === 'up' || p.direction === 'down') {
                context.scale(1, Math.cos(angle));
            }
            
            context.drawImage(image, -iw / 2, -ih / 2, iw, ih);
            context.restore();
        }

        const drawStamp = (context: CanvasRenderingContext2D, currentFrame: number) => {
            const p = params as StampParams;
            const totalLoopFrames = p.initialDelayFrames + 20 + (p.loopDelayMs / (1000/60)); // delay + anim + wait
            const currentLoopFrame = currentFrame % totalLoopFrames;

            if(currentLoopFrame < p.initialDelayFrames) {
                // Initial delay, do nothing
                return;
            }

            const animationFrame = currentLoopFrame - p.initialDelayFrames;
            
            const ar = image.width / image.height;
            let iw, ih;
            if (ar >= 1) {
                iw = w * 0.8;
                ih = iw / ar;
            } else {
                ih = h * 0.8;
                iw = ih * ar;
            }
            
            const easeOutBack = (x: number): number => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            };

            let scale = 1.0;
            const animDuration = 20; // in frames
            if (animationFrame < animDuration) {
                const progress = animationFrame / animDuration;
                const easedProgress = easeOutBack(progress);
                scale = 4.0 - 3.0 * easedProgress;
            }

            context.save();
            context.translate(w / 2, h / 2);
            context.rotate(p.angle * Math.PI / 180);
            context.scale(scale, scale);
            context.drawImage(image, -iw / 2, -ih / 2, iw, ih);
            context.restore();

            // Draw echo effect
            if(animationFrame >= animDuration - 5 && animationFrame < animDuration + 10) {
                 const echoFrame = animationFrame - (animDuration - 5);
                 const echoProgress = echoFrame / 15;
                 const echoScale = 1.0 + echoProgress * 0.15;
                 const echoAlpha = 1.0 - echoProgress;
                 
                 context.save();
                 context.globalAlpha = echoAlpha;
                 context.translate(w / 2, h / 2);
                 context.rotate(p.angle * Math.PI / 180);
                 context.scale(echoScale, echoScale);
                 context.drawImage(image, -iw / 2, -ih / 2, iw, ih);
                 context.restore();
            }
        }
        
        render();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [image, effectType, params]);

    return (
        <canvas ref={canvasRef} className="max-w-full max-h-full"></canvas>
    );
};

export default PreviewWindow;
