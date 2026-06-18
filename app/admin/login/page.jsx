'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { insforgeClient } from '../../../lib/insforge-client'
import { motion } from 'framer-motion'
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ALLOWED_ADMIN_EMAILS = ['interiorsbyhayagriva@gmail.com', 'interiorsbyhayagriya@gmail.com']
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Clear stale session on mount to prevent invalid refresh token requests
    insforgeClient.auth.signOut().catch(() => {})
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hayagriva_admin_access_token')
    }

    // Show query parameter error if any
    const errParam = searchParams.get('error')
    if (errParam === 'unauthorized') {
      setError('Your account is not authorized to access the Admin Panel. Allowed emails only.')
    }
  }, [searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const enteredEmail = formData.email.toLowerCase().trim()
      if (!ALLOWED_ADMIN_EMAILS.includes(enteredEmail)) {
        throw new Error('Access Denied: Only the authorized admin email may log in.')
      }

      const { data, error: authError } = await insforgeClient.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        throw authError
      }

      if (data?.accessToken) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('hayagriva_admin_access_token', data.accessToken)
          insforgeClient.setAccessToken(data.accessToken)
        }
        router.replace('/admin/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err);
      const rawMsg = err.message || JSON.stringify(err);
      if (err.message && (err.message.includes('fetch') || err.message.includes('Network'))) {
        setError(`Network Connection Failed: Could not connect to the backend database (Detail: ${rawMsg}). Please check your internet connection, restart your Next.js dev server, or check if an adblocker/firewall is blocking requests to the backend API.`);
      } else {
        setError(rawMsg || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="glass-premium rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle gold decoration */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" />

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold-metallic uppercase block mb-2">
            Hayagriva Interiors
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-beige-luxury font-black tracking-wide leading-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-beige-luxury/50 mt-2">
            Enter the authorized admin credentials to continue.
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/25 flex items-start gap-3 text-red-200 text-xs leading-relaxed"
          >
            <ShieldAlert className="stroke-red-400 shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-luxury/45">
              <Mail size={16} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-luxury/45">
              <Lock size={16} />
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-sm transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-metallic/15 flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-black-luxury border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <div className="bg-black-luxury min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Dynamic Background Design */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-45" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4 text-beige-luxury">
          <Loader2 className="animate-spin text-gold-metallic" size={40} />
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-mute">Loading Portal...</span>
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
