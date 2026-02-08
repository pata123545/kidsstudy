import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const planType = requestUrl.searchParams.get('plan') || 'pro'; // default to pro

    // Get User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/login', requestUrl.origin));
    }

    // Define Prices (Replace with your actual Stripe Price IDs in env or hardcode meant for test mode)
    // For this Blueprint, we'll create ad-hoc sessions or use Price IDs if provided.
    // Assuming 2900 cents (29 ILS) and 4900 cents (49 ILS).

    let priceAmount = 4900;
    let productName = 'Pro Plan (KidsStudy)';

    if (planType === 'basic') {
        priceAmount = 2900;
        productName = 'Basic Plan (KidsStudy)';
    }

    try {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'ils',
                        product_data: {
                            name: productName,
                            description: planType === 'pro' ? '7 Days Free Trial included previously' : '3 Days Free Trial included previously',
                        },
                        unit_amount: priceAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // One-time payment for simplicity in this blueprint, or 'subscription' if recurring
            success_url: `${requestUrl.origin}/dashboard?payment=success`,
            cancel_url: `${requestUrl.origin}/dashboard?payment=cancelled`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
                planType: planType,
            },
        });

        return NextResponse.redirect(stripeSession.url);
    } catch (err) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
    }
}
