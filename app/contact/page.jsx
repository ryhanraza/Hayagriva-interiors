import ContactView from './contact-view'
import DynamicSections from '../../components/DynamicSections'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('contact'))
}

// Render dynamic sections from the database if any exist,
// otherwise fall back to the hand-coded ContactView.
export default async function Page() {
  const sections = await getSectionsForPage('contact')
  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }
  return <ContactView />
}
