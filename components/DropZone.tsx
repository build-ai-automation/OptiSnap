
import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="w-full max-w-4xl mx-auto p-12 mt-8 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center gap-4"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
      />
      <div className="bg-white p-4 rounded-full shadow-md text-blue-500 group-hover:scale-110 transition-transform">
        <Upload size={32} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">Choose an image file or drag it here</h3>
        <p className="text-gray-500 mt-1">Supports JPG, PNG, WEBP, GIF, and BMP</p>
      </div>
      <div className="mt-4 flex gap-4 text-xs font-medium text-gray-400">
        <span className="px-3 py-1 bg-white rounded-full border border-gray-100">100% Client-side</span>
        <span className="px-3 py-1 bg-white rounded-full border border-gray-100">Privacy First</span>
        <span className="px-3 py-1 bg-white rounded-full border border-gray-100">Ultra Fast</span>
      </div>
    </div>
  );
};

export default DropZone;
