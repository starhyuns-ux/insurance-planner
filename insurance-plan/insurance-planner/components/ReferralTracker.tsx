'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { setAttributedPlanner } from '@/lib/attribution'

export default function ReferralTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if '?ref=CODE' is present in the URL
    const refCode = searchParams.get('ref')
    
    if (refCode) {
      // 1. Unified Attribution: Set the planner attribution used by access guards
      setAttributedPlanner(refCode)
      
      // 2. Store in localStorage for client-side easy access
      localStorage.setItem('referral_code', refCode)
      
      // 3. Store in cookie for server-side easy access (e.g., API routes)
      // Expires in 30 days
      const d = new Date()
      d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000))
      const expires = `expires=${d.toUTCString()}`
      document.cookie = `referral_code=${refCode};${expires};path=/`
      
      console.log(`Referral/Attribution code [${refCode}] has been saved.`)
    }
  }, [searchParams])

  return null // This component doesn't render anything
}
