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
  // === STABLE DIFFUSION MODELS ===
  {
    id: "sdxl",
    name: "SDXL",
    replicateId: "stability-ai/sdxl",
    description: "Stable Diffusion XL - high quality",
    style: "Photorealistic",
    speed: "medium",
    supportsImage: true,
  },
  {
    id: "sd3.5-large",
    name: "SD 3.5 Large",
    replicateId: "stability-ai/stable-diffusion-3.5-large",
    description: "Latest SD with fine details",
    style: "Photorealistic",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "sd3.5-large-turbo",
    name: "SD 3.5 Large Turbo",
    replicateId: "stability-ai/stable-diffusion-3.5-large-turbo",
    description: "Fast SD 3.5 variant",
    style: "Photorealistic",
    speed: "fast",
    supportsImage: false,
  },
  // === ANIME SPECIFIC MODELS ===
  {
    id: "animagine-xl-4",
    name: "Animagine XL 4.0",
    replicateId: "cagliostrolab/animagine-xl-4.0",
    description: "Latest high-quality anime model",
    style: "Modern anime",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "niji-se",
    name: "Niji SE",
    replicateId: "lucataco/niji-se",
    description: "Anime art generator",
    style: "Anime",
    speed: "fast",
    supportsImage: false,
  },
  // === ARTISTIC MODELS ===
  {
    id: "dreamshaper-xl",
    name: "DreamShaper XL",
    replicateId: "lucataco/dreamshaper-xl-turbo",
    description: "Fantasy and dreamy styles",
    style: "Fantasy",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "juggernaut-xl",
    name: "Juggernaut XL",
    replicateId: "lucataco/juggernaut-xl-v9",
    description: "Highly detailed photorealistic",
    style: "Photorealistic",
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

