'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; // RTL arrow for "Back"
import CaveBackground from '@/components/cave/CaveBackground';
import GardenPathGame from '@/components/games/GardenPathGame';

export default function PathTracerPage() {
    return (
        <div className="min-h-screen bg-[#0d1424] text-white overflow-hidden relative font-rubik" dir="rtl">

            {/* Background - kept for atmosphere, though game has its own BG */}
            <CaveBackground />

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
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-sm">
                        החיפושית בגינה 🐞
                    </h1>
                    <p className="text-lg text-gray-300 max-w-lg mx-auto">
                        עזרו לחיפושית להגיע אל הפרח!
                    </p>
                </div>

                <div className="w-full max-w-4xl animate-scale-in">
                    <GardenPathGame
                        onComplete={(stats) => {
                            console.log("Level Complete!", stats);
                            // Can add DB update here later
                        }}
                    />
                </div>

            </main>
        </div>
    );
}
