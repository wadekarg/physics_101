// Chapter 3: Newton's Third Law — Action/Reaction Skaters & Rocket
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'newtons-third-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Skater state
    let skater1X, skater2X;
    let skater1Vx = 0, skater2Vx = 0;
    let pushed = false;
    let pushAnimTime = 0;
    let simTime = 0;

    // Rocket state
    let rocketY, rocketVy = 0;
    let exhaustParticles = [];
    let rocketMode = false;

    const iceY = 280;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      resetSim();
    };

    function resetSim() {
      skater1X = width / 2 - 30;
      skater2X = width / 2 + 30;
      skater1Vx = 0;
      skater2Vx = 0;
      pushed = false;
      pushAnimTime = 0;
      simTime = 0;
      rocketY = iceY - 50;
      rocketVy = 0;
      exhaustParticles = [];
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const mass1 = engine.getParam('mass1');
      const mass2 = engine.getParam('mass2');
      const pushForce = engine.getParam('pushForce');

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Newton's Third Law: Action & Reaction", width / 2, 8);

      // Mode toggle button
      const btnX = width - 180;
      const btnY = 10;
      const btnHover = p.mouseX > btnX && p.mouseX < btnX + 160 && p.mouseY > btnY && p.mouseY < btnY + 28;
      p.fill(btnHover ? 40 : 25, btnHover ? 40 : 25, btnHover ? 60 : 45);
      p.stroke(139, 92, 246, btnHover ? 255 : 120);
      p.strokeWeight(1);
      p.rect(btnX, btnY, 160, 28, 5);
      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(rocketMode ? 'Switch: Skaters' : 'Switch: Rocket', btnX + 80, btnY + 14);

      if (!rocketMode) {
        // === SKATER MODE ===
        p.fill(200, 200, 220, 150);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Click to push the skaters apart', width / 2, 30);

        // Physics
        if (engine.isPlaying && pushed) {
          const dt = (1 / 60) * engine.speed;
          simTime += dt;
          pushAnimTime += dt;

          // During push (short impulse)
          if (pushAnimTime < 0.3) {
            const a1 = pushForce / mass1; // force on skater 1 (pushed right... wait, pushed left)
            const a2 = -pushForce / mass2; // reaction on skater 2 (pushed right)
            // Actually: skater1 pushes skater2 right, so skater1 goes left, skater2 goes right
            skater1Vx -= (pushForce / mass1) * dt;
            skater2Vx += (pushForce / mass2) * dt;
          }

          skater1X += skater1Vx * 60 * dt;
          skater2X += skater2Vx * 60 * dt;
        }

        // Ice surface
        p.fill(30, 50, 70, 100);
        p.noStroke();
        p.rect(0, iceY, width, height - iceY);
        p.stroke(100, 200, 255, 60);
        p.strokeWeight(1);
        p.line(0, iceY, width, iceY);

        // Skater 1 (left, blue)
        drawSkater(p, skater1X, iceY, mass1, '#00b4d8', 'A', mass1);

        // Skater 2 (right, purple)
        drawSkater(p, skater2X, iceY, mass2, '#8b5cf6', 'B', mass2);

        // Force arrows during push
        if (pushed && pushAnimTime < 0.5) {
          const fScale = pushForce * 0.8;
          const midX = (skater1X + skater2X) / 2;
          const arrowY = iceY - 50;

          // Action: Skater A pushes B to the right
          p.stroke(0, 255, 136);
          p.strokeWeight(2.5);
          p.drawingContext.shadowBlur = 10;
          p.drawingContext.shadowColor = '#00ff88';
          p.line(midX, arrowY, midX + fScale * 0.5, arrowY);
          p.line(midX + fScale * 0.5, arrowY, midX + fScale * 0.5 - 8, arrowY - 5);
          p.line(midX + fScale * 0.5, arrowY, midX + fScale * 0.5 - 8, arrowY + 5);
          p.drawingContext.shadowBlur = 0;
          p.noStroke();
          p.fill(0, 255, 136);
          p.textSize(10);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text('Action: F = ' + pushForce.toFixed(0) + ' N \u2192', midX + fScale * 0.25, arrowY - 5);

          // Reaction: B pushes A to the left
          p.stroke(255, 100, 100);
          p.strokeWeight(2.5);
          p.drawingContext.shadowBlur = 10;
          p.drawingContext.shadowColor = '#ff6464';
          p.line(midX, arrowY + 25, midX - fScale * 0.5, arrowY + 25);
          p.line(midX - fScale * 0.5, arrowY + 25, midX - fScale * 0.5 + 8, arrowY + 20);
          p.line(midX - fScale * 0.5, arrowY + 25, midX - fScale * 0.5 + 8, arrowY + 30);
          p.drawingContext.shadowBlur = 0;
          p.noStroke();
          p.fill(255, 100, 100);
          p.textAlign(p.CENTER, p.TOP);
          p.text('\u2190 Reaction: F = ' + pushForce.toFixed(0) + ' N', midX - fScale * 0.25, arrowY + 30);
        }

        // Velocity arrows
        if (pushed && Math.abs(skater1Vx) > 0.01) {
          const v1Arrow = skater1Vx * 30;
          p.stroke(0, 180, 216);
          p.strokeWeight(2);
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#00b4d8';
          p.line(skater1X, iceY + 20, skater1X + v1Arrow, iceY + 20);
          p.drawingContext.shadowBlur = 0;

          const v2Arrow = skater2Vx * 30;
          p.stroke(139, 92, 246);
          p.line(skater2X, iceY + 20, skater2X + v2Arrow, iceY + 20);
        }

        // Info panel
        const panelY = iceY + 40;
        p.fill(15, 15, 35, 230);
        p.stroke(60, 60, 90, 80);
        p.strokeWeight(1);
        p.rect(20, panelY, width - 40, 120, 10);

        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);

        const halfW = (width - 60) / 2;

        // Skater A
        p.fill(0, 180, 216);
        p.textSize(12);
        p.text('Skater A', 35, panelY + 8);
        p.fill(200, 200, 220);
        p.textSize(10);
        p.text('Mass: ' + mass1.toFixed(0) + ' kg', 35, panelY + 26);
        p.text('Velocity: ' + skater1Vx.toFixed(3) + ' m/s', 35, panelY + 42);
        p.text('Momentum: ' + (mass1 * skater1Vx).toFixed(2) + ' kg\u00B7m/s', 35, panelY + 58);
        p.text('KE: ' + (0.5 * mass1 * skater1Vx * skater1Vx).toFixed(2) + ' J', 35, panelY + 74);

        // Skater B
        p.fill(139, 92, 246);
        p.textSize(12);
        p.text('Skater B', 35 + halfW, panelY + 8);
        p.fill(200, 200, 220);
        p.textSize(10);
        p.text('Mass: ' + mass2.toFixed(0) + ' kg', 35 + halfW, panelY + 26);
        p.text('Velocity: ' + skater2Vx.toFixed(3) + ' m/s', 35 + halfW, panelY + 42);
        p.text('Momentum: ' + (mass2 * skater2Vx).toFixed(2) + ' kg\u00B7m/s', 35 + halfW, panelY + 58);
        p.text('KE: ' + (0.5 * mass2 * skater2Vx * skater2Vx).toFixed(2) + ' J', 35 + halfW, panelY + 74);

        // Total momentum
        const totalP = mass1 * skater1Vx + mass2 * skater2Vx;
        p.fill(255, 200, 50);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Total Momentum = ' + totalP.toFixed(4) + ' kg\u00B7m/s (conserved \u2248 0)', width / 2, panelY + 98);

      } else {
        // === ROCKET MODE ===
        p.fill(200, 200, 220, 150);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Click to fire rocket (Third Law: exhaust gas goes down, rocket goes up)', width / 2, 30);

        // Physics
        if (engine.isPlaying && pushed) {
          const dt = (1 / 60) * engine.speed;
          simTime += dt;

          if (simTime < 3) {
            rocketVy -= (pushForce / mass1) * dt * 0.5;
            // Add exhaust particles
            if (p.frameCount % 2 === 0) {
              exhaustParticles.push({
                x: width / 2 + (Math.random() - 0.5) * 10,
                y: rocketY + 30,
                vx: (Math.random() - 0.5) * 2,
                vy: 3 + Math.random() * 3,
                life: 1
              });
            }
          }

          rocketY += rocketVy;

          // Update exhaust
          exhaustParticles.forEach(ep => {
            ep.x += ep.vx;
            ep.y += ep.vy;
            ep.life -= 0.015;
          });
          exhaustParticles = exhaustParticles.filter(ep => ep.life > 0);
        }

        // Ground
        p.fill(30, 30, 20);
        p.noStroke();
        p.rect(0, iceY, width, height - iceY);
        p.stroke(100, 100, 80, 100);
        p.strokeWeight(1);
        p.line(0, iceY, width, iceY);

        // Exhaust particles
        for (const ep of exhaustParticles) {
          p.noStroke();
          const alpha = ep.life * 255;
          p.fill(255, 150 * ep.life, 50, alpha);
          p.drawingContext.shadowBlur = 8;
          p.drawingContext.shadowColor = `rgba(255, 100, 0, ${ep.life})`;
          p.ellipse(ep.x, ep.y, 6 * ep.life, 6 * ep.life);
          p.drawingContext.shadowBlur = 0;
        }

        // Rocket
        const rx = width / 2;
        p.push();
        p.translate(rx, rocketY);

        // Body
        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = '#00b4d8';
        p.fill(60, 80, 120);
        p.stroke(0, 180, 216);
        p.strokeWeight(1);
        p.beginShape();
        p.vertex(0, -30);
        p.vertex(-12, 0);
        p.vertex(-12, 30);
        p.vertex(12, 30);
        p.vertex(12, 0);
        p.endShape(p.CLOSE);
        p.drawingContext.shadowBlur = 0;

        // Fins
        p.fill(0, 180, 216);
        p.noStroke();
        p.triangle(-12, 25, -22, 35, -12, 15);
        p.triangle(12, 25, 22, 35, 12, 15);

        // Window
        p.fill(100, 200, 255, 150);
        p.ellipse(0, -5, 10, 10);

        // Thrust arrow (down - reaction force on exhaust)
        if (pushed && simTime < 3) {
          p.stroke(255, 170, 50);
          p.strokeWeight(2);
          p.drawingContext.shadowBlur = 10;
          p.drawingContext.shadowColor = '#ffaa32';
          p.line(0, 35, 0, 65);
          p.line(0, 65, -5, 58);
          p.line(0, 65, 5, 58);
          p.drawingContext.shadowBlur = 0;

          p.noStroke();
          p.fill(255, 170, 50);
          p.textSize(9);
          p.textAlign(p.LEFT, p.CENTER);
          p.text('Exhaust: F\u2193', 18, 50);

          // Upward force arrow
          p.stroke(0, 255, 136);
          p.strokeWeight(2);
          p.drawingContext.shadowBlur = 10;
          p.drawingContext.shadowColor = '#00ff88';
          p.line(0, -35, 0, -65);
          p.line(0, -65, -5, -58);
          p.line(0, -65, 5, -58);
          p.drawingContext.shadowBlur = 0;

          p.noStroke();
          p.fill(0, 255, 136);
          p.textSize(9);
          p.textAlign(p.LEFT, p.CENTER);
          p.text('Thrust: F\u2191', 18, -50);
        }

        p.pop();

        // Info
        p.fill(15, 15, 35, 230);
        p.stroke(60, 60, 90, 80);
        p.strokeWeight(1);
        p.rect(20, iceY + 15, width - 40, 55, 8);
        p.noStroke();
        p.fill(200, 200, 220);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Rocket pushes exhaust gas DOWN (action) \u2192 Gas pushes rocket UP (reaction)', width / 2, iceY + 22);
        p.text('Velocity: ' + Math.abs(rocketVy).toFixed(2) + ' m/s   |   Same force, different masses = different accelerations', width / 2, iceY + 42);
      }

      // Law statement
      p.fill(139, 92, 246, 180);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('"For every action, there is an equal and opposite reaction." \u2014 F\u2081\u2082 = -F\u2082\u2081', width / 2, height - 5);
    };

    function drawSkater(p, x, y, mass, color, label, m) {
      const size = 15 + m * 0.15;
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = color;

      // Body
      p.fill(color);
      p.noStroke();
      p.ellipse(x, y - size * 2, size, size); // head
      p.rect(x - size / 2, y - size * 1.5, size, size * 1.2, 3); // body

      // Legs
      p.strokeWeight(2);
      p.stroke(color);
      p.line(x - size / 3, y - size * 0.3, x - size / 2, y);
      p.line(x + size / 3, y - size * 0.3, x + size / 2, y);
      p.drawingContext.shadowBlur = 0;

      // Label
      p.noStroke();
      p.fill(255);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, x, y - size * 2);
      p.fill(color);
      p.textSize(9);
      p.text(m.toFixed(0) + 'kg', x, y - size * 0.8);
    }

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Check mode toggle button
      const btnX = width - 180;
      if (p.mouseX > btnX && p.mouseX < btnX + 160 && p.mouseY > 10 && p.mouseY < 38) {
        rocketMode = !rocketMode;
        resetSim();
        return;
      }

      if (!pushed) {
        pushed = true;
        simTime = 0;
      } else {
        resetSim();
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mass1: 60, mass2: 90, pushForce: 100 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mass1', label: 'Mass A', min: 20, max: 100, step: 5, value: 60, unit: 'kg' },
    { name: 'mass2', label: 'Mass B', min: 20, max: 100, step: 5, value: 90, unit: 'kg' },
    { name: 'pushForce', label: 'Push Force', min: 10, max: 200, step: 5, value: 100, unit: 'N' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
