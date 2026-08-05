# SYSTEM CONTRACT REALITY — Work Proof

Ce document définit la vérité architecturale du système Work Proof. Il fait foi pour toute modification future et sert de base à l'audit de conformité.

## 1. Philosophie du Système
Work Proof n'est PAS un système décisionnel autonome. C'est un **Producteur de Signaux** (Signal Producer) basé sur des preuves factuelles et des validations humaines.

## 2. Rôles et Responsabilités des Services

### A. Proof Service (Core Processing)
- **Rôle** : Structuration et capture des preuves d'impact.
- **Moteur Direct** : Utilise des heuristiques déterministes (verbes d'action, métriques) pour calculer la "force" initiale d'une preuve.
- **Rôle de l'IA** :
    - ✔ **Reformulation** : Amélioration lexicale sans ajout d'information.
    - ✔ **Cohérence Logique** : Vérification du lien rationnel entre Contexte -> Action -> Résultat.
    - ❌ **VALIDATION DE VÉRITÉ** : L'IA ne décide jamais si une action est vraie ou fausse.
    - ❌ **SCORING** : L'IA n'impacte pas le score de crédibilité final.

### B. Credibility Service (Scoring Engine)
- **Rôle** : Calcul du score d'impact et de fiabilité.
- **Source de Vérité** : Le score est le résultat EXCLUSIF des **validations humaines pondérées**.
- **Variables de Scoring** :
    - Poids du validateur (Pair, Manager, Client).
    - Status de la validation (Approuvé / Rejeté).
- **Invariance** : Aucune logique automatisée (IA ou Collusion) ne peut modifier directement le score de crédibilité.

### C. Collusion Service (Signal/Audit Only)
- **Rôle** : Détection de patterns de fraude (Cycles de validation, clusters d'amis).
- **Mode d'Action** : Purement **PASSIF**.
- **Outputs** :
    - ✔ **Logging d'Anomalies** : Création d'entrées dans la collection `anomalies`.
    - ✔ **Audit Trail** : Enrichissement sémantique des logs.
    - ❌ **PÉNALITÉ AUTOMATIQUE** : Ne réduit pas le score de l'utilisateur ou de la preuve en temps réel.
    - ❌ **BLOCAGE** : N'empêche aucune action utilisateur.

## 3. Contrat de Données (Types & UI)
- **Preuve (Proof)** : Entité de base contenant le récit d'impact (Avant/Action/Résultat).
- **Succès** : Terme UI privilégié pour désigner une preuve validée.
- **Fiabilité** : Traduction du `Credibility Score` (basé sur le consensus humain).
- **Impact** : Mesure de la valeur créée, ancrée par les validations.

## 4. Interdictions Architecturales (Guardrails)
1. **L'IA est interdite de décision** : Tout refus ou validation doit être traçable vers une règle déterministe ou une action humaine.
2. **Découplage Collusion/Score** : La détection de collusion doit rester un signal d'audit et ne jamais polluer le calcul du score de crédibilité.
3. **Immutabilité du Hash** : Toute preuve publiée génère un hash d'audit qui ne doit jamais être modifié.
