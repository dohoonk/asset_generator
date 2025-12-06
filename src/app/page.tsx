"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Model,
  Dimension,
  GeneratedImage,
  GeneratedTrack,
  HistoryBatch,
  GenerationType,
  MODELS,
  MUSIC_MODELS,
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
  const [activeTab, setActiveTab] = useState<"image" | "music">("image");
  const [musicPrompt, setMusicPrompt] = useState("");
  const [musicDuration, setMusicDuration] = useState(15);
  const [musicModelId, setMusicModelId] = useState(MUSIC_MODELS[0].id);
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
  const [musicTracks, setMusicTracks] = useState<GeneratedTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);

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
  const canGenerateMusic = musicPrompt.trim().length > 0 && !isMusicLoading;

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

  const handleGenerateMusic = useCallback(async () => {
    if (!musicPrompt.trim()) {
      setMusicError("Please enter a prompt for the track");
      return;
    }
    setMusicError(null);
    setIsMusicLoading(true);
    try {
      const response = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: musicPrompt.trim(),
          duration: musicDuration,
          modelId: musicModelId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate music");
      }

      const tracks: GeneratedTrack[] = data.tracks.map((t: { url: string; model: string; duration: number }, i: number) => ({
        id: `${Date.now()}-${i}`,
        url: t.url,
        prompt: musicPrompt.trim(),
        modelName: t.model,
        duration: t.duration,
        timestamp: Date.now(),
      }));
      setMusicTracks((prev) => [...tracks, ...prev]);
    } catch (err) {
      setMusicError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsMusicLoading(false);
    }
  }, [musicPrompt, musicDuration, musicModelId]);

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
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
              activeTab === "image"
                ? "border-[var(--primary)] text-[var(--foreground)] bg-[var(--primary)]/10"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/60"
            }`}
          >
            🎨 Images
          </button>
          <button
            onClick={() => setActiveTab("music")}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
              activeTab === "music"
                ? "border-[var(--secondary)] text-[var(--foreground)] bg-[var(--secondary)]/10"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/60"
            }`}
          >
            🎵 Music
          </button>
        </div>

        {activeTab === "image" ? (
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
                <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-red-100 text-sm animate-fade-in">
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
        ) : (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-6 soft-shadow">
              <div className="flex flex-col gap-2">
                <label className="section-heading text-sm">
                  <span className="text-lg">🎵</span> Generate background music
                </label>
                <p className="text-xs text-[var(--muted)]">
                  Describe the vibe. We’ll create instrumental, loop-friendly background music without vocals.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-[var(--foreground)]">
                  Music prompt
                </label>
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="chill lo-fi beats with soft synth pads, cozy coffee shop"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl resize-none h-28 focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all placeholder:text-[var(--muted)]"
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{musicPrompt.length}/500</span>
                  <span>Instrumental only · Loop-friendly</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Duration</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={5}
                      max={30}
                      value={musicDuration}
                      onChange={(e) => setMusicDuration(Number(e.target.value))}
                      className="w-full accent-[var(--secondary)]"
                    />
                    <span className="w-12 text-sm text-right text-[var(--foreground)]">{musicDuration}s</span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">5–30 seconds. Shorter is faster.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Model</label>
                  <select
                    value={musicModelId}
                    onChange={(e) => setMusicModelId(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all appearance-none cursor-pointer"
                  >
                    {MUSIC_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[var(--muted)]">
                    Set REPLICATE_MUSIC_MODEL_ID to override the default.
                  </p>
                </div>
              </div>

              {musicError && (
                <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-red-100 text-sm animate-fade-in">
                  {musicError}
                </div>
              )}

              <GenerateButton
                onClick={handleGenerateMusic}
                disabled={!canGenerateMusic}
                isLoading={isMusicLoading}
              />
            </div>

            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 soft-shadow space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>🎧</span> Generated tracks
              </h2>
              {musicTracks.length === 0 ? (
                <div className="text-[var(--muted)] text-sm">Your generated tracks will appear here.</div>
              ) : (
                <div className="space-y-3">
                  {musicTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex flex-col gap-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl"
                    >
                      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                        <span className="font-semibold text-[var(--foreground)]">{track.modelName}</span>
                        <span>{track.duration}s</span>
                      </div>
                      <div className="text-xs text-[var(--muted)] line-clamp-2">{track.prompt}</div>
                      <audio controls src={track.url} className="w-full" />
                      <div className="flex gap-2">
                        <a
                          href={track.url}
                          download
                          className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--secondary)]/60 transition-colors"
                        >
                          Download
                        </a>
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)]/60 transition-colors"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
