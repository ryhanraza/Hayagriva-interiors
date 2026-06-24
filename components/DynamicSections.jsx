'use client'

import { SECTION_RENDERERS } from './sections'

/**
 * DynamicSections — the single entry point consumed by every page.
 *
 * Receives an ordered array of page_sections rows and renders each via
 * the SECTION_RENDERERS registry. Unknown types fall through to the
 * generic "custom" renderer.
 */
export default function DynamicSections({ sections }) {
  if (!sections || sections.length === 0) return null

  return (
    <div className="space-y-0">
      {sections.map((section, idx) => {
        if (section.is_visible === false) return null

        const Renderer = SECTION_RENDERERS[section.type] || SECTION_RENDERERS.custom
        return <Renderer key={section.id || idx} section={section} />
      })}
    </div>
  )
}
