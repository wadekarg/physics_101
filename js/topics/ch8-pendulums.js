// Chapter 8: Pendulums — Simple Pendulum Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'pendulums';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let angle = 0;
    let angularVelocity = 0;
    let time = 0;
    let trail = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
      angle = engine.getParam('initialAngle') * Math.PI / 180;
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const len = engine.getParam('length');
      const g = engine.getParam('gravity');
      const damp = engine.getParam('damping');
      const initAngleDeg = engine.getParam('initialAngle');

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Physics: pendulum equation  α = -(g/L)*sin(θ) - damping*ω
        const angularAccel = -(g / (len * 0.01)) * Math.sin(angle) - damp * angularVelocity;
        angularVelocity += angularAccel * dt;
        angle += angularVelocity * dt;

        trail.push({ t: time, a: angle * 180 / Math.PI });
        if (trail.length > 300) trail.shift();
      }

      const pivotX = width * 0.35;
      const pivotY = 60;
      const bobX = pivotX + len * Math.sin(angle);
      const bobY = pivotY + len * Math.cos(angle);
      const bobRadius = 18;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Simple Pendulum', width / 2, 8);

      // Draw pivot mount
      p.fill(80, 80, 100);
      p.noStroke();
      p.rect(pivotX - 30, pivotY - 15, 60, 15, 3);
      p.fill(120, 120, 140);
      p.ellipse(pivotX, pivotY, 10, 10);

      // Draw string
      p.stroke(200, 200, 220);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#aaaaff';
      p.line(pivotX, pivotY, bobX, bobY);
      p.drawingContext.shadowBlur = 0;

      // Draw angle arc
      if (Math.abs(angle) > 0.02) {
        p.noFill();
        p.stroke(0, 255, 200, 150);
        p.strokeWeight(1.5);
        const arcR = 40;
        const startA = Math.PI / 2 - Math.abs(angle);
        const endA = Math.PI / 2;
        if (angle > 0) {
          p.arc(pivotX, pivotY, arcR * 2, arcR * 2, Math.PI / 2 - 0.01, Math.PI / 2 + angle);
        } else {
          p.arc(pivotX, pivotY, arcR * 2, arcR * 2, Math.PI / 2 + angle, Math.PI / 2 + 0.01);
        }
        p.noStroke();
        p.fill(0, 255, 200);
        p.textSize(11);
        p.textAlign(p.CENTER, p.CENTER);
        p.text((angle * 180 / Math.PI).toFixed(1) + '\u00B0', pivotX + 55 * Math.sin(angle / 2), pivotY + 55 * Math.cos(angle / 2));
      }

      // Draw vertical reference
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([3, 3]);
      p.line(pivotX, pivotY, pivotX, pivotY + len + 30);
      p.drawingContext.setLineDash([]);

      // Draw bob with glow
      p.drawingContext.shadowBlur = 25;
      p.drawingContext.shadowColor = '#ff6090';
      p.fill(255, 80, 130);
      p.noStroke();
      p.ellipse(bobX, bobY, bobRadius * 2, bobRadius * 2);
      p.drawingContext.shadowBlur = 8;
      p.fill(255, 140, 180);
      p.ellipse(bobX - bobRadius * 0.25, bobY - bobRadius * 0.25, bobRadius * 0.5, bobRadius * 0.5);
      p.drawingContext.shadowBlur = 0;

      // Draw gravity force arrow
      const gForceLen = Math.min(g * 3, 60);
      p.stroke(255, 200, 50);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ffc832';
      p.line(bobX, bobY + bobRadius + 3, bobX, bobY + bobRadius + 3 + gForceLen);
      p.line(bobX, bobY + bobRadius + 3 + gForceLen, bobX - 5, bobY + bobRadius + 3 + gForceLen - 7);
      p.line(bobX, bobY + bobRadius + 3 + gForceLen, bobX + 5, bobY + bobRadius + 3 + gForceLen - 7);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('mg', bobX + 8, bobY + bobRadius + 3 + gForceLen / 2);

      // Tension force along string
      p.stroke(0, 180, 255);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00b4ff';
      const tLen = 30;
      const tx = bobX - tLen * Math.sin(angle);
      const ty = bobY - tLen * Math.cos(angle);
      p.line(bobX, bobY - bobRadius - 3, tx, ty - bobRadius);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(0, 180, 255);
      p.textSize(10);
      p.text('T', tx - 12, ty - bobRadius);

      // Graph panel — angle vs time
      const graphX = width * 0.6;
      const graphW = width * 0.35;
      const graphY = 50;
      const graphH = 140;
      const graphCY = graphY + graphH / 2;

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(graphX, graphY, graphW, graphH, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Angle vs Time', graphX + graphW / 2, graphY + 5);

      // Center line
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(graphX + 5, graphCY, graphX + graphW - 5, graphCY);

      if (trail.length > 1) {
        p.noFill();
        p.stroke(255, 80, 130);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#ff5082';
        p.beginShape();
        for (let i = 0; i < trail.length; i++) {
          const tx2 = graphX + 5 + (i / 300) * (graphW - 10);
          const ty2 = graphCY - (trail[i].a / (initAngleDeg + 5)) * (graphH / 2 - 15);
          p.vertex(tx2, ty2);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Info panel
      const infoX = graphX;
      const infoY = graphY + graphH + 20;
      const period = 2 * Math.PI * Math.sqrt((len * 0.01) / g);

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, graphW, 140, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Physics:', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('L = ' + (len * 0.01).toFixed(2) + ' m (' + len + ' px)', infoX + 10, infoY + 28);
      p.text('g = ' + g.toFixed(1) + ' m/s\u00B2', infoX + 10, infoY + 44);
      p.text('\u03B8 = ' + (angle * 180 / Math.PI).toFixed(1) + '\u00B0', infoX + 10, infoY + 60);
      p.text('\u03C9 = ' + angularVelocity.toFixed(3) + ' rad/s', infoX + 10, infoY + 76);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('T = 2\u03C0\u221A(L/g) = ' + period.toFixed(3) + ' s', infoX + 10, infoY + 96);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('f = ' + (1 / period).toFixed(3) + ' Hz', infoX + 10, infoY + 118);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust length and gravity to see how the period changes', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      // Reset with current initial angle
      angle = engine.getParam('initialAngle') * Math.PI / 180;
      angularVelocity = 0;
      time = 0;
      trail = [];
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { length: 150, gravity: 9.81, damping: 0.02, initialAngle: 30 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'length', label: 'Pendulum Length', min: 50, max: 300, step: 10, value: 150, unit: 'px' },
    { name: 'gravity', label: 'Gravity (g)', min: 1, max: 20, step: 0.5, value: 9.81, unit: 'm/s\u00B2' },
    { name: 'damping', label: 'Damping', min: 0, max: 0.1, step: 0.005, value: 0.02, unit: '' },
    { name: 'initialAngle', label: 'Initial Angle', min: 10, max: 80, step: 5, value: 30, unit: '\u00B0' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
