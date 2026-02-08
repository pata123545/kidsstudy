'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingCrystal({
    color = '#4cc9f0', // Default cyan
    label = 'Start',
    onClick,
    delay = 0
}) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className="relative group cursor-pointer flex flex-col items-center justify-center p-4"
            onClick={onClick}
        >
            {/* Glow Effect */}
            <div
                className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300 blur-xl"
                style={{ backgroundColor: color }}
            />

            {/* Crystal Shape (SVG) */}
            <motion.svg
                width="100"
                height="120"
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 drop-shadow-lg"
            >
                <path
                    d="M50 0L95 30V90L50 120L5 90V30L50 0Z"
                    fill={color}
                    className="opacity-80"
                />
                <path
                    d="M50 0L95 30L50 60L5 30L50 0Z"
                    fill="white"
                    className="opacity-30"
                />
                <path
                    d="M50 60L95 30V90L50 120V60Z"
                    fill="black"
                    className="opacity-10"
                />
            </motion.svg>

            {/* Label */}
            <motion.span
                className="mt-4 text-white font-bold tracking-wider text-lg bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 group-hover:border-white/40 transition-colors"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
            >
                {label}
            </motion.span>
        </motion.div>
    );
}
