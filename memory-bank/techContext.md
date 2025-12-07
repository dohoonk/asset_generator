## Tech Context

- **Framework:** Next.js 16 (App Router) with React 19, TypeScript.
- **Styling:** Tailwind CSS v4.
- **AI Integration:** Replicate SDK (`replicate` v1.4). Env vars:
  - `REPLICATE_API_KEY` (required)
  - `REPLICATE_MUSIC_MODEL_ID` (optional override; default currently `meta/musicgen`)
- **Build/Tooling:** ESLint 9 with Next config; npm scripts `dev`, `build`, `start`, `lint`, `test:models`.
- **Assets:** Session history client-side; downloads via FileSaver/JSZip.


