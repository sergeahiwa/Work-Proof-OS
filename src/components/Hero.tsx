import React from 'react';
import { motion } from 'motion/react';
import CTAButton from './CTAButton';
import { landingCopy } from '../content/copy';

interface HeroProps {
  onStartClick: () => void;
  onRecruiterClick: () => void;
}

export default function Hero({ onStartClick, onRecruiterClick }: HeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-32 md:py-48 text-center space-y-12 relative overflow-hidden">
      {/* Background Score Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-[300px] md:text-[500px] font-headline font-black"
        >
          98
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 md:space-y-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-full text-[10px] font-bold tracking-widest mb-2 md:mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          Système de Crédibilité Live
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-extrabold tracking-tight leading-[1.1] md:leading-[0.95] max-w-6xl mx-auto">
          {landingCopy.hero.title}
        </h1>
        <p className="text-lg md:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          {landingCopy.hero.subtitle}
        </p>
        <p className="text-sm md:text-lg text-text-muted/80 font-medium max-w-2xl mx-auto">
          {landingCopy.hero.description}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center gap-6 relative z-10"
      >
        <CTAButton text={landingCopy.hero.cta} onClick={onStartClick} />
        <button 
          onClick={() => {
            console.log("[ANALYTICS] Recruiter CTA Clicked");
            onRecruiterClick();
          }}
          className="bg-surface-section text-text-main border-2 md:border-4 border-surface-border px-8 md:px-12 py-4 md:py-6 text-sm md:text-lg font-black uppercase tracking-widest hover:bg-surface-hover transition-colors flex items-center justify-center gap-3"
        >
          Recruter par la Preuve
        </button>
      </motion.div>
    </section>
  );
}
