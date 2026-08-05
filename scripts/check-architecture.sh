#!/bin/bash

# Règle d'isolation : Interdire l'import de semantic-layer dans le CORE
# CORE = src/services/proofService.ts et src/services/credibilityService.ts

VIOLATIONS=0

check_file() {
  local file=$1
  if grep -q "semantic-layer" "$file"; then
    echo "❌ VIOLATION D'ARCHITECTURE : Import de semantic-layer détecté dans $file"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
}

echo "🔍 Vérification de l'isolation du CORE..."

check_file "src/services/proofService.ts"
check_file "src/services/credibilityService.ts"

if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ Isolation du CORE respectée. Aucune contamination sémantique détectée."
  exit 0
else
  echo "❌ ÉCHEC DE L'AUDIT D'ARCHITECTURE : $VIOLATIONS violation(s) trouvée(s)."
  exit 1
fi
