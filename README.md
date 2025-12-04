# 🎨 Anime Asset Generator

A beautiful web application for generating anime-style images using AI models hosted on Replicate. **Built specifically for Visual Novel game developers** who need to quickly generate character sprites, backgrounds, and scene assets for their games.

![Anime Asset Generator UI](./screenshot.png)

## 🎮 Perfect for Visual Novel Development

This tool is designed to help visual novel creators:
- Generate **character portraits** and sprites with consistent anime styling
- Create **background scenes** for different game locations
- Produce **CG illustrations** for key story moments
- Rapidly prototype visual assets during game development

## ✨ Features

- **6 Anime-Focused AI Models** - Choose from dedicated anime models like Animagine XL, plus versatile models like Flux
- **Customizable Prompts** - Enter detailed prompts with optional negative prompts to refine your results
- **Reference Image Upload** - Upload style reference images (PNG/JPG, up to 10MB)
- **Multiple Dimensions** - Select from 512×512, 768×1024, 1024×768, or 1024×1024
- **Batch Generation** - Generate 1-10 images at once
- **Session History** - Access your generated images from the session history drawer
- **Download Options** - Download individual images or all images as a ZIP file
- **Beautiful UI** - Clean, modern anime-inspired design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Replicate](https://replicate.com) account with API access

### Installation

1. Clone the repository:
```bash
cd anime-asset-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
REPLICATE_API_KEY=your_replicate_api_key_here
```

Get your API token from [Replicate Account Settings](https://replicate.com/account/api-tokens).

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. **Select a Model** - Click the dropdown to choose from 10 anime-focused AI models
2. **Enter Your Prompt** - Describe the image you want to generate (e.g., "a beautiful anime girl with long silver hair, cherry blossoms falling")
3. **Optional Settings**:
   - Add a negative prompt to exclude certain elements
   - Upload a reference image for style inspiration
   - Choose your desired image dimensions
   - Select how many images to generate (1-10)
4. **Generate** - Click the "Generate Images" button
5. **Download** - Click on images to view full-size, or download individually/as ZIP

## 🎨 Available Models

| Model | Style | Speed | Best For |
|-------|-------|-------|----------|
| **Animagine XL 3.1** | Modern Anime | Medium | Character sprites & portraits |
| **Animagine XL 4.0** | Modern Anime | Medium | High-quality anime with better anatomy |
| Flux Schnell | Versatile | Fast | Quick anime iterations |
| Flux Dev | Versatile | Medium | Detailed anime art |
| SDXL | Versatile | Medium | Backgrounds & scenes |
| Playground v2.5 | Aesthetic | Medium | Stylized anime art |

### 🎯 Anime-Optimized Prompts

All prompts are automatically enhanced with anime quality tags:
- **Prefix:** `masterpiece, best quality, very aesthetic, absurdres, anime style`
- **Negative prompt:** Automatically excludes realistic/3D/western styles

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Backend**: Replicate API
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
anime-asset-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts    # Replicate API endpoint
│   │   ├── globals.css         # Global styles & theme
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── GenerateButton.tsx  # Generate button with loading state
│   │   ├── HistoryDrawer.tsx   # Session history drawer
│   │   ├── ImageUpload.tsx     # Reference image upload
│   │   ├── ModelSelector.tsx   # Model dropdown with tooltips
│   │   ├── OptionsSelector.tsx # Dimension & batch count
│   │   ├── PromptInput.tsx     # Prompt textarea
│   │   └── ResultsGrid.tsx     # Image results grid
│   └── types/
│       └── index.ts            # TypeScript types & constants
├── .env.local                  # Environment variables
└── package.json
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add the `REPLICATE_API_KEY` environment variable in Vercel's dashboard
4. Deploy!

## 📝 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- [Replicate](https://replicate.com) for hosting the AI models
- All the amazing open-source model creators
