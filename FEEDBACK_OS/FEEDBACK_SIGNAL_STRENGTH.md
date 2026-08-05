# FEEDBACK SIGNAL STRENGTH — WORK PROOF OS
## Doctrine & Matrice de Mesure de la Force du Signal Produit

**Version :** 1.0  
**Statut :** Spécification de Triage / Gouvernance  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/FEEDBACK_OS/FEEDBACK_TRIAGE_RULES.md`
- `/DATA_PROVENANCE_STANDARD.md`

---

## 1. Doctrine Absolue de Mesure

> **RÈGLE FONDAMENTALE DE GOUVERNANCE :**  
> Le **Feedback Signal Strength** mesure **UNIQUEMENT** :  
> **LA FORCE DU SIGNAL PRODUIT** (l'impact factuel, la répétabilité et l'enjeu d'architecture).  
>   
> Et ne mesure **JAMAIS** :  
> **LA VALEUR D'UNE PERSONNE** (ni le statut social, la fonction, la réputation ou le niveau hiérarchique de l'émetteur).

Work Proof OS est fondé sur l'objectivité factuelle (*Proof First*). En cohérence avec la philosophie du produit qui refuse le scoring ou le ranking d'individus, la qualification du signal ne dépend aucunement de la personne qui l'exprime, mais de la matérialité objective du fait observé.

---

## 2. Niveaux de Signal Canoniques

Le Feedback Signal Strength est évalué selon 4 niveaux stricts :

### 1. `LOW_SIGNAL`
* **Définition :** Remarque isolée, préférence esthétique personnelle ou observation sans impact sur l'intégrité transactionnelle ou les parcours principaux.
* **Traitement :** Archivage informatif ou classement en veille cosmétique.

### 2. `MEDIUM_SIGNAL`
* **Définition :** Friction UX observée à plusieurs reprises, hésitation de compréhension sur le vocabulaire STAR, ou suggestion d'ergonomie pertinente sans remise en cause des invariants.
* **Traitement :** Inscription en backlog pour analyse lors des sprints d'amélioration continue.

### 3. `HIGH_SIGNAL`
* **Définition :** Friction systémique constatée chez plusieurs utilisateurs réels (`REAL_FIELD_DATA`), incompréhension récurrente de la proposition de valeur (*Proof > Claim*), ou problème de lisibilité impactant la validation par les tiers.
* **Traitement :** Soumission prioritaire à l'analyse du Product Manager (`DECISION_PENDING`).

### 4. `CRITICAL_SIGNAL`
* **Définition :** Signalement d'une brèche de sécurité, d'une rupture d'isolation entre le Core et le RIL, d'une tentative d'introduction de scoring IA, ou d'un blocage absolu empêchant la création ou la validation d'une preuve factuelle.
* **Traitement :** Mobilisation immédiate d'urgence (P0) et arrêt des déploiements si nécessaire.

---

## 3. Critères Canoniques d'Évaluation de la Force du Signal

La détermination du niveau de signal s'appuie sur la matrice pondérée des 5 critères objectifs suivants :

| Critère | Description / Indicateur Factuel | Impact sur le Signal |
|---|---|---|
| **1. Provenance des Données** | Niveau de certification selon `/DATA_PROVENANCE_STANDARD.md` | `REAL_FIELD_DATA` (+3) > `CONTROLLED_TEST_DATA` (+2) > `SIMULATION_DATA` (+1) |
| **2. Répétition & Fréquence** | Nombre d'occurrences indépendantes constatées du même fait | Observation unique (+1) < Récurrente (+2) < Systémique (+3) |
| **3. Observation Comportementale** | Fait mesuré (abandon, blocage, délai) vs opinion déclarative | Blocage/Abandon mesuré (+3) > Opinion/Souhait verbal (+1) |
| **4. Impact Produit & UX** | Gravité de la friction sur le parcours utilisateur principal | Bloquant (+3) > Gêne majeure (+2) > Inconfort mineur (+1) |
| **5. Impact sur les Invariants** | Atteinte ou risque direct sur l'un des 7 Invariants Canoniques | Risque sur un Invariant (+3) > Alignement Invariant (+0) |

---

## 4. Matrice de Calcul de la Force du Signal

$$\text{Score de Signal} = \text{Score Provenance} + \text{Score Fréquence} + \text{Score Comportement} + \text{Score Impact UX} + \text{Score Invariant}$$

* **Score Total 05 - 07 :** `LOW_SIGNAL`
* **Score Total 08 - 10 :** `MEDIUM_SIGNAL`
* **Score Total 11 - 13 :** `HIGH_SIGNAL`
* **Score Total 14 - 15 (ou tout risque Invariant/Sécurité) :** `CRITICAL_SIGNAL`
