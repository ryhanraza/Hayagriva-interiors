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
  LayoutDashboard
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Data states
  const [contacts, setContacts] = useState([])
  const [projects, setProjects] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loadingData, setLoadingData] = useState(true)

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

  // Verify auth session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await insforgeClient.auth.getCurrentUser()
        if (error || !data?.user) {
          router.replace('/admin/login')
          return
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
        const token = insforgeClient.auth?.tokenManager?.getAccessToken?.()
        fetchDashboardData(token)
      } catch (err) {
        console.error('Session verification error:', err)
        router.replace('/admin/login')
      }
    }
    checkSession()
  }, [router])

  // Get authentication token helper
  async function getHeaders() {
    let accessToken = insforgeClient.auth?.tokenManager?.getAccessToken?.()

    if (!accessToken && typeof window !== 'undefined') {
      accessToken = window.localStorage.getItem('hayagriva_admin_access_token')
      if (accessToken) {
        insforgeClient.setAccessToken(accessToken)
      }
    }

    if (!accessToken) {
      const { data, error } = await insforgeClient.auth.getCurrentUser()
      if (!error && data?.user) {
        accessToken = insforgeClient.auth?.tokenManager?.getAccessToken?.()
      }
    }

    const headers = { 'Content-Type': 'application/json' }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
  }

  // Fetch all dashboard data from API routes
  async function fetchDashboardData(passedToken) {
    setLoadingData(true)
    setErrorMsg('')
    try {
      const headers = passedToken
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${passedToken}` }
        : await getHeaders()

      // Fetch Contacts
      const contactsRes = await fetch('/api/admin/contacts', {
        headers,
        credentials: 'include'
      })
      const contactsData = await contactsRes.json()

      // Fetch Projects (public route supports dynamic db seed, admin can load from there)
      const projectsRes = await fetch('/api/projects')
      const projectsData = await projectsRes.json()

      // Fetch Expenses
      const expensesRes = await fetch('/api/admin/expenses', {
        headers,
        credentials: 'include'
      })
      const expensesData = await expensesRes.json()

      if (Array.isArray(contactsData)) setContacts(contactsData)
      if (Array.isArray(projectsData)) setProjects(projectsData)
      if (Array.isArray(expensesData)) setExpenses(expensesData)
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

      const result = await res.json()
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

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete project')
      }

      fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
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

      const result = await res.json()
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

    try {
      const headers = await getHeaders()
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers,
        body: JSON.stringify(expenseFormData),
        credentials: 'include'
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to add expense')
      }

      // Reset Form
      setExpenseFormData({
        amount: '',
        category: expenseFormData.type === 'income' ? 'Project Payment' : 'Materials',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: expenseFormData.type
      })
      fetchDashboardData()
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

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete expense')
      }

      fetchDashboardData()
    } catch (err) {
      setErrorMsg(err.message)
    }
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
  }

  // Calculations for Overview Stats
  const expenseItems = expenses.filter(item => item.type === 'expense' || !item.type)
  const incomeItems = expenses.filter(item => item.type === 'income')

  const totalExpenses = expenseItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  const totalIncome = incomeItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  const netProfitLoss = totalIncome - totalExpenses

  const categoryExpenses = expenseItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + parseFloat(item.amount || 0)
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
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
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
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                      isIncome 
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
                            className={`py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition-all duration-300 ${
                              expenseFormData.type === 'expense'
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
                            className={`py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition-all duration-300 ${
                              expenseFormData.type === 'income'
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
    </div>
  )
}
