'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  HelpCircle
} from 'lucide-react'
import { SERVICE_OPTIONS } from '../../lib/service-options'

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('hayagriva_admin_access_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export default function ServiceFaqsManager() {
  const [activeService, setActiveService] = useState(SERVICE_OPTIONS[0].slug)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [formData, setFormData] = useState({ question: '', answer: '', is_active: true })

  const fetchFaqs = useCallback(async (serviceId) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/admin/service-faqs?service_id=${encodeURIComponent(serviceId)}`, {
        headers,
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load FAQs.')
      setFaqs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to load FAQs.')
      setFaqs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs(activeService)
  }, [activeService, fetchFaqs])

  function openAddModal() {
    setFormData({ question: '', answer: '', is_active: true })
    setEditModal('add')
  }

  function openEditModal(faq) {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      is_active: faq.is_active
    })
    setEditModal(faq.id)
  }

  function closeModal() {
    setEditModal(null)
    setFormData({ question: '', answer: '', is_active: true })
  }

  async function handleSave() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setErrorMsg('Question and answer are required.')
      return
    }

    setSaving(true)
    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()

      if (editModal === 'add') {
        const res = await fetch('/api/admin/service-faqs', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            service_id: activeService,
            question: formData.question,
            answer: formData.answer,
            is_active: formData.is_active
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create FAQ.')
        setFaqs((prev) => [...prev, data])
      } else {
        const res = await fetch(`/api/admin/service-faqs/${editModal}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            question: formData.question,
            answer: formData.answer,
            is_active: formData.is_active
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update FAQ.')
        setFaqs((prev) => prev.map((f) => (f.id === editModal ? data : f)))
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
    if (!confirm('Delete this FAQ? This cannot be undone.')) return

    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/admin/service-faqs/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete FAQ.')
      setFaqs((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Delete failed.')
    }
  }

  async function handleToggleActive(faq) {
    setErrorMsg('')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/admin/service-faqs/${faq.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ is_active: !faq.is_active })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update FAQ.')
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? data : f)))
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Toggle failed.')
    }
  }

  function handleDragStart(index) {
    setDraggedIndex(index)
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const next = [...faqs]
    const [removed] = next.splice(draggedIndex, 1)
    next.splice(index, 0, removed)
    setFaqs(next)
    setDraggedIndex(index)
  }

  async function handleDragEnd() {
    if (draggedIndex === null) return
    setDraggedIndex(null)

    const reordered = faqs.map((faq, idx) => ({ ...faq, display_order: idx }))
    setFaqs(reordered)
    setReordering(true)
    setErrorMsg('')

    try {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/admin/service-faqs/reorder', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          orders: reordered.map((faq, idx) => ({ id: faq.id, display_order: idx }))
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reorder FAQs.')
      setFaqs(Array.isArray(data) ? data.sort((a, b) => a.display_order - b.display_order) : reordered)
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Reorder failed.')
      await fetchFaqs(activeService)
    } finally {
      setReordering(false)
    }
  }

  const activeTitle = SERVICE_OPTIONS.find((s) => s.slug === activeService)?.title || activeService

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-black text-beige-luxury tracking-tight">Service FAQs</h2>
          <p className="text-xs text-beige-luxury/50 mt-1 max-w-xl">
            Manage FAQs for each service page. Only active FAQs appear on the website.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-gold-metallic hover:bg-gold-metallic/90 text-black-luxury font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0"
        >
          <Plus size={14} />
          <span>Add FAQ</span>
        </button>
      </div>

      {errorMsg && (
        <div className="px-4 py-3 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Service selector */}
      <div className="flex flex-wrap gap-2">
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service.slug}
            type="button"
            onClick={() => setActiveService(service.slug)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              activeService === service.slug
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'bg-white/5 text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/10 border border-white/5'
            }`}
          >
            {service.title}
          </button>
        ))}
      </div>

      <div className="bg-charcoal-luxury/40 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-gold-metallic" />
            <span className="text-xs font-bold uppercase tracking-widest text-beige-luxury">
              {activeTitle} FAQs
            </span>
          </div>
          {reordering && (
            <span className="text-[10px] text-gold-metallic/70 uppercase tracking-widest flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Saving order…
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-beige-luxury/40">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-beige-luxury/40 text-xs">
            No FAQs yet for {activeTitle}. Click &quot;Add FAQ&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-start gap-4 px-6 py-5 transition-colors ${
                  draggedIndex === idx ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                } ${!faq.is_active ? 'opacity-50' : ''}`}
              >
                <div className="pt-1 cursor-grab active:cursor-grabbing text-beige-luxury/30 hover:text-gold-metallic shrink-0">
                  <GripVertical size={16} />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-gold-metallic/60 uppercase tracking-widest shrink-0 pt-0.5">
                      Q{idx + 1}
                    </span>
                    <p className="text-sm font-bold text-beige-luxury leading-snug">{faq.question}</p>
                  </div>
                  <p className="text-xs text-beige-luxury/50 leading-relaxed pl-6 line-clamp-2">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(faq)}
                    title={faq.is_active ? 'Disable FAQ' : 'Enable FAQ'}
                    className="p-2 rounded-lg text-beige-luxury/40 hover:text-gold-metallic hover:bg-white/5 transition-colors"
                  >
                    {faq.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(faq)}
                    className="p-2 rounded-lg text-beige-luxury/40 hover:text-gold-metallic hover:bg-white/5 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg text-beige-luxury/40 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-charcoal-luxury border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                {editModal === 'add' ? 'Add FAQ' : 'Edit FAQ'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-beige-luxury/40 hover:text-beige-luxury transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 block mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                  className="w-full px-4 py-3 bg-black-luxury/50 border border-white/10 rounded-xl text-sm text-beige-luxury placeholder:text-beige-luxury/30 focus:outline-none focus:border-gold-metallic/50"
                  placeholder="Enter the question…"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 block mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 bg-black-luxury/50 border border-white/10 rounded-xl text-sm text-beige-luxury placeholder:text-beige-luxury/30 focus:outline-none focus:border-gold-metallic/50 resize-y"
                  placeholder="Enter the answer…"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-black-luxury/50 text-gold-metallic focus:ring-gold-metallic/30"
                />
                <span className="text-xs text-beige-luxury/70">Active (visible on website)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-beige-luxury/60 hover:text-beige-luxury transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold-metallic hover:bg-gold-metallic/90 text-black-luxury font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
