// Chapter 3: Newton's First Law — Inertia and Friction
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'newtons-first-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Object state
    let objX = 100;
    let objVx = 0;
    let pushing = false;
    let pushTime = 0;
    let trail = [];
    let forceHistory = [];

    const surfaceY = 300;
    const objSize = 50;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const friction = engine.getParam('friction');
      const pushForce = engine.getParam('pushForce');
      const mass = engine.getParam('mass');

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Newton's First Law: Inertia", width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click and hold to push the block | Release to observe inertia', width / 2, 28);

      // Physics
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;

        let netForce = 0;
        let appliedForce = 0;
        let frictionForce = 0;

        // Applied force
        if (pushing) {
          appliedForce = pushForce;
          pushTime += dt;
        }

        // Friction (kinetic friction opposes motion)
        if (Math.abs(objVx) > 0.01) {
          const normalForce = mass * 9.81;
          frictionForce = friction * normalForce * (objVx > 0 ? -1 : 1);
        } else if (pushing) {
          // Static friction (simplified: same coefficient)
          const maxStaticFriction = friction * mass * 9.81;
          if (Math.abs(appliedForce) > maxStaticFriction) {
            frictionForce = -maxStaticFriction * Math.sign(appliedForce);
          } else {
            frictionForce = -appliedForce; // no motion
          }
        }

        netForce = appliedForce + frictionForce;
        const accel = netForce / mass;
        objVx += accel * dt;

        // If friction would reverse direction, stop
        if (!pushing && Math.abs(objVx) < 0.05) {
          objVx = 0;
        }

        objX += objVx * 3 * dt; // scaled for visual

        // Wrap
        if (objX > width + objSize) objX = -objSize;
        if (objX < -objSize) objX = width + objSize;

        // Trail
        trail.push({ x: objX, t: p.frameCount });
        if (trail.length > 120) trail.shift();

        // Force history for display
        forceHistory.push({ applied: appliedForce, friction: frictionForce, net: netForce });
        if (forceHistory.length > 200) forceHistory.shift();
      }

      // Surface with friction texture
      const textureDensity = Math.floor(friction * 50);
      p.fill(30, 25, 20);
      p.noStroke();
      p.rect(0, surfaceY, width, height - surfaceY);

      // Friction texture dots
      p.fill(50, 45, 35);
      for (let i = 0; i < textureDensity; i++) {
        const tx = (i * 37 + p.frameCount * 0.01) % width;
        const ty = surfaceY + 5 + (i * 13) % (height - surfaceY - 10);
        p.ellipse(tx, ty, 2, 2);
      }

      // Surface line
      p.stroke(0, 255, 136, 100);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ff88';
      p.line(0, surfaceY, width, surfaceY);
      p.drawingContext.shadowBlur = 0;

      // Friction label
      p.noStroke();
      p.fill(100, 100, 130);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text(friction === 0 ? 'Frictionless surface (ice)' : '\u03BC = ' + friction.toFixed(2), 10, surfaceY + 5);

      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 80;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x + objSize / 2, surfaceY, 3, 3);
      }

      // Block
      const objY = surfaceY - objSize;
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 140, 190);
      p.stroke(0, 180, 216);
      p.strokeWeight(1);
      p.rect(objX, objY, objSize, objSize, 4);
      p.drawingContext.shadowBlur = 0;

      // Mass label on block
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(mass.toFixed(0) + 'kg', objX + objSize / 2, objY + objSize / 2);

      // === Force vectors ===
      const arrowY = objY + objSize / 2;
      const forceScale = 1.5;

      // Applied force (when pushing)
      if (pushing) {
        const fLen = pushForce * forceScale;
        p.stroke(0, 255, 136);
        p.strokeWeight(3);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#00ff88';
        p.line(objX - 5, arrowY, objX - 5 - fLen * 0.5, arrowY);
        // Push indicator
        p.line(objX - 5, arrowY, objX + fLen * 0.5, arrowY);
        const aEndX = objX + fLen * 0.5;
        p.line(aEndX, arrowY, aEndX - 8, arrowY - 5);
        p.line(aEndX, arrowY, aEndX - 8, arrowY + 5);
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('F = ' + pushForce.toFixed(0) + ' N', objX + objSize / 2, arrowY - 30);
      }

      // Friction force
      if (Math.abs(objVx) > 0.01 || pushing) {
        const normalForce = mass * 9.81;
        const fFric = friction * normalForce;
        if (fFric > 0.1) {
          const fDir = objVx > 0.01 ? -1 : (objVx < -0.01 ? 1 : (pushing ? -1 : 0));
          if (fDir !== 0) {
            const fLen = fFric * forceScale * fDir;
            p.stroke(255, 100, 100);
            p.strokeWeight(2.5);
            p.drawingContext.shadowBlur = 8;
            p.drawingContext.shadowColor = '#ff6464';
            const startFX = fDir > 0 ? objX : objX + objSize;
            p.line(startFX, arrowY + 5, startFX + fLen * 0.5, arrowY + 5);
            const fEndX = startFX + fLen * 0.5;
            p.line(fEndX, arrowY + 5, fEndX - fDir * 6, arrowY);
            p.line(fEndX, arrowY + 5, fEndX - fDir * 6, arrowY + 10);
            p.drawingContext.shadowBlur = 0;

            p.noStroke();
            p.fill(255, 100, 100);
            p.textSize(10);
            p.textAlign(p.CENTER, p.TOP);
            p.text('f = ' + fFric.toFixed(1) + ' N', objX + objSize / 2, arrowY + 15);
          }
        }
      }

      // Normal force
      p.stroke(139, 92, 246);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#8b5cf6';
      const nLen = Math.min(mass * 2, 50);
      p.line(objX + objSize / 2, objY, objX + objSize / 2, objY - nLen);
      p.line(objX + objSize / 2, objY - nLen, objX + objSize / 2 - 4, objY - nLen + 6);
      p.line(objX + objSize / 2, objY - nLen, objX + objSize / 2 + 4, objY - nLen + 6);
      p.drawingContext.shadowBlur = 0;

      // Weight
      p.stroke(255, 170, 0);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ffaa00';
      p.line(objX + objSize / 2, surfaceY, objX + objSize / 2, surfaceY + nLen);
      p.line(objX + objSize / 2, surfaceY + nLen, objX + objSize / 2 - 4, surfaceY + nLen - 6);
      p.line(objX + objSize / 2, surfaceY + nLen, objX + objSize / 2 + 4, surfaceY + nLen - 6);
      p.drawingContext.shadowBlur = 0;

      // Velocity display
      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('v = ' + objVx.toFixed(2) + ' m/s', 15, 50);

      // Inertia message
      if (!pushing && Math.abs(objVx) > 0.1) {
        p.fill(255, 200, 50, 200);
        p.textSize(13);
        p.textAlign(p.CENTER, p.TOP);
        if (friction === 0) {
          p.text('No friction! The object continues at constant velocity forever (inertia).', width / 2, 70);
        } else {
          p.text('Friction gradually slows the object. Without friction, it would never stop.', width / 2, 70);
        }
      } else if (!pushing && Math.abs(objVx) <= 0.1 && trail.length > 5) {
        p.fill(200, 200, 220, 150);
        p.textSize(12);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Object at rest stays at rest (inertia). Push it!', width / 2, 70);
      }

      // === Force diagram mini panel ===
      const fdX = width - 190;
      const fdY = 50;
      p.fill(15, 15, 35, 230);
      p.stroke(60, 60, 90, 80);
      p.strokeWeight(1);
      p.rect(fdX, fdY, 175, 120, 8);

      p.noStroke();
      p.fill(255, 255, 255, 180);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Forces:', fdX + 10, fdY + 8);

      p.fill(0, 255, 136);
      p.textSize(10);
      p.text('Applied: ' + (pushing ? pushForce.toFixed(0) : '0') + ' N', fdX + 10, fdY + 28);

      p.fill(255, 100, 100);
      const currentFric = friction * mass * 9.81;
      p.text('Friction: ' + (Math.abs(objVx) > 0.01 || pushing ? currentFric.toFixed(1) : '0') + ' N', fdX + 10, fdY + 44);

      p.fill(139, 92, 246);
      p.text('Normal: ' + (mass * 9.81).toFixed(1) + ' N \u2191', fdX + 10, fdY + 60);

      p.fill(255, 170, 0);
      p.text('Weight: ' + (mass * 9.81).toFixed(1) + ' N \u2193', fdX + 10, fdY + 76);

      const netF = pushing ? pushForce - currentFric : (Math.abs(objVx) > 0.01 ? -currentFric * Math.sign(objVx) : 0);
      p.fill(255, 255, 255);
      p.textSize(11);
      p.text('\u03A3F = ' + netF.toFixed(1) + ' N', fdX + 10, fdY + 98);

      // Newton's First Law statement
      p.fill(139, 92, 246, 200);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('"An object at rest stays at rest, and an object in motion stays in motion,', width / 2, height - 20);
      p.text('unless acted upon by an unbalanced external force."', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        pushing = true;
        pushTime = 0;
      }
    };

    p.mouseReleased = () => {
      pushing = false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { friction: 0.3, pushForce: 50, mass: 10 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'friction', label: 'Friction (\u03BC)', min: 0, max: 1, step: 0.01, value: 0.3, unit: '' },
    { name: 'pushForce', label: 'Push Force', min: 0, max: 100, step: 1, value: 50, unit: 'N' },
    { name: 'mass', label: 'Mass', min: 1, max: 50, step: 1, value: 10, unit: 'kg' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
