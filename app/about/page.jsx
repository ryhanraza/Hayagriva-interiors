import AboutView from './about-view'
import DynamicSections from '../../components/DynamicSections'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

export default async function Page() {
  const sectionsArray = await getSectionsForPage('about')
  const content = {}
  const consumedIds = new Set()
  for (const section of sectionsArray) {
    if (section.type && !(section.type in content)) {
      content[section.type] = section
      consumedIds.add(section.id)
    }
  }
  const extraSections = sectionsArray.filter(s => !consumedIds.has(s.id))

  return (
    <>
      <AboutView content={content} />
      {extraSections.length > 0 && <DynamicSections sections={extraSections} />}
    </>
  )
}
