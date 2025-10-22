
import React from 'react';
import type { EffectType, RotateParams, StampParams } from '../types';
import { generateAnimation } from '../services/animationGenerator';

interface ExportControlsProps {
    image: HTMLImageElement;
    effectType: EffectType;
    params: RotateParams | StampParams;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({ image, effectType, params, isGenerating, setIsGenerating }) => {
    
    const handleExport = async (format: 'gif' | 'apng') => {
        setIsGenerating(true);
        try {
            await generateAnimation(image, effectType, params, format);
        } catch (error) {
            console.error(`Error generating ${format}:`, error);
            alert(`Failed to generate ${format}. Check console for details.`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Export Animation</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => handleExport('gif')}
                    disabled={isGenerating}
                    className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? 'Generating...' : 'Export GIF'}
                </button>
                <button
                    onClick={() => handleExport('apng')}
                    disabled={isGenerating}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? 'Generating...' : 'Export APNG'}
                </button>
            </div>
             {isGenerating && (
                <div className="mt-4 text-center text-sm text-yellow-400">
                    <p>Animation generation can take a moment. Please wait...</p>
                </div>
            )}
        </div>
    );
};

export default ExportControls;
