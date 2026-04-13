'use client'

import { useEffect } from 'react'

export default function VisitTracker() {
  useEffect(() => {
    // Only track visitors, not when developing locally (optional, but keep it for production)
    if (typeof window !== 'undefined') {
      const trackVisit = async () => {
        try {
          // Add a small delay to ensure it's not a quick bounce or automated scan
          const timeout = setTimeout(async () => {
             const res = await fetch('/api/track-visit', { method: 'POST' })
             if (!res.ok) console.error('Track visit response error')
          }, 1500)
          
          return () => clearTimeout(timeout)
        } catch (err) {
          console.error('Track visit error:', err)
        }
      }
      
      trackVisit()
    }
  }, [])

  return null // This component doesn't render anything
}
