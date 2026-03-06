/* ch4-potential-energy.js — Roller-coaster energy conservation simulation
   Ball rolls along a track. KE, PE, and Total energy shown as bar charts.
   Total energy stays constant, demonstrating conservation of energy. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'potential-energy';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  // ── colours ────────────────────────────────────────────────────────
  const COL_KE    = [0, 255, 255];   // cyan
  const COL_PE    = [255, 0, 200];   // magenta
  const COL_TOTAL = [0, 255, 136];   // green
  const COL_BALL  = [255, 220, 50];  // gold
  const COL_TRACK = [100, 140, 255]; // blue-ish

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    // Physics state
    let ballPos;       // parametric position along track [0..1]
    let ballSpeed;     // ds/dt in parametric space
    let time;
    let trackPoints;   // precomputed [{x,y}]

    function buildTrack() {
      const h = engine.getParam('height');
      const n = 200;
      trackPoints = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = t * (width - 80) + 40;
        // Create an interesting roller-coaster profile
        const base = height - 60;
        const y = base
                - h * Math.sin(t * Math.PI)                      // main hill
                + (h * 0.45) * Math.sin(t * Math.PI * 3)         // bumps
                - (h * 0.2) * Math.sin(t * Math.PI * 5 + 0.5);  // ripples
        trackPoints.push({ x, y: Math.max(40, Math.min(base, y)) });
      }
    }

    function getTrackY(param) {
      const idx = param * (trackPoints.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, trackPoints.length - 1);
      const frac = idx - i0;
      return {
        x: trackPoints[i0].x + (trackPoints[i1].x - trackPoints[i0].x) * frac,
        y: trackPoints[i0].y + (trackPoints[i1].y - trackPoints[i0].y) * frac,
      };
    }

    function getTrackSlope(param) {
      const eps = 0.002;
      const a = getTrackY(Math.max(0, param - eps));
      const b = getTrackY(Math.min(1, param + eps));
      return (b.y - a.y) / (b.x - a.x + 0.001);
    }

    function resetSim() {
      ballPos = 0.02;
      ballSpeed = 0;
      time = 0;
      buildTrack();
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      resetSim();
    };

    engine.onReset(resetSim);

    p.draw = () => {
      p.background(10, 10, 26);
      if (!trackPoints || trackPoints.length === 0) { buildTrack(); return; }

      const mass = engine.getParam('mass');
      const gravity = engine.getParam('gravity');
      const h = engine.getParam('height');

      // Rebuild track if height changed
      buildTrack();

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Compute acceleration along track from gravity
        const slope = getTrackSlope(ballPos);
        const angle = Math.atan(slope);
        // Acceleration component along track (positive param = right)
        const accel = gravity * Math.sin(angle) * 0.0004; // scale factor
        ballSpeed += accel * dt * 60;
        ballSpeed *= 0.9995; // tiny friction to keep it real
        ballPos += ballSpeed;

        // Bounce at ends
        if (ballPos <= 0) { ballPos = 0.001; ballSpeed = Math.abs(ballSpeed) * 0.98; }
        if (ballPos >= 1) { ballPos = 0.999; ballSpeed = -Math.abs(ballSpeed) * 0.98; }
      }

      // ── Draw track ────────────────────────────────────────────────
      p.noFill();
      p.strokeWeight(3);
      p.stroke(COL_TRACK[0], COL_TRACK[1], COL_TRACK[2]);
      p.drawingContext.shadowColor = `rgba(${COL_TRACK.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 10;
      p.beginShape();
      for (const pt of trackPoints) {
        p.vertex(pt.x, pt.y);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // ── Draw ball ─────────────────────────────────────────────────
      const ballPt = getTrackY(ballPos);
      const ballR = 8 + mass;
      p.noStroke();
      p.drawingContext.shadowColor = `rgba(${COL_BALL.join(',')}, 0.8)`;
      p.drawingContext.shadowBlur = 20;
      p.fill(COL_BALL[0], COL_BALL[1], COL_BALL[2]);
      p.ellipse(ballPt.x, ballPt.y - ballR, ballR * 2, ballR * 2);
      p.drawingContext.shadowBlur = 0;

      // ── Energy calculations ───────────────────────────────────────
      const baseY = height - 60;
      const heightAbove = Math.max(0, baseY - ballPt.y);
      const PE = mass * gravity * heightAbove * 0.01; // scale for display
      const speed2 = ballSpeed * ballSpeed * 1e6;     // scale
      const KE = 0.5 * mass * speed2 * 0.01;
      const totalE = KE + PE;
      const maxE = mass * gravity * h * 0.01 * 1.2;   // approx max for bar scaling

      // ── Energy bar chart ──────────────────────────────────────────
      const barX = width - 130;
      const barW = 28;
      const barMaxH = 140;
      const barBaseY = height - 30;

      // Labels
      p.textAlign(p.CENTER);
      p.textSize(10);

      // KE bar
      const keH = Math.min(barMaxH, (KE / (maxE || 1)) * barMaxH);
      p.noStroke();
      p.fill(COL_KE[0], COL_KE[1], COL_KE[2], 60);
      p.rect(barX, barBaseY - barMaxH, barW, barMaxH);
      p.fill(COL_KE[0], COL_KE[1], COL_KE[2]);
      p.drawingContext.shadowColor = `rgba(${COL_KE.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 8;
      p.rect(barX, barBaseY - keH, barW, keH);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.text('KE', barX + barW / 2, barBaseY + 14);

      // PE bar
      const peH = Math.min(barMaxH, (PE / (maxE || 1)) * barMaxH);
      p.fill(COL_PE[0], COL_PE[1], COL_PE[2], 60);
      p.rect(barX + barW + 8, barBaseY - barMaxH, barW, barMaxH);
      p.fill(COL_PE[0], COL_PE[1], COL_PE[2]);
      p.drawingContext.shadowColor = `rgba(${COL_PE.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 8;
      p.rect(barX + barW + 8, barBaseY - peH, barW, peH);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.text('PE', barX + barW + 8 + barW / 2, barBaseY + 14);

      // Total bar
      const totH = Math.min(barMaxH, (totalE / (maxE || 1)) * barMaxH);
      p.fill(COL_TOTAL[0], COL_TOTAL[1], COL_TOTAL[2], 60);
      p.rect(barX + (barW + 8) * 2, barBaseY - barMaxH, barW, barMaxH);
      p.fill(COL_TOTAL[0], COL_TOTAL[1], COL_TOTAL[2]);
      p.drawingContext.shadowColor = `rgba(${COL_TOTAL.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 8;
      p.rect(barX + (barW + 8) * 2, barBaseY - totH, barW, totH);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.text('Total', barX + (barW + 8) * 2 + barW / 2, barBaseY + 14);

      // ── Info text ─────────────────────────────────────────────────
      p.fill(255, 255, 255, 200);
      p.textAlign(p.LEFT);
      p.textSize(13);
      p.text(`KE = ${KE.toFixed(1)} J`, 15, 25);
      p.text(`PE = ${PE.toFixed(1)} J`, 15, 42);
      p.fill(COL_TOTAL[0], COL_TOTAL[1], COL_TOTAL[2]);
      p.text(`Total E = ${totalE.toFixed(1)} J  (conserved)`, 15, 59);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      buildTrack();
    };
  }, { height: 150, mass: 3, gravity: 9.8 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'height', label: 'Track Height', min: 50, max: 300, step: 10, value: 150, unit: 'px' },
    { name: 'mass',   label: 'Mass',         min: 1,  max: 10,  step: 0.5, value: 3,  unit: 'kg' },
    { name: 'gravity',label: 'Gravity',      min: 5,  max: 15,  step: 0.5, value: 9.8, unit: 'm/s\u00B2' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
