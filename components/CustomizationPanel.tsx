
import React from 'react';
import type { EffectType, RotateParams, StampParams, RotationDirection } from '../types';
import Slider from './ui/Slider';
import ColorPicker from './ui/ColorPicker';

interface CustomizationPanelProps {
    effect: EffectType;
    rotateParams: RotateParams;
    setRotateParams: React.Dispatch<React.SetStateAction<RotateParams>>;
    stampParams: StampParams;
    setStampParams: React.Dispatch<React.SetStateAction<StampParams>>;
}

const RotateControls: React.FC<{ params: RotateParams; setParams: React.Dispatch<React.SetStateAction<RotateParams>> }> = ({ params, setParams }) => {
    const directions: { id: RotationDirection; label: string }[] = [
        { id: 'right', label: 'Right' },
        { id: 'left', label: 'Left' },
        { id: 'up', label: 'Up' },
        { id: 'down', label: 'Down' },
    ];
    return (
        <div className="space-y-6">
            <div>
                <label className="font-medium text-gray-300 mb-2 block">Direction</label>
                <div className="grid grid-cols-4 gap-2 bg-gray-900/50 p-1 rounded-lg">
                    {directions.map(dir => (
                        <button key={dir.id} onClick={() => setParams(p => ({ ...p, direction: dir.id }))} className={`px-2 py-1.5 text-sm font-semibold rounded-md transition-colors ${params.direction === dir.id ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'}`}>{dir.label}</button>
                    ))}
                </div>
            </div>
            <Slider label="Speed" min={0.5} max={10} step={0.1} value={params.speed} onChange={v => setParams(p => ({ ...p, speed: v }))} />
            <div>
                <label className="font-medium text-gray-300 mb-2 flex items-center justify-between">
                    Background
                    <div className="flex items-center space-x-2">
                         <span className="text-sm text-gray-400">Transparent</span>
                         <input type="checkbox" checked={params.isTransparent} onChange={e => setParams(p => ({ ...p, isTransparent: e.target.checked }))} className="toggle-checkbox" />
                    </div>
                </label>
                {!params.isTransparent && (
                     <ColorPicker value={params.backgroundColor} onChange={v => setParams(p => ({ ...p, backgroundColor: v }))} />
                )}
            </div>
        </div>
    );
};

const StampControls: React.FC<{ params: StampParams; setParams: React.Dispatch<React.SetStateAction<StampParams>> }> = ({ params, setParams }) => (
    <div className="space-y-6">
        <Slider label="Angle" min={-45} max={45} step={1} value={params.angle} onChange={v => setParams(p => ({ ...p, angle: v }))} unit="°" />
        <Slider label="Initial Delay" min={0} max={30} step={1} value={params.initialDelayFrames} onChange={v => setParams(p => ({ ...p, initialDelayFrames: v }))} unit="frames" />
        <Slider label="Loop Wait Time" min={200} max={5000} step={100} value={params.loopDelayMs} onChange={v => setParams(p => ({ ...p, loopDelayMs: v }))} unit="ms" />
    </div>
);

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ effect, rotateParams, setRotateParams, stampParams, setStampParams }) => {
    return (
         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
             <h3 className="text-xl font-bold mb-6 text-white">Customize Effect</h3>
            {effect === 'rotate' && <RotateControls params={rotateParams} setParams={setRotateParams} />}
            {effect === 'stamp' && <StampControls params={stampParams} setParams={setStampParams} />}
        </div>
    );
};

export default CustomizationPanel;
