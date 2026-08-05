# FEEDBACK DECISION LINK — WORK PROOF OS
## Chaîne de Traçabilité & Liaison Feedback-Décision

**Version :** 1.0  
**Statut :** Protocole de Traçabilité / Gouvernance  
**Rattaché aux SSOT :**
- `/FEEDBACK_OS/FEEDBACK_POLICY.md`
- `/DECISION_LOG_WORK_PROOF_OS.md`

---

## 1. Principe Général

Chaque décision produit d'importance enregistrée dans `/DECISION_LOG_WORK_PROOF_OS.md` ou chaque évolution majeure du backlog doit pouvoir justifier de sa source originelle. Inversement, chaque feedback qualifié doit pouvoir être suivi jusqu'à sa résolution ou son rejet formel.

La chaîne de traçabilité canonique de maturité suit impérativement le flux étendu :

```text
  [ 1. Feedback ]  (Inscrit au FEEDBACK_REGISTRY.md avec ID unique & Signal Strength)
         │
         ▼
  [ 2. Decision ]  (Consignée au DECISION_LOG_WORK_PROOF_OS.md)
         │
         ▼
  [ 3. Roadmap ]   (Déclinée dans /FEEDBACK_OS/FEEDBACK_ROADMAP_LINK.md)
         │
         ▼
 [ 4. Implementation ] (Modifications de spécifications, process ou code)
         │
         ▼
 [ 5. Verification ]   (Validation QA, contrôle non-régression et clôture)
```

---

## 2. Table des Liaisons Formelles

| Feedback Source ID | Catégorie | Summary / Constat | Décision Produit Associée | Statut de la Traçabilité |
|---|---|---|---|---|
| *Attente* | `UX_FRICTION` | *Liaisons établies lors des arbitrages du Product Manager* | `DECISION-PENDING` | 🟢 Intègre |

---

## 3. Matrice de Raccordement aux Invariants Canoniques

Lorsqu'un feedback soulève une question liée aux 7 invariants canoniques de Work Proof OS, la liaison décisionnelle doit explicitement vérifier l'un des critères de non-régression suivants :

1. **PROOF_FIRST :** La décision renforce-t-elle la priorité à la preuve factuelle sur la déclaration ?
2. **USER_SOVEREIGNTY_FIRST :** L'utilisateur conserve-t-il le contrôle total de sa donnée et de sa publication ?
3. **AI_NO_SCORING :** L'IA reste-t-elle strictement dépourvue de fonction d'évaluation ou de notation personnelle ?
4. **AI_OUTPUT_ADVISORY_ONLY :** Les suggestions de l'IA demeurent-elles purement consultatives ?
5. **HUMAN_VALIDATION_REQUIRED :** La validation de la preuve dépend-elle toujours exclusivement d'une confirmation humaine ?
6. **CORE_RIL_ISOLATION :** L'isolation entre le Core transactionnel et le RIL est-elle maintenue ?
7. **CREDIBILITY_TRANSACTIONAL :** Le score de crédibilité repose-t-il uniquement sur la chaîne transactionnelle de faits vérifiés ?

---

## 4. Règles de Rejet de Feedback

Si un feedback propose une modification contraire aux 7 invariants canoniques (ex: "Ajouter un bouton Like" ou "Calculer un score de compétence automatique par IA") :
- Le feedback est conservé dans `/FEEDBACK_OS/FEEDBACK_REGISTRY.md` avec le statut `REJECTED` ;
- La raison du rejet est documentée par référence directe à l'invariant canonique concerné ;
- L'entrée dans `/FEEDBACK_OS/FEEDBACK_DECISION_LINK.md` confirme que l'invariant prévaut sur la suggestion.
