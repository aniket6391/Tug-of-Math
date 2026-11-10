/**
 * Tug of Math - Zero-Dependency Local & Public Mobile Server
 * Generates both a Public HTTPS Link (works on 5G/4G/Any Wi-Fi) and a Local Wi-Fi Link.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, exec } = require('child_process');

const BASE_DIR = __dirname;
let PORT = 3000;
let publicUrl = null;
let tunnelProc = null;

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

// Detect local network IPv4 address (Wi-Fi or Ethernet)
function getLocalIP() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (/wi-fi|wireless|wlan/i.test(name)) {
          return net.address;
        }
        candidates.push(net.address);
      }
    }
  }

  return candidates.length > 0 ? candidates[0] : 'localhost';
}

// Start free SSH public HTTPS tunnel via localhost.run (no npm or install required)
function startPublicTunnel(localPort) {
  try {
    tunnelProc = spawn('ssh', [
      '-o', 'StrictHostKeyChecking=no',
      '-o', 'ServerAliveInterval=30',
      '-R', `80:localhost:${localPort}`,
      'nokey@localhost.run'
    ]);

    tunnelProc.stdout.on('data', data => {
      const text = data.toString();
      const match = text.match(/https:\/\/[a-z0-9]+\.lhr\.life/);
      if (match && !publicUrl) {
        publicUrl = match[0];
        printBanner(localPort);
      }
    });

    tunnelProc.on('close', () => {
      publicUrl = null;
      // Reconnect after 5 seconds if closed
      setTimeout(() => startPublicTunnel(localPort), 5000);
    });

    tunnelProc.on('error', () => {
      publicUrl = null;
    });
  } catch (e) {
    publicUrl = null;
  }
}

function printBanner(port) {
  const localIP = getLocalIP();
  const localUrl = `http://${localIP}:${port}`;
  const bestUrl = publicUrl || localUrl;

  console.clear();
  console.log('\n' + '═'.repeat(70));
  console.log('   🎮  TUG OF MATH - MOBILE PHONE SERVER IS ACTIVE!');
  console.log('═'.repeat(70));
  console.log('\n  ⚠️  IMPORTANT: KEEP THIS WINDOW OPEN WHILE PLAYING ON YOUR PHONE!\n');

  if (publicUrl) {
    console.log('  🌐  \x1b[32m\x1b[1mRECOMMENDED (Works on ANY phone with 5G / 4G / Wi-Fi):\x1b[0m');
    console.log(`      👉   \x1b[36m\x1b[1m${publicUrl}\x1b[0m\n`);
    console.log('  📶  LOCAL WI-FI LINK (Alternative):');
    console.log(`      👉   ${localUrl}\n`);
  } else {
    console.log('  📶  LOCAL WI-FI LINK (Make sure Phone is on the same Wi-Fi):');
    console.log(`      👉   \x1b[32m\x1b[1m${localUrl}\x1b[0m\n`);
    console.log('  🌐  Establishing global HTTPS link in the background...\n');
  }

  console.log('  📷  A browser window just opened on your PC with a SCANNING QR CODE.');
  console.log('  🔄  Turn phone to Landscape mode for 2-player side-by-side battle!');
  console.log('═'.repeat(70));
  console.log('  [To close the server, simply close this window]\n');
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // API endpoint for frontend to discover its live server status and URLs
    if (pathname === '/api/info') {
      const localIP = getLocalIP();
      const localUrl = `http://${localIP}:${port}`;
      const bestUrl = publicUrl || localUrl;

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        status: 'online',
        ip: localIP,
        port: port,
        publicUrl: publicUrl,
        localUrl: localUrl,
        bestUrl: bestUrl
      }));
      return;
    }

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const safePath = path.normalize(path.join(BASE_DIR, pathname));

    // Security: avoid path traversal
    if (!safePath.startsWith(BASE_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });

      const stream = fs.createReadStream(safePath);
      stream.pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    printBanner(port);
    startPublicTunnel(port);

    // Automatically open browser with phone QR code
    const startCmd = process.platform === 'win32' ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
    setTimeout(() => {
      exec(`${startCmd} http://localhost:${port}?phone=1`, () => {});
    }, 400);
  });
}

// Clean up child processes on exit
process.on('SIGINT', () => {
  if (tunnelProc) tunnelProc.kill();
  process.exit(0);
});

process.on('exit', () => {
  if (tunnelProc) tunnelProc.kill();
});

startServer(PORT);
