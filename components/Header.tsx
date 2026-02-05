
import React from 'react';
import { Camera, Layers } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg text-white transform group-hover:rotate-12 transition-transform">
            <Layers size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Opti<span className="text-blue-600">Snap</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Converter</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Compressor</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
