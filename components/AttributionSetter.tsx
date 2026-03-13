'use client'

import { useEffect } from 'react'
import { setAttributedPlanner } from '@/lib/attribution'

export default function AttributionSetter({ plannerId }: { plannerId: string }) {
  useEffect(() => {
    if (plannerId) {
      setAttributedPlanner(plannerId)
    }
  }, [plannerId])

  return null
}
