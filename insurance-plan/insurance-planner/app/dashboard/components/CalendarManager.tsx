'use client'

import React from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addDays,
  getDay 
} from 'date-fns'

const MONTH_PASTELS = [
  'bg-rose-50',     // 1월
  'bg-sky-50',      // 2월
  'bg-amber-50',    // 3월
  'bg-violet-50',   // 4월
  'bg-lime-50',     // 5월
  'bg-pink-50',     // 6월
  'bg-cyan-50',     // 7월
  'bg-orange-50',   // 8월
  'bg-emerald-50',  // 9월
  'bg-purple-50',   // 10월
  'bg-yellow-50',   // 11월
  'bg-blue-50',     // 12월
]

interface CalendarManagerProps {
  currentMonth: Date
  todoDate: string
  todos: any[]
  customers: any[]
  newTodoContent: string
  editingTodoId: string | null
  editTodoContent: string
  holidays: Record<string, string>
  onUpdateState: (key: string, value: any) => void
  onAddTodo: () => void
  onUpdateTodoStatus: (id: string, status: string) => void
  onUpdateTodoMemo: (id: string, memo: string) => void
  onDeleteTodo: (id: string) => void
  onStartEditingTodo: (todo: any) => void
  onSaveTodoEdit: (id: string) => void
  onCancelEditingTodo: () => void
  todoSectionRef: React.RefObject<HTMLDivElement | null>
}

export default function CalendarManager({
  currentMonth,
  todoDate,
  todos,
  customers,
  newTodoContent,
  editingTodoId,
  editTodoContent,
  holidays,
  onUpdateState,
  onAddTodo,
  onUpdateTodoStatus,
  onUpdateTodoMemo,
  onDeleteTodo,
  onStartEditingTodo,
  onSaveTodoEdit,
  onCancelEditingTodo,
  todoSectionRef
}: CalendarManagerProps) {
  
  const getStripeMonth = (day: Date, monthStart: Date): number => {
    for (let offset = -1; offset <= 1; offset++) {
      const m = addMonths(monthStart, offset)
      const mStart = startOfMonth(m)
      const week2Start = startOfWeek(addDays(mStart, 7))
      const nextWeek2Start = startOfWeek(addDays(startOfMonth(addMonths(m, 1)), 7))
      if (day >= week2Start && day < nextWeek2Start) return m.getMonth()
    }
    return day.getMonth()
  }

  return (
    <div className="space-y-8">
      {/* Calendar View — 2 months */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
             </div>
             <h3 className="text-2xl font-black text-gray-900 tracking-tight">영업 일정 관리</h3>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
            <button onClick={() => onUpdateState('currentMonth', subMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-black text-sm md:text-base min-w-[200px] text-center text-gray-800 uppercase tracking-widest">
              {format(currentMonth, 'yyyy / MM')} – {format(addMonths(currentMonth, 1), 'MM')}
            </span>
            <button onClick={() => onUpdateState('currentMonth', addMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {[currentMonth, addMonths(currentMonth, 1)].map((monthRef, monthIdx) => {
            const monthStart = startOfMonth(monthRef)
            const monthEnd = endOfMonth(monthStart)
            const startDate = startOfWeek(monthStart)
            const endDate = endOfWeek(monthEnd)
            const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

            return (
              <div key={monthIdx} className="space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] text-center pb-2 border-b border-gray-50">{format(monthStart, 'MMMM yyyy')}</p>
                <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={day} className={`px-1 py-3 bg-gray-50/50 border-r border-b border-gray-100 text-center text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-rose-500' : 'text-gray-400'}`}>
                      {day}
                    </div>
                  ))}
                    {calendarDays.map((day, i) => {
                      const dayCustomers = customers.filter(c => c.appointment_at && isSameDay(new Date(c.appointment_at), day))
                      const dayTodos = todos.filter(t => isSameDay(new Date(t.target_date), day))
                      
                      const dayBirthdays = customers.filter(c => {
                        if (!c.birth_date) return false
                        const b = new Date(c.birth_date)
                        return b.getMonth() === day.getMonth() && b.getDate() === day.getDate()
                      })

                      const dayInsAgeUps = customers.filter(c => {
                        if (!c.birth_date) return false
                        const b = new Date(c.birth_date)
                        const upDate = addMonths(b, 6)
                        return upDate.getMonth() === day.getMonth() && upDate.getDate() === day.getDate()
                      })

                      const isOutside = !isSameMonth(day, monthStart)
                      const isSelected = isSameDay(day, new Date(todoDate))
                      const isToday = isSameDay(day, new Date())
                      const stripeColor = MONTH_PASTELS[getStripeMonth(day, monthStart)]
                      const holidayName = holidays[format(day, 'yyyy-MM-dd')]
                      const isRedDay = !!holidayName || getDay(day) === 0

                      return (
                      <div
                        key={i}
                        className={`min-h-[75px] md:min-h-[90px] p-1.5 border-r border-b border-gray-100 transition-all cursor-pointer relative group/day ${
                          isOutside ? 'opacity-30' :
                          isSelected ? 'ring-2 ring-inset ring-primary-500/20 z-10 bg-white' : ''
                        } ${isOutside ? 'bg-gray-50/30' : stripeColor} hover:bg-white/80`}
                        onClick={() => {
                          onUpdateState('todoDate', format(day, 'yyyy-MM-dd'))
                          todoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-black flex items-center justify-center w-6 h-6 rounded-xl transition-all shadow-sm ${
                            isToday ? 'bg-primary-600 text-white animate-bounce' :
                            isSelected ? 'bg-primary-100 text-primary-700' :
                            isRedDay ? 'text-rose-500 bg-rose-50/50' : 'text-gray-500 bg-white/50'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          {holidayName && (
                            <span className="text-[8px] font-black text-rose-500 mt-1 break-all text-center leading-none bg-rose-50 px-1 rounded uppercase tracking-tighter">
                              {holidayName}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-col gap-1 max-h-[50px] overflow-hidden">
                          {dayCustomers.map(cust => (
                            <div key={cust.id} className="bg-white/90 text-primary-700 px-1.5 py-0.5 rounded-lg text-[9px] font-black truncate border border-primary-100 shadow-sm" title={cust.name}>
                              👤 <span className="hidden md:inline">{cust.name} (상담)</span>
                            </div>
                          ))}
                          {dayBirthdays.map(cust => (
                            <div key={`bday-${cust.id}`} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-lg text-[9px] font-black truncate border border-indigo-100 shadow-sm" title={`${cust.name} 생일`}>
                              🎂 <span className="hidden md:inline">{cust.name} (생일)</span>
                            </div>
                          ))}
                          {dayInsAgeUps.map(cust => (
                            <div key={`ins-${cust.id}`} className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-lg text-[9px] font-black truncate border border-rose-100 shadow-sm" title={`${cust.name} 상령일`}>
                              📈 <span className="hidden md:inline">{cust.name} (상령일)</span>
                            </div>
                          ))}
                          {dayTodos.map(todo => {
                            const isDone = todo.status && todo.status !== 'none';
                            const statusIcon = todo.status === 'circle' ? '🟢' : todo.status === 'triangle' ? '🟡' : todo.status === 'cross' ? '🔴' : '📌';
                            return (
                              <div key={todo.id} className={`${isDone ? 'bg-gray-100/50 text-gray-400 line-through' : 'bg-white text-gray-600 border-gray-100'} px-1.5 py-0.5 rounded-lg text-[9px] font-black truncate border shadow-sm`} title={todo.content}>
                                {statusIcon} <span className="hidden md:inline">{todo.content}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Todo List Content */}
      <div ref={todoSectionRef} className="bg-white rounded-[2rem] shadow-xl p-4 md:p-10 border border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <PlusIcon className="w-5 h-5" />
              </div>
              PLANNERS TO-DO LIST
            </h3>
            <span className="text-xs font-black text-white bg-primary-600 px-4 py-1.5 rounded-full shadow-lg shadow-primary-100 uppercase tracking-widest">
              Selected: {todoDate ? format(new Date(todoDate), 'MM.dd') : ''}
            </span>
          </div>

          {/* Add Todo Input */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Set Date</label>
              <input 
                type="date" 
                value={todoDate}
                onChange={(e) => onUpdateState('todoDate', e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">New Task</label>
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="무엇을 도와드릴까요? 오늘의 할 일을 입력하세요..."
                  value={newTodoContent}
                  onChange={(e) => onUpdateState('newTodoContent', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      onAddTodo()
                    }
                  }}
                  className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-inner"
                />
                <button 
                  onClick={onAddTodo}
                  className="w-full md:w-auto px-10 py-5 md:py-4 bg-primary-600 text-white rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all font-black text-sm whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  ADD TASK
                </button>
              </div>
            </div>
          </div>

          {/* Combined Events and Todos */}
          {(() => {
            const selectedDateObj = new Date(todoDate)
            const selectedTodos = todos.filter(t => isSameDay(new Date(t.target_date), selectedDateObj))
            const selectedBirthdays = customers.filter(c => {
              if (!c.birth_date) return false
              const b = new Date(c.birth_date)
              return b.getMonth() === selectedDateObj.getMonth() && b.getDate() === selectedDateObj.getDate()
            })
            const selectedInsUps = customers.filter(c => {
              if (!c.birth_date) return false
              const b = new Date(c.birth_date)
              const upDate = addMonths(b, 6)
              return upDate.getMonth() === selectedDateObj.getMonth() && upDate.getDate() === selectedDateObj.getDate()
            })

            const hasAnyItems = selectedTodos.length > 0 || selectedBirthdays.length > 0 || selectedInsUps.length > 0

            return (
              <div className="space-y-6">
                {!hasAnyItems ? (
                  <div className="py-20 text-center border-4 border-dashed border-gray-50 rounded-[3rem] bg-gray-50/30">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <span className="text-2xl">✨</span>
                    </div>
                    <p className="text-gray-300 font-black text-lg italic tracking-tight">등록된 할 일이 없습니다. 즐거운 하루 되세요!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Auto-generated Birthday notifications */}
                    {selectedBirthdays.map(c => (
                      <div key={`bday-todo-${c.id}`} className="flex items-center gap-4 p-5 rounded-[2rem] border bg-indigo-50/50 border-indigo-100 shadow-sm transition-all hover:shadow-lg">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                          🎂
                        </div>
                        <span className="flex-1 text-base font-black text-indigo-900 tracking-tight">
                          {c.name}님의 <span className="underline underline-offset-4 decoration-indigo-300">생일</span>입니다 🎉
                        </span>
                      </div>
                    ))}

                    {/* Auto-generated Insurance Age Increase notifications */}
                    {selectedInsUps.map(c => (
                      <div key={`ins-todo-${c.id}`} className="flex items-center gap-4 p-5 rounded-[2rem] border bg-rose-50/50 border-rose-100 shadow-sm transition-all hover:shadow-lg">
                        <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-100 font-black text-xs">
                          📈
                        </div>
                        <span className="flex-1 text-base font-black text-rose-900 tracking-tight">
                          {c.name}님의 <span className="underline underline-offset-4 decoration-rose-300">상령일</span>(보험료 인상) ⚠️
                        </span>
                      </div>
                    ))}

                    {/* Manual Todos */}
                    {selectedTodos.map(todo => (
                        <div 
                          key={todo.id} 
                          className={`flex flex-col gap-3 p-4 md:p-5 rounded-[2rem] border transition-all group ${
                            todo.status !== 'none' ? 'bg-gray-50 border-gray-100 opacity-80' : 'bg-white border-gray-100 hover:shadow-2xl hover:border-primary-100 hover:-translate-y-1'
                          } shadow-sm`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 shrink-0">
                              <button 
                                onClick={() => onUpdateTodoStatus(todo.id, todo.status === 'circle' ? 'none' : 'circle')}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all font-black text-sm ${
                                  todo.status === 'circle' ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-500'
                                }`}
                              >
                                O
                              </button>
                              <button 
                                onClick={() => onUpdateTodoStatus(todo.id, todo.status === 'triangle' ? 'none' : 'triangle')}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all font-black text-sm ${
                                  todo.status === 'triangle' ? 'bg-amber-500 text-white shadow-amber-200 shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-amber-100 hover:text-amber-500'
                                }`}
                              >
                                △
                              </button>
                              <button 
                                onClick={() => onUpdateTodoStatus(todo.id, todo.status === 'cross' ? 'none' : 'cross')}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all font-black text-sm ${
                                  todo.status === 'cross' ? 'bg-rose-500 text-white shadow-rose-200 shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-rose-100 hover:text-rose-500'
                                }`}
                              >
                                X
                              </button>
                            </div>
                            
                            {editingTodoId === todo.id ? (
                              <div className="flex-1 flex gap-2">
                                <input 
                                  type="text"
                                  value={editTodoContent}
                                  onChange={(e) => onUpdateState('editTodoContent', e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                      onSaveTodoEdit(todo.id)
                                    }
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-black focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-inner"
                                  autoFocus
                                />
                                <button onClick={() => onSaveTodoEdit(todo.id)} className="text-primary-600 font-black text-xs px-2">저장</button>
                              </div>
                            ) : (
                              <>
                                <span className={`flex-1 text-base font-black tracking-tight transition-all ${
                                  todo.status !== 'none' ? 'text-gray-400' : 'text-gray-700'
                                } ${todo.status === 'circle' || todo.status === 'cross' ? 'line-through decoration-2 decoration-gray-300' : ''}`}>
                                  {todo.content}
                               </span>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                  <button onClick={() => onStartEditingTodo(todo)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-xl transition-all"><PencilIcon className="w-4 h-4" /></button>
                                  <button onClick={() => onDeleteTodo(todo.id)} className="p-2.5 bg-gray-50 hover:bg-rose-50 text-rose-300 hover:text-rose-500 rounded-xl transition-all"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="pl-[120px] pr-2 md:pr-12 mt-1">
                            <input 
                              type="text"
                              placeholder="작은 메모를 남겨보세요..."
                              defaultValue={todo.memo || ''}
                              onBlur={(e) => {
                                if (e.target.value !== (todo.memo || '')) {
                                  onUpdateTodoMemo(todo.id, e.target.value)
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                  e.currentTarget.blur()
                                }
                              }}
                              className="w-full text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-gray-300"
                            />
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
