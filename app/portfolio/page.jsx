import { Suspense } from 'react'
import PortfolioView from './portfolio-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('portfolio'))
}

// Renders DB-driven sections when available, falls back to hand-coded PortfolioView.
export default async function Page() {
  const sections = await getSectionsForPage('portfolio')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return (
    <Suspense fallback={null}>
      <PortfolioView />
    </Suspense>
  )
}
