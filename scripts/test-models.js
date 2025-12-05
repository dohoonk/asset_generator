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
  // Character reference models (require image)
  { 
    id: "flux-redux", 
    name: "Flux Redux",
    replicateId: "black-forest-labs/flux-redux-dev",
    requiresImage: true
  },
  { 
    id: "photomaker", 
    name: "PhotoMaker",
    replicateId: "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
    requiresImage: true
  },
  { 
    id: "photomaker-style", 
    name: "PhotoMaker Style",
    replicateId: "tencentarc/photomaker-style:467d062309da518648ba89d226490e02b8ed09b5abc15026e54e31c5a8cd0769",
    requiresImage: true
  },
  { 
    id: "instant-id", 
    name: "InstantID",
    replicateId: "zsxkib/instant-id:2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
    requiresImage: true
  },
  { 
    id: "sdxl", 
    name: "SDXL",
    replicateId: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc"
  },
  // Text-to-image models
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
];

async function testModel(model) {
  const startTime = Date.now();
  
  // Skip models that require an image input
  if (model.requiresImage) {
    console.log(`⏭️  ${model.name} - Skipped (requires reference image)`);
    return { ...model, status: 'skipped' };
  }
  
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

