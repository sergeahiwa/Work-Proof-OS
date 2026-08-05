import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
}

export default function CTAButton({ text, onClick, className = '', variant = 'primary' }: CTAButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg',
    white: 'bg-surface-section text-text hover:bg-surface-hover border border-surface-border shadow-lg',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white'
  };

  const isSecondary = variant === 'secondary';
  const isWhite = variant === 'white';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={isSecondary || isWhite ? {
        boxShadow: isSecondary 
          ? ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 20px rgba(16, 185, 129, 0.4)", "0px 0px 0px rgba(16, 185, 129, 0)"]
          : ["0px 0px 0px rgba(255, 255, 255, 0)", "0px 0px 20px rgba(255, 255, 255, 0.4)", "0px 0px 0px rgba(255, 255, 255, 0)"],
      } : {}}
      transition={isSecondary || isWhite ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      onClick={(e) => {
        console.log(`[ANALYTICS] CTA Clicked: ${text}`);
        onClick?.();
      }}
      className={`px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold tracking-tight transition-all flex items-center justify-center gap-3 rounded-2xl ${variants[variant]} ${className}`}
    >
      {text} <ArrowRight size={20} className="shrink-0" />
    </motion.button>
  );
}
