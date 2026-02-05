
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageData {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
}

export interface ProcessedImageData {
  blob: Blob;
  previewUrl: string;
  size: number;
  format: ImageFormat;
  quality: number;
}

export interface ProcessingOptions {
  format: ImageFormat;
  quality: number;
}
