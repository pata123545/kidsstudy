'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, Home, RefreshCw } from 'lucide-react';

export default function PathTracerGame({ onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [success, setSuccess] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 350 }); // Starting position

    // Game Mechanics State
    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const pathPoints = useRef([]); // Store pre-calculated points for collision detection
    const lastPosition = useRef({ x: 50, y: 350 });
    const lastTime = useRef(0);

    // Config
    const SAFE_RADIUS = 30; // Max distance from path center
    const MAX_SPEED = 25; // Max pixels per frame (approx) - prevents jumping
    const SNAP_TO_PATH = true; // If true, visually snaps beetle to path center (optional)

    // Pre-calculate path points on mount
    useEffect(() => {
        if (pathRef.current) {
            const path = pathRef.current;
            const length = path.getTotalLength();
            const points = [];
            // Sample every 2 pixels for high precision
            for (let i = 0; i <= length; i += 2) {
                const point = path.getPointAtLength(i);
                points.push({ x: point.x, y: point.y });
            }
            pathPoints.current = points;
        }
    }, []);

    const handleStart = () => {
        setIsPlaying(true);
        setGameOver(false);
        setSuccess(false);
        setPosition({ x: 50, y: 350 });
        lastPosition.current = { x: 50, y: 350 };
        lastTime.current = Date.now();
    };

    const handlePointerMove = (e) => {
        if (!isPlaying || gameOver || success) return;

        // Get relative coordinates
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        // 1. Find closest point on path
        let minDistance = Infinity;
        let closestPoint = null;

        // Optimization: Search only near the last known index? 
        // For simple SVG, full scan of ~200 points is fast enough.
        for (const p of pathPoints.current) {
            const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            if (dist < minDistance) {
                minDistance = dist;
                closestPoint = p;
            }
        }

        // 2. Check "Stay on Line" (Radius Check)
        if (minDistance > SAFE_RADIUS) {
            failGame("יצאת מהקו!");
            return;
        }

        // 3. Check Speed (Prevent jumping)
        const distFromLast = Math.sqrt(Math.pow(x - lastPosition.current.x, 2) + Math.pow(y - lastPosition.current.y, 2));
        if (distFromLast > MAX_SPEED) {
            failGame("מהר מדי!");
            return;
        }

        // Update State
        setPosition({ x, y });
        lastPosition.current = { x, y };
        lastTime.current = Date.now();

        // 4. Check Win Condition (Home Area)
        // Home is roughly at 300, 50. Let's precise check.
        if (x > 280 && x < 340 && y > 30 && y < 90) {
            winGame();
        }
    };

    const failGame = (reason) => {
        setIsPlaying(false);
        setGameOver(true);
        console.log("Game Over:", reason);
    };

    const winGame = () => {
        setIsPlaying(false);
        setSuccess(true);
        if (onComplete) onComplete({ accuracy: 100 });
    };

    const handlePointerLeave = () => {
        if (isPlaying) {
            failGame("יצאת מהגבולות");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-[#f0f9ff] rounded-3xl p-4 select-none relative overflow-hidden text-right" dir="rtl">

            {/* Header */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <h3 className="text-2xl font-bold text-sky-900 flex items-center gap-2">
                    <Bug className="text-green-600" /> החיפושית בדרך הביתה
                </h3>
                <p className="text-sm text-sky-700">גררו את החיפושית לאט ובזהירות על השביל.</p>
            </div>

            {/* Game Area */}
            <div
                ref={svgRef}
                className="relative w-[350px] h-[400px] bg-white rounded-xl shadow-inner border-4 border-sky-100 cursor-none touch-none"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerUp={() => isPlaying && setIsPlaying(false)}
            >
                {/* The Path (Visual - Thick stroke is the "Safe Zone") */}
                <svg w="100%" h="100%" viewBox="0 0 350 400" className="absolute inset-0 pointer-events-none">
                    {/* Safe Zone (Thick) */}
                    <path
                        ref={pathRef}
                        d="M 50 350 C 100 350, 100 200, 175 200 S 250 50, 300 50"
                        fill="none"
                        stroke="#e0f2fe"
                        strokeWidth="60"
                        strokeLinecap="round"
                    />
                    {/* Center Line (Visual guide) */}
                    <path
                        d="M 50 350 C 100 350, 100 200, 175 200 S 250 50, 300 50"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Home Base */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-400">
                    <Home className="w-8 h-8 text-green-600" />
                </div>

                {/* Start Base */}
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center border-2 border-sky-400">
                    <span className="text-xs font-bold text-sky-700">התחל</span>
                </div>

                {/* The Player (Beetle) */}
                {!gameOver && !success && (
                    <motion.div
                        animate={{ x: position.x - 20, y: position.y - 20 }}
                        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
                        className={`absolute w-10 h-10 z-20 flex items-center justify-center ${isPlaying ? 'cursor-none pointer-events-none' : 'cursor-pointer animate-bounce'}`}
                        onPointerDown={(e) => {
                            e.preventDefault(); // Stop text selection/scrolling
                            handleStart();
                        }}
                    >
                        <Bug className="w-8 h-8 text-red-500 fill-current drop-shadow-lg transform -rotate-45" />
                    </motion.div>
                )}

                {/* Overlays */}
                {gameOver && (
                    <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-xl text-center"
                        >
                            <div className="text-4xl mb-2">😢</div>
                            <h4 className="text-xl font-bold text-red-600 mb-2">אוי לא!</h4>
                            <p className="text-gray-600 mb-4 text-sm">יצאנו מהשביל או זזנו מהר מדי.</p>
                            <button
                                onClick={handleStart}
                                className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" /> נסה שוב
                            </button>
                        </motion.div>
                    </div>
                )}

                {success && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-xl text-center"
                        >
                            <div className="text-4xl mb-2">🎉</div>
                            <h4 className="text-xl font-bold text-green-600 mb-4">כל הכבוד! החיפושית בבית!</h4>
                            <button
                                onClick={handleStart}
                                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" /> שחק שוב
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>

        </div>
    );
}
