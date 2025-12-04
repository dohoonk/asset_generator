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
  // === ANIME SPECIFIC MODELS (Recommended) ===
  {
    id: "animagine-xl-31",
    name: "Animagine XL 3.1",
    replicateId: "cjwbw/animagine-xl-3.1",
    description: "Best anime model - high quality characters",
    style: "Modern Anime",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "animagine-xl-40",
    name: "Animagine XL 4.0",
    replicateId: "aisha-ai-official/animagine-xl-4.0",
    description: "Latest anime model - improved anatomy",
    style: "Modern Anime",
    speed: "medium",
    supportsImage: false,
  },
  // === FLUX MODELS (Versatile - works great with anime prompts) ===
  {
    id: "flux-schnell",
    name: "Flux Schnell",
    replicateId: "black-forest-labs/flux-schnell",
    description: "Fastest model - great for anime with right prompts",
    style: "Versatile",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "flux-dev",
    name: "Flux Dev",
    replicateId: "black-forest-labs/flux-dev",
    description: "High-quality Flux - detailed anime art",
    style: "Versatile",
    speed: "medium",
    supportsImage: false,
  },
  // === STABLE DIFFUSION MODELS ===
  {
    id: "sdxl",
    name: "SDXL",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    description: "Stable Diffusion XL - versatile",
    style: "Versatile",
    speed: "medium",
    supportsImage: true,
  },
  // === OTHER QUALITY MODELS ===
  {
    id: "playground",
    name: "Playground v2.5",
    replicateId: "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
    description: "Aesthetic focused - stylized anime",
    style: "Aesthetic",
    speed: "medium",
    supportsImage: false,
  },
];

// Anime-focused prompt enhancements
export const ANIME_PROMPT_PREFIX = "masterpiece, best quality, very aesthetic, absurdres, anime style, ";
export const ANIME_NEGATIVE_PROMPT = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, realistic, photorealistic, 3d, western style";

export const DIMENSIONS: Dimension[] = [
  { label: "512 × 512 (Square)", width: 512, height: 512 },
  { label: "768 × 1024 (Portrait)", width: 768, height: 1024 },
  { label: "1024 × 768 (Landscape)", width: 1024, height: 768 },
  { label: "1024 × 1024 (Square HD)", width: 1024, height: 1024 },
];

