# IA-FIRST — Protocole de Preuve d'Exécution (Execution Proof Protocol - EPP)

**Standard Officiel de Gouvernance - WORK PROOF OS v1.6**  
**Version :** v1.0.0  
**Statut :** PROTOCOLE OBLIGATOIRE — SSOT GOUVERNANCE  
**Invariants :** `NO_PROOF_NO_DONE`, `STRICT_FACTUALITY`, `ZERO_HALLUCINATION_POLICY`

---

## 1. Mission du Protocole
Aucune tâche ne peut être considérée comme terminée si elle n'est pas accompagnée de preuves objectives de son exécution.
Les affirmations sans preuve doivent être présentées comme des hypothèses ou des concepts, jamais comme des faits.
Ce document constitue le protocole officiel d'exécution et de gouvernance que tous les agents et développeurs doivent respecter rigoureusement.

---

## 2. Objectifs & Définitions

### Objectifs
1. Éliminer toute forme d'hallucination ou de fausse affirmation dans les rapports d'exécution.
2. Garantir la traçabilité complète et vérifiable de toutes les modifications apportées à la codebase.
3. Établir une discipline de preuve rigoureuse basée sur les résultats d'exécution réels (builds, tests, linter, arborescence).

### Définitions
- **Preuve d'Exécution (Execution Proof) :** Une donnée vérifiable et incontestable issue directement de l'exécution d'un outil (chemin exact, nombre de lignes, diff git, output de commande de compilation/test).
- **Affirmation (Claim) :** Toute déclaration portant sur l'état d'un fichier, le succès d'un build, ou la conformité d'un composant.
- **Hypothèse / Proposition :** Une description conceptuelle de ce qui pourrait ou devrait être fait, clairement identifiée comme non exécutée.

---

## 3. Principes Fondamentaux de l'EPP

### Principe n°1 — Les faits priment sur les affirmations
L'agent ne peut jamais écrire :
- « Document créé »
- « Architecture implémentée »
- « Audit terminé »
- « Tous les composants sont conformes »
sans fournir la preuve correspondante.

### Principe n°2 — Chaque affirmation doit être justifiée
Pour chaque affirmation, le rapport doit contenir :
- Le fichier concerné (chemin exact) ;
- Le type de modification (création, modification, suppression) ;
- Une preuve (diff, extrait, commande, résultat) ;
- Les limites éventuelles.

**Exemple :**
```markdown
Affirmation :
/REALITY_INTELLIGENCE_SPEC.md vérifié

Preuve :
✓ /REALITY_INTELLIGENCE_SPEC.md (170 lignes)

Contenu :
- 1. Vision
- 2. Mission
- 3. Objectifs
- ...

Statut :
Conforme SSOT
```

### Principe n°3 — Ce qui n'a pas été fait doit être explicitement indiqué
**Exemple :**
```markdown
Firestore Rules

Statut :
NON FAIT

Raison :
Hors du périmètre de la phase actuelle.
```

### Principe n°4 — Interdiction des formulations ambiguës
- **Interdit :**
  - "Le document est disponible."
  - "Les composants sont conformes."
  - "La migration est terminée."
- **Autorisé :**
  - "Le document n'a pas été créé."
  - "Le document a été créé dans le fichier /path/to/file."
  - "La migration concerne uniquement les fichiers suivants..."
  - "Cette partie est une proposition d'architecture, pas une implémentation."

---

## 4. Types de Preuves d'Exécution

1. **Preuve d'Existence de Fichier :** Chemin absolu/relatif exact, nombre total de lignes, taille en octets, premiers titres/extraits, confirmation de présence dans l'arborescence.
2. **Preuve de Modification de Code :** Extraits des lignes modifiées, comparaison avant/après, ou diff synthétique.
3. **Preuve de Build :** Logs de sortie exacts des commandes de compilation (ex: `npm run build` ou `compile_applet`).
4. **Preuve de Typage / Lint :** Résultat exact de `tsc --noEmit` ou `lint_applet`.
5. **Preuve de Test :** Rapport d'exécution des suites de tests unitaires ou d'intégrité.

---

## 5. Obligations de l'Agent IA

### Obligations Avant Modification
- Effectuer un audit préalable de la codebase et vérifier l'existence des fichiers cibles via `view_file` ou `list_dir`.
- Ne jamais supposer le contenu d'un fichier sans l'avoir lu.
- S'assurer que le Core gelé (`proofService.ts`, `credibilityService.ts`, `collusionService.ts`) ne sera pas altéré sauf autorisation explicite dans la spécification.

### Obligations Après Modification
- Exécuter la vérification de type (`tsc` / `lint_applet` / `compile_applet`).
- Capturer et rapporter les preuves d'exécution.
- Réparer immédiatement toute régression constatée.

### Obligations Avant Chaque Rapport
- Vérifier le Contrat d'Honnêteté.
- S'assurer qu'aucune affirmation n'est présentée sans sa preuve formelle.

---

## 6. Mécanismes Anti-Hallucination & Preuves

### Mécanisme de Preuve d'Existence des Fichiers
Toute déclaration sur la présence ou création d'un fichier nécessite :
- Chemin d'accès exact dans le projet ;
- Nombre exact de lignes ;
- Extrait des premières lignes / titres ;
- Validation de la présence via outil de lecture/arborescence.

### Mécanisme de Preuve des Modifications
Toute modification doit citer le bloc exact de code modifié ou les fonctions impactées, avec confirmation que la modification est active.

### Mécanisme de Preuve des Builds & Tests
L'agent doit exécuter les outils de validation et fournir l'état du statut de sortie (succès ou échec avec logs).

---

## 7. Cas où une Affirmation est Strictement Interdite

Il est STRICTEMENT INTERDIT d'affirmer qu'une tâche est terminée si :
1. Les fichiers modifiés/créés n'ont pas été vérifiés par un outil de lecture post-création.
2. La compilation TypeScript ou le build échoue ou n'a pas été réexécuté après les modifications.
3. Des hypothèses non testées sont qualifiées de "fonctionnelles".
4. Le Core gelé a été modifié à l'insu des contraintes de l'application.

---

## 8. Format Standard des Rapports

Chaque rapport d'exécution doit suivre la structure suivante :

```markdown
1. Audit Initial & État Réel de la Codebase
   - Éléments vérifiés (avec preuves)
   - Éléments non vérifiés

2. Plan d'Exécution Réalisé
   - Objectifs traités
   - Périmètre exact
   - Exclusions explicites

3. Exécution Réelle (Action par Action)
   - Fichier concerné
   - Type d'action (Création / Modification / Suppression)
   - Résumé factuel

4. Preuves d'Exécution (Obligatoires)
   - Fichiers créés (chemins, lignes, extraits)
   - Fichiers modifiés
   - Résultats des commandes (Build, Lint, Typecheck)

5. Limites & Travail Restant
   - Ce qui reste à faire
   - Risques connus

6. Auto-Vérification d'Honnêteté
   - Réponses explicites aux 4 questions d'auto-vérification

7. Décision Finale
   - 🟢 BLOC GELABLE
   - 🟡 BLOC À REVOIR
   - 🔴 BLOC NON EXÉCUTÉ
```

---

## 9. Sanctions Logiques & Interdictions

- **Règle du blocage :** Interdiction absolue de conclure avec un statut `🟢 BLOC GELABLE` ou `GO` tant que des preuves sont absentes, incomplètes ou falsifiées.
- **Rétrogradation immédiate :** En cas d'affirmation non prouvée, le statut du bloc bascule automatiquement en `🟡 BLOC À REVOIR` ou `🔴 BLOC NON EXÉCUTÉ`.

---

## 10. Versioning & Changelog

- **v1.0.0 (2026-08-05) :** Création et officialisation du protocole IA-FIRST EPP pour WORK PROOF OS v1.6. Intégration de la gouvernance stricte anti-hallucination.
