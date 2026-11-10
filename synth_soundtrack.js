const fs = require('fs');

function createSoundtrack(totalSeconds = 27) {
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = Math.floor(sampleRate * totalSeconds);
  const leftBuffer = new Float32Array(totalSamples);
  const rightBuffer = new Float32Array(totalSamples);

  // Helper to add a tone
  function addTone(type, freq, startSec, durSec, gain, pan = 0) {
    const startSample = Math.floor(startSec * sampleRate);
    const durSamples = Math.floor(durSec * sampleRate);
    const leftGain = gain * (1 - pan) * 0.5;
    const rightGain = gain * (1 + pan) * 0.5;

    for (let i = 0; i < durSamples; i++) {
      const idx = startSample + i;
      if (idx >= totalSamples) break;
      const t = i / sampleRate;
      const progress = i / durSamples;
      
      // Envelope: quick attack, exponential/linear decay
      let env = 1;
      if (progress < 0.05) {
        env = progress / 0.05;
      } else {
        env = Math.exp(-progress * 4);
      }

      let val = 0;
      const phase = 2 * Math.PI * freq * t;
      if (type === 'sine') {
        val = Math.sin(phase);
      } else if (type === 'triangle') {
        val = 2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1;
      } else if (type === 'sawtooth') {
        val = 2 * (t * freq - Math.floor(t * freq + 0.5));
      }

      leftBuffer[idx] += val * env * leftGain;
      rightBuffer[idx] += val * env * rightGain;
    }
  }

  // 1. Serene Lofi Chord Progression (Cmaj9 -> Fmaj7 -> Am9 -> G6)
  const chords = [
    { bass: 130.81, pad: [164.81, 196.00, 246.94, 293.66], melody: [329.63, 392.00, 493.88] }, // Cmaj9
    { bass: 87.31,  pad: [220.00, 261.63, 329.63, 392.00], melody: [440.00, 523.25, 659.25] }, // Fmaj7
    { bass: 110.00, pad: [130.81, 164.81, 196.00, 246.94], melody: [261.63, 329.63, 440.00] }, // Am9
    { bass: 98.00,  pad: [146.83, 196.00, 246.94, 293.66], melody: [392.00, 493.88, 587.33] }  // G6
  ];

  const barDuration = 3.6;
  for (let bar = 0; bar < 8; bar++) {
    const barStart = bar * barDuration;
    if (barStart >= totalSeconds) break;
    const chord = chords[bar % chords.length];

    // Bass
    addTone('sine', chord.bass, barStart, barDuration * 0.95, 0.12, 0);

    // Warm Pad Notes
    chord.pad.forEach((freq, i) => {
      const pan = (i - 1.5) * 0.4;
      addTone('sine', freq, barStart, barDuration * 0.9, 0.045, pan);
    });

    // Gentle kalimba chimes
    const chimeBeats = [0.4, 1.6, 2.8];
    chimeBeats.forEach((b, i) => {
      const noteTime = barStart + b;
      if (noteTime < totalSeconds) {
        const noteFreq = chord.melody[i % chord.melody.length];
        addTone('triangle', noteFreq, noteTime, 0.9, 0.05, (i === 1 ? -0.3 : 0.3));
      }
    });
  }

  // 2. Watch Dial Ticks (Scene 1)
  [0.8, 1.4, 2.0, 2.6].forEach(t => {
    addTone('sine', 880, t, 0.05, 0.12, 0);
  });
  // Start Button Click
  addTone('triangle', 620, 3.2, 0.08, 0.22, 0);

  // 3. 3-2-1 Countdown Beeps + Whistle (Scene 2)
  addTone('sine', 440, 3.6, 0.12, 0.25, 0); // "3"
  addTone('sine', 440, 4.3, 0.12, 0.25, 0); // "2"
  addTone('sine', 440, 5.0, 0.12, 0.25, 0); // "1"

  // Whistle at 5.6s
  const whistleStart = 5.6;
  const whistleDur = 0.55;
  const wStartSample = Math.floor(whistleStart * sampleRate);
  const wDurSamples = Math.floor(whistleDur * sampleRate);
  for (let i = 0; i < wDurSamples; i++) {
    const t = i / sampleRate;
    const vibrato = Math.sin(2 * Math.PI * 26 * t) * 120;
    const freq = 2200 + vibrato;
    const env = t < 0.05 ? t / 0.05 : Math.exp(-t * 2.5);
    const val = Math.sin(2 * Math.PI * freq * t) * env * 0.22;
    leftBuffer[wStartSample + i] += val;
    rightBuffer[wStartSample + i] += val;
  }

  // Helper for answer entry (keystrokes + chime + pull whoosh)
  function addAnswerCycle(startTime, keys, correct, isBlue) {
    const pan = isBlue ? -0.4 : 0.4;
    // Keys
    keys.forEach((k, i) => {
      addTone('triangle', 520 + (isBlue ? i * 40 : -i * 30), startTime + i * 0.28, 0.06, 0.18, pan);
    });
    // Enter key
    const enterTime = startTime + keys.length * 0.28;
    addTone('triangle', 640, enterTime, 0.08, 0.24, pan);

    // Chime (rising arpeggio)
    const chimeStart = enterTime + 0.1;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      addTone('sine', freq, chimeStart + idx * 0.05, 0.28, 0.20, pan);
    });

    // Pull Whoosh (grunt)
    const pullStart = chimeStart + 0.15;
    const pStartSample = Math.floor(pullStart * sampleRate);
    const pDurSamples = Math.floor(0.28 * sampleRate);
    for (let i = 0; i < pDurSamples; i++) {
      const t = i / sampleRate;
      const freq = 90 + Math.sin(t * Math.PI / 0.28) * 160;
      const env = Math.sin(t * Math.PI / 0.28);
      const val = (2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1) * env * 0.32;
      leftBuffer[pStartSample + i] += val * (1 - pan) * 0.5;
      rightBuffer[pStartSample + i] += val * (1 + pan) * 0.5;
    }
  }

  // Battle Action Cycles
  addAnswerCycle(6.4, ['2', '4'], true, true);   // Blue: 24
  addAnswerCycle(8.8, ['2', '7'], true, false);  // Red: 27
  addAnswerCycle(11.2, ['8'], true, true);       // Blue: 8
  addAnswerCycle(13.2, ['6', '4'], true, false); // Red: 64
  addAnswerCycle(15.0, ['8', '1'], true, true);  // Blue: 81 (Decisive KO!)

  // Whistle at match end (KO) at 17.2s
  const endWhistleStart = 17.2;
  const ewStartSample = Math.floor(endWhistleStart * sampleRate);
  for (let i = 0; i < wDurSamples; i++) {
    const t = i / sampleRate;
    const vibrato = Math.sin(2 * Math.PI * 26 * t) * 140;
    const freq = 2300 + vibrato;
    const env = t < 0.05 ? t / 0.05 : Math.exp(-t * 2.8);
    const val = Math.sin(2 * Math.PI * freq * t) * env * 0.24;
    leftBuffer[ewStartSample + i] += val;
    rightBuffer[ewStartSample + i] += val;
  }

  // Grand Victory Fanfare (Scene 4) at 17.8s
  const fanfareStart = 17.8;
  const fanfareChords = [
    { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 },       // C
    { notes: [523.25, 659.25, 783.99], time: 0.22, dur: 0.18 },    // C
    { notes: [523.25, 659.25, 783.99], time: 0.44, dur: 0.18 },    // C
    { notes: [698.46, 880.00, 1046.50], time: 0.66, dur: 0.55 },   // F
    { notes: [783.99, 987.77, 1174.66], time: 1.25, dur: 0.25 },   // G
    { notes: [1046.50, 1318.51, 1567.98], time: 1.55, dur: 1.2 }   // C High
  ];

  fanfareChords.forEach(c => {
    c.notes.forEach(f => {
      addTone('triangle', f, fanfareStart + c.time, c.dur, 0.22, 0);
      addTone('sine', f * 0.5, fanfareStart + c.time, c.dur, 0.15, 0);
    });
  });

  // Outro Smooth Fade (Scene 5) at 23.5s to 27.0s
  // Master Fade-out last 1.5 seconds
  const fadeStart = Math.floor((totalSeconds - 1.5) * sampleRate);
  for (let i = fadeStart; i < totalSamples; i++) {
    const fade = 1 - (i - fadeStart) / (totalSamples - fadeStart);
    leftBuffer[i] *= fade;
    rightBuffer[i] *= fade;
  }

  // Convert to 16-bit PCM WAV
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write Interleaved Samples with soft clipping limiter
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    // Soft clamp -1 to 1
    let left = Math.max(-0.98, Math.min(0.98, leftBuffer[i]));
    let right = Math.max(-0.98, Math.min(0.98, rightBuffer[i]));

    buffer.writeInt16LE(Math.floor(left * 32767), offset);
    buffer.writeInt16LE(Math.floor(right * 32767), offset + 2);
    offset += 4;
  }

  fs.writeFileSync('soundtrack.wav', buffer);
  console.log('Successfully created soundtrack.wav! Total duration:', totalSeconds, 's, Size:', buffer.length);
}

createSoundtrack(27);
