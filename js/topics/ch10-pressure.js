// Chapter 10: Pressure & Pascal's Law — Hydraulic Press Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'pressure-pascal';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let animProgress = 0;
    let animating = false;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const A1 = engine.getParam('area1');
      const A2 = engine.getParam('area2');
      const F1 = engine.getParam('force');

      // Physics: P = F/A, Pascal's law: P1 = P2, so F2 = F1 * A2/A1
      const pressure = F1 / A1;
      const F2 = pressure * A2;
      const ratio = A2 / A1;

      if (engine.isPlaying && animating) {
        animProgress += 0.008 * engine.speed;
        if (animProgress > 1) animProgress = 1;
      }

      // Piston visual dimensions
      const piston1W = Math.max(30, A1 * 25);
      const piston2W = Math.max(30, A2 * 12);
      const baseY = height * 0.7;
      const tubeH = 100;

      // Piston 1 position (left - pushed down)
      const p1X = width * 0.22;
      const p1TopRest = baseY - tubeH;
      const p1Displacement = animProgress * 50;
      const p1Top = p1TopRest + p1Displacement;

      // Piston 2 position (right - pushed up)
      // Volume conservation: A1 * d1 = A2 * d2 => d2 = d1 * A1/A2
      const p2Displacement = p1Displacement * (A1 / A2);
      const p2X = width * 0.6;
      const p2TopRest = baseY - tubeH;
      const p2Top = p2TopRest - p2Displacement;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Pascal\'s Law: Hydraulic Press', width / 2, 8);

      // Draw connecting tube at bottom
      p.fill(40, 60, 100, 180);
      p.noStroke();
      const tubeTop = baseY;
      const tubeBottom = baseY + 30;
      // Left vertical
      p.rect(p1X - piston1W / 2, p1Top, piston1W, baseY - p1Top + 30);
      // Right vertical
      p.rect(p2X - piston2W / 2, p2Top, piston2W, baseY - p2Top + 30);
      // Horizontal connector
      p.rect(p1X - piston1W / 2, tubeTop, p2X - p1X + piston2W / 2 + piston1W / 2, 30, 0, 0, 8, 8);

      // Draw fluid
      p.fill(0, 150, 255, 120);
      // Left column fluid
      const fluid1Top = p1Top + 10;
      p.rect(p1X - piston1W / 2 + 3, fluid1Top, piston1W - 6, baseY - fluid1Top + 27);
      // Right column fluid
      const fluid2Top = p2Top + 10;
      p.rect(p2X - piston2W / 2 + 3, fluid2Top, piston2W - 6, baseY - fluid2Top + 27);
      // Horizontal fluid
      p.rect(p1X + piston1W / 2 - 3, tubeTop + 3, p2X - p1X - piston2W / 2 - piston1W / 2 + 6, 24);

      // Pressure arrows in fluid
      const numArrows = 5;
      for (let i = 0; i < numArrows; i++) {
        const ax = p1X + piston1W / 2 + (i / numArrows) * (p2X - piston2W / 2 - p1X - piston1W / 2);
        const ay = tubeTop + 15;
        const arrowAlpha = 60 + animProgress * 140;
        p.stroke(0, 255, 200, arrowAlpha);
        p.strokeWeight(1.5);
        const aLen = 12;
        p.line(ax, ay, ax + aLen, ay);
        p.line(ax + aLen, ay, ax + aLen - 4, ay - 3);
        p.line(ax + aLen, ay, ax + aLen - 4, ay + 3);
      }

      // Draw piston 1 (small)
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ffc8';
      p.fill(0, 220, 180);
      p.noStroke();
      p.rect(p1X - piston1W / 2, p1Top - 10, piston1W, 14, 4);
      p.drawingContext.shadowBlur = 0;
      // Piston rod
      p.fill(120, 130, 150);
      p.rect(p1X - 4, p1Top - 50, 8, 42, 2);

      // Draw piston 2 (large)
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff6090';
      p.fill(255, 80, 130);
      p.noStroke();
      p.rect(p2X - piston2W / 2, p2Top - 10, piston2W, 14, 4);
      p.drawingContext.shadowBlur = 0;
      // Piston rod
      p.fill(120, 130, 150);
      p.rect(p2X - 4, p2Top - 50, 8, 42, 2);

      // Force arrows
      // F1 down arrow (input)
      p.stroke(0, 255, 200);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ffc8';
      const f1ArrowTop = p1Top - 80;
      const f1ArrowBot = p1Top - 52;
      p.line(p1X, f1ArrowTop, p1X, f1ArrowBot);
      p.line(p1X, f1ArrowBot, p1X - 6, f1ArrowBot - 10);
      p.line(p1X, f1ArrowBot, p1X + 6, f1ArrowBot - 10);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(0, 255, 200);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('F\u2081 = ' + F1.toFixed(0) + ' N', p1X, f1ArrowTop - 3);
      p.textSize(10);
      p.text('A\u2081 = ' + A1.toFixed(1) + ' m\u00B2', p1X, f1ArrowTop - 18);

      // F2 up arrow (output)
      p.stroke(255, 80, 130);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff5082';
      const f2ArrowBot = p2Top - 52;
      const f2ArrowLen = Math.min(60, F2 / F1 * 30);
      const f2ArrowTop = f2ArrowBot - f2ArrowLen;
      p.line(p2X, f2ArrowBot, p2X, f2ArrowTop);
      p.line(p2X, f2ArrowTop, p2X - 6, f2ArrowTop + 10);
      p.line(p2X, f2ArrowTop, p2X + 6, f2ArrowTop + 10);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 80, 130);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('F\u2082 = ' + F2.toFixed(0) + ' N', p2X, f2ArrowTop - 3);
      p.textSize(10);
      p.text('A\u2082 = ' + A2.toFixed(1) + ' m\u00B2', p2X, f2ArrowTop - 18);

      // Pressure label in the middle
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ffc832';
      p.fill(255, 200, 50);
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      const midX = (p1X + p2X) / 2;
      p.text('P = F/A = ' + pressure.toFixed(1) + ' Pa', midX, tubeTop + 50);
      p.drawingContext.shadowBlur = 0;
      p.textSize(10);
      p.fill(255, 200, 50, 180);
      p.text('(same everywhere!)', midX, tubeTop + 67);

      // Info panel
      const infoX = 30;
      const infoY = height - 115;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 320, 100, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Pascal\'s Law:', infoX + 10, infoY + 8);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('P\u2081 = P\u2082  \u2192  F\u2081/A\u2081 = F\u2082/A\u2082', infoX + 10, infoY + 28);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Force multiplication: ' + ratio.toFixed(1) + '\u00D7', infoX + 10, infoY + 50);
      p.text('F\u2082 = F\u2081 \u00D7 (A\u2082/A\u2081) = ' + F1.toFixed(0) + ' \u00D7 ' + ratio.toFixed(1) + ' = ' + F2.toFixed(0) + ' N', infoX + 10, infoY + 68);
      p.text('Pressure = ' + pressure.toFixed(2) + ' Pa', infoX + 10, infoY + 84);

      // Mechanical advantage panel
      const info2X = width - 250;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(info2X, infoY, 220, 100, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Mechanical Advantage:', info2X + 10, infoY + 8);

      p.fill(255, 200, 50);
      p.textSize(14);
      p.text('MA = A\u2082/A\u2081 = ' + ratio.toFixed(1), info2X + 10, infoY + 30);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('Input: ' + F1.toFixed(0) + ' N on ' + A1.toFixed(1) + ' m\u00B2', info2X + 10, infoY + 52);
      p.text('Output: ' + F2.toFixed(0) + ' N on ' + A2.toFixed(1) + ' m\u00B2', info2X + 10, infoY + 68);
      p.text('Energy conserved: W\u2081 = W\u2082', info2X + 10, infoY + 84);

      // Click instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Click to push the small piston and see force multiplication', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      if (animProgress >= 1) {
        animProgress = 0;
        animating = false;
      } else {
        animating = true;
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { area1: 2, area2: 10, force: 50 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'area1', label: 'Piston 1 Area', min: 1, max: 5, step: 0.5, value: 2, unit: 'm\u00B2' },
    { name: 'area2', label: 'Piston 2 Area', min: 1, max: 20, step: 0.5, value: 10, unit: 'm\u00B2' },
    { name: 'force', label: 'Input Force', min: 10, max: 200, step: 5, value: 50, unit: 'N' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
