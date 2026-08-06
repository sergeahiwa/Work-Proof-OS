# FEEDBACK LIFECYCLE — WORK PROOF OS
## Machine d'État Officielle du Feedback OS

**Version :** 1.0  
**Statut :** Spécification Opérationnelle / Gouvernance  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/FEEDBACK_OS/FEEDBACK_SCHEMA.md`
- `/DATA_PROVENANCE_STANDARD.md`

---

## 1. Machine d'État Officielle du Cycle de Vie

Tout feedback entrant dans Work Proof OS suit une machine d'état déterministe et s'exécute à travers les 8 états séquentiels suivants :

```text
       [ NEW ]
          │
          ▼
     [ TRIAGED ]
          │
          ▼
     [ ANALYZED ]
          │
          ▼
 [ DECISION_PENDING ]
    ┌─────┼──────────────┐
    ▼     ▼              ▼
[ACCEPTED] [REJECTED] [DEFERRED]
    │
    ▼
[IMPLEMENTED]
    │
    ▼
 [VERIFIED]
    │
    ▼
 [ARCHIVED]
```

---

## 2. Spécification Détaillée des États

### State 1: `NEW`
* **Définition :** Signal ou observation venant d'être capturé, brut, non vérifié et non qualifié.
* **Responsable :** Émetteur du feedback / Système de capture.
* **Condition d'Entrée :** Réception ou saisie d'une observation brute comportant un horodatage et un émetteur.
* **Condition de Sortie :** Attribution d'un `feedback_id` unique et vérification de la provenance selon `/DATA_PROVENANCE_STANDARD.md`.
* **Preuve de Transition :** Inscription formelle au registre `/FEEDBACK_OS/FEEDBACK_REGISTRY.md` avec le statut `NEW`.

---

### State 2: `TRIAGED`
* **Définition :** Feedback qualifié et catégorisé selon la matrice canonique (1 des 9 catégories) avec évaluation initiale de provenance et de sévérité.
* **Responsable :** Agent Triage / Observateur Produit.
* **Condition d'Entrée :** Inscription d'un feedback au statut `NEW`.
* **Condition de Sortie :** Catégorie canonique affectée (`BUG`, `UX_FRICTION`, `TRUST_ISSUE`, `VALUE_CONFUSION`, `MISSING_CAPABILITY`, `SECURITY_CONCERN`, `PERFORMANCE`, `STRATEGIC_SIGNAL`, `NOISE`) et `signal_strength` calculée.
* **Preuve de Transition :** Mises à jour des champs `categorie`, `severite` et `signal_strength` dans la fiche de feedback.

---

### State 3: `ANALYZED`
* **Définition :** Diagnostic approfondi de la cause racine, évaluation de l'impact produit et vérification de la compatibilité avec les 7 Invariants Canoniques.
* **Responsable :** Analyste Produit / Équipe Architecture.
* **Condition d'Entrée :** Feedback qualifié au statut `TRIAGED`.
* **Condition de Sortie :** Document de diagnostic ou note d'impact établie, précisant si le feedback nécessite un arbitrage du Product Manager.
* **Preuve de Transition :** Rapport d'analyse ou note technique associée dans la fiche feedback.

---

### State 4: `DECISION_PENDING`
* **Définition :** Dossier d'analyse soumis formellement à l'arbitrage du Product Manager.
* **Responsable :** Product Manager (Maîtrise d'Ouvrage).
* **Condition d'Entrée :** Analyse d'impact complétée (`ANALYZED`).
* **Condition de Sortie :** Arbitrage explicite rendu par le Product Manager.
* **Preuve de Transition :** Enregistrement de la demande d'arbitrage dans `/DECISION_LOG_WORK_PROOF_OS.md`.

---

### State 5: `ACCEPTED` / `REJECTED` / `DEFERRED`
* **Définition :**
  * `ACCEPTED` : Décision de mise en œuvre validée par le PM.
  * `REJECTED` : Rejet motivé (ex: incompatibilité avec un invariant, hors-sujet, bruit).
  * `DEFERRED` : Inscription en backlog pour réévaluation lors d'une phase ultérieure.
* **Responsable :** Product Manager.
* **Condition d'Entrée :** Dossier en attente d'arbitrage (`DECISION_PENDING`).
* **Condition de Sortie :** Attribution du statut de décision et motif consigné.
* **Preuve de Transition :** Entrée formelle signée dans `/DECISION_LOG_WORK_PROOF_OS.md` avec référence `DECISION-ID`.

---

### State 6: `IMPLEMENTED`
* **Définition :** Action corrective, évolution ou modification documentaire/code exécutée suite à une décision `ACCEPTED`.
* **Responsable :** Équipe d'Exécution / Développeurs.
* **Condition d'Entrée :** Décision `ACCEPTED` liée à une tâche ou un item de roadmap.
* **Condition de Sortie :** Livraison des artefacts modifiés (spécifications, tests ou code).
* **Preuve de Transition :** Commit / PR ou livrable documentaire référencé dans `/FEEDBACK_OS/FEEDBACK_ROADMAP_LINK.md`.

---

### State 7: `VERIFIED`
* **Définition :** Contrôle post-implémentation confirmant la résolution du problème et l'absence de régression sur les 7 invariants canoniques.
* **Responsable :** Agent QA / Recette Produit.
* **Condition d'Entrée :** Livraison complétée (`IMPLEMENTED`).
* **Condition de Sortie :** Test de vérification ou constatation de non-régression validé.
* **Preuve de Transition :** Attestation de vérification inscrite dans `verification_status` avec horodatage.

---

### State 8: `ARCHIVED`
* **Définition :** État final immuable d'un feedback dont le cycle de vie est achevé (soit après vérification, soit après un rejet/archivage de bruit).
* **Responsable :** Agent Gouvernance Produit.
* **Condition d'Entrée :** Validation de l'étape `VERIFIED` ou formalisation d'un `REJECTED`.
* **Condition de Sortie :** Aucune (État terminal immuable).
* **Preuve de Transition :** Clôture définitive au registre `/FEEDBACK_OS/FEEDBACK_REGISTRY.md`.
