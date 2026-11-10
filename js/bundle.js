// Tug of Math - Standalone Self-Contained Bundle (Supports file:// and http://)

/**
 * Math Question Generator for Tug of Math
 * Direct, clear questions only - no explanations.
 */

const MathOperations = {
  ADD: 'add',
  SUB: 'sub',
  MUL: 'mul',
  DIV: 'div',
  SQUARE: 'square',
  SQRT: 'sqrt',
  CUBE: 'cube',
  CBRT: 'cbrt'
};

class MathEngine {
  constructor(options = {}) {
    this.difficulty = options.difficulty || 'medium';
    this.activeOperations = options.activeOperations || [
      MathOperations.ADD,
      MathOperations.SUB,
      MathOperations.MUL,
      MathOperations.DIV,
      MathOperations.SQUARE,
      MathOperations.SQRT,
      MathOperations.CUBE,
      MathOperations.CBRT
    ];
  }

  setDifficulty(diff) {
    this.difficulty = diff;
  }

  setActiveOperations(ops) {
    if (Array.isArray(ops) && ops.length > 0) {
      this.activeOperations = [...ops];
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuestion() {
    if (!this.activeOperations || this.activeOperations.length === 0) {
      this.activeOperations = [
        MathOperations.ADD,
        MathOperations.SUB,
        MathOperations.MUL,
        MathOperations.DIV,
        MathOperations.SQUARE,
        MathOperations.SQRT,
        MathOperations.CUBE,
        MathOperations.CBRT
      ];
    }

    const op = this.activeOperations[Math.floor(Math.random() * this.activeOperations.length)];
    const diff = this.difficulty;

    switch (op) {
      case MathOperations.ADD:
        return this.generateAddition(diff);
      case MathOperations.SUB:
        return this.generateSubtraction(diff);
      case MathOperations.MUL:
        return this.generateMultiplication(diff);
      case MathOperations.DIV:
        return this.generateDivision(diff);
      case MathOperations.SQUARE:
        return this.generateSquare(diff);
      case MathOperations.SQRT:
        return this.generateSquareRoot(diff);
      case MathOperations.CUBE:
        return this.generateCube(diff);
      case MathOperations.CBRT:
        return this.generateCubeRoot(diff);
      default:
        return this.generateAddition(diff);
    }
  }

  generateAddition(diff) {
    let a, b;
    if (diff === 'easy') {
      a = this.getRandomInt(2, 20);
      b = this.getRandomInt(2, 20);
    } else if (diff === 'hard') {
      a = this.getRandomInt(25, 150);
      b = this.getRandomInt(25, 150);
    } else {
      a = this.getRandomInt(10, 60);
      b = this.getRandomInt(10, 60);
    }
    return {
      type: MathOperations.ADD,
      label: 'ADDITION',
      questionHtml: `${a} + ${b} = ?`,
      questionText: `${a} + ${b} = ?`,
      answer: a + b
    };
  }

  generateSubtraction(diff) {
    let a, b;
    if (diff === 'easy') {
      b = this.getRandomInt(2, 15);
      a = b + this.getRandomInt(1, 15);
    } else if (diff === 'hard') {
      b = this.getRandomInt(20, 100);
      a = b + this.getRandomInt(15, 120);
    } else {
      b = this.getRandomInt(8, 40);
      a = b + this.getRandomInt(8, 50);
    }
    return {
      type: MathOperations.SUB,
      label: 'SUBTRACTION',
      questionHtml: `${a} &minus; ${b} = ?`,
      questionText: `${a} - ${b} = ?`,
      answer: a - b
    };
  }

  generateMultiplication(diff) {
    let a, b;
    if (diff === 'easy') {
      a = this.getRandomInt(2, 9);
      b = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      a = this.getRandomInt(6, 19);
      b = this.getRandomInt(6, 19);
    } else {
      a = this.getRandomInt(3, 12);
      b = this.getRandomInt(3, 12);
    }
    return {
      type: MathOperations.MUL,
      label: 'MULTIPLICATION',
      questionHtml: `${a} &times; ${b} = ?`,
      questionText: `${a} × ${b} = ?`,
      answer: a * b
    };
  }

  generateDivision(diff) {
    let divisor, answer;
    if (diff === 'easy') {
      divisor = this.getRandomInt(2, 8);
      answer = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      divisor = this.getRandomInt(4, 15);
      answer = this.getRandomInt(6, 20);
    } else {
      divisor = this.getRandomInt(3, 10);
      answer = this.getRandomInt(3, 12);
    }
    const dividend = divisor * answer;
    return {
      type: MathOperations.DIV,
      label: 'DIVISION',
      questionHtml: `${dividend} &divide; ${divisor} = ?`,
      questionText: `${dividend} ÷ ${divisor} = ?`,
      answer: answer
    };
  }

  generateSquare(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 10);
    } else if (diff === 'hard') {
      base = this.getRandomInt(11, 25);
    } else {
      base = this.getRandomInt(3, 16);
    }
    return {
      type: MathOperations.SQUARE,
      label: 'SQUARE',
      questionHtml: `${base}<sup class="math-power">2</sup> = ?`,
      questionText: `${base}² = ?`,
      answer: base * base
    };
  }

  generateSquareRoot(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      base = this.getRandomInt(10, 25);
    } else {
      base = this.getRandomInt(3, 15);
    }
    const squareVal = base * base;
    return {
      type: MathOperations.SQRT,
      label: 'SQUARE ROOT',
      questionHtml: `&radic;${squareVal} = ?`,
      questionText: `√${squareVal} = ?`,
      answer: base
    };
  }

  generateCube(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 5);
    } else if (diff === 'hard') {
      base = this.getRandomInt(5, 12);
    } else {
      base = this.getRandomInt(2, 8);
    }
    return {
      type: MathOperations.CUBE,
      label: 'CUBE',
      questionHtml: `${base}<sup class="math-power">3</sup> = ?`,
      questionText: `${base}³ = ?`,
      answer: base * base * base
    };
  }

  generateCubeRoot(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 5);
    } else if (diff === 'hard') {
      base = this.getRandomInt(4, 10);
    } else {
      base = this.getRandomInt(2, 7);
    }
    const cubeVal = base * base * base;
    return {
      type: MathOperations.CBRT,
      label: 'CUBE ROOT',
      questionHtml: `&#8731;${cubeVal} = ?`,
      questionText: `∛${cubeVal} = ?`,
      answer: base
    };
  }
}


/**
 * Audio Synthesizer for Tug of Math using Web Audio API
 * Generates all arcade game SFX procedurally - no external files needed!
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterGain = null;

    // =========================================================================
    // SLOW RELAXING AMBIENT THEME MUSIC ENGINE (Web Audio API Procedural)
    // =========================================================================
    this.musicEnabled = true;
    this.musicGain = null;
    this.musicFilter = null;
    this.isMusicPlaying = false;
    this.musicSchedulerTimer = null;
    this.nextBarTime = 0;
    this.currentChordIndex = 0;
    this.musicActiveNodes = [];
    this.musicVolume = 0.18; // Soft, peaceful, non-distracting background level
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();

        // Master Gain for Sound Effects
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Dedicated Music Bus with Warm Lofi Lowpass Filter
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);

        this.musicFilter = this.ctx.createBiquadFilter();
        this.musicFilter.type = 'lowpass';
        this.musicFilter.frequency.setValueAtTime(750, this.ctx.currentTime); // Warm cozy cutoff
        this.musicFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

        this.musicGain.connect(this.musicFilter);
        this.musicFilter.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.isMusicPlaying) {
      this.duckMusic(true);
    } else if (this.enabled && this.isMusicPlaying) {
      this.duckMusic(false);
    }
    return this.enabled;
  }

  // =========================================================================
  // SLOW RELAXING THEME MUSIC CONTROLS & SYNTHESIZER
  // =========================================================================
  getMusicChords() {
    // Beautiful serene lofi progression: Cmaj9 -> Fmaj7 -> Am9 -> G6
    return [
      {
        name: 'Cmaj9',
        bass: 130.81, // C3
        pad: [164.81, 196.00, 246.94, 293.66], // E3, G3, B3, D4
        melody: [329.63, 392.00, 493.88, 587.33] // E4, G4, B4, D5
      },
      {
        name: 'Fmaj7',
        bass: 87.31,  // F2
        pad: [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
        melody: [440.00, 523.25, 659.25, 523.25] // A4, C5, E5, C5
      },
      {
        name: 'Am9',
        bass: 110.00, // A2
        pad: [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
        melody: [261.63, 329.63, 440.00, 493.88] // C4, E4, A4, B4
      },
      {
        name: 'G6',
        bass: 98.00,  // G2
        pad: [146.83, 196.00, 246.94, 293.66], // D3, G3, B3, D4
        melody: [392.00, 493.88, 587.33, 392.00] // G4, B4, D5, G4
      }
    ];
  }

  startRelaxMusic() {
    if (!this.musicEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    const t = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.setValueAtTime(0.0001, t);
    this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, t + 1.2);

    this.nextBarTime = t + 0.15;
    this.currentChordIndex = 0;
    this.scheduleMusicNext();

    clearInterval(this.musicSchedulerTimer);
    this.musicSchedulerTimer = setInterval(() => {
      this.scheduleMusicNext();
    }, 1200);
  }

  stopRelaxMusic(fadeDuration = 0.8) {
    if (!this.ctx || !this.isMusicPlaying) return;
    this.isMusicPlaying = false;
    clearInterval(this.musicSchedulerTimer);

    const t = this.ctx.currentTime;
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, t + fadeDuration);
    }

    setTimeout(() => {
      this.cleanActiveMusicNodes();
    }, fadeDuration * 1000 + 100);
  }

  cleanActiveMusicNodes() {
    this.musicActiveNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.musicActiveNodes = [];
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopRelaxMusic(0.6);
    } else {
      this.startRelaxMusic();
    }
    return this.musicEnabled;
  }

  duckMusic(low = true) {
    if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;
    const t = this.ctx.currentTime;
    const target = low ? this.musicVolume * 0.35 : this.musicVolume;
    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.linearRampToValueAtTime(target, t + 0.4);
  }

  scheduleMusicNext() {
    if (!this.ctx || !this.isMusicPlaying) return;

    const chords = this.getMusicChords();
    const barDuration = 3.6; // ~66.6 BPM, slow, breathing tempo

    // Keep scheduling ahead as long as we are within 2.5 seconds of playhead
    while (this.nextBarTime < this.ctx.currentTime + 2.5) {
      const chord = chords[this.currentChordIndex];
      const barStart = this.nextBarTime;

      // 1. Warm Ambient Pad Voice
      chord.pad.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, barStart);

        // Very soft swell envelope
        gain.gain.setValueAtTime(0.0001, barStart);
        gain.gain.linearRampToValueAtTime(0.024, barStart + 0.8);
        gain.gain.setValueAtTime(0.024, barStart + barDuration - 0.8);
        gain.gain.linearRampToValueAtTime(0.0001, barStart + barDuration + 0.3);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(barStart);
        osc.stop(barStart + barDuration + 0.35);

        this.musicActiveNodes.push(osc);
      });

      // 2. Warm Cozy Sub-Bass Voice
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(chord.bass, barStart);

      bassGain.gain.setValueAtTime(0.0001, barStart);
      bassGain.gain.linearRampToValueAtTime(0.045, barStart + 0.3);
      bassGain.gain.setValueAtTime(0.045, barStart + barDuration - 0.4);
      bassGain.gain.exponentialRampToValueAtTime(0.001, barStart + barDuration);

      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(barStart);
      bassOsc.stop(barStart + barDuration + 0.05);
      this.musicActiveNodes.push(bassOsc);

      // 3. Delicate Acoustic Rhodes / Kalimba Chimes (Sparse, calming rhythm)
      const chimeBeats = [0.25, 1.45, 2.65];
      chimeBeats.forEach((beatOffset, i) => {
        const noteTime = barStart + beatOffset;
        const noteFreq = chord.melody[i % chord.melody.length];

        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chimeOsc.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(noteFreq, noteTime);

        chimeGain.gain.setValueAtTime(0.0001, noteTime);
        chimeGain.gain.linearRampToValueAtTime(0.038, noteTime + 0.015);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.15);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.musicGain);

        chimeOsc.start(noteTime);
        chimeOsc.stop(noteTime + 1.2);
        this.musicActiveNodes.push(chimeOsc);
      });

      // Move to next bar
      this.nextBarTime += barDuration;
      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;

      // Clean up old ended nodes
      if (this.musicActiveNodes.length > 50) {
        this.musicActiveNodes = this.musicActiveNodes.slice(-25);
      }
    }
  }

  // Keypad click tone
  playKey(pitch = 520) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Correct answer chime (triumphant rising chord)
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + idx * 0.06;
      const duration = 0.25;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // Wrong answer buzzer
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Rope yank / heave-ho whoosh
  playPull() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Low grunt/whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.22);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Countdown urgency tick
  playTick(high = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = high ? 880 : 440;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Referee whistle sound for start/finish
  playWhistle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, t);
    // Vibrato effect
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(28, t);
    lfoGain.gain.setValueAtTime(140, t);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
    gain.gain.setValueAtTime(0.35, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.52);
    osc.stop(t + 0.52);
  }

  // Grand victory fanfare
  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 },       // C
      { notes: [523.25, 659.25, 783.99], time: 0.22, dur: 0.18 },    // C
      { notes: [523.25, 659.25, 783.99], time: 0.44, dur: 0.18 },    // C
      { notes: [698.46, 880.00, 1046.50], time: 0.66, dur: 0.55 },   // F
      { notes: [783.99, 987.77, 1174.66], time: 1.25, dur: 0.25 },   // G
      { notes: [1046.50, 1318.51, 1567.98], time: 1.55, dur: 0.9 }   // C High
    ];

    const t = this.ctx.currentTime;
    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = t + c.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
        gain.gain.setValueAtTime(0.18, start + c.dur - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + c.dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + c.dur + 0.02);
      });
    });
  }
}


/**
 * Tug of War Animation Canvas Renderer
 * 
 * Features:
 * - 2 animated human boys on Left (Team Blue)
 * - 2 animated human boys on Right (Team Red)
 * - Continuous, non-stopping human pulling heave-ho animation (legs planted, arms straining, body leaning)
 * - Connected rope with dynamic sag, tension, center red ribbon flag
 * - Dust puff particles, sweat drops, dizzy stars, celebratory confetti
 * - Guaranteed paired ctx.save() / ctx.restore() for rock-solid stability
 */

class TugArena {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Visual state
    this.ropeOffset = 0;       // -100 (left win) to +100 (right win)
    this.targetOffset = 0;
    this.time = 0;

    // States: 'idle' | 'pull-left' | 'pull-right' | 'slip-left' | 'slip-right' | 'win-left' | 'win-right'
    this.state = 'idle';
    this.stateTimer = 0;

    // Particles (dust, sweat, stars, confetti)
    this.particles = [];

    // Screen resizing
    this.width = 800;
    this.height = 420;
    this.setupResize();

    // Start 60fps render loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupResize() {
    const resize = () => {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width || 800;
      this.height = rect.height || 420;

      this.canvas.width = Math.floor(this.width * dpr);
      this.canvas.height = Math.floor(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    setTimeout(resize, 40);
  }

  reset() {
    this.ropeOffset = 0;
    this.targetOffset = 0;
    this.state = 'idle';
    this.stateTimer = 0;
    this.particles = [];
  }

  setPull(offsetChange, side) {
    this.targetOffset = Math.max(-100, Math.min(100, this.targetOffset + offsetChange));

    if (side === 'left') {
      this.state = 'pull-left';
      this.stateTimer = 0.55;
      this.spawnDust(this.getLeftTeamX() - 40, this.height * 0.74, -1);
      this.spawnSweat(this.getRightTeamX() + 20, this.height * 0.45);
    } else if (side === 'right') {
      this.state = 'pull-right';
      this.stateTimer = 0.55;
      this.spawnDust(this.getRightTeamX() + 40, this.height * 0.74, 1);
      this.spawnSweat(this.getLeftTeamX() - 20, this.height * 0.45);
    }
  }

  triggerSlip(side) {
    if (side === 'left') {
      this.state = 'slip-left';
      this.stateTimer = 0.45;
      this.spawnStars(this.getLeftTeamX(), this.height * 0.4);
    } else {
      this.state = 'slip-right';
      this.stateTimer = 0.45;
      this.spawnStars(this.getRightTeamX(), this.height * 0.4);
    }
  }

  triggerWin(winner) {
    this.state = winner === 'left' ? 'win-left' : 'win-right';
    this.stateTimer = 9999;
    this.spawnBigCelebration();
  }

  getLeftTeamX() {
    const centerX = this.width / 2;
    const maxShift = this.width * 0.24;
    return centerX - 140 + (this.ropeOffset / 100) * maxShift;
  }

  getRightTeamX() {
    const centerX = this.width / 2;
    const maxShift = this.width * 0.24;
    return centerX + 140 + (this.ropeOffset / 100) * maxShift;
  }

  spawnDust(x, y, dir) {
    for (let i = 0; i < 9; i++) {
      this.particles.push({
        type: 'dust',
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 8,
        vx: (dir * (Math.random() * 2.5 + 1.2) + (Math.random() - 0.5)) * 1.8,
        vy: -Math.random() * 2.5 - 0.6,
        radius: Math.random() * 6 + 4,
        alpha: 0.85,
        decay: 0.035 + Math.random() * 0.02
      });
    }
  }

  spawnSweat(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        type: 'sweat',
        x: x + (Math.random() - 0.5) * 26,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3.5 - 1,
        radius: 3.5,
        alpha: 1,
        decay: 0.035
      });
    }
  }

  spawnStars(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        type: 'star',
        x: x + (Math.random() - 0.5) * 35,
        y: y + (Math.random() - 0.5) * 25,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 8,
        radius: 8,
        alpha: 1,
        decay: 0.03
      });
    }
  }

  spawnBigCelebration() {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#facc15', '#06b6d4'];
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        type: 'confetti',
        x: this.width * 0.5 + (Math.random() - 0.5) * this.width * 0.7,
        y: this.height * 0.15 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 8 - 3,
        width: Math.random() * 12 + 6,
        height: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 9,
        alpha: 1,
        gravity: 0.24,
        decay: 0.004 + Math.random() * 0.004
      });
    }
  }

  update(dt) {
    this.time += dt;

    // Smooth physics rope pull shift
    this.ropeOffset += (this.targetOffset - this.ropeOffset) * Math.min(1, dt * 7);

    // State timeout
    if (this.stateTimer > 0) {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0 && this.state !== 'win-left' && this.state !== 'win-right') {
        this.state = 'idle';
      }
    }

    // Continuously spawn winning confetti if game is won
    if ((this.state === 'win-left' || this.state === 'win-right') && Math.random() < 0.15) {
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#facc15'];
      this.particles.push({
        type: 'confetti',
        x: Math.random() * this.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        width: Math.random() * 10 + 6,
        height: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 6,
        alpha: 1,
        gravity: 0.1,
        decay: 0.003
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.alpha -= p.decay;

      if (p.type === 'confetti') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed * dt;
      } else if (p.type === 'dust') {
        p.x += p.vx;
        p.y += p.vy;
        p.radius += dt * 4;
      } else if (p.type === 'sweat') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 6 * dt;
      } else if (p.type === 'star') {
        p.angle += p.rotSpeed * dt;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  animate(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.animate);
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const groundY = h * 0.74;
    const centerX = w / 2;

    // 1. Draw Arena Field Background & Markings
    this.drawField(ctx, w, h, groundY, centerX);

    // 2. Positions of Left and Right Teams (Adaptive for Mobile & Smartboard screens)
    const maxShift = w * 0.22;
    const shift = (this.ropeOffset / 100) * maxShift;
    const charScale = Math.min(1, Math.max(0.68, Math.min(w / 460, h / 290)));
    const teamSpread = Math.min(145, Math.max(75, w * 0.26));

    const leftTeamX = centerX - teamSpread + shift;
    const rightTeamX = centerX + teamSpread + shift;
    const ropeMarkerX = centerX + shift;

    // Continuous human heave-ho pulling rhythm (never stops!)
    const heaveCycle = Math.sin(this.time * 5.5); // -1 to +1 oscillating heave

    const leftPulling = this.state === 'pull-left';
    const rightPulling = this.state === 'pull-right';
    const leftSlipping = this.state === 'slip-left';
    const rightSlipping = this.state === 'slip-right';

    const leftWinning = this.state === 'win-left';
    const rightWinning = this.state === 'win-right';
    const leftLosing = this.state === 'win-right';
    const rightLosing = this.state === 'win-left';

    // 3. Draw Left Team (Team Blue - 2 Animated Boys)
    this.drawTeam(ctx, {
      x: leftTeamX,
      groundY,
      dir: 1, // Facing Right towards center
      colorScheme: {
        shirt: '#2563eb',       // Royal Blue
        shirtDark: '#1d4ed8',
        stripes: '#93c5fd',     // Light Blue Stripe
        pants: '#1e293b',       // Dark Navy Shorts
        shoes: '#0284c7',       // Blue Sneakers
        skin: '#fed7aa',        // Skin tone
        hair: '#451a03',        // Dark hair
        cap: '#1d4ed8'
      },
      isPulling: leftPulling,
      isSlipping: leftSlipping,
      isWinning: leftWinning,
      isLosing: leftLosing,
      heave: heaveCycle,
      charScale
    });

    // 4. Draw Right Team (Team Red - 2 Animated Boys)
    this.drawTeam(ctx, {
      x: rightTeamX,
      groundY,
      dir: -1, // Facing Left towards center
      colorScheme: {
        shirt: '#e11d48',       // Crimson Red
        shirtDark: '#be123c',
        stripes: '#fda4af',     // Pink Stripe
        pants: '#1e293b',       // Dark Navy Shorts
        shoes: '#e11d48',       // Red Sneakers
        skin: '#fde68a',        // Skin tone
        hair: '#78350f',        // Brown hair
        cap: '#be123c'
      },
      isPulling: rightPulling,
      isSlipping: rightSlipping,
      isWinning: rightWinning,
      isLosing: rightLosing,
      heave: -heaveCycle, // Alternate heave rhythm for realistic tug tension!
      charScale
    });

    // 5. Draw the Connected Rope between both teams
    this.drawRope(ctx, leftTeamX, rightTeamX, ropeMarkerX, groundY - 45 * charScale);

    // 6. Draw Particles (Dust, Sweat, Confetti)
    this.drawParticles(ctx);
  }

  drawField(ctx, w, h, groundY, centerX) {
    // Sky gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Arena Floor
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
    groundGrad.addColorStop(0, '#f1f5f9');
    groundGrad.addColorStop(0.35, '#e2e8f0');
    groundGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Main Ground Baseline
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Center Danger Mud Pit / Puddle
    ctx.save();
    ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.beginPath();
    ctx.ellipse(centerX, groundY + 12, 75, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center Dashed Dividing Line (as in photo)
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 15);
    ctx.lineTo(centerX, groundY + 30);
    ctx.stroke();
    ctx.restore();

    // Knockout Boundary Lines
    const maxShift = w * 0.24;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;

    // Left KO boundary
    ctx.beginPath();
    ctx.moveTo(centerX - maxShift, groundY - 45);
    ctx.lineTo(centerX - maxShift, groundY + 20);
    ctx.stroke();

    // Right KO boundary
    ctx.beginPath();
    ctx.moveTo(centerX + maxShift, groundY - 45);
    ctx.lineTo(centerX + maxShift, groundY + 20);
    ctx.stroke();
    ctx.restore();
  }

  drawRope(ctx, leftTeamX, rightTeamX, markerX, ropeY) {
    ctx.save();

    // Hands anchor points for Left and Right front boys
    const p1 = { x: leftTeamX + 28, y: ropeY + 3 };
    const p2 = { x: rightTeamX - 28, y: ropeY + 3 };

    // Dynamic rope sag and tension wave
    const isYank = (this.state === 'pull-left' || this.state === 'pull-right');
    const wave = isYank ? Math.sin(this.time * 45) * 4 : Math.sin(this.time * 6) * 1.5;
    const sag = 8 + wave;

    // 1. Rope Floor Shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(p1.x - 70, p1.y + 60);
    ctx.quadraticCurveTo(markerX, p1.y + 68 + sag, p2.x + 70, p2.y + 60);
    ctx.stroke();

    // 2. Main Golden Braided Rope
    ctx.strokeStyle = '#d97706'; // Amber gold
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p1.x - 75, p1.y);
    ctx.quadraticCurveTo(markerX, p1.y + sag, p2.x + 75, p2.y);
    ctx.stroke();

    // 3. Rope Fiber Highlight
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(p1.x - 75, p1.y - 2);
    ctx.quadraticCurveTo(markerX, p1.y + sag - 2, p2.x + 75, p2.y - 2);
    ctx.stroke();

    // 4. Center Red Ribbon / Flag Marker
    const ribbonY = p1.y + sag * 0.95;

    // Red flag
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(markerX - 4, ribbonY - 14);
    ctx.lineTo(markerX + 4, ribbonY - 14);
    ctx.lineTo(markerX + 16, ribbonY + 12);
    ctx.lineTo(markerX, ribbonY + 28);
    ctx.lineTo(markerX - 16, ribbonY + 12);
    ctx.closePath();
    ctx.fill();

    // Center Golden Tie Ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(markerX, ribbonY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawTeam(ctx, opts) {
    const { x, groundY, dir, colorScheme, isPulling, isSlipping, isWinning, isLosing, heave, charScale = 1 } = opts;

    // Each team has 2 Boys: Back Boy and Front Boy
    const backBoyOffset = -58 * dir * charScale;
    const frontBoyOffset = 0;

    // Draw Back Boy first
    this.drawBoy(ctx, {
      x: x + backBoyOffset,
      groundY,
      dir,
      colorScheme,
      isPulling,
      isSlipping,
      isWinning,
      isLosing,
      heave: heave * 0.85,
      hairStyle: 'spiky',
      charScale
    });

    // Draw Front Boy
    this.drawBoy(ctx, {
      x: x + frontBoyOffset,
      groundY,
      dir,
      colorScheme,
      isPulling,
      isSlipping,
      isWinning,
      isLosing,
      heave: heave,
      hairStyle: 'cap',
      charScale
    });
  }

  drawBoy(ctx, opts) {
    const { x, groundY, dir, colorScheme, isPulling, isSlipping, isWinning, isLosing, heave, hairStyle, charScale = 1 } = opts;

    ctx.save(); // #1 Boy root transform
    ctx.translate(x, groundY);
    ctx.scale(dir * charScale, charScale); // Flip horizontally for facing direction & scale

    // Continuous athletic pulling lean backward
    let leanAngle = -0.32 + heave * 0.04; // oscillates continuously!
    let yOffset = -heave * 3.5;

    if (isPulling) {
      leanAngle = -0.48; // Hard yank backward!
      yOffset += 4;
    } else if (isSlipping) {
      leanAngle = 0.16; // Slips forward
    } else if (isWinning) {
      leanAngle = Math.sin(this.time * 12) * 0.1;
      yOffset = -Math.abs(Math.sin(this.time * 9)) * 28; // Jumping with joy!
    } else if (isLosing) {
      leanAngle = 0.58; // Fallen forward into the mud!
      yOffset = 18;
    }

    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.ellipse(0, 2, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- LEGS & SNEAKERS (Planted in the ground) ---
    // Back leg (straight, pushing backward into the turf)
    ctx.strokeStyle = colorScheme.pants;
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -40);
    ctx.lineTo(-28, -6);
    ctx.stroke();

    // Back sneaker
    ctx.fillStyle = colorScheme.shoes;
    ctx.beginPath();
    ctx.roundRect(-42, -10, 24, 11, 4);
    ctx.fill();

    // Front leg (bent forward at the knee, bracing)
    ctx.beginPath();
    ctx.moveTo(8, -40);
    ctx.lineTo(24, -20);
    ctx.lineTo(26, -5);
    ctx.stroke();

    // Front sneaker
    ctx.fillStyle = colorScheme.shoes;
    ctx.beginPath();
    ctx.roundRect(14, -9, 25, 10, 4);
    ctx.fill();

    // --- UPPER BODY (Leaning from pelvis) ---
    ctx.save(); // #2 Upper body lean transform
    ctx.translate(0, -40 + yOffset);
    ctx.rotate(leanAngle);

    // Torso (Shirt)
    ctx.fillStyle = colorScheme.shirt;
    ctx.beginPath();
    ctx.roundRect(-16, -54, 32, 52, 10);
    ctx.fill();

    // Horizontal Shirt Stripes
    ctx.strokeStyle = colorScheme.stripes;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, -38);
    ctx.lineTo(14, -38);
    ctx.moveTo(-15, -24);
    ctx.lineTo(15, -24);
    ctx.stroke();

    // Neck
    ctx.fillStyle = colorScheme.skin;
    ctx.fillRect(-6, -62, 12, 10);

    // Head
    const headX = 0;
    const headY = -80;
    const headR = 21;

    ctx.fillStyle = colorScheme.skin;
    ctx.beginPath();
    ctx.arc(headX, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.arc(headX - 18, headY + 2, 5, 0, Math.PI * 2);
    ctx.arc(headX + 18, headY + 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Cap
    if (hairStyle === 'cap') {
      ctx.fillStyle = colorScheme.cap;
      ctx.beginPath();
      ctx.arc(headX, headY - 4, headR + 2, Math.PI, 0);
      ctx.fill();
      // Visor
      ctx.fillRect(headX + 4, headY - 6, 22, 6);
    } else {
      ctx.fillStyle = colorScheme.hair;
      ctx.beginPath();
      ctx.arc(headX, headY - 5, headR + 1, Math.PI, 0);
      ctx.lineTo(headX + 18, headY - 14);
      ctx.lineTo(headX + 12, headY - 26);
      ctx.lineTo(headX + 2, headY - 18);
      ctx.lineTo(headX - 8, headY - 28);
      ctx.lineTo(headX - 16, headY - 15);
      ctx.closePath();
      ctx.fill();
    }

    // Face Expressions
    if (isWinning) {
      // Big happy curved eyes
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(headX + 7, headY - 2, 5, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(headX - 4, headY - 2, 5, Math.PI, 0);
      ctx.stroke();

      // Cheering open mouth
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(headX + 4, headY + 7, 8, 0, Math.PI);
      ctx.fill();
    } else if (isLosing) {
      // Dizzy X eyes
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(headX - 7, headY - 6); ctx.lineTo(headX - 1, headY);
      ctx.moveTo(headX - 1, headY - 6); ctx.lineTo(headX - 7, headY);
      ctx.moveTo(headX + 3, headY - 6); ctx.lineTo(headX + 9, headY);
      ctx.moveTo(headX + 9, headY - 6); ctx.lineTo(headX + 3, headY);
      ctx.stroke();

      // Shocked mouth
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(headX - 2, headY + 8);
      ctx.quadraticCurveTo(headX + 3, headY + 4, headX + 8, headY + 8);
      ctx.stroke();
    } else {
      // Determined straining face
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      // Eyebrows
      ctx.beginPath();
      ctx.moveTo(headX - 8, headY - 9);
      ctx.lineTo(headX, headY - 6);
      ctx.moveTo(headX + 2, headY - 6);
      ctx.lineTo(headX + 11, headY - 9);
      ctx.stroke();

      // Determined eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(headX + 6, headY - 2, 3, 0, Math.PI * 2);
      ctx.arc(headX - 3, headY - 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Clenched teeth
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(headX - 2, headY + 6, 14, 6, 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(headX + 2, headY + 6); ctx.lineTo(headX + 2, headY + 12);
      ctx.moveTo(headX + 6, headY + 6); ctx.lineTo(headX + 6, headY + 12);
      ctx.stroke();
    }

    // --- ARMS GRIPPING ROPE ---
    ctx.strokeStyle = colorScheme.shirt;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';

    const handX = 28;
    const handY = -12;

    if (isWinning) {
      // Arms thrown up in celebration!
      ctx.beginPath();
      ctx.moveTo(-10, -42);
      ctx.lineTo(-24, -80);
      ctx.moveTo(10, -42);
      ctx.lineTo(24, -80);
      ctx.stroke();

      ctx.fillStyle = colorScheme.skin;
      ctx.beginPath();
      ctx.arc(-24, -83, 6, 0, Math.PI * 2);
      ctx.arc(24, -83, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Back arm
      ctx.beginPath();
      ctx.moveTo(-8, -40);
      ctx.lineTo(handX - 6, handY + 2);
      ctx.stroke();

      // Front arm
      ctx.beginPath();
      ctx.moveTo(10, -40);
      ctx.lineTo(handX + 8, handY - 2);
      ctx.stroke();

      // Gripping Knuckles around rope
      ctx.fillStyle = colorScheme.skin;
      ctx.beginPath();
      ctx.arc(handX, handY, 7, 0, Math.PI * 2);
      ctx.arc(handX + 10, handY - 3, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // Closes #2 Upper body lean transform
    ctx.restore(); // Closes #1 Boy root transform
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'confetti') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      } else if (p.type === 'dust') {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sweat') {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = '#facc15';
        this.drawStar(ctx, 0, 0, 5, p.radius, p.radius * 0.45);
      }

      ctx.restore();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}


/**
 * Tug of Math - Main Game Coordinator
 */

class TugGame {
  constructor() {
    // Sub-systems
    this.math = new MathEngine({ difficulty: 'medium' });
    this.audio = new SoundFX();
    this.arena = null;

    // Configurable Settings
    this.matchDuration = 120; // 2 minutes in seconds (default)
    this.timeRemaining = 120;
    this.tugPower = 12; // percentage rope moves per correct answer
    this.isPaused = false;
    this.isGameOver = false;
    this.timerInterval = null;

    // Ring circumference (2 * Math.PI * 18 = ~113.097)
    this.ringCircumference = 113.097;

    // Players State
    this.player1 = {
      id: 'p1',
      name: 'BOYS',
      side: 'left',
      score: 0,
      attempts: 0,
      streak: 0,
      input: '',
      currentQuestion: null
    };

    this.player2 = {
      id: 'p2',
      name: 'GIRLS',
      side: 'right',
      score: 0,
      attempts: 0,
      streak: 0,
      input: '',
      currentQuestion: null
    };

    // DOM Elements Cache
    this.dom = {
      // Views
      setupScreen: document.getElementById('setupScreen'),
      gameScreen: document.getElementById('gameScreen'),
      countdownOverlay: document.getElementById('countdownOverlay'),
      countdownNumber: document.getElementById('countdownNumber'),
      countdownSubtext: document.getElementById('countdownSubtext'),
      victoryOverlay: document.getElementById('victoryOverlay'),

      // Setup Screen Controls
      setupP1Name: document.getElementById('setupP1Name'),
      setupP2Name: document.getElementById('setupP2Name'),
      watchBody: document.getElementById('watchBody'),
      watchCrown: document.getElementById('watchCrown'),
      watchFace: document.getElementById('watchFace'),
      watchHandWrap: document.getElementById('watchHandWrap'),
      setupTimerDisplay: document.getElementById('setupTimerDisplay'),
      setupTimerMode: document.getElementById('setupTimerMode'),
      btnStartGame: document.getElementById('btnStartGame'),

      // In-game Header
      proHudTimer: document.getElementById('proHudTimer'),
      timerProgressRing: document.getElementById('timerProgressRing'),
      timerDisplay: document.getElementById('timerDisplay'),
      timerSubLabel: document.getElementById('timerSubLabel'),
      btnPause: document.getElementById('btnPause'),
      btnRestart: document.getElementById('btnRestart'),
      btnSound: document.getElementById('btnSound'),
      btnMusic: document.getElementById('btnMusic'),
      btnSetupMusic: document.getElementById('btnSetupMusic'),
      btnSetupReturn: document.getElementById('btnSetupReturn'),
      btnFullscreen: document.getElementById('btnFullscreen'),

      // P1 UI
      p1NameLabel: document.getElementById('p1NameLabel'),
      p1Score: document.getElementById('p1Score'),
      p1Streak: document.getElementById('p1Streak'),
      p1QuestionType: document.getElementById('p1QuestionType'),
      p1QuestionExpr: document.getElementById('p1QuestionExpr'),
      p1AnswerBox: document.getElementById('p1AnswerBox'),
      p1AnswerDisplay: document.getElementById('p1AnswerDisplay'),
      p1Numpad: document.getElementById('p1Numpad'),

      // P2 UI
      p2NameLabel: document.getElementById('p2NameLabel'),
      p2Score: document.getElementById('p2Score'),
      p2Streak: document.getElementById('p2Streak'),
      p2QuestionType: document.getElementById('p2QuestionType'),
      p2QuestionExpr: document.getElementById('p2QuestionExpr'),
      p2AnswerBox: document.getElementById('p2AnswerBox'),
      p2AnswerDisplay: document.getElementById('p2AnswerDisplay'),
      p2Numpad: document.getElementById('p2Numpad'),

      // Meter & Canvas
      meterFillBlue: document.getElementById('meterFillBlue'),
      meterFillRed: document.getElementById('meterFillRed'),
      tugCanvas: document.getElementById('tugCanvas'),

      // Victory Celebration
      victoryHeadline: document.getElementById('victoryHeadline'),
      victorySubtext: document.getElementById('victorySubtext'),
      vStatP1Name: document.getElementById('vStatP1Name'),
      vStatP1Score: document.getElementById('vStatP1Score'),
      vStatP1Acc: document.getElementById('vStatP1Acc'),
      vStatP2Name: document.getElementById('vStatP2Name'),
      vStatP2Score: document.getElementById('vStatP2Score'),
      vStatP2Acc: document.getElementById('vStatP2Acc'),
      btnRematch: document.getElementById('btnRematch'),
      btnNewMatch: document.getElementById('btnNewMatch')
    };

    this.init();
  }

  init() {
    // 1. Initialize Canvas
    this.arena = new TugArena(this.dom.tugCanvas);

    // 2. Setup Event Listeners
    this.setupEventListeners();
    this.setupKeyboardListeners();

    // 3. Sync Setup Timer UI
    this.updateSetupTimerUI();
  }

  // Update Setup Screen Watch Readout, Hand Angle & Active Numbers (1 to 12)
  updateSetupTimerUI() {
    const mins = Math.max(1, Math.min(12, Math.round(this.matchDuration / 60) || 2));
    const angle = (mins % 12) * 30; // 1 -> 30deg, 2 -> 60deg, ..., 12 -> 0deg/360deg
    this.dom.setupTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:00`;
    this.dom.setupTimerMode.textContent = `${mins} MIN MATCH`;

    if (this.dom.watchHandWrap) {
      this.dom.watchHandWrap.style.setProperty('--hand-angle', `${angle}deg`);
    }

    // Highlight active clock number (1 to 12)
    if (this.dom.watchFace) {
      this.dom.watchFace.querySelectorAll('.clock-num').forEach(btn => {
        if (parseInt(btn.dataset.min, 10) === mins) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // Called when user clicks "START MATCH" on Setup Screen
  launchMatchWithCountdown() {
    // Read Competitor Names
    const p1 = this.dom.setupP1Name.value.trim().toUpperCase() || 'BOYS';
    const p2 = this.dom.setupP2Name.value.trim().toUpperCase() || 'GIRLS';
    this.player1.name = p1;
    this.player2.name = p2;

    this.dom.p1NameLabel.textContent = p1;
    this.dom.p2NameLabel.textContent = p2;

    // All 8 Math operations active
    this.math.setActiveOperations([
      MathOperations.ADD,
      MathOperations.SUB,
      MathOperations.MUL,
      MathOperations.DIV,
      MathOperations.SQUARE,
      MathOperations.SQRT,
      MathOperations.CUBE,
      MathOperations.CBRT
    ]);

    this.audio.init();

    // Switch view to Countdown
    this.dom.setupScreen.classList.remove('active');
    this.dom.countdownOverlay.classList.add('active');

    let count = 3;
    this.dom.countdownNumber.textContent = count;
    this.dom.countdownSubtext.textContent = 'GET READY TO PULL!';
    this.audio.playTick(false);

    const countTimer = setInterval(() => {
      count--;
      if (count > 0) {
        this.dom.countdownNumber.textContent = count;
        this.dom.countdownNumber.style.animation = 'none';
        void this.dom.countdownNumber.offsetWidth;
        this.dom.countdownNumber.style.animation = 'countPulse 0.9s ease-out';
        this.audio.playTick(false);
      } else if (count === 0) {
        this.dom.countdownNumber.textContent = 'PULL!';
        this.dom.countdownSubtext.textContent = 'SOLVE FAST!';
        this.audio.playWhistle();
      } else {
        clearInterval(countTimer);
        this.dom.countdownOverlay.classList.remove('active');
        this.dom.gameScreen.classList.add('active');

        // Resize canvas to fit game screen
        this.arena.setupResize();

        // Start Match
        this.startMatch();
      }
    }, 900);
  }

  startMatch() {
    this.isGameOver = false;
    this.isPaused = false;
    this.dom.btnPause.textContent = '⏸️';
    this.timeRemaining = this.matchDuration;
    this.updateTimerDisplay();

    // Reset scores & streaks
    this.player1.score = 0;
    this.player1.attempts = 0;
    this.player1.streak = 0;
    this.player1.input = '';

    this.player2.score = 0;
    this.player2.attempts = 0;
    this.player2.streak = 0;
    this.player2.input = '';

    this.updatePlayerScoreUI(this.player1);
    this.updatePlayerScoreUI(this.player2);
    this.updatePlayerInputUI(this.player1);
    this.updatePlayerInputUI(this.player2);

    // Reset Arena
    this.arena.reset();
    this.updateMeterUI();

    // Generate first questions
    this.nextQuestion(this.player1);
    this.nextQuestion(this.player2);

    // Start Slow Relaxing Background Theme Music
    this.audio.startRelaxMusic();

    // Start Timer Interval
    clearInterval(this.timerInterval);
    if (this.matchDuration > 0) {
      this.timerInterval = setInterval(() => this.tick(), 1000);
    } else {
      this.dom.timerDisplay.textContent = 'KO';
      this.dom.timerSubLabel.textContent = 'ENDLESS';
      this.dom.proHudTimer.classList.remove('urgent');
      this.dom.timerProgressRing.style.strokeDashoffset = '0';
    }
  }

  tick() {
    if (this.isPaused || this.isGameOver) return;

    this.timeRemaining--;
    this.updateTimerDisplay();

    if (this.timeRemaining <= 10 && this.timeRemaining > 0) {
      this.audio.playTick(this.timeRemaining <= 3);
      this.dom.proHudTimer.classList.add('urgent');
    } else {
      this.dom.proHudTimer.classList.remove('urgent');
    }

    if (this.timeRemaining <= 0) {
      this.endMatchByTime();
    }
  }

  updateTimerDisplay() {
    if (this.matchDuration === 0) {
      this.dom.timerDisplay.textContent = 'KO';
      this.dom.timerSubLabel.textContent = 'ENDLESS';
      return;
    }

    const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
    const secs = Math.max(0, this.timeRemaining) % 60;
    this.dom.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.dom.timerSubLabel.textContent = 'TIME LEFT';

    // Update circular progress ring
    const fraction = Math.max(0, this.timeRemaining) / this.matchDuration;
    const offset = this.ringCircumference * (1 - fraction);
    this.dom.timerProgressRing.style.strokeDashoffset = offset;
  }

  togglePause() {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    this.dom.btnPause.textContent = this.isPaused ? '▶️' : '⏸️';
    this.audio.duckMusic(this.isPaused);
  }

  nextQuestion(player) {
    player.currentQuestion = this.math.generateQuestion();
    player.input = '';
    this.updatePlayerQuestionUI(player);
    this.updatePlayerInputUI(player);
  }

  updatePlayerQuestionUI(player) {
    const isP1 = player.id === 'p1';
    const typeElem = isP1 ? this.dom.p1QuestionType : this.dom.p2QuestionType;
    const exprElem = isP1 ? this.dom.p1QuestionExpr : this.dom.p2QuestionExpr;

    typeElem.textContent = player.currentQuestion.label;
    exprElem.innerHTML = player.currentQuestion.questionHtml;
  }

  updatePlayerInputUI(player) {
    const isP1 = player.id === 'p1';
    const displayElem = isP1 ? this.dom.p1AnswerDisplay : this.dom.p2AnswerDisplay;

    if (player.input.length === 0) {
      displayElem.innerHTML = `<span class="answer-placeholder">Enter answer</span>`;
    } else {
      displayElem.textContent = player.input;
    }
  }

  updatePlayerScoreUI(player) {
    const isP1 = player.id === 'p1';
    const scoreElem = isP1 ? this.dom.p1Score : this.dom.p2Score;
    const streakElem = isP1 ? this.dom.p1Streak : this.dom.p2Streak;

    scoreElem.textContent = player.score;
    streakElem.textContent = `🔥 ${player.streak}`;
  }

  handlePlayerInputKey(player, key) {
    if (this.isGameOver || this.isPaused) return;

    if (key >= '0' && key <= '9') {
      if (player.input.length < 6) {
        player.input += key;
        this.audio.playKey(player.id === 'p1' ? 480 : 540);
        this.updatePlayerInputUI(player);
      }
    } else if (key === 'backspace') {
      if (player.input.length > 0) {
        player.input = player.input.slice(0, -1);
        this.audio.playKey(380);
        this.updatePlayerInputUI(player);
      }
    } else if (key === 'clear') {
      player.input = '';
      this.audio.playKey(320);
      this.updatePlayerInputUI(player);
    } else if (key === 'enter') {
      this.submitAnswer(player);
    }
  }

  submitAnswer(player) {
    if (player.input.length === 0) return;

    player.attempts++;
    const entered = parseInt(player.input, 10);
    const expected = player.currentQuestion.answer;
    const isP1 = player.id === 'p1';
    const answerBox = isP1 ? this.dom.p1AnswerBox : this.dom.p2AnswerBox;

    if (entered === expected) {
      // CORRECT ANSWER!
      player.score += 10;
      player.streak++;
      this.updatePlayerScoreUI(player);

      this.audio.playCorrect();
      this.audio.playPull();

      answerBox.classList.add('correct');
      setTimeout(() => answerBox.classList.remove('correct'), 300);

      // Negative shifts rope to Left (P1/Blue advantage)
      // Positive shifts rope to Right (P2/Red advantage)
      const pullDelta = isP1 ? -this.tugPower : this.tugPower;
      this.arena.setPull(pullDelta, player.side);
      this.updateMeterUI();

      // Check Knockout win
      if (this.arena.targetOffset <= -100) {
        this.endMatchWithWinner(this.player1, 'KNOCKOUT VICTORY! Completely dragged opponent across the line!');
        return;
      } else if (this.arena.targetOffset >= 100) {
        this.endMatchWithWinner(this.player2, 'KNOCKOUT VICTORY! Completely dragged opponent across the line!');
        return;
      }

      // Next Question
      this.nextQuestion(player);
    } else {
      // WRONG ANSWER
      player.streak = 0;
      this.updatePlayerScoreUI(player);

      this.audio.playWrong();
      this.arena.triggerSlip(player.side);

      answerBox.classList.add('wrong');
      setTimeout(() => {
        answerBox.classList.remove('wrong');
        player.input = '';
        this.updatePlayerInputUI(player);
      }, 350);
    }
  }

  updateMeterUI() {
    const normalized = (this.arena.targetOffset + 100) / 2;
    this.dom.meterFillBlue.style.width = `${100 - normalized}%`;
    this.dom.meterFillRed.style.width = `${normalized}%`;
  }

  endMatchByTime() {
    clearInterval(this.timerInterval);
    this.isGameOver = true;

    if (this.arena.targetOffset < -4) {
      this.endMatchWithWinner(this.player1, 'Won by rope territory advantage when timer reached zero!');
    } else if (this.arena.targetOffset > 4) {
      this.endMatchWithWinner(this.player2, 'Won by rope territory advantage when timer reached zero!');
    } else {
      if (this.player1.score > this.player2.score) {
        this.endMatchWithWinner(this.player1, 'Won on points in a super close finish!');
      } else if (this.player2.score > this.player1.score) {
        this.endMatchWithWinner(this.player2, 'Won on points in a super close finish!');
      } else {
        this.endMatchDraw();
      }
    }
  }

  endMatchWithWinner(winner, reason) {
    this.isGameOver = true;
    clearInterval(this.timerInterval);

    this.arena.triggerWin(winner.side);
    this.audio.stopRelaxMusic(1.5);
    this.audio.playVictory();

    const isP1 = winner.id === 'p1';
    this.dom.victoryHeadline.className = `victory-title ${isP1 ? 'blue-win' : 'red-win'}`;
    this.dom.victoryHeadline.textContent = `🏆 ${winner.name} WIN THE TUG OF WAR! 🏆`;
    this.dom.victorySubtext.textContent = reason;

    // Fill Stats
    this.dom.vStatP1Name.textContent = this.player1.name;
    this.dom.vStatP1Score.textContent = `${this.player1.score / 10} Solved`;
    const p1Acc = this.player1.attempts > 0 ? Math.round(((this.player1.score / 10) / this.player1.attempts) * 100) : 100;
    this.dom.vStatP1Acc.textContent = `${p1Acc}% Accuracy (${this.player1.attempts} tries)`;

    this.dom.vStatP2Name.textContent = this.player2.name;
    this.dom.vStatP2Score.textContent = `${this.player2.score / 10} Solved`;
    const p2Acc = this.player2.attempts > 0 ? Math.round(((this.player2.score / 10) / this.player2.attempts) * 100) : 100;
    this.dom.vStatP2Acc.textContent = `${p2Acc}% Accuracy (${this.player2.attempts} tries)`;

    setTimeout(() => {
      this.dom.victoryOverlay.classList.add('active');
    }, 700);
  }

  endMatchDraw() {
    this.isGameOver = true;
    clearInterval(this.timerInterval);

    this.audio.stopRelaxMusic(1.5);
    this.audio.playVictory();
    this.dom.victoryHeadline.className = 'victory-title';
    this.dom.victoryHeadline.textContent = `🤝 IT'S AN EPIC TIE DRAW! 🤝`;
    this.dom.victorySubtext.textContent = 'Both sides matched strength and math speed equally!';

    this.dom.vStatP1Name.textContent = this.player1.name;
    this.dom.vStatP1Score.textContent = `${this.player1.score / 10} Solved`;
    this.dom.vStatP2Name.textContent = this.player2.name;
    this.dom.vStatP2Score.textContent = `${this.player2.score / 10} Solved`;

    setTimeout(() => {
      this.dom.victoryOverlay.classList.add('active');
    }, 700);
  }

  setupEventListeners() {
    // 1. Setup Screen Start Match button
    this.dom.btnStartGame.addEventListener('click', () => {
      this.launchMatchWithCountdown();
    });

    // Setup Click Any Clock Number (1 to 12)
    if (this.dom.watchFace) {
      this.dom.watchFace.addEventListener('click', (e) => {
        const numBtn = e.target.closest('.clock-num');
        if (numBtn) {
          const mins = parseInt(numBtn.dataset.min, 10);
          this.matchDuration = mins * 60;
          this.audio.playKey(460 + mins * 28);
          this.updateSetupTimerUI();
          return;
        }
      });
    }

    // Setup Watch Crown click (Reset to 2 min default)
    if (this.dom.watchCrown) {
      this.dom.watchCrown.addEventListener('click', () => {
        this.matchDuration = 120;
        this.audio.playKey(680);
        this.updateSetupTimerUI();
      });
    }

    // 2. In-Game Header controls
    this.dom.btnPause.addEventListener('click', () => this.togglePause());
    this.dom.btnRestart.addEventListener('click', () => this.startMatch());
    this.dom.btnSound.addEventListener('click', () => {
      const active = this.audio.toggle();
      this.dom.btnSound.textContent = active ? '🔊' : '🔇';
    });

    // Toggle Slow Relax Background Music
    const syncMusicButtons = (active) => {
      if (this.dom.btnMusic) {
        this.dom.btnMusic.textContent = active ? '🎵' : '🔇';
      }
      if (this.dom.btnSetupMusic) {
        this.dom.btnSetupMusic.textContent = active ? '🎵 Relax Music: ON' : '🔇 Relax Music: OFF';
        if (active) {
          this.dom.btnSetupMusic.classList.remove('muted');
        } else {
          this.dom.btnSetupMusic.classList.add('muted');
        }
      }
    };

    if (this.dom.btnMusic) {
      this.dom.btnMusic.addEventListener('click', () => {
        const active = this.audio.toggleMusic();
        syncMusicButtons(active);
      });
    }

    if (this.dom.btnSetupMusic) {
      this.dom.btnSetupMusic.addEventListener('click', () => {
        const active = this.audio.toggleMusic();
        syncMusicButtons(active);
      });
    }

    // Return to Setup Screen button
    this.dom.btnSetupReturn.addEventListener('click', () => {
      clearInterval(this.timerInterval);
      this.audio.stopRelaxMusic(0.8);
      this.dom.gameScreen.classList.remove('active');
      this.dom.victoryOverlay.classList.remove('active');
      this.dom.setupScreen.classList.add('active');
    });

    // Fullscreen button
    this.dom.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // 3. Victory Celebration Actions
    this.dom.btnRematch.addEventListener('click', () => {
      this.dom.victoryOverlay.classList.remove('active');
      this.startMatch();
    });

    this.dom.btnNewMatch.addEventListener('click', () => {
      this.dom.victoryOverlay.classList.remove('active');
      this.dom.gameScreen.classList.remove('active');
      this.dom.setupScreen.classList.add('active');
    });

    // 4. On-Screen Numpads for Player 1 & Player 2
    this.dom.p1Numpad.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-key]');
      if (!btn) return;
      this.handlePlayerInputKey(this.player1, btn.dataset.key);
    });

    this.dom.p2Numpad.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-key]');
      if (!btn) return;
      this.handlePlayerInputKey(this.player2, btn.dataset.key);
    });

    // 5. Phone / Tablet QR Modal Controls
    const btnOpenPhoneModal = document.getElementById('btnOpenPhoneModal');
    const phoneModal = document.getElementById('phoneModal');
    const btnClosePhoneModal = document.getElementById('btnClosePhoneModal');
    const btnCopyPhoneUrl = document.getElementById('btnCopyPhoneUrl');
    const phoneQrImage = document.getElementById('phoneQrImage');
    const phoneUrlLink = document.getElementById('phoneUrlLink');
    const phoneServerStatus = document.getElementById('phoneServerStatus');
    const phoneOfflineAlert = document.getElementById('phoneOfflineAlert');
    const phoneUrlTypeLabel = document.getElementById('phoneUrlTypeLabel');

    let currentPhoneUrl = 'http://10.162.158.13:3000';

    const updatePhoneModalUI = (url, isOnline = true, isPublic = false) => {
      if (phoneUrlLink) {
        phoneUrlLink.textContent = url;
        phoneUrlLink.href = url;
      }
      if (phoneQrImage) {
        phoneQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;
      }
      if (phoneServerStatus) {
        if (isOnline) {
          phoneServerStatus.className = 'phone-status-pill online';
          phoneServerStatus.textContent = isPublic ? '🟢 Online Link Active (5G / 4G / Wi-Fi)' : '🟢 Server Active (Wi-Fi)';
        } else {
          phoneServerStatus.className = 'phone-status-pill offline';
          phoneServerStatus.textContent = '⚠️ Server Not Started on PC';
        }
      }
      if (phoneOfflineAlert) {
        phoneOfflineAlert.style.display = isOnline ? 'none' : 'block';
      }
      if (phoneUrlTypeLabel) {
        phoneUrlTypeLabel.textContent = isPublic ? '🌐 Open in Phone Browser (Works on 5G / 4G / Wi-Fi):' : '📶 Open in Phone Browser (Same Wi-Fi):';
      }
    };

    const checkServerStatus = () => {
      const apiUrl = window.location.protocol.startsWith('http') ? '/api/info' : 'http://localhost:3000/api/info';
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'online') {
            const best = data.publicUrl || data.localUrl || data.url;
            currentPhoneUrl = best;
            updatePhoneModalUI(best, true, !!data.publicUrl);
          } else {
            updatePhoneModalUI(currentPhoneUrl, false, false);
          }
        })
        .catch(() => {
          if (window.location.protocol.startsWith('http')) {
            updatePhoneModalUI(window.location.origin, true, false);
          } else {
            updatePhoneModalUI(currentPhoneUrl, false, false);
          }
        });
    };

    checkServerStatus();
    setInterval(checkServerStatus, 3000);

    if (btnOpenPhoneModal && phoneModal) {
      btnOpenPhoneModal.addEventListener('click', () => {
        phoneModal.classList.add('active');
        this.audio.playKey(520);
      });
    }

    if (btnClosePhoneModal && phoneModal) {
      btnClosePhoneModal.addEventListener('click', () => {
        phoneModal.classList.remove('active');
      });
    }

    if (phoneModal) {
      phoneModal.addEventListener('click', (e) => {
        if (e.target === phoneModal) {
          phoneModal.classList.remove('active');
        }
      });
    }

    if (btnCopyPhoneUrl) {
      btnCopyPhoneUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(currentPhoneUrl).then(() => {
          btnCopyPhoneUrl.textContent = 'Copied! ✓';
          setTimeout(() => { btnCopyPhoneUrl.textContent = '📋 Copy'; }, 2000);
        }).catch(() => {
          prompt('Copy this link:', currentPhoneUrl);
        });
      });
    }

    // Auto-open modal if launched with ?phone=1 (from Play_On_Phone.bat)
    if (new URLSearchParams(window.location.search).get('phone') === '1' && phoneModal) {
      phoneModal.classList.add('active');
    }
  }



  setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;

      // Player 2 Physical Numpad
      if (e.code.startsWith('Numpad')) {
        const num = e.code.replace('Numpad', '');
        if (num >= '0' && num <= '9') {
          this.handlePlayerInputKey(this.player2, num);
          this.highlightKey(this.dom.p2Numpad, num);
        } else if (e.code === 'NumpadEnter') {
          this.handlePlayerInputKey(this.player2, 'enter');
          this.highlightKey(this.dom.p2Numpad, 'enter');
        } else if (e.code === 'NumpadDecimal') {
          this.handlePlayerInputKey(this.player2, 'clear');
          this.highlightKey(this.dom.p2Numpad, 'clear');
        }
        return;
      }

      // Player 1 Number Row
      if (e.code.startsWith('Digit')) {
        const num = e.code.replace('Digit', '');
        this.handlePlayerInputKey(this.player1, num);
        this.highlightKey(this.dom.p1Numpad, num);
      } else if (e.code === 'Enter') {
        this.handlePlayerInputKey(this.player1, 'enter');
        this.highlightKey(this.dom.p1Numpad, 'enter');
      } else if (e.code === 'Backspace') {
        this.handlePlayerInputKey(this.player1, 'backspace');
        this.highlightKey(this.dom.p1Numpad, 'backspace');
      } else if (e.code === 'KeyC') {
        this.handlePlayerInputKey(this.player1, 'clear');
        this.highlightKey(this.dom.p1Numpad, 'clear');
      }
    });
  }

  highlightKey(numpadContainer, key) {
    const btn = numpadContainer.querySelector(`button[data-key="${key}"]`);
    if (btn) {
      btn.classList.add('active-press');
      setTimeout(() => btn.classList.remove('active-press'), 120);
    }
  }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  window.tugGame = new TugGame();
});
