# P0_FREEZE_BASELINE — Work Proof Architectural Freeze

**Date du Gel :** 1er août 2026  
**Version :** v1.5.0-P0-baseline  
**Statut :** FIGÉ / PROTEGÉ  

---

## 1. Périmètre des Fichiers Protégés

Les fichiers suivants constituent le **Cœur Déterministe et Contractuel** du système Work Proof. Aucune modification de logique métier, de formule de calcul ou de pipeline décisionnel n'est autorisée sur ces fichiers dans le cadre de la remédiation P0 Staging Readiness.

1. `src/services/proofService.ts`
2. `src/services/credibilityService.ts`
3. `src/services/collusionService.ts`
4. `SYSTEM_CONTRACT_REALITY.md`
5. `scripts/contract/` (`rules.ts`, `scan-code.ts`, `verify-contract.ts`)
6. `firestore.rules`

---

## 2. Cartographie des Responsabilités par Service

### A. `proofService.ts`
- **Responsabilité :** Structuration, enrichissement sémantique et stockage des preuves de travail.
- **Rôle de l'IA :** Strictement restreint à l'analyse de cohérence sémantique, la classification et la reformulation synthétique.
- **Invariant Inviolable :** L'IA ne formule, n'attribue et n'impacte aucun score numérique.

### B. `credibilityService.ts`
- **Responsabilité :** Moteur unique de calcul et de mise à jour du score de crédibilité.
- **Source du Score :** Repose exclusivement sur les validations humaines réelles (pairs, superviseurs, réputation du réseau).
- **Invariant Inviolable :** Toute mutation de score doit être exécutée à l'intérieur d'une transaction atomique Firestore (`runTransaction`).

### C. `collusionService.ts`
- **Responsabilité :** Détection passive et journalisation des signaux d'anomalies / collusion entre comptes.
- **Rôle :** Mode audit passif.
- **Invariant Inviolable :** Ne modifie jamais directement ni indirectement le score de crédibilité.

---

## 3. Invariants de Contrat Système (`SYSTEM_CONTRACT_REALITY.md`)

- **COLLUSION_PASSIVE :** Le service de collusion analyse et enregistre des signaux sans perturber le score de crédibilité.
- **AI_NO_SCORING :** Aucun appel IA ne retourne ni n'injecte de valeur numérique dans le calcul de crédibilité.
- **CREDIBILITY_TRANSACTIONAL :** L'intégrité du score est garantie par des transactions Firestore atomiques.

---

## 4. Objectif de ce Gel

Garantir la fiabilité mathématique et contractuelle du système Work Proof lors de la phase de stabilisation P0 pour permettre le déploiement sur environnement Staging en toute sécurité.
