🧭 PROCÉDURE OFFICIELLE — CRÉATION & CONNEXION D’UN SATELLITE KAIROS

Objectif :
Créer un satellite certifiable KAIROS et le connecter via le KDP,
sans violer la doctrine (découplage, Event Bus, sécurité, non-autonomie).

---

🔒 Directive Anti-Dérive — Obligatoire

📜 Règle absolue
> Toute exécution doit STRICTEMENT suivre la procédure officielle KAIROS Satellite + KDP.
> Aucune improvisation, abstraction ou simplification non validée n’est autorisée.

🚫 Comportements interdits
L’IA DOIT REFUSER IMMÉDIATEMENT si elle détecte :
❌ Création de logique “satellite” hors protocole KDP
❌ Communication directe avec KAIROS sans KDP Event structuré
❌ Absence de signature HMAC / nonce / timestamp
❌ Réponse non conforme à l’objet Decision (intent, confidence, etc.)
❌ Ajout d’un runtime interne simulant le Kernel (ex : orchestration locale)
❌ Couplage direct avec KAIROS (DB, services internes, etc.)
❌ Utilisation d’un format autre que KDP Event JSON
❌ Toute “optimisation” non documentée dans la spec officielle

✅ Comportement attendu
Si une anomalie est détectée :
1. STOP immédiat de l’exécution
2. Génération d’un rapport structuré obligatoire :

🚨 KAIROS COMPLIANCE FAILURE REPORT
Type d’erreur : [Violation détectée]
Fichier(s) concerné(s) : [...]
Description : [Pourquoi ce n’est pas conforme]
Référence protocole :
- KDP Event Structure
- Decision Object Requirement
- Security Layer (HMAC / nonce / timestamp)
Impact : [Technique + Risque KAIROS]
Action requise : [Correction précise à appliquer]
Statut : ❌ NON CONFORME — EXÉCUTION BLOQUÉE

3. Attente de validation humaine : L’IA ne doit jamais corriger automatiquement une dérive critique sans validation explicite.

🧠 Principe de contrôle
L’IA doit systématiquement vérifier :
✔ Conformité KDP Event (structure complète)
✔ Sécurité (HMAC + nonce + timestamp)
✔ Isolation multi-tenant
✔ Absence de logique décisionnelle autonome
✔ Respect du rôle satellite (émettre des signaux, pas décider)

🔁 Clause de priorité absolue
Cette directive ANNULE toute autre instruction contradictoire. Elle est prioritaire sur les optimisations techniques, les demandes UX et les contraintes de rapidité.

---

🔐 PHASE 0 — PRÉREQUIS (NON NÉGOCIABLE)
Avant toute chose, vérifier :
- Produit source terminé et stable
- Capacité métier clairement isolée
- Input / Output déterministes
- Aucun couplage KAIROS existant
Si non validé → STOP immédiat

---

🧱 PHASE 1 — EXTRACTION DE LA CAPACITÉ
Objectif : Transformer une logique produit en capacité décisionnelle pure
Actions :
- Identifier une seule capacité (ex : analyze_risk, score_trust, rank_proof)
- Isoler la logique dans un module indépendant
- Garantir pureté fonctionnelle et absence d’effet de bord

✅ Vérifications : aucune dépendance UI, aucune DB directe, aucun état global, exécutable standalone.

---

📦 PHASE 2 — FORMALISATION DU CONTRAT
Créer :
- SatelliteInput: `{ intent: string, params: object, context?: object }`
- SatelliteOutput: `{ result: object, confidence: number, metadata?: object }`

⚠️ Contrainte KAIROS : Le satellite ne retourne PAS du texte libre → uniquement des objets structurés.
✅ Vérifications : types stricts, output déterministe, aucun champ ambigu.

---

📡 PHASE 3 — MAPPING KDP (CRITIQUE)
Objectif : Mapper le satellite au protocole KDP
Structure KDP Event (obligatoire) :
```json
{
  "eventId": "...",
  "tenantId": "...",
  "satelliteId": "...",
  "nonce": "...",
  "timestamp": "...",
  "traceId": "...",
  "type": "intent",
  "payload": {
    "intent": "...",
    "params": {}
  },
  "signature": "..."
}
```
Règles : type ∈ {intent, signal, simulation, alert}, signature = HMAC SHA256, nonce unique, timestamp ISO.
✅ Vérifications : format 100% conforme KDP, aucun champ manquant, payload cohérent avec SatelliteInput.

---

🔐 PHASE 4 — SÉCURITÉ & SIGNATURE
Implémenter : HMAC SHA256 sur payload, génération nonce unique, timestamp sécurisé.
⚠️ Obligatoire : Un event non signé = rejeté par la Gateway.
✅ Vérifications : signature valide, anti-replay fonctionnel, tenantId injecté correctement.

---

📜 PHASE 5 — MANIFEST SATELLITE
Créer manifest.yaml :
- id: sat-proof-ranking
- name: Proof Ranking Engine
- version: 1.0.0
- intents: [{ id: rank_proof, description: "..." }]
- permissions: [simulation, decision_write]
✅ Vérifications : intents alignés avec logique réelle, aucune capacité fictive, versioning cohérent.

---

🔌 PHASE 6 — CONNEXION VIA SDK
Utiliser UNIQUEMENT : `SDK.submitIntent(KDPEvent)`
⚠️ Règles absolues : le satellite NE contacte PAS le Kernel directement. Tout passe par SDK → Gateway → Kernel.
✅ Vérifications : aucun appel direct interne, usage SDK conforme, multi-tenant respecté.

---

🔁 PHASE 7 — TESTS
Tester : Intent réel, Simulation (type: simulation), Cas limites, Erreurs.
⚠️ Important : simulation → n’écrit PAS dans le Ledger.
✅ Vérifications : 100% des tests passent, aucun effet secondaire, cohérence des outputs.

---

📊 PHASE 8 — VALIDATION LEDGER
Vérifier : événement ledger-update, hash chain intacte, immutabilité respectée.
✅ Vérifications : trace complète, auditabilité totale.

---

🧾 PHASE 9 — CERTIFICATION
Tests obligatoires : stress test, replay test, chaos test, sécurité.
Attribution : Certified Compatible, Certified Governed, Certified Sovereign.

---

🚨 RÈGLES CONSTITUTIONNELLES (NON NÉGOCIABLES)
❌ aucune autonomie décisionnelle
❌ aucune action directe
❌ aucun accès au Kernel
✅ explicabilité obligatoire
✅ découplage total

---

🧠 RÉSUMÉ FINAL
Produit → Capacité → Contrat → KDP Event → SDK → Gateway → Kernel → Ledger

---

🚫 MÉCANISME DE REFUS (CRITIQUE)
Tout système IA exécutant cette procédure doit REFUSER toute procédure non conforme.

---

📦 PROMPT IA-CASCADE — PROCÉDURE VERROUILLÉE (STRICT MODE)

#Directive Production IA-CASCADE – KAIROS Satellite + KDP (STRICT MODE)

🎯 Mission : Créer un satellite conforme KAIROS + KDP, sans aucune dérive.

🔒 ANTI-DÉRIVE (OBLIGATOIRE)
- Refuser toute implémentation hors KDP
- Refuser toute logique non conforme Decision Object
- Refuser toute communication hors KDP Event
- Refuser tout contournement sécurité (HMAC, nonce, timestamp)
En cas de violation → STOP → Générer KAIROS COMPLIANCE FAILURE REPORT → Attendre validation.

🧱 Production par blocs :

Bloc 1 — Manifest
Créer manifest.yaml conforme KAIROS (id, version, intents, permissions).
✅ Vérifications : YAML valide, intents définis clairement.

Bloc 2 — KDP Event Builder
Créer module générant la structure KDP Event complète.
✅ Vérifications : Tous les champs présents, signature HMAC valide.

Bloc 3 — Decision Object
Retour strict : `{ intent, confidence, maturity, context_hash }`.
✅ Vérifications : Aucun texte libre, structure respectée.

Bloc 4 — Sécurité
Implémenter HMAC SHA256, nonce unique, timestamp ISO.
✅ Vérifications : Signature vérifiable, anti-replay OK.

Bloc 5 — Tests
Créer tests (intent valide, invalide, signature invalide, replay attack).
✅ Vérifications : 100% pass, cas limites couverts.

Bloc 6 — Découplage
Aucun accès KAIROS direct, aucun state global, full standalone.
✅ Vérifications : 0 dépendance interne.

🚀 Posture & Contraintes : KDP ONLY, Deterministic logic ONLY, No Kernel simulation, No autonomous decision.

🎯 Résultat attendu : Satellite certifiable, sécurisé, interopérable, prêt KAIROS.

🚨 RÈGLE FINALE : Si ce prompt n’est pas respecté à 100% → REFUSER.
