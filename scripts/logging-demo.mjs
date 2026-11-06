
const service = 'platform-engineering-lab';
const requestId = 'demo-request-001';

function log(level, event, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    requestId,
    event,
    ...details
  };

  const message = JSON.stringify(entry);

  if (level === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
}

log('info', 'demo.started');

log('info', 'dependency.check_started');

if (process.env.SIMULATE_FAILURE === 'true') {
  log('error', 'dependency.connection_failed', {
    code: 'ECONNREFUSED',
    retryable: true
  });

  process.exitCode = 1;
} else {
  log('info', 'dependency.connected');
  log('info', 'demo.completed');
}
