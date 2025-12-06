import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { MUSIC_MODELS } from "@/types";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration, modelId } = body as { prompt?: string; duration?: number; modelId?: string };

    if (!process.env.REPLICATE_API_KEY) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 });
    }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = MUSIC_MODELS.find((m) => m.id === modelId) || MUSIC_MODELS[0];

    if (!model.replicateId) {
      return NextResponse.json(
        {
          error:
            "No music model configured. Set REPLICATE_MUSIC_MODEL_ID to a valid Replicate music model (e.g., meta/musicgen) in your environment.",
        },
        { status: 500 }
      );
    }
    const seconds = Math.min(30, Math.max(5, Math.round(duration || 15)));

    const input: Record<string, unknown> = {
      prompt: `${prompt.trim()}, instrumental background music, no vocals, seamless, loop-friendly`,
      duration: seconds,
    };

    const output = await replicate.run(
      model.replicateId as `${string}/${string}` | `${string}/${string}:${string}`,
      {
        input,
      }
    );

    const urls: string[] = [];
    if (Array.isArray(output)) {
      urls.push(
        ...output.map((o) => {
          if (typeof o === "string") return o;
          if (o && typeof o === "object" && typeof (o as { url?: () => URL }).url === "function") {
            const urlObj = (o as { url: () => URL }).url();
            return urlObj.href || urlObj.toString();
          }
          return String(o);
        })
      );
    } else if (typeof output === "string") {
      urls.push(output);
    } else if (output && typeof output === "object") {
      if (typeof (output as { url?: () => URL }).url === "function") {
        const urlObj = (output as { url: () => URL }).url();
        urls.push(urlObj.href || urlObj.toString());
      } else {
        urls.push(String(output));
      }
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "Failed to generate music. Try another prompt or model." }, { status: 500 });
    }

    return NextResponse.json({
      tracks: urls.map((url) => ({
        url,
        model: model.name,
        duration: seconds,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Music generation error:", message);

    if (message.includes("404") || message.toLowerCase().includes("not found")) {
      return NextResponse.json(
        {
          error:
            "The selected music model was not found on Replicate. Set REPLICATE_MUSIC_MODEL_ID to a valid music model (e.g., meta/musicgen or your own).",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to generate music. Please try again." }, { status: 500 });
  }
}

