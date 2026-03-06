// Chapter 2: Relative Motion — Two Boats Crossing a River
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'relative-motion';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Boat states
    let boat1 = { x: 0, y: 0, landed: false, time: 0, path: [] };
    let boat2 = { x: 0, y: 0, landed: false, time: 0, path: [] };
    let simTime = 0;
    let running = false;

    // River geometry
    const riverTop = 120;
    const riverBottom = 350;
    const riverWidth = () => riverBottom - riverTop;
    const startX = 150;

    // Water particles
    let waterParticles = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 480;
      p.createCanvas(width, height);
      p.textFont('monospace');

      // Init water particles
      for (let i = 0; i < 60; i++) {
        waterParticles.push({
          x: Math.random() * width,
          y: riverTop + Math.random() * riverWidth(),
          size: 2 + Math.random() * 3
        });
      }

      resetSim();
    };

    function resetSim() {
      boat1 = { x: startX, y: riverBottom, landed: false, time: 0, path: [] };
      boat2 = { x: startX + 200, y: riverBottom, landed: false, time: 0, path: [] };
      simTime = 0;
      running = true;
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const boatSpeed = engine.getParam('boatSpeed');
      const riverSpeed = engine.getParam('riverSpeed');

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Relative Motion: River Crossing', width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click to reset simulation', width / 2, 28);

      // === Draw river ===
      // Banks
      p.fill(50, 80, 40);
      p.noStroke();
      p.rect(0, 0, width, riverTop);
      p.rect(0, riverBottom, width, height - riverBottom);

      // Bank labels
      p.fill(100, 150, 80);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('FAR BANK (Destination)', width / 2, riverTop / 2 + 25);
      p.text('NEAR BANK (Start)', width / 2, riverBottom + (height - riverBottom) / 2 - 20);

      // River
      p.fill(15, 40, 80);
      p.rect(0, riverTop, width, riverWidth());

      // Water flow particles
      for (let wp of waterParticles) {
        if (engine.isPlaying) {
          wp.x += riverSpeed * 2 * engine.speed;
          if (wp.x > width + 10) wp.x = -10;
        }
        p.noStroke();
        p.fill(30, 80, 140, 100);
        p.ellipse(wp.x, wp.y, wp.size, wp.size * 0.5);
      }

      // Current arrow
      p.stroke(0, 180, 216, 120);
      p.strokeWeight(1);
      const arrowY = (riverTop + riverBottom) / 2;
      for (let ax = 30; ax < width - 30; ax += 80) {
        p.line(ax, arrowY, ax + 30, arrowY);
        p.line(ax + 30, arrowY, ax + 24, arrowY - 4);
        p.line(ax + 30, arrowY, ax + 24, arrowY + 4);
      }
      p.noStroke();
      p.fill(0, 180, 216, 150);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('River current: ' + riverSpeed.toFixed(1) + ' m/s \u2192', width / 2, arrowY + 15);

      // Physics update
      if (running && engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;
        const pxPerMeter = riverWidth() / 20; // 20 meters river width

        // Boat 1: Aims straight across (no compensation)
        if (!boat1.landed) {
          boat1.time += dt;
          boat1.y -= boatSpeed * pxPerMeter * dt; // straight up
          boat1.x += riverSpeed * pxPerMeter * dt; // pushed by current
          boat1.path.push({ x: boat1.x, y: boat1.y });
          if (boat1.y <= riverTop) {
            boat1.y = riverTop;
            boat1.landed = true;
          }
        }

        // Boat 2: Compensates for current (aims upstream)
        if (!boat2.landed) {
          boat2.time += dt;
          // Aim direction: need to go straight up, so aim upstream
          const sinTheta = Math.min(riverSpeed / boatSpeed, 0.99);
          const cosTheta = Math.sqrt(1 - sinTheta * sinTheta);
          const effectiveVy = boatSpeed * cosTheta;

          boat2.y -= effectiveVy * pxPerMeter * dt;
          // Boat velocity upstream component cancels river
          boat2.x += (riverSpeed - boatSpeed * sinTheta) * pxPerMeter * dt;
          boat2.path.push({ x: boat2.x, y: boat2.y });
          if (boat2.y <= riverTop) {
            boat2.y = riverTop;
            boat2.landed = true;
          }
        }

        if (boat1.landed && boat2.landed) {
          running = false;
        }
      }

      // Draw paths
      if (boat1.path.length > 1) {
        p.noFill();
        p.stroke(255, 100, 100, 120);
        p.strokeWeight(2);
        p.drawingContext.setLineDash([4, 3]);
        p.beginShape();
        for (const pt of boat1.path) p.vertex(pt.x, pt.y);
        p.endShape();
        p.drawingContext.setLineDash([]);
      }

      if (boat2.path.length > 1) {
        p.noFill();
        p.stroke(0, 255, 136, 120);
        p.strokeWeight(2);
        p.drawingContext.setLineDash([4, 3]);
        p.beginShape();
        for (const pt of boat2.path) p.vertex(pt.x, pt.y);
        p.endShape();
        p.drawingContext.setLineDash([]);
      }

      // Draw boats
      drawBoat(p, boat1.x, boat1.y, '#ff6464', 'A');
      drawBoat(p, boat2.x, boat2.y, '#00ff88', 'B');

      // Velocity vectors on boats
      const pxPerMeter = riverWidth() / 20;
      const vScale = 5;

      // Boat 1 vectors
      if (!boat1.landed) {
        // Boat velocity (straight up)
        drawVectorArrow(p, boat1.x + 20, boat1.y, boat1.x + 20, boat1.y - boatSpeed * vScale, '#ffaa00');
        // River velocity
        drawVectorArrow(p, boat1.x + 20, boat1.y, boat1.x + 20 + riverSpeed * vScale, boat1.y, '#00b4d8');
        // Resultant
        drawVectorArrow(p, boat1.x + 20, boat1.y, boat1.x + 20 + riverSpeed * vScale, boat1.y - boatSpeed * vScale, '#ff6464');
      }

      // Boat 2 vectors
      if (!boat2.landed && boatSpeed > riverSpeed) {
        const sinTheta = riverSpeed / boatSpeed;
        const cosTheta = Math.sqrt(1 - sinTheta * sinTheta);
        // Boat velocity (aimed upstream)
        drawVectorArrow(p, boat2.x + 20, boat2.y, boat2.x + 20 - boatSpeed * sinTheta * vScale, boat2.y - boatSpeed * cosTheta * vScale, '#ffaa00');
        // River velocity
        drawVectorArrow(p, boat2.x + 20, boat2.y, boat2.x + 20 + riverSpeed * vScale, boat2.y, '#00b4d8');
        // Resultant (straight up)
        const effectiveV = boatSpeed * cosTheta;
        drawVectorArrow(p, boat2.x + 20, boat2.y, boat2.x + 20, boat2.y - effectiveV * vScale, '#00ff88');
      }

      // Info panel
      const panelY = riverBottom + 15;
      p.fill(20, 20, 40, 230);
      p.stroke(80, 80, 120, 60);
      p.strokeWeight(1);
      p.rect(20, panelY, width - 40, 100, 8);

      p.noStroke();
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);

      // Boat A info
      p.fill(255, 100, 100);
      p.text('Boat A (Straight Across)', 35, panelY + 8);
      p.fill(200, 200, 220);
      p.textSize(10);
      const drift1 = Math.abs(boat1.x - startX) / pxPerMeter;
      p.text('Aims: straight across', 35, panelY + 24);
      p.text('Drift: ' + drift1.toFixed(1) + ' m downstream', 35, panelY + 38);
      p.text('Time: ' + boat1.time.toFixed(2) + ' s' + (boat1.landed ? ' (LANDED)' : ''), 35, panelY + 52);
      const dist1 = Math.sqrt(20 * 20 + drift1 * drift1);
      p.text('Path length: ' + dist1.toFixed(1) + ' m', 35, panelY + 66);

      // Boat B info
      const halfW = (width - 40) / 2;
      p.fill(0, 255, 136);
      p.textSize(11);
      p.text('Boat B (Compensates)', 35 + halfW, panelY + 8);
      p.fill(200, 200, 220);
      p.textSize(10);
      const canCompensate = boatSpeed > riverSpeed;
      if (canCompensate) {
        const sinTheta = riverSpeed / boatSpeed;
        const aimAngle = Math.asin(sinTheta) * 180 / Math.PI;
        const effectiveV = boatSpeed * Math.sqrt(1 - sinTheta * sinTheta);
        const crossTime = 20 / effectiveV;
        p.text('Aims: ' + aimAngle.toFixed(1) + '\u00B0 upstream', 35 + halfW, panelY + 24);
        p.text('Drift: ~0 m (compensated)', 35 + halfW, panelY + 38);
        p.text('Time: ' + boat2.time.toFixed(2) + ' s' + (boat2.landed ? ' (LANDED)' : ''), 35 + halfW, panelY + 52);
        p.text('Effective speed: ' + effectiveV.toFixed(1) + ' m/s', 35 + halfW, panelY + 66);
      } else {
        p.fill(255, 100, 100);
        p.text('Cannot compensate!', 35 + halfW, panelY + 24);
        p.text('River too fast for boat speed.', 35 + halfW, panelY + 38);
      }

      // Legend
      p.fill(200, 200, 220, 120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Yellow = boat velocity | Blue = river velocity | Colored = resultant', width / 2, panelY + 96);

      // Time display
      p.fill(255, 200, 50);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('t = ' + simTime.toFixed(1) + ' s', width / 2, riverTop - 25);
    };

    function drawBoat(p, x, y, color, label) {
      p.push();
      p.translate(x, y);
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = color;
      p.fill(color);
      p.noStroke();
      // Simple boat shape
      p.beginShape();
      p.vertex(-10, 5);
      p.vertex(-12, -3);
      p.vertex(0, -10);
      p.vertex(12, -3);
      p.vertex(10, 5);
      p.endShape(p.CLOSE);
      p.drawingContext.shadowBlur = 0;

      p.fill(255);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, 0, -1);
      p.pop();
    }

    function drawVectorArrow(p, x1, y1, x2, y2, color) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      p.stroke(color);
      p.strokeWeight(1.5);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = color;
      p.line(x1, y1, x2, y2);
      p.line(x2, y2, x2 - 6 * Math.cos(angle - 0.4), y2 - 6 * Math.sin(angle - 0.4));
      p.line(x2, y2, x2 - 6 * Math.cos(angle + 0.4), y2 - 6 * Math.sin(angle + 0.4));
      p.drawingContext.shadowBlur = 0;
    }

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        resetSim();
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { boatSpeed: 5, riverSpeed: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'boatSpeed', label: 'Boat Speed', min: 1, max: 10, step: 0.5, value: 5, unit: 'm/s' },
    { name: 'riverSpeed', label: 'River Speed', min: 0, max: 8, step: 0.5, value: 3, unit: 'm/s' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
