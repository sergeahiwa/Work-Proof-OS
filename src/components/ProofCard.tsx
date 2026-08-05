import { useState } from 'react';
import { ShieldCheck, Eye, FileText, Link as LinkIcon, Code, BarChart2, Github, Users, ShieldAlert, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Proof } from '../types';
import ProofPreviewModal from './ProofPreviewModal';
import { motion, AnimatePresence } from 'motion/react';
import { getConfidenceLabel } from '../translation';

interface ProofCardProps {
  proof: Proof;
}

export default function ProofCard({ proof }: ProofCardProps) {
  const [showModal, setShowModal] = useState(false);

  const getIcon = () => {
    switch (proof.type) {
      case 'document': return <FileText size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'code': return <Code size={16} />;
      case 'metric': return <BarChart2 size={16} />;
      case 'github_commit': return <Github size={16} />;
      case 'peer_validation': return <Users size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusBadge = () => {
    const commonClasses = "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider";
    switch (proof.status) {
      case 'preuve_verifiee':
        return (
          <div className={`${commonClasses} bg-success/10 text-success`}>
            <ShieldCheck size={12} />
            <span>Prouvé</span>
          </div>
        );
      case 'en_verification':
        return (
          <div className={`${commonClasses} bg-primary/10 text-primary`}>
            <Clock size={12} className="animate-spin" />
            <span>En cours</span>
          </div>
        );
      case 'rejetee':
        return (
          <div className={`${commonClasses} bg-error/10 text-error`}>
            <XCircle size={12} />
            <span>Incomplet</span>
          </div>
        );
      default:
        return (
          <div className={`${commonClasses} bg-warning/10 text-warning`}>
            <ShieldAlert size={12} />
            <span>Déclaré</span>
          </div>
        );
    }
  };

  const getStrengthBadge = () => {
    if (!proof.strength) return null;
    const colors = {
      credible: 'bg-success/10 text-success',
      moyenne: 'bg-warning/10 text-warning',
      faible: 'bg-surface-section text-text-dim',
      incoherente: 'bg-error/10 text-error'
    };
    return (
      <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${colors[proof.strength as keyof typeof colors]}`}>
        Impact: {proof.strength}
      </span>
    );
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -4 }}
        onClick={() => setShowModal(true)}
        className="card flex flex-col gap-4 group cursor-pointer h-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-surface-section text-primary group-hover:bg-primary group-hover:text-white transition-all rounded-lg">
              {getIcon()}
            </div>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest">#{proof.id.substring(0, 6)}</span>
          </div>
          {proof.status ? getStatusBadge() : (
            <div className="flex items-center gap-1.5 text-primary text-[9px] font-bold uppercase tracking-wider">
              <ShieldCheck size={12} />
              <span>{getConfidenceLabel(proof.confidenceScore > 80 ? 'highly_reliable' : 'reliable')}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <h4 className="font-bold text-sm leading-tight text-text">
            {proof.title}
          </h4>
          <p className="text-[11px] text-text-muted font-normal line-clamp-2 leading-relaxed">
            {proof.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface-section text-text-muted rounded">
              {proof.type}
            </span>
            {getStrengthBadge()}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-surface-border border-dashed">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold uppercase text-text-dim">Date d'enregistrement</span>
            <span className="text-[10px] text-text font-bold">
              {new Date(proof.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button 
            className="flex items-center gap-1 px-3 py-1 text-primary text-[10px] font-bold hover:underline"
          >
            Détails
            <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <ProofPreviewModal 
            proof={proof} 
            onClose={() => setShowModal(false)}
            onDecision={() => console.log('decision_captured')}
          />
        )}
      </AnimatePresence>
    </>
  );
}
