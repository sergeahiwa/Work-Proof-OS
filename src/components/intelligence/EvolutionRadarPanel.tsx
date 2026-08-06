import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Layers, Award, Info } from 'lucide-react';
import { SkillTrajectory } from '../../services/intelligence/types';
import { calculateSkillTrajectories } from '../../services/intelligence/evolutionRadarService';

interface EvolutionRadarPanelProps {
  userId?: string;
}

export const EvolutionRadarPanel: React.FC<EvolutionRadarPanelProps> = ({ userId = 'demo-user' }) => {
  const [trajectories, setTrajectories] = useState<SkillTrajectory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await calculateSkillTrajectories(userId);
        setTrajectories(data);
      } catch (err) {
        console.error("Error loading RIL trajectories:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const getTrendBadge = (trend: SkillTrajectory['trend']) => {
    switch (trend) {
      case 'consolidated':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Consolidée</span>;
      case 'accelerating':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">En Accélération</span>;
      case 'emerging':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Émergente</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Radar d'Évolution RIL</h3>
            <p className="text-xs text-slate-500">Vélocité d'acquisition & trajectoires de compétences émergentes</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          Advisory Radar
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400">Calcul des trajectoires en cours...</div>
      ) : trajectories.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
          Aucun signal de compétence enregistré pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {trajectories.map((traj) => (
            <div key={traj.skill} className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{traj.skill}</span>
                  {getTrendBadge(traj.trend)}
                </div>
                <span className="text-xs font-mono font-medium text-slate-600">
                  {traj.occurrenceCount} occurence(s)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-500 ${
                    traj.trend === 'consolidated' ? 'bg-emerald-500' :
                    traj.trend === 'accelerating' ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.max(15, traj.velocityScore)}%` }}
                />
              </div>

              {/* Impact excerpts */}
              {traj.associatedImpacts.length > 0 && (
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <span className="font-medium text-slate-600">Derniers signaux associés :</span>
                  <p className="truncate text-slate-500 italic">
                    "{traj.associatedImpacts[0]}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start gap-2 text-[11px] text-indigo-900">
        <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>
          Le Radar RIL cartographie uniquement l'évolution de vos signaux bruts. Il ne modifie aucun score de crédibilité public.
        </span>
      </div>
    </div>
  );
};
