'use client'

import React from 'react'
import SubscriptionTab from '../components/SubscriptionTab'
import { usePlanner } from '@/lib/providers/PlannerProvider'

export default function SubscriptionPage() {
  const { planner, loading: plannerLoading, refreshPlanner } = usePlanner()

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SubscriptionTab 
        planner={planner}
      />
    </div>
  )
}
