# PROTOCOLE OPÉRATIONNEL DU PILOTE TERRAIN RÉEL — PHASE 5
## Work Proof OS v1.6

**Date de rédaction :** 05 Août 2026  
**Auteur :** Agent Opération Pilote Terrain  
**Classification de Données Visée :** `REAL_FIELD_DATA` uniquement  
**Documents de Référence (SSOT) :**
- `/VISION_PRODUIT_CANONIQUE_WORK_PROOF_OS_v1.0.md`
- `/CAHIER_DES_CHARGES_CANONIQUE_WORK_PROOF_OS_v1.0.md`
- `/DECISION_LOG_WORK_PROOF_OS.md`
- `/DATA_PROVENANCE_STANDARD.md`

---

## 1. Objectif du Pilote Terrain Réel

Le pilote terrain réel a pour unique objectif d'observer l'utilisation autonome de Work Proof OS v1.6 par des utilisateurs réels dans leur cadre professionnel quotidien, afin de collecter exclusivement des métriques certifiées `REAL_FIELD_DATA`.

Il s'agit de mesurer :
- L'appropriation spontanée du concept (Preuve factuelle > Déclaration CV) ;
- La fréquence et la qualité de structuration STAR des preuves d'activité ;
- Le taux de réponse et la friction des tiers validateurs humains sollicités ;
- La valeur perçue (PUS) et la clarté de la proposition de valeur (VPUR) sans accompagnement UX ou guidage d'expérimentation.

---

## 2. Population Cible & Critères

### Cohorte visée
- **Taille recommandée :** 30 à 40 participants actifs.
- **Autorisation de Recrutement :** Le recrutement de la cohorte est soumis exclusivement à la **Validation Produit du recrutement de la cohorte pilote** par le Product Manager. Work Proof OS n'étant pas un système RH ou un ATS, la cohorte est sélectionnée selon des critères stricts de diversité d'usage produit et d'activités professionnelles factuelles.
- **Profils prioritaires :** 
  - Contributeurs : Professionnels en poste, indépendants, développeurs, chefs de projet.
  - Validateurs : Managers, pairs, référents techniques, clients.
  - Tiers vérificateurs : Auditeurs, partenaires, évaluateurs externes.

### Critères d'Inclusion
- Exercer une activité professionnelle réelle générant des livrables ou jalons vérifiables.
- Accepter le protocole de consentement et d'anonymisation des données de télémétrie.
- Utiliser le système en autonomie complète sans assistance directe de l'équipe produit.

### Critères d'Exclusion
- Membres de l'équipe de développement ou de gouvernance du projet (évitement du biais d'auto-évaluation).
- Utilisateurs participant à des sessions de tests UX encadrées (relevant de `CONTROLLED_TEST_DATA`).
- Utilisations automatisées ou fictives (relevant de `SIMULATION_DATA`).

---

## 3. Durée & Calendrier

- **Durée totale du pilote :** 21 jours calendaires d'observation continue.
- **Phase de démarrage :** J1 à J3 — Déploiement de la cohorte & prise en main autonome.
- **Phase d'observation principale :** J4 à J18 — Collecte passive des événements `REAL_FIELD_DATA`.
- **Phase de clôture & restitution :** J19 à J21 — Restitution des réponses PUS/VPUR anonymisées et clôture du registre.

---

## 4. Scénarios Observés en Situation Réelle

1. **Parcours Contributeur Autonome :**
   - Réception ou détection d'un signal RIL (*Advisory Only*).
   - Décision souveraine d'initier la création d'une preuve STAR (`USER_SOVEREIGNTY_FIRST`).
   - Rédaction, attachement de preuves ou liens factuels, et publication.
   - Envoi de la demande de validation à un tiers choisi par le contributeur.

2. **Parcours Validateur Réel :**
   - Réception de l'invitation par le validateur sollicité.
   - Consultation des faits décrits et des éléments factuels.
   - Action de validation humaine, rejet motivé ou demande de précision (`HUMAN_VALIDATION_REQUIRED`).

3. **Parcours Tiers / Exploitation du Signal :**
   - Partage du lien ou du certificat cryptographique par le contributeur.
   - Verification par un tiers de l'authenticité et du niveau de crédibilité de la preuve.

---

## 5. Métriques Collectées (`REAL_FIELD_DATA`)

| Métrique | Code Événement Télémétrie | Description |
|---|---|---|
| **Real Start Rate** | `proof_capture / start_creation` | Taux d'initiation d'une preuve après suggestion RIL ou action directe |
| **Real STAR Completion** | `proof_capture / publish_proof_telemetry` | Taux de finalisation des 4 sections STAR |
| **Real Creation Duration** | Horodatage début → publication | Temps effectif passé à rédiger la preuve |
| **Real Validation Rate** | `validation_engine / request_verification_telemetry` | Proportion de demandes de validation ayant obtenu une réponse |
| **Real Validation Delay** | Delta horodatage demande → validation | Délai de traitement par le validateur humain |
| **Field VPUR** | Enquête de sortie terrain | Comprehension de la valeur "Preuve > CV" |
| **Field PUS** | Enquête de sortie terrain | Score d'utilité perçue en situation professionnelle réelle |

---

## 6. Méthode de Consentement & Confidentialité

- **Consentement Éclairé :** Chaque participant confirme son accord via une modalité explicite avant l'envoi de la moindre donnée de télémétrie.
- **Anonymisation Stricte :** Aucune donnée à caractère personnel (nom, email, contenu exact des preuves privées) n'est transmise aux métriques d'observation. Les métriques mesurent uniquement la structure, les horodatages et les indicateurs d'état.
- **Souveraineté des Données :** Le contributeur peut à tout moment supprimer ses preuves ou révoquer la visibilité d'un signal partagé.
