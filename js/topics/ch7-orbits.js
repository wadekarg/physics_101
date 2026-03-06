// Orbital Mechanics — Kepler's Laws visualization
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'orbital-mechanics';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let angle = 0;
    let trailPoints = [];
    let sweptArea = [];
    let areaTimer = 0;
    const maxTrail = 600;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const cx = width / 2;
      const cy = height / 2;
      const ecc = engine.getParam('eccentricity');
      const speedFactor = engine.getParam('orbitalSpeed');
      const a = Math.min(width, height) * 0.35;
      const b = a * Math.sqrt(1 - ecc * ecc);
      const c = a * ecc;

      // Draw orbit ellipse
      p.push();
      p.translate(cx, cy);
      p.noFill();
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.ellipse(c, 0, a * 2, b * 2);

      // Sun at focus
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#ffaa00';
      p.fill(255, 170, 0);
      p.noStroke();
      p.ellipse(0, 0, 24, 24);
      p.drawingContext.shadowBlur = 0;

      // Planet position (parametric ellipse with focus offset)
      const r = (a * (1 - ecc * ecc)) / (1 + ecc * Math.cos(angle));
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);

      // Kepler's 2nd law: equal areas in equal times
      // dθ/dt ∝ 1/r² for equal area sweeping
      if (engine.isPlaying) {
        const dt = (1 / 60) * speedFactor;
        const dTheta = (a * b * 0.02 * dt) / (r * r);
        angle += dTheta;
        if (angle > Math.PI * 2) angle -= Math.PI * 2;

        trailPoints.push({ x: px, y: py });
        if (trailPoints.length > maxTrail) trailPoints.shift();

        // Swept area visualization
        areaTimer += dt;
        if (areaTimer < 2) {
          sweptArea.push({ x: px, y: py });
        } else if (areaTimer > 4) {
          areaTimer = 0;
          sweptArea = [{ x: px, y: py }];
        }
      }

      // Draw swept area
      if (sweptArea.length > 2) {
        p.fill(0, 180, 216, 30);
        p.noStroke();
        p.beginShape();
        p.vertex(0, 0);
        for (const pt of sweptArea) p.vertex(pt.x, pt.y);
        p.vertex(0, 0);
        p.endShape(p.CLOSE);
      }

      // Draw trail
      for (let i = 1; i < trailPoints.length; i++) {
        const alpha = (i / trailPoints.length) * 150;
        p.stroke(0, 180, 216, alpha);
        p.strokeWeight(2);
        p.line(trailPoints[i - 1].x, trailPoints[i - 1].y, trailPoints[i].x, trailPoints[i].y);
      }

      // Draw planet
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.ellipse(px, py, 16, 16);
      p.drawingContext.shadowBlur = 0;

      // Velocity vector (tangent to orbit)
      const vAngle = angle + Math.PI / 2;
      const vMag = 40 * (a * b * 0.02) / (r * r) * 500;
      const vx = Math.cos(vAngle) * Math.min(vMag, 60);
      const vy = Math.sin(vAngle) * Math.min(vMag, 60);
      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      drawArrow(p, px, py, px + vx, py + vy);

      p.pop();

      // Info overlay
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Eccentricity: ${ecc.toFixed(2)}`, 15, 25);
      p.text(`Distance from Sun: ${r.toFixed(0)} units`, 15, 45);
      p.text(`Semi-major axis: ${a.toFixed(0)}`, 15, 65);
      p.fill(0, 255, 136, 200);
      p.text('Green = velocity (faster when closer!)', 15, 90);
      p.fill(0, 180, 216, 200);
      p.text('Blue area = equal area swept in equal time', 15, 110);
    };

    function drawArrow(p, x1, y1, x2, y2) {
      p.line(x1, y1, x2, y2);
      const a = Math.atan2(y2 - y1, x2 - x1);
      const sz = 8;
      p.line(x2, y2, x2 - sz * Math.cos(a - 0.4), y2 - sz * Math.sin(a - 0.4));
      p.line(x2, y2, x2 - sz * Math.cos(a + 0.4), y2 - sz * Math.sin(a + 0.4));
    }

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { eccentricity: 0.5, orbitalSpeed: 1.5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'eccentricity', label: 'Eccentricity', min: 0, max: 0.9, step: 0.01, value: 0.5, unit: '' },
    { name: 'orbitalSpeed', label: 'Speed', min: 0.5, max: 3, step: 0.1, value: 1.5, unit: 'x' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
