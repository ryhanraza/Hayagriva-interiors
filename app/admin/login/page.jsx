'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { insforgeClient } from '../../../lib/insforge-client'
import { motion } from 'framer-motion'
import { Lock, Mail, User, ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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
    setSuccess('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // Sign In
        const { data, error: authError } = await insforgeClient.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (authError) {
          throw authError
        }

        if (data?.accessToken) {
          // Double check email before redirecting
          const allowedAdminEmails = ['admin@example.com', '22rayyanraza@gmail.com', 'interiorsbyhayagriva@gmail.com']
          if (!allowedAdminEmails.includes(data.user.email)) {
            await insforgeClient.auth.signOut()
            setError('Access Denied: Your email is not in the allowed admin list.')
            setIsLoading(false)
            return
          }
          
          router.replace('/admin/dashboard')
        }
      } else {
        // Sign Up / Register
        const allowedAdminEmails = ['admin@example.com', '22rayyanraza@gmail.com', 'interiorsbyhayagriva@gmail.com']
        if (!allowedAdminEmails.includes(formData.email)) {
          throw new Error('Registration Forbidden: Only authorized admin emails can sign up.')
        }

        const { data, error: signUpError } = await insforgeClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name || 'Admin',
        })

        if (signUpError) {
          throw signUpError
        }

        if (data?.requireEmailVerification) {
          setSuccess('Registration successful! Please check your email for a verification link.')
        } else {
          setSuccess('Registration successful! You can now log in.')
          setIsLogin(true)
        }
      }
    } catch (err) {
      if (err.message && (err.message.includes('fetch') || err.message.includes('Network'))) {
        setError('Network Connection Failed: Could not connect to the backend database. Please check your internet connection, restart your Next.js dev server, or check if an adblocker/firewall is blocking requests to the backend API.')
      } else {
        setError(err.message || 'Authentication failed. Please try again.')
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
            {isLogin ? 'Admin Portal' : 'Register Admin'}
          </h1>
          <p className="text-xs text-beige-luxury/50 mt-2">
            {isLogin ? 'Please enter credentials to manage your workspace.' : 'Create a new secure workspace account.'}
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

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/25 flex items-start gap-3 text-emerald-200 text-xs leading-relaxed"
          >
            <CheckCircle2 className="stroke-emerald-400 shrink-0 mt-0.5" size={16} />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-luxury/45">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic/20 text-beige-luxury placeholder-white/30 text-sm transition-all"
                required
              />
            </div>
          )}

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
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSuccess('')
            }}
            className="text-xs text-beige-luxury/50 hover:text-gold-metallic transition-colors"
          >
            {isLogin ? "Need to create an admin account? Register" : "Already have an admin account? Sign In"}
          </button>
        </div>
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
