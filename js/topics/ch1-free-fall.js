// Chapter 1: Free Fall — Vacuum vs Air Resistance Comparison
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'free-fall';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Two objects
    let vacuumY = 0, vacuumVy = 0;
    let airY = 0, airVy = 0;
    let time = 0;
    let landed = [false, false];
    let landTimes = [0, 0];

    // Trail data
    let vacuumTrail = [];
    let airTrail = [];

    const dropHeight = 100; // meters
    const groundY = 420;
    const startY = 60;
    const pixPerMeter = (groundY - startY) / dropHeight;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      resetDrop();
    };

    function resetDrop() {
      vacuumY = 0; vacuumVy = 0;
      airY = 0; airVy = 0;
      time = 0;
      landed = [false, false];
      landTimes = [0, 0];
      vacuumTrail = [];
      airTrail = [];
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const g = engine.getParam('gravity');
      const Cd = engine.getParam('airResistance');
      const mass = engine.getParam('mass');

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Free Fall: Vacuum vs Air Resistance', width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click to drop / reset', width / 2, 28);

      // Physics update
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Vacuum object - only gravity
        if (!landed[0]) {
          vacuumVy += g * dt;
          vacuumY += vacuumVy * dt;
          if (vacuumY >= dropHeight) {
            vacuumY = dropHeight;
            landed[0] = true;
            landTimes[0] = time;
          }
          if (time % 0.15 < dt) vacuumTrail.push(vacuumY);
        }

        // Air object - gravity + drag: F_drag = 0.5 * Cd * A * rho * v^2
        // Simplified: a = g - (Cd / mass) * v * |v|
        if (!landed[1]) {
          const dragAccel = (Cd * airVy * Math.abs(airVy)) / mass;
          airVy += (g - dragAccel) * dt;
          airY += airVy * dt;
          if (airY >= dropHeight) {
            airY = dropHeight;
            landed[1] = true;
            landTimes[1] = time;
          }
          if (time % 0.15 < dt) airTrail.push(airY);
        }
      }

      // Column labels
      const col1X = width * 0.3;
      const col2X = width * 0.7;

      // Vacuum label
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text('VACUUM', col1X, 45);
      p.drawingContext.shadowBlur = 0;

      // Air label
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff6464';
      p.fill(255, 100, 100);
      p.text('AIR RESISTANCE', col2X, 45);
      p.drawingContext.shadowBlur = 0;

      // Drop tubes
      const tubeW = 60;
      // Vacuum tube
      p.fill(15, 20, 40, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(col1X - tubeW / 2, startY, tubeW, groundY - startY, 4);
      p.noStroke();
      p.fill(0, 180, 216, 120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('No air', col1X, startY + 15);

      // Air tube
      p.fill(15, 20, 40, 200);
      p.stroke(255, 100, 100, 60);
      p.strokeWeight(1);
      p.rect(col2X - tubeW / 2, startY, tubeW, groundY - startY, 4);

      // Air particles (visual effect)
      p.noStroke();
      for (let i = 0; i < 20; i++) {
        const px = col2X + (p.noise(i * 0.5, time * 0.3) - 0.5) * tubeW * 0.7;
        const py = startY + (p.noise(i * 0.3 + 100, time * 0.2)) * (groundY - startY);
        p.fill(255, 100, 100, 30 + Cd * 40);
        p.ellipse(px, py, 3, 3);
      }

      // Height markers
      for (let h = 0; h <= dropHeight; h += 20) {
        const my = startY + h * pixPerMeter;
        p.stroke(50, 50, 70);
        p.strokeWeight(0.5);
        p.line(col1X - tubeW / 2 - 15, my, col1X - tubeW / 2, my);
        p.noStroke();
        p.fill(80, 80, 110);
        p.textSize(8);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(h + 'm', col1X - tubeW / 2 - 18, my);
      }

      // Ground
      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ff88';
      p.line(20, groundY, width - 20, groundY);
      p.drawingContext.shadowBlur = 0;

      // Trail dots - vacuum
      vacuumTrail.forEach((ty, i) => {
        const alpha = 60 + (i / vacuumTrail.length) * 150;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(col1X, startY + ty * pixPerMeter, 8, 8);
      });

      // Trail dots - air
      airTrail.forEach((ty, i) => {
        const alpha = 60 + (i / airTrail.length) * 150;
        p.noStroke();
        p.fill(255, 100, 100, alpha);
        p.ellipse(col2X, startY + ty * pixPerMeter, 8, 8);
      });

      // Vacuum ball
      const vBallY = startY + vacuumY * pixPerMeter;
      p.drawingContext.shadowBlur = 18;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.ellipse(col1X, Math.min(vBallY, groundY), 20, 20);
      p.drawingContext.shadowBlur = 0;

      // Air ball
      const aBallY = startY + airY * pixPerMeter;
      p.drawingContext.shadowBlur = 18;
      p.drawingContext.shadowColor = '#ff6464';
      p.fill(255, 100, 100);
      p.noStroke();
      p.ellipse(col2X, Math.min(aBallY, groundY), 20, 20);
      p.drawingContext.shadowBlur = 0;

      // Velocity arrows
      if (vacuumVy > 0.5) {
        const vLen = Math.min(vacuumVy * 1.5, 60);
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#00ff88';
        p.line(col1X + 18, vBallY, col1X + 18, vBallY + vLen);
        p.line(col1X + 18, vBallY + vLen, col1X + 14, vBallY + vLen - 5);
        p.line(col1X + 18, vBallY + vLen, col1X + 22, vBallY + vLen - 5);
        p.drawingContext.shadowBlur = 0;
      }
      if (airVy > 0.5) {
        const aLen = Math.min(airVy * 1.5, 60);
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#00ff88';
        p.line(col2X + 18, aBallY, col2X + 18, aBallY + aLen);
        p.line(col2X + 18, aBallY + aLen, col2X + 14, aBallY + aLen - 5);
        p.line(col2X + 18, aBallY + aLen, col2X + 22, aBallY + aLen - 5);
        p.drawingContext.shadowBlur = 0;
      }

      // Info panel
      const panelY = groundY + 10;
      p.fill(20, 20, 40, 220);
      p.stroke(60, 60, 90);
      p.strokeWeight(1);
      p.rect(20, panelY, width - 40, 85, 8);

      p.noStroke();
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);

      // Vacuum info (left column)
      p.fill(0, 180, 216);
      p.text('Vacuum', col1X, panelY + 5);
      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('v = ' + vacuumVy.toFixed(1) + ' m/s', col1X, panelY + 20);
      p.text('y = ' + vacuumY.toFixed(1) + ' m', col1X, panelY + 34);
      if (landed[0]) {
        p.fill(0, 255, 136);
        p.text('Landed: ' + landTimes[0].toFixed(2) + ' s', col1X, panelY + 48);
      }

      // Air info (right column)
      p.fill(255, 100, 100);
      p.textSize(11);
      p.text('Air Resistance', col2X, panelY + 5);
      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('v = ' + airVy.toFixed(1) + ' m/s', col2X, panelY + 20);
      p.text('y = ' + airY.toFixed(1) + ' m', col2X, panelY + 34);
      if (landed[1]) {
        p.fill(0, 255, 136);
        p.text('Landed: ' + landTimes[1].toFixed(2) + ' s', col2X, panelY + 48);
      }

      // Center row below both columns
      const vTerm = Math.sqrt((mass * g) / Cd);
      p.fill(255, 255, 255, 200);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text('t = ' + time.toFixed(2) + ' s', width / 2, panelY + 62);

      p.fill(255, 170, 0);
      p.textSize(10);
      p.text('Terminal v: ' + vTerm.toFixed(1) + ' m/s', width * 0.3, panelY + 62);

      if (landed[0] && landed[1]) {
        p.fill(255, 200, 50);
        p.textSize(11);
        p.text('Difference: ' + Math.abs(landTimes[0] - landTimes[1]).toFixed(2) + ' s', width * 0.7, panelY + 62);
      }
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      resetDrop();
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { gravity: 9.81, airResistance: 0.5, mass: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'gravity', label: 'Gravity (g)', min: 1, max: 20, step: 0.1, value: 9.81, unit: 'm/s\u00B2' },
    { name: 'airResistance', label: 'Drag Coefficient', min: 0, max: 1, step: 0.01, value: 0.5, unit: '' },
    { name: 'mass', label: 'Mass', min: 0.1, max: 50, step: 0.5, value: 5, unit: 'kg' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
