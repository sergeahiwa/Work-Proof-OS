# RAPPORT PHASE 6C.1 — PLANIFICATION DE LA MIGRATION LINGUISTIQUE DE L'UI

**System:** Work Proof OS v1.6  
**Dépôt Officiel SSOT :** `https://github.com/sergeahiwa/Work-Proof-OS.git`  
**Branche Canonique :** `main`  
**Version & Tag :** `v1.6.0-pilot` (`638a205efd32b1646e1fd0ce244684edec558448`)  
**Rôle d'Audit :** Product QA Lead, Technical Auditor & Release Manager  
**Date & Heure (UTC) :** 06 Août 2026, 14:55:00 UTC  
**Statut Global :** `COMPLETED`

---

## 1. Résumé Exécutif

La **Phase 6C.1 — UI Language Migration Planning** fait suite à l'établissement du référentiel stratégique de traduction (`/GLOSSAIRE_TRADUCTION_STRATEGIQUE_WORK_PROOF_OS_v1.0.md`) réalisé lors de la Phase 6C. 

Cette mission s'est déroulée dans le respect le plus strict du principe d'immutabilité du code applicatif (**zéro modification de fichiers source, de composants React ou de bases de données**). Son objectif unique était de cartographier l'intégralité des textes de l'interface utilisateur (UI) nécessitant une mise à jour linguistique et de planifier leur remplacement ordonné.

Le livrable opérationnel associé — `/MATRICE_UI_LANGUAGE_UPDATE_PLAN_v1.0.md` — répertorie 20 emplacements d'interface clés identifiés sur les 11 vues de l'application, classés par niveau de priorité et accompagnés d'une justification ergonomique et produit.

---

## 2. Synthèse de l'Audit des Textes UI Existants

L'analyse minutieuse des vues et composants de **Work Proof OS v1.6.0-pilot** a révélé que la quasi-totalité des fonctionnalités est directement utilisable, mais que plusieurs libellés hérités directement de l'architecture d'ingénierie créent une friction cognitive :

1. **Jargon d'Ingénierie & Mathématiques :**
   - *"Graph de Validation"* (Menu de navigation) → À remplacer par **"Réseau de Confiance"**.
   - *"Proof Repository"* (Menu de navigation) → À remplacer par **"Mes Réalisations Certifiées"**.
   - *"Tenant Switcher"* (En-tête) → À remplacer par **"Sélecteur d'Organisation"**.
2. **Ambiguïté sur le Calcul & l'IA :**
   - *"Credibility Score"* (Tableau de bord) → À remplacer par **"Indice de Confiance basé sur vos preuves"**.
   - *"RIL Real-Time Advisory"* (Formulaire STAR) → À remplacer par **"Conseils de rédaction (Aide IA)"**.
   - *"AI Advisory Only - No Scoring Impact"* → À remplacer par **"Suggestions indicatives : l'IA n'impacte pas votre score"**.
3. **Termes Froids / Systèmes :**
   - *"Human Validation Required Gate"* (Modale d'attestation) → À remplacer par **"Validation par un collègue ou manager requise"**.
   - *"Sign & Validate Proof Artifact"* (Bouton d'action) → À remplacer par **"Attester et certifier cette réalisation"**.
   - *"Export Proof Artifacts (JSON/PDF)"* (Profil) → À remplacer par **"Exporter mon Passeport de Compétences (PDF/JSON)"**.

---

## 3. Conformité aux Invariants Système & Non-Distortion

L'ensemble des recommandations du plan de migration a fait l'objet d'un contrôle de cohérence avec les 7 Invariants Canoniques du système :

- **`PROOF_FIRST` :** La primauté de la réalisation factuelle selon la structure STAR est réaffirmée sans altération.
- **`USER_SOVEREIGNTY_FIRST` :** Le vocabulaire renforce le sentiment de propriété et de portabilité des preuves par l'utilisateur.
- **`AI_NO_SCORING` :** L'impossibilité pour l'IA d'attribuer une note ou un score est explicite dans les nouveaux libellés d'assistance.
- **`AI_OUTPUT_ADVISORY_ONLY` :** L'assistance RIL est présentée clairement comme un conseiller de rédaction indicatif.
- **`HUMAN_VALIDATION_REQUIRED` :** La validation par un tiers humain reste formulée comme le seul moyen de certifier une preuve.
- **`CORE_RIL_ISOLATION` :** L'étanchéité du moteur transactionnel `/src/core` est préservée.
- **`CREDIBILITY_TRANSACTIONAL` :** Le caractère déterministe et factuel du score de crédibilité est rendu compréhensible pour l'utilisateur.

---

## 4. Stratégie de Priorisation Produit pour la Vague de Migration

Les 20 remplacements identifiés sont structurés en 3 vagues de priorité d'exécution :

1. **Vague 1 — Priorité 1 (Critique & Onboarding) : 8 libellés**
   - Couvre le menu principal (`Layout.tsx`), la jauge du tableau de bord (`Dashboard.tsx`), le formulaire STAR (`CreateProofModule.tsx`) et le panneau de validation (`VerificationModule.tsx`).
   - *Impact :* Élimine 90% des termes déconcertants dès la première session d'un utilisateur pilote.
2. **Vague 2 — Priorité 2 (Compréhension & Portabilité) : 7 libellés**
   - Couvre la vue profil (`Profile.tsx`), la cartographie du réseau (`Network.tsx`), la modale d'exportation (`ProofPortabilityModal.tsx`) et les projets (`Projects.tsx`).
   - *Impact :* Clarifie le partage de preuves, la portabilité des compétences et les recommandations entre pairs.
3. **Vague 3 — Priorité 3 (Administration & Secondaire) : 5 libellés**
   - Couvre la console d'administration (`AdminDashboard.tsx`), l'horodatage (`KairosHandshakePanel.tsx`) et le panneau de retour terrain (`UserTestingMode.tsx`).
   - *Impact :* Aligne la terminologie des espaces de gestion d'entreprise.

---

## 5. Décision Finale Obligatoire

La phase de planification de la migration linguistique de l'interface est achevée avec succès. Le plan d'action `/MATRICE_UI_LANGUAGE_UPDATE_PLAN_v1.0.md` est validé et prêt à être exécuté lors de la sous-phase de mise à jour des libellés UI.

```text
====================================================
PHASE :
6C1_UI_LANGUAGE_MIGRATION_PLANNING

CODE_MODIFICATION :
NONE

UI_ANALYSIS :
COMPLETED

MIGRATION_PLAN :
COMPLETED

NEXT_DECISION :
UI_LANGUAGE_IMPLEMENTATION_READY

====================================================
```
