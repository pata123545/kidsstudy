import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy';

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        if (userId) {
            console.log(`Payment successful for user: ${userId}`);

            // Unlock the user's account
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_paid: true,
                    plan_type: session.metadata.planType || 'pro', // Update plan if needed
                    updated_at: new Date(),
                })
                .eq('id', userId);

            if (error) {
                console.error('Error updating profile:', error);
                return NextResponse.json({ error: 'Error updating user profile' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
