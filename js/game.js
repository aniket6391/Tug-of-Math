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
