import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

// Save push subscription for a planner
export async function POST(request: Request) {
    try {
        const { planner_id, subscription } = await request.json()

        if (!planner_id || !subscription) {
            return NextResponse.json({ error: 'Missing planner_id or subscription' }, { status: 400 })
        }

        // Upsert the subscription (replace if same endpoint exists)
        const { error } = await supabaseAdmin
            .from('push_subscriptions')
            .upsert(
                {
                    planner_id,
                    endpoint: subscription.endpoint,
                    subscription: subscription,
                    created_at: new Date().toISOString()
                },
                { onConflict: 'endpoint' }
            )

        if (error) {
            console.error('Push subscription save error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Push subscribe error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// Delete push subscription
export async function DELETE(request: Request) {
    try {
        const { endpoint } = await request.json()

        if (!endpoint) {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })
        }

        await supabaseAdmin
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', endpoint)

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
