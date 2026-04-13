'use client'

import { useEffect } from 'react'

export default function PageTracker() {
  useEffect(() => {
    // Check if we already tracked this session to avoid overcounting on refresh
    const hasVisited = sessionStorage.getItem('site_visited')
    
    if (!hasVisited) {
      sessionStorage.setItem('site_visited', 'true')
      
      // Fire and forget
      fetch('/api/track-visit', { method: 'POST' }).catch((err) => {
        console.error('Failed to track visit:', err)
      })
    }
  }, [])

  return null // Render nothing explicitly
}
