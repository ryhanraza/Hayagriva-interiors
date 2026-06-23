import HomeView from './home-view'
import { getSeoForPage, buildMetadata } from '../lib/seo'
import { getSectionsForPage } from '../lib/sections'
import DynamicSections from '../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('home'))
}

// DB-first: render admin-managed sections when present, fall back to the
// hand-coded HomeView when the page_sections table has no rows for this page.
export default async function Page() {
  const sections = await getSectionsForPage('home')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <HomeView />
}
