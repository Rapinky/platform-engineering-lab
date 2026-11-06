
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function runDemo(simulateFailure) {
  const result = spawnSync(
    process.execPath,
    ['scripts/logging-demo.mjs'],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        SIMULATE_FAILURE: String(simulateFailure)
      }
    }
  );

  if (result.error) throw result.error;

  const parseLogs = (output) =>
    output.split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

  return {
    exitCode: result.status,
    infoLogs: parseLogs(result.stdout),
    errorLogs: parseLogs(result.stderr)
  };
}

test('successful operation produces valid logs', () => {
  const result = runDemo(false);

  assert.equal(result.exitCode, 0);
  assert.equal(result.errorLogs.length, 0);

  const events = result.infoLogs.map(
    (entry) => entry.event
  );

  assert.deepEqual(events, [
    'demo.started',
    'dependency.check_started',
    'dependency.connected',
    'demo.completed'
  ]);

  for (const entry of result.infoLogs) {
    assert.equal(entry.level, 'info');
    assert.equal(entry.requestId, 'demo-request-001');
    assert.ok(!Number.isNaN(Date.parse(entry.timestamp)));
  }
});

test('failure produces structured error log', () => {
  const result = runDemo(true);

  assert.equal(result.exitCode, 1);
  assert.equal(result.errorLogs.length, 1);

  const error = result.errorLogs[0];

  assert.equal(error.level, 'error');
  assert.equal(error.event, 'dependency.connection_failed');
  assert.equal(error.code, 'ECONNREFUSED');
  assert.equal(error.retryable, true);
  assert.equal(error.requestId, 'demo-request-001');
});
