import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { MODELS } from "@/types";

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

    // Build the input based on the model
    const input: Record<string, unknown> = {
      prompt: `anime style, ${prompt}`,
      width,
      height,
    };

    // Add negative prompt if provided
    if (negativePrompt) {
      input.negative_prompt = negativePrompt;
    }

    // Add reference image if provided and model supports it
    if (referenceImage && model.supportsImage) {
      input.image = referenceImage;
    }

    // Handle different models' parameter names
    const isFluxModel = model.replicateId.startsWith("black-forest-labs/flux");
    const isSD35Model = model.replicateId.includes("stable-diffusion-3.5");
    
    if (isFluxModel) {
      // Flux models use aspect_ratio instead of width/height
      input.num_outputs = Math.min(numOutputs, 4);
      input.aspect_ratio = width === height ? "1:1" : width > height ? "16:9" : "9:16";
      delete input.width;
      delete input.height;
      delete input.negative_prompt; // Flux doesn't support negative prompts
    } else if (isSD35Model) {
      // SD 3.5 models
      input.num_outputs = numOutputs;
      input.output_format = "webp";
      if (negativePrompt) {
        input.negative_prompt = negativePrompt;
      }
    } else if (model.replicateId === "stability-ai/sdxl") {
      input.num_outputs = numOutputs;
      if (negativePrompt) {
        input.negative_prompt = `lowres, bad anatomy, bad hands, ${negativePrompt}`;
      } else {
        input.negative_prompt = "lowres, bad anatomy, bad hands, text, error, missing fingers";
      }
    } else {
      // Default handling for most models (anime models, dreamshaper, etc.)
      input.num_outputs = numOutputs;
      if (!negativePrompt) {
        input.negative_prompt = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality";
      }
    }

    // Generate images
    const outputs: string[] = [];
    
    // Check if model supports multiple outputs - Flux models support up to 4
    const maxBatchSize = isFluxModel ? 4 : numOutputs;
    const batchCount = Math.ceil(numOutputs / maxBatchSize);

    for (let i = 0; i < batchCount; i++) {
      const batchSize = Math.min(maxBatchSize, numOutputs - outputs.length);
      input.num_outputs = batchSize;

      try {
        const output = await replicate.run(model.replicateId as `${string}/${string}`, {
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

