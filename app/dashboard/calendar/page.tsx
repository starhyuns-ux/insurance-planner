'use client'

import React, { useState, useEffect, useRef } from 'react'
import CalendarManager from '../components/CalendarManager'
import Overview from '../components/Overview'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { HOLIDAYS } from '@/lib/constants/holidays'
import { getInsuranceAge } from '@/lib/time'

export default function CalendarPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [todoDate, setTodoDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [todos, setTodos] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [visitStats, setVisitStats] = useState<any[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [newTodoContent, setNewTodoContent] = useState('')
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
  const [editTodoContent, setEditTodoContent] = useState('')
  const todoSectionRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    if (!planner) return

    // Fetch Todos
    const { data: todoData } = await supabase
      .from('todos')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: true })
    if (todoData) setTodos(todoData)

    // Fetch Customers
    const { data: custs } = await supabase
      .from('customers')
      .select('*')
      .eq('planner_id', planner.id)
    if (custs) setCustomers(custs)

    // Fetch Leads (Consultations)
    const { data: leadData } = await supabase
      .from('consultations')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: false })
    if (leadData) setLeads(leadData)

    // Fetch Visit Stats
    try {
      const res = await fetch('/api/site-visit/stats')
      if (res.ok) {
        const { data } = await res.json()
        setVisitStats(data || [])
        const total = (data || []).reduce((acc: number, cur: any) => acc + cur.visit_count, 0)
        setTotalVisits(total)
      }
    } catch (err) {
      console.error('Error fetching visit stats:', err)
    }
  }

  useEffect(() => {
    if (planner) fetchData()
  }, [planner])

  const addTodo = async () => {
    if (!newTodoContent.trim() || !planner) return
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        planner_id: planner.id,
        content: newTodoContent.trim(),
        target_date: todoDate,
        is_completed: false
      }])
      .select()
    if (!error && data) {
      setTodos([...todos, data[0]])
      setNewTodoContent('')
    }
  }

  const toggleTodo = async (id: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !isCompleted })
      .eq('id', id)
    if (!error) {
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !isCompleted } : t))
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    if (!error) {
      setTodos(todos.filter(t => t.id !== id))
    }
  }

  if (plannerLoading) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CalendarManager 
        currentMonth={currentMonth}
        todoDate={todoDate}
        todos={todos}
        customers={customers}
        newTodoContent={newTodoContent}
        editingTodoId={editingTodoId}
        editTodoContent={editTodoContent}
        holidays={HOLIDAYS}
        onUpdateState={(key, value) => {
          if (key === 'currentMonth') setCurrentMonth(value)
          if (key === 'todoDate') setTodoDate(value)
          if (key === 'newTodoContent') setNewTodoContent(value)
          if (key === 'editTodoContent') setEditTodoContent(value)
          if (key === 'editingTodoId') setEditingTodoId(value)
        }}
        onAddTodo={addTodo}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onStartEditingTodo={(todo) => {
          setEditingTodoId(todo.id)
          setEditTodoContent(todo.content)
        }}
        onSaveTodoEdit={async (id) => {
          const { error } = await supabase.from('todos').update({ content: editTodoContent }).eq('id', id)
          if (!error) {
            setTodos(todos.map(t => t.id === id ? { ...t, content: editTodoContent } : t))
            setEditingTodoId(null)
          }
        }}
        onCancelEditingTodo={() => setEditingTodoId(null)}
        todoSectionRef={todoSectionRef}
      />

      <Overview 
        leads={leads}
        customers={customers}
        planner={planner}
        totalVisits={totalVisits}
        visitStats={visitStats}
        getInsuranceAge={getInsuranceAge}
      />
    </div>
  )
}
