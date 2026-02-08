'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Check, LineChart, Shield, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f8fafc]" dir="rtl">

            {/* Right Side: Login Form */}
            <div className="relative flex flex-col justify-center items-center p-8 bg-white/50">
                {/* Return to Home Button (Top Right) */}
                <div className="absolute top-8 right-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" /> חזרה לדף הבית
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">ברוכים השבים! 👋</h1>
                        <p className="text-gray-500">הכנסו כדי להמשיך את המסע.</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center font-bold">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">אימייל</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 text-black rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-bold text-gray-700">סיסמה</label>
                                    <a href="#" className="text-sm text-primary hover:underline">שכחתי סיסמה?</a>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 text-black rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cave-glow to-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'מתחבר...' : 'התחבר למערכת'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-500">
                        עדיין אין לכם חשבון? <Link href="/register" className="text-primary font-bold hover:underline">הירשמו בחינם</Link>
                    </div>
                </div>
            </div>

            {/* Left Side: Dashboard Info (Visual) */}
            <div className="hidden md:flex flex-col justify-center items-center p-12 bg-[#1a1a2e] relative overflow-hidden text-white">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(76,201,240,0.1),_transparent_70%)]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 blur-3xl rounded-full" />
                </div>

                <div className="relative z-10 max-w-lg space-y-12">
                    <div>
                        <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/10">
                            <LayoutDashboard className="w-8 h-8 text-cave-glow" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            כל הנתונים שאתם צריכים, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cave-glow to-primary">במקום אחד מסודר.</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            גישה מלאה ללוח הבקרה להורים, מעקב אחר התקדמות וניהול פרופילים.
                        </p>
                    </div>

                    <ul className="space-y-6">
                        {[
                            { icon: LineChart, title: 'מעקב התקדמות בזמן אמת', text: 'ראו בדיוק אילו מיומנויות הילד שיפר השבוע.' },
                            { icon: Shield, title: 'סביבה בטוחה ומבוקרת', text: 'שליטה מלאה על זמני מסך ותכנים.' },
                            { icon: Check, title: 'תובנות מותאמות אישית', text: 'קבלו המלצות לחיזוק נקודות חולשה.' }
                        ].map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="flex items-start gap-4"
                            >
                                <div className="mt-1 p-2 rounded-lg bg-primary/20 text-primary">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{item.title}</h4>
                                    <p className="text-gray-400 text-sm">{item.text}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Mini Visual of Dashboard */}
                    <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm -rotate-2 transform hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="w-20 h-2 rounded-full bg-white/10 ml-auto" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 w-full" />
                            <div className="flex gap-2">
                                <div className="h-10 rounded-lg bg-white/5 w-1/3" />
                                <div className="h-10 rounded-lg bg-white/5 w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
