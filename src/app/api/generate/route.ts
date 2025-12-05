import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { MODELS, ANIME_PROMPT_PREFIX, ANIME_NEGATIVE_PROMPT } from "@/types";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelId, prompt, negativePrompt, referenceImage, width, height, numOutputs } = body;

    if (!process.env.REPLICATE_API_KEY) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    if (!prompt || !modelId) {
      return NextResponse.json(
        { error: "Prompt and model are required" },
        { status: 400 }
      );
    }

    const model = MODELS.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json(
        { error: "Invalid model selected" },
        { status: 400 }
      );
    }

    // Determine model type
    const isFluxRedux = model.replicateId.includes("flux-redux");
    const isFluxModel = model.replicateId.startsWith("black-forest-labs/flux") && !isFluxRedux;
    const isSDXLModel = model.replicateId.startsWith("stability-ai/sdxl");
    const isPhotoMaker = model.replicateId.includes("photomaker");
    const isPhotoMakerStyle = model.replicateId.includes("photomaker-style");
    const isInstantID = model.replicateId.includes("instant-id");

    // Build the input based on the model
    const input: Record<string, unknown> = {};

    // Check if model requires image but none provided
    if (model.supportsImage && !referenceImage && (isFluxRedux || isPhotoMaker || isInstantID)) {
      return NextResponse.json(
        { error: `${model.name} requires a reference image. Please upload a character image.` },
        { status: 400 }
      );
    }

    if (isFluxRedux && referenceImage) {
      // Flux Redux: Image variations - preserves character features
      input.redux_image = referenceImage;
      input.prompt = `${ANIME_PROMPT_PREFIX}same character, ${prompt}`;
      input.num_outputs = Math.min(numOutputs, 4);
      input.guidance = 3;
      input.aspect_ratio = width === height ? "1:1" : width > height ? "16:9" : "9:16";
    } else if (isPhotoMakerStyle && referenceImage) {
      // PhotoMaker Style: Character + style transfer
      // Valid styles: "(No style)", "Cinematic", "Disney Charactor", "Digital Art", 
      // "Photographic (Default)", "Fantasy art", "Neonpunk", "Enhance", "Comic book", "Lowpoly", "Line art"
      input.input_image = referenceImage;
      input.prompt = `img, ${ANIME_PROMPT_PREFIX}same person, ${prompt}`;
      input.style_name = "Comic book"; // Closest to anime style
      input.num_outputs = Math.min(numOutputs, 4);
      input.num_steps = 50;
      input.style_strength_ratio = 35;
      input.guidance_scale = 5;
      input.negative_prompt = ANIME_NEGATIVE_PROMPT;
    } else if (isPhotoMaker && referenceImage) {
      // PhotoMaker: Character identity consistency
      input.input_image = referenceImage;
      input.prompt = `img, ${ANIME_PROMPT_PREFIX}same person, ${prompt}`;
      input.num_outputs = Math.min(numOutputs, 4);
      input.num_steps = 50;
      input.guidance_scale = 5;
      input.negative_prompt = ANIME_NEGATIVE_PROMPT;
    } else if (isInstantID && referenceImage) {
      // InstantID: Realistic face/character consistency
      input.image = referenceImage;
      input.prompt = `${ANIME_PROMPT_PREFIX}same person, ${prompt}`;
      input.num_outputs = Math.min(numOutputs, 4);
      input.negative_prompt = ANIME_NEGATIVE_PROMPT;
      input.ip_adapter_scale = 0.8;
      input.guidance_scale = 5;
    } else if (isFluxModel) {
      // Regular Flux models use aspect_ratio instead of width/height
      input.prompt = `${ANIME_PROMPT_PREFIX}${prompt}`;
      input.num_outputs = Math.min(numOutputs, 4);
      input.aspect_ratio = width === height ? "1:1" : width > height ? "16:9" : "9:16";
    } else if (isSDXLModel && referenceImage) {
      // SDXL img2img mode for character reference
      input.prompt = `${ANIME_PROMPT_PREFIX}same character, consistent appearance, ${prompt}`;
      input.image = referenceImage;
      input.prompt_strength = 0.7;
      input.num_outputs = numOutputs;
      input.width = width;
      input.height = height;
      input.negative_prompt = `${ANIME_NEGATIVE_PROMPT}, ${negativePrompt || ""}`;
    } else {
      // Standard text-to-image mode
      input.prompt = `${ANIME_PROMPT_PREFIX}${prompt}`;
      input.width = width;
      input.height = height;
      input.num_outputs = numOutputs;
      
      // Add negative prompt for non-Flux models
      if (negativePrompt) {
        input.negative_prompt = `${ANIME_NEGATIVE_PROMPT}, ${negativePrompt}`;
      } else {
        input.negative_prompt = ANIME_NEGATIVE_PROMPT;
      }
    }

    // Generate images
    const outputs: string[] = [];
    
    // Most character reference models support up to 4 outputs
    const maxBatchSize = 4;
    const batchCount = Math.ceil(numOutputs / maxBatchSize);

    for (let i = 0; i < batchCount; i++) {
      const batchSize = Math.min(maxBatchSize, numOutputs - outputs.length);
      input.num_outputs = batchSize;

      try {
        const output = await replicate.run(model.replicateId as `${string}/${string}` | `${string}/${string}:${string}`, {
          input,
        });

        if (Array.isArray(output)) {
          outputs.push(...output.map((o) => (typeof o === "string" ? o : String(o))));
        } else if (typeof output === "string") {
          outputs.push(output);
        } else if (output && typeof output === "object") {
          // Handle ReadableStream or other output types
          const result = output as { url?: string } | string[];
          if (Array.isArray(result)) {
            outputs.push(...result);
          } else if ("url" in result && result.url) {
            outputs.push(result.url);
          }
        }
      } catch (modelError) {
        // Only log the error message, NOT the full error object (which contains API keys in headers)
        const errorMessage = modelError instanceof Error ? modelError.message : "Unknown error";
        console.error(`Error with model ${model.replicateId}: ${errorMessage}`);
        
        // Return specific error messages for common issues
        if (errorMessage.includes("could not find a face")) {
          return NextResponse.json(
            { error: "No face detected in your image. Please upload a clear photo with a visible face for InstantID." },
            { status: 400 }
          );
        }
        if (errorMessage.includes("redux_image is required")) {
          return NextResponse.json(
            { error: "Please upload a reference image for Flux Redux." },
            { status: 400 }
          );
        }
        // Continue with other batches if one fails
      }
    }

    if (outputs.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate images. Please try a different model." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: outputs.slice(0, numOutputs),
      model: model.name,
    });
  } catch (error) {
    // Only log the error message, NOT the full error object (which may contain sensitive data)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Generation error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to generate images. Please try again." },
      { status: 500 }
    );
  }
}

