# Rapport de Validation Systémique : Impact Engine Integrity

## 1. Analyse des Dépendances (src/core/impact.ts)
L'analyse du module `impact.ts` révèle une déconnexion totale entre le **Moteur d'Impact** et le **Système de Vérité** (User Trust).
- Le module ne reçoit que des tableaux de `Contribution[]`.
- L'objet `User` et ses `trustFactors` ne sont jamais importés ni utilisés dans les calculs de signature.

## 2. Vérification de l'Utilisation des Nouveaux Champs
### validatorDiversity
- **État :** INUTILISÉ.
- **Impact :** Le moteur ne peut pas distinguer une validation "en silo" (peu de diversité) d'une validation écosystémique robuste. La `MarketValueSignature` est donc aveugle à la qualité du réseau de validation.

### consistencyScore
- **État :** INUTILISÉ.
- **Impact :** L'historique de cohérence de l'utilisateur n'influence pas la valeur de ses nouvelles contributions. Un utilisateur historiquement incohérent peut produire une signature de "haute valeur" sans pénalité systémique.

### anomalyScore
- **État :** INUTILISÉ.
- **Impact :** Le moteur utilise un `antiGamingScore` local (basé sur la répétition des types de contributions), mais ignore le score d'anomalie global de l'utilisateur. Un fraudeur détecté au niveau système peut toujours générer un impact valide au niveau local.

## 3. Détection de Biais et Incohérences
- **Découplage Épistémique :** Il existe une faille entre la "Vérité" (normalisée dans le profil) et la "Valeur" (calculée dans le moteur). La normalisation effectuée précédemment est actuellement une "donnée morte" pour le calcul de la signature.
- **Risque de "Fraude Crédible" :** Un profil avec un `anomalyScore` élevé (0.9) obtiendra la même signature qu'un profil intègre (0.01) si ses contributions individuelles respectent les règles locales de `impact.ts`.
- **Surpondération de l'Impact Brut :** En l'absence de pondération par le `trustFactors`, le système favorise le volume et le score déclaré plutôt que la fiabilité de la source.

## 4. Simulations de Profils (Théoriques)
| Profil | trustFactors (Normalisé) | Signature (Actuelle) | Cohérence Système |
| :--- | :--- | :--- | :--- |
| **Haut Trust** | Anomaly: 0.01, Consist: 0.99 | Impact: 100% | ✅ OK |
| **Bas Trust** | Anomaly: 0.90, Consist: 0.10 | Impact: 100% | ❌ INCOHÉRENT |
| **Incohérent** | Diversity: 0.00 | Impact: 100% | ❌ RISQUE SILO |

## 5. Recommandations (Audit)
1. **Injection du Contexte Utilisateur :** Modifier `calculateMarketValueSignature` pour accepter l'objet `User` ou ses `trustFactors`.
2. **Multiplicateur de Confiance Global :** Appliquer un coefficient de pondération au `totalValueCreated` basé sur `(1 - anomalyScore) * consistencyScore`.
3. **Pondération par Diversité :** Utiliser `validatorDiversity` pour ajuster le `stabilityScore` de la signature.
4. **Alerte de Crédibilité :** Déclencher le flag `isExperimental` si le `anomalyScore` de l'utilisateur dépasse un seuil critique (ex: 0.5), même si les contributions semblent valides.

## Conclusion
Le moteur d'impact est techniquement stable mais **épistémiquement aveugle**. La normalisation des données a créé le réceptacle de la vérité, mais le moteur ne l'utilise pas encore pour forger la valeur. Le système est "propre" mais pas encore "juste".
