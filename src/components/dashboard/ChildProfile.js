'use client';

import React from 'react';
import { User, Edit2 } from 'lucide-react';

export default function ChildProfile({ name, age, avatar }) {
    return (
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cave-glow to-primary p-1">
                <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center overflow-hidden">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-8 h-8 text-gray-400" />
                    )}
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-sm text-gray-400">בן {age}</p>
            </div>

            <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <Edit2 className="w-5 h-5" />
            </button>
        </div>
    );
}
