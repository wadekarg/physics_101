// Chapter 1: Position & Velocity — Car on a Track with Real-Time Graphs
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts, RealtimeGraph } = window.QP;

  const slug = 'position-velocity';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Physics state
    let position = 0;   // meters
    let velocity = 0;    // m/s
    let time = 0;
    let trail = [];
    let draggingCar = false;

    // Graph data
    const maxDataPoints = 300;
    let posData = [];
    let velData = [];
    let accData = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 600;
      p.createCanvas(width, height);
      p.textFont('monospace');
      resetSim();
    };

    function resetSim() {
      velocity = engine.getParam('initialVelocity');
      position = 0;
      time = 0;
      trail = [];
      posData = [];
      velData = [];
      accData = [];
    }

    function worldToScreen(pos) {
      const trackCenter = width / 2;
      const pixelsPerMeter = (width - 80) / 40; // show -20 to 20 meters
      return trackCenter + pos * pixelsPerMeter;
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const accel = engine.getParam('acceleration');

      // Track area (top section)
      const trackY = 80;
      const trackH = 100;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Position & Velocity: Car on a Track', width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Drag the car or use sliders to control motion', width / 2, 28);

      // Physics update
      if (engine.isPlaying && !draggingCar) {
        const dt = (1 / 60) * engine.speed;
        velocity += accel * dt;
        position += velocity * dt;
        time += dt;

        // Wrap position
        if (position > 20) position = -20;
        if (position < -20) position = 20;

        // Store data
        posData.push({ t: time, v: position });
        velData.push({ t: time, v: velocity });
        accData.push({ t: time, v: accel });

        if (posData.length > maxDataPoints) {
          posData.shift();
          velData.shift();
          accData.shift();
        }

        trail.push({ x: worldToScreen(position), t: time });
        if (trail.length > 60) trail.shift();
      }

      // Draw track
      p.fill(20, 20, 40);
      p.noStroke();
      p.rect(10, trackY, width - 20, trackH, 8);

      // Road markings
      p.stroke(50, 50, 70);
      p.strokeWeight(2);
      p.drawingContext.setLineDash([20, 15]);
      p.line(40, trackY + trackH / 2, width - 40, trackY + trackH / 2);
      p.drawingContext.setLineDash([]);

      // Position markers
      const pixelsPerMeter = (width - 80) / 40;
      for (let m = -20; m <= 20; m += 5) {
        const x = worldToScreen(m);
        p.stroke(60, 60, 80);
        p.strokeWeight(1);
        p.line(x, trackY + trackH - 5, x, trackY + trackH + 5);
        p.noStroke();
        p.fill(100, 100, 130);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(m + 'm', x, trackY + trackH + 7);
      }

      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 100;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x, trackY + trackH / 2, 4, 4);
      }

      // Car
      const carX = worldToScreen(position);
      const carY = trackY + trackH / 2;
      const carW = 40;
      const carH = 20;

      // Car body
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.rect(carX - carW / 2, carY - carH / 2, carW, carH, 5);
      p.fill(0, 220, 255);
      p.rect(carX - carW / 2 + 5, carY - carH / 2 + 2, carW * 0.35, carH * 0.5, 2);
      p.drawingContext.shadowBlur = 0;

      // Wheels
      p.fill(40, 40, 60);
      p.ellipse(carX - carW / 3, carY + carH / 2, 8, 8);
      p.ellipse(carX + carW / 3, carY + carH / 2, 8, 8);

      // Velocity arrow
      if (Math.abs(velocity) > 0.1) {
        const arrowLen = p.constrain(velocity * 5, -80, 80);
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#00ff88';
        p.line(carX, carY - carH / 2 - 10, carX + arrowLen, carY - carH / 2 - 10);
        const dir = arrowLen > 0 ? -1 : 1;
        p.line(carX + arrowLen, carY - carH / 2 - 10, carX + arrowLen + dir * 6, carY - carH / 2 - 15);
        p.line(carX + arrowLen, carY - carH / 2 - 10, carX + arrowLen + dir * 6, carY - carH / 2 - 5);
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('v = ' + velocity.toFixed(1) + ' m/s', carX, carY - carH / 2 - 15);
      }

      // Acceleration arrow
      if (Math.abs(accel) > 0.1) {
        const aLen = p.constrain(accel * 8, -60, 60);
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ff6464';
        p.line(carX, carY + carH / 2 + 15, carX + aLen, carY + carH / 2 + 15);
        p.drawingContext.shadowBlur = 0;
      }

      // Info display
      p.noStroke();
      p.fill(200, 200, 220);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('t = ' + time.toFixed(1) + ' s', 20, 36);
      p.fill(0, 180, 216);
      p.text('x = ' + position.toFixed(2) + ' m', 120, 36);
      p.fill(0, 255, 136);
      p.text('v = ' + velocity.toFixed(2) + ' m/s', 280, 36);
      p.fill(255, 100, 100);
      p.text('a = ' + accel.toFixed(2) + ' m/s\u00B2', 440, 36);

      // === Three stacked graphs ===
      const graphStartY = trackY + trackH + 30;
      const graphH = (height - graphStartY - 20) / 3 - 10;
      const graphW = width - 80;
      const graphX = 60;

      drawGraph(p, 'Position (m)', posData, graphX, graphStartY, graphW, graphH, '#00b4d8', 20);
      drawGraph(p, 'Velocity (m/s)', velData, graphX, graphStartY + graphH + 15, graphW, graphH, '#00ff88', 15);
      drawGraph(p, 'Acceleration (m/s\u00B2)', accData, graphX, graphStartY + (graphH + 15) * 2, graphW, graphH, '#ff6464', 10);
    };

    function drawGraph(p, label, data, gx, gy, gw, gh, color, yRange) {
      // Background
      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(gx, gy, gw, gh, 4);

      // Label
      p.noStroke();
      p.fill(color);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text(label, gx + 5, gy + 3);

      // Y-axis labels
      p.fill(100, 100, 130);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(yRange.toFixed(0), gx - 3, gy + 5);
      p.text('0', gx - 3, gy + gh / 2);
      p.text((-yRange).toFixed(0), gx - 3, gy + gh - 5);

      // Zero line
      p.stroke(50, 50, 70);
      p.strokeWeight(0.5);
      p.line(gx, gy + gh / 2, gx + gw, gy + gh / 2);

      // Data
      if (data.length < 2) return;
      p.noFill();
      p.stroke(color);
      p.strokeWeight(1.5);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = color;
      p.beginShape();
      for (let i = 0; i < data.length; i++) {
        const x = gx + (i / maxDataPoints) * gw;
        const y = gy + gh / 2 - (data[i].v / yRange) * (gh / 2);
        p.vertex(x, p.constrain(y, gy + 2, gy + gh - 2));
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;
    }

    p.mousePressed = () => {
      const trackY = 80;
      const trackH = 100;
      const carX = worldToScreen(position);
      const carY = trackY + trackH / 2;
      if (p.mouseX > carX - 25 && p.mouseX < carX + 25 && p.mouseY > carY - 15 && p.mouseY < carY + 15) {
        draggingCar = true;
      }
    };

    p.mouseDragged = () => {
      if (draggingCar) {
        const pixelsPerMeter = (width - 80) / 40;
        position = (p.mouseX - width / 2) / pixelsPerMeter;
        position = p.constrain(position, -20, 20);
        velocity = ((p.mouseX - p.pmouseX) / pixelsPerMeter) * 60;
      }
    };

    p.mouseReleased = () => {
      draggingCar = false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { initialVelocity: 3, acceleration: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'initialVelocity', label: 'Initial Velocity', min: -10, max: 10, step: 0.5, value: 3, unit: 'm/s' },
    { name: 'acceleration', label: 'Acceleration', min: -5, max: 5, step: 0.25, value: 0, unit: 'm/s\u00B2' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
