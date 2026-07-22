'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Save,
  X,
  Link2,
  ExternalLink
} from 'lucide-react'

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('hayagriva_admin_access_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export default function SeoInternalLinksManager() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [editModal, setEditModal] = useState(null) // 'add' or ID of link to edit
  const [formData, setFormData] = useState({ keyword: '', target_url: '', open_in_new_tab: false })

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/admin/seo-internal-links', {
        headers,
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load internal links.')
      setLinks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to load internal links.')
      setLinks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  function openAddModal() {
    setErrorMsg('')
    setFormData({ keyword: '', target_url: '', open_in_new_tab: false })
    setEditModal('add')
  }

  function openEditModal(link) {
    setErrorMsg('')
    setFormData({
      keyword: link.keyword,
      target_url: link.target_url,
      open_in_new_tab: link.open_in_new_tab
    })
    setEditModal(link.id)
  }

  function closeModal() {
    setEditModal(null)
    setFormData({ keyword: '', target_url: '', open_in_new_tab: false })
  }

  async function handleSave() {
    if (!formData.keyword.trim() || !formData.target_url.trim()) {
      setErrorMsg('Keyword and Destination URL are required.')
      return
    }

    setSaving(true)
    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()

      if (editModal === 'add') {
        const res = await fetch('/api/admin/seo-internal-links', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            keyword: formData.keyword,
            target_url: formData.target_url,
            open_in_new_tab: formData.open_in_new_tab
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create internal link.')
        setLinks((prev) => [data, ...prev])
      } else {
        const res = await fetch(`/api/admin/seo-internal-links/${editModal}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            keyword: formData.keyword,
            target_url: formData.target_url,
            open_in_new_tab: formData.open_in_new_tab
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update internal link.')
        setLinks((prev) => prev.map((l) => (l.id === editModal ? data : l)))
      }

      closeModal()
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this internal link? This cannot be undone.')) return

    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/admin/seo-internal-links/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete internal link.')
      setLinks((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Delete failed.')
    }
  }

  return (
    <div className="bg-charcoal-luxury/60 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-beige-luxury flex items-center gap-3">
            <Link2 className="text-gold-metallic" size={24} />
            <span>SEO Internal Links</span>
          </h2>
          <p className="text-xs text-beige-luxury/60 mt-1">
            Configure keywords to automatically convert into internal hyperlinks across the website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gold-metallic hover:bg-gold-dark text-black-luxury px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-gold-metallic/15 shrink-0"
        >
          <Plus size={16} />
          <span>Add Internal Link</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs mb-6">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-beige-luxury/40">
          <Loader2 className="animate-spin text-gold-metallic" size={32} />
          <span className="text-xs uppercase tracking-widest">Loading internal links...</span>
        </div>
      ) : links.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] text-center px-4">
          <Link2 className="text-beige-luxury/20 mb-4" size={48} />
          <h3 className="text-sm font-bold text-beige-luxury">No internal links configured</h3>
          <p className="text-xs text-beige-luxury/50 max-w-sm mt-1">
            Create internal links to automatically turn matching keywords into anchor tags.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-beige-luxury/40 font-bold">
                <th className="py-4 px-4">Anchor Text (Keyword)</th>
                <th className="py-4 px-4">Destination URL</th>
                <th className="py-4 px-4">Tab Behavior</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-beige-luxury">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-bold text-gold-metallic">{link.keyword}</td>
                  <td className="py-4 px-4 font-mono text-beige-luxury/80 max-w-xs truncate">{link.target_url}</td>
                  <td className="py-4 px-4">
                    {link.open_in_new_tab ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-beige-luxury/60 border border-white/10">
                        <ExternalLink size={10} /> New Tab
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-metallic/5 text-[10px] text-gold-metallic/80 border border-gold-metallic/10">
                        Same Tab
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(link)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-gold-metallic transition-all"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black-luxury/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg glass-premium rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" />
            
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-beige-luxury/40 hover:text-beige-luxury transition-all"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg sm:text-xl font-serif text-beige-luxury mb-6 flex items-center gap-2">
              <Link2 className="text-gold-metallic" size={20} />
              <span>{editModal === 'add' ? 'Add New Internal Link' : 'Edit Internal Link'}</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-beige-luxury/40 mb-2">
                  Anchor Text / Keyword
                </label>
                <input
                  type="text"
                  placeholder="e.g. modular kitchen"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-beige-luxury placeholder:text-beige-luxury/20 focus:outline-none focus:border-gold-metallic transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-beige-luxury/40 mb-2">
                  Destination URL / Page Path
                </label>
                <input
                  type="text"
                  placeholder="e.g. /services/modular-kitchen"
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-beige-luxury placeholder:text-beige-luxury/20 focus:outline-none focus:border-gold-metallic transition-all"
                />
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <input
                  type="checkbox"
                  id="open_in_new_tab"
                  checked={formData.open_in_new_tab}
                  onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                  className="w-4 h-4 accent-gold-metallic rounded cursor-pointer"
                />
                <label htmlFor="open_in_new_tab" className="text-xs text-beige-luxury/70 cursor-pointer select-none">
                  Open link in a new tab (target="_blank")
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gold-metallic hover:bg-gold-dark text-black-luxury px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-gold-metallic/15 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
