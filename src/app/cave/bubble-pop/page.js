'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BubblePopGame from '@/components/games/BubblePopGame';

export default function BubblePopPage() {
    return (
        <div className="min-h-screen bg-sky-50 text-slate-800 overflow-hidden relative font-rubik" dir="rtl">

            {/* Simple Background - Daytime Party feel */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 via-blue-50 to-white w-full h-full -z-10" />

            {/* Navigation */}
            <div className="absolute top-6 right-6 z-50">
                <Link
                    href="/cave"
                    className="flex items-center gap-2 bg-white/40 hover:bg-white/60 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/40 group text-slate-700 font-bold shadow-sm"
                >
                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>חזרה למערה</span>
                </Link>
            </div>

            {/* Game Container */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">

                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm">
                        מסיבת הבועות 🫧
                    </h1>
                    <p className="text-lg text-slate-600 max-w-lg mx-auto font-medium">
                        פוצצו את הבועות בצבע הנכון!
                    </p>
                </div>

                <div className="w-full max-w-5xl animate-scale-in">
                    <BubblePopGame
                        onComplete={(stats) => {
                            console.log("Bubble Level Complete!", stats);
                        }}
                    />
                </div>

            </main>
        </div>
    );
}
