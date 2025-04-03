// Route: /src/components/analysis/PhotoUpload.tsx
import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { PhotoUploadProps } from '../../models/types';

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelected }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };
  
  const handleFile = (selectedFile: File): void => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        if (onPhotoSelected) {
          onPhotoSelected(selectedFile, result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleClickUpload = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleCameraCapture = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      // Here you would typically open a modal with the camera stream
      // For this example, we'll just log that the camera is accessed
      console.log('Camera accessed');
      
      // Cleanup the stream when done
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };
  
  const handleReset = (): void => {
    setFile(null);
    setPreviewUrl(null);
    if (onPhotoSelected) {
      onPhotoSelected(null, null);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <Card variant="white" className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Upload Your Photo</h3>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors
            ${dragActive ? 'border-accent bg-accent/5' : 'border-gray'}
            ${previewUrl ? 'border-accent' : ''}
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {!previewUrl ? (
            <div className="py-8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto mb-4 text-charcoal"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-charcoal mb-2">
                Drag & drop your photo here, or click to browse
              </p>
              <p className="text-gray text-sm mb-4">
                Use a clear, front-facing photo for best results. JPEG, PNG, or GIF. Max 5MB.
              </p>
              <Button 
                variant="primary" 
                onClick={handleClickUpload}
              >
                Browse Files
              </Button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/gif"
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-md"
              />
              <button
                className="absolute top-2 right-2 bg-error text-white rounded-full p-1"
                onClick={handleReset}
                aria-label="Remove photo"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="secondary" 
            fullWidth
            onClick={handleCameraCapture}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 inline-block" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            Use Camera
          </Button>
          
          <Button 
            variant="primary" 
            fullWidth
            disabled={!file}
            onClick={() => console.log('Analyzing photo...')}
          >
            {previewUrl ? 'Analyze Photo' : 'Upload Photo'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PhotoUpload;