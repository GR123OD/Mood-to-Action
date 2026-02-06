
import React from 'react';

interface BiometricSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (val: number) => void;
}

const BiometricSlider: React.FC<BiometricSliderProps> = ({ label, value, min, max, unit, onChange }) => {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-indigo-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
};

export default BiometricSlider;
