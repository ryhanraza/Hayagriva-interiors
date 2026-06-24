import { notFound } from 'next/navigation'
import { getSeoForPage, buildMetadata } from '../../lib/seo'
import { getSectionsForPage, getCustomPageBySlug } from '../../lib/sections'
import DynamicSections from '../../components/DynamicSections'

export async function generateMetadata({ params }) {
  const { customPage } = await params
  const pageDef = await getCustomPageBySlug(customPage)
  if (!pageDef) return {}

  return buildMetadata(await getSeoForPage(customPage))
}

export default async function Page({ params }) {
  const { customPage } = await params
  
  // 1. Verify if this custom page exists in the database
  const pageDef = await getCustomPageBySlug(customPage)
  if (!pageDef) {
    notFound()
  }

  // 2. Fetch page sections
  const sections = await getSectionsForPage(customPage)

  return (
    <div className="min-h-screen bg-warmcream">
      {sections && sections.length > 0 ? (
        <DynamicSections sections={sections} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-charcoal text-white">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            {pageDef.title}
          </h1>
          <p className="text-beige/70 text-xs sm:text-sm max-w-md">
            This page has been successfully created! Use the admin dashboard to add sections and edit its content.
          </p>
        </div>
      )}
    </div>
  )
}
