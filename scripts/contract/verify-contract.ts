import { scanCode } from './scan-code';

async function main() {
  console.log('🚀 Starting System Contract Enforcement...');
  console.log('------------------------------------------');

  const results = scanCode();
  let hasFailures = false;

  for (const res of results) {
    const symbol = res.status === 'PASS' ? '✅' : '❌';
    console.log(`${symbol} [${res.ruleId}] ${res.status}`);
    
    if (res.status === 'FAIL') {
      hasFailures = true;
      res.errors.forEach(err => console.error(`   - ${err}`));
    }
  }

  console.log('------------------------------------------');
  if (hasFailures) {
    console.error('❌ Contract Enforcement Failed. Please align code with SYSTEM_CONTRACT_REALITY.md');
    process.exit(1);
  } else {
    console.log('✅ All core invariants verified. Contract integrity maintained.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error during contract enforcement:', err);
  process.exit(1);
});
