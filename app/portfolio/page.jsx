import { Suspense } from 'react'
import PortfolioView from './portfolio-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('portfolio'))
}

// Render CMS-managed sections when the admin has created any for this page.
// Otherwise fall back to the hand-coded PortfolioView.
export default async function Page() {
  const sections = await getSectionsForPage('portfolio')

  if (sections && sections.length > 0) {
    return (
      <Suspense fallback={null}>
        <DynamicSections sections={sections} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={null}>
      <PortfolioView />
    </Suspense>
  )
}
