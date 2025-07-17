/**
 * @fileoverview ImageUpload component for handling image uploads in inspection forms
 * @description Reusable component that handles image file selection, preview, and removal
 */

import React, { useRef } from 'react';
import { Camera, Trash2, Plus } from 'lucide-react';

/**
 * ImageUpload Component
 * @param {Object} props - Component props
 * @param {string} props.section - Section identifier (e.g., 'battery', 'engine')
 * @param {string} [props.field] - Field identifier for tire sections (e.g., 'frontLeft')
 * @param {Array} props.images - Array of current uploaded images
 * @param {Function} props.onImagesUpload - Callback when new images are uploaded
 * @param {Function} props.onImageRemove - Callback when an image is removed
 * @param {string} [props.label] - Custom label for the upload area
 * @param {number} [props.maxImages] - Maximum number of images allowed (default: 5)
 * @returns {JSX.Element} ImageUpload component
 */
const ImageUpload = ({ 
  section, 
  field, 
  images = [], // Default to empty array to prevent undefined errors
  onImagesUpload, 
  onImageRemove, 
  label = "Upload Images",
  maxImages = 5 
}) => {
  const fileInputRef = useRef(null);

  /**
   * Handles file input change event
   * @param {Event} event - File input change event
   */
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImagesUpload(files);
    }
    // Reset input to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Triggers file input click
   */
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handles image removal
   * @param {number} index - Index of image to remove
   */
  const handleRemoveImage = (index) => {
    onImageRemove(index);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={!canAddMore}
      />

      {/* Upload Button */}
      {canAddMore && (
        <button
          type="button"
          onClick={triggerFileInput}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Camera className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            Click to upload images
          </span>
        </button>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Info Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Image Details */}
              <div className="mt-1">
                <p className="text-xs text-gray-600 truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
          
          {/* Add More Button (when space available) */}
          {canAddMore && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {/* Upload Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• Maximum {maxImages} images per section</p>
      </div>
    </div>
  );
};

export default ImageUpload;
