/* eslint-disable no-case-declarations */
import http from 'http';
import url from 'url';

const PORT = process.env.PORT || '8000';

const server = http.createServer((req, resp) => {
  switch (req.method) {
    case 'GET':
      if (!req.url) {
        server.emit('error', new Error('Invalid URL'));
        return;
      }

      const { pathname, search } = url.parse(req.url);

      if (pathname !== '/calculator') {
        server.emit('error', new Error('Invalid URL'));
        return;
      }

      if (pathname === '/calculator') {
        const urlParams = new URLSearchParams(search!);

        const a = Number(urlParams.get('a'));
        const b = Number(urlParams.get('b'));
        const sum = a + b;
        const rest = a - b;
        const multiply = a * b;
        const divide = a / b;
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
      }

      break;
    case 'POST':
    case 'PATCH':
    case 'DELETE':
      resp.write('No esta implementado ' + req.method);
      break;
    default:
      resp.write('No conozco el método ' + req.method);
      break;
  }

  resp.end();
});
server.on('server', () => {});

server.on('listening', () => {
  console.log('Listening in http://localhost:' + PORT);
});

server.listen(PORT);
