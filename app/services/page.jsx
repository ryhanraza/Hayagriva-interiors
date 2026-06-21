import ServicesView from './services-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('services'))
}

export default async function Page() {
  const sections = await getSectionsForPage('services')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <ServicesView />
}
