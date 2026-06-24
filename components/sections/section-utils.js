// Shared helpers for section renderers.
//
// Sections store content across typed columns (title, subtitle, description,
// images, buttons, layout, custom_json). These helpers read from either a
// typed column or a custom_json key with a fallback, so admins can edit any
// field from the structured editor OR the raw-JSON editor and both work.

/**
 * Get an item from custom_json, with an optional fallback to a top-level field.
 * @param {object} section - The raw section row from the DB.
 * @param {string} key      - Key inside section.custom_json.
 * @param {*} fallback      - Value used when both custom_json[key] and the
 *                            same-named top-level field are absent.
 */
export function cfg(section, key, fallback) {
  const cj = section?.custom_json || {}
  if (cj[key] !== undefined && cj[key] !== null) return cj[key]
  if (section && section[key] !== undefined && section[key] !== null) return section[key]
  return fallback
}

/**
 * Coerce a value to an array (defensive — JSONB can hold null/objects).
 */
export function arr(value) {
  if (Array.isArray(value)) return value
  return []
}

/**
 * First image URL on a section, or a fallback.
 */
export function firstImage(section, fallback = '') {
  const images = arr(section?.images)
  return images[0]?.url || fallback
}
