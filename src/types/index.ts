export interface Model {
  id: string;
  name: string;
  replicateId: string;
  description: string;
  style: string;
  speed: "fast" | "medium" | "slow";
  supportsImage: boolean;
}

export interface GenerationRequest {
  modelId: string;
  prompt: string;
  negativePrompt?: string;
  referenceImage?: string;
  width: number;
  height: number;
  numOutputs: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  modelName: string;
  timestamp: number;
  width: number;
  height: number;
}

export interface HistoryBatch {
  id: string;
  images: GeneratedImage[];
  prompt: string;
  modelName: string;
  timestamp: number;
}

export interface Dimension {
  label: string;
  width: number;
  height: number;
}

export const MODELS: Model[] = [
  // === FLUX MODELS (Recommended - Fast & High Quality) ===
  {
    id: "flux-schnell",
    name: "Flux Schnell",
    replicateId: "black-forest-labs/flux-schnell",
    description: "Fastest Flux model, great quality",
    style: "Versatile",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "flux-dev",
    name: "Flux Dev",
    replicateId: "black-forest-labs/flux-dev",
    description: "High-quality Flux model for development",
    style: "Versatile",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "flux-pro",
    name: "Flux Pro 1.1",
    replicateId: "black-forest-labs/flux-1.1-pro",
    description: "Best quality Flux model",
    style: "Premium",
    speed: "medium",
    supportsImage: false,
  },
  // === STABLE DIFFUSION MODELS (with version hashes) ===
  {
    id: "sdxl",
    name: "SDXL",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    description: "Stable Diffusion XL - high quality",
    style: "Photorealistic",
    speed: "medium",
    supportsImage: true,
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    replicateId: "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    description: "Classic Stable Diffusion model",
    style: "Versatile",
    speed: "fast",
    supportsImage: false,
  },
  // === OTHER HIGH QUALITY MODELS ===
  {
    id: "seedream",
    name: "Seedream 3",
    replicateId: "bytedance/seedream-3",
    description: "Best overall image generation",
    style: "Photorealistic",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "ideogram",
    name: "Ideogram v3 Turbo",
    replicateId: "ideogram-ai/ideogram-v3-turbo",
    description: "Best for images with text",
    style: "Creative",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "recraft-svg",
    name: "Recraft v3 SVG",
    replicateId: "recraft-ai/recraft-v3-svg",
    description: "Best for SVG vector graphics",
    style: "Vector",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "playground",
    name: "Playground v2.5",
    replicateId: "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
    description: "Aesthetic focused generation",
    style: "Aesthetic",
    speed: "medium",
    supportsImage: false,
  },
];

export const DIMENSIONS: Dimension[] = [
  { label: "512 × 512 (Square)", width: 512, height: 512 },
  { label: "768 × 1024 (Portrait)", width: 768, height: 1024 },
  { label: "1024 × 768 (Landscape)", width: 1024, height: 768 },
  { label: "1024 × 1024 (Square HD)", width: 1024, height: 1024 },
];

