import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File | null, imageUrl: string | null) => void;
  currentImageUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, currentImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowEditor(true);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScale(1);
    setRotation(0);
    setShowEditor(false);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCrop = () => {
    if (!canvasRef.current || !selectedFile) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Convert to blob and create new file
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], selectedFile.name, {
            type: selectedFile.type,
          });
          setSelectedFile(croppedFile);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          onImageChange(croppedFile, url);
        }
      }, selectedFile.type);
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const res = await fetch('http://localhost:4000/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      onImageChange(selectedFile, data.url);
      setShowEditor(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block font-semibold mb-2">Upload Diagram (optional):</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Image Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                {showEditor ? 'Hide Editor' : 'Edit Image'}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-64 object-contain rounded"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
            />
          </div>

          {/* Image Editor */}
          {showEditor && (
            <div className="mt-4 p-4 bg-white border rounded-lg">
              <h4 className="font-semibold mb-3">Image Editor</h4>
              
              {/* Scale Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Scale: {scale.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rotation Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCrop}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Apply Changes
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload to Server'}
                </button>
              </div>

              {/* Hidden Canvas for Processing */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-blue-600 text-sm">
          Uploading image to server...
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 