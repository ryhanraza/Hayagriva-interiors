import AboutView from './about-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

// DB-first: render admin-managed sections when present, fall back to the
// hand-coded AboutView when the page_sections table has no rows for this page.
export default async function Page() {
  const sections = await getSectionsForPage('about')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <AboutView />
}
