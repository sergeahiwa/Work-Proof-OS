import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './FirebaseProvider';
import { Check, X, MessageSquare, Shield, Clock, AlertCircle, Loader2, Upload, Search, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { verifyProofJSON, verifyProofIntegrity } from '../services/verificationService';

export const VerificationModule: React.FC = () => {
  const { user } = useAuth();
  const [pendingProofs, setPendingProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Inspector state
  const [jsonInput, setJsonInput] = useState('');
  const [inspectionResult, setInspectionResult] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'verification_queue'), where('status', '==', 'en_verification'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingProofs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.warn("Firestore verification_queue listener notice:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleVerify = async (proof: any, status: 'preuve_verifiee' | 'rejetee') => {
    if (!user) return;
    setProcessingId(proof.id);
    
    try {
      await updateDoc(doc(db, 'verification_queue', proof.id), {
        status,
        verifierId: user.uid,
        verifierComment: comment,
        verifiedAt: serverTimestamp()
      });

      await updateDoc(doc(db, `users/${proof.userId}/proofs/${proof.proofId}`), {
        status,
        verified: status === 'preuve_verifiee',
        verifierId: user.uid,
        verificationComment: comment,
        updatedAt: serverTimestamp()
      });

      setComment('');
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleInspectJson = () => {
    if (!jsonInput.trim()) return;
    const res = verifyProofJSON(jsonInput);
    setInspectionResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setJsonInput(content);
      const res = verifyProofJSON(content);
      setInspectionResult(res);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-text">Vérification & Intégrité</h2>
          <p className="text-xs text-text-muted font-medium">Audit de file de preuve et inspection cryptographique d'archives souvraines.</p>
        </div>
        <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} />
          {pendingProofs.length} en attente
        </div>
      </div>

      {/* Live Cryptographic File / JSON Inspector */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-surface-border pb-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Search size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-text">Inspecteur d'Intégrité de Preuve</h3>
            <p className="text-[11px] text-text-muted">Glissez une archive JSON de preuve ou collez sa structure pour vérifier son ancrage.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <textarea
              rows={4}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Collez ici le contenu d'un fichier JSON de preuve..."
              className="w-full p-3 text-xs font-mono bg-surface-section border border-surface-border rounded-xl text-text placeholder:text-text-dim outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleInspectJson}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Search size={14} /> Inspecter JSON
              </button>
              <label className="flex-1 py-2 bg-surface-section hover:bg-surface-hover text-text border border-surface-border font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Upload size={14} /> Charger Fichier
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-surface-section border border-surface-border rounded-xl p-4 space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Résultat d'inspection</div>
            {inspectionResult ? (
              inspectionResult.isValid ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                    <CheckCircle size={16} /> JSON Valide ({inspectionResult.verifiedCount} preuves vérifiées)
                  </div>
                  <div className="text-[11px] text-text-muted font-mono space-y-1 bg-surface p-3 rounded-lg border border-surface-border">
                    <div>Titulaire : <span className="text-text font-bold">{inspectionResult.data?.sovereignOwner}</span></div>
                    <div>Exporté le : {new Date(inspectionResult.data?.exportedAt).toLocaleString('fr-FR')}</div>
                    <div>Schema : {inspectionResult.data?.$schema}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  <AlertTriangle size={16} /> {inspectionResult.error}
                </div>
              )
            ) : (
              <div className="text-xs text-text-muted italic">Aucun document chargé. Sélectionnez un fichier pour vérifier son sceau.</div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-text">Demandes de Vérification</h3>
        <AnimatePresence mode="popLayout">
          {pendingProofs.map((proof) => (
            <motion.div
              key={proof.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface-section rounded-lg">
                      <Shield className="text-text-muted" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text">{proof.title}</h4>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Déclaré par {proof.userName || 'Utilisateur'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-section border border-surface-border p-4 rounded-xl">
                    <div>
                      <p className="text-[8px] font-black uppercase text-text-muted mb-1">Action</p>
                      <p className="text-xs font-medium text-text">{proof.action}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-text-muted mb-1">Résultat</p>
                      <p className="text-xs font-medium text-text">{proof.result}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase text-text-muted">Lien Causal</p>
                    <p className="text-xs text-text-muted italic leading-relaxed">"{proof.causality}"</p>
                  </div>
                </div>

                <div className="md:w-64 space-y-4 border-t md:border-t-0 md:border-l border-surface-border pt-4 md:pt-0 md:pl-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                      <MessageSquare size={12} />
                      Commentaire (Optionnel)
                    </label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Pourquoi valides-tu ou rejettes-tu cette preuve ?"
                      className="w-full h-24 p-3 text-xs bg-surface-section border border-surface-border rounded-xl focus:outline-none focus:border-blue-500 resize-none text-text placeholder:text-text-dim"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(proof, 'preuve_verifiee')}
                      disabled={!!processingId}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors disabled:opacity-50"
                    >
                      {processingId === proof.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                      Valider
                    </button>
                    <button
                      onClick={() => handleVerify(proof, 'rejetee')}
                      disabled={!!processingId}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                    >
                      {processingId === proof.id ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {pendingProofs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-surface rounded-3xl border-2 border-dashed border-surface-border">
            <div className="p-4 bg-surface-section rounded-full text-text-muted shadow-sm border border-surface-border">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text uppercase tracking-widest">Aucune preuve en attente</p>
              <p className="text-xs text-text-muted">Toutes les déclarations ont été traitées.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

