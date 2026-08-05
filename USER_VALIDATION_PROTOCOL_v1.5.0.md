# PROTOCOLE DE VALIDATION TERRAIN — WORK PROOF OS v1.5.0

**Date :** 3 août 2026  
**Version :** v1.5.0  
**Auteur :** AI Studio UX & Product Validation Team  
**Statut :** Document Cadre Officiel — Validation Terrain (Terrain Validation Loop)  
**Applet ID :** `b0f7caeb-f456-4834-9a1c-ad642df5b20a`  

---

## 1. HYPOTHÈSE PRODUIT À TESTER

### Hypothèse Centrale :
> **"Les utilisateurs comprennent et valorisent davantage une identité professionnelle basée sur des preuves qu'un profil déclaratif classique."**

### Sous-hypothèses associées :
1. **H1 — Rupture Cognitive Immédiate :** Présenté avec un profil Work Proof OS, l'utilisateur prend conscience en moins de 10 secondes qu'il interagit avec des réalisations vérifiées et non avec des prétentions auto-proclamées.
2. **H2 — Effet Démonstrateur (Proof > Claims) :** Un recruteur ou décisionnaire accorde un niveau de confiance supérieur (>85%) à un candidat disposant d'un score de crédibilité auditable par rapport à un CV classique ou un profil LinkedIn standard.
3. **H3 — Alignement d'Incitations Non-Collusif :** Les pairs acceptent de valider une preuve lorsqu'ils réalisent que leur propre réputation et score de crédibilité sont engagés dans le processus (responsabilisation sociale).
4. **H4 — Attractivité du Matching Factuel :** Les talents préfèrent les opportunités basées sur la correspondance directe de leurs preuves réelles (`OpportunityMatchCard`) plutôt que sur le scan passif de mots-clés d'un algorithme de type ATS.

---

## 2. PROFILS TESTEURS ET ÉCHANTILLONNAGE

Afin de garantir une représentativité transversale de l'écosystème du travail, les sessions de test terrain s'appuient sur **5 cohortes d'utilisateurs cibles** (minimum 3 à 5 personnes par groupe, soit une cohorte globale de **20 tester-nodes**).

| Groupe Cible | Description & Profil Type | Taille Échantillon | Objectif Principal d'Observation |
| :--- | :--- | :--- | :--- |
| **01. Talent Salarié** | Développeurs, chefs de projet ou designers en poste (2 à 8 ans d'expérience). | **4 personnes** | Mesurer la capacité à ancrer une réalisation récente et à solliciter une validation pair sans friction. |
| **02. Freelance / Indépendant** | Consultants IT, devops, créateurs autonomes facturant à la prestation. | **4 personnes** | Vérifier la valeur perçue du score de crédibilité pour remplacer le portfolio classique et rassurer les clients. |
| **03. Entrepreneur / Founder** | Fondateurs de startups, CTOs, responsables d'équipes opérationnelles. | **4 personnes** | Évaluer la lisibilité du graphe de preuves lors du recrutement d'associés ou de premiers employés clés. |
| **04. Étudiant / Jeune Diplômé** | Élèves en fin d'études ou juniors (0 à 2 ans d'expérience) manquant d'historique LinkedIn formel. | **4 personnes** | Tester la vélocité d'ancrage de projets académiques, hackathons ou stages en tant que premières preuves tangible. |
| **05. Recruteur / Talent Acquisition** | Recruteurs ESN, chasseurs de têtes ou HR managers gérant des volumes d'embauche. | **4 personnes** | Mesurer le gain de temps de décision (<30s) et le niveau de certitude face à des profils audités. |

---

## 3. SCÉNARIOS DE TEST TERRAIN

Chaque testeur exécute un parcours guidé composé de 4 scénarios opérationnels sur la plateforme Work Proof OS v1.5.0 :

### 🎯 Scénario 1 : Création d'une Identité de Preuve (Parcours Talent)
* **Consigne :** *"Vous arrivez sur Work Proof OS pour la première fois. Initialisez votre identité de preuve et observez la construction de votre carte d'identité professionnelle."*
* **Étapes :**
  1. Accès via la Landing Page / Onboarding (`/onboarding`).
  2. Saisie du profil fondamental sans bio pompeuse.
  3. Visualisation de l'identité de preuve sur `/profile`.
* **Critère de Succès :** L'utilisateur comprend que son identité est matérialisée par son score de crédibilité (`CredibilityScore`) et la somme de ses réalisations réelles.

### 🎯 Scénario 2 : Transformation d'une Réalisation en Preuve (Parcours Projet)
* **Consigne :** *"Ancrez une réalisation récente (ex: migration système, refonte design, métrique livrée) et demandez une validation."*
* **Étapes :**
  1. Navigation vers l'espace Projets (`/projects`) ou Création de Preuve (`/create-proof`).
  2. Saisie de la réalisation (titre, métrique d'impact, preuve d'exécution/URL).
  3. Génération de la carte de preuve (`ProofCard`).
* **Critère de Succès :** La preuve est ancrée en moins de 60 secondes avec une métrique quantifiable explicite.

### 🎯 Scénario 3 : Compréhension du Matching par la Preuve (Parcours Opportunité)
* **Consigne :** *"Consultez les opportunités suggérées et expliquez pourquoi cette opportunité vous correspond."*
* **Étapes :**
  1. Navigation vers la section Opportunités (`/opportunities`).
  2. Inspection d'une carte d'opportunité (`OpportunityMatchCard`).
  3. Ouverture du panneau d'explicabilité (`ExplainabilityPanel`).
* **Critère de Succès :** L'utilisateur identifie les preuves exactes de son profil qui justifient le score de matching, sans suspicion d'effet "boîte noire AI".

### 🎯 Scénario 4 : Prise de Décision basée sur la Preuve (Parcours Recruteur)
* **Consigne :** *"En tant que recruteur, vous devez évaluer deux candidats pour un poste critique et prendre une décision."*
* **Étapes :**
  1. Accès à la console Recruteur (`/recruiter`).
  2. Comparaison visuelle des candidats audités (Score de crédibilité 90%+ vs profils non-vérifiés).
  3. Vérification des sceaux de validation (`ValidationSeal`) et sélection du candidat retenu.
* **Critère de Succès :** Prise de décision tranchée en moins de 30 secondes fondée sur la certitude des preuves.

---

## 4. GRILLE DE QUESTIONNEMENT ET D'OBSERVATION

L'observateur note les réactions à chaud et pose les 5 questions cardinales à la fin du parcours :

```
+-----------------------------------------------------------------------------------+
|                           QUESTIONS D'OBSERVATION TERRAIN                         |
+-----------------------------------------------------------------------------------+
| 1. COMPRÉHENSION :                                                                |
|    "En vos propres termes, que fait la plateforme Work Proof OS ?"                |
|    [ ] Compréhension immédiate (Preuves vs Déclarations)                          |
|    [ ] Confusion partielle (Incertain sur le rôle du score)                        |
|    [ ] Incompréhension (Considéré comme un simple CV en ligne)                      |
|                                                                                   |
| 2. DIFFÉRENCIATION LINKEDIN :                                                    |
|    "Quelle est la différence fondamentale entre ce profil et votre page LinkedIn ?"|
|    [ ] Perçoit immédiatement l'absence de blabla et la présence de preuves         |
|    [ ] Voit une différence visuelle mais pas conceptuelle                          |
|    [ ] Ne voit aucune différence majeure                                          |
|                                                                                   |
| 3. VALEUR PERÇUE :                                                                |
|    "Est-ce utile pour votre carrière ou vos recrutements ? Pourquoi ?"             |
|    [ ] Fort désir d'utilisation (Inspiration pour valoriser ses vrais travaux)    |
|    [ ] Utilité modérée                                                            |
|    [ ] Inutile                                                                    |
|                                                                                   |
| 4. POINTS DE FRICTION :                                                           |
|    "Qu'est-ce qui vous a fait hésiter ou bloqué durant le parcours ?"             |
|    (Relevé précis deshésitations UI, termes vagues ou doutes)                      |
|                                                                                   |
| 5. INDICE DE CONFIANCE :                                                          |
|    "Croyez-vous aux scores et preuves présentés sur ces cartes ?"                 |
|    [ ] Confiance totale (Grâce aux vérifications et sceaux de validation)         |
|    [ ] Doute partiel (Demande plus de détails sur le validateur)                  |
|    [ ] Scepticisme                                                                |
+-----------------------------------------------------------------------------------+
```

---

## 5. INDICATEURS DE PERFORMANCE (KPIs TERRAIN)

Les métriques suivantes seront calculées à l'issue des 20 sessions de tests :

```
===================================================================================
INDICATEUR (KPI TERRAIN)                    | CIBLE MINIMALE | MÉTHODE DE MESURE
===================================================================================
1. Temps de Compréhension Initiale           | < 15 secondes  | Chronomètre à l'affichage de la Landing/Profile
2. Taux de Complétion Onboarding            | > 90 %         | % de testeurs finalisant le parcours Onboarding
3. Taux d'Ajout d'une Première Preuve       | > 85 %         | % de testeurs ancrant une preuve sous 2 mins
4. Temps de Décision Recruteur               | < 30 secondes  | Chronomètre lors du choix de profil sur /recruiter
5. Taux de Clarté du Matching (Explicabilité)| > 90 %         | Question directe sur l'ExplainabilityPanel
6. Perception de Superiorité vs LinkedIn    | > 80 %         | Ratio de réponses "Nettement plus crédible"
===================================================================================
```

---

## 6. PROTOCOLE D'EXÉCUTION & CONSIGNES D'OBSERVATION

### Déroulement d'une Session (Durée : 30 minutes)
1. **Introduction (3 min) :** Accueil du testeur sans révéler la proposition de valeur. Penser tout haut (*Think Aloud Protocol*).
2. **Phase Découverte (5 min) :** Arrivée sur `/` ou `/user-testing`. Observation des premières réactions visuelles et verbales.
3. **Exécution des Scénarios (15 min) :** Lancement des 4 scénarios. L'observateur n'intervient pas, sauf blocage critique.
4. **Debriefing & Grille de Questions (7 min) :** Passage en revue des 5 questions d'observation et enregistrement du formulaire dans `/user-testing`.

---

*Document officiel du Protocole de Validation Terrain Work Proof OS v1.5.0.*
