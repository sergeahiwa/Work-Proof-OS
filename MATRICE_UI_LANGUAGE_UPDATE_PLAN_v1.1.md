# MATRICE & PLAN DE MIGRATION LINGUISTIQUE DE L'INTERFACE UTILISATEUR (v1.1)

**System:** Work Proof OS v1.6  
**Dépôt Officiel SSOT :** `https://github.com/sergeahiwa/Work-Proof-OS.git`  
**Branche Canonique :** `main`  
**Version & Tag :** `v1.6.0-pilot`  
**Document :** `MATRICE_UI_LANGUAGE_UPDATE_PLAN_v1.1.md`  
**Phase :** `6C.2 — Product Language Glossary Arbitration & UI Terminology Freeze`  
**Statut :** `UI_TERMINOLOGY_FROZEN_OFFICIAL`

---

## 1. Présentation du Plan d'Exécution UI

Le présent document constitue la feuille de route exhaustive et officialisée pour la future mise à jour des libellés textuels dans les composants React de l'interface utilisateur de **Work Proof OS v1.6.0-pilot**.

Il intègre rigoureusement l'ensemble des arbitrages de vocabulaire arrêtés dans le document `/GLOSSAIRE_TRADUCTION_STRATEGIQUE_WORK_PROOF_OS_v1.1.md`.

---

## 2. Matrice Exécutive de Migration UI

| Écran / Composant React | Emplacement Précis UI | Libellé Actuel (Informatique / Système) | Libellé Officiel Recommandé (UI / Métier) | Justification Utilisateur & Produit | Priorité |
|---|---|---|---|---|---|
| `Layout.tsx` | Navigation principale (Sidebar) | `Graph de Validation` | **Cercle de Confiance** | Supprime le terme mathématique "Graph" au profit d'une notion relationnelle compréhensible par tous. | **P1 (Critique)** |
| `Layout.tsx` | Navigation principale (Sidebar) | `Proof Repository` | **Mes Réalisations Prouvées** | Remplace un terme de développeur informatique ("Repository") par une formulation engageante et centrée utilisateur. | **P1 (Critique)** |
| `Layout.tsx` | En-tête (Header) | `Tenant Switcher` | **Sélecteur d'Espace Organisation** | Élimine l'anglicisme cloud "Tenant" pour utiliser le terme d'entreprise "Organisation". | **P1 (Critique)** |
| `Dashboard.tsx` | Section KPI supérieure | `Credibility Score Gauge` | **Indice du Niveau de Confiance** | Clarifie que la jauge reflète le niveau de confiance fondé sur des preuves réelles. | **P1 (Critique)** |
| `Dashboard.tsx` | En-tête de la jauge | `Score de Crédibilité : 85/100` | **Niveau de Confiance Professionnelle : 85/100** | Explicite l'origine factuelle du score pour rassurer l'utilisateur sur sa nature déterministe. | **P1 (Critique)** |
| `CreateProofModule.tsx` | Titre du formulaire | `STAR Structured Capture Workflow` | **Saisie guidée d'une réalisation (Méthode STAR)** | Formule la méthode comportementale sous forme d'une assistance pas-à-pas en 4 étapes. | **P1 (Critique)** |
| `CreateProofModule.tsx` | Panneau d'aide IA (`ProofSuggestionsCard.tsx`) | `RIL Real-Time Advisory` | **Assistant de Valorisation (Aide IA)** | Supprime l'acronyme système "RIL" (Reality Intelligence Layer) et clarifie le rôle de l'assistant. | **P1 (Critique)** |
| `CreateProofModule.tsx` | Infobulle sous le champ Résultat | `AI Advisory Only - No Scoring Impact` | **Suggestions indicatives : l'IA n'impacte pas votre niveau de confiance** | Traduit en français clair pour lever toute crainte d'une évaluation automatique par algorithme. | **P1 (Critique)** |
| `VerificationModule.tsx` | En-tête du panneau de validation | `Human Validation Required Gate` | **Validation par un collègue ou manager requise** | Remplace le terme "Gate" d'ingénierie par une consigne claire d'attestation par un tiers humain. | **P1 (Critique)** |
| `VerificationModule.tsx` | Bouton d'action principal | `Sign & Validate Proof Artifact` | **Attester et certifier cette réalisation** | Utilise des verbes d'action engageants et supprime le mot "Artifact". | **P1 (Critique)** |
| `Profile.tsx` | En-tête du profil | `Proof Identity Passport` | **Passeport Professionnel Certifié** | Donne une dimension valorisante et souveraine au profil de l'utilisateur. | **P2 (Haute)** |
| `Profile.tsx` | Zone d'exportation | `Export Proof Artifacts (JSON/PDF)` | **Exporter mon Passeport Professionnel (PDF/JSON)** | Met l'accent sur la portabilité des compétences acquises et vérifiées. | **P2 (Haute)** |
| `ProofPortabilityModal.tsx` | Titre de la modale | `Proof Portability & Export Vault` | **Portabilité et Exportation de vos Réalisations** | Remplaçant "Vault" et "Proof" par une tournure explicite sur le transfert de données. | **P2 (Haute)** |
| `Network.tsx` | Titre principal de la vue | `Professional Validation Graph Network` | **Cercle de Confiance Professionnelle** | Exprime la valeur réseau des recommandations certifiées entre pairs et managers. | **P2 (Haute)** |
| `Network.tsx` | Légende des liaisons | `Passive Collusion Shield Active` | **Vérification d'indépendance des attestations active** | Atténue la lourdeur du mot "Collusion" en le reformulant de manière positive et rassurante. | **P2 (Haute)** |
| `AdminDashboard.tsx` | Console d'administration | `Multi-Tenant Console` | **Console d'Espace Organisation** | Rend la console d'administration accessible aux responsables RH et administrateurs d'entreprise. | **P3 (Moyenne)** |
| `AdminDashboard.tsx` | Section des registres d'audit | `Deterministic Core Audit Ledger` | **Journal d'Intégrité et de Sécurité** | Explicite la fonction de traçabilité et de transparence du registre d'audit. | **P3 (Moyenne)** |
| `KairosHandshakePanel.tsx` | Badge d'horodatage | `Kairos Time Handshake` | **Certification temporelle de réalisation** | Remplace la référence au sous-système "Kairos" par la fonction réelle d'ancrage temporel. | **P3 (Moyenne)** |
| `UserTestingMode.tsx` | Bandeau de feedback | `Feedback OS & RIL Calibration` | **Espace d'Audit & Retours Utilisateurs Terrain** | Formule le canal de retour d'expérience de manière claire pour les bêta-testeurs. | **P3 (Moyenne)** |
| `Projects.tsx` | État vide (Empty State) | `No Proof Artifacts Linked` | **Aucune réalisation certifiée associée** | Remplaçant le terme "Artifact" dans les états vides pour maintenir une cohérence globale. | **P2 (Haute)** |

---

## 3. Plan de Déploiement par Vagues

1. **Vague 1 — Priorité 1 (8 éléments) :**
   - Composants : `Layout.tsx`, `Dashboard.tsx`, `CreateProofModule.tsx`, `VerificationModule.tsx`.
   - Objectif : Élimination immédiate de 90% des frictions de vocabulaire dès le premier écran.

2. **Vague 2 — Priorité 2 (7 éléments) :**
   - Composants : `Profile.tsx`, `ProofPortabilityModal.tsx`, `Network.tsx`, `Projects.tsx`.
   - Objectif : Clarté sur la portabilité, le Passeport Professionnel et le Cercle de Confiance.

3. **Vague 3 — Priorité 3 (5 éléments) :**
   - Composants : `AdminDashboard.tsx`, `KairosHandshakePanel.tsx`, `UserTestingMode.tsx`.
   - Objectif : Harmonisation des vues d'administration d'organisation et des métadonnées système.

---

## 4. Statut de Validation

Le plan de migration linguistique de l'UI est intégralement validé, figé et prêt pour la phase d'exécution technique future (Phase 6D).
