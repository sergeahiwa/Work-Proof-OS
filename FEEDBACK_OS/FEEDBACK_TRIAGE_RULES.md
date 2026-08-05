# FEEDBACK TRIAGE RULES — WORK PROOF OS
## Règles de Qualification & Matrice de Triage des Feedbacks

**Version :** 1.0  
**Statut :** Spécification Opérationnelle / Gouvernance  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/FEEDBACK_OS/FEEDBACK_SCHEMA.md`

---

## 1. Matrice des Catégories Canoniques

Tout feedback entrant doit être affecté à l'une des 9 catégories canoniques ci-dessous :

### 1. `BUG`
* **Définition :** Dysfonctionnement technique ou comportement non conforme aux spécifications du cahier des charges.
* **Critère d'identification :** Message d'erreur, plante applicative, blocage d'I/O ou rupture transactionnelle.
* **Circuit de traitement :** Qualification immédiate -> Évaluation sévérité -> Rapport d'incident technique si bloquant.

### 2. `UX_FRICTION`
* **Définition :** Difficulté d'ergonomie, hésitation visuelle, mauvaise lisibilité d'un bouton ou confusion d'étapes.
* **Critère d'identification :** L'utilisateur parvient à son objectif mais avec un délai anormal, des clics superflus ou de l'hésitation.
* **Circuit de traitement :** Analyse ergonomique -> Proposition d'ajustement micro-copy ou layout -> Validation Product Manager.

### 3. `TRUST_ISSUE`
* **Définition :** Inquiétude ou doute exprimé par l'utilisateur concernant la confidentialité, l'authenticité de la preuve ou la légitimité du système.
* **Critère d'identification :** Interrogation sur la sécurité des données, doute sur qui a accès aux informations privées, peur du jugement.
* **Circuit de traitement :** Alerte prioritaire -> Révision des éléments de réassurance UI -> Alignement strict avec l'invariant `USER_SOVEREIGNTY_FIRST`.

### 4. `VALUE_CONFUSION`
* **Définition :** Incompréhension du positionnement fondamental du produit (ex: confusion entre Work Proof OS et un CV classique, un réseau social ou un ATS).
* **Critère d'identification :** "Pourquoi n'y a-t-il pas de likes ?", "Où est la note donnée par l'IA ?", "Comment postuler à un job ?".
* **Circuit de traitement :** Analyse du Value Proposition Understanding Rate (VPUR) -> Clarification des messages d'onboarding -> Réaffirmation des Invariants Canoniques.

### 5. `MISSING_CAPABILITY`
* **Définition :** Demande ou besoin d'une fonctionnalité non présente dans la version actuelle.
* **Critère d'identification :** "J'aimerais pouvoir exporter vers un format spécifique", "Je voudrais ajouter une pièce jointe volumineuse".
* **Circuit de traitement :** Évaluation de la compatibilité avec la Vision Canonique -> Rangement en backlog ou rejet motivé si contraire aux invariants.

### 6. `SECURITY_CONCERN`
* **Définition :** Signalement relatif à une vulnérabilité potentielle, une fuite de données ou un problème d'intégrité cryptographique.
* **Critère d'identification :** Faille d'autorisation, problème de token, exposition involontaire d'un hash.
* **Circuit de traitement :** Traitement d'urgence maximal -> Audit de sécurité immédiat -> Correction prioritaire.

### 7. `PERFORMANCE`
* **Définition :** Lenteur de chargement, latence de génération du certificat ou délai d'interaction.
* **Critère d'identification :** Latence > 2s sur une action synchrone, lenteur d'I/O.
* **Circuit de traitement :** Évaluation technique -> Optimisation des requêtes ou des payloads -> Recette.

### 8. `STRATEGIC_SIGNAL`
* **Définition :** Retour d'un partenaire, auditeur ou décideur apportant un éclairage stratégique majeur sur l'adoption ou le marché.
* **Critère d'identification :** Opportunité d'intégration, besoin d'interopérabilité avec une norme tierce.
* **Circuit de traitement :** Transmission directe au dossier d'arbitrage Product Manager.

### 9. `NOISE`
* **Définition :** Signal inexploitable, commentaire hors-sujet, Spam ou demande n'ayant aucun rapport avec le produit.
* **Critère d'identification :** Absence de sens, contenu sans lien avec le périmètre Work Proof OS.
* **Circuit de traitement :** Rejet motivé -> Archivage direct.

---

## 2. Grille de Sévérité

* **CRITICAL :** Bloque totalement l'utilisation principale (ex: impossibilité de publier ou valider une preuve).
* **HIGH :** Friction importante impactant la majorité des utilisateurs ou risque de sécurité/confiance.
* **MEDIUM :** Friction modérée ou gêne ergonomique avec contournement possible.
* **LOW :** Amélioration cosmétique, faute de frappe, ajustement mineur.
* **INFORMATIONAL :** Observation neutre sans impact fonctionnel direct.

---

## 3. Matrice de Priorisation Automatique de Triage

| Catégorie | Sévèrité | Impact Invariants | Priorité de Traitement |
|---|---|---|---|
| `SECURITY_CONCERN` | `CRITICAL` / `HIGH` | Majeur | **P0 — Urgent Immédiat** |
| `BUG` | `CRITICAL` | Élevé | **P0 — Urgent Immédiat** |
| `TRUST_ISSUE` | `HIGH` / `MEDIUM` | Élevé | **P1 — Analyse Prioritaire** |
| `VALUE_CONFUSION` | `HIGH` / `MEDIUM` | Moyen | **P1 — Analyse Prioritaire** |
| `UX_FRICTION` | `HIGH` | Faible | **P2 — Traitement Sprint** |
| `PERFORMANCE` | `HIGH` / `MEDIUM` | Faible | **P2 — Traitement Sprint** |
| `MISSING_CAPABILITY` | Toutes | Variable | **P3 — Arbitrage Backlog** |
| `STRATEGIC_SIGNAL` | Toutes | Majeur | **P3 — Arbitrage PM** |
| `NOISE` | Toutes | Aucun | **P4 — Archivage** |
