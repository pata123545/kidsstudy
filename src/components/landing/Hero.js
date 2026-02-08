'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, Star, ShieldCheck } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden text-right" dir="rtl">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Right Column: Content (Hebrew is RTL, so this is visually Right) */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-200">חדש: משחקי חשיבה וחשבון</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold leading-tight text-white"
                    >
                        הפכו את זמן המסך <br />
                        <span className="text-white bg-clip-text bg-gradient-to-l from-cave-glow to-primary">
                            ללמידה מובנית.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-lg leading-relaxed ml-auto"
                    >
                        מסע הלמידה המקיף לגילאי 3-10.
                        לימוד חשבון, קריאה ולוגיקה באמצעות סיפורים סוחפים.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px]">
                            התחל את המסע <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <Link href="#games-preview" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Play className="w-5 h-5 fill-current" /> צפה בהדגמה
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-6 pt-4 text-sm text-gray-500 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-400" /> בטוח לילדים וללא פרסומות
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" /> מומלץ על ידי אנשי חינוך
                        </div>
                    </motion.div>
                </div>

                {/* Left Column: Visual / Illustration (Hebrew is RTL, so this is visually Left) */}
                <div className="relative h-[500px] w-full hidden md:block">
                    {/* Abstract Cave Representation */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-tl from-secondary/50 to-primary/20 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center"
                    >
                        {/* Simplified UI Mockup inside the visual */}
                        <div className="w-3/4 h-3/4 bg-[#1a1a2e] rounded-2xl shadow-inner border border-white/5 relative overflow-hidden p-6 flex flex-col gap-4">
                            <div className="flex gap-2 flex-row-reverse">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                                <div className="h-24 bg-white/5 rounded-xl animate-pulse delay-100" />
                                <div className="h-24 bg-white/5 rounded-xl animate-pulse delay-200" />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground px-6 py-4 rounded-xl font-bold shadow-xl rotate-[12deg]">
                                עלית שלב!
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
