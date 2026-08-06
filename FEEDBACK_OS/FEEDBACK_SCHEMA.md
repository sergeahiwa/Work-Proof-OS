# FEEDBACK SCHEMA — WORK PROOF OS
## Modèle Canonique de Données du Feedback OS

**Version :** 1.0  
**Statut :** Spécification de Modèle / Gouvernance  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/DATA_PROVENANCE_STANDARD.md`

---

## 1. Structure du Modèle de Feedback

Tout enregistrement dans le Feedback OS doit respecter sans exception la structure de données canonique définie ci-dessous.

```json
{
  "feedback_id": "FB-2026-0001",
  "date": "2026-08-05T10:00:00Z",
  "phase_projet": "PHASE_5_PILOTE",
  "source_type": "CONTRIBUTEUR_PILOTE | VALIDATEUR | TIERS_VERIFICATEUR | OBSERVATEUR_UX | SUPPORT | AUDITEUR",
  "provenance": "REAL_FIELD_DATA | CONTROLLED_TEST_DATA | SIMULATION_DATA | SYNTHETIC_DATA",
  "categorie": "BUG | UX_FRICTION | TRUST_ISSUE | VALUE_CONFUSION | MISSING_CAPABILITY | SECURITY_CONCERN | PERFORMANCE | STRATEGIC_SIGNAL | NOISE",
  "description_factuelle": "Description brute et vérifiable de l'observation sans jugement de valeur ni solution préconçue.",
  "impact": "Explication de l'impact direct sur l'expérience utilisateur, l'intégrité de la preuve ou la confiance.",
  "severite": "CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL",
  "frequence": "SINGLE_OCCURRENCE | RECURRENT | SYSTEMIC",
  "signal_strength": "LOW_SIGNAL | MEDIUM_SIGNAL | HIGH_SIGNAL | CRITICAL_SIGNAL",
  "lifecycle_status": "NEW | TRIAGED | ANALYZED | DECISION_PENDING | ACCEPTED | REJECTED | DEFERRED | IMPLEMENTED | VERIFIED | ARCHIVED",
  "decision_associee": "DECISION-ID-OU-NONE",
  "roadmap_reference": "RDMP-ITEM-ID-OU-NONE",
  "verification_status": "PENDING | VERIFIED_PASSED | VERIFIED_FAILED | NOT_APPLICABLE",
  "statut": "NOUVELLE | EN_COURS | CLOTUREE"
}
```

---

## 2. Dictionnaire des Champs

| Champ | Type | Description / Valeurs Autorisées |
|---|---|---|
| `feedback_id` | `String` | Identifiant unique séquentiel immuable (Format: `FB-YYYY-XXXX`). |
| `date` | `ISO8601 String` | Date et heure de saisie de l'observation. |
| `phase_projet` | `Enum` | Phase active lors de l'observation (`PHASE_1_CORE`, `PHASE_2_RIL`, `PHASE_3_VALIDATION`, `PHASE_4_INSTRUMENTATION`, `PHASE_5_PILOTE`, `PHASE_6_INDUSTRIALISATION`). |
| `source_type` | `Enum` | Typologie de l'émetteur : `CONTRIBUTEUR_PILOTE`, `VALIDATEUR`, `TIERS_VERIFICATEUR`, `OBSERVATEUR_UX`, `SUPPORT`, `AUDITEUR`. |
| `provenance` | `Enum` | Qualification stricte selon `/DATA_PROVENANCE_STANDARD.md` : `REAL_FIELD_DATA`, `CONTROLLED_TEST_DATA`, `SIMULATION_DATA`, `SYNTHETIC_DATA`. |
| `categorie` | `Enum` | Catégorisation canonique selon `/FEEDBACK_OS/FEEDBACK_TRIAGE_RULES.md`. |
| `description_factuelle` | `String` | Contenu brut de l'observation. Aucun terme interprétatif. |
| `impact` | `String` | Analyse neutre des conséquences constatées ou potentielles. |
| `severite` | `Enum` | `CRITICAL` (blocage absolu), `HIGH` (friction majeure), `MEDIUM` (gêne), `LOW` (détail cosmetic), `INFORMATIONAL` (remarque neutre). |
| `frequence` | `Enum` | `SINGLE_OCCURRENCE` (isolé), `RECURRENT` (observé plusieurs fois), `SYSTEMIC` (structurel). |
| `signal_strength` | `Enum` | Force du signal produit selon `/FEEDBACK_OS/FEEDBACK_SIGNAL_STRENGTH.md` (`LOW_SIGNAL`, `MEDIUM_SIGNAL`, `HIGH_SIGNAL`, `CRITICAL_SIGNAL`). |
| `lifecycle_status` | `Enum` | État dans la machine d'état officielle selon `/FEEDBACK_OS/FEEDBACK_LIFECYCLE.md` (`NEW`, `TRIAGED`, `ANALYZED`, `DECISION_PENDING`, `ACCEPTED`, `REJECTED`, `DEFERRED`, `IMPLEMENTED`, `VERIFIED`, `ARCHIVED`). |
| `decision_associee` | `String` | Référence vers l'entrée du `/DECISION_LOG_WORK_PROOF_OS.md` liée (ou `DECISION_PENDING`). |
| `roadmap_reference` | `String` | Référence de raccordement vers l'item de feuille de route selon `/FEEDBACK_OS/FEEDBACK_ROADMAP_LINK.md`. |
| `verification_status` | `Enum` | État de vérification post-implémentation (`PENDING`, `VERIFIED_PASSED`, `VERIFIED_FAILED`, `NOT_APPLICABLE`). |
| `statut` | `Enum` | État global de traitement de l'observation (`NOUVELLE`, `EN_COURS`, `CLOTUREE`). |

---

## 3. Immuabilité et Historisation

1. **L'identifiant `feedback_id` est pérenne.** Une fois attribué, il ne peut plus être réassigné.
2. **Historique des changements de statut :** Toute modification de statut ou d'assignation de décision doit être enregistrée dans `/FEEDBACK_OS/FEEDBACK_HISTORY.md`.
