'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CaveBackground() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        setParticles([...Array(20)].map((_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 10 + 10,
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
        })));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Deep Cave Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]" />

            {/* Ambient Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white opacity-20"
                    initial={{
                        x: p.x,
                        y: p.y,
                        scale: p.scale,
                    }}
                    animate={{
                        y: [p.y, p.y - 100], // Simple float up
                        opacity: [0.2, 0.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: p.width + 'px',
                        height: p.height + 'px',
                        left: 0,
                        top: 0
                    }}
                />
            ))}

            {/* Stalactites (Hanging from top) */}
            <div className="absolute top-0 left-0 w-full h-32 md:h-64 flex justify-between items-start opacity-40">
                <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-t-[150px] border-l-transparent border-r-transparent border-t-[#0a0a1a] transform translate-y-[-1px]" />
                <div className="w-0 h-0 border-l-[80px] border-r-[80px] border-t-[250px] border-l-transparent border-r-transparent border-t-[#0c0c20] transform translate-y-[-10px]" />
                <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-t-[100px] border-l-transparent border-r-transparent border-t-[#0a0a1a] transform translate-y-[-1px]" />
                <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-t-[200px] border-l-transparent border-r-transparent border-t-[#0e0e24] hidden md:block" />
                <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-t-[120px] border-l-transparent border-r-transparent border-t-[#0a0a1a]" />
            </div>

            {/* Stalagmites (Rising from bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 flex justify-around items-end opacity-40">
                <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[120px] border-l-transparent border-r-transparent border-b-[#0a0a1a] transform translate-y-[1px]" />
                <div className="w-0 h-0 border-l-[100px] border-r-[100px] border-b-[300px] border-l-transparent border-r-transparent border-b-[#0c0c20] transform translate-y-[10px]" />
                <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[180px] border-l-transparent border-r-transparent border-b-[#0e0e24] hidden md:block" />
            </div>

            {/* Fog/Mist Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
