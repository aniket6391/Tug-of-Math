const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const FFMPEG_PATH = 'C:\\Users\\asus\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-essentials_build\\bin\\ffmpeg.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runVideoRecording() {
  console.log('--- Step 1: Starting Local HTTP Server on Port 3334 ---');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/generate_video.html';
    const filePath = path.join(__dirname, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, {
        'Content-Type': mimes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(r => server.listen(3334, r));
  console.log('HTTP Server listening at http://localhost:3334');

  console.log('\n--- Step 2: Launching Chrome Headless (1920x1080) with Unthrottled Timers ---');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=' + require('os').tmpdir() + '\\chrome-vid-' + Date.now(),
    'http://localhost:3334/generate_video.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const version = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9227/json/version', res => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  console.log('Connected to Chrome WebSocket at:', version.webSocketDebuggerUrl);
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const targets = await send('Target.getTargets');
  const pageTarget = targets.targetInfos.find(t => t.type === 'page');
  const pageWs = new WebSocket('ws://127.0.0.1:9227/devtools/page/' + pageTarget.targetId);
  await new Promise(r => pageWs.onopen = r);

  function pSend(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          pageWs.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      pageWs.addEventListener('message', handler);
      pageWs.send(JSON.stringify({ id, method, params }));
    });
  }

  await pSend('Page.enable');
  await pSend('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('\n--- Step 3: Triggering 27s MediaRecorder in Browser ---');
  await pSend('Runtime.evaluate', {
    expression: 'window.startRecording(27)'
  });

  for (let s = 1; s <= 29; s++) {
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write(`\rRecording in progress... ${s}s / 27s`);
    const status = await pSend('Runtime.evaluate', { expression: 'window.isFinished === true' });
    if (status.result && status.result.value === true) {
      console.log('\nBrowser signaled recording completion!');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1500));

  console.log('\n--- Step 4: Extracting Video Buffer ---');
  const evalRes = await pSend('Runtime.evaluate', { expression: 'window.recordedData' });
  const dataUrl = evalRes.result ? evalRes.result.value : null;

  if (!dataUrl) {
    throw new Error('Failed to retrieve recordedData from browser.');
  }

  const base64Data = dataUrl.split(',')[1];
  const videoBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('raw_demo.webm', videoBuffer);
  console.log('Saved raw_demo.webm! File size:', (videoBuffer.length / (1024 * 1024)).toFixed(2), 'MB');

  pageWs.close();
  ws.close();
  chromeProc.kill();
  server.close();

  console.log('\n--- Step 5: Merging Video + Stereo Soundtrack via FFmpeg ---');
  const outputFile = 'Tug-of-Math-LinkedIn-Demo.mp4';
  
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG_PATH, [
      '-y',
      '-i', 'raw_demo.webm',
      '-i', 'soundtrack.wav',
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '17',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      outputFile
    ]);

    ffmpeg.stderr.on('data', d => {
      // console.log(d.toString());
    });

    ffmpeg.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error('FFmpeg failed with exit code ' + code));
    });
  });

  const finalStat = fs.statSync(outputFile);
  console.log('\n======================================================');
  console.log('SUCCESS! Video generated: ' + outputFile);
  console.log('Size: ' + (finalStat.size / (1024 * 1024)).toFixed(2) + ' MB');
  console.log('Path: ' + path.resolve(outputFile));
  console.log('======================================================');
}

runVideoRecording().catch(err => {
  console.error('\nERROR during video recording:', err);
  process.exit(1);
});
