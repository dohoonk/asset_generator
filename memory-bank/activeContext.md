## Active Context

- Initial memory setup created (no previous memory-bank existed).
- Current issue: music generation endpoint returning Replicate 404 for `meta/musicgen` (from dev log). Chosen fix: set `REPLICATE_MUSIC_MODEL_ID=meta/musicgen:647e79545ee174fa1236444bfe1d80ce6a90d9bc` (latest visible version).
- Focus: document architecture, then address music model configuration/compatibility; retest music generation after setting the env var.


