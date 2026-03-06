// Chapter 14: Magnetic Fields — Bar Magnet with Compass & Iron Filings
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'magnetic-fields';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    // Iron filings
    let filings = [];
    const numFilings = 600;

    // Movable compass
    let compassX, compassY;
    let draggingCompass = false;
    let dragOff = { x: 0, y: 0 };

    function initFilings() {
      filings = [];
      for (let i = 0; i < numFilings; i++) {
        filings.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: 0,
          len: Math.random() * 4 + 3
        });
      }
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      compassX = width * 0.7;
      compassY = height * 0.3;
      initFilings();
    };

    // Magnetic dipole field: simplified 2D
    function calcBField(px, py, magStrength) {
      const mx = width / 2;
      const my = height / 2;
      const poleOffset = 40;

      // North pole at left of magnet, south at right (conventional)
      const nPoleX = mx - poleOffset;
      const nPoleY = my;
      const sPoleX = mx + poleOffset;
      const sPoleY = my;

      let bx = 0, by = 0;

      // North pole (source of field lines) - positive monopole
      let dx = px - nPoleX;
      let dy = py - nPoleY;
      let r2 = dx * dx + dy * dy;
      let r = Math.sqrt(r2);
      if (r > 5) {
        const b = magStrength / r2;
        bx += b * dx / r;
        by += b * dy / r;
      }

      // South pole (sink of field lines) - negative monopole
      dx = px - sPoleX;
      dy = py - sPoleY;
      r2 = dx * dx + dy * dy;
      r = Math.sqrt(r2);
      if (r > 5) {
        const b = magStrength / r2;
        bx -= b * dx / r;
        by -= b * dy / r;
      }

      return { x: bx, y: by };
    }

    p.draw = () => {
      p.background(10, 10, 26);

      if (engine.isPlaying) time += 0.016 * engine.speed;

      const magStrength = engine.getParam('magnetStrength');
      const mx = width / 2;
      const my = height / 2;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Magnetic Fields: Bar Magnet', width / 2, 10);
      p.textSize(11);
      p.fill(200, 200, 220, 160);
      p.text('Drag the compass around the magnet', width / 2, 30);

      // Draw field lines from north to south
      const numLines = Math.min(14, Math.max(6, magStrength * 2));
      for (let i = 0; i < numLines; i++) {
        const startAngle = (i / numLines) * p.TWO_PI;
        let px = mx - 40 + Math.cos(startAngle) * 15;
        let py = my + Math.sin(startAngle) * 15;

        p.noFill();
        p.stroke(139, 92, 246, 50);
        p.strokeWeight(1.5);
        p.beginShape();
        p.vertex(px, py);

        for (let s = 0; s < 200; s++) {
          const b = calcBField(px, py, magStrength);
          const mag = Math.sqrt(b.x * b.x + b.y * b.y);
          if (mag < 0.00001) break;
          const step = 3;
          px += step * b.x / mag;
          py += step * b.y / mag;
          if (px < 0 || px > width || py < 0 || py > height) break;

          // Stop near south pole
          const dSouth = Math.sqrt((px - (mx + 40)) ** 2 + (py - my) ** 2);
          p.vertex(px, py);
          if (dSouth < 12) break;
        }
        p.endShape();
      }

      // Update and draw iron filings
      for (const f of filings) {
        const b = calcBField(f.x, f.y, magStrength);
        const targetAngle = Math.atan2(b.y, b.x);
        f.angle = targetAngle;

        const mag = Math.sqrt(b.x * b.x + b.y * b.y);
        const alpha = Math.min(200, mag * 800 + 20);

        p.stroke(180, 180, 200, alpha);
        p.strokeWeight(1);
        const dx = Math.cos(f.angle) * f.len;
        const dy = Math.sin(f.angle) * f.len;
        p.line(f.x - dx, f.y - dy, f.x + dx, f.y + dy);
      }

      // Draw bar magnet
      const magW = 100;
      const magH = 36;
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#8b5cf6';

      // North half (red)
      p.fill(200, 60, 60);
      p.stroke(220, 80, 80);
      p.strokeWeight(1);
      p.rect(mx - magW / 2, my - magH / 2, magW / 2, magH, 6, 0, 0, 6);

      // South half (blue)
      p.fill(60, 100, 200);
      p.stroke(80, 120, 220);
      p.rect(mx, my - magH / 2, magW / 2, magH, 0, 6, 6, 0);
      p.drawingContext.shadowBlur = 0;

      // Labels
      p.noStroke();
      p.fill(255);
      p.textSize(18);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('N', mx - magW / 4, my);
      p.text('S', mx + magW / 4, my);

      // --- Compass ---
      const b = calcBField(compassX, compassY, magStrength);
      const compassAngle = Math.atan2(b.y, b.x);
      const compassR = 28;

      // Compass body
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(20, 20, 40, 240);
      p.stroke(139, 92, 246, 150);
      p.strokeWeight(2);
      p.ellipse(compassX, compassY, compassR * 2 + 8, compassR * 2 + 8);
      p.drawingContext.shadowBlur = 0;

      // Compass needle
      p.push();
      p.translate(compassX, compassY);
      p.rotate(compassAngle);

      // Red north-seeking end
      p.fill(255, 60, 60);
      p.noStroke();
      p.triangle(compassR - 4, 0, -4, -5, -4, 5);

      // White south end
      p.fill(220, 220, 240);
      p.triangle(-compassR + 4, 0, 4, -5, 4, 5);

      // Center dot
      p.fill(139, 92, 246);
      p.ellipse(0, 0, 6, 6);
      p.pop();

      // Compass label
      p.fill(200, 200, 220);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Compass', compassX, compassY + compassR + 14);

      // Cardinal directions on compass
      p.fill(100, 100, 120);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('N', compassX, compassY - compassR - 4);
      p.text('S', compassX, compassY + compassR + 4);
      p.text('E', compassX + compassR + 4, compassY);
      p.text('W', compassX - compassR - 4, compassY);

      // Info panel
      const panelX = width - 210;
      const panelY = 50;
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 200, 130, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Magnetic Field', panelX + 10, panelY + 8);

      const bMag = Math.sqrt(b.x * b.x + b.y * b.y);
      const angleDeg = ((compassAngle * 180 / Math.PI) + 360) % 360;
      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Strength: ' + magStrength.toFixed(1) + ' T', panelX + 10, panelY + 30);
      p.text('|B| at compass: ' + (bMag * 100).toFixed(2), panelX + 10, panelY + 48);
      p.text('Needle angle: ' + angleDeg.toFixed(1) + '°', panelX + 10, panelY + 66);
      p.fill(139, 92, 246);
      p.text('B lines: N \u2192 S (outside)', panelX + 10, panelY + 84);
      p.text('B lines: S → N (inside)', panelX + 10, panelY + 102);

      // Bottom
      p.fill(139, 92, 246, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Field lines flow from North to South outside the magnet', width / 2, height - 8);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      const d = Math.sqrt((p.mouseX - compassX) ** 2 + (p.mouseY - compassY) ** 2);
      if (d < 35) {
        draggingCompass = true;
        dragOff.x = compassX - p.mouseX;
        dragOff.y = compassY - p.mouseY;
      }
    };

    p.mouseDragged = () => {
      if (draggingCompass) {
        compassX = p.mouseX + dragOff.x;
        compassY = p.mouseY + dragOff.y;
      }
    };

    p.mouseReleased = () => { draggingCompass = false; };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      initFilings();
    };
  }, { magnetStrength: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'magnetStrength', label: 'Magnet Strength', min: 1, max: 10, step: 0.5, value: 5, unit: 'T' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
