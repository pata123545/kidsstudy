'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Play, Clock } from 'lucide-react';
import Link from 'next/link';

export default function GamePortal({ title, description, href, color, locked, comingSoon, icon: Icon }) {

    // Base styles
    const isLocked = locked || comingSoon;
    const glowColor = isLocked ? 'shadow-gray-500/20' : `shadow-${color}-500/40`;
    const borderColor = isLocked ? 'border-gray-700' : `border-${color}-500/50`;
    const bgColor = isLocked ? 'bg-gray-800/50' : `bg-${color}-900/30`;

    const PortalContent = (
        <motion.div
            whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            className={`
                relative group cursor-pointer 
                rounded-full w-full aspect-square 
                flex flex-col items-center justify-center text-center p-6
                border-4 ${borderColor} ${bgColor} 
                backdrop-blur-sm shadow-2xl ${glowColor}
                transition-all duration-300
            `}
        >
            {/* Portal Glow Effect */}
            {!isLocked && (
                <div className={`
                    absolute inset-0 rounded-full 
                    bg-gradient-to-br from-${color}-500/20 to-transparent 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500 blur-xl
                `} />
            )}

            {/* Icon / Centerpiece */}
            <div className={`
                relative z-10 w-16 h-16 md:w-20 md:h-20 
                rounded-2xl flex items-center justify-center 
                ${isLocked ? 'bg-gray-700 text-gray-500' : `bg-gradient-to-br from-${color}-400 to-${color}-600 text-white shadow-lg`}
                mb-4 transform group-hover:rotate-6 transition-transform
            `}>
                {comingSoon ? <Clock className="w-8 h-8" /> : (locked ? <Lock className="w-8 h-8" /> : (Icon ? <Icon className="w-10 h-10" /> : <Star className="w-10 h-10" />))}
            </div>

            {/* Title */}
            <h3 className={`relative z-10 text-lg md:text-xl font-bold ${isLocked ? 'text-gray-500' : 'text-white group-hover:text-' + color + '-300'} transition-colors`}>
                {title}
            </h3>

            {/* Badges */}
            {locked && !comingSoon && (
                <div className="absolute top-4 right-4 bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded-md border border-gray-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>מנוי בלבד</span>
                </div>
            )}
            {comingSoon && (
                <div className="absolute top-4 bg-yellow-900/80 text-yellow-500 text-xs px-2 py-1 rounded-md border border-yellow-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>בקרוב</span>
                </div>
            )}
        </motion.div>
    );

    if (isLocked) {
        return (
            <div className="relative opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                {PortalContent}
            </div>
        );
    }

    return (
        <Link href={href}>
            {PortalContent}
        </Link>
    );
}
