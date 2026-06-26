import ContactView from './contact-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('contact'))
}

export default async function Page() {
  const sectionsArray = await getSectionsForPage('contact')
  const content = {}
  for (const section of sectionsArray) {
    if (section.type && !(section.type in content)) {
      content[section.type] = section
    }
  }
  return <ContactView content={content} />
}
