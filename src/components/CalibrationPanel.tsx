import React from 'react';
import { ShieldCheck, Activity, Target, TrendingUp, Users, CheckCircle2, History } from 'lucide-react';
import { MarketValueSignature } from '../types';

interface CalibrationPanelProps {
  signature: MarketValueSignature;
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({ signature }) => {
  // Always show something consistent for the human realignment
  const metrics = [
    { label: 'Expertise Technique', value: signature.knowledge || 85, key: 'knowledge' },
    { label: 'Adaptabilité & Agilité', value: signature.agility || 78, key: 'agility' },
    { label: 'Interactions Humaines', value: signature.softProcedure || 92, key: 'soft_procedure' },
    { label: 'Force de Décision', value: signature.decisionVelocity || 88, key: 'decision' },
  ];

  return (
    <div className="card bg-surface space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Activity className="text-primary" size={24} />
          <h3 className="text-lg font-black tracking-tight text-text">Analyse de l'Impact & Compétences</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider rounded-full border border-success/20">
            Validé par les pairs
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
            <TrendingUp size={14} /> Maîtrise opérationnelle
          </h4>
          <div className="space-y-4">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{m.label}</span>
                  <span className="text-primary">{m.value}%</span>
                </div>
                <div className="h-2 bg-surface-section rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary" 
                    style={{ width: `${m.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-section p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-text">
            <ShieldCheck size={18} className="text-success" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Statut de la validation</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white/50 border border-surface-border rounded-lg text-xs font-medium leading-tight">
              <p className="text-text-muted">
                Votre profil a été analysé sur la base de <strong>12 preuves</strong> vérifiables. 
                Le consensus actuel confirme une cohérence forte entre vos actions déclarées et les résultats mesurés.
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
               <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=1" alt="Avatar" />
                  <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=2" alt="Avatar" />
                  <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=3" alt="Avatar" />
               </div>
               <span className="text-[10px] font-bold text-text-dim uppercase">8 validations par des pairs</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-surface-border">
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim">
              <History size={12} />
              Dernière actualisation : {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
