import { useState, useEffect } from 'react'
import { insforgeClient } from '../../lib/insforge-client'
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  X
} from 'lucide-react'

export default function MediaLibrary() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedKey, setCopiedKey] = useState('')

  // Fetch all images
  const fetchImages = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('hayagriva_admin_access_token') : null
      const headers = { 'Content-Type': 'application/json' }
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`
      }

      const res = await fetch('/api/admin/media', { headers, credentials: 'include' })
      if (!res.ok) {
        throw new Error(`Failed to load media (HTTP ${res.status})`)
      }
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to load media library.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // Handle uploading files
  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setErrorMsg('')
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { data, error } = await insforgeClient.storage.from('images').uploadAuto(file)
        if (error) throw error
      }
      await fetchImages()
    } catch (err) {
      console.error(err)
      setErrorMsg('Upload failed: ' + (err.message || err))
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  // Handle deleting an image
  const handleDelete = async (image) => {
    if (!confirm(`Are you sure you want to delete this file?\nKey: ${image.key}\n\nWarning: If this image is used in any section or project, it will break.`)) return

    setErrorMsg('')
    try {
      const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('hayagriva_admin_access_token') : null
      const headers = { 'Content-Type': 'application/json' }
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`
      }

      const res = await fetch(`/api/admin/media?key=${encodeURIComponent(image.key)}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to delete file.')
      }

      setImages((prev) => prev.filter((img) => img.key !== image.key))
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to delete file.')
    }
  }

  // Handle copy url to clipboard
  const handleCopy = (url, key) => {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Filtered list
  const filteredImages = images.filter((img) =>
    (img.key || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Tab Header & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
            Asset Management
          </span>
          <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
            Media Library
          </h2>
          <p className="text-xs text-beige-luxury/40 mt-1 max-w-xl">
            Upload new assets and manage existing files in your storage. Click any card to copy the direct URL.
          </p>
        </div>

        {/* Upload Button */}
        <label className="self-start sm:self-center flex items-center gap-2 px-5 py-3.5 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-gold-metallic/15 transition-all duration-300 cursor-pointer">
          {uploading ? (
            <Loader2 className="animate-spin text-black-luxury" size={15} />
          ) : (
            <Upload size={15} />
          )}
          <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/25 flex items-start justify-between gap-3 text-red-200 text-xs leading-relaxed">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-luxury/35" size={15} />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-gold-metallic" size={32} />
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-mute">
            Loading media assets...
          </span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="glass-premium rounded-3xl p-12 text-center text-beige-luxury/30 uppercase tracking-widest text-xs border border-white/5">
          {searchQuery ? 'No assets match your search.' : 'Media library is empty.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.key}
              className="glass-premium rounded-2xl overflow-hidden border border-white/5 hover:border-gold-metallic/20 transition-all duration-500 flex flex-col group relative"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-square bg-black-luxury/60 flex items-center justify-center overflow-hidden border-b border-white/5">
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.key}
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon size={28} className="text-white/20" />
                )}

                {/* Overlays on Hover */}
                <div className="absolute inset-0 bg-black-luxury/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(img.url, img.key)}
                    className="p-2 bg-white/10 hover:bg-gold-metallic hover:text-black-luxury rounded-lg border border-white/10 hover:border-gold-metallic text-beige-luxury transition-all"
                    title="Copy URL"
                  >
                    {copiedKey === img.key ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  {/* View Full */}
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 text-beige-luxury transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(img)}
                    className="p-2 bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg border border-white/10 hover:border-rose-500/30 text-rose-400 transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="p-3.5 space-y-1">
                <div
                  onClick={() => handleCopy(img.url, img.key)}
                  className="text-[10px] font-bold text-beige-luxury/90 truncate cursor-pointer hover:text-gold-metallic transition-colors"
                  title="Click to copy URL"
                >
                  {img.key}
                </div>
                <div className="flex justify-between items-center text-[9px] text-beige-luxury/35 font-mono">
                  <span>{formatSize(img.size)}</span>
                  <span>
                    {img.uploadedAt
                      ? new Date(img.uploadedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short'
                        })
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
