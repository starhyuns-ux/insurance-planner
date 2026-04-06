'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const ATTRIBUTION_COOKIE = 'attributed_planner_id'

export function setAttributedPlanner(id: string) {
  if (typeof window === 'undefined') return
  
  // Set cookie with 7 days expiry
  const date = new Date()
  date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
  document.cookie = `${ATTRIBUTION_COOKIE}=${id}; expires=${date.toUTCString()}; path=/`
  
  // Also save to localStorage for faster client-side access
  localStorage.setItem(ATTRIBUTION_COOKIE, id)
}

export function getAttributedPlannerId(): string | null {
  if (typeof window === 'undefined') return null
  
  // Try localStorage first
  const local = localStorage.getItem(ATTRIBUTION_COOKIE)
  if (local) return local
  
  // Fallback to cookie
  const name = ATTRIBUTION_COOKIE + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
}

export function useAttribution() {
  const [planner, setPlanner] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAttribution() {
      const id = getAttributedPlannerId()
      if (id) {
        const { data, error } = await supabase
          .from('planners')
          .select('*')
          .eq('id', id)
          .single()
        
        if (!error && data) {
          setPlanner(data)
        }
      }
      setLoading(false)
    }

    fetchAttribution()
  }, [])

  return { planner, loading }
}

export function clearAttribution() {
  if (typeof window === 'undefined') return
  document.cookie = `${ATTRIBUTION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  localStorage.removeItem(ATTRIBUTION_COOKIE)
}
