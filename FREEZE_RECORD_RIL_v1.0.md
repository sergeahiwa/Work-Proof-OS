# FREEZE RECORD — REALITY INTELLIGENCE LAYER (RIL v1.0)
**WORK PROOF OS v1.6**
**Date de gel :** 05 Août 2026  
**Auteur :** IA-FIRST Agent sous supervision Product Owner  
**Statut :** 🔒 BLOC GELÉ - SSOT OFFICIEL  
**Protocole de gouvernance :** `IA-FIRST_EXECUTION_PROOF_PROTOCOL.md` (EPP v1.0)

---

## 1. Identité du Bloc Gelé
- **Système :** WORK PROOF OS
- **Version globale :** v1.6
- **Module :** Reality Intelligence Layer (RIL v1.0)
- **Bounded Context :** Isolated AI Intelligence & Assistive Engine (`/src/services/intelligence/`, `/src/components/intelligence/`)

---

## 2. Périmètre Technique Exact Gelé

### Services Back-End & Moteur d'Intelligence (`/src/services/intelligence/`)
1. `types.ts` (65 lignes) - Définitions strictes des signaux, suggestions STAR, trajectoires et analyses de biais.
2. `realitySignalService.ts` (155 lignes) - Capture passive de signaux, parsing local (regex) et extraction IA (Gemini).
3. `proofDiscoveryService.ts` (194 lignes) - Moteur de découverte de preuves STAR, conversion de signaux et limitation max 3 suggestions.
4. `evolutionRadarService.ts` (61 lignes) - Radar de vélocité temporelle des compétences sans altération de crédibilité.
5. `biasShieldService.ts` (80 lignes) - Détection des tournures d'auto-dévaluation et suggestions de reformulation active.
6. `index.ts` (5 lignes) - Module Barrel Export.

### Composants Interface Utilisateur (`/src/components/intelligence/`)
1. `ProofSuggestionsCard.tsx` (267 lignes) - Carte d'interaction suggestion/saisie signal et conversion vers `CreateProofModule`.
2. `EvolutionRadarPanel.tsx` (111 lignes) - Visualisation de trajectoires de compétences.
3. `BiasShieldPanel.tsx` (101 lignes) - Analyseur et reformulateur de texte à fort impact.
4. `RILOverviewPanel.tsx` (91 lignes) - Onglet conteneur RIL intégré dans le Dashboard principal.

### Intégration Pages & Formulaires
1. `src/pages/Dashboard.tsx` - Emplacement RILOverviewPanel sous les KPIs globaux.
2. `src/components/CreateProofModule.tsx` - Réception des brouillons STAR via `location.state` pour pré-remplissage.

### Règles de Sécurité Firestore (`firestore.rules`)
- Match `/reality_signals/{signalId}` - Isolation stricte par UID propriétaire (`request.auth.uid == resource.data.userId`).
- Match `/proof_suggestions/{suggestionId}` - Isolation stricte par UID propriétaire (`request.auth.uid == resource.data.userId`).

---

## 3. Invariants Système Protégés (Strictly Enforced)

| Invariant | Description & Garantie Code |
|---|---|
| `AI_NO_SCORING` | RIL ne calcule aucun score, ne note pas les utilisateurs et n'attribue aucune métrique de réputation. |
| `AI_OUTPUT = ADVISORY_ONLY` | Toutes les sorties RIL sont des suggestions et avis (`status: 'pending'`). Seul l'utilisateur peut les transformer en preuve. |
| `CREDIBILITY_TRANSACTIONAL` | Le Credibility Score repose à 100% sur le Core transactionnel (`proofService.ts`, `credibilityService.ts`). RIL a un impact score de 0. |
| `COLLUSION_PASSIVE` | RIL ne valide aucune preuve et ne remplace aucun relecteur/pair humain. |

---

## 4. Statut du Core Gelé (WORK PROOF OS v1.5)

Les fichiers Core suivants sont certifiés **100% INTACTS** et sans aucune dépendance envers RIL :
- `src/services/proofService.ts` (429 lignes) : 0 modification, 0 import RIL.
- `src/services/credibilityService.ts` (320 lignes) : 0 modification, 0 import RIL.
- `src/services/collusionService.ts` (104 lignes) : 0 modification, 0 import RIL.

---

## 5. Règles de Modification Future (Change Control)

Toute modification future sur le module RIL v1.0 ou son périmètre doit obligatoirement :
1. Être précédée d'un avenant explicite dans `REALITY_INTELLIGENCE_SPEC.md` ;
2. Déclencher un nouveau cycle de gouvernance IA-FIRST EPP ;
3. Conserver l'étanchéité absolue avec le Core transactionnel ;
4. Exécuter `npx tsx scripts/contract/verify-contract.ts` et `npm run build` avec statut 100% vert ;
5. Obtenir une nouvelle signature de dégel/gel dans le registre des versions.
