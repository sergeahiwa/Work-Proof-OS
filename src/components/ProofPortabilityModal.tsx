import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Copy, Check, X, QrCode, ShieldCheck, Share2, Code, Fingerprint, ExternalLink, Lock, Download, FileText } from 'lucide-react';
import { pdfExportService } from '../lib/pdfExport';
import { exportProofJSON } from '../services/verificationService';
import { Proof } from '../types';

interface ProofPortabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  proofCount: number;
  proofs?: Proof[];
}

export const ProofPortabilityModal: React.FC<ProofPortabilityModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  proofCount,
  proofs = []
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'embed' | 'export'>('link');

  const shareUrl = `${window.location.origin}/profile?uid=${userId}&verified=true`;
  const proofPassportId = `WP-PASSPORT-2026-${userId.substring(0, 8).toUpperCase()}`;
  const embedSnippet = `<iframe src="${window.location.origin}/embed/proofs?uid=${userId}" width="100%" height="400" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleExportPdfPassport = () => {
    pdfExportService.exportProofLedgerPDF(
      { name: userName, role: 'Professionnel', id: userId } as any,
      proofs
    );
  };

  const handleExportJsonPackage = () => {
    const jsonStr = exportProofJSON(proofs, userName);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof_passport_${userName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-surface border border-surface-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0 text-text"
        >
          {/* Header */}
          <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-section">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500 block">
                  Souveraineté & Portabilité
                </span>
                <h3 className="text-lg font-bold font-display text-text">
                  Passeport de Preuves & Exports
                </h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Passport Identity Header */}
            <div className="bg-surface-section border border-surface-border p-4 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Fingerprint className="text-emerald-500" size={16} />
                <span className="text-text-muted">PASSPORT ID:</span>
                <span className="font-bold text-text">{proofPassportId}</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
                {proofCount} Preuves
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-surface-border pb-2">
              {[
                { id: 'link', label: 'Lien Public', icon: Globe },
                { id: 'export', label: 'Export Souverain', icon: Download },
                { id: 'qr', label: 'QR Code', icon: QrCode },
                { id: 'embed', label: 'Badge', icon: Code },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                      activeTab === t.id
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                        : 'text-text-muted hover:text-text hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  Exportez l'intégralité de vos preuves dans un format ouvert, lisible et vérifiable. Vos données restent sous votre souveraineté totale.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-section p-4 border border-surface-border rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                      <Download size={16} />
                      <span>Passeport PDF</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-snug">
                      Document officiel structuré au format PDF avec signatures d'ancrage et récapitulatif des preuves.
                    </p>
                    <button
                      onClick={handleExportPdfPassport}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <Download size={14} />
                      <span>Générer Passeport PDF</span>
                    </button>
                  </div>

                  <div className="bg-surface-section p-4 border border-surface-border rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                      <FileText size={16} />
                      <span>JSON Souverain</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-snug">
                      Format machine-readable contenant l'intégralité du registre, les métadonnées STAR et les hashes cryptographiques.
                    </p>
                    <button
                      onClick={handleExportJsonPackage}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <FileText size={14} />
                      <span>Exporter Archive JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'link' && (
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  Ce lien permet à un recruteur, client ou partenaire d'accéder directement à vos réalisations vérifiées sans passer par un CV statique.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block">
                    URL Souveraine de votre Passeport
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareUrl} 
                      className="flex-1 bg-surface-section border border-surface-border rounded-xl px-3 py-2.5 text-xs font-mono text-blue-500 outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-lg"
                    >
                      {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl flex items-start gap-2.5 text-xs text-text-muted font-mono">
                  <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p>L'authenticité des preuves et des sceaux de validation est vérifiée directement par le registre cryptographique.</p>
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-surface-section rounded-2xl border border-surface-border">
                <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <svg className="w-40 h-40 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" rx="3" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" />

                    <rect x="65" y="10" width="25" height="25" rx="3" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" />

                    <rect x="10" y="65" width="25" height="25" rx="3" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" />

                    <rect x="42" y="15" width="8" height="20" />
                    <rect x="42" y="42" width="16" height="16" />
                    <rect x="65" y="42" width="20" height="8" />
                    <rect x="42" y="65" width="8" height="20" />
                    <rect x="65" y="65" width="20" height="20" />
                  </svg>
                </div>
                <div className="text-center space-y-1 font-mono">
                  <p className="text-xs font-bold text-text">Scannez pour ouvrir l'Identité de Preuve</p>
                  <p className="text-[10px] text-text-muted">Idéal pour vos supports imprimés, cartes de visite et présentations</p>
                </div>
              </div>
            )}

            {activeTab === 'embed' && (
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Intégrez un badge dynamique attestant de vos réalisations vérifiées directement dans votre site web personnel ou votre portfolio.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block">
                    Code d'intégration (HTML / IFrame)
                  </label>
                  <div className="relative">
                    <textarea 
                      readOnly
                      rows={3}
                      value={embedSnippet} 
                      className="w-full bg-surface-section border border-surface-border rounded-xl p-3 text-xs font-mono text-emerald-500 outline-none resize-none"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-surface-hover text-text font-mono text-xs rounded-lg flex items-center gap-1 border border-surface-border transition-colors"
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode ? 'Copié' : 'Copier le code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-surface-section border-t border-surface-border flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted flex items-center gap-1">
              <Lock size={12} />
              Souveraineté totale de vos données
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-hover text-text font-bold rounded-xl transition-colors border border-surface-border"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

