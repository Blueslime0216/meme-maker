
import type { RotateParams, StampParams } from './types';

export const DEFAULT_ROTATE_PARAMS: RotateParams = {
    direction: 'right',
    speed: 2,
    backgroundColor: '#000000',
    isTransparent: true,
};

export const DEFAULT_STAMP_PARAMS: StampParams = {
    angle: -10,
    initialDelayFrames: 5,
    loopDelayMs: 1000,
};

export const PREVIEW_CANVAS_SIZE = 512;
export const EXPORT_CANVAS_SIZE = 512;
export const EXPORT_FRAME_RATE = 30;
