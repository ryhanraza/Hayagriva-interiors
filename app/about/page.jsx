import AboutView from './about-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

export default async function Page() {
  return <AboutView />
}
