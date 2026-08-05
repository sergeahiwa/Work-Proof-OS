# CHANGELOG — WORK PROOF OS

## [v1.6] - 2026-08-05
### Added
- **Reality Intelligence Layer (RIL v1.0)** :
  - Services d'intelligence : `realitySignalService.ts`, `proofDiscoveryService.ts`, `evolutionRadarService.ts`, `biasShieldService.ts`.
  - Composants UI : `ProofSuggestionsCard.tsx`, `EvolutionRadarPanel.tsx`, `BiasShieldPanel.tsx`, `RILOverviewPanel.tsx`.
- **EPP Governance Standard** :
  - Spécification `IA-FIRST_EXECUTION_PROOF_PROTOCOL.md` (EPP v1.0).
  - Registre officiel de gel `FREEZE_RECORD_RIL_v1.0.md`.
- **Règles Firestore** :
  - Isolation d'accès pour `/reality_signals/{signalId}` et `/proof_suggestions/{suggestionId}`.

### Security & Integrity
- Isolation stricte Bounded Context RIL <-> Core transactionnel.
- Validation 100% réussie de `verify-contract.ts` et `npm run build`.

---

## [v1.5] - 2026-08-04
### Added
- Core transactionnel WORK PROOF OS (Preuves STAR, Credibility Score, Anti-collusion, Shadow Metrics).
