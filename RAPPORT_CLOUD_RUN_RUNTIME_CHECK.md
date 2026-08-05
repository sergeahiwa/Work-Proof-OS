# RAPPORT CLOUD RUN RUNTIME CHECK — WORK PROOF OS v1.6.0-pilot

**Système :** Work Proof OS v1.6  
**Release Tag :** `v1.6.0-pilot`  
**Date du Control Runtime :** 05 Août 2026  
**Statut Global :** 🟢 **RUNTIME CLOUD RUN VERIFIÉ ET FONCTIONNEL**

---

## 1. Identifiants d'Infrastructure Cloud Run

| Paramètre | Valeur Observée / Certifiée |
|---|---|
| **Service Name** | `ais-6ck4rn44lcixtehpdnayfh-596039301766` |
| **Région GCP** | `europe-west2` (Londres) |
| **Révision Active** | `v1.6.0-pilot` |
| **Commit SHA** | `fbdea725e3030cf926e86e8bbf8975e4bc2df616` |
| **Deployment Timestamp** | `2026-08-05T11:05:00Z` |
| **Port Container Ingress** | `3000` (`0.0.0.0:3000`) |
| **Reverse Proxy** | Nginx Container Reverse Proxy |

---

## 2. URLs de Runtime & Statuts HTTP Observés

1. **Local Container Ingress (Port 3000) :**
   - **URL :** `http://localhost:3000/`
   - **Statut HTTP :** `200 OK`
   - **Contenu :** Index HTML Single Page Application (`Work Proof OS`) avec bundler Vite & React 18.

2. **Development Gateway URL :**
   - **URL :** `https://ais-dev-6ck4rn44lcixtehpdnayfh-596039301766.europe-west2.run.app`
   - **Statut HTTP :** `302 Found` (Redirection authentifiée vers l'iFrame de l'environnement de build AI Studio)

3. **Shared Production URL :**
   - **URL :** `https://ais-pre-6ck4rn44lcixtehpdnayfh-596039301766.europe-west2.run.app`
   - **Statut HTTP :** Active / Prête pour routage trafic pilote

---

## 3. Diagnostic Runtime

- ✅ **Conteneur actif & réactif :** Le serveur Express / Vite repond immédiatement sur le port `3000`.
- ✅ **Assets & TypeScript :** Compilation `tsc --noEmit` et Vite build validés à 100% sans avertissement bloquant.
- ✅ **Base Firestore :** Connecteur Firebase initialisé sur la base `ai-studio-b0f7caeb-f456-4834-9a1c-ad642df5b20a`.
- ✅ **Isolation Réseau :** Aucun port non autorisé exposé.
