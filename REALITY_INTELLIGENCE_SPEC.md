# REALITY INTELLIGENCE LAYER SPECIFICATION (RIL v1.0)
**System Version Target:** WORK PROOF OS v1.6  
**Status:** ARCHITECTURAL SPECIFICATION — FROZEN CORE COMPLIANT  
**Author:** System & Product Architect  
**Invariants:** `AI_NO_SCORING`, `CREDIBILITY_TRANSACTIONAL`, `COLLUSION_PASSIVE`, `AI_OUTPUT = ADVISORY_ONLY`

---

## 1. Vision
La Reality Intelligence Layer (RIL) est la couche d'intelligence ambiante de Work Proof OS. Elle permet à l'utilisateur de capturer proactivement et de révéler ses réalisations brutes à partir de signaux d'activité diffus sans effort manuel excessif, tout en maintenant un contrôle humain absolu sur la transformation de ces signaux en preuves certifiables.

## 2. Mission
Fournir un moteur passif et assisté ("Human Assisted Intelligence") capable d'extraire des opportunités de preuves, de détecter des trajectoires d'évolutions professionnelles et de neutraliser les biais cognitifs dans la formulation des réalisations, sans jamais court-circuiter le registre de vérité ni le système de crédibilité transactionnel.

## 3. Objectifs
- **Proactivité :** Réduire la friction temporelle d'ancrage en identifiant les réalisations suggérées en < 30 secondes.
- **Assistance Augmentée :** Structurer les déclarations brutes (contexte, action, impact, compétences émergentes).
- **Inertie Zéro sur le Core :** Fonctionner comme une couche périphérique asynchrone ("Bounded Context") consommant les signaux d'activité sans dépendance inverse vers le Core.
- **Révélation de Compétences Émergentes :** Identifier les compétences sous-jacentes à travers les signaux croisés.

## 4. Non-objectifs
- **PAS de notation automatique :** Aucune IA ne peut générer ou modifier le Credibility Score ou le Market Trust Index (`AI_NO_SCORING`).
- **PAS d'auto-ancrage :** Aucun signal ne devient automatiquement une preuve certifiée sans action explicite et intentionnelle de l'utilisateur.
- **PAS de ranking ou classement social :** Pas de comparaison algorithmique inter-utilisateurs.
- **PAS d'altération des collections Core :** Aucune mutation directe sur `/users/{uid}/proofs/` depuis la couche RIL.

## 5. Positionnement Architectural
RIL se positionne au-dessus des flux d'entrées utilisateur et des intégrations d'activités ("Activity Inputs"), en amont du système de Preuves ("Proof System") et du Moteur de Crédibilité ("Credibility Engine").

```
[ ACTIVITÉ & ENTRÉES BRUTES ]
              │
              ▼
┌─────────────────────────────────────────┐
│     REALITY INTELLIGENCE LAYER (RIL)    │
│  - Reality Signal Engine                │
│  - Proof Discovery Service              │
│  - Evolution Radar Service              │
│  - Bias Shield Service                  │
└────────────────────┬────────────────────┘
                     │ (Suggestions / Visualisations)
                     ▼
             [ DÉCISION UTILISATEUR ]
                     │ (Validation explicite)
                     ▼
┌─────────────────────────────────────────┐
│           PROOF SYSTEM (CORE)           │
│  - proofService.ts (Structuring/STAR)   │
└────────────────────┬────────────────────┘
                     │ (Validations pairs)
                     ▼
┌─────────────────────────────────────────┐
│        CREDIBILITY LAYER (CORE)         │
│  - credibilityService.ts                │
│  - collusionService.ts                  │
└─────────────────────────────────────────┘
```

## 6. Relation avec Core v1.5
Le Core v1.5.0 (`proofService.ts`, `credibilityService.ts`, `collusionService.ts`) est rigoureusement gelé. 
- RIL lit les états du Core en lecture seule si nécessaire (ex: éviter de suggérer des doublons).
- Le Core ignore totalement l'existence de RIL.
- Si la couche RIL tombe en panne ou est désactivée, Work Proof OS v1.5 reste 100% fonctionnel sans la moindre dégradation.

## 7. Bounded Context (Isolation de Code)
Tout le code RIL résidera dans son propre espace de noms :
```
src/
  services/
    intelligence/
      ├── realitySignalService.ts    # Capture et normalisation des signaux d'activité
      ├── proofDiscoveryService.ts   # Génération de suggestions de preuves
      ├── evolutionRadarService.ts   # Analyse des trajectoires et compétences émergentes
      └── biasShieldService.ts       # Détection des auto-dévaluations / termes vagues
```

## 8. Modèles de Données (Isolés)

### Collection : `reality_signals`
```typescript
export interface RealitySignal {
  id: string;
  userId: string;
  type: 'activity' | 'evolution' | 'behavior' | 'skill_emergence';
  source: 'user_input' | 'integration' | 'analysis';
  payload: {
    rawText?: string;
    context?: string;
    metricsDetected?: string[];
    actionVerbsDetected?: string[];
    skillsExtracted?: string[];
  };
  confidence: number; // [0-1] Confiance dans la détection du signal
  createdAt: any;
}
```

### Collection : `proof_suggestions`
```typescript
export interface ProofSuggestion {
  id: string;
  userId: string;
  signalIds: string[];
  suggestedSkill: string;
  suggestedProofType: string;
  draftProof: {
    before: string;
    action: string;
    result: string;
    causality: string;
  };
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected' | 'dismissed';
  createdAt: any;
  updatedAt: any;
}
```

## 9. Services RIL & Spécifications Métier
1. **`realitySignalService`** :
   - Extrait les verbes d'action, chiffres, contextes depuis les notes brutes, comptes-rendus ou historiques.
   - Ne crée aucun impact sur le profil public.
2. **`proofDiscoveryService`** :
   - Assemble les signaux en brouillons réutilisables (STAR).
   - Présente les suggestions dans l'UI avec l'action unique : "Créer la Preuve" ou "Ignorer".
3. **`evolutionRadarService`** :
   - Calcule la vélocité d'acquisition de compétences sur une échelle temporelle (Timeline).
   - Sert d'outil de visualisation personnelle (Advisory).
4. **`biasShieldService`** :
   - Identifie le langage d'auto-dévaluation (ex: "j'ai juste aidé", "petit projet") et propose une formulation à plus fort impact.

## 10. Flux Utilisateur (Human Assisted Intelligence)
1. **Intention / Note Brute :** L'utilisateur saisit une déclaration informelle ou soumet un résumé de projet.
2. **Analyse RIL Passive :** RIL génère un `RealitySignal` et une `ProofSuggestion`.
3. **Revue Utilisateur (Aha Moment) :** L'utilisateur consulte sa carte "Suggestion de Preuve".
4. **Validation et Soumission :** Si l'utilisateur clique sur "Accepter et Finaliser", le formulaire standard de `CreateProof` est pré-rempli. L'utilisateur valide manuellement.
5. **Ancrage Core :** La preuve entre dans le cycle v1.5 standard (STAR, validation par les pairs, Sceaux).

## 11. Contrat IA (`AI_OUTPUT = ADVISORY_ONLY`)
- L'IA n'émet que des avis, résumés et structures indicatives.
- Tout output IA doit porter la mention "Suggestion générée par RIL - Nécessite votre validation".
- Aucune donnée IA ne peut être directement injectée dans les métriques de fiabilité du marché.

## 12. Sécurité & Firestore Rules
- Isolation stricte des collections :
  - `match /reality_signals/{signalId}` : Read/Write réservé exclusivement à l'utilisateur propriétaire (`request.auth.uid == resource.data.userId`).
  - `match /proof_suggestions/{suggestionId}` : Read/Write réservé au propriétaire.
- Les validateurs pairs et les recruteurs n'ont AUCUN accès en lecture aux signaux bruts ou aux suggestions rejetées.

## 13. Tests d'Intégrité
- **Test d'isolation :** Supprimer le répertoire `src/services/intelligence/` doit permettre un `npm run build` et `tsc --noEmit` instantanés sans erreur.
- **Test d'invariant :** Vérifier qu'aucun appel à `addProofValidation` ou modification de `credibilityScore` n'est importé dans `src/services/intelligence/`.

## 14. Risques & Mitigation
- **Risque :** Surcharge cognitive par trop de suggestions.  
  *Mitigation :* Limite stricte de max 3 `proof_suggestions` actives en statut `pending` par utilisateur.
- **Risque :** Tentative de tromper la détection par injection de faux signaux.  
  *Mitigation :* Inutile car les signaux n'ont aucune valeur publique tant qu'ils n'ont pas subi la validation par les pairs humaine du Core.

## 15. Roadmap d'Implémentation v1.6
- **Phase 1 :** Création du bounded context `src/services/intelligence/` et des interfaces TypeScript.
- **Phase 2 :** Implémentation de `realitySignalService` et `proofDiscoveryService` en mode mock/Gemini local.
- **Phase 3 :** Intégration du composant UI `ProofSuggestionsCard` dans le Dashboard (100% opt-in).
- **Phase 4 :** Activation de `evolutionRadarService` et `biasShieldService`.

## 16. Critères d'Acceptation
- [ ] Zéro modification apportée aux fichiers `proofService.ts`, `credibilityService.ts`, `collusionService.ts`.
- [ ] État `build` et `typecheck` validés.
- [ ] Conformité 100% aux invariants `AI_NO_SCORING` et `CREDIBILITY_TRANSACTIONAL`.
