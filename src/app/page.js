'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import GamesPreview from '@/components/landing/GamesPreview';
import ParentDashboardPreview from '@/components/landing/ParentDashboardPreview';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a2a4e] via-[#1a1a2e] to-[#0f0f1a]">
      {/* Ambient Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 4 + "px",
              height: Math.random() * 4 + "px",
            }}
          />
        ))}
      </div>

      <Header />
      <Hero />
      <ParentDashboardPreview />
      <GamesPreview />
      <Pricing />
      <Testimonials />
      <Footer />

      {/* Bottom overlay for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
