import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onUpload: (file: File) => Promise<void>;
  currentImageUrl?: string;
  className?: string;
  aspectRatio?: "square" | "wide" | "portrait";
  label?: string;
}

const ImageUpload = ({ 
  onUpload, 
  currentImageUrl, 
  className,
  aspectRatio = "square",
  label = "Upload Image"
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
      setImageError(false);
    }
  }, [currentImageUrl]);

  const aspectRatioClasses = {
    square: "aspect-square",
    wide: "aspect-video",
    portrait: "aspect-[3/4]",
  };
  

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    // Create local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setImageError(false);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setIsUploading(true);
      await onUpload(file);
      // Don't clear preview - it will be updated by useEffect when currentImageUrl changes
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", err);
      // Revert to original on error
      setPreview(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = () => {
    setImageError(true);
    console.error("Failed to load image:", preview);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all",
          aspectRatioClasses[aspectRatio],
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          preview && !imageError ? "border-solid border-primary/50" : "",
          className
        )}
      >
        {preview && !imageError ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-muted/20">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </>
            ) : imageError ? (
              <>
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Failed to load image</span>
                <span className="text-xs text-muted-foreground mt-1">Click to try again</span>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs text-muted-foreground mt-1">
                  or drag and drop
                </span>
                <span className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF up to 5MB
                </span>
              </>
            )}
          </div>
        )}

        {/* Overlay buttons - only show when there's a valid preview */}
        {preview && !imageError && !isUploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Upload className="h-4 w-4 mr-1" />
              Change
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;