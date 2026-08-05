# STAGING BASELINE v1.5.0 — Work Proof OS

**Date de création :** 3 août 2026  
**Version applicative :** v1.5.0-staging  
**Statut :** DOCUMENT OFFICIEL DE RÉFÉRENCE / FIGÉ  

---

## 1. Périmètre Officiel de la Release v1.5.0

La version **v1.5.0 Staging** constitue la baseline officielle stabilisée de Work Proof OS. Le périmètre fonctionnel réel vérifié dans le code comprend :

1. **Authentification & Session Utilisateur :**
   - Intégration Firebase Auth (Email/Mot de passe et Google Sign-In via `FirebaseProvider.tsx`).
   - Gestion d'état de session réactif (`useAuth`) avec persistance et déconnexion propre.

2. **Onboarding Interactif & Persistant :**
   - Parcours en 5 étapes (`Onboarding.tsx`) avec capture d'identité (Nom, Métier), compétences, et première réalisation/preuve d'impact.
   - Sauvegarde réelle dans Firestore : profil dans `users/{uid}` via `setDoc` et première réalisation dans `users/{uid}/projects` via `addDoc`.
   - Mode de secours `localStorage` (`wp_onboarding_profile`) hors session active.

3. **Moteur Core de Structuration de Preuve (`proofService.ts`) :**
   - Traitement déterministe Causalité / Action / Résultat avec calcul de score de force déterministe.
   - Enrichissement et reformulation par IA optionnelle (`Gemini API` via `geminiService.ts`) strictement limitée à la qualité rédactionnelle sans impact sur le score.

4. **Moteur Transactionnel de Crédibilité (`credibilityService.ts`) :**
   - Exécution des validations de preuves exclusivement par transactions atomiques Firestore (`runTransaction`).
   - Calcul déterministe et pondéré des scores de crédibilité sur la base unique du consensus humain (pairs, superviseurs, clients).
   - Invariant strict : l'IA et la détection de collusion n'altèrent jamais le score.

5. **Validation Réseau entre Pairs (`Network.tsx`) :**
   - Interface de réseau de confiance permettant la validation transactionnelle réelle de preuves via `addProofValidation` dans Firestore.
   - Incrémentation transactionnelle et affichage réactif des points de crédibilité.

6. **Espace Projets & Réalisations (`Projects.tsx`) :**
   - Publication, consultation et filtrage des projets réels enregistrés dans la collection Firestore de l'utilisateur.
   - Détection automatique et affichage explicite d'une bannière "Mode Démonstration" en l'absence de données réelles.

7. **Tableau de Bord Recruteur (`RecruiterDashboard.tsx`) :**
   - Consultation des candidats avec filtres d'impact et de réputation.
   - Mode démonstration sécurisé et explicite pour les profils simulés.

8. **Console Admin & Arbitrage (`AdminDashboard.tsx`) :**
   - Espace de supervision avec onglets Métriques, Litiges, Analyse de Fraude / Collusion (mode passif), Glossaire et Multi-tenancy.
   - Résolution et arbitrage manuel des litiges avec traçabilité d'action.

9. **Couche CI & Verification de Contrat (`scripts/contract/verify-contract.ts`) :**
   - Script d'enforcement CI vérifiant statiquement les 3 invariants du système (`COLLUSION_PASSIVE`, `AI_NO_SCORING`, `CREDIBILITY_TRANSACTIONAL`).

---

## 2. Fonctionnalités Volontairement Absentes

Afin de préserver la philosophie du système et la sécurité contractuelle, les éléments suivants **ne sont pas présents** dans la v1.5.0 :

1. **Décision Automatique par l'IA :** Aucun composant IA ne valide, ne refuse ou ne pénalise automatiquement une preuve ou un profil (interdiction contractuelle selon `SYSTEM_CONTRACT_REALITY.md`).
2. **Sanction Automatique pour Collusion :** Le service `collusionService.ts` fonctionne en mode passif (génération de logs d'anomalies dans la collection `anomalies`). Il ne bloque aucun compte et ne réduit aucun score automatiquement.
3. **Recalcul Frontend Global des Scores :** Aucun scan $O(N)$ n'est exécuté côté client. Les scores sont mis à jour incrémentalement de façon transactionnelle $O(1)$.
4. **Signature Cryptographique Blockchain / Export PDF :** L'export cryptographique ou la certification blockchain est hors périmètre pour la v1.5.0 (prévu pour v2.0+).

---

## 3. Parcours Utilisateur Réellement Opérationnels

| Parcours | Étapes Opérationnelles | Statut |
| :--- | :--- | :--- |
| **Auth & Onboarding** | Inscription/Connexion -> Parcours 5 étapes -> Ecriture Firestore `users/{uid}` & `users/{uid}/projects` -> Redirection Dashboard | ✅ 100% Opérationnel |
| **Création de Preuve** | Formulaire de saisie -> Analyse de force déterministe -> Sauvegarde Firestore -> Mise à jour profil | ✅ 100% Opérationnel |
| **Validation Réseau (Peer)** | Recherche pair -> Action "Valider Preuve" -> Execution `runTransaction` Firestore (`addProofValidation`) -> Score incrémenté | ✅ 100% Opérationnel |
| **Arbitrage Litiges Admin** | Accès Admin -> Consultation litiges ouverts -> Action "Marquer comme Traité" -> Mise à jour état | ✅ 100% Opérationnel |

---

## 4. Parcours Partiels

| Parcours | Description de la Limitation | Stratégie & Mode |
| :--- | :--- | :--- |
| **Consultation Recruteur** | Les candidats affichés combinent des données réelles et des jeux d'exemple de démonstration. | Identification explicite via la bannière "Mode Démonstration". |
| **Détection Collusion** | Les anomalies sont enregistrées dans Firestore (`anomalies`) mais ne déclenchent pas de suspension automatique. | Traitement en mode audit passif conforme au contrat. |

---

## 5. Cartographie des Sources de Vérité

| Domaine | Source Officielle | Service Responsable | Collection Firestore | Composants Consommateurs |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | Firebase Authentication (`auth`) | `FirebaseProvider.tsx` | N/A (SDK Auth) | `App.tsx`, `Header.tsx`, `Dashboard.tsx`, `Onboarding.tsx` |
| **Utilisateurs / Profils** | Firestore Collection | `FirebaseProvider.tsx` (`useAuth`) | `users/{uid}` | `Dashboard.tsx`, `Onboarding.tsx`, `Header.tsx`, `Network.tsx` |
| **Projets / Réalisations** | Firestore Sous-collection | Firestore SDK / `Projects.tsx` | `users/{uid}/projects` | `Projects.tsx`, `Dashboard.tsx` |
| **Preuves (Proofs)** | Firestore Collection | `proofService.ts` | `proofs` | `Projects.tsx`, `Dashboard.tsx`, `RecruiterDashboard.tsx` |
| **Score de Crédibilité** | Propriété profil `impactScore` | `credibilityService.ts` (`runTransaction`) | `users/{uid}` | `Dashboard.tsx`, `Network.tsx`, `RecruiterDashboard.tsx` |
| **Validations** | Firestore Sous-collection | `credibilityService.ts` (`addProofValidation`) | `proofs/{proofId}/validations` | `Network.tsx`, `Dashboard.tsx` |
| **Anomalies / Collusion** | Firestore Collection | `collusionService.ts` | `anomalies` | `AdminDashboard.tsx` |
| **Logs d'Audit** | Firestore Collection | `proofService.ts` / `credibilityService.ts` | `audit_logs` | `AdminDashboard.tsx` |

---

## 6. Cartographie des Modes Démonstration

Toutes les vues intégrant des données simulées comportent un indicateur visuel non ambigu :

- **`Dashboard.tsx` :** Affiche une bannière `Mode Démonstration` (`bg-amber-500/10 border-amber-500/30`) lorsque l'utilisateur est déconnecté ou n'a pas encore de profil Firestore.
- **`Projects.tsx` :** Affiche une bannière `Mode Démonstration` en cas d'absence de projets réels dans la sous-collection Firestore du compte.
- **`Network.tsx` :** Présente la bannière `Mode Démonstration` lorsque le réseau de pairs est issu des données d'exemple.
- **`RecruiterDashboard.tsx` :** Affiche la bannière `Mode Démonstration` pour notifier que les dossiers candidats présentés sont des profils de démonstration.
- **`AdminDashboard.tsx` :** Comporte la bannière `Mode Démonstration` pour la console d'administration simulée.

---

## 7. Dette Technique Restante

Toutes les dettes identifiées ont été auditées et classées :

| Identifiant | Description | Impact | Priorité | Décision |
| :--- | :--- | :--- | :--- | :--- |
| **DT-01** | Typage strict de `ProofValidation` dans `types.ts` exigeant `proofId` et `weight`. | Résolu dans `Network.tsx` (aligné sur le typage officiel). | Basse | **Corrigé** |
| **DT-02** | Absence d'un repository `.git` dans le container Cloud Run. | Versioning matérialisé par `package.json` (`1.5.0`), `P0_FREEZE_BASELINE.md` et `sync-log.md`. | Basse | **Documenté (Reporté v1.6)** |
| **DT-03** | Rôles d'administration gérés au niveau applicatif et non restreints par RBAC strict dans `firestore.rules`. | Sécurité assurée par authentification requise. | Moyenne | **Documenté (Prévu v1.6)** |

---

## 8. Recommandations

1. **Recommandation CI :** Maintenir l'exécution systématique du script `npx tsx scripts/contract/verify-contract.ts` dans les pipelines de déploiement continu Staging/Prod.
2. **Recommandation Sécurité :** Configurer les Firebase Custom Claims pour le rôle `admin` afin d'appliquer un filtrage RBAC natif au niveau de `firestore.rules` en phase v1.6.
3. **Recommandation Scalabilité :** Conserver la structure transactionnelle $O(1)$ dans `credibilityService.ts` pour toute future évolution du moteur de scoring.
