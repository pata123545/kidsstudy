'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Menu } from 'lucide-react';

export default function Header() {
    const navLinks = [
        { name: 'בית', href: '/' },
        { name: 'תמיכה', href: '#footer' },
        { name: 'מחירים', href: '#pricing' },
        { name: 'אודות', href: '#about' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto bg-[#1a1a2e]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg px-6 py-3 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cave-glow to-primary flex items-center justify-center shadow-lg transform -rotate-3">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">
                        kids<span className="text-cave-glow">study</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-white font-medium transition-colors text-lg tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA Section */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:block text-white font-semibold hover:text-cave-glow transition-colors">
                        התחברות
                    </Link>
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(233,69,96,0.39)] transition-all"
                        >
                            התחל את המסע
                        </motion.button>
                    </Link>

                    {/* Mobile Menu Icon */}
                    <button className="md:hidden text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
