# MATRICE & PLAN DE MIGRATION LINGUISTIQUE DE L'INTERFACE UTILISATEUR (UI)

**System:** Work Proof OS v1.6  
**Dépôt Officiel SSOT :** `https://github.com/sergeahiwa/Work-Proof-OS.git`  
**Branche Canonique :** `main`  
**Version & Tag :** `v1.6.0-pilot`  
**Document :** `MATRICE_UI_LANGUAGE_UPDATE_PLAN_v1.0.md`  
**Phase :** `6C.1 — UI Language Migration Planning`  
**Statut :** `MIGRATION_PLAN_APPROVED`

---

## 1. Contexte & Démarche de Planification

Dans la continuité de la **Phase 6C Product Language Alignment** (qui a formalisé le `GLOSSAIRE_TRADUCTION_STRATEGIQUE_WORK_PROOF_OS_v1.0.md`), ce plan de migration opérationnelle répertorie l'ensemble des éléments textuels de l'interface graphique (UI) de **Work Proof OS v1.6.0-pilot** à mettre à jour.

### Objectif
Accroître l'accessibilité cognitive et la lisibilité du produit pour les professionnels terrain, managers, responsables RH et recruteurs, tout en maintenant l'étanchéité absolue et la rigueur du moteur d'ingénierie sous-jacent.

### Règle d'Or de Gouvernance
**Aucun code applicatif, composant React ou contrat système n'est modifié durant cette phase.** Ce document constitue la feuille de route exhaustive pour l'exécution ultérieure des remplacements de libellés dans l'UI.

---

## 2. Matrice Opérationnelle des Modifications UI

Cette matrice répertorie l'ensemble des éléments textuels à remplacer, classés par composant et écran, avec indication de la priorité de déploiement.

| Écran / Composant Concerné | Emplacement Précis dans l'UI | Texte Actuel (Jargon / Système) | Nouveau Texte Recommandé (Métier / Utilisateur) | Justification Produit & Ergonomique | Priorité |
|---|---|---|---|---|---|
| `Layout.tsx` | Menu latéral de navigation | `Graph de Validation` | **Réseau de Confiance** | Supprime le terme mathématique "Graph" au profit d'une notion relationnelle compréhensible par tous. | **Critique (P1)** |
| `Layout.tsx` | Menu latéral de navigation | `Proof Repository` | **Mes Réalisations Certifiées** | Remplace "Repository" (vocabulaire de développeur Git) par une notion de portfolio professionnel. | **Critique (P1)** |
| `Layout.tsx` | En-tête (Header) | `Tenant Switcher` | **Sélecteur d'Organisation** | Élimine l'anglicisme "Tenant" pour utiliser le terme métier "Organisation" ou "Entreprise". | **Critique (P1)** |
| `Dashboard.tsx` | Section KPI supérieure | `Credibility Score Gauge` | **Indice de Confiance basé sur vos preuves** | Clarifie que la jauge n'est pas une note arbitraire d'IA mais un indice déterministe basé sur des preuves. | **Critique (P1)** |
| `Dashboard.tsx` | En-tête de la jauge | `Score de Crédibilité : 85/100` | **Indice de Confiance Réalisations : 85/100** | Explicite l'origine factuelle du score pour rassurer l'utilisateur. | **Critique (P1)** |
| `CreateProofModule.tsx` | Titre du formulaire principal | `STAR Structured Capture Workflow` | **Saisie guidée de votre réalisation (Méthode STAR)** | Formule la méthode comportementale sous forme d'une assistance pas-à-pas en 4 étapes. | **Critique (P1)** |
| `CreateProofModule.tsx` | Panneau d'aide IA (`ProofSuggestionsCard.tsx`) | `RIL Real-Time Advisory` | **Conseils de rédaction (Aide IA)** | Supprime l'acronyme système "RIL" (Reality Intelligence Layer) et clarifie le rôle purement consultatif de l'IA. | **Haute (P1)** |
| `CreateProofModule.tsx` | Infobulle sous le champ Résultat | `AI Advisory Only - No Scoring Impact` | **Suggestions indicatives : l'IA n'impacte pas votre score** | Raccourcit et traduit en français clair pour lever la crainte d'une évaluation automatique par algorithme. | **Haute (P1)** |
| `VerificationModule.tsx` | En-tête du panneau de validation | `Human Validation Required Gate` | **Validation par un collègue ou manager requise** | Remplace le terme "Gate" d'ingénierie par une consigne claire d'attestation par un tiers humain. | **Critique (P1)** |
| `VerificationModule.tsx` | Bouton d'action principal | `Sign & Validate Proof Artifact` | **Attester et certifier cette réalisation** | Utilise des verbes d'action engageants et supprime le mot "Artifact". | **Critique (P1)** |
| `Profile.tsx` | Titre de l'en-tête de profil | `Proof Identity Passport` | **Votre Passeport Professionnel Certifié** | Donne une dimension valorisante et souveraine au profil de l'utilisateur. | **Haute (P2)** |
| `Profile.tsx` | Zone d'exportation | `Export Proof Artifacts (JSON/PDF)` | **Exporter mon Passeport de Compétences (PDF/JSON)** | Met l'accent sur la portabilité des compétences acquises et vérifiées. | **Haute (P2)** |
| `ProofPortabilityModal.tsx` | Titre de la modale | `Proof Portability & Export Vault` | **Exportation et Portabilité de vos Réalisations** | Remplaçant "Vault" et "Proof" par une tournure explicite sur le transfert de données. | **Haute (P2)** |
| `Network.tsx` | Titre principal de la vue | `Professional Validation Graph Network` | **Cartographie de votre Réseau d'Attestation** | Exprime la valeur réseau des recommandations certifiées entre pairs. | **Haute (P2)** |
| `Network.tsx` | Légende des liaisons | `Passive Collusion Shield Active` | **Vérification d'indépendance des validations active** | Atténue la lourdeur du mot "Collusion" en le reformulant de manière positive et rassurante. | **Moyenne (P2)** |
| `AdminDashboard.tsx` | Onglet d'administration | `Multi-Tenant Management Console` | **Gestion des Espaces Organisations** | Rend la console d'administration accessible aux responsables RH et administrateurs d'entreprise. | **Moyenne (P3)** |
| `AdminDashboard.tsx` | Section des registres d'audit | `Deterministic Core Audit Ledger` | **Journal d'Intégrité et de Sécurité** | Explicite la fonction de traçabilité et de transparence du registre d'audit. | **Moyenne (P3)** |
| `KairosHandshakePanel.tsx` | Badge d'horodatage | `Kairos Satellite Time Handshake` | **Horodatage et certification temporelle** | Remplace la référence au sous-système "Kairos" par la fonction réelle d'ancrage temporel. | **Moyenne (P3)** |
| `UserTestingMode.tsx` | Bandeau de feedback | `Feedback OS & RIL Calibration` | **Espace d'Audit & Retours Utilisateurs Terrain** | Formule le canal de retour d'expérience de manière claire pour les bêta-testeurs. | **Faible (P3)** |
| `Projects.tsx` | État vide (Empty State) | `No Proof Artifacts Linked to Project` | **Aucune réalisation certifiée associée à ce projet** | Remplaçant le terme "Artifact" dans les états vides pour maintenir une cohérence globale. | **Moyenne (P2)** |

---

## 3. Contrôle de Cohérence par Rapport aux Invariants Système

Chaque formulation recommandée a été scrupuleusement vérifiée au regard des **7 Invariants Canoniques** de Work Proof OS :

1. **`PROOF_FIRST` :** Les nouveaux libellés réaffirment que la preuve factuelle basée sur le modèle STAR reste l'élément atomique fondamental du système (*"Preuve de réalisation"*, *"Saisie guidée STAR"*).
2. **`USER_SOVEREIGNTY_FIRST` :** Le vocabulaire renforce le contrôle de l'utilisateur sur son passeport professionnel (*"Votre Passeport Professionnel Certifié"*, *"Exporter mon Passeport"*).
3. **`AI_NO_SCORING` :** Les libellés clarifient explicitement la neutralité de l'IA (*"Suggestions indicatives : l'IA n'impacte pas votre score"*).
4. **`AI_OUTPUT_ADVISORY_ONLY` :** L'assistance RIL est présentée comme une aide à la rédaction (*"Conseils de rédaction (Aide IA)"*).
5. **`HUMAN_VALIDATION_REQUIRED` :** La nécessité d'un témoignage tiers est formulée sans équivoque (*"Validation par un collègue ou manager requise"*).
6. **`CORE_RIL_ISOLATION` :** Les séparations conceptuelles sont maintenues dans la documentation technique, seule la couche d'affichage est adaptée.
7. **`CREDIBILITY_TRANSACTIONAL` :** L'explicabilité du calcul déterministe est renforcée (*"Indice de confiance basé sur vos réalisations"*).

---

## 4. Priorisation & Ordre d'Exécution de la Migration UI

Le déploiement des modifications de libellés lors de la future phase d'implémentation suivra un ordre séquentiel strict :

### Vague 1 — Priorité 1 (Critique & Onboarding)
- **Objectif :** Aligner les éléments vus dès la première minute par un nouvel utilisateur (Menu principal `Layout.tsx`, Tableau de bord `Dashboard.tsx`, Module de création STAR `CreateProofModule.tsx` et Module de validation `VerificationModule.tsx`).
- **Volume :** 8 emplacements clés.

### Vague 2 — Priorité 2 (Compréhension & Portabilité)
- **Objectif :** Aligner le profil utilisateur (`Profile.tsx`), le réseau d'attestation (`Network.tsx`), la modale d'exportation (`ProofPortabilityModal.tsx`) et les projets (`Projects.tsx`).
- **Volume :** 7 emplacements.

### Vague 3 — Priorité 3 (Administration & Réglages Secondaires)
- **Objectif :** Aligner les consoles d'administration (`AdminDashboard.tsx`), les panneaux satellites (`KairosHandshakePanel.tsx`) et le panneau de retours terrain (`UserTestingMode.tsx`).
- **Volume :** 5 emplacements.

---

## 5. Synthèse de la Planification

Le plan de migration linguistique de l'interface utilisateur de **Work Proof OS v1.6.0-pilot** est intégralement structuré, vérifié et prêt pour l'étape d'implémentation dans la couche de présentation React.
