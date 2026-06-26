import { Suspense } from 'react'
import PortfolioView from './portfolio-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('portfolio'))
}

// Always render the hand-coded PortfolioView.
// The DB-driven DynamicSections override is intentionally bypassed so the
// original UI is shown regardless of any rows in the page_sections table.
export default async function Page() {
  return (
    <Suspense fallback={null}>
      <PortfolioView />
    </Suspense>
  )
}
