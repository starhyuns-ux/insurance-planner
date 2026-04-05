'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'

type Planner = {
  id: string
  name: string
  phone: string
  profile_image_url: string | null
  business_card_url: string | null
  affiliation: string
  region: string
  kakao_url: string
  advisor_message: string | null
  subscription_status: 'active' | 'inactive'
  notification_email: string | null
  gmail_app_password: string | null
  referral_code?: string
  visit_count?: number
}

interface PlannerContextType {
  planner: Planner | null
  loading: boolean
  refreshPlanner: () => Promise<void>
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined)

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [planner, setPlanner] = useState<Planner | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshPlanner = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      if (pathname.startsWith('/dashboard')) {
        router.push('/login')
      }
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('planners')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setPlanner(profile)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshPlanner()
  }, [pathname])

  return (
    <PlannerContext.Provider value={{ planner, loading, refreshPlanner }}>
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const context = useContext(PlannerContext)
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider')
  }
  return context
}
