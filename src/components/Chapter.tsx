import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Zap, ShieldCheck, TrendingUp, Award, Fingerprint, Users, Activity, GitBranch } from 'lucide-react';
import CTAButton from './CTAButton';



interface ChapterProps {
  id: number;
  title: string;
  text: string;
  results?: string[];
  examples?: string[];
  points?: string[];
  modules?: { title: string; desc: string }[];
  benefits?: string[];
  cta?: string;
  onCtaClick?: () => void;
  isEven?: boolean;
}

export default function Chapter({ 
  id, title, text, results, examples, points, modules, benefits, cta, onCtaClick, isEven 
}: ChapterProps) {
  const contentVariants = {
    hidden: { opacity: 0, x: isEven ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const visualVariants = {
    hidden: { opacity: 0, x: isEven ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.1 } }
  };

  return (
    <section className="py-8 md:py-24 px-6 overflow-hidden">
      <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={contentVariants}
          className={`space-y-4 md:space-y-8 ${isEven ? 'lg:order-2' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-full text-[10px] font-bold tracking-widest">
            Chapitre {id}
          </div>
          <h2 className="text-3xl md:text-6xl font-headline font-extrabold leading-[1.1] tracking-tight">
            {title}
          </h2>
          <p className="text-base md:text-xl font-medium leading-relaxed text-text-muted">
            {text}
          </p>

          {results && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 md:p-3 bg-error/5 border border-error/10 rounded-xl">
                  <XCircle className="text-error shrink-0" size={16} />
                  <span className="font-semibold text-xs md:text-sm tracking-tight">{r}</span>
                </div>
              ))}
            </div>
          )}

          {examples && (
            <div className="space-y-2 md:space-y-3">
              {examples.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 md:p-4 bg-success/5 border border-success/10 rounded-2xl">
                  <TrendingUp className="text-success shrink-0" size={18} />
                  <span className="text-base md:text-xl font-bold tracking-tight text-success">{e}</span>
                </div>
              ))}
            </div>
          )}

          {points && (
            <div className="space-y-3 md:space-y-4">
              {points.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="text-lg md:text-2xl font-headline font-extrabold opacity-20 leading-none">0{i+1}</div>
                  <p className="text-sm md:text-lg font-semibold tracking-tight leading-snug">{p}</p>
                </div>
              ))}
            </div>
          )}

          {modules && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {modules.map((m, i) => (
                <div key={i} className="card p-6 border-t-4 border-t-primary space-y-2">
                  <h4 className="font-black uppercase tracking-tight text-primary">{m.title}</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{m.desc}</p>
                </div>
              ))}
            </div>
          )}

          {benefits && (
            <div className="flex flex-wrap gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="px-6 py-3 bg-primary text-surface font-bold tracking-widest rounded-full shadow-lg">
                  {b}
                </div>
              ))}
            </div>
          )}

          {cta && (
            <CTAButton text={cta} onClick={onCtaClick} variant={id === 10 ? 'secondary' : 'primary'} />
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={visualVariants}
          className={`relative ${isEven ? 'lg:order-1' : ''}`}
        >
          <VisualPlaceholder id={id} />
        </motion.div>
      </div>
    </section>
  );
}

function VisualPlaceholder({ id }: { id: number }) {
  // Simple visual representations for each chapter
  const icons = [
    null,
    <XCircle size={80} className="text-error/20 md:size-[120px]" />,
    <TrendingUp size={80} className="text-success/20 md:size-[120px]" />,
    <ShieldCheck size={80} className="text-primary/20 md:size-[120px]" />,
    <Zap size={80} className="text-warning/20 md:size-[120px]" />,
    <GitBranch size={80} className="text-primary/20 md:size-[120px]" />,
    <Users size={80} className="text-primary/20 md:size-[120px]" />,
    <Activity size={80} className="text-primary/20 md:size-[120px]" />,
    <Award size={80} className="text-primary/20 md:size-[120px]" />,
    <Fingerprint size={80} className="text-error/20 md:size-[120px]" />,
    <Fingerprint size={80} className="text-primary/20 md:size-[120px]" />,
  ];

  return (
    <div className="aspect-[4/3] md:aspect-square bg-surface-section rounded-2xl md:rounded-3xl border-4 border-surface-border flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {icons[id]}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 bg-surface-card border-2 border-surface-border rounded-xl md:rounded-2xl shadow-2xl transform group-hover:-translate-y-2 transition-transform">
        <div className="h-2 bg-surface-section w-1/3 mb-2 md:mb-4 rounded" />
        <div className="h-4 bg-primary/20 w-full mb-1 md:mb-2 rounded" />
        <div className="h-4 bg-primary/10 w-2/3 rounded" />
      </div>
    </div>
  );
}
