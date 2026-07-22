'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { insforgeClient } from '../../../lib/insforge-client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban,
  MessageSquare,
  IndianRupee,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Calendar,
  MapPin,
  Loader2,
  Eye,
  X,
  PlusCircle,
  CheckCircle,
  ShieldAlert,
  Tag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Search,
  Globe,
  Save,
  RotateCcw,
  Layers,
  EyeOff,
  Images,
  Link2,
  Copy,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Star,
  HelpCircle
} from 'lucide-react'
import { SEO_PAGES } from '../../../lib/seo-pages'
import { SECTION_SCHEMAS, SECTION_TYPE_OPTIONS, defaultSectionData } from '../../../lib/section-schemas'
import SectionFormBuilder from '../../../components/admin/SectionFormBuilder'
import MediaLibrary from '../../../components/admin/MediaLibrary'
import ServiceFaqsManager from '../../../components/admin/ServiceFaqsManager'
import SeoInternalLinksManager from '../../../components/admin/SeoInternalLinksManager'

/**
 * Safely parse a fetch Response as JSON.
 * Returns null if the response is not OK or the body is not valid JSON
 * (e.g. an HTML error page from a crashed route).
 */
async function safeJson(res) {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Data states
  const [contacts, setContacts] = useState([])
  const [projects, setProjects] = useState([])
  const [expenses, setExpenses] = useState([])
  const [seoRows, setSeoRows] = useState([])
  const [activeSeoPage, setActiveSeoPage] = useState('home')
  const [seoDraft, setSeoDraft] = useState(null)
  const [seoSaving, setSeoSaving] = useState(false)
  const [seoSavedAt, setSeoSavedAt] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  // Page Content Manager States
  const [sections, setSections] = useState([])
  const [activeContentPage, setActiveContentPage] = useState('home')
  const [customPages, setCustomPages] = useState([])
  const [pageModal, setPageModal] = useState(null)
  const [pageFormData, setPageFormData] = useState({ title: '', slug: '' })
  const [pageSaving, setPageSaving] = useState(false)
  const [sectionModal, setSectionModal] = useState(null)
  const [sectionFormData, setSectionFormData] = useState({
    type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    content: '',
    layout: 'full-width',
    images: [],
    buttons: [],
    custom_json: '',
    is_visible: true
  })
  const [sectionSaving, setSectionSaving] = useState(false)
  const [sectionSavedAt, setSectionSavedAt] = useState(null)
  const [sectionModalError, setSectionModalError] = useState('')
  const [sectionOrdering, setSectionOrdering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Modals & Drawers
  const [viewContact, setViewContact] = useState(null)
  const [projectForm, setProjectForm] = useState(null) // 'add' | 'edit' | null
  const [selectedProject, setSelectedProject] = useState(null) // project for editing

  // Form states
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: 'Kitchen',
    location: 'Visakhapatnam, AP',
    budget: '',
    year: '2024',
    area: '',
    materials: '',
    desc: '',
    image: '',
    image_key: ''
  })
  const [expenseFormData, setExpenseFormData] = useState({
    amount: '',
    category: 'Materials',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Project gallery (extra images on the same project)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [galleryDraggedIndex, setGalleryDraggedIndex] = useState(null)

  // Verify auth session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = window.localStorage.getItem('hayagriva_admin_access_token')
          if (storedToken) {
            insforgeClient.setAccessToken(storedToken)
          }
        }

        const { data, error } = await insforgeClient.auth.getCurrentUser()
        if (error || !data?.user) {
          await insforgeClient.auth.signOut().catch(() => { })
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('hayagriva_admin_access_token')
          }
          router.replace('/admin/login')
          return
        }

        // Keep localStorage access token in sync with refreshed session token
        const currentToken = insforgeClient.auth.tokenManager.getAccessToken()
        if (currentToken && typeof window !== 'undefined') {
          window.localStorage.setItem('hayagriva_admin_access_token', currentToken)
        }

        const allowedEmails = ['interiorsbyhayagriva@gmail.com', 'interiorsbyhayagriya@gmail.com']
        const userEmail = data.user.email?.toLowerCase().trim()
        if (!userEmail || !allowedEmails.includes(userEmail)) {
          await insforgeClient.auth.signOut()
          router.replace('/admin/login?error=unauthorized')
          return
        }

        setUser(data.user)
        setAuthLoading(false)
        await fetchDashboardData()
      } catch (err) {
        console.error('Session verification error:', err)
        router.replace('/admin/login')
      }
    }
    checkSession()
  }, [router])

  // Get authentication token helper.
  // Wraps getCurrentUser() in a 5-second timeout so a slow/unreachable
  // Insforge backend can never leave the UI in a permanent loading state.
  async function getHeaders() {
    // Prefer the active in-memory token from the client
    let accessToken = insforgeClient.auth.tokenManager.getAccessToken()

    // Fall back to localStorage if in-memory token is not yet set
    if (!accessToken && typeof window !== 'undefined') {
      accessToken = window.localStorage.getItem('hayagriva_admin_access_token') || undefined
      if (accessToken) {
        insforgeClient.setAccessToken(accessToken)
      }
    }

    // If still no token, try getCurrentUser with a 5 s timeout so we never
    // block the UI indefinitely if the backend is slow or unreachable.
    if (!accessToken) {
      try {
        const { data, error } = await Promise.race([
          insforgeClient.auth.getCurrentUser(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth token refresh timed out')), 5000)
          )
        ])
        if (!error && data?.user) {
          accessToken = insforgeClient.auth.tokenManager.getAccessToken()
          if (accessToken && typeof window !== 'undefined') {
            window.localStorage.setItem('hayagriva_admin_access_token', accessToken)
          }
        }
      } catch (timeoutErr) {
        console.warn('[getHeaders] getCurrentUser timed out or failed:', timeoutErr.message)
      }
    }

    const headers = { 'Content-Type': 'application/json' }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
  }

  // Fetch all dashboard data from API routes
  async function fetchDashboardData() {
    setLoadingData(true)
    setErrorMsg('')
    try {
      const headers = await getHeaders()

      // Fetch Contacts
      const contactsRes = await fetch('/api/admin/contacts', {
        headers,
        credentials: 'include'
      })
      const contactsData = await safeJson(contactsRes)

      // Fetch Projects (public route supports dynamic db seed, admin can load from there)
      const projectsRes = await fetch('/api/projects')
      const projectsData = await safeJson(projectsRes)

      // Fetch Expenses
      const expensesRes = await fetch('/api/admin/expenses', {
        headers,
        credentials: 'include'
      })
      const expensesData = await safeJson(expensesRes)

      // Fetch SEO settings
      const seoRes = await fetch('/api/admin/seo', {
        headers,
        credentials: 'include'
      })
      const seoData = await safeJson(seoRes)

      // Fetch Page Sections
      const contentRes = await fetch(`/api/content/${activeContentPage}`, {
        headers,
        credentials: 'include'
      })
      const contentData = await safeJson(contentRes)

      // Fetch Custom Pages
      const { data: customPagesData } = await insforgeClient.database
        .from('custom_pages')
        .select('*')
        .order('title', { ascending: true })

      if (Array.isArray(contactsData)) setContacts(contactsData)
      if (Array.isArray(projectsData)) setProjects(projectsData)
      if (Array.isArray(expensesData)) setExpenses(expensesData)
      if (Array.isArray(seoData)) setSeoRows(seoData)
      if (Array.isArray(contentData)) setSections(contentData)
      if (Array.isArray(customPagesData)) setCustomPages(customPagesData)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setErrorMsg('Failed to load dashboard data. Check connection.')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSignOut = async () => {
    await insforgeClient.auth.signOut()
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hayagriva_admin_access_token')
    }
    router.replace('/admin/login')
  }

  // File Upload Helper
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrorMsg('')
    try {
      // Create images storage bucket file
      const { data, error } = await insforgeClient.storage
        .from('images')
        .uploadAuto(file)

      if (error) {
        throw error
      }

      if (data) {
        // Persist BOTH returned url and key
        setProjectFormData((prev) => ({
          ...prev,
          image: data.url,
          image_key: data.key
        }))
      }
    } catch (err) {
      console.error('File upload failed:', err)
      setErrorMsg('File upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  // Add / Edit Project Form Submission
  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    setErrorMsg('')

    try {
      const headers = await getHeaders()
      const method = projectForm === 'add' ? 'POST' : 'PUT'
      const payload = projectForm === 'add'
        ? projectFormData
        : { ...projectFormData, id: selectedProject.id }

      const res = await fetch('/api/admin/projects', {
        method,
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save project')
      }

      setProjectForm(null)
      setSelectedProject(null)
      // Reset form
      setProjectFormData({
        title: '',
        category: 'Kitchen',
        location: 'Visakhapatnam, AP',
        budget: '',
        year: '2024',
        area: '',
        materials: '',
        desc: '',
        image: '',
        image_key: ''
      })
      fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Delete Project
  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This will also remove the image file from storage.')) return

    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete project')
      }

      fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // --- Project Gallery (extra images) ---

  // Fetch existing gallery images for a project
  const fetchGalleryImages = async (projectId) => {
    if (!projectId) {
      setGalleryImages([])
      return
    }
    setGalleryLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/images`)
      const data = await safeJson(res)
      const list = Array.isArray(data) ? data : []
      // Defensive: ensure stable display order even if the API ordering changes
      list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      setGalleryImages(list)
    } catch (err) {
      console.error('Failed to load gallery images:', err)
      setGalleryImages([])
    } finally {
      setGalleryLoading(false)
    }
  }

  // Upload one or more gallery image files to storage, then persist to DB.
  // Files keep their selection order; the API appends them after existing rows.
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !selectedProject?.id) return

    setGalleryUploading(true)
    setErrorMsg('')
    try {
      // Upload + persist every file sequentially so order is preserved.
      const created = []
      for (const file of files) {
        const { data, error } = await insforgeClient.storage.from('images').uploadAuto(file)
        if (error) throw error

        const headers = await getHeaders()
        const res = await fetch(`/api/admin/projects/${selectedProject.id}/images`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ image_url: data.url, image_key: data.key }),
          credentials: 'include'
        })
        const result = await safeJson(res)
        if (!res.ok) throw new Error(result.error || 'Failed to add gallery image')
        created.push(Array.isArray(result) ? result[0] : result)
      }
      setGalleryImages((prev) => [...prev, ...created])
    } catch (err) {
      console.error('Gallery upload failed:', err)
      setErrorMsg('Gallery upload failed: ' + err.message)
    } finally {
      setGalleryUploading(false)
      // Reset file input so the same file(s) can be picked again
      e.target.value = ''
    }
  }

  // Add a gallery image by direct URL (no storage upload)
  const handleGalleryUrlAdd = async () => {
    const url = galleryUrlInput.trim()
    if (!url || !selectedProject?.id) return

    setGalleryUploading(true)
    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/images`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image_url: url }),
        credentials: 'include'
      })
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to add gallery image')

      setGalleryImages((prev) => [...prev, Array.isArray(result) ? result[0] : result])
      setGalleryUrlInput('')
    } catch (err) {
      console.error('Gallery URL add failed:', err)
      setErrorMsg('Gallery URL add failed: ' + err.message)
    } finally {
      setGalleryUploading(false)
    }
  }

  // Remove a single gallery image
  const handleGalleryDelete = async (imageId) => {
    if (!imageId || !selectedProject?.id) return
    if (!confirm('Remove this image from the gallery?')) return

    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(
        `/api/admin/projects/${selectedProject.id}/images?imageId=${imageId}`,
        { method: 'DELETE', headers, credentials: 'include' }
      )
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to remove image')

      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      console.error('Gallery delete failed:', err)
      setErrorMsg('Gallery delete failed: ' + err.message)
    }
  }

  // Re-order gallery images (drag drop or move buttons), persisting sort_order
  const handleGalleryReorder = async (nextList) => {
    if (!selectedProject?.id) return
    // Optimistically apply the new order to the UI
    const renumbered = nextList.map((img, idx) => ({ ...img, sort_order: idx }))
    setGalleryImages(renumbered)

    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/images`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          orders: renumbered.map((img) => ({ id: img.id, order: img.sort_order }))
        }),
        credentials: 'include'
      })
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to save order')
    } catch (err) {
      console.error('Gallery reorder failed:', err)
      setErrorMsg('Failed to save image order: ' + err.message)
      fetchGalleryImages(selectedProject.id)
    }
  }

  // Move a gallery image up or down in order
  const handleGalleryMove = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= galleryImages.length) return
    const next = [...galleryImages]
    const tmp = next[index]
    next[index] = next[target]
    next[target] = tmp
    handleGalleryReorder(next)
  }

  // Drag-and-drop reorder helpers
  const handleGalleryDragStart = (index) => setGalleryDraggedIndex(index)
  const handleGalleryDragOver = (e, index) => {
    e.preventDefault()
    if (galleryDraggedIndex === null || galleryDraggedIndex === index) return
    const next = [...galleryImages]
    const [removed] = next.splice(galleryDraggedIndex, 1)
    next.splice(index, 0, removed)
    setGalleryImages(next)
    setGalleryDraggedIndex(index)
  }
  const handleGalleryDragEnd = () => {
    if (galleryDraggedIndex !== null) {
      handleGalleryReorder(galleryImages)
    }
    setGalleryDraggedIndex(null)
  }

  // Replace a gallery image's underlying file (keeps its order/position)
  const handleGalleryReplace = async (imageId, e) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProject?.id || !imageId) return
    e.target.value = ''

    setGalleryUploading(true)
    setErrorMsg('')
    try {
      const { data, error } = await insforgeClient.storage.from('images').uploadAuto(file)
      if (error) throw error

      const headers = await getHeaders()
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/images`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ imageId, image_url: data.url, image_key: data.key }),
        credentials: 'include'
      })
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to replace image')

      setGalleryImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, image_url: data.url, image_key: data.key }
            : img
        )
      )
    } catch (err) {
      console.error('Gallery replace failed:', err)
      setErrorMsg('Image replace failed: ' + err.message)
    } finally {
      setGalleryUploading(false)
    }
  }

  // Promote a gallery image to be the project cover (projects.image)
  const handleGallerySetCover = async (imageId) => {
    if (!imageId || !selectedProject?.id) return
    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/images`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ imageId, setCover: true }),
        credentials: 'include'
      })
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to set cover')

      // Reflect the new cover in the form's showcase image field
      setProjectFormData((prev) => ({
        ...prev,
        image: result.image,
        image_key: result.image_key
      }))
      fetchDashboardData()
    } catch (err) {
      console.error('Set cover failed:', err)
      setErrorMsg('Failed to set cover: ' + err.message)
    }
  }

  // Delete Contact message
  const handleDeleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact lead?')) return

    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete lead')
      }

      setViewContact(null)
      fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // Add Expense Form Submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    setErrorMsg('')

    const amountValue = parseFloat(expenseFormData.amount)
    if (
      !expenseFormData.description?.trim() ||
      !expenseFormData.category?.trim() ||
      expenseFormData.amount === '' ||
      Number.isNaN(amountValue) ||
      amountValue < 0
    ) {
      setErrorMsg('Please enter a valid description, category, and amount.')
      setFormSubmitting(false)
      return
    }

    try {
      const headers = await getHeaders()
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...expenseFormData,
          amount: amountValue
        }),
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setErrorMsg('Session expired or unauthorized. Please sign in again.')
          await insforgeClient.auth.signOut().catch(() => { })
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('hayagriva_admin_access_token')
          }
          router.replace('/admin/login')
          return
        }
        throw new Error(result.error || 'Failed to add expense')
      }

      setExpenseFormData({
        amount: '',
        category: expenseFormData.type === 'income' ? 'Project Payment' : 'Materials',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: expenseFormData.type
      })
      await fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/admin/expenses?id=${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete expense')
      }

      await fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // ── SEO Settings handlers ──────────────────────────────────

  const allPages = [
    ...SEO_PAGES,
    ...customPages.map((p) => ({
      page: p.slug,
      label: p.title,
      path: `/${p.slug}`
    }))
  ]

  // The active draft mirrors the row for the selected page.
  // On first load (no rows yet), synthesize a blank draft from the page registry.
  const activeSeoRow = seoRows.find((r) => r.page === activeSeoPage) || null
  const currentDraft =
    seoDraft && seoDraft.page === activeSeoPage
      ? seoDraft
      : {
          page: activeSeoPage,
          seo_title: activeSeoRow?.seo_title || '',
          meta_description: activeSeoRow?.meta_description || '',
          meta_keywords: activeSeoRow?.meta_keywords || '',
          canonical_url: activeSeoRow?.canonical_url || '',
          og_title: activeSeoRow?.og_title || '',
          og_description: activeSeoRow?.og_description || '',
          og_image: activeSeoRow?.og_image || '',
          og_image_key: activeSeoRow?.og_image_key || '',
          robots: activeSeoRow?.robots || 'index, follow'
        }

  // Track whether the draft diverges from the saved row.
  const seoIsDirty = (() => {
    const saved = activeSeoRow || {}
    const keys = ['seo_title', 'meta_description', 'meta_keywords', 'canonical_url', 'og_title', 'og_description', 'og_image', 'og_image_key', 'robots']
    return keys.some((k) => (currentDraft[k] || '') !== (saved[k] || ''))
  })()

  // Upload OG image to storage bucket; persist both url + key.
  const handleSeoImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrorMsg('')
    try {
      const { data, error } = await insforgeClient.storage.from('images').uploadAuto(file)
      if (error) throw error

      setSeoDraft((prev) => {
        const base = prev && prev.page === activeSeoPage ? prev : currentDraft
        return { ...base, page: activeSeoPage, og_image: data.url, og_image_key: data.key }
      })
    } catch (err) {
      console.error('SEO image upload failed:', err)
      setErrorMsg('Image upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  // Persist draft via PUT upsert.
  const handleSeoSave = async () => {
    setSeoSaving(true)
    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers,
        body: JSON.stringify(currentDraft),
        credentials: 'include'
      })
      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to save SEO settings')

      await fetchDashboardData()
      setSeoDraft(null)
      setSeoSavedAt(Date.now())
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setSeoSaving(false)
    }
  }

  // Reset draft back to the last saved row.
  const handleSeoReset = () => setSeoDraft(null)

  // Update a single field in the draft, seeding it from the current row on first edit.
  const updateSeoField = (field, value) => {
    setSeoDraft((prev) => {
      const base = prev && prev.page === activeSeoPage ? prev : currentDraft
      return { ...base, page: activeSeoPage, [field]: value }
    })
  }

  // ── Custom Pages handlers ──────────────────────────────────
  const handlePageSubmit = async (e) => {
    e.preventDefault()
    setPageSaving(true)
    setErrorMsg('')

    const title = pageFormData.title.trim()
    const slug = pageFormData.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')

    if (!title || !slug) {
      setErrorMsg('Please enter a valid title and URL slug.')
      setPageSaving(false)
      return
    }

    const reservedSlugs = ['admin', 'api', 'blog', 'projects', 'portfolio', 'services', 'about', 'contact', 'home']
    if (reservedSlugs.includes(slug)) {
      setErrorMsg('This URL slug is reserved for standard system pages.')
      setPageSaving(false)
      return
    }

    try {
      const { data, error } = await insforgeClient.database
        .from('custom_pages')
        .insert([{ title, slug }])
        .select()

      if (error) throw error

      await fetchDashboardData()
      setPageModal(null)
      setPageFormData({ title: '', slug: '' })
      
      setActiveContentPage(slug)
      setActiveSeoPage(slug)
    } catch (err) {
      setErrorMsg('Failed to create page: ' + err.message)
    } finally {
      setPageSaving(false)
    }
  }

  const handleDeletePage = async (slug) => {
    if (!confirm(`Are you sure you want to delete the custom page "${slug}"? This will delete all of its dynamic sections and SEO settings.`)) return

    setErrorMsg('')
    try {
      // 1. Delete page sections from database
      const { error: secError } = await insforgeClient.database
        .from('page_sections')
        .delete()
        .eq('page', slug)
      if (secError) throw secError

      // 2. Delete SEO settings from database
      const { error: seoError } = await insforgeClient.database
        .from('seo_settings')
        .delete()
        .eq('page', slug)
      if (seoError) throw seoError

      // 3. Delete custom page registry
      const { error } = await insforgeClient.database
        .from('custom_pages')
        .delete()
        .eq('slug', slug)

      if (error) throw error

      await fetchDashboardData()
      setActiveContentPage('home')
      setActiveSeoPage('home')
    } catch (err) {
      setErrorMsg('Failed to delete page: ' + err.message)
    }
  }

  // ── Page Content Handlers ──────────────────────────────────

  async function fetchSections(page) {
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/content/${page}`, {
        headers,
        credentials: 'include'
      })
      const data = await safeJson(res)
      if (Array.isArray(data)) {
        setSections(data)
      } else {
        console.error('fetchSections: unexpected response', data)
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err)
    }
  }

  useEffect(() => {
    if (user && activeTab === 'content') {
      fetchSections(activeContentPage)
    }
  }, [activeContentPage, activeTab, user])

  const handleSectionDrop = async (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const updated = [...sections]
    const [removed] = updated.splice(draggedIndex, 1)
    updated.splice(targetIndex, 0, removed)

    const reordered = updated.map((sec, idx) => ({
      ...sec,
      section_order: idx
    }))

    setSections(reordered)
    setDraggedIndex(null)

    try {
      setSectionOrdering(true)
      const headers = await getHeaders()
      const res = await fetch('/api/content/reorder', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          orders: reordered.map(sec => ({ id: sec.id, order: sec.section_order }))
        }),
        credentials: 'include'
      })
      if (!res.ok) {
        const errData = await safeJson(res)
        throw new Error(errData.error || 'Failed to update order')
      }
    } catch (err) {
      setErrorMsg('Failed to save section order: ' + err.message)
      fetchSections(activeContentPage)
    } finally {
      setSectionOrdering(false)
    }
  }

  const moveSection = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    const reordered = updated.map((sec, idx) => ({
      ...sec,
      section_order: idx
    }))

    setSections(reordered)

    try {
      setSectionOrdering(true)
      const headers = await getHeaders()
      const res = await fetch('/api/content/reorder', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          orders: reordered.map(sec => ({ id: sec.id, order: sec.section_order }))
        }),
        credentials: 'include'
      })
      if (!res.ok) {
        const errData = await safeJson(res)
        throw new Error(errData.error || 'Failed to update order')
      }
    } catch (err) {
      setErrorMsg('Failed to save section order: ' + err.message)
      fetchSections(activeContentPage)
    } finally {
      setSectionOrdering(false)
    }
  }

  const handleSectionImageUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    setErrorMsg('')
    try {
      const newImages = [...sectionFormData.images]
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { data, error } = await insforgeClient.storage.from('images').uploadAuto(file)
        if (error) throw error
        newImages.push({ url: data.url, key: data.key })
      }
      setSectionFormData(prev => ({
        ...prev,
        images: newImages
      }))
    } catch (err) {
      console.error('Section image upload failed:', err)
      setErrorMsg('Image upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSectionSave = async (e) => {
    e.preventDefault()
    setSectionSaving(true)
    setSectionSavedAt(null)
    setSectionModalError('')
    setErrorMsg('')
    console.log('[Dashboard] handleSectionSave — mode:', sectionModal?.mode, 'page:', activeContentPage)

    // Normalize custom_json: the structured builder keeps it as an object;
    // the Advanced raw-JSON textarea may have turned it into a string.
    let customJsonParsed = {}
    const rawJson = sectionFormData.custom_json
    if (rawJson && typeof rawJson === 'string' && rawJson.trim()) {
      try {
        customJsonParsed = JSON.parse(rawJson.trim())
      } catch (err) {
        console.warn('[Dashboard] handleSectionSave — invalid JSON in advanced panel')
        setSectionModalError('Invalid custom JSON in the Advanced panel. Please correct it before saving.')
        setSectionSaving(false)
        return
      }
    } else if (rawJson && typeof rawJson === 'object') {
      customJsonParsed = rawJson
    }

    const payload = {
      ...sectionFormData,
      custom_json: customJsonParsed,
    }

    // Structured validation against the schema's required fields.
    const validationError = validateSection(payload)
    if (validationError) {
      console.warn('[Dashboard] handleSectionSave — validation failed:', validationError)
      setSectionModalError(validationError)
      setSectionSaving(false)
      return
    }

    try {
      console.log('[Dashboard] handleSectionSave — acquiring auth headers')
      const headers = await getHeaders()

      const method = sectionModal.mode === 'add' ? 'POST' : 'PUT'
      const url = sectionModal.mode === 'add'
        ? `/api/content/${activeContentPage}`
        : `/api/content/${activeContentPage}/${sectionModal.section.id}`

      console.log('[Dashboard] handleSectionSave — sending', method, url)
      console.log('[Dashboard] handleSectionSave — payload keys:', Object.keys(payload).join(', '))

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      console.log('[Dashboard] handleSectionSave — response status:', res.status)
      const result = await safeJson(res)
      console.log('[Dashboard] handleSectionSave — response body:', result)

      // Use optional chaining: result may be null if the server returned a non-JSON
      // error body (e.g. an HTML 500 page from a crashed route).
      if (!res.ok) {
        throw new Error(result?.error || `Server error ${res.status}: Failed to save section`)
      }

      console.log('[Dashboard] handleSectionSave — success!')

      // Immediately append to local state so the list updates without waiting for refetch
      if (sectionModal.mode === 'add' && result) {
        setSections(prev => [...prev, result])
      }
      // Refetch to ensure full sync with DB
      fetchSections(activeContentPage)
      setSectionSavedAt(Date.now())
      setSectionModal(null)
    } catch (err) {
      console.error('[Dashboard] handleSectionSave — error:', err.message)
      setSectionModalError(err.message)
    } finally {
      setSectionSaving(false)
    }
  }


  const handleSectionDelete = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/content/${activeContentPage}/${sectionId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      if (!res.ok) {
        const errData = await safeJson(res)
        throw new Error(errData.error || 'Failed to delete section')
      }

      await fetchSections(activeContentPage)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  const handleSectionDuplicate = async (section) => {
    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const payload = {
        type: section.type,
        title: section.title ? `${section.title} (Copy)` : '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        content: section.content || '',
        layout: section.layout || 'full-width',
        images: section.images || [],
        buttons: section.buttons || [],
        custom_json: section.custom_json || {},
        is_visible: section.is_visible !== false
      }

      const res = await fetch(`/api/content/${activeContentPage}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const result = await safeJson(res)
      if (!res.ok) throw new Error(result.error || 'Failed to duplicate section')

      fetchSections(activeContentPage)
    } catch (err) {
      setErrorMsg('Failed to duplicate section: ' + err.message)
    }
  }

  const toggleSectionVisibility = async (section) => {
    setErrorMsg('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`/api/content/${activeContentPage}/${section.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ is_visible: !section.is_visible }),
        credentials: 'include'
      })
      if (!res.ok) {
        const errData = await safeJson(res)
        throw new Error(errData.error || 'Failed to update visibility')
      }
      await fetchSections(activeContentPage)
    } catch (err) {
      setErrorMsg('Failed to update visibility: ' + err.message)
    }
  }

  // When the admin switches section TYPE in the drawer, merge in that type's
  // default doc (keeping common identity) so the structured form has sane
  // empty arrays/objects instead of carrying over the previous type's shape.
  const handleSectionTypeChange = (nextType) => {
    const base = defaultSectionData(nextType)
    setSectionFormData((prev) => ({
      ...base,
      // keep title/subtitle/description the admin may already have typed
      title: prev.title || base.title,
      subtitle: prev.subtitle || base.subtitle,
      description: prev.description || base.description,
      is_visible: prev.is_visible,
    }))
  }

  // Validate a section doc against its schema's `required` fields, including
  // required sub-fields inside repeatable lists. Returns an error string or ''.
  function validateSection(doc) {
    const schema = SECTION_SCHEMAS[doc.type]
    if (!schema) return ''
    const errors = []

    for (const field of schema.fields) {
      if (!field.required) continue
      const val = field.group === 'custom_json'
        ? doc.custom_json?.[field.key]
        : doc[field.column || field.key]
      if (val === undefined || val === null || String(val).trim() === '') {
        errors.push(`${field.label} is required`)
      }
      // required sub-fields inside repeatable lists
      if (field.type === 'list') {
        const rows = field.group === 'custom_json' ? (doc.custom_json?.[field.key] || []) : (doc[field.key] || [])
        rows.forEach((row, i) => {
          for (const sub of field.itemFields) {
            if (sub.required && (!row || String(row[sub.key] ?? '').trim() === '')) {
              errors.push(`${field.label} → row ${i + 1}: ${sub.label || sub.key} is required`)
            }
          }
        })
      }
    }
    return errors.slice(0, 6).join(' • ')
  }

  // Open edit project drawer
  const openEditProject = (project) => {
    setSelectedProject(project)
    setProjectFormData({
      title: project.title,
      category: project.category,
      location: project.location,
      budget: project.budget,
      year: project.year || '2024',
      area: project.area || '',
      materials: project.materials || '',
      desc: project.desc || '',
      image: project.image || '',
      image_key: project.image_key || ''
    })
    setProjectForm('edit')
    fetchGalleryImages(project.id)
  }

  const INCOME_CATEGORIES = new Set([
    'Project Payment',
    'Consultation Fee',
    'Retainer',
    'Other Income'
  ])

  const getTransactionType = (item) => {
    if (item?.type === 'income') return 'income'
    if (item?.type === 'expense') return 'expense'
    const category = item?.category?.trim()
    return INCOME_CATEGORIES.has(category) ? 'income' : 'expense'
  }

  // Calculations for Overview Stats
  const expenseItems = expenses.filter(item => getTransactionType(item) === 'expense')
  const incomeItems = expenses.filter(item => getTransactionType(item) === 'income')

  const totalExpenses = expenseItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  const totalIncome = incomeItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  const netProfitLoss = totalIncome - totalExpenses

  const categoryExpenses = expenseItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + parseFloat(item.amount || 0)
    return acc
  }, {})

  if (authLoading) {
    return (
      <div className="bg-black-luxury min-h-screen flex flex-col items-center justify-center gap-4 text-beige-luxury">
        <Loader2 className="animate-spin text-gold-metallic" size={40} />
        <h2 className="font-serif text-sm uppercase tracking-[0.25em] text-gold-metallic font-bold">
          Authenticating Session
        </h2>
        <p className="text-xs text-beige-luxury/40">Securing admin environment...</p>
      </div>
    )
  }

  return (
    <div className="bg-black-luxury min-h-screen text-beige-luxury flex flex-col lg:flex-row relative">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-45" />

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-charcoal-luxury/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0 relative z-25">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center text-gold-metallic">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <span className="font-serif text-sm font-black tracking-widest uppercase text-beige-luxury block">
                Hayagriva
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-gold-metallic uppercase block">
                Interior Studio
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 py-2 lg:py-0 border-t border-b lg:border-0 border-white/5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'overview'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <TrendingUp size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'contacts'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <MessageSquare size={16} />
              <span>Inquiries ({contacts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'projects'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <FolderKanban size={16} />
              <span>Portfolio ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'expenses'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <IndianRupee size={16} />
              <span>Expenses</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'seo'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <Search size={16} />
              <span>SEO Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'media'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <Images size={16} />
              <span>Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'content'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <Layers size={16} />
              <span>Page Content</span>
            </button>

            <button
              onClick={() => setActiveTab('service-faqs')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'service-faqs'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <HelpCircle size={16} />
              <span>Service FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('internal-links')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shrink-0 ${activeTab === 'internal-links'
                ? 'bg-gold-metallic text-black-luxury shadow-lg shadow-gold-metallic/10'
                : 'text-beige-luxury/60 hover:text-beige-luxury hover:bg-white/5'
                }`}
            >
              <Link2 size={16} />
              <span>Internal Links</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gold-metallic">
              {user?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-beige-luxury/40 uppercase tracking-wider block">Logged in as</span>
              <span className="text-xs font-bold text-beige-luxury block truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-red-950/20 hover:text-red-400 border border-white/5 hover:border-red-500/20 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 text-beige-luxury/70"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto relative z-10 max-h-screen">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/25 flex items-start justify-between gap-3 text-red-200 text-xs leading-relaxed">
            <div className="flex gap-2">
              <ShieldAlert className="stroke-red-400 shrink-0" size={16} />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {sectionSavedAt && (
          <SectionSavedBanner savedAt={sectionSavedAt} onDismiss={() => setSectionSavedAt(null)} />
        )}

        {loadingData ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-gold-metallic" size={36} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-mute">
              Loading workspace data...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Overview / Stats Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                    Performance Dashboard
                  </span>
                  <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                    Studio Overview
                  </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-premium rounded-2xl p-6 relative overflow-hidden">
                    <span className="text-[10px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Total Inquiries
                    </span>
                    <span className="text-3xl font-serif font-bold text-beige-luxury block mt-3">
                      {contacts.length}
                    </span>
                    <div className="absolute right-6 bottom-6 text-gold-metallic/20">
                      <MessageSquare size={40} />
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-6 relative overflow-hidden">
                    <span className="text-[10px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Total Revenue
                    </span>
                    <span className="text-3xl font-serif font-bold text-emerald-400 block mt-3">
                      ₹{totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className="absolute right-6 bottom-6 text-emerald-500/20">
                      <ArrowUpRight size={40} />
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-6 relative overflow-hidden">
                    <span className="text-[10px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Total Expenses
                    </span>
                    <span className="text-3xl font-serif font-bold text-rose-400 block mt-3">
                      ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className="absolute right-6 bottom-6 text-rose-500/20">
                      <ArrowDownRight size={40} />
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-6 relative overflow-hidden">
                    <span className="text-[10px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Net Balance
                    </span>
                    <span className={`text-3xl font-serif font-bold block mt-3 ${netProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {netProfitLoss >= 0 ? '+' : ''}₹{netProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className={`absolute right-6 bottom-6 ${netProfitLoss >= 0 ? 'text-emerald-500/20' : 'text-rose-500/20'}`}>
                      {netProfitLoss >= 0 ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                    </div>
                  </div>
                </div>

                {/* Visual Chart Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Expenses Chart */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                      Cost Breakdown by Category
                    </h3>

                    {expenses.length === 0 ? (
                      <div className="h-48 flex items-center justify-center text-xs text-beige-luxury/30 uppercase tracking-widest">
                        No expenses tracked yet
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        {Object.keys(categoryExpenses).map((cat) => {
                          const amount = categoryExpenses[cat]
                          const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0

                          return (
                            <div key={cat} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-beige-luxury/80">{cat}</span>
                                <span className="text-gold-metallic">
                                  ₹{amount.toLocaleString('en-IN')} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gold-metallic rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Activity Sheet */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                      Recent Leads
                    </h3>

                    <div className="space-y-4">
                      {contacts.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-beige-luxury uppercase tracking-wider">
                              {c.name}
                            </h4>
                            <p className="text-[10px] text-beige-luxury/40">{c.phone}</p>
                          </div>
                          <span className="text-[9px] font-bold text-gold-metallic uppercase tracking-widest bg-gold-metallic/10 border border-gold-metallic/20 px-3 py-1 rounded-full">
                            {c.source || 'Lead'}
                          </span>
                        </div>
                      ))}

                      {contacts.length === 0 && (
                        <div className="h-48 flex items-center justify-center text-xs text-beige-luxury/30 uppercase tracking-widest">
                          No inquiries received yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contacts Inquiry Workspace */}
            {activeTab === 'contacts' && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                    Customer Relations
                  </span>
                  <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                    Consultation Inquiries
                  </h2>
                </div>

                {contacts.length === 0 ? (
                  <div className="glass-premium rounded-3xl p-12 text-center text-beige-luxury/40 uppercase tracking-widest text-xs">
                    No leads found in the database.
                  </div>
                ) : (
                  <div className="glass-premium rounded-3xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-beige-luxury/50 bg-white/5">
                            <th className="p-5 font-bold">Client</th>
                            <th className="p-5 font-bold">Contact</th>
                            <th className="p-5 font-bold">Source</th>
                            <th className="p-5 font-bold">Received</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {contacts.map((c) => (
                            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors duration-300">
                              <td className="p-5 font-bold uppercase tracking-wider text-beige-luxury">
                                {c.name}
                              </td>
                              <td className="p-5">
                                <div className="text-beige-luxury/80">{c.email}</div>
                                <div className="text-[10px] text-beige-luxury/40 mt-0.5">{c.phone}</div>
                              </td>
                              <td className="p-5">
                                <span className="text-[9px] font-bold text-gold-metallic uppercase tracking-widest bg-gold-metallic/5 border border-gold-metallic/15 px-2.5 py-1 rounded-full">
                                  {c.source || 'Website'}
                                </span>
                              </td>
                              <td className="p-5 text-beige-luxury/50">
                                {new Date(c.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="p-5 text-right space-x-3">
                                <button
                                  onClick={() => setViewContact(c)}
                                  className="p-2 bg-white/5 hover:bg-gold-metallic hover:text-black-luxury rounded-lg border border-white/5 hover:border-gold-metallic transition-all duration-300"
                                  title="View message"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteContact(c.id)}
                                  className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg border border-white/5 hover:border-red-500/20 transition-all duration-300"
                                  title="Delete lead"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Projects Portfolio Workspace */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                      Portfolio Collection
                    </span>
                    <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                      Manage Projects
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setProjectFormData({
                        title: '',
                        category: 'Kitchen',
                        location: 'Visakhapatnam, AP',
                        budget: '',
                        year: '2024',
                        area: '',
                        materials: '',
                        desc: '',
                        image: '',
                        image_key: ''
                      })
                      setGalleryImages([])
                      setGalleryUrlInput('')
                      setProjectForm('add')
                    }}
                    className="self-start sm:self-center flex items-center gap-2 px-5 py-3.5 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-gold-metallic/15 transition-all duration-300"
                  >
                    <Plus size={15} />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="glass-premium rounded-2xl overflow-hidden border border-white/5 hover:border-gold-metallic/20 transition-all duration-500 flex flex-col group"
                    >
                      <div className="relative h-48 bg-white/5 overflow-hidden">
                        {p.image && typeof p.image === 'string' && p.image.trim() ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30">
                            <span className="text-[10px] uppercase tracking-widest font-bold">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black-luxury/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-gold-metallic">
                          {p.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-beige-luxury line-clamp-1">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-beige-luxury/40 flex items-center gap-1">
                            <MapPin size={11} className="text-gold-metallic" /> {p.location}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-beige-luxury/60 border-t border-b border-white/5 py-2.5">
                          <span>{p.year || '2024'}</span>
                          <span className="text-gold-metallic">₹{p.budget}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditProject(p)}
                            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="py-2.5 px-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-xl transition-all duration-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Expenses Tracking Workspace */}
            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                      Financial Ledger
                    </span>
                    <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                      Expenses & Revenue
                    </h2>
                  </div>
                </div>

                {/* Ledger Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-premium rounded-2xl p-5 relative overflow-hidden">
                    <span className="text-[9px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Total Income
                    </span>
                    <span className="text-2xl font-serif font-bold text-emerald-400 block mt-2">
                      ₹{totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className="absolute right-4 bottom-4 text-emerald-500/10">
                      <ArrowUpRight size={32} />
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-5 relative overflow-hidden">
                    <span className="text-[9px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Total Expenses
                    </span>
                    <span className="text-2xl font-serif font-bold text-rose-400 block mt-2">
                      ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className="absolute right-4 bottom-4 text-rose-500/10">
                      <ArrowDownRight size={32} />
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-5 relative overflow-hidden">
                    <span className="text-[9px] font-bold tracking-widest text-beige-luxury/40 uppercase block">
                      Net Profit / Loss
                    </span>
                    <span className={`text-2xl font-serif font-bold block mt-2 ${netProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {netProfitLoss >= 0 ? '+' : ''}₹{netProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <div className={`absolute right-4 bottom-4 ${netProfitLoss >= 0 ? 'text-emerald-500/10' : 'text-rose-500/10'}`}>
                      {netProfitLoss >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                  {/* Ledger Table */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                      Transactions Ledger
                    </h3>

                    {expenses.length === 0 ? (
                      <div className="py-12 text-center text-xs text-beige-luxury/30 uppercase tracking-widest">
                        No transactions logged yet
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-[9px] uppercase tracking-wider text-beige-luxury/50 pb-2">
                              <th className="py-3 pr-4">Description</th>
                              <th className="py-3 px-4">Category</th>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4 text-right">Amount</th>
                              <th className="py-3 pl-4 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-beige-luxury/80">
                            {expenses.map((item) => {
                              const isIncome = item.type === 'income'
                              return (
                                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                                  <td className="py-3.5 pr-4 font-bold uppercase text-[10px] text-beige-luxury">
                                    {item.description}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="text-[9px] font-bold text-gold-metallic uppercase tracking-wider bg-gold-metallic/5 border border-gold-metallic/15 px-2 py-0.5 rounded">
                                      {item.category}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${isIncome
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                      }`}>
                                      {isIncome ? 'Income' : 'Expense'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-beige-luxury/40">
                                    {new Date(item.date).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </td>
                                  <td className={`py-3.5 px-4 text-right font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isIncome ? '+' : '-'}₹{parseFloat(item.amount).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3.5 pl-4 text-right">
                                    <button
                                      onClick={() => handleDeleteExpense(item.id)}
                                      className="p-1.5 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Add Expense Form Panel */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                      Log Transaction
                    </h3>

                    <form onSubmit={handleExpenseSubmit} className="space-y-5">
                      {/* Transaction Type Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          Transaction Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setExpenseFormData({
                                ...expenseFormData,
                                type: 'expense',
                                category: 'Materials'
                              })
                            }}
                            className={`py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition-all duration-300 ${expenseFormData.type === 'expense'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-lg shadow-rose-500/5'
                              : 'bg-white/5 text-beige-luxury/60 border-white/5 hover:bg-white/10'
                              }`}
                          >
                            Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExpenseFormData({
                                ...expenseFormData,
                                type: 'income',
                                category: 'Project Payment'
                              })
                            }}
                            className={`py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition-all duration-300 ${expenseFormData.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                              : 'bg-white/5 text-beige-luxury/60 border-white/5 hover:bg-white/10'
                              }`}
                          >
                            Income
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          Description
                        </label>
                        <input
                          type="text"
                          required
                          value={expenseFormData.description}
                          onChange={(e) =>
                            setExpenseFormData({ ...expenseFormData, description: e.target.value })
                          }
                          placeholder={
                            expenseFormData.type === 'income'
                              ? "e.g. Living room layout first installment, retainer..."
                              : "e.g. Oak Veneer Slabs, Joiner wages..."
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            Category
                          </label>
                          <select
                            value={expenseFormData.category}
                            onChange={(e) =>
                              setExpenseFormData({ ...expenseFormData, category: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-charcoal-luxury border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all"
                          >
                            {expenseFormData.type === 'income' ? (
                              <>
                                <option value="Project Payment">Project Payment</option>
                                <option value="Consultation Fee">Consultation Fee</option>
                                <option value="Retainer">Retainer</option>
                                <option value="Other Income">Other Income</option>
                              </>
                            ) : (
                              <>
                                <option value="Materials">Materials</option>
                                <option value="Wages/Labor">Wages/Labor</option>
                                <option value="Designer Fee">Designer Fee</option>
                                <option value="Logistics">Logistics</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Studio Rent">Studio Rent</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            value={expenseFormData.date}
                            onChange={(e) =>
                              setExpenseFormData({ ...expenseFormData, date: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          Amount (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-luxury/45 text-xs font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={expenseFormData.amount}
                            onChange={(e) =>
                              setExpenseFormData({ ...expenseFormData, amount: e.target.value })
                            }
                            placeholder="55000"
                            className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full py-3.5 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                      >
                        {formSubmitting ? (
                          <Loader2 className="animate-spin text-black-luxury" size={14} />
                        ) : (
                          <>
                            <PlusCircle size={14} />
                            <span>Log Transaction</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SEO Settings Workspace */}
            {activeTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                    Search Optimization
                  </span>
                  <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                    SEO &amp; Metadata
                  </h2>
                  <p className="text-xs text-beige-luxury/40 mt-2 max-w-xl">
                    Edit how each page appears in search results and social shares. Empty fields fall back to sensible defaults.
                  </p>
                </div>

                {/* Page selector tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {allPages.map((p) => {
                    const row = seoRows.find((r) => r.page === p.page)
                    const hasContent = row && (row.seo_title || row.meta_description)
                    return (
                      <button
                        key={p.page}
                        onClick={() => {
                          setActiveSeoPage(p.page)
                          setSeoDraft(null)
                          setSeoSavedAt(null)
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${activeSeoPage === p.page
                          ? 'bg-gold-metallic text-black-luxury border-gold-metallic shadow-lg shadow-gold-metallic/15'
                          : 'bg-white/5 text-beige-luxury/60 border-white/5 hover:bg-white/10'
                          }`}
                      >
                        <Globe size={13} />
                        <span>{p.label}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasContent ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      </button>
                    )
                  })}
                  
                  {/* Add Page Button */}
                  <button
                    onClick={() => {
                      setPageFormData({ title: '', slug: '' })
                      setPageModal({ mode: 'add' })
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
                  >
                    <Plus size={13} />
                    <span>Add New Page</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
                  {/* Editor form */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                        {allPages.find((p) => p.page === activeSeoPage)?.label} Page
                      </h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${seoIsDirty
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        }`}>
                        {seoIsDirty ? 'Unsaved' : 'Saved'}
                      </span>
                    </div>

                    <div className="space-y-5">
                      {/* SEO Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            SEO Title
                          </label>
                          <span className={`text-[9px] font-mono ${(currentDraft.seo_title?.length || 0) > 60 ? 'text-rose-400' : 'text-beige-luxury/30'}`}>
                            {currentDraft.seo_title?.length || 0}/60
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={60}
                          value={currentDraft.seo_title}
                          onChange={(e) => updateSeoField('seo_title', e.target.value)}
                          placeholder="Premium Modular Kitchens in Vizag | Hayagriva"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            Meta Description
                          </label>
                          <span className={`text-[9px] font-mono ${(currentDraft.meta_description?.length || 0) > 160 ? 'text-rose-400' : 'text-beige-luxury/30'}`}>
                            {currentDraft.meta_description?.length || 0}/160
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={170}
                          value={currentDraft.meta_description}
                          onChange={(e) => updateSeoField('meta_description', e.target.value)}
                          placeholder="Bespoke modular kitchens crafted with premium materials and turnkey execution across Andhra Pradesh."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all resize-none"
                        />
                      </div>

                      {/* Meta Keywords */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          Meta Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={currentDraft.meta_keywords}
                          onChange={(e) => updateSeoField('meta_keywords', e.target.value)}
                          placeholder="modular kitchen vizag, interior designer, turnkey interiors"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all"
                        />
                      </div>

                      {/* Canonical URL */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          Canonical URL (optional, page-relative)
                        </label>
                        <input
                          type="text"
                          value={currentDraft.canonical_url}
                          onChange={(e) => updateSeoField('canonical_url', e.target.value)}
                          placeholder={allPages.find((p) => p.page === activeSeoPage)?.path || '/'}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all"
                        />
                      </div>

                      {/* OG Title / Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            OG Title (Social)
                          </label>
                          <input
                            type="text"
                            value={currentDraft.og_title}
                            onChange={(e) => updateSeoField('og_title', e.target.value)}
                            placeholder="Falls back to SEO Title"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                            Robots
                          </label>
                          <select
                            value={currentDraft.robots}
                            onChange={(e) => updateSeoField('robots', e.target.value)}
                            className="w-full px-4 py-3 bg-charcoal-luxury border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all"
                          >
                            <option value="index, follow">Index, Follow</option>
                            <option value="noindex, follow">Noindex, Follow</option>
                            <option value="index, nofollow">Index, Nofollow</option>
                            <option value="noindex, nofollow">Noindex, Nofollow</option>
                          </select>
                        </div>
                      </div>

                      {/* OG Description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                          OG Description (Social)
                        </label>
                        <textarea
                          rows={2}
                          value={currentDraft.og_description}
                          onChange={(e) => updateSeoField('og_description', e.target.value)}
                          placeholder="Falls back to Meta Description"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all resize-none"
                        />
                      </div>

                      {/* OG Image */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 block">
                          Social Share Image (1200×630)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-metallic/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300">
                            {uploadingImage ? (
                              <Loader2 className="animate-spin text-gold-metallic" size={16} />
                            ) : (
                              <Upload size={16} className="text-gold-metallic" />
                            )}
                            <span className="font-bold text-beige-luxury uppercase tracking-wider text-[10px]">
                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleSeoImageUpload}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="url"
                            value={currentDraft.og_image}
                            onChange={(e) => {
                              updateSeoField('og_image', e.target.value)
                              updateSeoField('og_image_key', '')
                            }}
                            placeholder="https://… or upload above"
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs transition-all"
                          />
                        </div>

                        {currentDraft.og_image && (
                          <div className="relative rounded-2xl overflow-hidden h-32 border border-white/5 bg-white/5">
                            <img
                              src={currentDraft.og_image}
                              alt="Social share preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateSeoField('og_image', '')
                                updateSeoField('og_image_key', '')
                              }}
                              className="absolute top-2.5 right-2.5 p-1 bg-black-luxury/60 text-white rounded-full border border-white/10 hover:bg-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Save / Reset actions */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handleSeoSave}
                        disabled={!seoIsDirty || seoSaving}
                        className="flex-1 py-3.5 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {seoSaving ? (
                          <Loader2 className="animate-spin text-black-luxury" size={14} />
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Save Settings</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleSeoReset}
                        disabled={!seoIsDirty}
                        className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 disabled:opacity-40 transition-all duration-300"
                      >
                        <RotateCcw size={13} />
                        Discard
                      </button>
                    </div>
                  </div>

                  {/* Preview / Tips panel */}
                  <div className="space-y-6">
                    {/* Google SERP preview */}
                    <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                        Search Preview
                      </h3>
                      <div className="rounded-xl bg-white p-4 text-black/80">
                        <div className="text-[11px] text-[#202124] truncate">
                          {`hayagrivainteriors.com${allPages.find((p) => p.page === activeSeoPage)?.path || ''}`}
                        </div>
                        <div className="text-[#1a0dab] text-base leading-snug mt-0.5 line-clamp-1">
                          {currentDraft.seo_title || 'Hayagriva Interiors'}
                        </div>
                        <div className="text-[#4d5156] text-[12px] leading-snug mt-0.5 line-clamp-2">
                          {currentDraft.meta_description || 'Premium Interior Design Studio'}
                        </div>
                      </div>
                    </div>

                    {/* Status card */}
                    <div className="glass-premium rounded-3xl p-6 space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                        Status
                      </h3>
                      <div className="text-[11px] text-beige-luxury/60 leading-relaxed space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${activeSeoRow ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {activeSeoRow ? 'Custom settings saved for this page.' : 'Using default settings (no row yet).'}
                        </div>
                        {seoSavedAt && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Last saved {new Date(seoSavedAt).toLocaleTimeString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Page Content Manager Workspace */}
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gold-metallic uppercase">
                    Dynamic Section Builder
                  </span>
                  <h2 className="text-3xl font-serif text-beige-luxury font-black mt-2">
                    Page Content Manager
                  </h2>
                  <p className="text-xs text-beige-luxury/40 mt-2 max-w-xl">
                    Add, remove, reorder, or edit custom sections for each website page. Drag sections to reorder them instantly.
                  </p>
                </div>

                {/* Page selector tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {allPages.map((p) => (
                    <button
                      key={p.page}
                      onClick={() => {
                        setActiveContentPage(p.page)
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${activeContentPage === p.page
                        ? 'bg-gold-metallic text-black-luxury border-gold-metallic shadow-lg shadow-gold-metallic/15'
                        : 'bg-white/5 text-beige-luxury/60 border-white/5 hover:bg-white/10'
                        }`}
                    >
                      <Globe size={13} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                  
                  {/* Add Page Button */}
                  <button
                    onClick={() => {
                      setPageFormData({ title: '', slug: '' })
                      setPageModal({ mode: 'add' })
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
                  >
                    <Plus size={13} />
                    <span>Add New Page</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
                  {/* Sections List */}
                  <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                          {allPages.find((p) => p.page === activeContentPage)?.label} Page Sections
                        </h3>
                        {customPages.some((p) => p.slug === activeContentPage) && (
                          <button
                            onClick={() => handleDeletePage(activeContentPage)}
                            className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/25 text-red-400 px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold transition-all"
                            title="Delete this custom page"
                          >
                            <Trash2 size={10} />
                            <span>Delete Page</span>
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSectionFormData(defaultSectionData('hero'))
                          setSectionModal({ mode: 'add' })
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-gold-metallic hover:bg-white text-black-luxury font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md"
                      >
                        <Plus size={12} />
                        <span>Add Section</span>
                      </button>
                    </div>

                    {sections.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                        <Layers className="mx-auto text-beige-luxury/20 mb-3" size={24} />
                        <div className="text-xs text-beige-luxury/65 font-bold uppercase tracking-wider">No dynamic sections yet</div>
                        <p className="text-[10px] text-beige-luxury/40 mt-1 max-w-[240px] mx-auto">
                          Add sections to override this page's default static content.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sections.map((sec, idx) => (
                          <div
                            key={sec.id}
                            draggable
                            onDragStart={(e) => setDraggedIndex(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleSectionDrop(idx)}
                            className={`group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold-metallic/25 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedIndex === idx ? 'opacity-40 scale-[0.98]' : ''}`}
                          >
                            <div className="flex items-center gap-3.5 overflow-hidden">
                              {/* Drag Handle Icon */}
                              <div className="text-beige-luxury/35 group-hover:text-gold-metallic transition-colors select-none shrink-0">
                                <svg width="14" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                                  <circle cx="2" cy="2" r="1.5" />
                                  <circle cx="8" cy="2" r="1.5" />
                                  <circle cx="2" cy="9" r="1.5" />
                                  <circle cx="8" cy="9" r="1.5" />
                                  <circle cx="2" cy="16" r="1.5" />
                                  <circle cx="8" cy="16" r="1.5" />
                                </svg>
                              </div>
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold-metallic bg-gold-metallic/15 px-2 py-0.5 rounded">
                                    {sec.type}
                                  </span>
                                  <span className="text-xs font-bold text-beige-luxury truncate">
                                    {sec.title || '(Untitled Section)'}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono text-beige-luxury/35 mt-1 block truncate">
                                  {sec.subtitle || sec.description || 'No descriptive fields configured.'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              {/* Reordering actions */}
                              <div className="flex gap-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0 || sectionOrdering}
                                  onClick={(e) => { e.stopPropagation(); moveSection(idx, -1) }}
                                  className="p-1 text-beige-luxury/40 hover:text-beige-luxury disabled:opacity-20 transition-colors"
                                  title="Move Up"
                                >
                                  <ArrowUpRight className="-rotate-45" size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === sections.length - 1 || sectionOrdering}
                                  onClick={(e) => { e.stopPropagation(); moveSection(idx, 1) }}
                                  className="p-1 text-beige-luxury/40 hover:text-beige-luxury disabled:opacity-20 transition-colors"
                                  title="Move Down"
                                >
                                  <ArrowDownRight className="rotate-45" size={13} />
                                </button>
                              </div>

                              {/* Visibility Switch */}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sec) }}
                                className={`p-1.5 rounded-lg border transition-all ${sec.is_visible
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                  : 'bg-white/5 text-beige-luxury/30 border-white/5 hover:bg-white/10'
                                  }`}
                                title={sec.is_visible ? 'Visible' : 'Hidden'}
                              >
                                {sec.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Ensure custom_json is always a plain object, even if the DB returns it as a JSON string
                                  let parsedCj = sec.custom_json
                                  if (typeof parsedCj === 'string') {
                                    try { parsedCj = JSON.parse(parsedCj) } catch { parsedCj = {} }
                                  }
                                  if (!parsedCj || typeof parsedCj !== 'object' || Array.isArray(parsedCj)) parsedCj = {}
                                  setSectionFormData({
                                    type: sec.type,
                                    title: sec.title || '',
                                    subtitle: sec.subtitle || '',
                                    description: sec.description || '',
                                    content: sec.content || '',
                                    layout: sec.layout || 'full-width',
                                    images: Array.isArray(sec.images) ? sec.images : [],
                                    buttons: Array.isArray(sec.buttons) ? sec.buttons : [],
                                    custom_json: parsedCj,
                                    is_visible: sec.is_visible !== false
                                  })
                                  setSectionModal({ mode: 'edit', section: sec })
                                }}
                                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-beige-luxury/60 hover:text-gold-metallic hover:border-gold-metallic/25 transition-all"
                                title="Edit"
                              >
                                <Edit3 size={13} />
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSectionDuplicate(sec) }}
                                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-beige-luxury/60 hover:text-gold-metallic hover:border-gold-metallic/25 transition-all"
                                title="Duplicate"
                              >
                                <Copy size={13} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSectionDelete(sec.id) }}
                                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-beige-luxury/50 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visual Layout Preview */}
                  <div className="space-y-6">
                    <div className="glass-premium rounded-3xl p-6 sm:p-8 space-y-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-beige-luxury">
                        Layout Preview
                      </h3>
                      <div className="rounded-xl border border-white/5 bg-charcoal-luxury/50 p-4 min-h-[300px] flex flex-col gap-3">
                        {sections.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full my-auto text-beige-luxury/20 text-xs">
                            <span>Wireframe will render here.</span>
                          </div>
                        ) : (
                          sections.map((sec, idx) => (
                            <div
                              key={sec.id}
                              className={`p-3.5 rounded-xl border transition-all ${sec.is_visible
                                ? 'bg-gold-metallic/5 border-gold-metallic/20 text-beige-luxury'
                                : 'bg-white/5 border-white/5 text-beige-luxury/30 line-through'
                                }`}
                            >
                              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                                <span>Section {idx + 1}: {sec.type}</span>
                                <span className="text-gold-metallic">{sec.layout}</span>
                              </div>
                              <div className="text-xs font-bold mt-1 text-beige-luxury/90 truncate">{sec.title || '(No Title)'}</div>
                              {sec.buttons && sec.buttons.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {sec.buttons.map((btn, bIdx) => (
                                    <span key={bIdx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-beige-luxury/60">
                                      {btn.text}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Media Library Workspace */}
            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <MediaLibrary />
              </motion.div>
            )}

            {/* Service FAQs Workspace */}
            {activeTab === 'service-faqs' && (
              <motion.div
                key="service-faqs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <ServiceFaqsManager />
              </motion.div>
            )}

            {/* SEO Internal Links Workspace */}
            {activeTab === 'internal-links' && (
              <motion.div
                key="internal-links"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <SeoInternalLinksManager />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Contact Details Modal */}
      <AnimatePresence>
        {viewContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-luxury/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg glass-premium rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" />
              <button
                onClick={() => setViewContact(null)}
                className="absolute top-6 right-6 text-beige-luxury/40 hover:text-beige-luxury"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.25em] text-gold-metallic uppercase block mb-1">
                    Enquiry Details
                  </span>
                  <h3 className="text-xl font-serif font-black text-beige-luxury uppercase tracking-wider">
                    {viewContact.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 text-xs">
                  <div>
                    <span className="text-[10px] text-beige-luxury/40 uppercase tracking-widest block">Email</span>
                    <span className="font-bold text-beige-luxury block mt-1">{viewContact.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-beige-luxury/40 uppercase tracking-widest block">Phone</span>
                    <span className="font-bold text-beige-luxury block mt-1">{viewContact.phone}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-beige-luxury/40 uppercase tracking-widest block">Message</span>
                  <div className="bg-white/5 rounded-xl border border-white/5 p-5 text-beige-luxury/80 leading-relaxed max-h-48 overflow-y-auto">
                    {viewContact.message}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-beige-luxury/40 uppercase tracking-wider">
                  <span>Source: {viewContact.source || 'Website'}</span>
                  <span>
                    Received:{' '}
                    {new Date(viewContact.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`mailto:${viewContact.email}`}
                    className="flex-1 py-3 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-[10px] rounded-xl text-center shadow-lg transition-all duration-300"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDeleteContact(viewContact.id)}
                    className="py-3 px-4 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl text-xs transition-all duration-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Project Modal Drawer */}
      <AnimatePresence>
        {projectForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-luxury/80 backdrop-blur-md flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-xl bg-charcoal-luxury border-l border-white/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto h-screen relative"
            >
              <button
                onClick={() => {
                  setProjectForm(null)
                  setSelectedProject(null)
                }}
                className="absolute top-6 right-6 text-beige-luxury/40 hover:text-beige-luxury"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.25em] text-gold-metallic uppercase block mb-1">
                    Portfolio Editor
                  </span>
                  <h3 className="text-xl font-serif font-black text-beige-luxury">
                    {projectForm === 'add' ? 'Add Portfolio Item' : 'Edit Project Details'}
                  </h3>
                </div>

                <form onSubmit={handleProjectSubmit} id="project-form" className="space-y-5 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={projectFormData.title}
                      onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                      placeholder="e.g. Modern Wood Kitchen & Island"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                        Category
                      </label>
                      <select
                        value={projectFormData.category}
                        onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-charcoal-luxury border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all"
                      >
                        <option value="Kitchen">Kitchen</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Living Room">Living Room</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                        Est. Budget
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.budget}
                        onChange={(e) => setProjectFormData({ ...projectFormData, budget: e.target.value })}
                        placeholder="e.g. ₹18.5L"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.location}
                        onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                        placeholder="e.g. Visakhapatnam, AP"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                        Project Year
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.year}
                        onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                        placeholder="e.g. 2024"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                        Area
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.area}
                        onChange={(e) => setProjectFormData({ ...projectFormData, area: e.target.value })}
                        placeholder="e.g. 250 Sq Ft"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                      Materials Palette
                    </label>
                    <input
                      type="text"
                      required
                      value={projectFormData.materials}
                      onChange={(e) => setProjectFormData({ ...projectFormData, materials: e.target.value })}
                      placeholder="e.g. White Oak, Granite Countertop, Premium Fixtures"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                      Aesthetic Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={projectFormData.desc}
                      onChange={(e) => setProjectFormData({ ...projectFormData, desc: e.target.value })}
                      placeholder="Explain the architectural direction..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-3.5 pt-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 block">
                      Project Showcase Image
                    </label>

                    {/* File Upload Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-beige-luxury/40 uppercase tracking-wider block">
                          Upload File
                        </span>
                        <label className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-metallic/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300">
                          {uploadingImage ? (
                            <Loader2 className="animate-spin text-gold-metallic" size={16} />
                          ) : (
                            <Upload size={16} className="text-gold-metallic" />
                          )}
                          <span className="font-bold text-beige-luxury uppercase tracking-wider text-[10px]">
                            {uploadingImage ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-beige-luxury/40 uppercase tracking-wider block">
                          Or Direct Image URL
                        </span>
                        <input
                          type="url"
                          value={projectFormData.image}
                          onChange={(e) =>
                            setProjectFormData({ ...projectFormData, image: e.target.value, image_key: '' })
                          }
                          placeholder="https://images.unsplash.com/..."
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    {projectFormData.image && (
                      <div className="relative rounded-2xl overflow-hidden h-32 border border-white/5 bg-white/5">
                        <img
                          src={projectFormData.image}
                          alt="Showcase Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setProjectFormData({ ...projectFormData, image: '', image_key: '' })}
                          className="absolute top-2.5 right-2.5 p-1 bg-black-luxury/60 text-white rounded-full border border-white/10 hover:bg-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Project gallery (carousel images) — only when editing an existing project.
                      These images appear ONLY inside the project details image gallery/carousel. */}
                  {projectForm === 'edit' && selectedProject?.id && (
                    <div className="space-y-3.5 pt-1.5 border-t border-white/5 pt-5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 flex items-center gap-1.5">
                          <Images size={12} className="text-gold-metallic" />
                          Gallery Images ({galleryImages.length})
                        </label>
                        <span className="text-[9px] text-beige-luxury/40 uppercase tracking-wider">
                          First slide is the cover. Drag to reorder.
                        </span>
                      </div>

                      {/* Cover preview — reflects the active projects.image */}
                      {projectFormData.image && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gold-metallic/5 border border-gold-metallic/20">
                          <img
                            src={projectFormData.image}
                            alt="Cover"
                            className="h-12 w-12 rounded-lg object-cover border border-gold-metallic/30"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gold-metallic block">
                              Cover Image (Slide 1)
                            </span>
                            <span className="text-[9px] text-beige-luxury/40 truncate block">
                              {projectFormData.image}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Upload add row — supports multiple files + URL paste */}
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                        <label className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-metallic/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300">
                          {galleryUploading ? (
                            <Loader2 className="animate-spin text-gold-metallic" size={16} />
                          ) : (
                            <Plus size={16} className="text-gold-metallic" />
                          )}
                          <span className="font-bold text-beige-luxury uppercase tracking-wider text-[10px]">
                            {galleryUploading ? 'Adding...' : 'Upload Images (multi)'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={galleryUploading}
                            onChange={handleGalleryUpload}
                            className="hidden"
                          />
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={galleryUrlInput}
                            disabled={galleryUploading}
                            onChange={(e) => setGalleryUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleGalleryUrlAdd()
                              }
                            }}
                            placeholder="Paste image URL"
                            className="flex-1 sm:w-44 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic text-beige-luxury placeholder-white/30 text-[11px] transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleGalleryUrlAdd}
                            disabled={galleryUploading || !galleryUrlInput.trim()}
                            className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider disabled:opacity-40 transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Gallery thumbnails — draggable to reorder */}
                      {galleryLoading ? (
                        <div className="flex items-center justify-center py-6 text-beige-luxury/40">
                          <Loader2 className="animate-spin" size={16} />
                        </div>
                      ) : galleryImages.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {galleryImages.map((img, idx) => (
                            <div
                              key={img.id}
                              draggable
                              onDragStart={() => handleGalleryDragStart(idx)}
                              onDragOver={(e) => handleGalleryDragOver(e, idx)}
                              onDragEnd={handleGalleryDragEnd}
                              onDrop={(e) => e.preventDefault()}
                              className={`relative rounded-xl overflow-hidden h-28 border bg-white/5 group cursor-grab active:cursor-grabbing transition-all ${
                                galleryDraggedIndex === idx
                                  ? 'border-gold-metallic ring-2 ring-gold-metallic/40 opacity-60'
                                  : 'border-white/10 hover:border-gold-metallic/40'
                              }`}
                            >
                              <span className="absolute top-1.5 left-1.5 z-10 h-5 w-5 rounded-full bg-black-luxury/70 border border-white/10 text-[9px] font-bold text-gold-metallic flex items-center justify-center tabular-nums">
                                {idx + 1}
                              </span>
                              <img
                                src={img.image_url}
                                alt={img.caption || 'Gallery image'}
                                draggable={false}
                                className="w-full h-full object-cover pointer-events-none"
                              />

                              {/* Hover action bar */}
                              <div className="absolute inset-0 bg-black-luxury/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleGalleryMove(idx, -1)}
                                    disabled={idx === 0}
                                    title="Move left"
                                    className="p-1 bg-white/10 hover:bg-gold-metallic hover:text-black-luxury text-white rounded-md border border-white/10 disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white transition-all"
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleGalleryMove(idx, 1)}
                                    disabled={idx === galleryImages.length - 1}
                                    title="Move right"
                                    className="p-1 bg-white/10 hover:bg-gold-metallic hover:text-black-luxury text-white rounded-md border border-white/10 disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white transition-all"
                                  >
                                    <ChevronRight size={13} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <label
                                    title="Replace image"
                                    className="p-1 bg-white/10 hover:bg-gold-metallic hover:text-black-luxury text-white rounded-md border border-white/10 cursor-pointer transition-all"
                                  >
                                    <RefreshCw size={13} />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleGalleryReplace(img.id, e)}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleGallerySetCover(img.id)}
                                    title="Set as cover"
                                    className="p-1 bg-white/10 hover:bg-gold-metallic hover:text-black-luxury text-white rounded-md border border-white/10 transition-all"
                                  >
                                    <Star size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleGalleryDelete(img.id)}
                                    title="Delete image"
                                    className="p-1 bg-white/10 hover:bg-red-500 text-white rounded-md border border-white/10 transition-all"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-beige-luxury/40 italic">
                          No gallery images yet. Add more photos above — they will appear in the
                          project details carousel after the cover.
                        </p>
                      )}
                    </div>
                  )}
                </form>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="submit"
                    form="project-form"
                    disabled={formSubmitting || uploadingImage}
                    className="flex-1 py-4 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                  >
                    {formSubmitting ? (
                      <Loader2 className="animate-spin text-black-luxury" size={14} />
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        <span>{projectForm === 'add' ? 'Publish Project' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectForm(null)
                      setSelectedProject(null)
                    }}
                    className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Page Modal */}
      <AnimatePresence>
        {pageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-luxury/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-charcoal-luxury border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setPageModal(null)}
                className="absolute top-6 right-6 text-beige-luxury/40 hover:text-beige-luxury"
              >
                <X size={20} />
              </button>

              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-[0.25em] text-gold-metallic uppercase block">
                  Page Manager
                </span>
                <h3 className="text-xl font-serif font-black text-beige-luxury">
                  Create Custom Page
                </h3>
              </div>

              <form onSubmit={handlePageSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                    Page Title
                  </label>
                  <input
                    type="text"
                    required
                    value={pageFormData.title}
                    onChange={(e) => {
                      const val = e.target.value
                      const generatedSlug = val.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-')
                      setPageFormData({ title: val, slug: generatedSlug })
                    }}
                    placeholder="e.g. Testimonials"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                    URL Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 select-none font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      value={pageFormData.slug}
                      onChange={(e) => setPageFormData({ ...pageFormData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                      placeholder="testimonials"
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-xs transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pageSaving}
                  className="w-full py-3.5 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                >
                  {pageSaving ? (
                    <Loader2 className="animate-spin text-black-luxury" size={14} />
                  ) : (
                    <>
                      <PlusCircle size={14} />
                      <span>Create Page</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Section Modal Drawer */}
      <AnimatePresence>
        {sectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-luxury/80 backdrop-blur-md flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-xl bg-charcoal-luxury border-l border-white/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto h-screen relative"
            >
              <button
                onClick={() => { setSectionModal(null); setSectionModalError('') }}
                className="absolute top-6 right-6 text-beige-luxury/40 hover:text-beige-luxury"
              >
                <X size={20} />
              </button>

              <div className="space-y-8 pb-10">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.25em] text-gold-metallic uppercase block mb-1">
                    Content Editor
                  </span>
                  <h3 className="text-xl font-serif font-black text-beige-luxury">
                    {sectionModal.mode === 'add' ? 'Add Section' : 'Edit Section Details'}
                  </h3>
                </div>

                <form onSubmit={handleSectionSave} id="section-form" className="space-y-5 text-xs">
                  {/* Section type selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50">
                      Section Type
                    </label>
                    <select
                      value={sectionFormData.type}
                      onChange={(e) => handleSectionTypeChange(e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-luxury border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury text-xs transition-all"
                    >
                      {SECTION_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {SECTION_SCHEMAS[sectionFormData.type]?.description && (
                      <p className="text-[9px] text-beige-luxury/35 leading-tight">
                        {SECTION_SCHEMAS[sectionFormData.type].description}
                      </p>
                    )}
                  </div>

                  {/* Visibility toggle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/50 block">
                      Visibility
                    </label>
                    <div className="flex items-center h-12">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sectionFormData.is_visible}
                          onChange={(e) => setSectionFormData({ ...sectionFormData, is_visible: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-beige-luxury after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-metallic"></div>
                        <span className="ml-3 text-[10px] font-bold uppercase tracking-wider text-beige-luxury/60">
                          {sectionFormData.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Type-specific structured fields */}
                  <SectionFormBuilder
                    schema={SECTION_SCHEMAS[sectionFormData.type]}
                    value={sectionFormData}
                    onChange={setSectionFormData}
                    onUploadImages={async (files) => {
                      const newImages = []
                      for (let i = 0; i < files.length; i++) {
                        // Reuse the existing storage upload helper pattern
                        const { data, error } = await insforgeClient.storage
                          .from('images')
                          .uploadAuto(files[i])
                        if (error) throw error
                        if (data) newImages.push({ url: data.url, key: data.key })
                      }
                      return newImages
                    }}
                    uploading={uploadingImage}
                  />

                  {/* Advanced / raw JSON panel (collapsible) */}
                  <details className="border-t border-white/5 pt-4 mt-2">
                    <summary className="text-[10px] font-bold uppercase tracking-widest text-beige-luxury/40 cursor-pointer hover:text-beige-luxury/60 transition-colors select-none">
                      Advanced — raw JSON editor
                    </summary>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[9px] text-beige-luxury/30">
                        Edits here are two-way synced with the structured fields above. Use for unmapped keys or bulk paste.
                      </p>
                      <textarea
                        rows={6}
                        value={
                          typeof sectionFormData.custom_json === 'object'
                            ? JSON.stringify(sectionFormData.custom_json, null, 2)
                            : sectionFormData.custom_json || ''
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            setSectionFormData({ ...sectionFormData, custom_json: parsed })
                          } catch {
                            // Allow the admin to type freely; validate on save
                            setSectionFormData({ ...sectionFormData, custom_json: e.target.value })
                          }
                        }}
                        placeholder='{ "myKey": "value" }'
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/25 text-xs font-mono transition-all resize-none"
                      />
                    </div>
                  </details>
                </form>

                {/* Error banner — rendered inside the modal so it's always visible */}
                {sectionModalError && (
                  <div className="mx-0 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs leading-relaxed">
                    <ShieldAlert className="stroke-red-400 shrink-0 mt-0.5" size={14} />
                    <span className="flex-1">{sectionModalError}</span>
                    <button
                      type="button"
                      onClick={() => setSectionModalError('')}
                      className="text-red-400 hover:text-white shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="submit"
                    form="section-form"
                    disabled={sectionSaving || uploadingImage}
                    className="flex-1 py-4 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {sectionSaving ? (
                      <Loader2 className="animate-spin text-black-luxury" size={14} />
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save Section</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSectionModal(null); setSectionModalError('') }}
                    className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 text-beige-luxury"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SectionSavedBanner ────────────────────────────────────────────
// A self-dismissing success notification shown after a section is saved.
// Consistent with the SEO savedAt pattern already used in this dashboard.
function SectionSavedBanner({ savedAt, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [savedAt, onDismiss])

  return (
    <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-200 text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle className="stroke-emerald-400 shrink-0" size={16} />
        <span className="font-semibold">
          Section saved successfully —{' '}
          <span className="opacity-60">
            {new Date(savedAt).toLocaleTimeString('en-IN')}
          </span>
        </span>
      </div>
      <button onClick={onDismiss} className="text-emerald-400 hover:text-white">
        <X size={14} />
      </button>
    </div>
  )
}
