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

export class TugArena {
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
