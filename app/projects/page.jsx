'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProjectsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/portfolio')
  }, [router])

  return (
    <div className="min-h-screen bg-warmcream flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted font-semibold tracking-wider uppercase">Loading Portfolio...</span>
      </div>
    </div>
  )
}
