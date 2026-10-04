'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT) || 8000;
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    send(res, 400, 'Bad request');
    return;
  }

  if (pathname === '/') {
    res.writeHead(302, { Location: '/local-editor/' });
    res.end();
    return;
  }

  let filePath = path.resolve(root, '.' + pathname);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    send(res, 403, 'Forbidden');
    return;
  }

  try {
    if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch (error) {
    send(res, 404, 'Not found');
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => send(res, 500, 'Unable to read file'));
  res.writeHead(200, {
    'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  stream.pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`GiselleLi local editor: http://localhost:${port}/local-editor/`);
  console.log('Keep this window open while editing. Press Ctrl+C to stop.');
});
