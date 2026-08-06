# DATA PROVENANCE STANDARD
## Work Proof OS v1.6 — Gouvernance & Traçabilité des Données

**Version :** 1.0  
**Statut :** Obligatoire pour tout rapport d'agent et dossier de décision  
**Champs d'application :** Tous les rapports d'exécution, d'analyse, d'évaluation UX et de télémétrie  

---

## 1. Principe Général

Toute donnée, métrique ou observation présentée dans un rapport projet **doit obligatoirement déclarer son origine exacte et vérifiable**.

Une donnée sans origine démontrée ou à la provenance ambiguë ne peut **en aucun cas** être utilisée comme preuve décisionnelle pour la gouvernance ou le passage de phase produit.

---

## 2. Classification Obligatoire des Données

Tout jeu de données ou métrique rapporté doit être formellement étiqueté selon la typologie canonique suivante :

### `REAL_FIELD_DATA`
- **Définition :** Données collectées auprès d'utilisateurs externes réels participant au pilote officiel, dans une situation d'utilisation réelle du produit.
- **Sources possibles :**
  - télémétrie d'utilisation ;
  - questionnaires ;
  - retours qualitatifs ;
  - observations structurées ;
  - événements métier liés au parcours utilisateur.
- **Conditions obligatoires :**
  - utilisateur externe identifié comme participant pilote ;
  - collecte pendant la fenêtre officielle ;
  - origine traçable ;
  - aucune génération ou simulation.
- **Utilisation autorisée :** Validation définitive de l'adoption terrain, de la valeur marché et de la souveraineté utilisateur.

### `CONTROLLED_TEST_DATA`
- **Définition :** Données issues de tests utilisateurs organisés, encadrés ou observés en environnement de recette/sandbox.
- **Exemples :** Sessions de tests UX guidées, parcours de recette fonctionnelle, prototypes testés par une cohorte fermée d'évaluateurs.
- **Utilisation autorisée :** Validation d'ergonomie, de lisibilité, de fluidité des parcours et de compréhension conceptuelle.

### `SIMULATION_DATA`
- **Définition :** Données générées artificiellement par des scripts, des bancs d'essai automatisés ou des modèles d'émulation pour vérifier le comportement technique du système.
- **Exemples :** Tests de charge, simulation de télémétrie de parcours, injection automatique de signaux RIL ou de demandes de validation.
- **Utilisation autorisée :** Validation de la robustesse technique, du temps de réponse, de l'intégrité transactionnelle et de l'instrumentation.

### `SYNTHETIC_DATA`
- **Définition :** Données fictives créées à des fins de démonstration, de maquettage UI ou d'initialisation de bases de données de développement.
- **Exemples :** Preuves de démonstration, profils de testeurs factices, jeux de données `seed.ts`.
- **Utilisation autorisée :** Développement et démonstration visuelle uniquement.

### `UNKNOWN_ORIGIN`
- **Définition :** Donnée dont la provenance, la méthode de collecte ou le périmètre d'extraction n'est pas rigoureusement documenté.
- **Règle absolue :** **STRICTEMENT INTERDITE** pour toute conclusion, arbitrage ou décision produit.

---

## 3. Règle Obligatoire pour les Rapports d'Agents

Tout rapport produit ou technique généré par un agent AI/Human doit inclure une section standardisée obligatoire intitulée :

```markdown
## DATA ORIGIN DECLARATION
```

Cette section doit obligatoirement détailler :
1. **Classification des Données :** L'une des 5 étiquettes obligatoires (`REAL_FIELD_DATA`, `CONTROLLED_TEST_DATA`, `SIMULATION_DATA`, `SYNTHETIC_DATA`, `UNKNOWN_ORIGIN`).
2. **Source des Données :** Origine exacte des enregistrements (logs, événements Firestore, formulaires, banc de test).
3. **Méthode de Collecte :** Passives/actives, automatique via télémétrie, manuelle via interview.
4. **Période d'Extraction :** Dates et heures précises du relevé.
5. **Propriétaire / Responsable :** Agent ou rôle responsable de la collecte.
6. **Niveau de Confiance :** Indice d'exploitabilité pour les décisions du Product Manager.

---

## 4. Portée Juridique et Intégrité Produit

Aucun passage de phase ne sera validé par le Product Manager si les conclusions reposent sur des assertions non étiquetées ou prétendant être des `REAL_FIELD_DATA` alors qu'elles sont issues de simulations ou de tests contrôlés.
