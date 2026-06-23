import ContactView from './contact-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('contact'))
}

// DB-first: render admin-managed sections when present, fall back to the
// hand-coded ContactView when the page_sections table has no rows for this page.
export default async function Page() {
  const sections = await getSectionsForPage('contact')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <ContactView />
}
