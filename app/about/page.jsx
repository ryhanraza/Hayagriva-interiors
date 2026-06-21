import AboutView from './about-view'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('about'))
}

export default async function Page() {
  const sections = await getSectionsForPage('about')

  if (sections && sections.length > 0) {
    return <DynamicSections sections={sections} />
  }

  return <AboutView />
}
