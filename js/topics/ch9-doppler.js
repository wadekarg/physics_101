// Chapter 9: Doppler Effect — Moving Source Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'doppler-effect';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let waveFronts = []; // { x, y, radius, birth }
    let sourceX = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
      sourceX = width * 0.3;
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const sourceSpeed = engine.getParam('sourceSpeed');
      const waveSpeed = engine.getParam('waveSpeed');
      const freq = engine.getParam('frequency');

      const period = 1 / freq;
      const scaleFactor = 0.5; // px per m/s

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Move source
        sourceX += sourceSpeed * scaleFactor * dt;

        // Wrap source around
        if (sourceX > width + 50) sourceX = -50;

        // Emit new wave fronts periodically
        if (waveFronts.length === 0 || time - waveFronts[waveFronts.length - 1].birth >= period) {
          waveFronts.push({ x: sourceX, y: height / 2, radius: 0, birth: time });
        }

        // Expand wave fronts
        for (const wf of waveFronts) {
          wf.radius += waveSpeed * scaleFactor * dt;
        }

        // Remove old wave fronts
        waveFronts = waveFronts.filter(wf => wf.radius < width * 1.5);
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Doppler Effect', width / 2, 8);

      // Draw wave fronts
      for (const wf of waveFronts) {
        const alpha = Math.max(10, 120 - (wf.radius / (width * 0.8)) * 120);
        p.noFill();
        p.stroke(0, 200, 255, alpha);
        p.strokeWeight(1.5);
        p.ellipse(wf.x, wf.y, wf.radius * 2, wf.radius * 2);
      }

      // Draw source (ambulance/car shape)
      const srcY = height / 2;
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#ff6090';

      // Car body
      p.fill(255, 80, 130);
      p.noStroke();
      p.rect(sourceX - 25, srcY - 12, 50, 24, 6);
      // Windshield
      p.fill(150, 200, 255, 150);
      p.rect(sourceX + 12, srcY - 9, 10, 18, 2);
      // Wheels
      p.fill(60, 60, 80);
      p.ellipse(sourceX - 14, srcY + 14, 10, 10);
      p.ellipse(sourceX + 14, srcY + 14, 10, 10);
      p.drawingContext.shadowBlur = 0;

      // Direction arrow
      p.stroke(255, 200, 50);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#ffc832';
      const arrowX = sourceX + 35;
      p.line(sourceX + 28, srcY, arrowX + 15, srcY);
      p.line(arrowX + 15, srcY, arrowX + 8, srcY - 5);
      p.line(arrowX + 15, srcY, arrowX + 8, srcY + 5);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(9);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text('v_s', arrowX + 2, srcY - 6);

      // Observer positions
      const obs1X = width * 0.85;
      const obs1Y = height / 2;
      const obs2X = width * 0.05;
      const obs2Y = height / 2;

      // Draw observers
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ff88';
      p.fill(0, 255, 136);
      p.noStroke();
      // Observer ahead (right)
      p.ellipse(obs1X, obs1Y - 12, 14, 14);
      p.rect(obs1X - 5, obs1Y - 4, 10, 18, 3);
      // Observer behind (left)
      p.ellipse(obs2X, obs2Y - 12, 14, 14);
      p.rect(obs2X - 5, obs2Y - 4, 10, 18, 3);
      p.drawingContext.shadowBlur = 0;

      p.fill(0, 255, 136);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Observer', obs1X, obs1Y + 18);
      p.text('(ahead)', obs1X, obs1Y + 30);
      p.text('Observer', obs2X, obs2Y + 18);
      p.text('(behind)', obs2X, obs2Y + 30);

      // Calculate observed frequencies
      const mach = sourceSpeed / waveSpeed;
      let fAhead, fBehind;
      if (sourceSpeed < waveSpeed) {
        fAhead = freq * waveSpeed / (waveSpeed - sourceSpeed);
        fBehind = freq * waveSpeed / (waveSpeed + sourceSpeed);
      } else {
        fAhead = Infinity;
        fBehind = freq * waveSpeed / (waveSpeed + sourceSpeed);
      }

      // Frequency indicators with color
      const highColor = [255, 100, 100]; // red = higher pitch
      const lowColor = [100, 100, 255];  // blue = lower pitch
      const normalColor = [200, 200, 220];

      // Ahead observer frequency
      p.fill(highColor[0], highColor[1], highColor[2]);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      if (sourceSpeed < waveSpeed) {
        p.text('f = ' + fAhead.toFixed(0) + ' Hz', obs1X, obs1Y - 25);
      } else {
        p.text('Sonic Boom!', obs1X, obs1Y - 25);
      }
      p.textSize(9);
      p.text('(Higher pitch)', obs1X, obs1Y - 40);

      // Behind observer frequency
      p.fill(lowColor[0], lowColor[1], lowColor[2]);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('f = ' + fBehind.toFixed(0) + ' Hz', obs2X, obs2Y - 25);
      p.textSize(9);
      p.text('(Lower pitch)', obs2X, obs2Y - 40);

      // Compressed/stretched labels
      if (waveFronts.length > 2) {
        p.fill(255, 100, 100, 150);
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('\u2190 Compressed', sourceX + 80, srcY - 35);

        p.fill(100, 100, 255, 150);
        p.text('Stretched \u2192', sourceX - 80, srcY - 35);
      }

      // Info panel
      const infoX = 30;
      const infoY = height - 130;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 320, 115, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Doppler Effect Formula:', infoX + 10, infoY + 8);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('f\' = f \u00D7 v / (v \u00B1 v_s)', infoX + 10, infoY + 28);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Source freq: ' + freq + ' Hz', infoX + 10, infoY + 48);
      p.text('Source speed: ' + sourceSpeed + ' m/s', infoX + 10, infoY + 64);
      p.text('Wave speed: ' + waveSpeed + ' m/s', infoX + 10, infoY + 80);
      p.text('Mach number: ' + mach.toFixed(2), infoX + 10, infoY + 96);

      // Observed frequencies panel
      const info2X = width - 260;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(info2X, infoY, 230, 115, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Observed Frequencies:', info2X + 10, infoY + 8);

      p.fill(255, 100, 100);
      p.textSize(11);
      if (sourceSpeed < waveSpeed) {
        p.text('Ahead:  f\' = ' + fAhead.toFixed(1) + ' Hz', info2X + 10, infoY + 30);
      } else {
        p.text('Ahead:  Shock wave (v_s > v)', info2X + 10, infoY + 30);
      }

      p.fill(100, 100, 255);
      p.text('Behind: f\' = ' + fBehind.toFixed(1) + ' Hz', info2X + 10, infoY + 50);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('Shift ahead: +' + (sourceSpeed < waveSpeed ? (fAhead - freq).toFixed(1) : '\u221E') + ' Hz', info2X + 10, infoY + 72);
      p.text('Shift behind: ' + (fBehind - freq).toFixed(1) + ' Hz', info2X + 10, infoY + 88);

      if (mach >= 1) {
        p.fill(255, 50, 50);
        p.textSize(11);
        p.text('SUPERSONIC!', info2X + 10, infoY + 100);
      }

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust source speed to see how wave fronts compress and stretch', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      time = 0;
      waveFronts = [];
      sourceX = width * 0.3;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { sourceSpeed: 100, waveSpeed: 343, frequency: 440 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'sourceSpeed', label: 'Source Speed', min: 0, max: 300, step: 10, value: 100, unit: 'm/s' },
    { name: 'waveSpeed', label: 'Wave Speed (Sound)', min: 343, max: 343, step: 1, value: 343, unit: 'm/s' },
    { name: 'frequency', label: 'Source Frequency', min: 200, max: 1000, step: 20, value: 440, unit: 'Hz' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
