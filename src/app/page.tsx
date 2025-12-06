"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Model,
  Dimension,
  GeneratedImage,
  HistoryBatch,
  GenerationType,
  MODELS,
  DIMENSIONS,
} from "@/types";
import ModelSelector from "@/components/ModelSelector";
import PromptInput from "@/components/PromptInput";
import ImageUpload from "@/components/ImageUpload";
import OptionsSelector from "@/components/OptionsSelector";
import GenerateButton from "@/components/GenerateButton";
import ResultsGrid from "@/components/ResultsGrid";
import HistoryDrawer from "@/components/HistoryDrawer";

export default function Home() {
  // Form state
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [dimension, setDimension] = useState<Dimension>(DIMENSIONS[0]); // 1:1 Square default
  const [batchCount, setBatchCount] = useState(1);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [generationType, setGenerationType] = useState<GenerationType>("character");
  const availableModels = useMemo(
    () =>
      generationType === "background"
        ? MODELS.filter((m) => m.supportsBackground !== false)
        : MODELS,
    [generationType]
  );

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryBatch[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentImages([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel.id,
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim() || undefined,
          referenceImage: referenceImage || undefined,
          width: dimension.width,
          height: dimension.height,
          numOutputs: batchCount,
          removeBackground: generationType === "character" ? removeBackground : false,
          generationType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate images");
      }

      const newImages: GeneratedImage[] = data.images.map((url: string, i: number) => ({
        id: `${Date.now()}-${i}`,
        url,
        prompt: prompt.trim(),
        modelName: data.model,
        timestamp: Date.now(),
        width: dimension.width,
        height: dimension.height,
      }));

      setCurrentImages(newImages);

      // Add to history
      const batch: HistoryBatch = {
        id: `batch-${Date.now()}`,
        images: newImages,
        prompt: prompt.trim(),
        modelName: data.model,
        timestamp: Date.now(),
      };
      setHistory((prev) => [batch, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, prompt, negativePrompt, referenceImage, dimension, batchCount, removeBackground, generationType]);

  const handleSelectBatch = (batch: HistoryBatch) => {
    setCurrentImages(batch.images);
  };

  const canGenerate = prompt.trim().length > 0;

  const handleGenerationTypeChange = (type: GenerationType) => {
    setGenerationType(type);

    if (type === "background") {
      setRemoveBackground(false);
      // Backgrounds are usually landscape; nudge to a wide aspect if still square
      if (dimension.label === DIMENSIONS[0].label) {
        setDimension(DIMENSIONS[1]);
      }
    } else {
      // Characters default to square for sprites
      setDimension(DIMENSIONS[0]);
      setRemoveBackground(true);
    }
  };

  // Keep selected model valid for the chosen generation type
  useEffect(() => {
    if (availableModels.length === 0) return;
    const stillValid = availableModels.some((model) => model.id === selectedModel.id);
    if (!stillValid) {
      setSelectedModel(availableModels[0]);
    }
  }, [availableModels, selectedModel.id]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                Anime Asset Generator
              </h1>
              <p className="text-xs text-[var(--muted)]">
                Create beautiful anime images with AI
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Generation Form */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-6 soft-shadow">
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
              models={availableModels}
            />

            <div className="flex flex-col gap-2">
              <label className="section-heading text-sm">
                <span className="text-lg">🎯</span> What are you generating?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["character", "background"] as GenerationType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleGenerationTypeChange(type)}
                    className={`px-4 py-3 rounded-xl border text-left transition-all ${
                      generationType === type
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]"
                        : "border-[var(--border)] hover:border-[var(--primary)]/60 text-[var(--muted)]"
                    }`}
                  >
                    <div className="font-semibold capitalize flex items-center gap-2">
                      <span>{type === "character" ? "👤" : "🏞️"}</span>
                      {type}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {type === "character"
                        ? "Upload a reference and get transparent sprites."
                        : "Generate full background scenes. Keeps the environment."}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <PromptInput
              prompt={prompt}
              negativePrompt={negativePrompt}
              onPromptChange={setPrompt}
              onNegativePromptChange={setNegativePrompt}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                image={referenceImage}
                onImageChange={setReferenceImage}
                mode={generationType}
              />
              <OptionsSelector
                dimension={dimension}
                batchCount={batchCount}
                removeBackground={removeBackground}
                showRemoveBackground={generationType === "character"}
                onDimensionChange={setDimension}
                onBatchCountChange={setBatchCount}
                onRemoveBackgroundChange={setRemoveBackground}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <GenerateButton
              onClick={handleGenerate}
              disabled={!canGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-6 soft-shadow">
            <ResultsGrid
              images={currentImages}
              isLoading={isLoading}
              loadingCount={batchCount}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-[var(--muted)]">
          <p>Powered by Replicate AI Models</p>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectBatch={handleSelectBatch}
      />
    </div>
  );
}
