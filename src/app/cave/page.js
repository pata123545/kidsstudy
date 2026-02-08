'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, BookOpen, Music, Palette, Ghost } from 'lucide-react';
import CaveBackground from '@/components/cave/CaveBackground';
import CaveGuide from '@/components/cave/CaveGuide';
import GamePortal from '@/components/cave/GamePortal';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CaveHub() {
    const [guideMessage, setGuideMessage] = useState("ברוכים הבאים למערת הלמידה! בחרו משחק כדי להתחיל.");
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function checkSub() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Fetch Profile
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('is_paid, trial_ends_at')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        const isPaid = profile.is_paid;
                        const isTrial = new Date(profile.trial_ends_at) > new Date();
                        if (isPaid || isTrial) {
                            setIsSubscriber(true);
                        }
                        // Check for Admin Override by email if needed, but RLS should handle it via data
                    }
                }
            } catch (err) {
                console.warn("Subscription check error:", err);
            } finally {
                setLoading(false);
            }
        }
        checkSub();
    }, []);

    const games = [
        {
            id: 'path-tracer',
            title: 'החיפושית בדרך הביתה',
            description: 'עזרו לחיפושית למצוא את הדרך!',
            href: '/cave/path-tracer',
            color: 'blue',
            icon: Ghost,
            locked: false, // Always free
            comingSoon: false
        },
        {
            id: 'bubble-pop',
            title: 'מסיבת הבועות',
            description: 'פוצצו את הבועות לפי הצבע הנכון.',
            href: '/cave/bubble-pop',
            color: 'pink',
            icon: Sparkles,
            locked: !isSubscriber,
            comingSoon: false // Now Available!
        },
        {
            id: 'shape-sorter',
            title: 'מסדר הצורות',
            description: 'התאימו את הצורות למקום הנכון.',
            href: '/cave/shape-sorter',
            color: 'green',
            icon: Palette,
            locked: !isSubscriber,
            comingSoon: false // Now Available!
        },
        {
            id: 'story-time',
            title: 'שעת סיפור',
            description: 'הקשיבו לסיפור קסום.',
            href: '/cave/story-time',
            color: 'yellow',
            icon: BookOpen,
            locked: !isSubscriber,
            comingSoon: false // Now Available!
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden font-rubik" dir="rtl">
            <CaveBackground />

            {/* Header / Top Bar */}
            <header className="relative z-10 p-6 flex justify-between items-center">
                <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-white text-sm font-bold transition-colors">
                    חזרה להורים
                </Link>
                <div className="text-white text-xl font-bold drop-shadow-lg flex items-center gap-2">
                    <Sparkles className="text-yellow-400 animate-pulse" />
                    היכל ההדים
                </div>
            </header>

            {/* Main Game Grid */}
            <main className="relative z-10 container mx-auto px-4 pt-10 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
                >
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setGuideMessage(game.description)}
                            onMouseLeave={() => setGuideMessage("ברוכים הבאים למערת הלמידה! בחרו משחק כדי להתחיל.")}
                        >
                            <GamePortal {...game} />
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* The Guide */}
            <CaveGuide message={guideMessage} />

        </div>
    );
}
