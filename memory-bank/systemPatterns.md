## System Patterns

- **Architecture:** Next.js 16 App Router. UI in `src/app/page.tsx` with client components; API routes under `src/app/api`.
- **Backends:**
  - `api/generate` for images using Replicate; model selection via constants in `src/types`.
  - `api/music` for short instrumental tracks using Replicate music model.
- **Prompt strategy:** Anime-specific prefix and negative prompts; background mode injects stronger negative tags.
- **Batching:** Image generation batches up to 4 per call to respect model limits; background removal optional via `lucataco/remove-bg`.
- **State:** Client-side history maintained per session; no persistence beyond session.
- **Secrets:** Replicate API key pulled from `REPLICATE_API_KEY`; music model slug/version optionally from `REPLICATE_MUSIC_MODEL_ID`.


