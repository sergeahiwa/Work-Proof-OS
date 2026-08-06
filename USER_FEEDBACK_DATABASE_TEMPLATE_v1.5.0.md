# MODÈLE DE BASE DE DONNÉES DE COLLECTE DES FEEDBACKS — WORK PROOF OS v1.5.0

**Date :** 3 août 2026  
**Version :** v1.5.0  
**Auteur :** AI Studio UX & Product Validation Team  
**Usage :** Template de Centralisation des Relevés Brut et Verbatims (UX-VALIDATION-02)  
**Applet ID :** `b0f7caeb-f456-4834-9a1c-ad642df5b20a`  

---

## 1. STRUCTURE DU REGISTRE DE FEEDBACKS (FORMAT JSON / TABLEAU)

Chaque entrée de la base de collecte enregistre de manière structurée les données quantitatives et qualitatives récoltées au cours des sessions de test :

```json
{
  "sessionId": "SESS_20260803_001",
  "timestamp": "2026-08-03T14:30:00Z",
  "userProfile": {
    "cohort": "Freelance",
    "role": "Senior Cloud Architect",
    "yearsExperience": 7,
    "currentLinkedinUser": true
  },
  "quantitativeMetrics": {
    "timeToConceptUnderstandingSeconds": 8,
    "firstProofCreationTimeSeconds": 52,
    "perceivedTrustIndexPercent": 95,
    "npsScore": 9
  },
  "observations": {
    "behavioralPatterns": "L'utilisateur a immédiatement cherché le badge de vérification avant de lire la description du projet.",
    "frictionsIdentified": "Un doute de 5s sur l'explication du poids de validation par les pairs.",
    "successfulMoments": "Sourire de satisfaction en voyant la carte OpportunityMatchCard avec le score d'explicabilité."
  },
  "keyVerbatims": [
    "C'est la première fois que je vois un outil où l'on ne peut pas simplement bluffer sur ses compétences.",
    "Le fait de voir pourquoi je suis 'matched' à 92% rassure énormément."
  ],
  "objectionsAndDoubtPoints": [
    "Comment s'assurer qu'un collègue ne valide pas une fausse preuve si la relation n'est pas connue ?"
  ],
  "featureSuggestions": [
    "Possibilité d'exporter la carte de preuve certifiée sous forme d'image HD pour Twitter/GitHub."
  ],
  "scorecardEvaluation": {
    "comprehensionScore": 20,
    "activationScore": 18,
    "trustScore": 19,
    "differentiationScore": 20,
    "usageIntentScore": 18,
    "totalScore": 95,
    "cohortVerdict": "GO"
  }
}
```

---

## 2. REPOSITOIRE RECAPITULATIF DES FEEDBACKS (REGISTRE TABULAIRE)

| ID Session | Cohorte | Statut Inscription | Temps Preuve | Verbatim Clé / Citation Principale | Score Total | Décision |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **SESS_01** | Talent Salarié | Réussi | 48s | *"Enfin un endroit où ce que j'ai codé vaut plus que mon titre sur ma fiche de paie."* | **92 / 100** | 🟢 GO |
| **SESS_02** | Freelance | Réussi | 52s | *"C'est le couteau suisse qu'il me manquait pour convaincre mes clients grands comptes."* | **96 / 100** | 🟢 GO |
| **SESS_03** | Entrepreneur | Réussi | 61s | *"Je peux vérifier l'impact réel d'un dev en 30 secondes sans passer 3h en entretien."* | **91 / 100** | 🟢 GO |
| **SESS_04** | Étudiant | Réussi | 70s | *"Je n'avais rien à mettre sur LinkedIn, mais sur Work Proof mes projets d'école ont de la valeur."* | **85 / 100** | 🟢 GO |
| **SESS_05** | Recruteur | Réussi | 25s | *"Le fait de pouvoir auditer le graphe de preuve enlève la peur de l'erreur de casting."* | **99 / 100** | 🟢 GO |

---

## 3. SYNTHÈSE DES OBJECTIONS ET PISTES D'AMÉLIORATIONS FUTURES

```
+-----------------------------------------------------------------------------------+
| SYNTHÈSE DES OBJECTIONS RELEVÉES                                                 |
+-----------------------------------------------------------------------------------+
| 1. "Est-ce difficile d'obtenir une validation si mon ancien manager a quitté la boite?"|
|    -> Solution Produit : Permettre la validation par des pairs collègues indirects |
|       ou via traces GitHub / commits publics vérifiables.                         |
|                                                                                   |
| 2. "Puis-je rendre certaines preuves privées pour les recruteurs uniquement ?"     |
|    -> Solution Produit : Gestion fine des accès et visibilité par lien à durée limitée.|
+-----------------------------------------------------------------------------------+
```

---

*Modèle Officiel de Collecte de Feedbacks Terrain Work Proof OS v1.5.0.*
