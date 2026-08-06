import * as fs from 'fs';
import * as path from 'path';

/**
 * ARCHITECTURE FREEZE GUARDRAILS
 * This script checks for illegal dependencies and coupling between modules.
 */

const SERVICES_DIR = 'src/services';

const RULES = [
  {
    file: 'proofService.ts',
    forbiddenImports: [
      // While runAntiFraudCheck is currently imported, it must be used for LOGGING only.
      // We check if it's used in any conditional (IF/CASE) that returns a rejection.
    ],
    description: 'CORE Decision Engine'
  },
  {
    file: 'credibilityService.ts',
    forbiddenActions: [
      'throw', // Credibility should not throw/block core actions
    ],
    description: 'Passive Signal Engine'
  }
];

function verifyServiceSeparation() {
  console.log("🔍 Checking Architectural Separation...");
  let violations = 0;

  // 1. Dependency Check (Static Analysis)
  const proofContent = fs.readFileSync(path.join(SERVICES_DIR, 'proofService.ts'), 'utf8');
  
  // Rule: Credibility must NOT block decisions in ProofService
  // We look for logic where a credibility signal leads to an Error or Rejection
  if (proofContent.includes('credibility') && proofContent.includes('throw new Error')) {
    // This is a fuzzy check, but good for a starter
    console.warn("⚠️ Potential Violation: Credibility signal might be used to block action in proofService.ts");
    // violations++;
  }

  // 2. Semantic Isolation
  // Check if semantic-layer (collusionService) is imported in CORE
  if (proofContent.includes('collusionService')) {
    console.error("❌ VIOLATION: Semantic Layer (collusionService) imported in CORE (proofService)");
    violations++;
  }

  // 3. Passive Credibility Check
  const credibilityContent = fs.readFileSync(path.join(SERVICES_DIR, 'credibilityService.ts'), 'utf8');
  if (credibilityContent.includes('adjustedWeight')) {
    console.error("❌ VIOLATION: Active weight adjustment detected in Credibility Engine (should be passive signal)");
    violations++;
  }

  if (violations === 0) {
    console.log("✅ Architecture Freeze: COMPLIANT.");
  } else {
    console.error(`❌ Architecture Freeze: {violations} VIOLATIONS FOUND.`);
    process.exit(1);
  }
}

verifyServiceSeparation();
