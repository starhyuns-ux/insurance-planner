import { format, differenceInCalendarDays } from 'date-fns'

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(date))
}

/**
 * Safe Date Formatter helper
 */
export const safeFormat = (dateStr: string | null | undefined, formatStr: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    return format(d, formatStr)
  } catch (e) {
    return '-'
  }
}

/**
 * Insurance Age Helper (Birthday + 6 months)
 */
export const getInsuranceAge = (birthDateStr: string | null | undefined) => {
  if (!birthDateStr) return null
  try {
    // birthDateStr is typically YYYY-MM-DD
    const parts = birthDateStr.split('-')
    if (parts.length !== 3) return null
    
    // Use manual date construction to avoid UTC/Local issues with Hyphenated strings
    const bYear = parseInt(parts[0])
    const bMonth = parseInt(parts[1]) - 1 // 0-indexed
    const bDay = parseInt(parts[2])
    
    const birthDate = new Date(bYear, bMonth, bDay)
    if (isNaN(birthDate.getTime())) return null
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Standard Insurance Birthday: (Birth Month + 6) % 12
    let targetMonth = (bMonth + 6) % 12
    let targetDay = bDay
    
    // Find the NEXT occurrence of this Month/Day
    let targetYear = today.getFullYear()
    let insDate = new Date(targetYear, targetMonth, targetDay)
    insDate.setHours(0, 0, 0, 0)

    // If it already passed this year, the next one is next year
    if (insDate < today) {
      insDate = new Date(targetYear + 1, targetMonth, targetDay)
      insDate.setHours(0, 0, 0, 0)
    }

    const dDayCount = differenceInCalendarDays(insDate, today)
    
    return dDayCount === 0 ? 'D-Day' : `D-${dDayCount}`
  } catch (e) {
    return null
  }
}
