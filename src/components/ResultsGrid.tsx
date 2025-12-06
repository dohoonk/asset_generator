"use client";

import { useState } from "react";
import { GeneratedImage } from "@/types";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ResultsGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
  loadingCount: number;
}

export default function ResultsGrid({ images, isLoading, loadingCount }: ResultsGridProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anime-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const downloadAllImages = async () => {
    if (images.length === 0) return;
    
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      
      await Promise.all(
        images.map(async (image, index) => {
          try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            zip.file(`anime-${index + 1}.png`, blob);
          } catch (error) {
            console.error(`Failed to add image ${index + 1}:`, error);
          }
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `anime-batch-${Date.now()}.zip`);
    } catch (error) {
      console.error("Failed to create zip:", error);
    } finally {
      setDownloadingAll(false);
    }
  };

  if (images.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎨</div>
        <div className="text-[var(--muted)] text-lg">
          Your generated images will appear here
        </div>
        <div className="text-[var(--muted)] text-sm mt-2">
          Select a model, enter a prompt, and click Generate
        </div>
      </div>
    );
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Generated Images</h2>
          {images.length > 1 && (
            <button
              onClick={downloadAllImages}
              disabled={downloadingAll}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {downloadingAll ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating ZIP...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: loadingCount }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="aspect-square rounded-xl skeleton"
            />
          ))}

        {/* Generated images */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(image)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                <div className="text-white text-xs truncate max-w-[70%]">
                  {image.modelName}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(image);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => downloadImage(selectedImage)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/50 backdrop-blur-sm rounded-xl text-white">
              <div className="text-sm opacity-75">{selectedImage.modelName}</div>
              <div className="text-sm mt-1 line-clamp-2">{selectedImage.prompt}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





