# Work Proof OS (v1.6.0-pilot)

**Work Proof OS** est un système d'exploitation de preuve de travail souverain (*Proof of Work OS*) conçu pour transformer les réalisations professionnelles et techniques en preuves de valeur vérifiables, infalsifiables et transférables.

---

## 1. Vision du Produit & Positionnement

### Le Problème Résolu
Les réseaux sociaux professionnels traditionnels reposent sur la déclaration unilatérale (*CV déclaratif*), la réputation sociale non étayée (*likes*, endorsements mutuels de complaisance) et la vulnérabilité aux faux diplômes ou affirmations gonflées. 

### Le Positionnement Proof of Work
Work Proof OS remplace la déclaration passive par une **preuve active de réalisation** :
- **Attestation basée sur les faits :** Chaque réalisation est structurée, ancrée dans son contexte réel et associée à des métriques d'impact.
- **Différence majeure avec les réseaux sociaux classiques :** Pas de fil d'actualité fondé sur la popularité, pas de mécanismes d'engagement viral, pas de score de vanity. L'évaluation de la crédibilité est 100% déterministe et basée uniquement sur la chaîne de preuves et de validations humaines qualifiées.

---

## 2. État du Projet

- **Version actuelle :** `v1.6.0-pilot`
- **Statut opérationnel :** `PILOT_READY` / `REAL_FIELD_COLLECTION_READY`
- **Provenance des Données Terrain :**
  ```text
  REAL_FIELD_DATA = 0
  ```
  *(Zero donnée utilisateur réelle enregistrée en base. Environnement prêt pour la première cohorte du pilote terrain).*

---

## 3. Fonctionnalités Disponibles

- 📁 **Création & Gestion de Projets de Preuve :** Groupement des livrables, preuves et jalons par projet.
- 📐 **Captation Structurée STAR :** Rédaction guidée selon la méthodologie **STAR** (*Situation, Task, Action, Result*).
- 🤝 **Validation Humaine des Preuves :** Circuit de validation par des tiers de confiance qualifiés avec signature/attestation explicite.
- 🧮 **Credibility Score Déterministe :** Calcul transparent de la crédibilité (0-100) basé sur la fiabilité des données et les validations.
- 📊 **Tableau de Bord & Indicateurs :** Analyse visuelle des trajectoires d'impact et de l'historique de preuves.
- 🧭 **Parcours Utilisateur Dédiés :**
  - **Contributeur :** Capture, organisation et exportation de son passeport de compétences.
  - **Validateur :** Inspection impartiale, attestation et traçabilité des validations.
  - **Recruteur / Organisation :** Vérification rapide de l'authenticité des profils et des preuves.
- 🪐 **Module Satellite KAIROS :** Moteur de traduction de signaux et d'alignement contextuel des compétences.
- 📦 **Portabilité & Souveraineté :** Exportation intégrale du profil et des preuves au format **JSON** et certificat de preuve **PDF**.

---

## 4. Principes Fondamentaux (Invariants Produit)

Le système est verrouillé par 7 invariants architecturaux stricts :

1. **PROOF_FIRST :** Aucune valeur ou compétence n'est reconnue sans preuve ancrée.
2. **USER_SOVEREIGNTY_FIRST :** L'utilisateur possède 100% de ses données et peut les exporter ou révoquer à tout moment.
3. **AI_NO_SCORING :** Aucune intelligence artificielle ne calcule de score de crédibilité ni ne classe les individus.
4. **AI_OUTPUT_ADVISORY_ONLY :** Les suggestions fournies par l'IA (RIL) sont purement consultatives et d'aide à la rédaction.
5. **HUMAN_VALIDATION_REQUIRED :** Le changement d'état d'une preuve exige une validation humaine explicite.
6. **CORE_RIL_ISOLATION :** Découplage strict entre le moteur transactionnel central (*Core*) et la couche d'intelligence (*RIL*).
7. **CREDIBILITY_TRANSACTIONAL :** Les calculs de crédibilité sont réversibles, prévisibles et 100% déterministes.

---

## 5. Architecture Technique

- **Frontend :** Single Page Application (SPA) bâtie avec **React 18**, **TypeScript**, **Vite** et **Tailwind CSS**.
- **Backend & Persistence :** Service serverless **Firebase / Firestore** pour le stockage persistant et les règles de sécurité par rôle (`firestore.rules`).
- **Isolation Couche Métier / IA :**
  - Moteur transactionnel (`/src/core`) totalement indépendant et isolé.
  - Couche d'intelligence contextuelle (`/src/semantic-layer` / RIL) sans effet de bord sur le Core.

---

## 6. Installation & Démarrage Local

### Prérequis
- **Node.js :** v18+ ou v20+
- **npm :** v9+ ou v10+

### Procédure
1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/sergeahiwa/Work-Proof-OS.git
   cd Work-Proof-OS
   ```
2. **Installer les dépendances :**
   ```bash
   npm install
   ```
3. **Configurer l'environnement :**
   Se référer au fichier `.env.example` pour les variables nécessaires :
   ```bash
   cp .env.example .env
   ```
4. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

---

## 7. Structure du Dépôt

```text
Work-Proof-OS/
├── src/
│   ├── components/     # Composants UI (Dashboard, Proof, Portability, etc.)
│   ├── core/           # Moteur déterministe central (Core Invariants)
│   ├── modules/        # Modules métier (proofCapture, trust, valueEngine)
│   ├── pages/          # Vues principales (Landing, Dashboard, Profile, etc.)
│   ├── services/       # Services d'intégration (Firebase, PDF, Credibility)
│   └── types.ts        # Interfaces et contrats TypeScript globaux
├── scripts/            # Scripts de vérification contractuelle et d'architecture
├── docs/               # Archives et spécifications complémentaires
├── README.md           # Documentation officielle du dépôt (SSOT)
├── firestore.rules     # Règles de sécurité Firestore
└── package.json        # Manifeste de dépendances et scripts
```

---

## 8. Déploiement

- **Environnement de Pré-production / Pilote :** Hébergé sur **Google Cloud Run Container Engine** via **Google AI Studio Applet Runtime**.
- **Port Ingress :** `3000`
- **Infras & Proxy :** Routage Nginx reverse-proxy vers container Node.js.

---

## 9. Documentation associée

- 📄 `CAHIER_DES_CHARGES_CANONIQUE_WORK_PROOF_OS_v1.0.md` — Spécifications canoniques initiales.
- 📄 `VISION_PRODUIT_CANONIQUE_WORK_PROOF_OS_v1.0.md` — Vision produit et principes directeurs.
- 📄 `REALITY_INTELLIGENCE_SPEC.md` — Spécification de la couche Reality Intelligence (RIL).
- 📄 `TECHNICAL_VERIFICATION_SPEC.md` — Spécifications des contrôles de vérification technique.
- 📄 `RELEASE_NOTES_v1.6.0_PILOT.md` — Notes de version officielles pour la release v1.6.0-pilot.
- 📄 `RAPPORT_NEW_REPOSITORY_CREATION.md` — Rapport d'initialisation du nouveau dépôt officiel.

---

## 10. Gouvernance du Projet

- **Single Source of Truth (SSOT) :** Le dépôt `https://github.com/sergeahiwa/Work-Proof-OS.git` est la seule source officielle du code et de la documentation du projet.
- **Respect des Invariants :** Toute modification majeure ou contribution doit obligatoirement passer la suite de tests contractuels (`npm run lint`, `scripts/check-architecture.sh` et `npx tsx scripts/contract/verify-contract.ts`) pour maintenir les 7 invariants du système.
