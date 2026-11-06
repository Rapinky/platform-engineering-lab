
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy' }));
    return;
  }

  if (req.url === '/unhealthy') {
    res.writeHead(503);
    res.end(JSON.stringify({ status: 'unhealthy' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Health test server running on port 3000');
});
