import AboutView from './about-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

// Always render the hand-coded AboutView.
// The DB-driven DynamicSections override is intentionally bypassed so the
// original UI is shown regardless of any rows in the page_sections table.
export default async function Page() {
  return <AboutView />
}
