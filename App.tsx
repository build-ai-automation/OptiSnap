
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import EditorControls from './components/EditorControls';
import ComparisonView from './components/ComparisonView';
import { ImageData, ProcessedImageData, ImageFormat } from './types';
import { processImage, getFormatExtension } from './utils/helpers';
import { RefreshCw, Trash2, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImageData | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(0.8);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processedUrlRef = useRef<string | null>(null);

  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage({
        file,
        previewUrl,
        width: img.width,
        height: img.height,
        size: file.size,
      });
      // Smart default: if uploading webp, convert to jpeg, otherwise convert to webp
      setTargetFormat(file.type === 'image/webp' ? 'image/jpeg' : 'image/webp');
    };
    img.src = previewUrl;
  };

  const performProcessing = useCallback(async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    try {
      const { blob, url } = await processImage(originalImage.file, targetFormat, quality);
      
      // Cleanup previous processed URL via ref to avoid state-dependency loop
      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
      }
      processedUrlRef.current = url;

      setProcessedImage({
        blob,
        previewUrl: url,
        size: blob.size,
        format: targetFormat,
        quality: quality,
      });
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, targetFormat, quality]); // Removed processedImage dependency

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (originalImage) {
      debounceRef.current = setTimeout(() => {
        performProcessing();
      }, 100); // Snappier response
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [originalImage, targetFormat, quality, performProcessing]);

  const handleDownload = () => {
    if (!processedImage || !originalImage) return;
    
    const link = document.createElement('a');
    const extension = getFormatExtension(processedImage.format);
    const originalName = originalImage.file.name.split('.').slice(0, -1).join('.');
    
    link.href = processedImage.previewUrl;
    link.download = `${originalName}-optisnap.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (originalImage) URL.revokeObjectURL(originalImage.previewUrl);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    processedUrlRef.current = null;
    setOriginalImage(null);
    setProcessedImage(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        {!originalImage ? (
          <div className="py-12 md:py-20 animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Optimize images <span className="text-blue-600">instantly.</span>
              </h2>
              <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                Professional-grade image conversion and compression directly in your browser. 
                Private, secure, and fast.
              </p>
            </div>
            
            <DropZone onFileSelect={handleFileSelect} />
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto md:mx-0">
                  <RefreshCw size={20} />
                </div>
                <h4 className="font-bold text-gray-800">Smart Conversion</h4>
                <p className="text-sm text-gray-500">Easily switch between WebP, PNG, and JPG formats to match your specific needs.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto md:mx-0">
                  <Zap size={20} />
                </div>
                <h4 className="font-bold text-gray-800">Advanced Compression</h4>
                <p className="text-sm text-gray-500">Our algorithm significantly reduces file size while maintaining pixel-perfect clarity.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto md:mx-0">
                  <RefreshCw size={20} className="rotate-90" />
                </div>
                <h4 className="font-bold text-gray-800">100% Client-Side</h4>
                <p className="text-sm text-gray-500">Your images never leave your computer. Processing happens entirely in your local browser.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 truncate max-w-md">
                  Processing: {originalImage.file.name}
                </h2>
                <p className="text-gray-500">Adjust the settings below to optimize your result.</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100"
              >
                <Trash2 size={18} />
                Remove File
              </button>
            </div>

            <EditorControls
              format={targetFormat}
              quality={quality}
              onFormatChange={setTargetFormat}
              onQualityChange={setQuality}
            />

            {processedImage && (
              <ComparisonView
                original={originalImage}
                processed={processedImage}
                onDownload={handleDownload}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 px-4 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-gray-400 font-medium tracking-wider uppercase">
          <div className="flex gap-4">
            <span>Built with HTML5 Canvas API</span>
            <span className="hidden md:inline">No Server Uploads</span>
          </div>
          <div className="text-gray-500">
            © 2024 OptiSnap Pro • Privacy Guaranteed
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
