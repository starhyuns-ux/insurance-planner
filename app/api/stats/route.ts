import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
    try {
        // We are using the admin client to bypass RLS and get the exact count
        const { count, error } = await supabaseAdmin
            .from('consultations')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('Supabase count error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Add a base number to make the stats look more appealing initially, if desired
        // For example, 10543 base applications + actual count
        const baseCount = 10500
        const totalApplications = baseCount + (count || 0)

        return NextResponse.json({
            success: true,
            data: {
                totalApplications,
                savedAmount: totalApplications * 175000 // Example logic: average 175,000 KRW saved per application
            }
        })
    } catch (err: any) {
        console.error('Stats GET error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
