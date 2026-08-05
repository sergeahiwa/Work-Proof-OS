import { execSync } from 'child_process';

/**
 * BLOC 1 — ENFORCEMENT DUR
 * Script de vérification d'isolation du CORE.
 */
function checkArchitecture() {
  console.log("🔍 Running Architecture Isolation Check...");
  try {
    execSync('bash scripts/check-architecture.sh', { stdio: 'inherit' });
    console.log("✅ Architecture check passed.");
  } catch (error) {
    console.error("❌ Architecture violation detected!");
    process.exit(1);
  }
}

checkArchitecture();
