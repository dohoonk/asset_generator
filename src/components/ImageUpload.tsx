"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export default function ImageUpload({ image, onImageChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    // Check file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload PNG or JPG images only");
      return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        Character Reference <span className="font-normal text-[var(--muted)]">(for consistency)</span>
      </label>
      <p className="text-xs text-[var(--muted)] mb-2">
        Upload your character to generate consistent assets. Use with &quot;Flux Redux&quot; or &quot;SDXL&quot; models.
      </p>

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[var(--primary)] bg-[var(--primary)]/5"
              : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          <div className="text-3xl mb-2">🎭</div>
          <div className="text-sm text-[var(--muted)]">
            Drop character image or click to upload
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">
            PNG, JPG up to 10MB
          </div>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={image}
            alt="Reference"
            className="w-32 h-32 object-cover rounded-xl border border-[var(--border)]"
          />
          <button
            onClick={() => onImageChange(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}




