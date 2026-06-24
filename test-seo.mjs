import { getSeoForPage, buildMetadata } from './lib/seo.js'

async function testSeoFallback() {
  console.log('--- Testing SEO Fallback System ---')
  
  // 1. Fetch from DB (currently empty, should return null)
  console.log('Fetching SEO data for "home" page...')
  const dbData = await getSeoForPage('home')
  console.log('Database Result:', dbData) // Expected: null

  // 2. Build metadata using the fallback logic
  console.log('\nBuilding metadata...')
  const metadata = buildMetadata(dbData)
  console.log('Built Metadata:', JSON.stringify(metadata, null, 2))
  
  if (metadata && metadata.title === 'Hayagriva Interiors') {
    console.log('\n✅ SUCCESS: Fallback is working perfectly!')
  } else {
    console.error('\n❌ FAILURE: Fallback logic did not return default title.');
  }
}

testSeoFallback()
