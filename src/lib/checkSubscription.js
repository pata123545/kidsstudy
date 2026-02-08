import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (for server-side bypass if key exists)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function checkSubscriptionStatus(userId, supabaseClient = null) {
    try {
        console.log(`Checking subscription for UserID: ${userId}`);

        if (!userId) return { allowed: false, reason: 'no_user' };

        // 1. Master Admin Bypass
        // Fetch user email to check for admin override
        // logic: we need the user object. If passed client is authenticated, we might have it in session.
        // But userId is passed. We can try to fetch user data if client allows, or just ignore if we can't.
        // ACTUALLY: The user asked "If user.email equals...". 
        // We usually don't have email in userId. 
        // We should fetch the user's email from Auth if possible, or Profile if we store it there.
        // Let's assume we fetch the user from Auth to check email.

        const client = supabaseClient || supabaseAdmin;

        // Try to get user details for Admin Check
        // If client is authenticated, getUser() works.
        const { data: { user }, error: userError } = await client.auth.getUser();

        if (user && user.id === userId) {
            console.log("Current User Email:", user.email);
            // REPLACE THIS WITH YOUR ACTUAL ADMIN EMAIL
            if (user.email === 'admin@example.com' || user.email === 'user@example.com') {
                console.log("Admin Override Activated");
                return { allowed: true, reason: 'Admin Override' };
            }
        }

        // 2. Database Fetch
        const { data: profile, error } = await client
            .from('profiles')
            .select('is_paid, trial_ends_at')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('RLS/Fetch Error:', error);
            return { allowed: false, reason: 'error', error };
        }

        console.log('Profile Data:', profile);

        if (!profile) {
            console.warn("Profile not found for user");
            return { allowed: false, reason: 'no_profile' };
        }

        // 3. Logic Checks
        // Check 1: Is Paid?
        if (profile.is_paid === true) {
            console.log("Access Granted: Paid User");
            return { allowed: true, reason: 'paid' };
        }

        // Check 2: Trial Active?
        const now = new Date();
        const trialEnd = new Date(profile.trial_ends_at);
        console.log(`Trial Check: Now (${now.toISOString()}) vs End (${trialEnd.toISOString()})`);

        if (now < trialEnd) {
            console.log("Access Granted: Trial Active");
            return { allowed: true, reason: 'trial', trialEndsAt: trialEnd };
        }

        // Else: Deny
        console.log("Access Denied: Trial Expired & Not Paid");
        return { allowed: false, reason: 'expired', trialEndsAt: trialEnd };

    } catch (err) {
        console.error('Subscription check failed internal error:', err);
        return { allowed: false, reason: 'error' };
    }
}
