'use client';

import React, { cloneElement } from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon, color = 'blue', trend }) {

    // Fallback if no icon provided
    if (!icon) return null;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}-400`}>
                {cloneElement(icon, { className: "w-24 h-24 transform translate-x-8 -translate-y-8" })}
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4 text-${color}-400`}>
                    {cloneElement(icon, { className: "w-6 h-6" })}
                </div>

                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-3xl font-bold text-white mb-2">{value}</div>

                {trend && (
                    <div className={`text-xs font-bold ${trend.positive ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                        <span>{trend.value}</span>
                        <span className="text-gray-500 font-normal">מהשבוע שעבר</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
