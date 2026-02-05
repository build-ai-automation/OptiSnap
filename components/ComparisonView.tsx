
import React from 'react';
import { ImageData, ProcessedImageData } from '../types';
import { formatBytes } from '../utils/helpers';
import { Download, ArrowDownToLine, Info } from 'lucide-react';

interface ComparisonViewProps {
  original: ImageData;
  processed: ProcessedImageData;
  onDownload: () => void;
  isProcessing: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ original, processed, onDownload, isProcessing }) => {
  const reduction = original.size > 0 
    ? Math.max(0, ((original.size - processed.size) / original.size) * 100)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      {/* Original Image Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Original</span>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-mono uppercase">
            {original.file.type.split('/')[1] || 'img'}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <img 
            src={original.previewUrl} 
            alt="Original" 
            className="max-w-full max-h-[400px] object-contain shadow-lg rounded"
          />
        </div>
        <div className="p-4 bg-white border-t flex justify-between items-center text-sm">
          <span className="text-gray-500">{original.width} × {original.height} px</span>
          <span className="font-bold text-gray-800">{formatBytes(original.size)}</span>
        </div>
      </div>

      {/* Processed Image Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] z-10 flex items-center justify-center transition-all">
            <div className="bg-white p-4 rounded-full shadow-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
        )}
        <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${isProcessing ? 'opacity-50 animate-pulse' : 'opacity-100'}`}>
            <span className="text-sm font-semibold text-blue-700">Optimized</span>
            {reduction > 0 && (
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                -{reduction.toFixed(1)}%
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-mono uppercase">
            {processed.format.split('/')[1]}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <img 
            src={processed.previewUrl} 
            alt="Processed" 
            className={`max-w-full max-h-[400px] object-contain shadow-lg rounded transition-opacity ${isProcessing ? 'opacity-70' : 'opacity-100'}`}
          />
        </div>
        <div className="p-4 bg-white border-t space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className={`flex items-center gap-1 text-gray-500 transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
               <Info size={14} />
               <span>Quality: {Math.round(processed.quality * 100)}%</span>
            </div>
            <span className={`font-bold text-blue-600 text-lg transition-all ${isProcessing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
              {isProcessing ? 'Calculating...' : formatBytes(processed.size)}
            </span>
          </div>
          <button
            onClick={onDownload}
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 ${
              isProcessing 
                ? 'bg-blue-300 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            }`}
          >
            <ArrowDownToLine size={20} />
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
