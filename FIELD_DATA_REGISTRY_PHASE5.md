# REGISTRE DE COLLECTE REAL_FIELD_DATA — PHASE 5
## Work Proof OS v1.6

**Statut du Registre :** 🟢 ACTIF — `PILOT_RUNNING_REAL_FIELD_DATA_COLLECTION`  
**Standard de Provenance :** Conforme à `/DATA_PROVENANCE_STANDARD.md`  
**Classification des Données Autorisée sur ce Registre :** `REAL_FIELD_DATA` exclusivement  

---

## 1. Métadonnées de la Campagne Terrain Active

* **Statut du Pilote :** `ACTIVE` (`PILOT_RUNNING_REAL_FIELD_DATA_COLLECTION`)
* **Date de Début de Collecte :** 05 Août 2026 (00:00 UTC)
* **Date de Fin Prévue (J+21) :** 26 Août 2026 (23:59 UTC)
* **Identifiant Campagne :** `CAMP-PHASE5-REAL-FIELD-01`
* **Protocole Appliqué :** `/PILOT_PROTOCOL_REAL_FIELD_PHASE5.md`
* **Responsable de Validation de Provenance :** Product Manager & Agent Gouvernance Produit
* **Décision d'Autorisation :** `DECISION-PHASE5-COHORTE-RECRUITMENT-APPROVAL`

---

## 2. Déclaration Préalable d'Intégrité & Baseline

Conformément aux règles de gouvernance Work Proof OS :
- **Nombre d'enregistrements `REAL_FIELD_DATA` actuellement disponibles (Baseline) :** `0` (Démarrage officiel de la période de captation passive).
- **Avertissement Stricte :** Aucune donnée issue de bancs d'essai (`SIMULATION_DATA`), de démonstrations (`SYNTHETIC_DATA`) ou de sessions de tests guidés (`CONTROLLED_TEST_DATA`) ne sera consignée ni comptabilisée dans ce registre.

---

## 3. Rôles & Gouvernance de Validation des Données Terrain

### Définition Officielle `REAL_FIELD_DATA`
Les `REAL_FIELD_DATA` sont formellement définies comme les données collectées auprès d'utilisateurs externes réels participant au pilote officiel, dans une situation d'utilisation réelle du produit.

### Sources Possibles
- Télémétrie d'utilisation ;
- Questionnaires ;
- Retours qualitatifs ;
- Observations structurées ;
- Événements métier liés au parcours utilisateur.

### Conditions Obligatoires
1. **Utilisateur externe** identifié comme participant pilote ;
2. **Collecte** effectuée strictement pendant la fenêtre officielle ;
3. **Origine traçable** et démontrable ;
4. **Aucune génération ou simulation** autorisée.

### Autorité de Validation
Seul le **Product Manager (Maîtrise d'Ouvrage)** dispose de l'autorité de validation formelle pour approuver l'inscription d'un lot de métriques au titre de `REAL_FIELD_DATA`.

### Interdiction de Classification Automatique par Agent IA
**Règle absolue :** Les agents d'IA (agents de gouvernance, d'exécution ou d'analyse) sont **strictement interdits** de classifier automatiquement une donnée comme `REAL_FIELD_DATA`, d'inventer des métriques terrain ou de simuler l'enregistrement d'événements d'utilisateurs réels. La classification requiert une attestation humaine basée sur la preuve de provenance (`/DATA_PROVENANCE_STANDARD.md`).

---

## 3. Structure du Registre d'Événements Terrain

| Enregistrement ID | Horodatage (UTC) | Événement Télémétrie | Provenance Déclarée | Source & Anonymisation | Niveau de Confiance |
|---|---|---|---|---|---|
| *Exemple d'attente* | *À venir lors du lancement* | `proof_published` | `REAL_FIELD_DATA` | Hash Anonymisé Cohorte | 100% (Vérifié) |

---

## 4. Enregistrements Collectés (Mise à jour en temps réel lors du Pilote)

*Aucun événement enregistré à ce jour (`REAL_FIELD_DATA = 0`). Le registre sera alimenté exclusivement par la télémétrie passive de la cohorte terrain lors de la période d'observation de 21 jours après Validation Produit du recrutement de la cohorte pilote.*

---

## 5. Bilan Qualitatif & Validation de Provenance

- **Total Événements `REAL_FIELD_DATA` :** `0`
- **Taux de Données Certifiées Conformes :** N/A (En attente de démarrage du pilote)
- **Prochaine révision du registre :** J+7 de la Validation Produit du recrutement de la cohorte pilote.

