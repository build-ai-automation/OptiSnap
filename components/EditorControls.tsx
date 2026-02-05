
import React from 'react';
import { ImageFormat } from '../types';
import { Settings2, Zap } from 'lucide-react';

interface EditorControlsProps {
  format: ImageFormat;
  quality: number;
  onFormatChange: (format: ImageFormat) => void;
  onQualityChange: (quality: number) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  format,
  quality,
  onFormatChange,
  onQualityChange,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-1 w-full space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Settings2 size={18} className="text-blue-500" />
            Conversion Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onFormatChange(fmt)}
                className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all ${
                  format === fmt
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {fmt.split('/')[1].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-[2] w-full space-y-4">
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Zap size={18} className="text-yellow-500" />
              Compression Quality
            </label>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            value={quality}
            onChange={(e) => onQualityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
            <span>MAX COMPRESSION</span>
            <span>HIGH QUALITY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorControls;
