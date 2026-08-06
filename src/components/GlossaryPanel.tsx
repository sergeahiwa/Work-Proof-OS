import React from 'react';
import { 
  BookOpen, 
  Info, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  Activity,
  Server
} from 'lucide-react';

const GLOSSARY_ITEMS = [
  {
    term: 'DSA (Decision Signal Aggregator)',
    definition: 'Moteur de fusion qui agrège les signaux de Risque, Prédictif, KPI et Proactif en un signal de décision unique et déterministe.',
    icon: Zap,
    color: 'text-primary'
  },
  {
    term: 'ADSE (Advanced Explainability)',
    definition: 'Générateur de récits narratifs qui explique "pourquoi" un signal a été généré, en identifiant les drivers dominants.',
    icon: ShieldCheck,
    color: 'text-success'
  },
  {
    term: 'SAE (Signal Audit Engine)',
    definition: 'Système d\'audit passif vérifiant la cohérence entre les scores, la sévérité et les actions recommandées.',
    icon: Info,
    color: 'text-info'
  },
  {
    term: 'Sévérité (LOW, MEDIUM, HIGH, CRITICAL)',
    definition: 'Niveau d\'urgence du signal. CRITICAL déclenche une escalade immédiate, LOW nécessite une simple surveillance.',
    icon: AlertCircle,
    color: 'text-error'
  },
  {
    term: 'Confiance (Confidence)',
    definition: 'Score de 0 à 100% indiquant la certitude du système sur le signal produit. Une confiance basse peut indiquer un manque de données.',
    icon: TrendingUp,
    color: 'text-primary'
  },
  {
    term: 'KAIROS Handshake',
    definition: 'Protocole de communication sécurisé entre Work Proof et l\'agrégateur KAIROS, incluant des accusés de réception (ACK).',
    icon: Server,
    color: 'text-info'
  },
  {
    term: 'Stabilité du Système',
    definition: 'Indice de santé global du réseau basé sur la cohérence des preuves et l\'absence d\'anomalies majeures.',
    icon: Activity,
    color: 'text-success'
  }
];

export default function GlossaryPanel() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 border-b-4 border-primary/30 pb-4">
        <BookOpen size={32} className="text-primary" />
        <h2 className="text-4xl font-headline font-black tracking-tight uppercase">Glossaire des Signaux & Concepts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GLOSSARY_ITEMS.map((item, idx) => (
          <div key={idx} className="card p-6 bg-surface-section border-2 border-surface-border hover:border-primary/30 transition-all group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-surface-card border border-surface-border ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight text-text-main">{item.term}</h3>
                <p className="text-sm font-bold text-text-muted leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-primary/5 border-2 border-primary/20 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Info size={20} className="text-primary" />
          <h4 className="text-sm font-black uppercase tracking-widest">Note aux Opérateurs</h4>
        </div>
        <p className="text-xs font-bold text-text-main leading-relaxed">
          Work Proof est un système **déterministe**. Chaque score produit est le résultat d'une formule mathématique fixe appliquée aux preuves collectées. En cas de doute sur un signal, référez-vous au panneau **ADSE (Explainability)** pour comprendre les drivers exacts de la décision.
        </p>
      </div>
    </div>
  );
}
