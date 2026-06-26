import AboutView from './about-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

// Render CMS-managed sections when the admin has created any for this page.
// Otherwise fall back to the hand-coded AboutView.
export default async function Page() {
  const sections = await getSectionsForPage('about')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <AboutView />
}
