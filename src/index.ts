/* eslint-disable no-case-declarations */
import http from 'http';
import url from 'url';

const PORT = process.env.PORT || '8000';

export class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const server = http.createServer((req, resp) => {
  if (!req.url) {
    const error = new HTTPError('Invalid URL', 404);
    server.emit('error', error, resp);
    return;
  }

  const { pathname, search } = url.parse(req.url);

  switch (pathname) {
    case '/calculator':
      if (req.method !== 'GET') {
        // Error 405
        const error = new HTTPError('Método desconocido', 405);
        server.emit('error', error, resp);
        break;
      }

      const urlParams = new URLSearchParams(search!);
      const a = Number(urlParams.get('a'));
      const b = Number(urlParams.get('b'));
      const sum = a + b;
      const rest = a - b;
      const multiply = a * b;
      const divide = a / b;

      if (isNaN(a) || isNaN(b)) {
        server.emit(
          'error',
          new HTTPError('El dato introducido no es un número', 400),
          resp
        );
        break;
      }

      resp.writeHead(200, { 'Content-Type': 'text/html' });
      resp.write(`
          <html>
            <head>
              <title>Calculator</title>
            </head>
            <body>
              <h1>Calculator Result</h1>
              <p>${a} + ${b} = ${sum}</p>
              <p>${a} - ${b} = ${rest}</p>
              <p>${a} * ${b} = ${multiply}</p>
              <p>${a} / ${b} = ${divide}</p>
            </body>
          </html>
        `);

      break;
    case '/things':
      server.emit('error', new Error('Invalid URL'));
      break;

    default:
      server.emit('error', new HTTPError('Error - path not found', 404), resp);
      break;
  }

  resp.end();
});

server.on('error', (error: Error | HTTPError, resp: http.ServerResponse) => {
  // Errores HTTP
  if (error instanceof HTTPError) {
    console.log(error.statusCode, error.message);
    resp.writeHead(200, { 'Content-Type': 'text/html' });
    resp.write(`
      <h1>Error</h1>
      <p>${error.message}</p>
      `);
    resp.end();
  } else {
    console.log(error.message);
  }

  // Problemas técnicos
});

server.on('listening', () => {
  console.log('Listening in http://localhost:' + PORT);
});

server.listen(PORT);
