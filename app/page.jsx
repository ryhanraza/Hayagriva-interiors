import HomeView from './home-view'
import DynamicSections from '../components/DynamicSections'
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
 *
 * Any sections NOT consumed by HomeView (new types, duplicates, or types the
 * hardcoded view doesn't render) are appended via DynamicSections so they
 * always appear on the live site.
 */
export default async function Page() {
  const sectionsArray = await getSectionsForPage('home')

  // Build a { [type]: sectionRow } map — first occurrence per type wins
  const content = {}
  const consumedIds = new Set()
  for (const section of sectionsArray) {
    if (section.type && !(section.type in content)) {
      content[section.type] = section
      consumedIds.add(section.id)
    }
  }

  // Sections the hardcoded view didn't consume (duplicates / new types)
  const extraSections = sectionsArray.filter(s => !consumedIds.has(s.id))

  return (
    <>
      <HomeView content={content} />
      {extraSections.length > 0 && <DynamicSections sections={extraSections} />}
    </>
  )
}
