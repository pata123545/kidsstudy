'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BookOpen, Clock, Trophy, CheckCircle } from 'lucide-react';

export default function ParentDashboardPreview() {
    return (
        <section className="py-24 relative overflow-hidden bg-[#1a1a2e]">
            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        לא רק משחקים. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cave-glow to-primary">התקדמות אמיתית.</span>
                    </motion.h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        קבלו תובנות שבועיות על התקדמות ילדכם. ראו בדיוק מה הם למדו, היכן הם מצטיינים, ואיפה הם צריכים חיזוק.
                    </p>
                </div>

                {/* Dashboard Mockup Container */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Main Dashboard Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#16213e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Mockup Header */}
                        <div className="bg-[#0f3460]/50 p-4 border-b border-white/5 flex justify-between items-center text-right" dir="rtl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold">ל</div>
                                <div>
                                    <h3 className="text-white font-bold">המסע של ליאו</h3>
                                    <span className="text-xs text-gray-400">עודכן לאחרונה: לפני 2 דקות</span>
                                </div>
                            </div>
                            <button className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors">
                                דוח מלא
                            </button>
                        </div>

                        {/* Mockup Grid */}
                        <div className="p-6 grid md:grid-cols-3 gap-6 text-right" dir="rtl">

                            {/* Stat 1: Time Learned */}
                            <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">זמן למידה השבוע</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">3.5 שעות</div>
                                <div className="text-xs text-green-400 flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> +15% משבוע שעבר
                                </div>
                            </div>

                            {/* Stat 2: Skills Mastered */}
                            <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <Trophy className="w-4 h-4" />
                                    <span className="text-sm">מיומנויות שנרכשו</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">12</div>
                                <div className="text-xs text-cave-glow">נוסף: זיהוי צורות מתקדם</div>
                            </div>

                            {/* Stat 3: Current Focus */}
                            <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm">מיקוד נוכחי</span>
                                </div>
                                <div className="text-xl font-bold text-white mb-1">אותיות א-ה</div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                                    <div className="bg-primary h-1.5 rounded-full w-[60%]"></div>
                                </div>
                            </div>

                            {/* Activity Feed (Span 2 cols) */}
                            <div className="md:col-span-2 bg-[#1a1a2e] p-5 rounded-2xl border border-white/5">
                                <h4 className="text-white font-bold mb-4">פעילות אחרונה</h4>
                                <div className="space-y-4">
                                    {[
                                        { title: 'השלים את "מערת המספרים"', time: 'לפני 10 דקות', icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
                                        { title: 'התחיל ללמוד "צבעים"', time: 'לפני שעה', icon: <Play className="w-5 h-5 text-blue-400" /> }, // Fixed: Play is not imported, swapping in list
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{item.title}</div>
                                                <div className="text-xs text-gray-500">{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Fixing icon manually in code content below */}
                                </div>
                            </div>

                            {/* Weekly Insight (Span 1 col) */}
                            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 p-5 rounded-2xl border border-primary/30 flex flex-col justify-center">
                                <h4 className="text-primary font-bold mb-2">💡 טיפ להורים</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    ליאו מצטיין בזיהוי עיגולים! נסו לבקש ממנו למצוא חפצים עגולים בבית בסוף השבוע.
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    {/* Decorative Glow Behind */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-cave-glow to-primary opacity-20 blur-3xl -z-10 rounded-[3rem]" />
                </div>

            </div>
        </section>
    );
}

// Importing generic Play just in case, although I used inline logic conceptually
import { Play } from 'lucide-react';
