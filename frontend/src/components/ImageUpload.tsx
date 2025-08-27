'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Link, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Featured Image", 
  placeholder = "Enter image URL or drag and drop an image",
  className = ""
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get image dimensions
  const getImageDimensions = useCallback((url: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }, []);

  // Update dimensions when value changes
  const updateDimensions = useCallback(async (url: string) => {
    if (url && url.startsWith('http')) {
      try {
        const dims = await getImageDimensions(url);
        setDimensions(dims);
      } catch (error) {
        setDimensions(null);
      }
    } else {
      setDimensions(null);
    }
  }, [getImageDimensions]);

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    updateDimensions(url);
  };

  // Handle file upload
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url || data.secure_url;
      
      onChange(imageUrl);
      await updateDimensions(imageUrl);
      setInputMode('url'); // Switch back to URL mode to show the uploaded URL
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      uploadFile(imageFile);
    } else {
      setUploadError('Please drop an image file');
    }
  }, []);

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Clear image
  const clearImage = () => {
    onChange('');
    setDimensions(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {dimensions && (
            <span className={`ml-2 text-xs ${
              // Check if dimensions are close to recommended (1200x630)
              Math.abs(dimensions.width - 1200) <= 100 && Math.abs(dimensions.height - 630) <= 50
                ? 'text-green-600'
                : 'text-gray-500'
            }`}>
              ({dimensions.width} × {dimensions.height}px)
              {Math.abs(dimensions.width - 1200) <= 100 && Math.abs(dimensions.height - 630) <= 50 && (
                <span className="ml-1">✓</span>
              )}
            </span>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Recommended: 1200 × 630px for optimal display
          </div>
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              inputMode === 'url'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Link className="h-3 w-3 inline mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              inputMode === 'upload'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Upload className="h-3 w-3 inline mr-1" />
            Upload
          </button>
        </div>
      </div>

      {inputMode === 'url' ? (
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={handleUrlChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image preview */}
      {value && (
        <div className="mt-3">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border border-gray-200"
              onLoad={() => updateDimensions(value)}
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
