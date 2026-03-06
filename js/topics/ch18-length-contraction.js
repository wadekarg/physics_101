// Chapter 18: Length Contraction — Relativistic Spaceship Visualization
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'length-contraction';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const CYAN = [0, 245, 212];
  const CYAN_HEX = '#00f5d4';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function drawSpaceship(cx, cy, shipLength, shipHeight, col, label) {
      // Draw a stylized spaceship
      p.stroke(col[0], col[1], col[2]);
      p.strokeWeight(2);
      p.drawingContext.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`;
      p.drawingContext.shadowBlur = 10;
      p.fill(col[0], col[1], col[2], 40);

      // Main body
      p.beginShape();
      p.vertex(cx - shipLength / 2, cy);                          // left tip
      p.vertex(cx - shipLength / 3, cy - shipHeight / 2);         // top left
      p.vertex(cx + shipLength / 3, cy - shipHeight / 2);         // top right
      p.vertex(cx + shipLength / 2, cy - shipHeight / 4);         // nose top
      p.vertex(cx + shipLength / 2 + shipLength * 0.08, cy);      // nose tip
      p.vertex(cx + shipLength / 2, cy + shipHeight / 4);         // nose bottom
      p.vertex(cx + shipLength / 3, cy + shipHeight / 2);         // bottom right
      p.vertex(cx - shipLength / 3, cy + shipHeight / 2);         // bottom left
      p.endShape(p.CLOSE);
      p.drawingContext.shadowBlur = 0;

      // Windows
      p.fill(200, 240, 255, 150);
      p.noStroke();
      const windowCount = Math.max(2, Math.floor(shipLength / 30));
      for (let i = 0; i < windowCount; i++) {
        const wx = cx - shipLength / 4 + (i / (windowCount - 1)) * (shipLength / 2);
        p.ellipse(wx, cy - shipHeight / 5, shipLength * 0.04 + 3, shipHeight * 0.15 + 3);
      }

      // Engine glow (at the back)
      if (label === 'Moving') {
        p.fill(255, 100, 50, 150);
        p.drawingContext.shadowColor = '#ff6432';
        p.drawingContext.shadowBlur = 15;
        p.ellipse(cx - shipLength / 2 - 5, cy, 10, shipHeight * 0.4);
        p.fill(255, 200, 50, 100);
        p.ellipse(cx - shipLength / 2 - 12, cy, 8, shipHeight * 0.25);
        p.drawingContext.shadowBlur = 0;
      }

      // Label
      p.noStroke();
      p.fill(col[0], col[1], col[2]);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(label, cx, cy + shipHeight / 2 + 8);
    }

    p.draw = () => {
      p.background(10, 10, 26);

      const v = engine.getParam('velocity');
      const gamma = 1 / Math.sqrt(1 - v * v);

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      // --- Stars background ---
      p.noStroke();
      p.fill(255, 255, 255, 80);
      for (let i = 0; i < 50; i++) {
        const seed = i * 137.5;
        const sx = ((seed * 7.3 + time * 30 * v) % width + width) % width;
        const sy = (seed * 13.7) % height;
        const size = (seed % 3) + 1;
        p.ellipse(sx, sy, size, size);
      }

      const restLength = 200;
      const contractedLength = restLength / gamma;
      const shipH = 50;

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Length Contraction: L = L\u2080 / \u03B3', width / 2, 8);

      // === SHIP FRAME (top) ===
      const topY = height * 0.28;
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(13);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Ship's Frame (proper length)", width / 2, 35);

      drawSpaceship(width / 2, topY, restLength, shipH, CYAN, "Ship's Frame");

      // Length bracket (rest)
      p.stroke(0, 255, 136, 180);
      p.strokeWeight(1.5);
      const bracketY1 = topY + shipH / 2 + 25;
      p.line(width / 2 - restLength / 2, bracketY1, width / 2 + restLength / 2, bracketY1);
      p.line(width / 2 - restLength / 2, bracketY1 - 5, width / 2 - restLength / 2, bracketY1 + 5);
      p.line(width / 2 + restLength / 2, bracketY1 - 5, width / 2 + restLength / 2, bracketY1 + 5);
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('L\u2080 = ' + restLength + ' m', width / 2, bracketY1 + 6);

      // --- Divider ---
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([5, 5]);
      p.line(30, height / 2, width - 30, height / 2);
      p.drawingContext.setLineDash([]);

      // === OBSERVER FRAME (bottom) ===
      const bottomY = height * 0.7;
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(13);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Observer Frame (contracted)', width / 2, height / 2 + 8);

      // Moving ship with animation
      const shipMovingX = width / 2 + Math.sin(time * 0.5) * 20;
      drawSpaceship(shipMovingX, bottomY, contractedLength, shipH, [255, 200, 50], 'Moving');

      // Length bracket (contracted)
      p.stroke(255, 200, 50, 180);
      p.strokeWeight(1.5);
      const bracketY2 = bottomY + shipH / 2 + 25;
      p.line(shipMovingX - contractedLength / 2, bracketY2, shipMovingX + contractedLength / 2, bracketY2);
      p.line(shipMovingX - contractedLength / 2, bracketY2 - 5, shipMovingX - contractedLength / 2, bracketY2 + 5);
      p.line(shipMovingX + contractedLength / 2, bracketY2 - 5, shipMovingX + contractedLength / 2, bracketY2 + 5);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('L = ' + contractedLength.toFixed(1) + ' m', shipMovingX, bracketY2 + 6);

      // --- Ghost overlay showing rest length for comparison ---
      if (v > 0.05) {
        p.stroke(CYAN[0], CYAN[1], CYAN[2], 40);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 6]);
        p.noFill();
        // Outline of rest-length ship at the bottom
        p.beginShape();
        p.vertex(shipMovingX - restLength / 2, bottomY);
        p.vertex(shipMovingX - restLength / 3, bottomY - shipH / 2);
        p.vertex(shipMovingX + restLength / 3, bottomY - shipH / 2);
        p.vertex(shipMovingX + restLength / 2, bottomY - shipH / 4);
        p.vertex(shipMovingX + restLength / 2 + restLength * 0.08, bottomY);
        p.vertex(shipMovingX + restLength / 2, bottomY + shipH / 4);
        p.vertex(shipMovingX + restLength / 3, bottomY + shipH / 2);
        p.vertex(shipMovingX - restLength / 3, bottomY + shipH / 2);
        p.endShape(p.CLOSE);
        p.drawingContext.setLineDash([]);
      }

      // --- Info panel ---
      const panelW = 240;
      const panelH = 92;
      const panelX = width - panelW - 15;
      const panelY = height / 2 - panelH / 2;
      p.fill(15, 15, 35, 220);
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 60);
      p.strokeWeight(1);
      p.rect(panelX, panelY, panelW, panelH, 8);
      p.noStroke();

      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Relativity', panelX + 10, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('v = ' + v.toFixed(2) + 'c = ' + (v * 3e8).toExponential(2) + ' m/s', panelX + 10, panelY + 28);
      p.text('\u03B3 = ' + gamma.toFixed(4), panelX + 10, panelY + 44);
      p.text('L\u2080 = ' + restLength + ' m  \u2192  L = ' + contractedLength.toFixed(1) + ' m', panelX + 10, panelY + 60);

      // Percentage contraction
      const pctContraction = ((1 - 1 / gamma) * 100).toFixed(1);
      p.fill(255, 100, 100);
      p.text('Contracted by ' + pctContraction + '%', panelX + 10, panelY + 76);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Increase velocity to see the spaceship contract in the direction of motion', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { velocity: 0.5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'velocity', label: 'Velocity', min: 0, max: 0.99, step: 0.01, value: 0.5, unit: 'c' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
