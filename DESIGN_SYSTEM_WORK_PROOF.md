# DESIGN SYSTEM OFFICIEL — WORK PROOF OS (v1.5.0+)

**Document de Spécification Opérationnelle Design System & Architecture UI**  
**Statut :** OFFICIEL & FIGÉ (Single Source of Truth - SSOT)  
**Rôle :** Lead Product Designer & Design System Architect  
**Version Applicative Alignée :** v1.5.0-staging  

---

## 1. DESIGN SYSTEM PRINCIPLES

Le Design System de Work Proof OS repose sur 6 principes cardinaux guidant chaque décision de mise en page, de composant et d'état visuel.

### 1.1 Philosophie UX Fondamentale : "The Proof Operating System"
Work Proof n'est ni un réseau social, ni un CV statique, ni une vitrine marketing. C'est un **Système d'Exploitation de la Preuve de Travail**. L'interface est conçue comme un registre d'actifs opérationnels auditable. L'esthétique vise l'autorité, la clarté factuelle, l'immuabilité et la sobriété professionnelle.

### 1.2 Principes de Composition
- **Hiérarchie par la masse et la structure :** Les conteneurs visuels possèdent une structure tripartite stricte (Contexte -> Action -> Impact). La saillance visuelle est réservée aux faits vérifiés et au consensus.
- **Grille & Rhythme Mathématique :** Utilisation d'un système de grille stricte à 8px. Alignements au pixel, bordures 1px haute précision (`#1E293B`) et absence de cartes flottantes floues sans conteneur explicite.

### 1.3 Règle "Preuve > Narration"
- **Priorité à l'Actif :** Les faits mesurables et les validations priment toujours sur le récit subjectif.
- **Structure Causalité Obligatoire :** Une description de travail ne peut exister sans articulation causale (Problème / Action Spécifique / Résultat Chiffré). Le texte déclaratif non étayé est relégué visuellement en second plan.

### 1.4 Règle "Zéro Vanity"
- **Absence totale de métriques sociales :** Aucun bouton "Like", aucun compteur de vues, aucun indicateur de popularité, aucun badge cosmétique.
- **Seuls Signaux Autorisés :** Le score d'impact déterministe, le volume de preuves ancrées, le niveau de consensus humain (validations par pairs/superviseurs/clients) et l'indice de clarté.

### 1.5 Règle "Décision > Exploration"
- **Charge mentale minimale pour l'évaluateur :** L'interface doit permettre à un recruteur ou un auditeur de vérifier un candidat en moins de 15 secondes.
- **Accès direct aux preuves :** Les résultats mesurables sont isolés visuellement via une typographie Monospace d'accentuation (`JetBrains Mono`).

### 1.6 Règles de Densité Informationnelle
- **Aération sans vide :** Contraste élevé entre la donnée primaire (titres, résultats) et la métadonnée (dates, rôles, identifiants).
- **Proportion des rembourrages :** Les marges internes (`padding`) des conteneurs principaux égalent ou dépassent systématiquement l'espacement entre les éléments enfants (`gap`).

---

## 2. DESIGN TOKENS

Les tokens sont les variables fondamentales d'habillage. Aucune valeur brute (`hardcoded color/size`) n'est autorisée hors de ces définitions.

### 2.1 Color Tokens (Thème Sombre Haute Définition)

| Token Name | Hex Code | Usage Autorisé | Usage Interdit |
| :--- | :--- | :--- | :--- |
| `color-bg-canvas` | `#090D16` | Fond d'écran principal de l'application. | Fond de carte ou de bouton. |
| `color-surface-card` | `#111726` | Arrière-plan des Proof Cards, Profil, Block. | Fond principal d'application. |
| `color-surface-elevated` | `#1B2438` | Composants interactifs, survols, champs. | Cartes passives. |
| `color-border-subtle` | `#1E293B` | Bordures 1px de cartes et de séparateurs. | Masquer les contours de preuves. |
| `color-text-primary` | `#F8FAFC` | Titres, résultats mesurables, scores principaux. | Métadonnées de second plan. |
| `color-text-muted` | `#94A3B8` | Contextes, légendes, dates, descriptions. | Titres de preuves ou résultats. |
| `color-primary-accent` | `#3B82F6` | Liens actifs, focus de saisie, sélection. | Badges de validation ou alertes. |
| `color-validation-verified` | `#10B981` | Badges de preuve validée, sceau de consensus. | Alertes d'anomalies ou mode démo. |
| `color-validation-gold` | `#F59E0B` | consensus à fort poids, score de crédibilité. | Erreurs système ou litiges. |
| `color-status-disputed` | `#EF4444` | Litiges actifs, anomalies de collusion, erreurs. | Preuves en attente normales. |
| `color-demo-warning` | `#F59E0B` | Bannière "Mode Démonstration" & indicateurs. | Profils et preuves réelles. |

### 2.2 Typography Tokens

- **Font Families :**
  - `font-display` : `Plus Jakarta Sans`, sans-serif (Titres, En-têtes, Identité)
  - `font-body` : `Inter`, sans-serif (Corps de texte, Descriptions)
  - `font-mono` : `JetBrains Mono`, monospace (Scores, Métriques, IDs de Preuve, Audits)

- **Typography Scale :**

| Token Name | Font Size | Line Height | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display-xl` | 48px (3rem) | 1.1 | 800 (ExtraBold) | `-0.03em` | Credibility Score global, Hero metrics |
| `text-heading-lg` | 32px (2rem) | 1.2 | 800 (ExtraBold) | `-0.02em` | Titres de pages principales |
| `text-heading-md` | 24px (1.5rem) | 1.3 | 700 (Bold) | `-0.01em` | Titres de sections, nom de candidat |
| `text-heading-sm` | 18px (1.125rem) | 1.4 | 600 (SemiBold) | `0em` | Titres de Proof Cards |
| `text-body-md` | 16px (1rem) | 1.6 | 400 (Regular) | `0em` | Corps de texte, explications causales |
| `text-caption-mono` | 12px (0.75rem) | 1.4 | 700 (Bold) | `0.05em` UPPERCASE | Badges, IDs de preuve, Sceaux |

### 2.3 Spacing System (Base 8px)
- `space-1` (4px) : Alignements ultra-tassés (icône + texte).
- `space-2` (8px) : Espacement interne des badges et puces.
- `space-3` (12px) : Écart entre champs de saisie et labels.
- `space-4` (16px) : Padding interne minimal des conteneurs et cartes.
- `space-6` (24px) : Padding standard des Proof Cards et écarts de blocs.
- `space-8` (32px) : Séparation de sections majeures dans une page.
- `space-12` (48px) : Marges de page et grands conteneurs Desktop.

### 2.4 Shape & Elevation Tokens
- **Border Radius :**
  - `radius-sm` : 6px (Badges, boutons secondaires, puces Monospace)
  - `radius-md` : 10px (Champs de formulaire, cartes secondaires)
  - `radius-lg` : 16px (Proof Cards, conteneurs principaux, modales)
  - `radius-full` : 9999px (Pills d'état, avatars)
- **Bordures :**
  - `border-thin` : `1px solid var(--color-border-subtle)`
  - `border-verified` : `1px solid rgba(16, 185, 129, 0.3)`
  - `border-disputed` : `1px solid rgba(239, 68, 68, 0.4)`
- **Ombres / Élevations :**
  - `shadow-card` : `0 4px 20px -2px rgba(0, 0, 0, 0.5)`
  - `shadow-glow-verified` : `0 0 15px -3px rgba(16, 185, 129, 0.15)`

---

## 3. CORE UI COMPONENTS

Chaque composant UI est défini par son rôle produit, sa structure, ses états et ses règles UX.

### 3.1 Proof Card
- **Objectif :** Encapsuler une réalisation professionnelle sous la forme d'un actif autonome vérifiable.
- **Rôle Produit :** Brique élémentaire de Work Proof OS.
- **Structure (Obligatoire Tripartite) :**
  1. *Header :* Titre de la réalisation + Badge d'état de validation (Approuvé / En attente / Litige).
  2. *Corps Causal :*
     - **Contexte :** Problème initial (`bg-surface-elevated/40`, texte muted).
     - **Action Spécifique :** Description précise de l'intervention de l'utilisateur.
     - **Résultat Mesurable :** Encart dédié mettant en valeur la métrique chiffrée (`JetBrains Mono`, couleur verte/or).
  3. *Footer :* Indicateur du nombre de validations reçues, date d'ancrage, bouton "Inspecter les Sceaux".
- **États Possibles :** Draft, Pending Validation, Verified (Consensus), Disputed.
- **Règles UX :** Le résultat ne peut pas être omis. S'il n'y a pas de métrique chiffrée, la carte affiche un avertissement de force faible.

### 3.2 Validation Seal (Sceau de Consensus)
- **Objectif :** Matérialiser l'attestation apportée par un pair, un manager ou un client.
- **Rôle Produit :** Unité de confiance qui alimente le score de crédibilité.
- **Structure :** Avatar du validateur, Nom + Titre professionnel, Rôle lors des faits (Pair / Superviseur / Client), Poids transactionnel de la validation (`weight`), Statut (`Approuvé`).
- **États Possibles :** Active Seal, Revoked Seal, Pending Review.
- **Variantes :** Compact (Badge dans Proof Card) / Detailed (Dans la modale d'inspection d'audit).

### 3.3 Credibility Display
- **Objectif :** Restituer le score de crédibilité global sans esthétique de jeu vidéo.
- **Rôle Produit :** Signal synthétique de réputation professionnelle certifiée.
- **Structure :** Valeur numérique (`text-display-xl`, `JetBrains Mono`), Label `CRÉDIBILITÉ CERTIFIÉE`, Indicateur de fraîcheur des validations, Répartition par origines (Pairs / Managers / Clients).
- **Règles UX :** Doit afficher la mention "Calcul Transactionnel $O(1)$ - Source Consensus" au survol ou au clic.

### 3.4 Impact Timeline (Trajectoire d'Impact)
- **Objectif :** Remplacer le déroulé chronologique de postes par un axe temporel de jalons prouvés.
- **Rôle Produit :** Visualisation de la régularité et de la progression de la valeur créée.
- **Structure :** Ligne verticale continue (`border-subtle`), nœuds ancrés avec horodatage. Seules les preuves ayant au moins 1 validation apparaissent comme des nœuds lumineux.

### 3.5 Opportunity Match Card
- **Objectif :** Présenter l'adéquation entre un profil et une opportunité de recrutement.
- **Rôle Produit :** Outil de décision rapide pour les recruteurs.
- **Structure :** Intitulé du rôle, Taux de couverture par preuves réelles (`% des compétences adossées à une preuve validée`), Liste des preuves correspondantes avec statut de confirmation.

### 3.6 Identity Profile Block
- **Objectif :** Présenter la carte d'identité professionnelle souveraine du talent.
- **Rôle Produit :** En-tête de profil officiel.
- **Structure :** Avatar, Nom, Métier principal, Localisation, Credibility Display synthétique, Badges de consensus majeurs, Lien de partage du registre.

### 3.7 Skill Evidence Badge
- **Objectif :** Valider une compétence non pas par auto-déclaration mais par liaison à une preuve.
- **Rôle Produit :** Puce de compétence certifiée.
- **Structure :** Nom de la compétence + Compteur de preuves associées (ex: `React (4 Preuves)`). Icône `ShieldCheck` si au moins une preuve est validée.

### 3.8 Empty State
- **Objectif :** Guider l'utilisateur lorsqu'aucune donnée n'existe encore.
- **Rôle Produit :** Incitation à l'action sans pression sociale.
- **Structure :** Icône de registre neutre (`FileCheck`), Titre explicatif, Description orientée action, Bouton d'action principal ("Documenter une première réalisation").

### 3.9 Loading State
- **Objectif :** Prévenir les sauts de mise en page (`layout shifts`) pendant le chargement Firestore.
- **Rôle Produit :** Squelettes de chargement (`Skeletons`) respectant la forme exacte des cartes finales.
- **Structure :** Bloc rectangulaire avec impulsion lumineuse douce (`animate-pulse`), couleur `bg-surface-elevated/50`.

### 3.10 Error State
- **Objectif :** Signaler clairement une rupture de chargement ou un refus de transaction.
- **Rôle Produit :** Composant de résilience.
- **Structure :** Encart bicolore sombre/rouge (`color-status-disputed`), Message explicatif neutre, Bouton "Réessayer la transaction".

---

## 4. DESIGN STATES

L'interface doit gérer de façon explicite et sans ambiguïté les 7 états fondamentaux de l'application :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          1. NOUVEL UTILISATEUR                          │
│          [ Invitation à l'Onboarding / Aucune Preuve Créée ]           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      2. PREUVE EN ATTENTE (PENDING)                     │
│         [ Preuve Structurée -> En Attente de Validation Pair ]          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      3. PREUVE VALIDÉE (CONSENSUS)                      │
│            [ Sceau Apposé -> Incrementation Transactionnelle ]          │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Nouvel Utilisateur :** Affichage d'un conteneur d'accueil épuré invitant à la création de la première preuve d'impact (parcours d'onboarding).
2. **Utilisateur sans Preuve :** Affichage de l'Empty State guidé sur le Dashboard et la vue Projets.
3. **Utilisateur avec Preuves Partielles :** Affichage des preuves créées mais non encore confirmées par le réseau de pairs. Score de crédibilité initial au niveau de base.
4. **Preuve en Attente (Pending) :** Badge `En Attente de Sceau` en couleur gris/neutre (`color-text-muted`).
5. **Preuve Validée (Verified) :** Badge `Validée par Pairs` en vert/or (`color-validation-verified`), lueur discrète sur la carte, score mis à jour.
6. **Preuve Contestée (Disputed) :** Encart rouge d'avertissement avec mention "En cours d'arbitrage par la console d'administration".
7. **Mode Démonstration :** Bannière d'avertissement ambre fixe en haut de page : `[MODE DÉMONSTRATION — Données simulées d'exemple]`.

---

## 5. RESPONSIVE SYSTEM

L'expérience doit s'adapter parfaitement aux contraintes d'affichage sans perte d'information factuelle.

### 5.1 Desktop (≥ 1024px)
- **Structure :** Layout à 3 colonnes :
  - *Gauche (260px) :* Navigation latérale fixe (Dashboard, Projets, Réseau, Opportunités, Admin).
  - *Centre (Flex 1, max-w-4xl) :* Flux principal de Proof Cards et de structuration.
  - *Droite (320px) :* Panneau d'impact, Credibility Display, résumé du réseau de confiance.
- **Densité :** Haute densité d'information, affichage simultané des métriques et des détails de causalité.

### 5.2 Tablette (768px - 1023px)
- **Structure :** Layout à 2 colonnes :
  - Navigation latérale réduite aux icônes ou volet escamotable.
  - Flux central de cartes fusionné avec le résumé d'impact en en-tête.

### 5.3 Mobile (< 768px)
- **Structure :** Layout mono-colonne :
  - Navigation fixe en bas d'écran (`Bottom Navigation Bar`) avec 4 onglets majeurs.
  - Cartes de preuves en pleine largeur.
  - Cibles tactiles d'action d'au moins `44px × 44px`.
  - Ordre de priorité visuelle : 1. Titre & Résultat mesurable, 2. Statut de validation, 3. Détails du contexte repliables.

---

## 6. MOTION DESIGN SYSTEM

Toute animation dans Work Proof OS doit avoir une justification ergonomique ou transactionnelle.

### 6.1 Animations Autorisées
- **The Stamp Effect (Apposition du Sceau) :**
  - *Trigger :* Action de validation d'une preuve par un pair.
  - *Comportement :* Micro-compression du bouton (scale 0.98 -> 1.0) sur 150ms, suivie de l'apparition en fondu du badge `ShieldCheck` avec transition de couleur vert/or sur 200ms (`ease-out`).
- **Counter Increment (Mise à jour du Score) :**
  - *Trigger :* Mise à jour du score de crédibilité après transaction Firestore.
  - *Comportement :* Animation fluide d'incrémentation numérique (flip-counter) sur 300ms.
- **Card Expansion / Filter Transition :**
  - *Comportement :* Re-disposition des cartes via `motion` layout animation avec délai étagé (`staggerChildren` 30ms).

### 6.2 Interdictions Absolues en Motion Design
- ❌ Aucune pluie de confettis ou d'animations de célébration type "gamification".
- ❌ Aucun effet d'impulsion sans fin ou de clignotement accrocheur ("attention grabbing").
- ❌ Aucune transition de page supérieure à 250ms.

---

## 7. ICONOGRAPHY SYSTEM

L'iconographie est unifiée et restreinte pour maintenir l'aspect technique et professionnel.

- **Bibliothèque Unique :** `lucide-react`.
- **Épaisseur de Trait :** `1.75px` ou `2.0px` (Constant).
- **Style :** Filaire neutre, pas d'icônes pleines ou d'illustrations 3D.

### 7.1 Cartographie des Symboles Métier

| Concept Métier | Icône Lucide | Usage |
| :--- | :--- | :--- |
| **Preuve d'Impact** | `FileCheck` / `ShieldCheck` | Cartes de preuves, statut de validation certifiée. |
| **Causalité & Action** | `Zap` / `Activity` | Section "Action Spécifique" d'une preuve. |
| **Résultat & Métrique** | `TrendingUp` / `Target` | Encart de résultat chiffré. |
| **Consensus & Pairs** | `Users` / `UserCheck` | Réseau de confiance, validations reçues. |
| **Litige / Anomalie** | `AlertTriangle` / `ShieldAlert` | Preuve contestée, détection de collusion. |
| **Horodatage & Trajectoire**| `Clock` / `GitBranch` | Ancrage temporel, timeline d'impact. |
| **Opportunité & Match** | `Briefcase` / `CheckCircle2` | Vues recruteur, correspondance de poste. |

---

## 8. PAGE COMPOSITION RULES

Chaque page principale suit une hiérarchie d'information stricte pour préserver la clarté.

### 8.1 Dashboard (Vue Générale)
1. *En-tête :* Credibility Display synthétique + Titre de bienvenue.
2. *Bloc Principal :* Créateur/Formulaire de structuration de preuve (Causalité -> Action -> Résultat).
3. *Flux Central :* Liste des preuves récentes triées par niveau de validation.
4. *Panneau Lateral :* Résumé de l'activité du réseau de confiance et recommandations d'ancrage.

### 8.2 Profile (Registre Public / Indépendant)
1. *En-tête :* Identity Profile Block avec score de crédibilité et badges majeurs.
2. *Axe Central :* Impact Timeline (Trajectoire d'impact).
3. *Filtres :* Tri des preuves par compétences certifiées.

### 8.3 Projects (Portfolio d'Actifs)
1. *En-tête :* Barre de recherche et filtres par statut de validation.
2. *Grille/Flux :* Grille de Proof Cards à haute densité.
3. *Avertissement :* Bannière "Mode Démonstration" si affichage de projets exemples.

### 8.4 Opportunities (Espace Recruteur)
1. *En-tête :* Filtres d'exigences par preuves requises.
2. *Flux :* Liste d'Opportunity Match Cards triées par taux de couverture par preuves validées.

### 8.5 Network (Réseau de Confiance)
1. *En-tête :* Résumé de la densité des validations envoyées/reçues.
2. *Bloc Action :* Interface de validation réciproque transactionnelle entre pairs.

### 8.6 Admin (Console d'Arbitrage)
1. *En-tête :* Onglets de supervision (Litiges, Anomalies Collusion, Audit Logs).
2. *Flux :* Admin Review Cards bicolores avec détails d'audit et boutons d'arbitrage.

---

## 9. IMPLEMENTATION GUIDELINES FUTURES

Directives obligatoires pour l'équipe de développement frontend lors de la future phase d'implémentation UI :

1. **Ordre Sequentiel de Création des Composants :**
   - Étape 1 : Tokens CSS & Variables Tailwind (`index.css`).
   - Étape 2 : Composants Atomiques (Badges, Buttons, Mono Displays, Empty States).
   - Étape 3 : Proof Card & Validation Seal.
   - Étape 4 : Layouts & Panneaux de Page.
2. **Dépendances Autorisées :**
   - `lucide-react` pour les icônes.
   - `motion/react` pour les transitions fonctionnelles.
   - `clsx` / `tailwind-merge` pour l'assemblage de classes.
3. **Convention de Nommage des Fichiers UI :**
   - Tous les nouveaux composants doivent être placés dans `/src/components/ui/` ou `/src/components/proof/`.
   - Nommage PascalCase strict (ex: `ProofCard.tsx`, `ValidationSeal.tsx`, `CredibilityDisplay.tsx`).

---

## 10. DESIGN SYSTEM INVARIANTS ("NON NEGOTIABLE")

La section suivante contient les règles absolues non négociables du Design System Work Proof OS. Tout manquement constitue un défaut critique :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RÈGLES NON NÉGOCIABLES                           │
│                                                                         │
│ 1. WORK PROOF N'EST PAS UN RÉSEAU SOCIAL.                               │
│ 2. AUCUN ÉLÉMENT VISUEL NE DOIT FAVORISER LA POPULARITÉ.                │
│ 3. AUCUN BADGE SANS PREUVE RÉELLE.                                      │
│ 4. AUCUN SCORE VISUEL SANS SOURCE MÉTIER OFFICIELLE.                    │
│ 5. L'INTERFACE DOIT TOUJOURS DISTINGUER :                               │
│    [ DÉCLARATION ]  vs  [ PREUVE ]  vs  [ VALIDATION ]                  │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Work Proof n'est pas un réseau social :** Interdiction d'ajouter des compteurs de likes, de partages, de commentaires libres ou de statuts d'humeur.
2. **Aucun élément visuel ne doit favoriser la popularité :** Pas de classements par nombre de connexions ou de followers.
3. **Aucun badge sans preuve réelle :** Un badge de compétence ne peut être affiché sans lien direct avec au moins une preuve enregistrée dans Firestore.
4. **Aucun score visuel sans source métier officielle :** Le score affiché doit provenir exclusivement de la propriété `impactScore` calculée par `credibilityService.ts`.
5. **Tripartition d'état obligatoire :** L'interface doit clairement étiqueter visuellement la différence entre :
   - **Déclaration :** Saisie utilisateur brute non encore structurée.
   - **Preuve :** Actif de travail structuré en Causalité -> Action -> Résultat.
   - **Validation :** Sceau d'attestation apposé par un tiers vérifié.
