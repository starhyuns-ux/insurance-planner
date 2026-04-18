'use server'

import { supabaseAdmin } from '@/lib/supabaseServer'

export async function submitClaimAction(data: {
  planner_id: string | null
  customer_name: string
  customer_phone: string
  address: string
  resident_number: string
  same_as_policyholder: boolean
  policyholder_name: string
  notification_person: string
  accident_type: string
  accident_detail: string
  description: string
  car_accident_detail?: string | null
  car_insurance_claim?: boolean | null
  car_insurance_company?: string | null
  car_agent_phone?: string | null
  car_plate_number?: string | null
  bank_name: string
  bank_account: string
  bank_holder: string
  payment_method: string
  insurance_company: string
  image_urls: string[]
  signature_type: string
  consent_third_party: boolean
  consent_at: string
  status: string
  transmission_status: string
}) {
  const { data: record, error } = await supabaseAdmin.from('claims').insert(data).select('id').single()
  
  if (error) {
    console.error('Error inserting claim:', error)
    throw new Error(error.message)
  }

  return { success: true, id: record?.id }
}
