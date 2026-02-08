'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield, Crown } from 'lucide-react';

export default function Pricing() {
    const plans = [
        {
            name: 'חוקר מתחיל', // Novice Explorer
            englishName: 'Novice Explorer',
            price: '₪29',
            period: '/חודש',
            description: 'מצוין לילד יחיד שרק מתחיל את המסע.',
            badge: 'נסו 3 ימים חינם!', // Pay as you go
            features: [
                { text: 'פרופיל ילד אחד בלבד', icon: Shield, included: true },
                { text: 'מיומנויות ליבה (מוטוריקה וחשבון)', icon: Zap, included: true },
                { text: 'טיימר בסיסי (זמן שימוש בלבד)', icon: check => <Check className="w-4 h-4" />, included: true },
                { text: 'ללא קורס הכנה לכיתה א׳', icon: X, included: false },
                { text: 'ללא אנגלית ומדעים', icon: X, included: false },
                { text: 'ללא תעודות להדפסה', icon: X, included: false },
            ],
            cta: 'התחל תוכנית בסיסית',
            popular: false,
            color: 'from-blue-400 to-blue-600',
            glow: 'shadow-blue-500/20',
            buttonStyle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
        },
        {
            name: 'רב-מג', // Archmage
            englishName: 'Archmage',
            price: '₪49',
            period: '/חודש',
            description: 'האקדמיה המלאה למשפחה.',
            badge: 'נסו 7 ימים חינם!', // Try 7 Days Free!
            features: [
                { text: 'תוכנית משפחתית (עד 5 ילדים)', icon: Crown, included: true },
                { text: 'כל העולמות פתוחים (אנגלית, לוגיקה, מדעים)', icon: Sparkles, included: true },
                { text: 'קורס הכנה לכיתה א׳ (מסלול מלא)', icon: Check, included: true },
                { text: 'אנליטיקה עמוקה (חוזקות/חולשות)', icon: Check, included: true },
                { text: 'תעודות ופרסים להדפסה', icon: Check, included: true },
                { text: 'תמיכה בעדיפות עליונה', icon: Check, included: true },
            ],
            cta: 'התחל 7 ימי ניסיון חינם',
            popular: true,
            color: 'from-primary to-rose-600',
            glow: 'shadow-primary/40',
            buttonStyle: 'bg-gradient-to-r from-cave-glow to-primary text-white shadow-lg hover:shadow-cave-glow/50'
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[#16213e]" dir="rtl">
            <div className="container mx-auto px-6 relative z-10">

                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        בחרו את <span className="text-transparent bg-clip-text bg-gradient-to-r from-cave-glow to-primary">המסלול שלכם</span>
                    </motion.h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        השקעה קטנה בעתיד גדול. ללא התחייבות, ניתן לבטל בכל עת.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative bg-[#1a1a2e] rounded-3xl border ${plan.popular ? 'border-cave-glow' : 'border-white/10'} p-8 flex flex-col ${plan.glow} shadow-2xl overflow-hidden`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cave-glow to-primary text-white text-center text-sm font-bold py-1">
                                    הכי פופולרי ⭐
                                </div>
                            )}

                            <div className="mb-8 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{plan.englishName}</span>
                                    </div>
                                    {plan.badge && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-300'}`}>
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500 line-through decoration-gray-600'}`}>
                                        <div className={`mt-0.5 ${feature.included ? (plan.popular ? 'text-cave-glow' : 'text-blue-400') : 'text-gray-600'}`}>
                                            {typeof feature.icon === 'function' ? feature.icon() : <feature.icon className="w-4 h-4" />}
                                        </div>
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] ${plan.buttonStyle}`}>
                                {plan.cta}
                            </button>

                            {/* Decorative Gradient Blob */}
                            <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${plan.color} opacity-10 blur-3xl rounded-full pointer-events-none`} />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
