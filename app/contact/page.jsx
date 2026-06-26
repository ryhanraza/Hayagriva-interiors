import ContactView from './contact-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('contact'))
}

// Render CMS-managed sections when the admin has created any for this page.
// Otherwise fall back to the hand-coded ContactView.
export default async function Page() {
  const sections = await getSectionsForPage('contact')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <ContactView />
}
