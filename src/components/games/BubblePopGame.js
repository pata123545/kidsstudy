'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { Sparkles, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// --- Configuration ---
const COLORS = [
    { name: 'Red', class: 'bg-red-500', hex: '#ef4444' },
    { name: 'Blue', class: 'bg-blue-500', hex: '#3b82f6' },
    { name: 'Green', class: 'bg-green-500', hex: '#22c55e' },
    { name: 'Yellow', class: 'bg-yellow-400', hex: '#facc15' },
    { name: 'Purple', class: 'bg-purple-500', hex: '#a855f7' },
];

const TARGET_SCORE = 10;
const SPAWN_RATE = 800; // ms

export default function BubblePopGame({ onComplete }) {
    // 1. State
    const [score, setScore] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [targetColor, setTargetColor] = useState(COLORS[0]);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'won'
    const [message, setMessage] = useState('');
    const [shakingBubble, setShakingBubble] = useState(null); // ID of bubble to shake

    // 2. Utils & Hooks
    const { width, height } = useWindowSize();
    const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
    const [playWin] = useSound('/sounds/win.mp3', { volume: 0.5 });
    const [playBoing] = useSound('/sounds/boing.mp3', { volume: 0.5 }); // Placeholder

    const containerRef = useRef(null);

    // 3. Game Loop (Spawning)
    // Use refs for width to avoid resetting interval on resize
    const widthRef = useRef(width);
    useEffect(() => {
        widthRef.current = width;
    }, [width]);

    // Use ref for score to access current score inside closure without re-running effect
    const scoreRef = useRef(score);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        let timeoutId;

        const spawnBubble = () => {
            const currentWidth = widthRef.current;
            const currentScore = scoreRef.current;
            const isMobile = currentWidth < 768;

            // Progressive Difficulty:
            // Slower at start, gets faster as score increases.
            // Base delay: 1500 (mobile) / 1000 (desktop)
            // Decrease delay by 50ms per point, cap at 600ms
            const baseDelay = isMobile ? 1500 : 1000;
            const speedUp = currentScore * 50;
            const nextSpawnDelay = Math.max(600, baseDelay - speedUp);

            const id = Math.random().toString(36).substr(2, 9);
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Larger Bubbles for "Big Screen" feel
            const minSize = isMobile ? 70 : 100;
            const maxSize = isMobile ? 100 : 160;
            const size = Math.random() * (maxSize - minSize) + minSize;

            const left = Math.random() * 80 + 10; // 10% to 90% width

            // Speed (Duration):
            // Start slow (8s-12s), get faster.
            // Decrease duration by 0.3s per point.
            // Min duration: 3s
            const baseDuration = 10; // 10 seconds to float up
            const durationReduction = currentScore * 0.4;
            const duration = Math.max(3, baseDuration - durationReduction);
            // Add some randomness
            const speed = duration + (Math.random() * 2 - 1);

            setBubbles(prev => {
                // Limit max bubbles to prevent lag/crowding
                if (prev.length > (isMobile ? 8 : 15)) return prev;
                return [
                    ...prev,
                    { id, color, size, left, speed }
                ];
            });

            // Schedule next spawn
            timeoutId = setTimeout(spawnBubble, nextSpawnDelay);
        };

        // Start loop
        spawnBubble();

        return () => clearTimeout(timeoutId);
    }, [gameState]);

    // 4. Interaction
    const handlePop = (id, color) => {
        if (gameState !== 'playing') return;

        // Check Logic
        if (color.name === targetColor.name) {
            playPop();
            setScore(prev => {
                const newScore = prev + 1;
                if (newScore >= TARGET_SCORE) {
                    handleWin();
                } else {
                    // Change target color EVERY time
                    let newColor;
                    do {
                        newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
                    } while (newColor.name === targetColor.name);
                    setTargetColor(newColor);
                }
                return newScore;
            });
            setMessage("מעולה!");
            setTimeout(() => setMessage(''), 500);
            // Remove bubble
            setBubbles(prev => prev.filter(b => b.id !== id));
        } else {
            playBoing();
            setMessage("אופס!");
            setTimeout(() => setMessage(''), 500);

            // Shake Animation Check
            setShakingBubble(id);
            setTimeout(() => setShakingBubble(null), 500);
        }
    };

    const handleWin = () => {
        setGameState('won');
        playWin();
        if (onComplete) onComplete({ score: TARGET_SCORE });
    };

    const handleRestart = () => {
        setScore(0);
        setBubbles([]);
        setGameState('playing');
        setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    };

    const handleMissed = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[85vh] bg-gradient-to-b from-blue-100 to-purple-200 rounded-3xl overflow-hidden shadow-2xl border-8 border-white cursor-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0xMiB5MT0yIHgyPTEyIHkyPTEyPjwvbGluZT48Y2lyY2xlIGN4PTEyIGN5PTE5IHI9MiPjwvY2lyY2xlPjwvc3ZnPg=='),_auto]"
            style={{ zIndex: 0 }} // Ensure it's behind HUD but visible
        >

            {gameState === 'won' && <Confetti width={width} height={height} recycle={true} />}

            {/* Header / HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="bg-white/80 px-6 py-3 rounded-full text-purple-600 font-bold text-3xl border-2 border-white/50 shadow-md min-w-[180px] text-center">
                        {score} / {TARGET_SCORE}
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/60 px-6 py-2 rounded-full border border-white/40">
                    <span className="text-purple-900 text-2xl md:text-3xl font-bold">לפוצץ:</span>
                    <div
                        className={`w-16 h-16 rounded-full border-4 border-white shadow-xl animate-pulse ${targetColor.class}`}
                        title={targetColor.name}
                    />
                </div>
            </div>

            {/* Game Area */}
            <div ref={containerRef} className="absolute inset-0 top-32 overflow-hidden">
                <AnimatePresence>
                    {bubbles.map(bubble => (
                        <motion.button
                            key={bubble.id}
                            initial={{ y: 800, opacity: 0, scale: 0 }}
                            animate={
                                shakingBubble === bubble.id
                                    ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } // Shake
                                    : {
                                        y: -200, // Move higher up to clear screen
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: bubble.speed, ease: "linear" }
                                    }
                            }
                            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
                            onAnimationComplete={(definition) => {
                                if (definition.y === -200) handleMissed(bubble.id);
                            }}
                            onClick={() => handlePop(bubble.id, bubble.color)}
                            className={`absolute rounded-full shadow-lg backdrop-blur-[2px] border-4 border-white/60 cursor-pointer flex items-center justify-center hover:brightness-110 active:scale-95 transition-all`}
                            style={{
                                left: `${bubble.left}%`,
                                width: bubble.size,
                                height: bubble.size,
                                backgroundColor: bubble.color.hex + '99',
                                boxShadow: 'inset 0 0 30px rgba(255,255,255,0.6), 0 8px 15px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Shine effect */}
                            <div className="absolute top-4 left-4 w-1/3 h-1/3 bg-gradient-to-br from-white to-transparent rounded-full opacity-90" />
                            <div className="absolute bottom-4 right-4 w-1/6 h-1/6 bg-white/40 rounded-full blur-md" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1.5, rotate: 0 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        <div className={`text-8xl md:text-9xl font-black drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] stroke-2 stroke-white ${message === 'אופס!' ? 'text-red-500' : 'text-green-500'}`}
                            style={{ textShadow: '4px 4px 0 #fff' }}
                        >
                            {message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Win Modal */}
            <AnimatePresence>
                {gameState === 'won' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-50 text-center"
                    >
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-yellow-400 max-w-lg w-full transform scale-125">
                            <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6 animate-bounce" />
                            <h2 className="text-6xl font-black text-gray-800 mb-4">!ניצחון</h2>
                            <p className="text-gray-600 mb-8 text-2xl font-bold">פוצצתם את כל הבועות!</p>

                            <button
                                onClick={handleRestart}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-6 px-10 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-4 text-3xl hover:scale-105 active:scale-95"
                            >
                                <RefreshCw className="w-10 h-10" />
                                <span>שחק שוב</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
