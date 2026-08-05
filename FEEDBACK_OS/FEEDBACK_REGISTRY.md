# FEEDBACK REGISTRY — WORK PROOF OS
## Registre Central des Feedbacks

**Statut du Registre :** 🟢 INITIALISÉ — ACTIF  
**Standard de Provenance :** Conforme à `/DATA_PROVENANCE_STANDARD.md`  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/FEEDBACK_OS/FEEDBACK_SCHEMA.md`

---

## 1. Engagement d'Intégrité du Registre

1. **Aucune Suppression Silencieuse :** Tout feedback enregistré demeure présent au registre de manière permanente. Un feedback non retenu ou invalide passe au statut `REJECTED` ou `ARCHIVED` avec motif explicite, mais n'est jamais supprimé.
2. **Traçabilité des Origines :** Chaque ligne de ce registre indique impérativement son étiquette de provenance (`REAL_FIELD_DATA`, `CONTROLLED_TEST_DATA`, `SIMULATION_DATA`, `SYNTHETIC_DATA`).
3. **Absence de Feedbacks Fictifs :** Aucun feedback inventé ou simulant une voix utilisateur réelle ne peut être inscrit au registre.
4. **Volume Actuel :** `0` feedback réel enregistré (Registre prêt pour l'enregistrement au fil de l'eau des retours de test et du pilote terrain).

---

## 2. Table Centrale des Feedbacks

| Feedback ID | Date (UTC) | Phase | Source | Provenance | Catégorie | Description Factuelle | Sévèrité | Statut | Décision Log |
|---|---|---|---|---|---|---|---|---|---|
| *Attente* | *2026-08-05* | `PHASE_5_PILOTE` | `OBSERVATEUR_UX` | `CONTROLLED_TEST_DATA` | `UX_FRICTION` | *Registre initialisé à zéro — En attente des retours de sessions* | `INFORMATIONAL` | `QUALIFIED` | `DECISION-PENDING` |

---

## 3. Registre par Provenance

### Section REAL_FIELD_DATA
*Aucun retour pour le moment (`REAL_FIELD_DATA = 0`). Attente de l'ouverture officielle de la collecte terrain auprès de la cohorte pilote.*

### Section CONTROLLED_TEST_DATA
*Registre prêt pour la consignation des observations faites lors des évaluations de recette et tests d'ergonomie.*

### Section SIMULATION_DATA / TECHNICAL
*Registre prêt pour la consignation des anomalies techniques remontées par le banc d'essai et la télémétrie système.*

---

## 4. Procédure d'Inscription d'un Nouveau Feedback

Tout nouvel enregistrement doit être soumis via la structure du schéma canonique (`/FEEDBACK_OS/FEEDBACK_SCHEMA.md`) et faire l'objet d'un événement d'historique dans `/FEEDBACK_OS/FEEDBACK_HISTORY.md`.
