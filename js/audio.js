/**
 * Audio Synthesizer for Tug of Math using Web Audio API
 * Generates all arcade game SFX procedurally - no external files needed!
 */

export class SoundFX {
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
