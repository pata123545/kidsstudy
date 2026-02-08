'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X } from 'lucide-react';

export default function CaveGuide({ message, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (message) setIsVisible(true);
    }, [message]);

    if (!isVisible && !message) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 pointer-events-none md:pointer-events-auto">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="relative flex items-end gap-4"
                    >
                        {/* The Guide Character (CSS/SVG Bear) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 md:w-32 md:h-32 relative filter drop-shadow-2xl"
                        >
                            {/* Body */}
                            <div className="absolute bottom-0 w-full h-24 bg-[#5d4037] rounded-full" />
                            <div className="absolute bottom-0 w-full h-20 bg-[#4e342e] rounded-b-full opacity-50" />

                            {/* Head */}
                            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 h-18 bg-[#5d4037] rounded-3xl" />

                            {/* Ears */}
                            <div className="absolute bottom-32 left-2 w-8 h-8 bg-[#5d4037] rounded-full" />
                            <div className="absolute bottom-32 right-2 w-8 h-8 bg-[#5d4037] rounded-full" />

                            {/* Eyes */}
                            <div className="absolute bottom-24 left-8 w-2 h-2 bg-black rounded-full animate-blink" />
                            <div className="absolute bottom-24 right-8 w-2 h-2 bg-black rounded-full animate-blink" />

                            {/* Snout */}
                            <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-[#3e2723] rounded-full" />
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full" />

                            {/* Glowing Staff */}
                            <div className="absolute bottom-4 -right-4 w-2 h-32 bg-[#8d6e63] rotate-12 origin-bottom">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full blur-md animate-pulse" />
                                <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-200 animate-spin-slow" />
                            </div>
                        </motion.div>

                        {/* Scale-in Message Bubble */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className="mb-12 relative bg-white text-gray-800 p-4 rounded-2xl rounded-br-none shadow-xl max-w-xs md:max-w-sm border-2 border-yellow-400"
                            >
                                <button
                                    onClick={() => { setIsVisible(false); if (onDismiss) onDismiss(); }}
                                    className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 pointer-events-auto"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <p className="font-bold text-lg mb-1 text-primary">שלום חבר! 👋</p>
                                <p className="text-sm md:text-base leading-relaxed">{message}</p>
                            </motion.div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
