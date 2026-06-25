import ServicesView from './services-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('services'))
}

export default async function Page() {
  return <ServicesView />
}
