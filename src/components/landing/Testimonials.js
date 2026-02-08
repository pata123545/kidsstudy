'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
    const reviews = [
        {
            name: 'מיכל כהן',
            role: 'אמא של יונתן (בן 5)',
            content: 'מאז שיונתן התחיל עם "מערת הידע", הוא פשוט מחכה לזמן המסך שלו. זה לא סתם בהייה, הוא אשכרה לומד חשבון!',
            stars: 5,
        },
        {
            name: 'דני רוזן',
            role: 'אבא של נועה (בת 4)',
            content: 'הדוח השבועי להורים הוא גאוני. אני יודע בדיוק מה לשאול את נועה בארוחת הערב, והיא כל כך גאה לספר לי.',
            stars: 5,
        },
        {
            name: 'שרית לוי',
            role: 'גננת מוסמכת',
            content: 'בתור גננת, אני רואה המון אפליקציות. זו היחידה שבאמת בונה מיומנויות בצורה מובנית ולא רק זורקת גירויים.',
            stars: 5,
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[#1a1a2e]" dir="rtl">
            <div className="container mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block p-3 rounded-full bg-yellow-400/10 mb-4"
                    >
                        <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        מה ההורים <span className="text-transparent bg-clip-text bg-gradient-to-r from-cave-glow to-primary">אומרים?</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-[#16213e] p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-300"
                        >
                            <Quote className="absolute top-8 left-8 w-10 h-10 text-white/5 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cave-glow to-primary flex items-center justify-center text-white font-bold text-lg">
                                    {review.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{review.name}</h4>
                                    <span className="text-sm text-gray-500">{review.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
