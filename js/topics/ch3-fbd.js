// Chapter 3: Free Body Diagrams — Inclined Plane
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'free-body-diagrams';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Block sliding state
    let blockPos = 0.3; // fraction along the incline (0 = top, 1 = bottom)
    let blockVel = 0;
    let simTime = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 530;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const angleDeg = engine.getParam('angle');
      const mass = engine.getParam('mass');
      const mu = engine.getParam('friction');
      const angleRad = angleDeg * Math.PI / 180;
      const g = 9.81;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Free Body Diagram: Inclined Plane', width / 2, 8);

      // === Inclined plane geometry ===
      const planeLeft = 80;
      const planeBottom = 340;
      const planeLen = 400;
      const planeRight = planeLeft + planeLen * Math.cos(angleRad);
      const planeTop = planeBottom - planeLen * Math.sin(angleRad);

      // Ground
      p.stroke(0, 255, 136, 80);
      p.strokeWeight(1);
      p.line(0, planeBottom, width, planeBottom);

      // Incline surface
      p.stroke(100, 120, 140);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#667788';
      p.line(planeLeft, planeBottom, planeRight, planeTop);
      p.drawingContext.shadowBlur = 0;

      // Incline fill (triangle)
      p.fill(25, 30, 40);
      p.noStroke();
      p.triangle(planeLeft, planeBottom, planeRight, planeTop, planeRight, planeBottom);

      // Angle arc
      p.noFill();
      p.stroke(255, 200, 50, 150);
      p.strokeWeight(1.5);
      p.arc(planeRight, planeBottom, 60, 60, -Math.PI, -Math.PI + angleRad);
      p.noStroke();
      p.fill(255, 200, 50, 200);
      p.textSize(12);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('\u03B8 = ' + angleDeg.toFixed(0) + '\u00B0', planeRight + 35, planeBottom - 15);

      // Friction texture on incline
      const texCount = Math.floor(mu * 30);
      p.fill(60, 65, 75);
      for (let i = 0; i < texCount; i++) {
        const frac = (i + 0.5) / texCount;
        const tx = planeLeft + (planeRight - planeLeft) * frac;
        const ty = planeBottom + (planeTop - planeBottom) * frac;
        p.ellipse(tx + (Math.sin(i * 7) * 5), ty + (Math.cos(i * 13) * 3), 2, 2);
      }

      // === Physics calculations ===
      const W = mass * g;                                    // Weight
      const Wparallel = W * Math.sin(angleRad);             // Component along plane
      const Wperpendicular = W * Math.cos(angleRad);        // Component perpendicular
      const N = Wperpendicular;                              // Normal force
      const fFriction = mu * N;                              // Friction force
      const netForce = Wparallel - fFriction;               // Net force along plane
      const accel = netForce / mass;                         // Acceleration

      // Physics update - block slides
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;

        if (netForce > 0) {
          blockVel += accel * dt * 0.02;
          blockPos += blockVel * dt;
        } else {
          // Static: friction holds
          blockVel = 0;
        }

        if (blockPos > 0.9) {
          blockPos = 0.3;
          blockVel = 0;
        }
        if (blockPos < 0) blockPos = 0;
      }

      // === Block on incline ===
      const blockFrac = blockPos;
      const blockCX = planeLeft + (planeRight - planeLeft) * blockFrac;
      const blockCY = planeBottom + (planeTop - planeBottom) * blockFrac;
      const blockSize = 35;

      p.push();
      p.translate(blockCX, blockCY);
      p.rotate(-angleRad);

      // Block
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 130, 180);
      p.stroke(0, 180, 216);
      p.strokeWeight(1);
      p.rect(-blockSize / 2, -blockSize, blockSize, blockSize, 3);
      p.drawingContext.shadowBlur = 0;

      // Mass label
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(mass.toFixed(0) + 'kg', 0, -blockSize / 2);

      p.pop();

      // === Force vectors (drawn from block center) ===
      const arrowScale = 2.5;

      // 1. Weight (straight down)
      const wLen = W * arrowScale;
      p.stroke(255, 170, 0);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ffaa00';
      drawArrow(p, blockCX, blockCY - blockSize / 2, blockCX, blockCY - blockSize / 2 + wLen);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 170, 0);
      p.textSize(11);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('W = ' + W.toFixed(1) + ' N', blockCX + 8, blockCY - blockSize / 2 + wLen / 2);

      // 2. Normal force (perpendicular to surface, away from surface)
      const nDirX = -Math.sin(angleRad);
      const nDirY = -Math.cos(angleRad);
      const nLen = N * arrowScale;
      p.stroke(139, 92, 246);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#8b5cf6';
      drawArrow(p, blockCX, blockCY - blockSize / 2, blockCX + nDirX * nLen, blockCY - blockSize / 2 + nDirY * nLen);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('N = ' + N.toFixed(1) + ' N', blockCX + nDirX * nLen, blockCY - blockSize / 2 + nDirY * nLen - 5);

      // 3. Friction (along surface, up the incline if block slides down)
      if (mu > 0) {
        const fDirX = -(Math.cos(angleRad));
        const fDirY = (Math.sin(angleRad));
        const fricLen = fFriction * arrowScale;
        p.stroke(255, 100, 100);
        p.strokeWeight(2.5);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#ff6464';
        drawArrow(p, blockCX, blockCY - blockSize / 2, blockCX + fDirX * fricLen, blockCY - blockSize / 2 + fDirY * fricLen);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(255, 100, 100);
        p.textSize(11);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('f = ' + fFriction.toFixed(1) + ' N', blockCX + fDirX * fricLen - 5, blockCY - blockSize / 2 + fDirY * fricLen);
      }

      // 4. Weight components (dashed)
      // W parallel (along incline, down)
      const wpDirX = Math.cos(angleRad);
      const wpDirY = -Math.sin(angleRad);
      const wpLen = Wparallel * arrowScale;
      p.stroke(255, 170, 0, 120);
      p.strokeWeight(1.5);
      p.drawingContext.setLineDash([4, 3]);
      drawArrow(p, blockCX, blockCY - blockSize / 2, blockCX + wpDirX * wpLen, blockCY - blockSize / 2 - wpDirY * wpLen);
      p.drawingContext.setLineDash([]);

      p.noStroke();
      p.fill(255, 170, 0, 180);
      p.textSize(9);
      p.textAlign(p.LEFT, p.TOP);
      p.text('W\u2225 = ' + Wparallel.toFixed(1) + ' N', blockCX + wpDirX * wpLen + 5, blockCY - blockSize / 2 - wpDirY * wpLen);

      // W perpendicular (into surface)
      const wnDirX = Math.sin(angleRad);
      const wnDirY = Math.cos(angleRad);
      const wnLen = Wperpendicular * arrowScale;
      p.stroke(255, 170, 0, 120);
      p.strokeWeight(1.5);
      p.drawingContext.setLineDash([4, 3]);
      drawArrow(p, blockCX, blockCY - blockSize / 2, blockCX + wnDirX * wnLen, blockCY - blockSize / 2 + wnDirY * wnLen);
      p.drawingContext.setLineDash([]);

      // === FBD diagram (isolated, on the right) ===
      const fbdX = width - 150;
      const fbdY = 100;
      const fbdSize = 120;

      p.fill(15, 15, 35, 220);
      p.stroke(60, 60, 90, 100);
      p.strokeWeight(1);
      p.rect(fbdX - fbdSize / 2 - 20, fbdY - fbdSize / 2 - 30, fbdSize + 40, fbdSize + 60, 8);

      p.noStroke();
      p.fill(200, 200, 220);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Free Body Diagram', fbdX, fbdY - fbdSize / 2 - 25);

      // Dot for object
      p.fill(0, 180, 216);
      p.ellipse(fbdX, fbdY, 12, 12);

      // FBD arrows
      const fbdScale = Math.min(1.2, 55 / Math.max(W, 1));

      // Weight down
      p.stroke(255, 170, 0);
      p.strokeWeight(2);
      drawArrow(p, fbdX, fbdY, fbdX, fbdY + W * fbdScale);
      p.noStroke();
      p.fill(255, 170, 0);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('W', fbdX + 5, fbdY + W * fbdScale);

      // Normal
      p.stroke(139, 92, 246);
      p.strokeWeight(2);
      drawArrow(p, fbdX, fbdY, fbdX + nDirX * N * fbdScale, fbdY + nDirY * N * fbdScale);
      p.noStroke();
      p.fill(139, 92, 246);
      p.text('N', fbdX + nDirX * N * fbdScale + 5, fbdY + nDirY * N * fbdScale);

      // Friction
      if (mu > 0) {
        const fDirX = -(Math.cos(angleRad));
        const fDirY = (Math.sin(angleRad));
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        drawArrow(p, fbdX, fbdY, fbdX + fDirX * fFriction * fbdScale, fbdY + fDirY * fFriction * fbdScale);
        p.noStroke();
        p.fill(255, 100, 100);
        p.text('f', fbdX + fDirX * fFriction * fbdScale - 10, fbdY + fDirY * fFriction * fbdScale);
      }

      // === Info panel ===
      const panelY = planeBottom + 15;
      p.fill(15, 15, 35, 230);
      p.stroke(60, 60, 90, 80);
      p.strokeWeight(1);
      p.rect(20, panelY, width - 40, 145, 10);

      p.noStroke();
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);

      const col1 = 35;
      const col2 = width / 2;

      p.fill(255, 170, 0);
      p.text('Weight: W = mg = ' + W.toFixed(1) + ' N', col1, panelY + 8);
      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('W\u2225 = mg sin\u03B8 = ' + Wparallel.toFixed(1) + ' N (along plane)', col1, panelY + 26);
      p.text('W\u22A5 = mg cos\u03B8 = ' + Wperpendicular.toFixed(1) + ' N (into surface)', col1, panelY + 42);

      p.fill(139, 92, 246);
      p.textSize(11);
      p.text('Normal: N = mg cos\u03B8 = ' + N.toFixed(1) + ' N', col2, panelY + 8);

      p.fill(255, 100, 100);
      p.text('Friction: f = \u03BCN = ' + fFriction.toFixed(1) + ' N', col2, panelY + 26);

      p.fill(0, 255, 136);
      p.textSize(12);
      p.text('Net Force = W\u2225 - f = ' + netForce.toFixed(1) + ' N', col1, panelY + 65);
      p.text('a = F/m = ' + accel.toFixed(2) + ' m/s\u00B2', col1, panelY + 85);

      // Status
      p.fill(netForce > 0.1 ? '#ffaa00' : '#00ff88');
      p.textSize(13);
      p.textAlign(p.CENTER, p.TOP);
      if (netForce > 0.1) {
        p.text('Block SLIDES: gravity component > friction', width / 2, panelY + 110);
      } else if (netForce < -0.1) {
        p.text('Block HELD by friction (friction > gravity component)', width / 2, panelY + 110);
      } else {
        p.text('Block at equilibrium: forces balance!', width / 2, panelY + 110);
      }

      // Critical angle
      const critAngle = Math.atan(mu) * 180 / Math.PI;
      p.fill(200, 200, 220, 150);
      p.textSize(10);
      p.text('Critical angle (tan\u207B\u00B9\u03BC) = ' + critAngle.toFixed(1) + '\u00B0 \u2014 block slides above this angle', width / 2, panelY + 130);
    };

    function drawArrow(p, x1, y1, x2, y2) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      if (len < 3) return;
      p.line(x1, y1, x2, y2);
      p.line(x2, y2, x2 - 8 * Math.cos(angle - 0.35), y2 - 8 * Math.sin(angle - 0.35));
      p.line(x2, y2, x2 - 8 * Math.cos(angle + 0.35), y2 - 8 * Math.sin(angle + 0.35));
    }

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        blockPos = 0.3;
        blockVel = 0;
        simTime = 0;
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { angle: 30, mass: 5, friction: 0.3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'angle', label: 'Incline Angle (\u03B8)', min: 0, max: 60, step: 1, value: 30, unit: '\u00B0' },
    { name: 'mass', label: 'Mass', min: 1, max: 20, step: 0.5, value: 5, unit: 'kg' },
    { name: 'friction', label: 'Friction (\u03BC)', min: 0, max: 1, step: 0.01, value: 0.3, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
