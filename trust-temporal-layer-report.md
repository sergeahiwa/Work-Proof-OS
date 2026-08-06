# Rapport d'Implémentation : Trust Temporal Layer

## 1. Architecture Temporelle
Le système de confiance a été enrichi d'une dimension historique, transformant le score instantané en une **réputation dynamique**.

### Structure de Données
- **`TrustSnapshot`** : Capture l'état de confiance (`anomaly`, `consistency`, `diversity`) à un instant T.
- **`trustHistory`** : Historique persistant dans le profil utilisateur (limité aux 50 derniers snapshots).

## 2. Algorithme de Blending (Pondération Temporelle)
Le calcul de l'impact n'utilise plus uniquement les facteurs de confiance actuels, mais une version "lissée" par l'historique :
- **Poids Récent (50%)** : Réactivité aux changements immédiats.
- **Poids Moyen (30%)** : Stabilité à moyen terme.
- **Poids Ancien (20%)** : Ancrage historique de la réputation.

Formule : `BlendedScore = (0.5 * AvgRecent) + (0.3 * AvgMedium) + (0.2 * AvgOld)`

## 3. Impact sur le Système
- **Résistance aux Chocs** : Une anomalie soudaine sur une seule contribution est amortie par l'historique positif.
- **Inertie de Confiance** : Un utilisateur malveillant doit construire une réputation sur la durée avant d'obtenir un multiplicateur élevé.
- **Observabilité Accrue** : Chaque calcul d'impact génère un snapshot persistant, permettant de tracer l'évolution de la fiabilité d'un utilisateur.

## 4. Intégration Technique
- **`src/core/impact.ts`** : Logique de blending intégrée au moteur d'impact.
- **`src/pages/Projects.tsx`** : Persistance automatique des snapshots (limité à un par heure pour éviter la pollution de la DB).
- **`src/types.ts`** : Alignement des interfaces pour supporter la couche temporelle.
