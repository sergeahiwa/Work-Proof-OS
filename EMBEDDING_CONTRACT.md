# CONTRACT SYSTEM — EMBEDDING LAYER v1 (WORK PROOF OS)

Ce document définit le cadre strict d’utilisation des embeddings dans Work Proof OS.

---

🧭 1. OBJECTIF DU CONTRAT
Préserver l’intégrité du CORE déterministe et garantir une intégration contrôlée dans KAIROS Decision OS.

🚫 2. PRINCIPES NON NÉGOCIABLES
2.1 Séparation CORE / SEMANTIC LAYER
❌ Embeddings interdits dans : proofService, credibilityService, scoring engine, validation logic, ledger computation.
✔ Embeddings autorisés uniquement dans : semantic layer isolée, search / retrieval, clustering non décisionnel.

2.2 Interdiction de décision implicite
Les embeddings ne peuvent jamais modifier un score, valider une preuve ou influencer un résultat final.

2.3 Principe de non-falsification
Tout output doit être interprétable, traçable, non bloquant et non destructif.

🧱 3. ARCHITECTURE AUTORISÉE
Module dédié : `/src/semantic-layer/`
Flux : User Input → Proof Engine (CORE) → Event emitted → Semantic Layer (async) → Insights ONLY.

🧠 4. RÔLE AUTORISÉ DES EMBEDDINGS
✔ Similarité sémantique (regroupement, doublons non bloquants).
✔ Recherche intelligente (retrieval augmenté).
✔ Insights non décisionnels (suggestions).

🔒 5. GARANTIES D’ISOLATION
Aucun import vers CORE. Exécution asynchrone hors path critique. CORE reste la source unique de vérité.

🚨 8. FAIL-SAFE OBLIGATOIRES
Si l'API échoue : fallback = NO OP. Aucun impact sur le CORE.
Anti-contamination : aucune donnée embedding ne peut réécrire une preuve ou altérer un score.

📊 9. CLASSIFICATION OFFICIELLE
- Proof/Trust Engine/Ledger : CORE (STRICT)
- Embedding Layer : SEMANTIC ESCROW

🛡️ 10. ENFORCEMENT & AUDITABILITÉ
- Isolation : Vérifiée par script `scripts/check-architecture.sh` et `src/scripts/verify-arch.ts`.
- Traçabilité : Collection `/embedding_logs` enrichie (userId, tenantId, contextType).
- Sécurité : Règles Firestore strictes et immuabilité.
- Analytics : Shadow Intelligence (détection d'anomalies > 0.95).
- Contrôle : Kill Switch `EMBEDDING_ENABLED` disponible dans la config.

⚖️ 11. CALIBRATION
- Seuil : Configurable via `DEFAULT_THRESHOLD`.
- Monitoring : Distribution des scores logguée dans `shadow_metrics`.

🎯 12. CONCLUSION
Les embeddings peuvent enrichir le système, mais jamais décider à sa place.
