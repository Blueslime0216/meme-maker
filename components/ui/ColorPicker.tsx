
import React from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
    return (
        <div className="relative w-full h-12 rounded-lg border-2 border-gray-700 bg-gray-800 flex items-center px-3">
            <div
                className="w-8 h-8 rounded-md border-2 border-gray-600"
                style={{ backgroundColor: value }}
            ></div>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="ml-4 font-mono text-gray-300">{value.toUpperCase()}</span>
        </div>
    );
};

export default ColorPicker;
