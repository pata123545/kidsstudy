'use client';

import React from 'react';

export default function ProgressChart({ skills }) {
    // skills prop example: [{ name: 'Logic', level: 75, color: 'blue' }, ...]

    return (
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">מיומנויות נרכשות</h3>

            <div className="space-y-6">
                {skills.map((skill, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300 font-medium">{skill.name}</span>
                            <span className="text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-${skill.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-out`}
                                style={{ width: `${skill.level}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500">
                    הילד מגלה עניין רב ב<span className="text-white font-bold">פתרון בעיות</span> השבוע!
                </p>
            </div>
        </div>
    );
}
