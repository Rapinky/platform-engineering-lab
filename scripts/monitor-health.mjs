
import { spawnSync } from 'node:child_process';

const service = 'platform-engineering-lab';
const threshold = 2;
const totalChecks = 3;

let consecutiveFailures = 0;
let alertTriggered = false;

function log(level, event, details = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service,
    event,
    ...details
  }));
}

for (let attempt = 1; attempt <= totalChecks; attempt++) {
  const result = spawnSync(
    'bash',
    ['scripts/health-check.sh'],
    {
      encoding: 'utf8',
      env: process.env
    }
  );

  const healthy = !result.error && result.status === 0;

  if (healthy) {
    consecutiveFailures = 0;

    log('info', 'health.check_passed', {
      attempt
    });
  } else {
    consecutiveFailures++;

    const status = result.stdout.match(/HTTP status: (\d{3})/);

    log('warn', 'health.check_failed', {
      attempt,
      consecutiveFailures,
      httpStatus: status ? Number(status[1]) : null
    });
  }

  if (consecutiveFailures >= threshold) {
    log('error', 'alert.triggered', {
      reason: 'consecutive_health_check_failures',
      threshold,
      consecutiveFailures
    });

    alertTriggered = true;
    process.exitCode = 1;
    break;
  }
}

if (!alertTriggered) {
  log('info', 'monitor.completed', {
    alertTriggered: false
  });
}
