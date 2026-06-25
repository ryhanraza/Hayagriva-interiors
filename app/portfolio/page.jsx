import { Suspense } from 'react'
import PortfolioView from './portfolio-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('portfolio'))
}

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <PortfolioView />
    </Suspense>
  )
}
