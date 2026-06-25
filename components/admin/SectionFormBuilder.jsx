'use client'

/**
 * SectionFormBuilder — renders a structured editor for a page_section row,
 * driven by the declarative SECTION_SCHEMAS registry.
 *
 * Storage model (matches how every renderer reads data):
 *   - field.column === 'title' | 'subtitle' | 'description' | 'content'
 *     | 'images' | 'buttons' | 'layout'  → top-level section column
 *   - field.group === 'custom_json'      → section.custom_json[key]
 *
 * Props:
 *   schema   — SECTION_SCHEMAS[type] (the { fields: [...] } object)
 *   value    — the current sectionFormData doc ({ title, subtitle, ...,
 *               custom_json: {...}, images: [], buttons: [] })
 *   onChange — (nextDoc) => void
 *   onUploadImages — (files: FileList) => Promise<Array<{url,key}>>
 *                    passed down from the dashboard so uploads reuse the
 *                    existing InsForge storage helper.
 *   uploading — boolean, disables upload buttons while a file uploads.
 */

import { Upload, Loader2, Plus, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react'

const inputBase =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all'
const selectBase =
  'w-full px-4 py-3 bg-charcoal-luxury border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all'
const labelBase =
  'text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50'

// ── Get / set helpers that abstract the storage location ───────
function readField(value, field) {
  if (field.column) return value[field.column]
  if (field.group === 'custom_json') {
    const cj = value.custom_json || {}
    return cj[field.key]
  }
  return value[field.key]
}

function setField(value, field, next) {
  if (field.column) return { ...value, [field.column]: next }
  if (field.group === 'custom_json') {
    return { ...value, custom_json: { ...(value.custom_json || {}), [field.key]: next } }
  }
  return { ...value, [field.key]: next }
}

export default function SectionFormBuilder({
  schema,
  value,
  onChange,
  onUploadImages,
  uploading = false,
}) {
  if (!schema) return null

  const update = (field, next) => onChange(setField(value, field, next))

  return (
    <div className="space-y-6">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key + (field.column || field.group || '')}
          field={field}
          value={value}
          onChange={(next) => update(field, next)}
          onUploadImages={onUploadImages}
          uploading={uploading}
        />
      ))}
    </div>
  )
}

// ── Single field dispatcher ────────────────────────────────────
function FieldRenderer({ field, value, onChange, onUploadImages, uploading }) {
  const raw = readField(value, field)
  const labelEl = (
    <div className="flex items-baseline justify-between gap-2">
      <label className={labelBase}>{field.label}</label>
      {field.help && (
        <span className="text-[9px] text-beige-luxury/35 leading-tight text-right max-w-[60%]">
          {field.help}
        </span>
      )}
    </div>
  )

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <input
            type="text"
            value={raw || ''}
            placeholder={field.placeholder || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputBase}
          />
        </div>
      )

    case 'textarea':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <textarea
            rows={field.rows || 3}
            value={raw || ''}
            placeholder={field.placeholder || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputBase} resize-none`}
          />
        </div>
      )

    case 'number':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <input
            type="number"
            value={raw ?? ''}
            placeholder={field.placeholder || ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            className={inputBase}
          />
        </div>
      )

    case 'toggle':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="flex items-center h-12">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!raw}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-beige-luxury after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-metallic" />
              <span className="ml-3 text-[10px] font-bold uppercase tracking-wider text-beige-luxury/60">
                {raw ? 'On' : 'Off'}
              </span>
            </label>
          </div>
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <select
            value={raw || (field.options && field.options[0]) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={selectBase}
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )

    case 'image':
      return <ImageField field={field} raw={raw} onChange={onChange} labelEl={labelEl} onUploadImages={onUploadImages} uploading={uploading} />

    case 'imagelist':
      return <ImageListField field={field} raw={raw} onChange={onChange} labelEl={labelEl} onUploadImages={onUploadImages} uploading={uploading} />

    case 'stringlist':
      return <StringListField field={field} raw={raw} onChange={onChange} labelEl={labelEl} />

    case 'list':
      return <RepeatableListField field={field} raw={raw} onChange={onChange} labelEl={labelEl} onUploadImages={onUploadImages} uploading={uploading} />

    default:
      return null
  }
}

// ── Single image (URL string) ──────────────────────────────────
function ImageField({ field, raw, onChange, labelEl, onUploadImages, uploading }) {
  return (
    <div className="space-y-1.5">
      {labelEl}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="h-11 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-metallic/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all">
          {uploading ? (
            <Loader2 className="animate-spin text-gold-metallic" size={14} />
          ) : (
            <Upload size={14} className="text-gold-metallic" />
          )}
          <span className="font-bold text-beige-luxury uppercase tracking-wider text-[10px]">
            {uploading ? 'Uploading...' : 'Upload'}
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading || !onUploadImages}
            onChange={async (e) => {
              const files = e.target.files
              if (!files || !onUploadImages) return
              const uploaded = await onUploadImages(files)
              if (uploaded && uploaded[0]) onChange(uploaded[0].url)
              e.target.value = ''
            }}
            className="hidden"
          />
        </label>
        <input
          type="text"
          value={raw || ''}
          placeholder="Or paste image URL"
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      </div>
      {raw && (
        <div className="relative h-24 w-full rounded-xl overflow-hidden border border-white/5 bg-white/5">
          <img src={raw} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-0.5 bg-black-luxury/60 text-white rounded-full hover:bg-red-500 transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Multi-image list (section.images = [{url,key}]) ─────────────
function ImageListField({ field, raw, onChange, labelEl, onUploadImages, uploading }) {
  const images = Array.isArray(raw) ? raw : []

  const appendUrl = (val) => {
    if (!val.trim()) return
    onChange([...images, { url: val.trim(), key: '' }])
  }

  return (
    <div className="space-y-3">
      {labelEl}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="h-11 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-metallic/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all">
          {uploading ? (
            <Loader2 className="animate-spin text-gold-metallic" size={14} />
          ) : (
            <Upload size={14} className="text-gold-metallic" />
          )}
          <span className="font-bold text-beige-luxury uppercase tracking-wider text-[10px]">
            {uploading ? 'Uploading...' : 'Upload Image(s)'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading || !onUploadImages}
            onChange={async (e) => {
              const files = e.target.files
              if (!files || !onUploadImages) return
              const uploaded = await onUploadImages(files)
              if (uploaded) onChange([...images, ...uploaded])
              e.target.value = ''
            }}
            className="hidden"
          />
        </label>
        <input
          type="text"
          placeholder="Or paste URL, press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              appendUrl(e.target.value)
              e.target.value = ''
            }
          }}
          className={inputBase}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/5 bg-white/5">
              <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-0.5 bg-black-luxury/60 text-white rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Repeatable list of plain strings (e.g. features) ───────────
function StringListField({ field, raw, onChange, labelEl }) {
  const items = Array.isArray(raw) ? raw : []
  return (
    <div className="space-y-2">
      {labelEl}
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            value={item || ''}
            placeholder={field.placeholder || ''}
            onChange={(e) => onChange(items.map((it, i) => (i === idx ? e.target.value : it)))}
            className={inputBase}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="flex items-center gap-1 text-[9px] font-bold text-gold-metallic uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10"
      >
        <Plus size={11} /> Add item
      </button>
    </div>
  )
}

// ── Repeatable group (object rows with sub-fields) ─────────────
function RepeatableListField({ field, raw, onChange, labelEl, onUploadImages, uploading }) {
  const items = Array.isArray(raw) ? raw : []

  const emptyItem = () => {
    const obj = {}
    for (const f of field.itemFields) {
      if (f.type === 'stringlist') obj[f.key] = []
      else if (f.type === 'toggle') obj[f.key] = false
      else if (f.type === 'select' && f.options) obj[f.key] = f.options[0]
      else obj[f.key] = ''
    }
    return obj
  }

  const updateItem = (idx, nextItem) =>
    onChange(items.map((it, i) => (i === idx ? nextItem : it)))

  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [removed] = next.splice(idx, 1)
    next.splice(target, 0, removed)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {labelEl}
      {items.length === 0 && (
        <div className="text-[10px] text-beige-luxury/35 uppercase tracking-widest border border-dashed border-white/10 rounded-xl py-4 text-center">
          No items yet — add one below.
        </div>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gold-metallic/70">
              #{idx + 1}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
                className="p-1 text-beige-luxury/40 hover:text-beige-luxury disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                disabled={idx === items.length - 1}
                onClick={() => move(idx, 1)}
                className="p-1 text-beige-luxury/40 hover:text-beige-luxury disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg ml-1"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field.itemFields.map((sub) => {
              // Sub-fields have no column/group, so readField/setField read/write
              // item[sub.key] directly. Nested stringlist/textarea span full width.
              const isNested = sub.type === 'stringlist' || sub.type === 'textarea'
              return (
                <div key={sub.key} className={isNested ? 'sm:col-span-2' : ''}>
                  <FieldRenderer
                    field={{ ...sub, label: sub.label || sub.key }}
                    value={item}
                    onChange={(nextItem) => updateItem(idx, nextItem)}
                    onUploadImages={onUploadImages}
                    uploading={uploading}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, emptyItem()])}
        className="flex items-center gap-1.5 text-[10px] font-bold text-gold-metallic uppercase tracking-wider px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
      >
        <Plus size={12} /> Add {field.label.replace(/s$/i, '').toLowerCase() || 'item'}
      </button>
    </div>
  )
}
