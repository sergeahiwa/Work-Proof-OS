import fs from 'fs';
import path from 'path';
import { RULES, ContractRule } from './rules';

export interface ScanResult {
  ruleId: string;
  status: 'PASS' | 'FAIL';
  errors: string[];
}

export function scanCode(): ScanResult[] {
  const results: ScanResult[] = [];

  for (const rule of RULES) {
    const output: ScanResult = { ruleId: rule.id, status: 'PASS', errors: [] };
    
    for (const relativePath of rule.files) {
      const absolutePath = path.resolve(process.cwd(), relativePath);
      
      if (!fs.existsSync(absolutePath)) {
        output.status = 'FAIL';
        output.errors.push(`File missing: ${relativePath}`);
        continue;
      }

      const content = fs.readFileSync(absolutePath, 'utf8');

      // Check forbidden patterns
      if (rule.patterns.forbidden) {
        for (const pattern of rule.patterns.forbidden) {
          if (pattern.test(content)) {
            output.status = 'FAIL';
            output.errors.push(`Forbidden pattern detected in ${relativePath}: ${pattern}`);
          }
        }
      }

      // Check required patterns
      if (rule.patterns.required) {
        for (const pattern of rule.patterns.required) {
          if (!pattern.test(content)) {
            output.status = 'FAIL';
            output.errors.push(`Required pattern missing in ${relativePath}: ${pattern}`);
          }
        }
      }
    }

    results.push(output);
  }

  return results;
}
