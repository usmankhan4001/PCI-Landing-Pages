// Minimal Node/Express server for self-hosted deployment (Dokploy, or any
// Docker host). Serves the static site and mounts the two API handlers
// that already existed in api/ (written in a Vercel-compatible
// (req, res) => {} signature, which Express calls identically).
const path = require('path');
const express = require('express');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/api/config', require('./api/config'));
app.post('/api/lead', require('./api/lead'));

// Only the folders the frontend actually references are exposed publicly —
// deliberately not a blanket express.static(__dirname), so server.js,
// package.json, api/, and any local .env stay unreachable over HTTP.
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Box Park III server listening on :${port}`);
});
