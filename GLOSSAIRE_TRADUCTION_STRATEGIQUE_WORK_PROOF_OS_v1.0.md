# GLOSSAIRE DE TRADUCTION STRATÉGIQUE & CHARTE DE LANGAGE PRODUIT

**System:** Work Proof OS v1.6  
**Dépôt Officiel SSOT :** `https://github.com/sergeahiwa/Work-Proof-OS.git`  
**Branche Canonique :** `main`  
**Version :** `v1.6.0-pilot`  
**Document :** `GLOSSAIRE_TRADUCTION_STRATEGIQUE_WORK_PROOF_OS_v1.0.md`  
**Date :** 06 Août 2026  
**Statut :** `OFFICIAL_GLOSSARY_APPROVED`

---

## 1. Vision & Objectifs de la Traduction Stratégique

**Work Proof OS** est conçu sur un modèle formel et rigoureux garantissant l'intégrité, la traçabilité et la souveraineté des réalisations professionnelles. Si ce socle technique nécessite un vocabulaire précis d'ingénierie (`Graph de validation`, `RIL`, `Score déterministe`, `Multi-tenant`), l'interface utilisateur (UI/UX) doit offrir une clarté immédiate aux professionnels, collaborateurs, managers, responsables RH et partenaires.

### Principes Directeurs
1. **Conserver la rigueur sous-jacente :** Le modèle de domaine, les schémas de données et les contrats d'invariants système restent inchangés.
2. **Réduire la charge cognitive :** Remplacer le jargon orienté ingénierie par des notions métier naturelles et intuitives.
3. **Privilégier l'usage et la valeur :** Mettre l'accent sur ce que l'utilisateur accomplit ou obtient ("Attestation de vos pairs", "Niveau de confiance basé sur vos réalisations") plutôt que sur la mécanique interne ("Ancrage cryptographique sur graphe").

---

## 2. Charte de Langage Produit (Règles d'Expression UI)

### Règle 1 : Priorité à la valeur humaine et métier
- **Principe :** Exprimer l'objectif et le bénéfice pour l'utilisateur plutôt que l'algorithme sous-jacent.
- **Exemple :** Préférer *"Attestation par vos pairs"* à *"Validation cryptographique d'arrête sur graph"*.

### Règle 2 : Élimination des acronymes et termes système dans l'interface publique
- **Principe :** Les acronymes techniques (ex: RIL, ADSE, DSA, Tenant) doivent être traduits en langage courant dans les libellés publics et modales.
- **Exemple :** Transformer *"Conseiller RIL"* en *"Assistant d'alignement de contenu"*.

### Règle 3 : Vocabulaire orienté action et souveraineté
- **Principe :** Employer des verbes clairs et engageants qui renforcent le sentiment de contrôle de l'utilisateur sur ses propres données.
- **Exemple :** *"Exporter mon passeport de compétences"* au lieu de *"Générer artefact de preuve JSON"*.

### Règle 4 : Transparence et clarté sur l'IA
- **Principe :** Souligner systématiquement que l'intelligence artificielle est un conseiller d'aide à la rédaction, et qu'elle n'attribue aucun score ni décision.
- **Exemple :** *"Suggestions de rédaction (Aide IA)"* plutôt que *"Analyse IA du score"*.

---

## 3. Glossaire Stratégique par Concept

---

### Concept 01 : Graph de Validation Professionnelle
1. **Nom technique interne :** `Professional Validation Graph` / `Validation Network Graph`
2. **Définition système :** Réseau orienté de nœuds (utilisateurs, organisations) et d'arcs d'attestation représentant les relations de validation réciproques et leur poids relatif.
3. **Terme produit recommandé :** **Réseau d'Attestation Professionnelle**
4. **Terme affichage utilisateur :** **Réseau de confiance & validations**
5. **Justification :** Le terme "Graph" relève de la théorie des graphes et déconcerte les profils RH ou métiers. "Réseau de confiance" évoque immédiatement un tissu de recommandations authentifiées par des collègues et superviseurs.

---

### Concept 02 : Credibility Score
1. **Nom technique interne :** `Credibility Score` / `Deterministic Credibility Index`
2. **Définition système :** Valeur numérique déterministe (0-100) calculée à partir de facteurs explicites : niveau d'attestation, indépendance des tiers, complétude STAR et ancienneté.
3. **Terme produit recommandé :** **Indice de Confiance Professionnelle**
4. **Terme affichage utilisateur :** **Niveau de confiance basé sur vos réalisations** (ou **Indice de confiance**)
5. **Justification :** "Credibility Score" peut être perçu comme un jugement ou une notation arbitraire d'IA. Préciser qu'il s'agit d'un "Niveau de confiance basé sur des preuves vérifiées" rassure l'utilisateur sur sa nature objective et factuelle.

---

### Concept 03 : Proof Identity
1. **Nom technique interne :** `Proof Identity` / `Attested Identity Record`
2. **Définition système :** Ensemble des attributs vérifiés caractérisant un utilisateur au sein du registre immuable, indépendant de tout identifiant centralisé.
3. **Terme produit recommandé :** **Profil de Preuves Certifiées**
4. **Terme affichage utilisateur :** **Votre Passeport Professionnel**
5. **Justification :** "Proof Identity" est un terme abstrait. "Passeport Professionnel" renvoie directement à la notion de souveraineté, de portabilité et de crédibilité.

---

### Concept 04 : Proof Artifact
1. **Nom technique interne :** `Proof Artifact` / `Work Proof Unit`
2. **Définition système :** Entité structurée contenant la description STAR d'une réalisation, ses pièces justificatives, son horodatage et ses signatures d'attestation.
3. **Terme produit recommandé :** **Preuve de Réalisation**
4. **Terme affichage utilisateur :** **Preuve de travail** ou **Réalisation certifiée**
5. **Justification :** Le mot "Artifact" (ou artefact) est perçu comme du jargon informatique ou archéologique. "Preuve de travail" ou "Réalisation certifiée" parle directement aux managers et recruteurs.

---

### Concept 05 : Reality Intelligence Layer (RIL)
1. **Nom technique interne :** `Reality Intelligence Layer` / `RIL`
2. **Définition système :** Couche sémantique isolée fournissant une assistance contextuelle de formulation et de réduction de biais, sans accès au moteur transactionnel.
3. **Terme produit recommandé :** **Assistant d'Alignement & Détection de Biais**
4. **Terme affichage utilisateur :** **Conseiller de rédaction (Aide IA)**
5. **Justification :** "Reality Intelligence Layer" est un nom d'architecture complexe. "Conseiller de rédaction" explique clairement que le rôle de l'outil est d'aider à mieux formuler sans prendre la décision.

---

### Concept 06 : AI Advisory
1. **Nom technique interne :** `AI Advisory Only` / `Non-Scoring AI Assistant`
2. **Définition système :** Principe d'invariance interdisant à tout modèle génératif d'émettre des notes, des scores ou des décisions d'attribution de valeur.
3. **Terme produit recommandé :** **Assistance IA Consultative**
4. **Terme affichage utilisateur :** **Suggestions indicatives (Aucun impact sur votre score)**
5. **Justification :** Garantit à l'utilisateur que l'IA ne vient pas le "juger" ni impacter négativement sa note de manière opaque.

---

### Concept 07 : Human Validation Required
1. **Nom technique interne :** `Human Validation Required` / `Peer Attestation Gate`
2. **Définition système :** Invariant imposant une transition d'état vers le statut certifié uniquement après signature explicite d'un tiers humain qualifié.
3. **Terme produit recommandé :** **Attestation Humaine Obligatoire**
4. **Terme affichage utilisateur :** **Validation par un collègue ou manager requise**
5. **Justification :** Exprime en langage clair que la valeur de la preuve repose sur le témoignage d'une personne réelle qui confirme la réalisation.

---

### Concept 08 : Multi-tenant
1. **Nom technique interne :** `Multi-tenant` / `Tenant Isolation Engine`
2. **Définition système :** Séparation hermétique des espaces de données et des permissions par organisation ou entreprise dans Firestore.
3. **Terme produit recommandé :** **Espace d'Organisation Sécurisé**
4. **Terme affichage utilisateur :** **Votre Organisation / Entreprise**
5. **Justification :** "Multi-tenant" est un terme d'architecture cloud inconnu des utilisateurs RH ou opérationnels. "Espace Organisation" est clair et professionnel.

---

### Concept 09 : Core Engine
1. **Nom technique interne :** `Core Engine` / `Deterministic Core`
2. **Définition système :** Moteur transactionnel isolé gérant l'intégrité, le registre d'audit et le calcul déterministe des règles métier.
3. **Terme produit recommandé :** **Moteur d'Intégrité Immuable**
4. **Terme affichage utilisateur :** **Registre d'intégrité certifié**
5. **Justification :** Évite les anglicismes ("Core") et met en avant la garantie de sécurité et d'immuabilité des données.

---

### Concept 10 : Proof Repository
1. **Nom technique interne :** `Proof Repository` / `Proof Storage Vault`
2. **Définition système :** Collection centralisée et sécurisée contenant l'ensemble des preuves de travail et leur historique d'attestation.
3. **Terme produit recommandé :** **Coffre-Fort de Preuves**
4. **Terme affichage utilisateur :** **Mes Réalisations Certifiées** (ou **Bibliothèque de preuves**)
5. **Justification :** "Repository" fait penser à un dépôt de code Git. "Mes Réalisations Certifiées" s'inscrit parfaitement dans le parcours du collaborateur.

---

### Concept 11 : STAR Workflow
1. **Nom technique interne :** `STAR Structured Capture Workflow`
2. **Définition système :** Processus guidé de saisie décomposant une réalisation professionnelle en Situation, Tâche, Action et Résultat.
3. **Terme produit recommandé :** **Méthode de Saisie STAR**
4. **Terme affichage utilisateur :** **Saisie guidée en 4 étapes (Situation, Tâche, Action, Résultat)**
5. **Justification :** Explicite la méthodologie comportementale reconnue par les RH tout en guidant l'utilisateur pas à pas.

---

### Concept 12 : Collusion Shield / Passive Collusion
1. **Nom technique interne :** `Passive Collusion Shield`
2. **Définition système :** Algorithme de détection des paires de validation réciproque ou répétitives afin de pondérer le score de crédibilité.
3. **Terme produit recommandé :** **Contrôle d'Indépendance des Attestations**
4. **Terme affichage utilisateur :** **Vérification de l'indépendance des validations**
5. **Justification :** Le mot "Collusion" est juridiquement et émotionnellement lourd. "Vérification de l'indépendance" formule le contrôle de manière positive et professionnelle.

---

### Concept 13 : Kairos Satellite / Handshake
1. **Nom technique interne :** `Kairos Handshake Protocol`
2. **Définition système :** Module satellite d'ancrage temporel certifiant l'horodatage et la concomitance d'un événement de preuve.
3. **Terme produit recommandé :** **Sceau d'Horodatage Certifié**
4. **Terme affichage utilisateur :** **Certification temporelle de réalisation**
5. **Justification :** "Kairos" est un nom de projet interne/mythologique. "Certification temporelle" exprime clairement la fonction d'horodatage irréfutable.

---

## 4. Matrice Synthétique de Correspondance des Interfaces

| Emplacement / Composant UI | Terme Technique Précédent | Nouveau Terme Recommandé à l'Écran |
|---|---|---|
| **En-tête & Switcher** | Tenant Switcher | **Sélecteur d'Organisation** |
| **Menu Nav** | Proof Repository | **Mes Réalisations** |
| **Menu Nav** | Validation Graph | **Réseau d'Attestation** |
| **Dashboard** | Credibility Score Gauge | **Indice de Confiance basé sur vos preuves** |
| **Page Création** | STAR Structured Form | **Saisie guidée STAR (Situation, Tâche, Action, Résultat)** |
| **Carte Conseil** | RIL Advisory Card | **Assistant de rédaction (Conseils IA)** |
| **Modale Validation** | Human Validation Gate | **Attestation par un pair ou manager** |
| **Page Profil** | Proof Passport Export | **Exporter mon Passeport de Compétences (PDF/JSON)** |
| **Page Admin** | Multi-Tenant Ledger | **Journal de sécurité de l'entreprise** |

---

## 5. Prochaines Étapes Produit

Cette charte et ce glossaire constituent le référentiel officiel pour l'harmonisation future des interfaces utilisateur (UI) lors de la mise à jour des libellés dans les composants React, sans altérer le moindre contrat ou algorithme du moteur métier.
