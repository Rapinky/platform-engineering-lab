
import { readFileSync, writeFileSync } from 'node:fs';

const current = JSON.parse(
  readFileSync('recovery/current-release.json', 'utf8')
);

const baseline = JSON.parse(
  readFileSync('recovery/known-good.json', 'utf8')
);

// Verify the rollback is safe to simulate.
if (current.status !== 'failed') {
  throw new Error('Current release is not failed');
}

if (baseline.status !== 'verified') {
  throw new Error('Recovery target is not verified');
}

if (current.environment !== baseline.environment) {
  throw new Error('Environment mismatch');
}

if (current.rollbackTarget !== baseline.release) {
  throw new Error('Rollback target mismatch');
}

if (!baseline.sourceCommit || !baseline.artifact) {
  throw new Error('Recovery metadata is incomplete');
}

// Generate a simulated recovery result.
const result = {
  environment: current.environment,
  previousRelease: current.release,
  restoredRelease: baseline.release,
  sourceCommit: baseline.sourceCommit,
  status: 'rollback-simulated'
};

writeFileSync(
  'recovery/rollback-result.json',
  JSON.stringify(result, null, 2) + '\n'
);

console.log('Rollback simulation successful!');
console.log(`Recovery target: ${baseline.release}`);
console.log('No live infrastructure was modified.');
