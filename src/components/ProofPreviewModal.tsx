import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, UserCheck, Zap, ArrowRight, Download, FileText, Share2, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Proof } from '../types';
import { generateProofCertificate } from '../services/credibilityService';
import { exportProofJSON, verifyProofIntegrity } from '../services/verificationService';
import { pdfExportService } from '../lib/pdfExport';
import { useAuth } from './FirebaseProvider';

interface ProofPreviewModalProps {
  proof: Proof;
  onClose: () => void;
  onDecision?: () => void;
}

export default function ProofPreviewModal({ proof, onClose, onDecision }: ProofPreviewModalProps) {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState<{ url: string, hash: string } | null>(null);

  const integrity = verifyProofIntegrity(proof);

  const handlePdfExport = () => {
    pdfExportService.exportProofPDF(proof, user?.displayName || user?.email || undefined);
  };

  const handleJsonExport = () => {
    const jsonStr = exportProofJSON(proof, user?.displayName || user?.email || undefined);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof_${proof.id.substring(0, 8)}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/proof/${proof.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Lien de partage copié dans le presse-papier !");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-surface border border-surface-border text-text shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-headline font-black uppercase tracking-tight text-text">Vérification de Preuve</h3>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Titre de la Preuve</h4>
                <p className="text-2xl font-black text-text">{proof.title}</p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Description Technique</h4>
                <p className="text-text-muted font-medium leading-relaxed">{proof.description}</p>
              </div>

              {proof.causality && (
                <div className="bg-blue-500/10 p-4 border-l-4 border-l-blue-500 rounded-r-xl border-y border-r border-blue-500/20">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Lien Causal (Vérifié)</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-200 italic font-medium leading-relaxed">"{proof.causality}"</p>
                </div>
              )}

              {/* Integrity status pill */}
              <div className={`p-4 border rounded-xl flex items-center gap-3 ${integrity.isValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                {integrity.isValid ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <div>
                  <div className="text-xs font-black uppercase tracking-widest">
                    {integrity.isValid ? 'Intégrité Cryptographique Validée' : 'Incohérence de Hash Détectée'}
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">{integrity.reason}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {proof.url && (
                  <a 
                    href={proof.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-surface-section text-text px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-surface-hover transition-colors border border-surface-border rounded-xl"
                  >
                    <ExternalLink size={14} /> Voir l'actif source
                  </a>
                )}
                {proof.rawSourceUrl && (
                  <a 
                    href={proof.rawSourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-500/20 transition-colors border border-blue-500/20 rounded-xl"
                  >
                    <ShieldCheck size={14} /> Source Brute (Immutable)
                  </a>
                )}
                <button 
                  onClick={handlePdfExport}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-colors rounded-xl shadow-md"
                >
                  <Download size={14} /> Exporter PDF
                </button>
                <button 
                  onClick={handleJsonExport}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors rounded-xl shadow-md"
                >
                  <FileText size={14} /> Exporter JSON (Souverain)
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-surface-section border border-surface-border text-text px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-surface-hover transition-colors rounded-xl"
                >
                  <Share2 size={14} /> Partager Lien
                </button>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-4">
              <div className="bg-surface-section p-6 border-l-4 border-l-emerald-500 border-y border-r border-surface-border rounded-r-xl">
                <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Niveau de Confiance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline font-black text-emerald-500">{proof.confidenceScore}%</span>
                  <ShieldCheck className="text-emerald-500" size={20} />
                </div>
              </div>

              <div className="bg-surface-section p-4 border border-surface-border rounded-xl">
                <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Hash d'Ancrage</span>
                <code className="text-[8px] break-all font-mono text-text-muted opacity-80 block">
                  {proof.hash || integrity.computedHash}
                </code>
              </div>

              <div className="bg-surface-section p-6 border-l-4 border-l-blue-500 border-y border-r border-surface-border rounded-r-xl">
                <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Validateur</span>
                <div className="flex items-center gap-2">
                  <UserCheck className="text-blue-500" size={18} />
                  <span className="text-sm font-black uppercase tracking-tight text-text">
                    {proof.verifierId || 'Registre Souverain'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Bar */}
          <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-text-muted font-bold italic">
              Cette preuve est certifiée par le protocole Work Proof OS et conforme au standard de portabilité v2.0.
            </p>
            {onDecision && (
              <button 
                onClick={() => {
                  onDecision();
                  onClose();
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl rounded-xl"
              >
                Valider Décision <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

