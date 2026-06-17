'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { insforgeClient } from '../../lib/insforge-client'
import { Loader2 } from 'lucide-react'

export default function AdminIndex() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforgeClient.auth.getCurrentUser()
        if (error || !data?.user) {
          router.replace('/admin/login')
          return
        }

        // Restrict to authorized admin emails
        const allowedAdminEmails = ['admin@example.com', '22rayyanraza@gmail.com']
        if (allowedAdminEmails.includes(data.user.email)) {
          router.replace('/admin/dashboard')
        } else {
          // Sign them out if they are not allowed
          await insforgeClient.auth.signOut()
          router.replace('/admin/login?error=unauthorized')
        }
      } catch (err) {
        console.error('Session check error:', err)
        router.replace('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="bg-black-luxury min-h-screen flex flex-col items-center justify-center gap-4 text-beige-luxury">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-45" />
      <Loader2 className="animate-spin text-gold-metallic" size={40} />
      <h2 className="font-serif text-sm uppercase tracking-[0.25em] text-gold-metallic font-bold">
        Verifying Credentials
      </h2>
      <p className="text-xs text-beige-luxury/40">Securing environment...</p>
    </div>
  )
}
