## Progress

- **Working:** Image generation flow with multiple curated Replicate models; anime prompt defaults; optional reference images; batch generation with history and downloads; background removal option.
- **Issues:** Music generation was failing with 404 when using default `meta/musicgen`. Selected a concrete version slug: `meta/musicgen:647e79545ee174fa1236444bfe1d80ce6a90d9bc`.
- **Next Steps:** Set `REPLICATE_MUSIC_MODEL_ID` to the slug above, restart dev server, and re-run `/api/music` via UI to confirm success.


