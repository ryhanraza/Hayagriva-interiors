import HomeView from './home-view'
import { getSeoForPage, buildMetadata } from '../lib/seo'
import { getSectionsForPage } from '../lib/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('home'))
}

/**
 * Fetch all visible sections for the home page from the database and pass
 * them as a keyed content map to HomeView.  HomeView uses the DB data where
 * it exists and falls back to its original hardcoded defaults for every field
 * that has not yet been edited in the admin panel.
 */
export default async function Page() {
  const sectionsArray = await getSectionsForPage('home')

  // Build a { [type]: sectionRow } map — first occurrence per type wins
  const content = {}
  for (const section of sectionsArray) {
    if (section.type && !(section.type in content)) {
      content[section.type] = section
    }
  }

  return <HomeView content={content} />
}
