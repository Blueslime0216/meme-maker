
import React, { useCallback } from 'react';

interface ImageUploaderProps {
    onImageUpload: (image: HTMLImageElement) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    onImageUpload(img);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);

    return (
        <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold mb-2 text-white">Upload Your Image</h2>
            <p className="text-gray-400 mb-6">Drag & drop or click to select a file.</p>
            <label htmlFor="file-upload" className="cursor-pointer bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                Browse File
            </label>
            <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImageUploader;
