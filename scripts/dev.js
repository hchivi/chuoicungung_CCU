import { spawn } from 'child_process';
import http from 'http';

function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5050/healthz', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

const isRunning = await checkServerRunning();
let server = null;
if (!isRunning) {
  server = spawn('node', ['server/index.js'], { stdio: 'inherit', env: process.env });
} else {
  console.log('\x1b[32m%s\x1b[0m', '⚡ Backend Server đã chạy sẵn sàng tại http://localhost:5050');
}

const vite = spawn('npx', ['vite'], { stdio: 'inherit', env: process.env });

const cleanup = (code = 0) => {
  if (server) {
    try { server.kill('SIGTERM'); } catch {}
  }
  try { vite.kill('SIGTERM'); } catch {}
  process.exit(code);
};

process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));
