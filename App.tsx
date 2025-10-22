
import React, { useState } from 'react';
import type { EffectType, RotateParams, StampParams } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import EffectSelector from './components/EffectSelector';
import CustomizationPanel from './components/CustomizationPanel';
import PreviewWindow from './components/PreviewWindow';
import ExportControls from './components/ExportControls';
import { DEFAULT_ROTATE_PARAMS, DEFAULT_STAMP_PARAMS } from './constants';

const App: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [effect, setEffect] = useState<EffectType>('rotate');
    const [rotateParams, setRotateParams] = useState<RotateParams>(DEFAULT_ROTATE_PARAMS);
    const [stampParams, setStampParams] = useState<StampParams>(DEFAULT_STAMP_PARAMS);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleImageUpload = (img: HTMLImageElement) => {
        setImage(img);
    };

    const currentParams = effect === 'rotate' ? rotateParams : stampParams;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <EffectSelector selectedEffect={effect} onSelectEffect={setEffect} />
                    {image ? (
                         <CustomizationPanel
                            effect={effect}
                            rotateParams={rotateParams}
                            setRotateParams={setRotateParams}
                            stampParams={stampParams}
                            setStampParams={setStampParams}
                        />
                    ) : (
                        <ImageUploader onImageUpload={handleImageUpload} />
                    )}
                </div>

                <div className="lg:col-span-8 flex flex-col gap-8">
                   <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 aspect-square flex items-center justify-center">
                        {image ? (
                             <PreviewWindow 
                                image={image} 
                                effectType={effect} 
                                params={currentParams} 
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                <p className="text-xl font-medium">Upload an image to start</p>
                                <p>Your live preview will appear here.</p>
                            </div>
                        )}
                   </div>
                   {image && (
                        <ExportControls
                            image={image}
                            effectType={effect}
                            params={currentParams}
                            isGenerating={isGenerating}
                            setIsGenerating={setIsGenerating}
                        />
                   )}
                </div>
            </main>
        </div>
    );
};

export default App;
