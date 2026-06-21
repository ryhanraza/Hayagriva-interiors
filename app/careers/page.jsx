import CareersView from './careers-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('careers'))
}

export default async function Page() {
  const sections = await getSectionsForPage('careers')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <CareersView />
}
