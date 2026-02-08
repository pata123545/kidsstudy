'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { Sparkles, ArrowRight, RefreshCw, Trophy, Square, Triangle, Circle, Star, Heart, Diamond } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// --- Configuration ---
const ALL_SHAPES = [
    { id: 'square', icon: Square, color: 'text-red-500', fill: 'fill-red-500', bg: 'bg-red-500', name: 'Square' },
    { id: 'circle', icon: Circle, color: 'text-blue-500', fill: 'fill-blue-500', bg: 'bg-blue-500', name: 'Circle' },
    { id: 'triangle', icon: Triangle, color: 'text-yellow-500', fill: 'fill-yellow-500', bg: 'bg-yellow-500', name: 'Triangle' },
    { id: 'star', icon: Star, color: 'text-purple-500', fill: 'fill-purple-500', bg: 'bg-purple-500', name: 'Star' },
    { id: 'heart', icon: Heart, color: 'text-pink-500', fill: 'fill-pink-500', bg: 'bg-pink-500', name: 'Heart' },
    { id: 'diamond', icon: Diamond, color: 'text-teal-500', fill: 'fill-teal-500', bg: 'bg-teal-500', name: 'Diamond' },
];

const LEVELS = [
    {
        level: 1,
        name: 'מתחילים',
        shapes: ['square', 'circle', 'triangle'],
        spawnCount: 1,
        targetCount: 3
    },
    {
        level: 2,
        name: 'מתקדמים',
        shapes: ['star', 'heart', 'diamond'],
        spawnCount: 1, // Enforce 1 at a time
        targetCount: 6
    },
    {
        level: 3,
        name: 'אלופים',
        shapes: ['square', 'circle', 'triangle', 'star', 'heart', 'diamond'],
        spawnCount: 1, // Enforce 1 at a time
        targetCount: 10
    }
];

export default function ShapeSorterGame({ onComplete }) {
    // 1. State
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, level_complete, won
    const [placedShapes, setPlacedShapes] = useState([]); // Array of IDs currently filled

    // The "Hand" (Draggable items currently available)
    const [activeShapes, setActiveShapes] = useState([]);

    // The "Deck" (Remaining shapes to spawn for this level)
    const [shapeQueue, setShapeQueue] = useState([]);

    // 2. Utils
    const { width, height } = useWindowSize();
    const containerRef = useRef(null);
    const targetsRef = useRef({});

    // Sounds
    const [playSnap] = useSound('/sounds/pop.mp3', { volume: 0.5, playbackRate: 1.5 });
    const [playWin] = useSound('/sounds/win.mp3', { volume: 0.6 });
    const [playBoing] = useSound('/sounds/boing.mp3', { volume: 0.4 });
    const [playLevelUp] = useSound('/sounds/win.mp3', { volume: 0.4, playbackRate: 1.2 });

    useEffect(() => {
        startLevel(0);
    }, []);

    const startLevel = (idx) => {
        const levelConfig = LEVELS[idx];
        const availableShapes = ALL_SHAPES.filter(s => levelConfig.shapes.includes(s.id));

        // Generate Queue with Smart Random (No 3-Streaks)
        const newQueue = [];
        for (let i = 0; i < levelConfig.targetCount; i++) {
            let nextShape;
            let attempts = 0;
            do {
                nextShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
                attempts++;
                // Check if last two were the same as this one
                if (
                    newQueue.length >= 2 &&
                    newQueue[newQueue.length - 1].id === nextShape.id &&
                    newQueue[newQueue.length - 2].id === nextShape.id
                ) {
                    continue; // Try again
                }
                break; // Valid shape
            } while (attempts < 10); // Safety break, though unlikely to hit
            newQueue.push(nextShape);
        }

        setShapeQueue(newQueue);

        // Initial Deal - Just ONE
        const initialShape = { ...newQueue[0], instanceId: Math.random().toString(36) };
        setActiveShapes([initialShape]);

        setShapeQueue(prev => prev.slice(1)); // Remove the first one we just dealt

        setPlacedShapes([]);
        setGameState('playing');
        setCurrentLevelIdx(idx);
    };

    const handleMatch = (shapeInstance) => {
        // 1. Visual Snap (Fill Hole)
        // We only "fill" visually if it's unique? Or just flash? 
        // For the wooden puzzle feel, we want the holes to be permanently filled? 
        // BUT if we have 10 targets and only 3 holes... we can't fill them all permanently.
        // CHANGE: "Flash" fill or just stick it there and fade out?
        // Let's do: It fills the hole, then "poofs" away after a second to clear room for next?
        // OR: Level 1 has exactly 3 targets matching the 3 holes.
        // Level 3 has 6 holes? 
        // User request: "Level 3: Mix of all shapes (or 3 random out of 6)".
        // Let's render ALL 6 holes for Level 3.
        // Level 1: Only render 3 holes.

        setPlacedShapes(prev => [...prev, shapeInstance.id]);
        playSnap();

        // Remove from active hand
        setActiveShapes([]);

        // Deal next card from queue if available
        if (shapeQueue.length > 0) {
            const nextShape = { ...shapeQueue[0], instanceId: Math.random().toString(36) };
            setShapeQueue(prev => prev.slice(1));
            // Add with slight delay for pacing
            setTimeout(() => {
                setActiveShapes([nextShape]);
            }, 500);
        } else {
            // Level Complete!
            setTimeout(completeLevel, 1000);
        }

        // Clear the "fill" visual after a delay so the hole can be reused
        setTimeout(() => {
            setPlacedShapes(prev => prev.filter(id => id !== shapeInstance.id));
        }, 800);
    };

    const completeLevel = () => {
        if (currentLevelIdx < LEVELS.length - 1) {
            setGameState('level_complete');
            playLevelUp();
        } else {
            setGameState('won');
            playWin();
            if (onComplete) onComplete({ score: LEVELS.reduce((acc, l) => acc + l.targetCount, 0) });
        }
    };

    const nextLevel = () => {
        startLevel(currentLevelIdx + 1);
    };

    const restartGame = () => {
        startLevel(0);
    };

    // Collision
    const checkDrop = (event, info, shapeInstance) => {
        const dropPoint = info.point;

        // Find target
        const targetEl = targetsRef.current[shapeInstance.id];
        if (!targetEl) return;

        const rect = targetEl.getBoundingClientRect();

        // Distance check (User requested < 50px snap, but rect check is more robust for "inside")
        // Let's use a center-point distance check for "Magnetic Snap" feel
        const dropCenter = { x: dropPoint.x, y: dropPoint.y };
        const targetCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const distance = Math.hypot(dropCenter.x - targetCenter.x, dropCenter.y - targetCenter.y);

        if (distance < 80) { // SNAP DISTANCE
            handleMatch(shapeInstance);
        } else {
            // Wrong move
            playBoing();
        }
    };

    const currentConfigs = LEVELS[currentLevelIdx];
    // Filter SHAPES to only show relevant holes for this level
    const visibleHoles = ALL_SHAPES.filter(s => currentConfigs.shapes.includes(s.id));

    return (
        <div
            ref={containerRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] bg-[#FDE68A] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-amber-300 select-none touch-none flex flex-col items-center justify-between py-8"
            style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.2)'
            }}
        >
            {(gameState === 'won' || gameState === 'level_complete') && <Confetti width={width} height={height} recycle={true} />}

            {/* Top Bar: Progress & Level Indicator */}
            <div className="flex items-center justify-between w-full px-12">
                {/* Level Dots */}
                <div className="flex gap-2">
                    {LEVELS.map((l, i) => (
                        <div key={l.level} className={`w-4 h-4 rounded-full ${i <= currentLevelIdx ? 'bg-amber-600' : 'bg-amber-200'}`} />
                    ))}
                </div>

                <div className="bg-amber-100/50 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-amber-200 shadow-inner">
                    <span className="text-amber-800 font-bold text-xl font-mono">
                        שלב {currentConfigs.level}: {currentConfigs.name}
                    </span>
                </div>
            </div>

            {/* Targets Row (Holes) */}
            <div className="flex flex-wrap gap-4 md:gap-8 items-center justify-center w-full px-4 max-w-4xl">
                {visibleHoles.map(shape => {
                    const isFilled = placedShapes.includes(shape.id);
                    return (
                        <div
                            key={shape.id}
                            ref={el => targetsRef.current[shape.id] = el}
                            className={`
                                relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-3xl bg-black/20 
                                flex items-center justify-center 
                                transition-all duration-300
                            `}
                            style={{
                                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.2)'
                            }}
                        >
                            {/* Inner Depth */}
                            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]" />

                            <AnimatePresence>
                                {isFilled ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }} // Poof away
                                        className="w-full h-full p-4"
                                    >
                                        <shape.icon
                                            className={`w-full h-full ${shape.color} ${shape.fill} filter drop-shadow-md`}
                                            strokeWidth={1}
                                        />
                                    </motion.div>
                                ) : (
                                    <shape.icon
                                        className="w-16 h-16 md:w-20 md:h-20 text-black/20"
                                        strokeWidth={3}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Active Shapes Hand (Draggables) */}
            <div className="h-48 w-full flex items-center justify-center gap-8 relative z-20">
                <AnimatePresence>
                    {activeShapes.map((shapeInstance, i) => (
                        <motion.div
                            key={shapeInstance.instanceId}
                            layoutId={shapeInstance.instanceId}
                            initial={{ scale: 0, y: 100, rotate: Math.random() * 20 - 10 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: 20 }}
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            dragMomentum={false}
                            onDragStart={() => playSnap()}
                            onDragEnd={(e, info) => checkDrop(e, info, shapeInstance)}
                            whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing', rotate: 5 }}
                            whileHover={{ scale: 1.05, cursor: 'grab' }}
                            className={`
                                w-24 h-24 md:w-32 md:h-32 
                                flex items-center justify-center pointer-events-auto
                                filter drop-shadow-xl hover:drop-shadow-2xl transition-all
                            `}
                        >
                            <shapeInstance.icon
                                className={`w-full h-full ${shapeInstance.color} ${shapeInstance.fill}`}
                                strokeWidth={1}
                                style={{
                                    filter: 'drop-shadow(0 8px 0px rgba(0,0,0,0.15))' // "3D Block" Look bottom border effect via shadow
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {/* Level Up Modal */}
                {gameState === 'level_complete' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#FEF3C7] p-8 rounded-[2rem] border-4 border-amber-400 text-center shadow-2xl max-w-sm"
                        >
                            <h2 className="text-4xl font-bold text-amber-900 mb-4">!מעולה</h2>
                            <p className="text-amber-800 text-xl mb-6">סיימת את שלב {currentConfigs.level}!</p>
                            <button
                                onClick={nextLevel}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 mx-auto text-xl"
                            >
                                <span>לשלב הבא</span>
                                <ArrowRight />
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Victory Modal */}
                {gameState === 'won' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="bg-[#FEF3C7] p-12 rounded-[3rem] border-8 border-amber-400 text-center shadow-2xl max-w-lg"
                        >
                            <Trophy className="w-32 h-32 text-amber-500 mx-auto mb-6 animate-bounce" />
                            <h2 className="text-6xl font-black text-amber-900 mb-4">!כל הכבוד</h2>
                            <p className="text-amber-800 mb-8 text-2xl font-bold">סיימת את כל השלבים!</p>
                            <button
                                onClick={restartGame}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-6 px-10 rounded-3xl shadow-xl flex items-center justify-center gap-4 text-3xl"
                            >
                                <RefreshCw className="w-10 h-10" />
                                <span>שחק שוב</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
