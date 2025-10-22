
export type EffectType = 'rotate' | 'stamp';

export type RotationDirection = 'right' | 'left' | 'up' | 'down';

export interface RotateParams {
    direction: RotationDirection;
    speed: number;
    backgroundColor: string;
    isTransparent: boolean;
}

export interface StampParams {
    angle: number;
    initialDelayFrames: number;
    loopDelayMs: number;
}
