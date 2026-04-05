'use client'

import React, { useState, useEffect } from 'react'
import CustomerCRM from '../components/CustomerCRM'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { safeFormat, getInsuranceAge } from '@/lib/time'

export default function CustomersPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Local Form State
  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustAddr, setNewCustAddr] = useState('')
  const [newCustBirth, setNewCustBirth] = useState('')
  const [newCustFamily, setNewCustFamily] = useState('1')
  const [newCustRiders, setNewCustRiders] = useState('')
  const [newCustAppt, setNewCustAppt] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedMemoId, setExpandedMemoId] = useState<string | null>(null)
  const [memoValue, setMemoValue] = useState('')
  const [editCustName, setEditCustName] = useState('')
  const [editCustPhone, setEditCustPhone] = useState('')
  const [editCustAddr, setEditCustAddr] = useState('')
  const [editCustBirth, setEditCustBirth] = useState('')
  const [editCustFamily, setEditCustFamily] = useState('1')
  const [editCustRiders, setEditCustRiders] = useState('')
  const [editCustAppt, setEditCustAppt] = useState('')

  const fetchCustomers = async () => {
    if (!planner) return
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: false })
    if (data) setCustomers(data)
    setLoading(false)
  }

  useEffect(() => {
    if (planner) fetchCustomers()
  }, [planner])

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) return
    const { error } = await supabase
      .from('customers')
      .insert({
        planner_id: planner.id,
        name: newCustName,
        phone: newCustPhone,
        address: newCustAddr,
        birth_date: newCustBirth || null,
        family_count: parseInt(newCustFamily) || 1,
        riders: newCustRiders.split(',').map(r => r.trim()).filter(r => r !== ''),
        appointment_at: newCustAppt || null
      })

    if (!error) {
      toast.success('고객 정보가 등록되었습니다.')
      setNewCustName('')
      setNewCustPhone('')
      setNewCustAddr('')
      setNewCustBirth('')
      setNewCustFamily('1')
      setNewCustRiders('')
      setNewCustAppt('')
      fetchCustomers()
    } else {
      toast.error('등록 중 오류가 발생했습니다.')
    }
  }

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CustomerCRM 
        customers={customers}
        newCustName={newCustName}
        newCustPhone={newCustPhone}
        newCustAddr={newCustAddr}
        newCustBirth={newCustBirth}
        newCustFamily={newCustFamily}
        newCustRiders={newCustRiders}
        editingId={editingId}
        expandedMemoId={expandedMemoId}
        memoValue={memoValue}
        editCustName={editCustName}
        editCustPhone={editCustPhone}
        editCustAddr={editCustAddr}
        editCustBirth={editCustBirth}
        editCustFamily={editCustFamily}
        editCustRiders={editCustRiders}
        editCustAppt={editCustAppt}
        onUpdateState={(key, value) => {
          if (key === 'newCustName') setNewCustName(value)
          if (key === 'newCustPhone') setNewCustPhone(value)
          if (key === 'newCustAddr') setNewCustAddr(value)
          if (key === 'newCustBirth') setNewCustBirth(value)
          if (key === 'newCustFamily') setNewCustFamily(value)
          if (key === 'newCustRiders') setNewCustRiders(value)
          if (key === 'editingId') setEditingId(value)
          if (key === 'expandedMemoId') setExpandedMemoId(value)
          if (key === 'memoValue') setMemoValue(value)
          if (key === 'editCustName') setEditCustName(value)
          if (key === 'editCustPhone') setEditCustPhone(value)
          if (key === 'editCustAddr') setEditCustAddr(value)
          if (key === 'editCustBirth') setEditCustBirth(value)
          if (key === 'editCustFamily') setEditCustFamily(value)
          if (key === 'editCustRiders') setEditCustRiders(value)
          if (key === 'editCustAppt') setEditCustAppt(value)
        }}
        onAddCustomer={addCustomer}
        onIncrementTouch={async (id, count) => {
          await supabase.from('customers').update({ touch_count: count + 1, last_touch_at: new Date().toISOString() }).eq('id', id)
          fetchCustomers()
        }}
        onDecrementTouch={async (id, count) => {
          if (count > 0) {
            await supabase.from('customers').update({ touch_count: count - 1 }).eq('id', id)
            fetchCustomers()
          }
        }}
        onToggleMemo={(c) => {
          if (expandedMemoId === c.id) {
            setExpandedMemoId(null)
            setMemoValue('')
          } else {
            setExpandedMemoId(c.id)
            setMemoValue(c.memo || '')
          }
        }}
        onSaveMemo={async (id) => {
          const { error } = await supabase.from('customers').update({ memo: memoValue }).eq('id', id)
          if (!error) {
            toast.success('메모가 저장되었습니다.')
            setExpandedMemoId(null)
            fetchCustomers()
          }
        }}
        onStartEditing={(c) => {
          setEditingId(c.id)
          setEditCustName(c.name)
          setEditCustPhone(c.phone)
          setEditCustAddr(c.address)
          setEditCustBirth(c.birth_date ? c.birth_date.slice(0, 10) : '')
          setEditCustFamily(c.family_count.toString())
          setEditCustRiders(c.riders.join(', '))
          setEditCustAppt(c.appointment_at ? c.appointment_at.slice(0, 10) : '')
        }}
        onSaveEdit={async () => {
          if (!editingId) return
          const { error } = await supabase
            .from('customers')
            .update({
              name: editCustName,
              phone: editCustPhone,
              address: editCustAddr,
              birth_date: editCustBirth || null,
              family_count: parseInt(editCustFamily) || 1,
              riders: editCustRiders.split(',').map(r => r.trim()).filter(r => r !== ''),
              appointment_at: editCustAppt || null
            })
            .eq('id', editingId)
          if (!error) {
            toast.success('수정되었습니다.')
            setEditingId(null)
            fetchCustomers()
          }
        }}
        onDeleteCustomer={async (id) => {
          if (!confirm('삭제하시겠습니까?')) return
          const { error } = await supabase.from('customers').delete().eq('id', id)
          if (!error) {
            toast.success('삭제되었습니다.')
            fetchCustomers()
          }
        }}
        onShareCard={(name, phone) => {
          if (!planner) return
          const url = `https://stroy.kr/p/${planner.id}/card?source=copy`
          navigator.clipboard.writeText(url)
          toast.success('공유용 URL이 복사되었습니다.')
        }}
        getInsuranceAge={getInsuranceAge}
        safeFormat={safeFormat}
        onUpdate={fetchCustomers}
      />
    </div>
  )
}
