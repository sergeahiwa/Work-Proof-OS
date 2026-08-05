# Rapport d'Implémentation : Smooth Transition Layer (Anti-Cliff)

## 1. Objectif
L'objectif de cette mise à jour était de supprimer les "effets de falaise" (cliff effects) — des sauts de score brutaux lors du passage d'un régime de confiance à un autre. Un système perçu comme injuste ou imprévisible perd sa crédibilité auprès des utilisateurs.

## 2. Architecture de Lissage
Nous avons introduit une couche d'interpolation linéaire dans des zones de transition stratégiques autour des seuils critiques.

### Zones de Transition :
- **Zone 1 (0.25 - 0.35)** : Transition entre `TRUSTED` et `UNCERTAIN`.
- **Zone 2 (0.55 - 0.65)** : Transition entre `UNCERTAIN` et `RISKY`.

### Mécanisme d'Interpolation :
Dans chaque zone, le score final est une moyenne pondérée des comportements des deux régimes adjacents.
`adjustedScore = (1 - weight) * Score_RegimeA + weight * Score_RegimeB`

## 3. Comparaison Avant/Après
| Anomaly Score | Régime | Comportement (Avant) | Comportement (Après) | Résultat |
| :--- | :--- | :--- | :--- | :--- |
| **0.59** | `UNCERTAIN` | Lissage -20% de l'effet. | Lissage -20% + 40% de pénalité RISKY. | Transition douce. |
| **0.60** | `RISKY` | **Cap brutal à 70%**. | 50% UNCERTAIN / 50% RISKY. | Pas de saut de score. |
| **0.61** | `RISKY` | **Cap brutal à 70%**. | Lissage -20% + 60% de pénalité RISKY. | Dégradation progressive. |

## 4. Analyse des Cas Limites
- **Continuité** : Un utilisateur passant de 0.59 à 0.61 d'anomalie ne verra plus son score chuter de manière catastrophique en un seul point. La dégradation de la valeur est désormais proportionnelle à la dégradation de la confiance.
- **Préservation des Seuils** : Les seuils de classification (0.3 et 0.6) restent identiques pour le reporting et l'UI, mais leur impact mathématique est désormais fluide.
- **Stabilité** : L'interpolation linéaire garantit qu'aucun saut de score supérieur à 15% ne peut se produire pour une variation mineure (0.01) de l'anomalie.

## 5. Conclusion
Le moteur d'impact est désormais **humainement acceptable**. Il combine la rigueur mathématique du Trust Regime avec la subtilité nécessaire à une expérience utilisateur juste. La valeur d'une preuve ne "tombe" plus dans un ravin ; elle s'ajuste avec précision à la réalité du risque.
