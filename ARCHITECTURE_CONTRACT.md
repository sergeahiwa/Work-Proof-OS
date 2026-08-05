# Work Proof OS — ARCHITECTURE CONTRACT v1.6

## 🧭 1. OBJECTIVE
This contract defines the strict separation of concerns for Work Proof OS to prevent architectural drift and maintain technical integrity, specifically isolating the Core Engine from the Reality Intelligence Layer (RIL v1.0).

## 🏗️ 2. MODULE ROLES (STRICT)

### 🔹 [CORE] RULES ENGINE
- **Role**: Sole decision producer for proof state and initial strength.
- **Responsibility**: Deterministic validation of inputs (Context, Action, Result, Causality).
- **Control**: `proofService.ts` is the unique entry point for "Publish" and "Structure" logic.
- **Constraint**: Must NOT import or depend on Credibility scores or RIL intelligence for decisions.

### 🔹 [LAYER] CREDIBILITY ENGINE (SIGNAL)
- **Role**: Passive trust signal enrichment.
- **Responsibility**: Calculate confidence scores based on social/automated validations.
- **Constraint**: Strictly non-blocking. A low credibility score MUST NOT prevent a proof from being published or verified.

### 🔹 [LAYER] REALITY INTELLIGENCE LAYER (RIL v1.0)
- **Role**: Passive activity signal detection, STAR proof suggestion, velocity radar & bias shield.
- **Responsibility**: Detect informal work signals, generate STAR draft suggestions, analyze skill velocity trends, and suggest empowering reformulations.
- **Constraint**: Strictly non-decisional (`AI_OUTPUT = ADVISORY_ONLY`). RIL cannot calculate Credibility Scores (`AI_NO_SCORING`), cannot auto-validate proofs (`COLLUSION_PASSIVE`), and must never be imported by the Core Engine (`proofService.ts`, `credibilityService.ts`, `collusionService.ts`).

### 🔹 [LAYER] GOVERNANCE LAYER (AUDIT & EPP)
- **Role**: Observability, anti-fraud, anomaly detection, and EPP execution proof enforcement.
- **Responsibility**: Record `audit_logs`, enforce system invariants via `verify-contract.ts`, and maintain `IA-FIRST_EXECUTION_PROOF_PROTOCOL.md`.
- **Constraint**: Strictly passive at runtime. Must NOT modify decisions made by the Rules Engine.

## 🔄 3. ARCHITECTURAL FLOW (RIL → CORE ISOLATION)
```
[User Action / Informal Text]
         │
         ▼
[Reality Intelligence Layer (RIL)] ──► Draft Suggestion (Advisory Only)
         │
         │ (User Explicit Acceptance & Edit)
         ▼
[User-Authored STAR Proof]
         │
         ▼
[Rules Engine (CORE: proofService.ts)] ──► Sovereign Proof Record
         │
         ▼
[Credibility Engine (credibilityService.ts)] ──► Deterministic Credibility Score
```

## 🚫 4. EXPLICIT PROHIBITIONS
1. **No Decision Influence**: Module outputs (except Rules Engine) must not alter the `status` or `validity` of a core entity.
2. **No Enforcement in Credibility**: Credibility must never trigger a "Block" or "Deny" action on its own.
3. **No Circular Dependence**: Core files (`proofService.ts`, `credibilityService.ts`, `collusionService.ts`) must NEVER import from `/src/services/intelligence/`.
4. **No Runtime Audit Blocking**: Audit checks must not interrupt the execution flow of the user journey.

---
*Status: ARCHITECTURE & RIL v1.0 FREEZE WORK PROOF OS v1.6*

