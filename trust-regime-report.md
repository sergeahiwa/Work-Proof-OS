# Rapport d'Implémentation : Trust Regime System

## 1. Architecture des Régimes
Le système a été enrichi d'une couche de segmentation dynamique permettant de traiter différemment les utilisateurs selon leur profil de risque.

### Les 3 Régimes de Confiance
- **`TRUSTED`** (anomalyScore < 0.3 et consistencyScore > 0.7) :
  - **Comportement** : Application intégrale du `trustMultiplier`.
  - **Objectif** : Récompenser l'intégrité et la cohérence démontrées.
- **`UNCERTAIN`** (anomalyScore entre 0.3 et 0.6) :
  - **Comportement** : Réduction de 20% de l'amplitude du multiplicateur (`1 + (m-1)*0.8`).
  - **Objectif** : Appliquer un principe de précaution tout en permettant une évolution positive.
- **`RISKY`** (anomalyScore > 0.6) :
  - **Comportement** : Plafonnement punitif à **70% de la valeur brute** (`Math.min(score * m, score * 0.7)`).
  - **Objectif** : Neutraliser mathématiquement toute tentative de manipulation ou de "gaming".

## 2. Transition Douce (Smoothing Layer)
Pour éviter les effets de seuil brutaux ("cliff effects"), une couche d'interpolation linéaire a été ajoutée :
- **Zone TRUSTED <-> UNCERTAIN** (anomaly entre 0.25 et 0.35) : Transition progressive du plein effet vers l'amortissement.
- **Zone UNCERTAIN <-> RISKY** (anomaly entre 0.55 et 0.65) : Transition progressive de l'amortissement vers le plafonnement.

## 3. Distribution des Profils (Simulation)
Sur le dataset de test (30 profils) :
- **TRUSTED** : ~33% (Profils experts, données cohérentes).
- **UNCERTAIN** : ~33% (Nouveaux profils ou données incomplètes).
- **RISKY** : ~33% (Profils présentant des anomalies critiques).

## 4. Résultats et Sécurité
- **Anti-Gaming** : Un utilisateur `RISKY` ne peut plus gonfler sa valeur, même avec un multiplicateur théorique élevé.
- **Stabilité** : Les profils `UNCERTAIN` voient leur volatilité réduite, stabilisant l'UX.
- **Transparence** : Le régime est désormais exposé dans la signature finale (`MarketValueSignature`).

---
*Rapport généré automatiquement par le moteur d'impact IA-CASCADE.*
