'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, BookOpen } from 'lucide-react';
import { useAudio } from 'react-use'; // Or native audio

// Simple Story Content
const STORY = {
    title: "החיפושית האמיצה",
    author: "צוות המערה",
    coverColor: "bg-orange-400",
    audioSrc: "/sounds/story_placeholder.mp3", // Placeholder
    duration: 120 // seconds (mock)
};

export default function StoryTimePlayer() {
    // We can use a simple HTML5 Audio or use-sound, but for controls, a ref is best.
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
            setDuration(total);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(100);
    };

    const restart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto aspect-video bg-[#1a1a2e] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#3a3a5e] relative flex flex-col md:flex-row">

            <audio
                ref={audioRef}
                src={STORY.audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onLoadedMetadata={handleTimeUpdate}
            />

            {/* Left: Cover Art / Visualizer */}
            <div className={`w-full md:w-1/2 ${STORY.coverColor} relative flex items-center justify-center p-8 overflow-hidden`}>
                {/* Animated Background Circles */}
                <motion.div
                    animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white/10 rounded-full scale-150 blur-3xl"
                />

                <div className="relative z-10 text-center text-white">
                    <motion.div
                        animate={{ rotate: isPlaying ? 5 : 0 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                        className="w-48 h-64 bg-white rounded-lg shadow-2xl mx-auto mb-6 flex items-center justify-center text-gray-800 transform rotate-[-2deg] border-l-4 border-gray-200"
                    >
                        <BookOpen className="w-24 h-24 text-orange-400 opacity-80" />
                        <span className="sr-only">Book Cover</span>
                    </motion.div>
                </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full md:w-1/2 bg-[#16213e] p-8 flex flex-col justify-center text-white relative">

                {/* Title */}
                <div className="mb-8 text-center md:text-right">
                    <h2 className="text-3xl font-bold mb-2 text-orange-300">{STORY.title}</h2>
                    <p className="text-gray-400">מאת: {STORY.author}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 bottom-0 bg-orange-500 rounded-full"
                            style={{ width: `${progress}%`, right: 0, left: 'auto' }} // RTL Progress? No, audio usually LTR visually?
                        // Actually, in RTL, progress bar usually fills from Right to Left?
                        // Let's standardise: LTR for time is common even in Hebrew apps, but RTL is better for flow.
                        // Let's assume standard LTR for "Timeline".
                        // Fix: width from left.
                        />
                        <div
                            className="absolute top-0 left-0 bottom-0 bg-orange-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                        <span>{formatTime(audioRef.current?.currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={restart}
                        className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white"
                        title="התחל מחדש"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-orange-500/30 text-white"
                        title={isPlaying ? "השהה" : "נגן"}
                    >
                        {isPlaying ? (
                            <Pause className="w-10 h-10 fill-current" />
                        ) : (
                            <Play className="w-10 h-10 fill-current ml-1" />
                        )}
                    </button>
                </div>

                {/* Status Text */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    {isPlaying ? "מאזינים כעת..." : "לחצו על Play כדי להתחיל"}
                </div>
            </div>

        </div>
    );
}
