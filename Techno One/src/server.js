// Minimal Node/Express server for self-hosted deployment (Dokploy, or any
// Docker host). Serves the static site and mounts the two API handlers.
const path = require('path');
const express = require('express');

const app = express();
app.disable('x-powered-by');

// Security headers for production (Cloudflare handles HTTPS)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json());

app.get('/api/config', require('./api/config'));
app.post('/api/lead', require('./api/lead'));

// Only the folders the frontend actually references are exposed publicly —
// deliberately not a blanket express.static(__dirname), so server.js,
// package.json, api/, and any local .env stay unreachable over HTTP.
app.use('/css', express.static(path.join(__dirname, 'css'), { maxAge: '7d' }));
app.use('/js', express.static(path.join(__dirname, 'js'), { maxAge: '1d' }));
app.use('/img', express.static(path.join(__dirname, 'img'), { maxAge: '30d' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Techno One server listening on :${port}`);
});
