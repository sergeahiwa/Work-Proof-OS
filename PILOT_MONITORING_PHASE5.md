# PILOT MONITORING SYSTEM — PHASE 5 TERRAIN RÉEL
## Tableau de Bord de Gouvernance & Observabilité Produit — Work Proof OS v1.6

**Date d'activation :** 05 Août 2026  
**Auteur / Rôle :** Agent Gouvernance Produit & Observabilité Terrain  
**Statut Global du Pilote :** 🟢 `REAL_FIELD_COLLECTION_ACTIVE`  
**Documents de Référence (SSOT) :**
- `/VISION_PRODUIT_CANONIQUE_WORK_PROOF_OS_v1.0.md`
- `/CAHIER_DES_CHARGES_CANONIQUE_WORK_PROOF_OS_v1.0.md`
- `/DECISION_LOG_WORK_PROOF_OS.md`
- `/DATA_PROVENANCE_STANDARD.md`
- `/FIELD_DATA_REGISTRY_PHASE5.md`
- `/PILOT_PROTOCOL_REAL_FIELD_PHASE5.md`
- `/FEEDBACK_OS/`

---

## 1. Informations de la Campagne Active

| Paramètre | Valeur Officielle / Statut |
|---|---|
| **Identifiant Campagne** | `CAMP-PHASE5-REAL-FIELD-01` |
| **Date de Début (J0)** | 05 Août 2026 (00:00 UTC) |
| **Durée Prévue** | 21 Jours calendaires (Fin prévue : 26 Août 2026) |
| **Cohorte Cible** | 30 à 40 participants externes réels (Professionnels en poste, indépendants, vérificateurs) |
| **Statut Actuel** | 🟢 `PILOT_RUNNING_REAL_FIELD_DATA_COLLECTION` |
| **Décision Autorisation** | `DECISION-PHASE5-COHORTE-RECRUITMENT-APPROVAL` |
| **Responsables Validation** | Product Manager (Maîtrise d'Ouvrage) & Agent Gouvernance Produit |

---

## 2. Cadence d'Observation & Checkpoints Officiels

### Checkpoint J+1 — Activation Initiale (06 Août 2026)
* **Objectif :** Valider l'accès technique et l'amorce des premiers parcours sans assistance.
* **Contrôles à effectuer :**
  - Validation de la délivrabilité des invitations et onboarding autonome.
  - Vérification de l'absence d'erreurs I/O système dans les logs techniques.
  - Détection des premiers accès anonymisés et premières créations de preuves.
  - Saisie des éventuels premiers signaux entrants dans `/FEEDBACK_OS/FEEDBACK_REGISTRY.md`.

### Checkpoint J+7 — Première Analyse Intermédiaire (12 Août 2026)
* **Objectif :** Mesurer le taux d'activation initiale et la compréhension globale du concept *Proof First*.
* **Contrôles à effectuer :**
  - Calcul du Taux d'Activation Utile (utilisateurs ayant publié au moins 1 preuve).
  - Évaluation de la compréhension de la structure STAR (Situation, Task, Action, Result).
  - Analyse qualitative des frictions remontées via le Feedback OS (Catégories `UX_FRICTION` et `VALUE_CONFUSION`).
  - Revue d'étape intermédiaire du registre `/FIELD_DATA_REGISTRY_PHASE5.md`.

### Checkpoint J+14 — Analyse de Progression & Validation (19 Août 2026)
* **Objectif :** Observer la récurrence d'usage, la boucle de validation humaine et la crédibilité des transactions.
* **Contrôles à effectuer :**
  - Taux de complétude du cycle de preuve (Création → Demande de validation → Réponse du validateur).
  - Analyse du délai moyen de validation humaine par les pairs/superviseurs.
  - Vérification de l'intégrité du calcul du score de crédibilité transactionnel.
  - Traitement des retours stratégiques et signaux de confiance (`TRUST_ISSUE`).

### Checkpoint J+21 — Clôture du Pilote & Recommandations (26 Août 2026)
* **Objectif :** Arrêt de la fenêtre d'observation, consolidation des données et orientation Phase 6.
* **Contrôles à effectuer :**
  - Bilan exhaustif du registre `REAL_FIELD_DATA`.
  - Rapport final d'apprentissage produit et d'adoption par la cohorte.
  - Clôture et archivage des feedbacks de la campagne dans `/FEEDBACK_OS/`.
  - Formulations des recommandations d'industrialisation pour la Phase 6.

---

## 3. Matrice des Métriques Terrain Réelles

*(Remarque de gouvernance : Les valeurs ci-dessous sont au statut `IN_PROGRESS` pour la fenêtre de 21 jours. La baseline actuelle est strictement fixée à `0` conformément à l'état de démarrage).*

### A. Catégorie : Usage & Adoption
| Nom Métrique | Définition Factuelle | Source Technique | Provenance DATA | Statut / Valeur | Responsable Validation |
|---|---|---|---|---|---|
| **`MTR-USE-01` Utilisateurs Actifs** | Nombre de participants externes réels ayant effectué au moins une session. | Télémétrie anonymisée | `REAL_FIELD_DATA` | `0` (En cours) | Product Manager |
| **`MTR-USE-02` Preuves Créées** | Nombre total de preuves STAR rédigées en brouillon ou soumises. | Base transactionnelle | `REAL_FIELD_DATA` | `0` (En cours) | Product Manager |
| **`MTR-USE-03` Preuves Publiées** | Nombre de preuves ancrées et publiées sur le profil souverain. | Registre des preuves | `REAL_FIELD_DATA` | `0` (En cours) | Product Manager |
| **`MTR-USE-04` Preuves Validées** | Nombre de preuves ayant reçu une attestation confirmée par un validateur humain. | Moteur de validation | `REAL_FIELD_DATA` | `0` (En cours) | Product Manager |

### B. Catégorie : Compréhension Produit
| Nom Métrique | Définition Factuelle | Source Technique | Provenance DATA | Statut / Valeur | Responsable Validation |
|---|---|---|---|---|---|
| **`MTR-UND-01` Ratio Proof > Claims** | Proportion de réalisations appuyées par au moins une preuve factuelle vérifiable. | Calculateur d'index | `REAL_FIELD_DATA` | `N/A` (En cours) | Product Manager |
| **`MTR-UND-02` Compréhension Non-Scoring IA** | Taux d'absence de demande de notation/ranking IA dans les retours qualitatifs. | Feedback OS (`VALUE_CONFUSION`) | `REAL_FIELD_DATA` | `N/A` (En cours) | Product Manager |
| **`MTR-UND-03` Lisibilité Credibility Score** | Clarté perçue de la décomposition transactionnelle du score de crédibilité. | Questionnaires de sortie | `REAL_FIELD_DATA` | `N/A` (En cours) | Product Manager |

### C. Catégorie : Frictions & Blocages
| Nom Métrique | Définition Factuelle | Source Technique | Provenance DATA | Statut / Valeur | Responsable Validation |
|---|---|---|---|---|---|
| **`MTR-FRC-01` Taux d'Abandon STAR** | Proportion d'utilisateurs abandonnant la rédaction avant la saisie des 4 blocs. | Télémétrie d'I/O | `REAL_FIELD_DATA` | `0%` (En cours) | Agent QA / UX |
| **`MTR-FRC-02` Friction de Validation** | Proportion de demandes de validation expirées sans réponse du tiers après 7 jours. | Horodatage transactionnel | `REAL_FIELD_DATA` | `0%` (En cours) | Agent QA / UX |
| **`MTR-FRC-03` Demandes de Support** | Nombre d'anomalies techniques ou d'appels à l'aide enregistrés. | Feedback OS (`BUG`/`UX_FRICTION`) | `REAL_FIELD_DATA` | `0` (En cours) | Support Produit |

### D. Catégorie : Feedbacks Qualitative
| Nom Métrique | Définition Factuelle | Source Technique | Provenance DATA | Statut / Valeur | Responsable Validation |
|---|---|---|---|---|---|
| **`MTR-FBK-01` Volume Feedbacks Reçus** | Nombre d'observations qualifiées entrées dans le Feedback OS. | `/FEEDBACK_OS/FEEDBACK_REGISTRY.md` | `REAL_FIELD_DATA` | `0` (En cours) | Agent Gouvernance |
| **`MTR-FBK-02` Distribution Signal Strength** | Ventilation des retours selon les 4 niveaux (`LOW` à `CRITICAL`). | `/FEEDBACK_OS/FEEDBACK_SIGNAL_STRENGTH.md` | `REAL_FIELD_DATA` | `N/A` (En cours) | Agent Gouvernance |

---

## 4. Control de Qualité & Provenance des Données (Data Quality Control)

> **RÈGLE ABSOLUE DE GOUVERNANCE :**  
> Aucune métrique ou observation ne peut être utilisée dans une décision du Product Manager sans comporter son étiquette de provenance explicite conformément au `/DATA_PROVENANCE_STANDARD.md`.

### Classification Stricte
1. **`REAL_FIELD_DATA` :** Exclusivement issues de la cohorte externe réelle pendant la fenêtre officielle.
2. **`CONTROLLED_TEST_DATA` :** Issues des sessions d'évaluation UX guidées avec évaluateurs internes.
3. **`SIMULATION_DATA` :** Issues des bancs d'essai automatisés et tests de charge technique.
4. **`SYNTHETIC_DATA` :** Données de démonstration et maquettage UI (`seed.ts`).

**Interdiction Stricte :** Il est **strictement interdit de fusionner, moyenner ou masquer** la frontière entre ces 4 catégories. Seules les `REAL_FIELD_DATA` constituent le bilan officiel d'adoption de la Phase 5.

---

## 5. Intégration du Feedback OS dans le Suivi Terrain

Chaque observation captée durant la campagne est immédiatement injectée dans la chaîne déterministe du Feedback OS :

```text
[ Observation Terrain ]
         │
         ▼
[ REAL_FIELD_DATA ] (Vérification de la provenance)
         │
         ▼
[ Feedback ID ] (Attribution unique au FEEDBACK_REGISTRY.md)
         │
         ▼
[ FEEDBACK_LIFECYCLE ] (Machine d'état à 8 états : NEW -> TRIAGED -> ANALYZED...)
         │
         ▼
[ Decision Log ] (Arbitrage PM consigné dans DECISION_LOG_WORK_PROOF_OS.md)
         │
         ▼
[ Roadmap ] (Raccordement à 7 maillons via FEEDBACK_ROADMAP_LINK.md)
         │
         ▼
[ Implémentation & Verification ] (Mise en œuvre et clôture)
```

**Références Canoniques :**
- Machine d'état : `/FEEDBACK_OS/FEEDBACK_LIFECYCLE.md`
- Liaisons Roadmap : `/FEEDBACK_OS/FEEDBACK_ROADMAP_LINK.md`
- Force du Signal : `/FEEDBACK_OS/FEEDBACK_SIGNAL_STRENGTH.md`

---

## 6. Registre des Risques Actifs du Pilote (Active Pilot Risks)

| Risque Identifié | Signal Observé / Indicateur | Impact Produit / Invariants | Décision Nécessaire PM | Statut du Risque |
|---|---|---|---|---|
| **1. Confusion "CV / LinkedIn"** | Demande de fonctionnalités sociales (Likes, Commentaires public, Followers). | Risque d'altération de l'invariant `PROOF_FIRST`. | Réaffirmation du positionnement par micro-copy sans modification du Core. | 🟡 SOUS SURVEILLANCE |
| **2. Complaisance de Validation** | Validation quasi-immédiate sans examen du contenu factuel. | Risque sur la crédibilité du score transactionnel (`CREDIBILITY_TRANSACTIONAL`). | Renforcement des avertissements de responsabilité lors de la signature. | 🟡 SOUS SURVEILLANCE |
| **3. Attente Excessif de Scoring IA** | Demande de notation automatique ou de résumé d'aptitudes par l'IA. | Atteinte directe à l'invariant `AI_NO_SCORING`. | Rejet motivé explicite via le Feedback OS (`VALUE_CONFUSION`). | 🟢 MAÎTRISÉ (Gouvernance) |
| **4. Faible Activation Initiale** | Nombre de preuves créées < 2 par participant à J+7. | Retard sur la collecte des métriques d'adoption terrain. | Relance passive d'onboarding sans incitation artificielle. | 🟡 SOUS SURVEILLANCE |
| **5. Expiration des Demandes** | Taux d'abandon de validation > 40% à J+14. | Friction sur l'obtention du statut de preuve vérifiée. | Ajustement des relances passives au validateur. | 🟡 SOUS SURVEILLANCE |

---

## 7. Règles Strictes d'Invariance Pendant le Pilote

Pendant toute la durée d'exécution du pilote terrain réel (`CAMP-PHASE5-REAL-FIELD-01`), les directives d'invariance suivantes sont formellement appliquées :

1. **Aucune modification du Core Engine :** Le moteur transactionnel de preuve reste fige.
2. **Aucune modification du RIL :** La couche d'isolation reste hermétique.
3. **Aucune modification du Credibility Engine :** L'algorithme de crédibilité transactionnelle reste invariant.
4. **Interdiction de fonctionnalités sociales :** Aucun fil d'actualité, like, ni compteur public.
5. **Interdiction de scoring IA :** L'IA demeure un assistant rédactionnel consultatif (`AI_OUTPUT_ADVISORY_ONLY`).
6. **Interdiction de génération artificielle :** Aucun utilisateur fictif, ni fausse métrique créée.

Toute proposition d'évolution technique ou ergonomique formulée pendant le pilote **doit impérativement emprunter le canal formel** : `Feedback OS` → `Decision Log` → `Roadmap`.
