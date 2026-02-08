'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, MousePointer2, Box, Shapes, TrafficCone, BrainCircuit, Play, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';

export default function GamesPreview() {
    const [showAll, setShowAll] = useState(false);
    const [activeGame, setActiveGame] = useState(null);

    const games = [
        {
            title: 'החיפושית בדרך הביתה',
            englishTitle: "The Beetle's Journey",
            skill: 'מוטוריקה עדינה',
            description: 'עזרו לחיפושית להגיע הביתה מבלי לצאת מהשביל.',
            metric: 'דיוק במסלול',
            color: 'from-green-400 to-emerald-600',
            icon: Bug,
            animation: (
                <motion.div
                    animate={{ x: [-20, 20, -20], y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center text-white/90"
                >
                    <Bug className="w-16 h-16" />
                </motion.div>
            )
        },
        {
            title: 'מסיבת הבועות',
            englishTitle: "Bubble Pop Party",
            skill: 'קשר עין-יד',
            description: 'פוצצו את הבועות לפני שהן בורחות! היזהרו מהמהירות.',
            metric: 'זמן תגובה',
            color: 'from-blue-400 to-cyan-500',
            icon: MousePointer2,
            animation: (
                <>
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [20, -40], opacity: [0, 1, 0] }}
                            transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                            className="absolute bg-white/30 rounded-full border border-white/50 backdrop-blur-sm"
                            style={{
                                width: 20 + i * 10,
                                height: 20 + i * 10,
                                left: 20 + i * 30 + '%',
                                top: '60%'
                            }}
                        />
                    ))}
                </>
            )
        },
        {
            title: 'סדר בחדר',
            englishTitle: "Tidy Up Time",
            skill: 'מיון וסיווג',
            description: 'החדר מבולגן! מיינו את הצעצועים לארגז ואת הבגדים לסל.',
            metric: 'דיוק במיון',
            color: 'from-purple-400 to-pink-500',
            icon: Box,
            animation: (
                <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center text-white/90"
                >
                    <Box className="w-14 h-14" />
                </motion.div>
            )
        },
        {
            title: 'הבנאי הקטן',
            englishTitle: "Shape Master",
            skill: 'תפיסה חזותית',
            description: 'השלימו את החלקים החסרים כדי לסיים את הפאזל.',
            metric: 'זיהוי תבניות',
            color: 'from-orange-400 to-red-500',
            icon: Shapes,
            animation: (
                <motion.div
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center text-white/80"
                >
                    <Shapes className="w-16 h-16" />
                </motion.div>
            )
        },
        {
            title: 'הרמזור הקסום',
            englishTitle: "Red Light, Green Light",
            skill: 'שליטה בדחפים',
            description: 'לחצו כדי לנסוע, עצרו מיד כשהרמזור אדום!',
            metric: 'הצלחה בעכבה',
            color: 'from-red-500 to-rose-700',
            icon: TrafficCone,
            animation: (
                <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-12 h-12 rounded-full bg-green-400 shadow-[0_0_20px_#4ade80] animate-pulse" />
                </motion.div>
            )
        }
    ];

    const visibleGames = showAll ? games : games.slice(0, 4);

    return (
        <section id="games-preview" className="py-20 bg-[#0d1424] overflow-hidden" dir="rtl">
            <div className="container mx-auto px-6 relative">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        משחקים <span className="text-transparent bg-clip-text bg-gradient-to-r from-cave-glow to-primary">מפתחי מיומנויות</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        כל משחק עוצב בקפידה כדי לשפר יכולות קוגניטיביות תוך כדי משחק מהנה וסוחף.
                    </p>
                </div>

                {/* Grid Container */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence>
                        {visibleGames.map((game, index) => (
                            <motion.div
                                layout
                                key={game.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden hover:border-white/20 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-2 cursor-pointer flex flex-col"
                            >
                                {/* Graphic Header with Animation */}
                                <div className={`h-40 bg-gradient-to-br ${game.color} relative overflow-hidden`}>
                                    {/* Background Icon Faded */}
                                    <game.icon className="absolute -bottom-6 -left-6 w-32 h-32 text-white opacity-10 rotate-12" />

                                    {/* Live Animation Layer */}
                                    {game.animation}

                                    {/* English Title Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="text-[10px] font-bold text-white/90 bg-black/20 px-2 py-1 rounded backdrop-blur-sm tracking-wider uppercase">
                                            {game.englishTitle}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex flex-col flex-grow space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cave-glow transition-colors">{game.title}</h3>
                                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 text-primary text-xs font-bold">
                                            <BrainCircuit className="w-3 h-3" /> {game.skill}
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                        {game.description}
                                    </p>

                                    <div className="pt-4 mt-auto border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">מדד התקדמות</div>
                                                <div className="text-xs font-mono text-gray-300">
                                                    {game.metric}
                                                </div>
                                            </div>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); setActiveGame(game); }}
                                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors cursor-pointer hover:scale-110"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Show More / Less Button */}
                {games.length > 4 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 hover:border-cave-glow/50 ring-1 ring-white/5"
                        >
                            {showAll ? (
                                <>
                                    <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> פחות משחקים
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" /> הצג עוד משחקים ({games.length - 4})
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Game Demo Modal */}
                <AnimatePresence>
                    {activeGame && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setActiveGame(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#1a1a2e] w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#16213e]">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{activeGame.title}</h3>
                                        <p className="text-gray-400 text-sm">{activeGame.skill}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveGame(null)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>

                                {/* Demo Area (Not real game, just visual) */}
                                <div className={`aspect-video bg-gradient-to-br ${activeGame.color} relative flex items-center justify-center overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20" />
                                    {/* Scaled Up Animation */}
                                    <div className="scale-[2]">
                                        {activeGame.animation}
                                    </div>

                                    <div className="absolute bottom-6 left-0 right-0 text-center">
                                        <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/10">
                                            תצוגה מקדימה • ההדגמה אינה אינטראקטיבית
                                        </span>
                                    </div>
                                </div>

                                {/* Footer / CTA */}
                                <div className="p-8 text-center space-y-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">רוצים לשחק במשחק המלא?</h4>
                                        <p className="text-gray-400 max-w-md mx-auto">
                                            הירשמו עכשיו וקבלו גישה לכל המשחקים, המעקב והדוחות להורים.
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <Link href="/register" className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            התחל לשחק עכשיו
                                        </Link>
                                        <button
                                            onClick={() => setActiveGame(null)}
                                            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                                        >
                                            סגור
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
