'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Check, User, Mail, Lock, Baby, ArrowRight } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const supabase = createClient();
    const [step, setStep] = useState(1);

    // Form State
    const [parentName, setParentName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [childName, setChildName] = useState('');
    const [selectedAge, setSelectedAge] = useState(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Age Groups for Logic
    const ageGroups = [
        { ages: [3, 4, 5], label: 'מסלול גן (Preschool)', color: 'bg-green-100 text-green-700 border-green-200' },
        { ages: [6, 7, 8], label: 'הכנה לכיתה א׳ (Elementary)', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { ages: [9, 10], label: 'לוגיקה מתקדמת (Advanced)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    ];

    const handleRegister = async () => {
        if (!email || !password || !parentName) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: parentName,
                        child_name: childName,
                        child_age: selectedAge,
                        plan: 'pro', // Default to Pro Trial for new signups
                    },
                },
            });

            if (error) throw error;

            // Success! Redirect to Dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-right" dir="rtl">

            {/* Right Side: Wizard Form (First in DOM = Right Side in RTL) */}
            <div className="flex flex-col justify-center items-center p-8 bg-white relative order-1">
                {/* Return to Home Button (Top Right) */}
                <div className="absolute top-8 right-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-medium">
                        <ArrowRight className="w-5 h-5" /> חזרה לדף הבית
                    </Link>
                </div>

                <div className="w-full max-w-md mt-12 md:mt-0">

                    {/* Step Indicators */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-100'}`} />
                        <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`} />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ממשו את הפוטנציאל 🚀</h1>
                                    <p className="text-gray-500">צרו חשבון הורים חינם למעקב אחר התקדמות.</p>
                                </div>

                                {/* Social Login (Visual only for now) */}
                                <button className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-bold text-gray-700">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                    המשך עם Google
                                </button>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">או הרשמה במייל</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-black">שם מלא</label>
                                        <div className="relative">
                                            <User className="absolute top-3.5 right-3 w-5 h-5 text-black" />
                                            <input
                                                type="text"
                                                value={parentName}
                                                onChange={(e) => setParentName(e.target.value)}
                                                placeholder="לדוגמה: ישראל ישראלי"
                                                className="w-full text-black pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-black">אימייל</label>
                                        <div className="relative">
                                            <Mail className="absolute top-3.5 right-3 w-5 h-5 text-black" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="parent@example.com"
                                                className="w-full text-black pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-black">סיסמה</label>
                                        <div className="relative">
                                            <Lock className="absolute top-3.5 right-3 w-5 h-5 text-black" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="מינימום 8 תווים"
                                                className="w-full text-black pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all mt-4">
                                        המשך לשלב הבא
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4">ללא צורך בכרטיס אשראי להרשמה.</p>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1 text-sm">
                                        <ArrowRight className="w-4 h-4" /> חזרה
                                    </button>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">מי לומד היום? 🎓</h1>
                                    <p className="text-gray-500">נתאים את רמת הקושי בהתאם לגיל הילד.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">שם הילד/ה (או כינוי)</label>
                                        <div className="relative">
                                            <Baby className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={childName}
                                                onChange={(e) => setChildName(e.target.value)}
                                                placeholder="לדוגמה: תומר"
                                                className="w-full pr-10 text-black pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">בן/בת כמה הוא/היא?</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                                                <button
                                                    key={age}
                                                    onClick={() => setSelectedAge(age)}
                                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${selectedAge === age
                                                        ? 'border-primary bg-primary/10 text-primary scale-105'
                                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {age}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Dynamic Track Label */}
                                        {selectedAge && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mt-4 p-3 rounded-lg border text-sm text-center font-bold flex items-center justify-center gap-2 ${ageGroups.find(g => g.ages.includes(selectedAge))?.color || 'bg-gray-50'
                                                    }`}
                                            >
                                                <Check className="w-4 h-4" />
                                                {ageGroups.find(g => g.ages.includes(selectedAge))?.label}
                                            </motion.div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleRegister}
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-cave-glow to-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {loading ? 'יוצר חשבון...' : 'בנה תוכנית אישית ✨'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Left Side: Marketing (The Vibe) - Second in DOM = Left Side in RTL */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-[#1a1a2e] relative overflow-hidden text-white order-2">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/90 to-[#16213e]/80 z-10" />
                    {/* Placeholder for "High Quality Photo" */}
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-50 block" />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-end pb-20">
                    <div className="text-4xl font-bold mb-8 text-white/10">❝</div>
                    <h3 className="text-2xl font-medium leading-relaxed mb-6">
                        "סוף סוף אני יודעת בדיוק במה הילד שלי מתקשה. הדוחות השבועיים הם פשוט גיים-צ'יינג'ר."
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                        </div>
                        <div className="text-sm font-bold text-gray-300">— שרה ט., אמא לבן 5</div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500 border-t border-white/10 pt-6 flex justify-between">
                    <span>© 2026 KidsStudy.</span>
                    <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> סביבה בטוחה וללא פרסומות</span>
                </div>
            </div>

        </div>
    );
}
