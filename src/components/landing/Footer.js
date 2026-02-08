'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f0f1a] pt-20 pb-10 border-t border-white/5" dir="rtl">
            <div className="container mx-auto px-6">

                <div className="grid md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cave-glow to-primary flex items-center justify-center shadow-lg transform -rotate-3">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-wide">
                                kids<span className="text-cave-glow">study</span>
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            פלטפורמת הלמידה המובילה לגיל הרך. הופכים את זמן המסך לחוויה לימודית, מעשירה וקסומה. הצטרפו לאלפי הורים מרוצים.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">ניווט מהיר</h4>
                        <ul className="space-y-4">
                            {['עמוד הבית', 'איך זה עובד', 'מחירים', 'אודות', 'בלוג הורים'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-cave-glow transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">תמיכה</h4>
                        <ul className="space-y-4">
                            {['מרכז עזרה', 'צור קשר', 'תנאי שימוש', 'מדיניות פרטיות', 'הצהרת נגישות'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-cave-glow transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center md:text-right">
                    <p>© 2026 KidsStudy. כל הזכויות שמורות.</p>
                    <p>נבנה באהבה ❤️ עבור דור העתיד</p>
                </div>

            </div>
        </footer>
    );
}
