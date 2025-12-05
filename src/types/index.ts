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
  // === CHARACTER REFERENCE MODELS (Use with reference image) ===
  {
    id: "flux-redux",
    name: "Flux Redux (Character Ref)",
    replicateId: "black-forest-labs/flux-redux-dev",
    description: "Best for character consistency - keeps character features",
    style: "Character Reference",
    speed: "medium",
    supportsImage: true,
  },
  {
    id: "sdxl",
    name: "SDXL (img2img)",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    description: "Use reference as starting point",
    style: "Versatile",
    speed: "medium",
    supportsImage: true,
  },
  // === ANIME SPECIFIC MODELS (Text to Image) ===
  {
    id: "animagine-xl-31",
    name: "Animagine XL 3.1",
    replicateId: "cjwbw/animagine-xl-3.1:6afe2e6b27dad2d6f480b59195c221884b6acc589ff4d05ff0e5fc058690fbb9",
    description: "Best anime model - high quality characters",
    style: "Modern Anime",
    speed: "medium",
    supportsImage: false,
  },
  {
    id: "anything-v4",
    name: "Anything V4",
    replicateId: "cjwbw/anything-v4.0:42a996d39a96aedc57b2e0aa8105dea39c9c89d9d266caf6bb4327a1c191b061",
    description: "Versatile anime style generator",
    style: "Classic Anime",
    speed: "fast",
    supportsImage: false,
  },
  {
    id: "dreamshaper-xl",
    name: "DreamShaper XL",
    replicateId: "lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615",
    description: "Fantasy and dreamy anime styles",
    style: "Fantasy Anime",
    speed: "fast",
    supportsImage: false,
  },
  // === FLUX MODELS (Fast & Versatile) ===
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
];

// Anime-focused prompt enhancements
export const ANIME_PROMPT_PREFIX = "masterpiece, best quality, very aesthetic, absurdres, anime style, ";
export const ANIME_NEGATIVE_PROMPT = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, realistic, photorealistic, 3d, western style";

export const DIMENSIONS: Dimension[] = [
  { label: "1:1 (Square)", width: 1024, height: 1024 },
  { label: "16:9 (Landscape)", width: 1344, height: 768 },
  { label: "9:16 (Portrait)", width: 768, height: 1344 },
];

