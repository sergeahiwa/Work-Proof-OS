# REVUE HUMAINE DES SUBSTITUTIONS LEXICALES UI — PHASE 6D3.1

**Projet :** Work Proof OS v1.6.0-pilot  
**Dépôt SSOT Officiel :** `https://github.com/sergeahiwa/Work-Proof-OS.git`  
**Branche Canonique :** `main`  
**Phase :** `6D3.1 — Human Lexical Review & Product Arbitration`  
**Périmètre d'application :** Subjeu exact des 19 éléments classés 'A remplacer' ou 'A revoir' dans la Matrice 6D3  
**Code Modification :** `NONE` (Phase de revue et validation produit exclusive)  
**Statut :** `READY_FOR_PRODUCT_APPROVAL`  

---

## 1. STRATÉGIE PRODUIT ET ANALYSE DES POINTS SENSIBLES

Conformément aux directives de la Phase 6D3.1, cette revue ne cherche pas à appliquer aveuglement des substitutions littérales, mais procède à une analyse d'impact métier approfondie sur les 6 familles de vocables sensibles du produit Work Proof OS :

### A. Famille 'Certifié / Certification' (VS 'Vérifié / Validé / Attesté')
- **Problématique Métier :** Le terme *Certifié* crée un risque d'ambiguïté juridique majeur en laissant penser à une certification diplômante d'État ou une habilitation légale obligatoire.
- **Arbitrage Recommandé :**
  - Utiliser **'Vérifié'** pour les faits, preuves, réalisations et données attestées par le système ou des pairs.
  - Utiliser **'Validé'** pour les actions d'approbation effectuées par des managers, collègues ou tiers de confiance.
  - Utiliser **'Attestation'** pour le document/acte formel d'attestation de compétence.

### B. Famille 'Graph / Graphe / Réseau de Confiance' (VS 'Cercle de Confiance Professionnelle')
- **Problématique Métier :** *Graph* est un jargon de théorie des graphes / structure de données informatique incompréhensible pour un utilisateur final (RH, candidat, manager).
- **Arbitrage Recommandé :**
  - Remplacer systématiquement *Graph* et *Réseau de Confiance* par **'Cercle de Confiance Professionnelle'**.
  - Ce terme est humain, chaleureux, professionnel et traduit fidèlement l'écosystème de pairs qui valident une réalisation.

### C. Famille 'Reality Intelligence Layer / RIL' (VS 'Assistant de Valorisation Professionnelle')
- **Problématique Métier :** L'acronyme *RIL* et sa dénomination *Reality Intelligence Layer* imposent une opacité technocentrique ('IA barbare') qui déconcertoit les utilisateurs RH et salariés.
- **Arbitrage Recommandé :**
  - Adopter la dénomination fonctionnelle SSOT : **'Assistant de Valorisation Professionnelle'**.
  - Décliner ses modules : *Assistant Anti-Biais*, *Radar d'Évolution*, *Aide à la Détection de Preuves*.

### D. Famille 'Indice de Confiance / Score / Credibility Score' (VS 'Niveau de Confiance Professionnelle')
- **Problématique Métier :** Les termes *Score* ou *Indice* donnent l'impression trompeuse d'un 'credit score' américain ou d'un algorithme de notation automatique d'individus.
- **Arbitrage Recommandé :**
  - Utiliser **'Niveau de Confiance Professionnelle'** ou **'Niveau de Crédibilité Vérifié'**, reflétant un indicateur qualitatif étayé par des preuves tangibles.

### E. Famille 'Forge / Forge Structurée' (VS 'Saisie Guidée STAR / Déclaration')
- **Problématique Métier :** *Forge* évoque un jargon logiciel (DevOps/GitHub) ou industriel hors sujet.
- **Arbitrage Recommandé :** Utiliser **'Saisie Guidée STAR'** ou **'Espace de Déclaration de Preuve'**.

### F. Famille 'Dossier Certifié / Proof / Repository' (VS 'Passeport Professionnel / Réalisation Vérifiée')
- **Problématique Métier :** *Proof* et *Repository* sont du vocabulaire de développeur.
- **Arbitrage Recommandé :** Utiliser **'Passeport Professionnel'** pour le réceptacle global, et **'Réalisation Vérifiée'** pour l'élément unitaire de preuve.

---

## 2. TABLEAU D'ARBITRAGE EXHAUSTIF DU PÉRIMÈTRE PHASE 6D4 (19 OCCURRENCES)

| ID | Texte actuel affiché | Fichier | Composant | Écran | Contexte utilisateur | Nouveau terme proposé | Justification métier | Statut arbitrage |
|---|---|---|---|---|---|---|---|---|
| 172 | `Certifié` | `src/components/Layout.tsx` | `Layout` | Layout Navigation & En-tête | Layout Navigation & En-tête > Layout | `Vérifié` | Évite la sur-promesse juridique 'Certifié' (réservée aux diplômes/titres d'État) et valorise une vérification factuelle et collaborative. | **VALIDÉ (Proposition Recommandée)** |
| 336 | `RIL Bias Shield` | `src/components/intelligence/BiasShieldPanel.tsx` | `BiasShieldPanel` | Composants Intelligence (RIL) | Composants Intelligence (RIL) > BiasShieldPanel | `Assistant Anti-Biais` | Supprime le jargon 'RIL' (Reality Intelligence Layer) au profit d'une dénomination fonctionnelle claire pour les RH et recruteurs. | **VALIDÉ (Proposition Recommandée)** |
| 343 | `Radar d'Évolution RIL` | `src/components/intelligence/EvolutionRadarPanel.tsx` | `EvolutionRadarPanel` | Composants Intelligence (RIL) | Composants Intelligence (RIL) > EvolutionRadarPanel | `Radar d'Évolution de Valorisation` | Remplace l'acronyme technocentrique 'RIL' par le concept Métier 'Valorisation Professionnelle'. | **VALIDÉ (Proposition Recommandée)** |
| 347 | `Proof Discovery (RIL)` | `src/components/intelligence/ProofSuggestionsCard.tsx` | `ProofSuggestionsCard` | Composants Intelligence (RIL) | Composants Intelligence (RIL) > ProofSuggestionsCard | `Aide à la Détection de Preuves` | Francise 'Proof Discovery' et élimine le suffixe '(RIL)' pour rendre le composant directement compréhensible. | **VALIDÉ (Proposition Recommandée)** |
| 356 | `Reality Intelligence Layer` | `src/components/intelligence/RILOverviewPanel.tsx` | `RILOverviewPanel` | Composants Intelligence (RIL) | Composants Intelligence (RIL) > RILOverviewPanel | `Assistant de Valorisation Professionnelle` | Substitution officielle SSOT de 'Reality Intelligence Layer' par un rôle d'assistant explicite. | **VALIDÉ (Proposition Recommandée)** |
| 357 | `Crédibilité Certifiée` | `src/components/ui/CredibilityScore.tsx` | `CredibilityScore` | Composants UI Atomiques | Composants UI Atomiques > CredibilityScore | `Niveau de Crédibilité Vérifié` | Remplace 'Certifiée' par 'Vérifié' pour maintenir la cohérence de l'attestation factuelle. | **VALIDÉ (Proposition Recommandée)** |
| 362 | `Trajectoire d'Impact Certifiée` | `src/components/ui/ImpactTrajectory.tsx` | `ImpactTrajectory` | Composants UI Atomiques | Composants UI Atomiques > ImpactTrajectory | `Trajectoire d'Impact Validée` | Substitue 'Certifiée' par 'Validée' pour désigner les réalisations passées confirmées par des pairs. | **VALIDÉ (Proposition Recommandée)** |
| 364 | `Consulter le dossier certifié` | `src/components/ui/OpportunityMatchCard.tsx` | `OpportunityMatchCard` | Composants UI Atomiques | Composants UI Atomiques > OpportunityMatchCard | `Consulter le Passeport Professionnel` | Harmonise 'dossier certifié' vers le terme canonique 'Passeport Professionnel' (ou 'Passeport de Compétences Vérifiées'). | **VALIDÉ (Proposition Recommandée)** |
| 367 | `Impact Mesurable Certifié` | `src/components/ui/ProofCard.tsx` | `ProofCard` | Composants UI Atomiques | Composants UI Atomiques > ProofCard | `Impact Mesurable Vérifié` | Élimine 'Certifié' et affirme la traçabilité factuelle de l'impact. | **VALIDÉ (Proposition Recommandée)** |
| 467 | `Preuves Certifiées` | `src/pages/AdminDashboard.tsx` | `AdminDashboard` | Console de Supervision / Admin | Console de Supervision / Admin > AdminDashboard | `Preuves Vérifiées` | Alignement global du tableau de bord d'administration sur le vocabulaire 'Vérifié'. | **VALIDÉ (Proposition Recommandée)** |
| 493 | `Intégrité certifiée par contrat` | `src/pages/AdminDashboard.tsx` | `AdminDashboard` | Console de Supervision / Admin | Console de Supervision / Admin > AdminDashboard | `Intégrité garantie par preuve d'exécution` | Remplace la mention 'certifiée par contrat' par 'garantie par preuve d'exécution' pour refléter la réalité de la preuve. | **VALIDÉ (Proposition Recommandée)** |
| 609 | `Vos validations certifiées` | `src/pages/Landing.tsx` | `Landing` | Page d'accueil / Vitrine | Page d'accueil / Vitrine > Landing | `Vos réalisations vérifiées` | Remplace 'validations certifiées' sur la landing page pour rassurer les candidats et recruteurs sans ambiguïté légale. | **VALIDÉ (Proposition Recommandée)** |
| 640 | `Validation de la réalisation via le Réseau de Confiance` | `src/pages/Network.tsx` | `Network` | Cercle de Confiance / Réseau | Cercle de Confiance / Réseau > Network | `Validation de la réalisation via le Cercle de Confiance Professionnelle` | Remplace 'Réseau de Confiance' par 'Cercle de Confiance Professionnelle' selon le Glossaire v1.1. | **VALIDÉ (Proposition Recommandée)** |
| 642 | `Graph de validation et paires de démonstration. Connectez-vous pour émettre et sceller de vraies attestations.` | `src/pages/Network.tsx` | `Network` | Cercle de Confiance / Réseau | Cercle de Confiance / Réseau > Network | `Cercle de validation et paires de démonstration. Connectez-vous pour émettre et sceller de vraies attestations.` | Élimine le terme informatique 'Graph' au profit de 'Cercle de validation'. | **VALIDÉ (Proposition Recommandée)** |
| 660 | `a certifié la preuve de` | `src/pages/Network.tsx` | `Network` | Cercle de Confiance / Réseau | Cercle de Confiance / Réseau > Network | `a validé la réalisation de` | Substitue 'certifié la preuve' par 'validé la réalisation', plus humain et plus exact. | **VALIDÉ (Proposition Recommandée)** |
| 662 | `Étendez votre Graph de Confiance` | `src/pages/Network.tsx` | `Network` | Cercle de Confiance / Réseau | Cercle de Confiance / Réseau > Network | `Développez votre Cercle de Confiance Professionnelle` | Substitue le jargon de théorie des graphes 'Graph de Confiance' par 'Cercle de Confiance Professionnelle'. | **VALIDÉ (Proposition Recommandée)** |
| 693 | `Recrutements certifiés par preuves directes` | `src/pages/Opportunities.tsx` | `Opportunities` | Place de Marché / Opportunités | Place de Marché / Opportunités > Opportunities | `Recrutements basés sur des réalisations vérifiées` | Remplace 'certifiés par preuves directes' par 'basés sur des réalisations vérifiées', plus clair pour un recruteur. | **VALIDÉ (Proposition Recommandée)** |
| 725 | `Chargement de votre identité certifiée...` | `src/pages/Profile.tsx` | `Profile` | Profil & Passport Professionnel | Profil & Passport Professionnel > Profile | `Chargement de votre Passeport Professionnel...` | Remplace 'identité certifiée' par 'Passeport Professionnel', aligné avec la vision produit. | **VALIDÉ (Proposition Recommandée)** |
| 859 | `Installation et paramétrage du nouveau convoyeur (Action) → Productivité augmentée de +25% sur le tri nocturne (Impact) → Enregistrements système certifiés (Preuve).` | `src/store/mockData.ts` | `mockData` | Composant mockData | Composant mockData > mockData | `Installation et paramétrage du nouveau convoyeur (Action) → Productivité augmentée de +25% sur le tri nocturne (Impact) → Enregistrements système validés (Preuve).` | Remplace 'certifiés' par 'validés' dans les données de démonstration du modèle de preuve. | **VALIDÉ (Proposition Recommandée)** |

---

## 3. ENGAGEMENT DE SÉCURITÉ & CONTINUITÉ

- **Zéro modification de code :** `CODE_MODIFICATION = NONE`.
- **Intégrité applicative :** L'application Work Proof OS reste dans un état 100% stable et opérationnel.
- **Prochaine étape :** Une fois ce livrable validé par la revue humaine produit, l'implémentation exacte des 19 substitutions pourra s'engager en **Phase 6D4**.
