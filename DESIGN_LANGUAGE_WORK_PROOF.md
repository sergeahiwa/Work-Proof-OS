# VISUAL OPERATING LANGUAGE — WORK PROOF OS (v1.5.0+)

**Document de Référence UX/UI & Design System (Single Source of Truth - SSOT)**  
**Statut :** OFFICIEL ET FIGÉ  
**Auteur :** Lead Product Designer & UX Architect  

---

## 1. Philosophie Visuelle

### 1.1 Émotion Recherche & Positionnement Psychologique
Work Proof est un **Système d'Exploitation de la Preuve de Travail (Work Proof OS)**. L'expérience visuelle ne cherche pas la distraction, la dopamine artificielle ou l'auto-promotion déclarative. Elle installe un sentiment de **rigueur, de clarté factuelle et de dignité professionnelle**.

- **Pour l'utilisateur (Talent / Professionnel) :** Sentiment d'ancrage, d'accomplissement tangible et de souveraineté sur son parcours. Chaque action documentée n'est pas un post marketing, mais un *actif factuel de compétence* accumulé au fil du temps.
- **Pour le recruteur / évaluateur :** Impression immédiate de sérénité et d'efficacité auditable. Réduction de la charge mentale d'évaluation : la donnée est certifiée, structurée en Causalité -> Action -> Impact, et affranchie du bruit déclaratif.

### 1.2 Différence Fondamentale avec les Plateformes Existantes

| Dimension | Réseaux Sociaux Pro (ex: LinkedIn) | ATS / CV Numérique | Work Proof OS |
| :--- | :--- | :--- | :--- |
| **Paradigme** | Flux d'opinion & vanité sociale | Document statique unilatéral | Registre d'actifs de travail auditable |
| **Unité d'Échange** | Posts, likes, commentaires | Lignes de texte non vérifiées | Preuves d'impact certifiées par consensus |
| **Esthétique** | Fil d'actualité continu & pubs | Tabulaire administratif / PDF | Cartographie d'empreinte opérationnelle & Sceaux |
| **Trust Model** | Auto-déclaratif (Zero-Proof) | Déclaratif + Vérification manuelle tardive | Preuve causale immédiate + Validation par pairs $O(1)$ |

---

## 2. Métaphores Visuelles Propriétaires

L'interface de Work Proof s'articule autour de 5 métaphores visuelles fondamentales :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           1. L'EMPREINTE DE TRAVAIL                     │
│               [ Preuve Causalité -> Action -> Résultat ]                │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             2. LE SCEAU DE CONSENSUS                    │
│                 [ Validation par Pairs / Superviseurs ]                 │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       3. LA TRAJECTOIRE D'IMPACT                        │
│            [ Accumulation Temporelle de Crédibilité Factionnée ]        │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **L'Empreinte (The Work Proof Object) :** La preuve est traitée visuellement comme un *bloc scellé*. Elle possède une masse visuelle, une structure tripartite stricte (Contexte -> Contribution -> Résultat Measurable), et un statut cryptographique/consensus.
2. **Le Sceau de Consensus (The Consensus Seal) :** La validation par un pair ou un superviseur n'est pas un "like" ou une recommandation floue. C't un *estampillage d'authenticité* apportant du poids à la preuve sans altérer la donnée d'origine.
3. **La Trajectoire d'Impact (The Impact Trajectory) :** La carrière n'est pas une liste verticale de dates, mais un vecteur d'empreinte où chaque nœud est ancré dans une réalisation vérifiée.
4. **L'Indice de Clarté (Clarity Index) :** La crédibilité globale est restituée comme un signal de haute fréquence, sobre, mesuré et exempt de fioritures décoratives.

---

## 3. Système de Couleurs Métier

Le système de couleurs est strictement sémantique. Aucune couleur n'est employée à titre purement décoratif.

```
Dark Canvas:      #090D16 (Fond principal high-contrast)
Surface Elev-1:   #111726 (Cartes et conteneurs)
Surface Elev-2:   #1B2438 (Composants interactifs)
Primary Accent:   #3B82F6 (Bleu Vérité / Focus)
Verified Gold:    #F59E0B (Consensus & Crédibilité Validée)
Success Green:    #10B981 (Sceau Approuvé)
Warning Amber:    #F59E0B (Mode Démo / Clarification requise)
Dispute Red:      #EF4444 (Litige / Signification d'Anomalie)
```

### Palette Sémantique Exhaustive

| Rôle Visuel | Code Hex | Dark Mode Usage | Signification Métier |
| :--- | :--- | :--- | :--- |
| **Deep Canvas** | `#090D16` | Fond d'écran principal | Stabilité, profondeur, focalisation sur la preuve |
| **Surface Card** | `#111726` | Fond de Proof Card, Profil | Conteneur d'actif de travail |
| **Surface Border** | `#1E293B` | Frontières 1px nettes | Délimitation stricte des blocs de preuve |
| **Text Primary** | `#F8FAFC` | Titres, résultats, métriques | Lisibilité maximale sans éblouissement |
| **Text Muted** | `#94A3B8` | Contextes, métadonnées | Informations de second niveau |
| **Proof Draft** | `#64748B` | État "Créée / En attente" | Preuve en cours de structuration |
| **Proof Verified** | `#10B981` | État "Validée par Pairs" | Sceau d'authenticité apposé |
| **Proof Disputed** | `#EF4444` | État "Litige / Contestée" | Signalement actif en arbitrage Admin |
| **Demo Flag** | `#F59E0B` | Banner "Mode Démonstration" | Dispositif d'avertissement hors données réelles |

---

## 4. Typographie & Rythme Scalaire

### 4.1 Familles Typographiques
- **Titres & Identité :** `Plus Jakarta Sans` ou `Inter Display` (Font Weight 800/900, Majuscules suivies, Tracking resserré `-0.03em`). Transmet autorité et structure.
- **Corps de texte & Preuves :** `Inter` ou `Plus Jakarta Sans` (Font Weight 400/500, Line Height `1.6`). Lisibilité optimale des explications causales.
- **Métriques & Identifiants :** `JetBrains Mono` ou `Fira Code` (Font Weight 600, Monospace). Pour les identifiants de preuve, scores et données d'audit.

### 4.2 Échelle Typographique (Major Third - Ratio 1.25)
- **Display 1 (Scores & Accroches) :** 48px / 1.1 / Black
- **Heading 1 (Titres de Section) :** 32px / 1.2 / ExtraBold
- **Heading 2 (Titres de Cartes) :** 24px / 1.3 / Bold
- **Body Regular (Descriptions Causalité) :** 16px / 1.6 / Medium
- **Caption & Tags (Métadonnées & Badges) :** 12px / 1.4 / Monospace Bold Uppercase

---

## 5. Composants Fondamentaux Work Proof

### 5.1 Proof Card (Carte de Preuve d'Impact)
- **Objectif :** Restituer une réalisation sous la forme d'un actif autonome et vérifiable.
- **Structure Visuelle :**
  1. *Header :* Titre du projet + Badge d'état de validation (Validé / En attente / Litige).
  2. *Corps Tripartite (Causalité) :* 
     - **Contexte / Problème :** Encart sobre (`bg-surface/50`).
     - **Action Spécifique :** Texte mis en avant.
     - **Résultat Mesurable :** Métrique chiffrée en typographie Monospace d'accent.
  3. *Footer :* Nombre de validations par pairs, rôle du contributeur, date d'ancrage.

### 5.2 Validation Card (Carte de Sceau de Pair)
- **Objectif :** Afficher l'empreinte d'un validateur (Pair / Superviseur / Client).
- **Structure Visuelle :** Avatar du validateur, nom, titre, rôle au moment des faits, statut de la validation (`Approuvé` / `Réserves`), et poids de la validation dans le consensus.

### 5.3 Credibility Score Indicator (Indicateur de Crédibilité)
- **Objectif :** Afficher le score d'impact global sans esthétique "gamifiée" enfantine.
- **Structure Visuelle :** Valeur numérique nette (ex: `842 PTS`) encadrée par un anneau de distribution factuelle, accompagnée d'un indicateur de fraîcheur des validations.

### 5.4 Trust Indicator (Signal de Confiance Réseau)
- **Objectif :** Visualiser la densité et la diversité des validations obtenues par l'utilisateur.
- **Structure Visuelle :** Barre de répartition tri-catégorielle (Pairs / Superviseurs / Clients) avec ratio de consensus.

### 5.5 Timeline de Réalisation (Trajectoire d'Impact)
- **Objectif :** Remplacer l'historique de postes par un axe chronologique de jalons prouvés.
- **Structure Visuelle :** Ligne verticale continue avec nœuds ancrés. Seules les preuves validées génèrent un nœud vert ou doré.

### 5.6 Identity Profile (Souveraineté Talent)
- **Objectif :** Présenter le profil sous l'angle du portefeuille d'empreintes et de compétences vérifiées.
- **Structure Visuelle :** En-tête épuré avec Score de Crédibilité, rôle principal, badges de consensus et onglets d'empreinte.

### 5.7 Opportunity Match Card (Match d'Opportunité Recruteur)
- **Objectif :** Présenter la adéquation entre les exigences réelles d'un poste et les preuves vérifiées du candidat.
- **Structure Visuelle :** Taux de couverture par preuves validées (ex: `85% des compétences requises adossées à une preuve réelle`).

### 5.8 Admin Review Card (Arbitrage & Litiges)
- **Objectif :** Permettre l'inspection rapide d'une anomalie détectée ou d'un litige ouvert.
- **Structure Visuelle :** Encart bicolore d'alerte (`Dispute Red`), historique des réclamations, lien vers les preuves associées et boutons d'action d'arbitrage manuel.

---

## 6. Motion Design & Micro-interactions

Les animations sont exclusivement fonctionnelles. Elles apportent du feedback physique sur les opérations d'ancrage et de validation.

1. **Validation par Pair (The Stamp Effect) :**
   - *Trigger :* Clic sur "Valider Preuve".
   - *Animation :* Micro-compression (scale 0.98 -> 1.0) suivie de l'apparition en fondus de l'icône de sceau (`ShieldCheck`) avec transition de couleur vert/or. Durée : 200ms (`ease-out`).
2. **Filtrage & Switch d'Onglet :**
   - *Transition :* Glissement latéral fluide des cartes avec `motion` (délai étagé de 30ms par carte).
3. **Mise à Jour du Score :**
   - *Animation :* Incrémentation numérique animée (counter flip) et brève lueur d'accentuation sur le conteneur du score.

---

## 7. Iconographie & Illustration

- **Style d'Icônes :** Bibliothèque unique `lucide-react`. Trait de 1.75px ou 2px d'épaisseur. Pas d'icônes pleines ou d'illustrations 3D lourdes.
- **Icônes Métier Clés :**
  - `ShieldCheck` : Preuve validée / Sceau.
  - `GitBranch` / `Activity` : Trajectoire & Impact.
  - `Zap` : Action directe.
  - `Users` : Consensus & Réseau de confiance.
  - `Lock` / `FileCheck` : Immuabilité & Ancrage.
- **Style Visuel / Photos :** Avatars circulaires avec bordure n'excédant pas 2px. Bannière "Mode Démonstration" explicite et standardisée.

---

## 8. Responsive Design & Ergonomie

- **Desktop (≥ 1024px) :** Structure multi-colonnes (Navigation latérale / Flux central de preuves / Panneau d'impact & résumé de crédibilité).
- **Tablette (768px - 1023px) :** Structure 2 colonnes avec panneau latéral repliable.
- **Mobile (< 768px) :** Navigation basse fixe (Bottom Nav), cartes de preuves en pleine largeur avec cibles tactiles minimales de 44px × 44px.

---

## 9. Synthèse des Décisions Structurantes & Validation Humaine

### Décisions Structurantes Préservées :
1. **Intégrité Totale du Core :** Le présent document ne modifie aucune ligne de code et n'altère aucun invariant métier (`SYSTEM_CONTRACT_REALITY.md`).
2. **Rejet de l'Esthétique Sociale Floue :** Suppression de tous les éléments de distraction type "feed social", "likes" sans valeur ou "badges cosmétiques".
3. **Clarté du Mode Démonstration :** Intégration dans le Design System d'un composant standardisé d'avertissement pour les profils/données d'exemple.

### Points Soumis à Validation Humaine pour Implémentation Future :
- Approbation officielle du thème sombre par défaut (`#090D16`) pour la version Staging/Prod.
- Ordre de priorité des chantiers d'intégration UI (Recommandation : 1. Proof Card, 2. Profile View, 3. Network Validation, 4. Recruiter & Admin).
