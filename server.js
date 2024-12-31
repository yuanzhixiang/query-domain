// server.js
const next = require('next');
const http = require('http');

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(3000);
});
