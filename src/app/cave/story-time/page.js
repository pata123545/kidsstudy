'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StoryTimePlayer from '@/components/games/StoryTime';

export default function StoryTimePage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-rubik" dir="rtl">

            {/* Background - Warm Evening/Library feel */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900 via-slate-900 to-black w-full h-full -z-10" />

            {/* Navigation */}
            <div className="absolute top-6 right-6 z-50">
                <Link
                    href="/cave"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10 group"
                >
                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>חזרה למערה</span>
                </Link>
            </div>

            {/* Game Container */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">

                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 drop-shadow-sm">
                        שעת סיפור 📚
                    </h1>
                    <p className="text-lg text-amber-100/80 max-w-lg mx-auto">
                        הקשיבו לסיפורים קסומים במערה.
                    </p>
                </div>

                <div className="w-full max-w-5xl animate-scale-in">
                    <StoryTimePlayer />
                </div>

            </main>
        </div>
    );
}
