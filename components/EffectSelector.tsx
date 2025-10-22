
import React from 'react';
import type { EffectType } from '../types';
import { RotateIcon } from './icons/RotateIcon';
import { StampIcon } from './icons/StampIcon';

interface EffectSelectorProps {
    selectedEffect: EffectType;
    onSelectEffect: (effect: EffectType) => void;
}

const effects: { id: EffectType; name: string; icon: React.ReactNode }[] = [
    { id: 'rotate', name: 'Rotating Image', icon: <RotateIcon /> },
    { id: 'stamp', name: 'Stamp Effect', icon: <StampIcon /> },
];

const EffectSelector: React.FC<EffectSelectorProps> = ({ selectedEffect, onSelectEffect }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-4 px-2">Choose Animation Effect</h3>
            <div className="grid grid-cols-2 gap-3">
                {effects.map((effect) => (
                    <button
                        key={effect.id}
                        onClick={() => onSelectEffect(effect.id)}
                        className={`p-4 rounded-xl text-center transition-all duration-200 ${
                            selectedEffect === effect.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-gray-700/50 hover:bg-gray-700'
                        }`}
                    >
                        <div className="w-8 h-8 mx-auto mb-2">{effect.icon}</div>
                        <span className="font-semibold text-sm">{effect.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EffectSelector;
