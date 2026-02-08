'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import useSound from 'use-sound';
import { Bug, Flower, RefreshCw, Home, Leaf, ArrowRight, Star, Lock, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// --- Level Configuration ---
const LEVELS = [
    {
        id: 0,
        name: "Morning Stroll",
        theme: "from-sky-300 to-green-400", // Morning
        path: "M 50 450 Q 400 100 750 300", // Simple Arc
        length: 1000
    },
    {
        id: 1,
        name: "Garden Winding",
        theme: "from-blue-400 to-emerald-500", // Noon
        path: "M 50 450 C 250 450, 200 150, 400 150 S 600 400, 750 300", // S-Shape
        length: 1200
    },
    {
        id: 2,
        name: "Sunset Zig-Zag",
        theme: "from-orange-300 to-purple-500", // Sunset
        path: "M 50 500 C 150 500, 150 100, 300 100 C 450 100, 450 500, 600 500 C 750 500, 750 200, 750 200", // Complex
        length: 1500
    }
];

export default function GardenPathGame({ onComplete }) {
    // 1. Setup & State
    const supabase = createClient();
    const { width, height } = useWindowSize();

    const [levelIndex, setLevelIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Game Physics State
    const [targetProgress, setTargetProgress] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'loading'
    const [beetlePos, setBeetlePos] = useState({ x: 50, y: 450, angle: 0 });
    const [isMoving, setIsMoving] = useState(false);

    // Audio
    const [playWin] = useSound('/sounds/win.mp3', { volume: 0.5 });

    // Refs
    const pathRef = useRef(null);
    const svgRef = useRef(null);
    const requestRef = useRef();
    const pathPointsRef = useRef([]);

    const currentLevel = LEVELS[levelIndex];

    // 2. Persistence: Fetch Level on Mount
    useEffect(() => {
        async function fetchProgress() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('current_level')
                        .eq('id', user.id)
                        .single();

                    if (data && data.current_level) {
                        const idx = Math.min(Math.max(data.current_level, 0), LEVELS.length - 1);
                        setLevelIndex(idx);
                    }
                }
            } catch (err) {
                console.error("Error fetching level:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProgress();
    }, []);

    // 3. Pre-calculate path points when Level changes
    useEffect(() => {
        setTargetProgress(0);
        setCurrentProgress(0);
        setGameState('playing');
        setBeetlePos({ x: 50, y: 450, angle: 0 });

        setTimeout(calculatePathPoints, 50);

    }, [levelIndex]);

    const calculatePathPoints = () => {
        if (!pathRef.current) return;
        const path = pathRef.current;
        const len = path.getTotalLength();
        const points = [];
        for (let i = 0; i <= 1000; i++) {
            const dist = (i / 1000) * len;
            const pt = path.getPointAtLength(dist);
            points.push({ x: pt.x, y: pt.y, progress: i / 10 });
        }
        pathPointsRef.current = points;

        const start = path.getPointAtLength(0);
        setBeetlePos({ x: start.x, y: start.y, angle: 0 });
    };

    // 4. Game Loop (Physics)
    const LERP_FACTOR = 0.05;
    const WIN_THRESHOLD = 98;

    const animate = () => {
        if (gameState === 'won') return;

        setCurrentProgress(prev => {
            const diff = targetProgress - prev;
            if (Math.abs(diff) < 0.1) {
                setIsMoving(false);
                return prev;
            }
            setIsMoving(true);
            return prev + (diff * LERP_FACTOR);
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [targetProgress, gameState]);

    // 5. Update Position & Check Win
    useEffect(() => {
        if (!pathRef.current) return;
        const path = pathRef.current;
        const length = path.getTotalLength();
        const pointDist = (currentProgress / 100) * length;
        const point = path.getPointAtLength(pointDist);

        const lookAheadDist = Math.min(pointDist + 10, length);
        const lookAheadPoint = path.getPointAtLength(lookAheadDist);
        const angleRad = Math.atan2(lookAheadPoint.y - point.y, lookAheadPoint.x - point.x);
        const angleDeg = angleRad * (180 / Math.PI);

        setBeetlePos({ x: point.x, y: point.y, angle: angleDeg });

        if (currentProgress >= WIN_THRESHOLD && gameState !== 'won') {
            handleWin();
        }
    }, [currentProgress]);

    const handleWin = async () => {
        setGameState('won');
        playWin();

        const nextLevel = levelIndex + 1;
        if (nextLevel < LEVELS.length) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('profiles').update({ current_level: nextLevel }).eq('id', user.id);
                }
            } catch (err) {
                console.error("Save error:", err);
            }
        }
    };

    // 6. Interaction
    const handlePointerMove = (e) => {
        if (gameState === 'won' || !pathPointsRef.current.length) return;
        if (e.buttons !== 1) return;

        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        let closest = null;
        let minDst = Infinity;

        for (const p of pathPointsRef.current) {
            const dst = (p.x - svgP.x) ** 2 + (p.y - svgP.y) ** 2;
            if (dst < minDst) {
                minDst = dst;
                closest = p;
            }
        }

        if (closest) {
            const distToCursor = (svgP.x - beetlePos.x) ** 2 + (svgP.y - beetlePos.y) ** 2;
            if (distToCursor < 30000) {
                setTargetProgress(closest.progress);
            }
        }
    };

    const handleNextLevel = () => {
        if (levelIndex < LEVELS.length - 1) {
            setLevelIndex(prev => prev + 1);
        } else {
            handleRestart();
        }
    };

    const handleRestart = () => {
        setTargetProgress(0);
        setCurrentProgress(0);
        setGameState('playing');
        calculatePathPoints();
    };

    if (loading) return <div className="text-white text-center">טוען משחק...</div>;

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto">

            {/* Level Stepper (Visual Indicator) */}
            <div className="relative flex items-center justify-between w-full max-w-md px-8 py-4 z-10">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/20 -z-10 mx-12 rounded-full" />

                {LEVELS.map((level, idx) => {
                    const isCompleted = idx < levelIndex;
                    const isCurrent = idx === levelIndex;
                    const isLocked = idx > levelIndex;

                    return (
                        <div key={idx} className="relative flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{ scale: isCurrent ? 1.2 : 1 }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg transition-all 
                                    ${isCompleted ? 'bg-green-500 border-green-300' : ''}
                                    ${isCurrent ? 'bg-white border-yellow-400 animate-pulse' : ''}
                                    ${isLocked ? 'bg-gray-600/50 border-gray-500' : ''}
                                `}
                            >
                                {isCompleted && <Check className="w-8 h-8 text-white stroke-[3]" />}
                                {isCurrent && <span className="text-2xl font-black text-yellow-500">{idx + 1}</span>}
                                {isLocked && <Lock className="w-6 h-6 text-gray-300" />}
                            </motion.div>

                            {/* Label */}
                            {isCurrent && (
                                <span className="absolute -bottom-8 whitespace-nowrap text-white font-bold drop-shadow-md text-sm bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    {level.name}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Game Container */}
            <div
                className={`relative w-[90vw] max-w-6xl aspect-video bg-gradient-to-b ${currentLevel.theme} rounded-3xl overflow-hidden shadow-2xl touch-none select-none border-4 border-white cursor-pointer transition-colors duration-1000`}
                onPointerMove={handlePointerMove}
                onPointerDown={(e) => handlePointerMove(e)}
            >

                {gameState === 'won' && <Confetti width={width} height={height} recycle={true} numberOfPieces={200} />}

                {/* Background Assets */}
                <div className="absolute top-10 left-10 text-white/40 animate-pulse"><Home className="w-16 h-16" /></div>

                <svg
                    ref={svgRef}
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 800 600"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {/* 1. Dirt Path */}
                    <path
                        d={currentLevel.path}
                        fill="none"
                        stroke="#D2B48C"
                        strokeWidth="50"
                        strokeLinecap="round"
                    />
                    <path
                        d={currentLevel.path}
                        fill="none"
                        stroke="#8B4513"
                        strokeWidth="40"
                        strokeLinecap="round"
                        strokeDasharray="10, 20"
                        className="opacity-50"
                    />

                    {/* 2. Progress */}
                    <path
                        ref={pathRef}
                        d={currentLevel.path}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="30"
                        strokeLinecap="round"
                        strokeDasharray={pathRef.current?.getTotalLength() || 1000}
                        strokeDashoffset={(pathRef.current?.getTotalLength() || 1000) * (1 - currentProgress / 100)}
                        className="transition-all duration-75 ease-linear"
                    />

                    {/* Goal Marker */}
                    {pathPointsRef.current.length > 0 && (
                        <g transform={`translate(${pathPointsRef.current[pathPointsRef.current.length - 1].x}, ${pathPointsRef.current[pathPointsRef.current.length - 1].y})`}>
                            <foreignObject x="-60" y="-60" width="120" height="120">
                                <div className={`text-red-500 transform transition-transform duration-1000 ${gameState === 'won' ? 'scale-125' : 'animate-pulse'}`}>
                                    <Flower className="w-32 h-32 fill-current drop-shadow-lg text-pink-600" />
                                    <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-600" />
                                </div>
                            </foreignObject>
                        </g>
                    )}

                    {/* Beetle */}
                    <g transform={`translate(${beetlePos.x}, ${beetlePos.y}) rotate(${beetlePos.angle})`}>
                        <foreignObject x="-40" y="-40" width="80" height="80" style={{ overflow: 'visible' }}>
                            <div className={`w-20 h-20 flex items-center justify-center transform rotate-90 transition-transform ${isMoving ? 'scale-110' : 'scale-100'}`}>
                                <div className="text-6xl filter drop-shadow-lg select-none">🐞</div>
                            </div>
                        </foreignObject>
                    </g>
                </svg>


                {/* Win Modal */}
                <AnimatePresence>
                    {gameState === 'won' && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-right"
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-yellow-400 max-w-sm w-full relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-4 drop-shadow-sm">!כל הכבוד</h2>
                                    <p className="text-gray-600 mb-8 font-medium text-lg">
                                        {levelIndex < LEVELS.length - 1 ? "סיימת את השלב!" : "סיימת את כל השלבים!"}
                                    </p>

                                    <button
                                        onClick={handleNextLevel}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        {levelIndex < LEVELS.length - 1 ? (
                                            <>
                                                <ArrowRight className="w-6 h-6 rotate-180" /> {/* Left arrow for Next in RTL */}
                                                <span className="text-xl">לשלב הבא</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-6 h-6" />
                                                <span className="text-xl">שחק מההתחלה</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
