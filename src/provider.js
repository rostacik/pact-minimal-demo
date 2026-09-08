import { createServer } from 'node:http';

const publicApiUrl = 'https://jsonplaceholder.typicode.com';

export function startProvider(port = 0) {
  const server = createServer(async (request, response) => {
    const match = request.url?.match(/^\/users\/(\d+)$/);

    if (request.method !== 'GET' || !match) {
      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    try {
      const upstreamResponse = await fetch(`${publicApiUrl}/users/${match[1]}`);
      const body = await upstreamResponse.text();

      response.writeHead(upstreamResponse.status, {
        'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json'
      });
      response.end(body);
    } catch (error) {
      response.writeHead(502, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: error.message }));
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((closeResolve, closeReject) => {
          server.close((error) => error ? closeReject(error) : closeResolve());
        })
      });
    });
  });
}
