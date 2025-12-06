export interface Model {
  id: string;
  name: string;
  replicateId: string;
  description: string;
  style: string;
  speed: "fast" | "medium" | "slow";
  supportsImage: boolean;
  supportsBackground?: boolean;
}

export type GenerationType = "character" | "background";
export type MusicGenerationType = "music";

export interface GenerationRequest {
  modelId: string;
  prompt: string;
  negativePrompt?: string;
  referenceImage?: string;
  width: number;
  height: number;
  numOutputs: number;
  removeBackground?: boolean;
  generationType?: GenerationType;
}

export interface MusicRequest {
  prompt: string;
  duration?: number;
  modelId?: string;
}

export interface GeneratedTrack {
  id: string;
  url: string;
  prompt: string;
  modelName: string;
  duration: number;
  timestamp: number;
}

// Background removal model
export const REMOVE_BG_MODEL = "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1";

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
    name: "Flux Redux",
    replicateId: "black-forest-labs/flux-redux-dev",
    description: "Image variations - keeps character features",
    style: "Character Reference",
    speed: "medium",
    supportsImage: true,
    supportsBackground: false,
  },
  {
    id: "photomaker",
    name: "PhotoMaker",
    replicateId: "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
    description: "Best for consistent character identity",
    style: "Character Reference",
    speed: "medium",
    supportsImage: true,
    supportsBackground: false,
  },
  {
    id: "photomaker-style",
    name: "PhotoMaker Style",
    replicateId: "tencentarc/photomaker-style:467d062309da518648ba89d226490e02b8ed09b5abc15026e54e31c5a8cd0769",
    description: "Character + comic/illustration style",
    style: "Character + Style",
    speed: "medium",
    supportsImage: true,
    supportsBackground: false,
  },
  {
    id: "instant-id",
    name: "InstantID",
    replicateId: "zsxkib/instant-id:2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
    description: "Needs face photo - realistic consistency",
    style: "Face Reference",
    speed: "medium",
    supportsImage: true,
    supportsBackground: false,
  },
  {
    id: "sdxl",
    name: "SDXL (img2img)",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    description: "Use reference as starting point",
    style: "Versatile",
    speed: "medium",
    supportsImage: true,
    supportsBackground: true,
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
    supportsBackground: true,
  },
  {
    id: "anything-v4",
    name: "Anything V4",
    replicateId: "cjwbw/anything-v4.0:42a996d39a96aedc57b2e0aa8105dea39c9c89d9d266caf6bb4327a1c191b061",
    description: "Versatile anime style generator",
    style: "Classic Anime",
    speed: "fast",
    supportsImage: false,
    supportsBackground: true,
  },
  {
    id: "dreamshaper-xl",
    name: "DreamShaper XL",
    replicateId: "lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615",
    description: "Fantasy and dreamy anime styles",
    style: "Fantasy Anime",
    speed: "fast",
    supportsImage: false,
    supportsBackground: true,
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
    supportsBackground: true,
  },
  {
    id: "flux-dev",
    name: "Flux Dev",
    replicateId: "black-forest-labs/flux-dev",
    description: "High-quality Flux - detailed anime art",
    style: "Versatile",
    speed: "medium",
    supportsImage: false,
    supportsBackground: true,
  },
];

export interface MusicModel {
  id: string;
  name: string;
  replicateId: string;
  description: string;
}

export const MUSIC_MODELS: MusicModel[] = [
  {
    id: "musicgen",
    name: "MusicGen (instrumental)",
    replicateId: process.env.REPLICATE_MUSIC_MODEL_ID || "meta/musicgen",
    description: "Prompt-to-music, best for instrumental BG loops",
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

