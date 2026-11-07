
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

async function runScenario(responses) {
  let requests = 0;

  const server = createServer((req, res) => {
    const status = responses[
      Math.min(requests++, responses.length - 1)
    ];

    res.writeHead(status);
    res.end();
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const port = server.address().port;

  try {
    const result = await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        ['scripts/monitor-health.mjs'],
        {
          env: {
            ...process.env,
            HEALTH_URL: `http://127.0.0.1:${port}/health`
          }
        }
      );

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', data => {
        stdout += data.toString();
      });

      child.stderr.on('data', data => {
        stderr += data.toString();
      });

      child.on('error', reject);
      child.on('close', code => {
        resolve({ code, stdout, stderr });
      });
    });

    return {
      code: result.code,
      requests,
      events: result.stdout
        .split('\n')
        .filter(Boolean)
        .map(JSON.parse)
    };
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }
}

test('healthy service does not trigger alert', async () => {
  const result = await runScenario([200, 200, 200]);

  assert.equal(result.code, 0);
  assert.equal(result.requests, 3);
  assert.equal(
    result.events.filter(e => e.event === 'health.check_passed').length,
    3
  );
  assert.equal(
    result.events.some(e => e.event === 'alert.triggered'),
    false
  );
});

test('temporary failure followed by recovery', async () => {
  const result = await runScenario([503, 200, 200]);

  assert.equal(result.code, 0);
  assert.equal(result.requests, 3);

  const failures = result.events.filter(
    e => e.event === 'health.check_failed'
  );

  assert.equal(failures.length, 1);
  assert.equal(failures[0].httpStatus, 503);
  assert.equal(
    result.events.some(e => e.event === 'alert.triggered'),
    false
  );
});

test('two consecutive failures trigger alert', async () => {
  const result = await runScenario([503, 503, 200]);

  assert.equal(result.code, 1);
  assert.equal(result.requests, 2);

  const alert = result.events.find(
    e => e.event === 'alert.triggered'
  );

  assert.ok(alert);
  assert.equal(alert.level, 'error');
  assert.equal(alert.threshold, 2);
  assert.equal(alert.consecutiveFailures, 2);
});
