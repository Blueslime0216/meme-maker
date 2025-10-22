
import React from 'react';

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, onChange }) => {
    return (
        <div>
            <div className="flex justify-between items-baseline mb-2">
                <label className="font-medium text-gray-300">{label}</label>
                <span className="text-sm font-mono bg-gray-900/50 text-purple-300 px-2 py-0.5 rounded">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
            />
        </div>
    );
};

export default Slider;
