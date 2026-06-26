import { Suspense } from 'react'
import PortfolioView from './portfolio-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('portfolio'))
}

export default async function Page() {
  const sectionsArray = await getSectionsForPage('portfolio')
  const content = {}
  for (const section of sectionsArray) {
    if (section.type && !(section.type in content)) {
      content[section.type] = section
    }
  }
  return (
    <Suspense fallback={null}>
      <PortfolioView content={content} />
    </Suspense>
  )
}
