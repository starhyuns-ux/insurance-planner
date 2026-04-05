'use client'

import React, { useState, useEffect } from 'react'
import LeadPipeline from '../components/LeadPipeline'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [leads, setLeads] = useState<any[]>([])

  const fetchLeads = async () => {
    if (!planner) return
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: false })
    if (data) setLeads(data)
  }

  useEffect(() => {
    if (planner) {
      fetchLeads()
      localStorage.setItem('notif_last_seen', new Date().toISOString())
    }
  }, [planner])

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <LeadPipeline 
        leads={leads}
        onDeleteLead={async (id) => {
          if (!confirm('삭제하시겠습니까?')) return
          const { error } = await supabase.from('consultations').delete().eq('id', id)
          if (!error) {
            toast.success('삭제되었습니다.')
            fetchLeads()
          }
        }}
        onUpdateStatus={async (id, status) => {
          const { error } = await supabase.from('consultations').update({ status }).eq('id', id)
          if (!error) {
            toast.success('상태가 업데이트되었습니다.')
            fetchLeads()
          }
        }}
      />
    </div>
  )
}
