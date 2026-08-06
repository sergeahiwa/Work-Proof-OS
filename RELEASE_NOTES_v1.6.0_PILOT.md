# NOTES DE RELEASE — WORK PROOF OS v1.6.0-pilot

**Nom Officiel de la Release :** Work Proof OS v1.6.0-pilot  
**Type :** Release Candidate Pilote Terrain Réel  
**Date d'émission :** 05 Août 2026  
**Environnement de Déploiement :** `PILOT_PRODUCTION`  
**Statut Global :** `DEPLOYMENT_READY_FOR_REAL_FIELD_COLLECTION`

---

## 1. Résumé Exécutif

Work Proof OS v1.6.0-pilot constitue la version officielle stabilisée et audité destinée au déploiement sur l'environnement de pilote réel. L'application intègre l'ensemble du registre souverain de preuves d'expérience (Core v1.5) couplé à la couche d'intelligence passive (RIL v1.0) et aux outils d'observabilité du pilote (Feedback OS Phase 5).

---

## 2. Invariants Système Inviolables

L'ensemble du code déployé garantit sans réserve :
1. **PROOF_FIRST** : Aucune compétence ou valeur déclarée sans preuve formelle structurée.
2. **USER_SOVEREIGNTY_FIRST** : Récupération et contrôle absolu des données par l'utilisateur via export JSON/PDF.
3. **AI_NO_SCORING** : Zero scoring IA. L'IA intervient uniquement pour aider la formulation STAR ou suggérer des pistes.
4. **AI_OUTPUT_ADVISORY_ONLY** : Les suggestions du RIL sont indicatives et n'ont aucun droit de veto ou d'action directe sur la preuve.
5. **HUMAN_VALIDATION_REQUIRED** : Seule une action humaine qualifiée valide formellement une preuve d'impact.
6. **CORE_RIL_ISOLATION** : Découplage strict. Le Core fonctionne de façon autonome même sans service IA.
7. **CREDIBILITY_TRANSACTIONAL** : Calcul déterministe et vérifiable du score de crédibilité.

---

## 3. État des Données & Démarrage du Pilote

- **`REAL_FIELD_DATA = 0`** : Aucune donnée de test ou de simulation n'est injectée dans la base de production du pilote.
- La collecte des données réelles du terrain commencera exclusivement après activation officielle par le Product Manager post-déploiement.

---

## 4. Instructions d'Accès & Monitoring

- **URL d'accès Pilote :** Identifiée et configurée pour `ENVIRONMENT=PILOT_PRODUCTION`.
- **Règles de sécurité :** Actives sur Firestore (`firestore.rules`).
- **Journalisation :** Activée sur le système d'observabilité sans capturer de données personnelles (PII).
