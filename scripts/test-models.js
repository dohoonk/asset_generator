/**
 * Test script to verify all Replicate models are working
 * Run with: node scripts/test-models.js
 * Requires REPLICATE_API_KEY environment variable
 */

const Replicate = require('replicate');

// Load env from .env.local if running locally
require('dotenv').config({ path: '.env.local' });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// Models must match src/types/index.ts
const MODELS = [
  { 
    id: "animagine-xl-31", 
    name: "Animagine XL 3.1",
    replicateId: "cjwbw/animagine-xl-3.1:6afe2e6b27dad2d6f480b59195c221884b6acc589ff4d05ff0e5fc058690fbb9"
  },
  { 
    id: "anything-v4", 
    name: "Anything V4",
    replicateId: "cjwbw/anything-v4.0:42a996d39a96aedc57b2e0aa8105dea39c9c89d9d266caf6bb4327a1c191b061"
  },
  { 
    id: "dreamshaper-xl", 
    name: "DreamShaper XL",
    replicateId: "lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615"
  },
  { 
    id: "flux-schnell", 
    name: "Flux Schnell",
    replicateId: "black-forest-labs/flux-schnell"
  },
  { 
    id: "flux-dev", 
    name: "Flux Dev",
    replicateId: "black-forest-labs/flux-dev"
  },
  { 
    id: "sdxl", 
    name: "SDXL",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc"
  },
  { 
    id: "playground", 
    name: "Playground v2.5",
    replicateId: "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24"
  },
];

async function testModel(model) {
  const startTime = Date.now();
  try {
    process.stdout.write(`Testing ${model.name}... `);
    
    const output = await replicate.run(model.replicateId, {
      input: { 
        prompt: 'masterpiece, best quality, anime style, 1girl with blue hair',
        num_outputs: 1 
      }
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Success (${duration}s)`);
    return { ...model, status: 'ok', duration };
  } catch (err) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const errorMsg = err.message.split('\n')[0].slice(0, 80);
    console.log(`❌ Failed (${duration}s): ${errorMsg}`);
    return { ...model, status: 'failed', error: errorMsg, duration };
  }
}

async function main() {
  console.log('=== Anime Asset Generator - Model Test ===\n');
  
  if (!process.env.REPLICATE_API_KEY) {
    console.error('ERROR: REPLICATE_API_KEY environment variable not set');
    process.exit(1);
  }
  
  console.log(`Testing ${MODELS.length} models...\n`);
  
  const results = [];
  for (const model of MODELS) {
    results.push(await testModel(model));
  }
  
  console.log('\n=== Summary ===');
  const working = results.filter(r => r.status === 'ok');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`Working: ${working.length}/${results.length}`);
  
  if (working.length > 0) {
    console.log('\n✅ Working models:');
    working.forEach(m => console.log(`   - ${m.name}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed models:');
    failed.forEach(m => console.log(`   - ${m.name}: ${m.error}`));
    process.exit(1);
  }
  
  console.log('\nAll models working! ✨');
}

main().catch(console.error);

