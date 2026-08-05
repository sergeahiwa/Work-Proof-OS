# WORK PROOF OS v1.6 — TECHNICAL SPECIFICATION FOR PORTABILITY & VERIFICATION (PHASE 2)

**Document Version:** 2.0  
**Status:** Official Technical Implementation Specification  
**Compliance Target:** Canon SSOT (`VISION_PRODUIT_CANONIQUE_WORK_PROOF_OS_v1.0.md` & `CAHIER_DES_CHARGES_CANONIQUE_WORK_PROOF_OS_v1.0.md`)  

---

## 1. OBJECTIFS & PÉRIMÈTRE DE LA PHASE 2

La Phase 2 ("Portabilité & Vérification") répond aux principes fondamentaux de **souveraineté utilisateur** et de **démontrabilité externe** :

1. **Portabilité Souveraine :** Permettre l'exportation intégrale des preuves et passeports de réalisations sous forme d'archives JSON normalisées et de certificats PDF officiels.
2. **Vérification d'Intégrité :** Établir un algorithme déterministe d'ancrage cryptographique (`computeProofHash`) permettant la détection immédiate de toute altération de contenu.
3. **Signal Public pour Tiers :** Fournir des structures de données allégées pour les moteurs de décision ou recruteurs tiers sans exposer de données personnelles sensibles.

---

## 2. SPÉCIFICATION TECHNIQUE DES EXPORTS (PORTABILITÉ)

### 2.1 Export JSON Souverain (`exportProofJSON`)

L'export JSON est le format de portabilité machine-readable universel. Il conserve la structure STAR, les métadonnées de vérification et les signatures cryptographiques d'ancrage.

**Schéma d'export (`proof-export.json`) :**

```json
{
  "$schema": "https://workproof.os/schema/v1.0/proof-export.json",
  "protocolVersion": "1.0",
  "exportedAt": "2026-08-05T08:10:00.000Z",
  "sovereignOwner": "Nom de l'utilisateur",
  "proofCount": 1,
  "proofs": [
    {
      "id": "proof_12345",
      "title": "Optimisation de pipeline CI/CD",
      "description": "AVANT: ... ACTION: ... RÉSULTAT: ... CAUSALITÉ: ...",
      "type": "work_proof",
      "starStructure": {
        "situationBefore": "Déploiements manuels de 45 minutes avec erreurs fréquentes.",
        "action": "Automatisé le pipeline GitHub Actions avec conteneurisation Docker.",
        "result": "Réduction du temps de déploiement à 4 minutes (-91%).",
        "causality": "Mesuré directement sur 30 déploiements consécutifs en production."
      },
      "metadata": {
        "status": "preuve_verifiee",
        "strength": "credible",
        "verified": true,
        "confidenceScore": 95,
        "date": "2026-08-01T12:00:00.000Z",
        "verifierId": "usr_expert_01",
        "verificationComment": "Validé par audit technique des logs CI."
      },
      "integrity": {
        "canonicalHash": "WPOS-HASH-7F3A-9B1C",
        "anchorHash": "WPOS-HASH-7F3A-9B1C",
        "verifiedIntegrity": true
      }
    }
  ]
}
```

### 2.2 Certificat PDF Officiel & Passeport (`exportProofPDF` / `exportProofLedgerPDF`)

- **Certificat de Preuve Individuelle (`exportProofPDF`) :**
  - En-tête officiel Work Proof OS avec référence unique et horodatage ISO.
  - Cartouche "Titulaire", "Statut" et "Identifiant de Preuve".
  - Tableau de la structure STAR complète (Situation, Action, Résultat, Causalité).
  - Score de confiance & Sceau du validateur tiers.
  - Bas de page avec ancrage cryptographique (`HASH : WPOS-HASH-...`) et lien de vérification publique.

- **Passeport & Registre de Preuves (`exportProofLedgerPDF`) :**
  - Synthèse globale du passeport professionnel.
  - Tableau récapitulatif chronologique de toutes les preuves déclarées/vérifiées.
  - Statuts, niveaux de confiance et hashes d'ancrage.

---

## 3. ALGORITHME DE HACHAGE & VÉRIFICATION D'INTÉGRITÉ

### 3.1 Normalisation Canonique (`getCanonicalProofString`)

Afin d'éviter tout faux positif lié aux espaces ou à l'ordre des propriétés, la chaîne de caractères à hacher est produite selon un schéma strict :

```typescript
{
  id: proof.id,
  title: proof.title,
  description: proof.description,
  before: proof.before,
  action: proof.action,
  result: proof.result,
  causality: proof.causality,
  status: proof.status,
  strength: proof.strength,
  date: proof.date,
  verified: proof.verified
}
```

### 3.2 Calcul du Hash (`computeProofHash`)

Formule déterministe combinant le hachage bidirectionnel de la chaîne canonique :

```
computeProofHash(proof) = "WPOS-HASH-" + Hash(canonical) + "-" + Hash(reverse(canonical))
```

### 3.3 Contrôle d'Intégrité (`verifyProofIntegrity`)

Pour chaque preuve contrôlée :
1. Calcul du `computedHash` courant sur les champs actuels de la preuve.
2. Comparaison avec `storedHash` ou `proof.hash`.
3. Si `computedHash !== storedHash` -> **Alerte d'altération / Incohérence**.
4. Si correspondance -> **Intégrité cryptographique validée**.

---

## 4. CONTRATS D'API / SERVICE (`src/services/verificationService.ts`)

| Fonction | Description | Entrée | Sortie |
| :--- | :--- | :--- | :--- |
| `computeProofHash` | Calcule le hash déterministe d'une preuve | `Partial<Proof>` | `string` |
| `verifyProofIntegrity` | Vérifie la conformité du hash | `Partial<Proof>, storedHash?` | `{ isValid, computedHash, storedHash, reason }` |
| `exportProofJSON` | Génère l'archive JSON souveraine | `Proof \| Proof[], userName?` | `string` (JSON) |
| `verifyProofJSON` | Inspecte et valide un fichier JSON importé | `jsonString` | `{ isValid, verifiedCount, data, error }` |
| `getPublicSignalData` | Génère le signal public allégé | `Proof` | `PublicSignalObject` |

---

## 5. RESPECT STRICT DES INVARIANTS CANONIQUES

1. **Aucun Scoring IA :** Le hash et le niveau de confiance reposent uniquement sur la complétude factuelle STAR et les validations humaines. L'IA n'intervient à aucun moment dans le calcul du hash.
2. **Souveraineté Utilisateur :** L'utilisateur peut exporter son passeport et ses preuves à tout moment sans dépendance vis-à-vis de la plateforme.
3. **Immutabilité de la Preuve :** Toute modification de texte sur une preuve modifie immédiatement son `computedHash`, invalidant tout ancrage antérieur en cas de falsification.
