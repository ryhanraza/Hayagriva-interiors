import ContactView from './contact-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('contact'))
}

export default async function Page() {
  return <ContactView />
}
