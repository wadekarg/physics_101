// Chapter 0: Vectors — Interactive Vector Addition Sandbox
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'vectors';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Vector data
    let vectors = [];
    let drawingVector = false;
    let drawStart = null;
    let currentEnd = null;
    let hoveredVector = -1;
    let draggingTip = -1;
    let showComponents = true;
    let showResultant = true;

    const origin = { x: 0, y: 0 };
    const vecColors = ['#00b4d8', '#8b5cf6', '#ff6464', '#ffaa00', '#ff44aa', '#44ffaa', '#aaaaff'];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      origin.x = width / 2;
      origin.y = height / 2;
    };

    function drawArrow(x1, y1, x2, y2, col, weight, glow) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = 12;

      p.stroke(col);
      p.strokeWeight(weight);
      if (glow) {
        p.drawingContext.shadowBlur = glow;
        p.drawingContext.shadowColor = col;
      }
      p.line(x1, y1, x2, y2);
      p.line(x2, y2, x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
      p.line(x2, y2, x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
      p.drawingContext.shadowBlur = 0;
    }

    function drawDashedLine(x1, y1, x2, y2, col) {
      p.stroke(col);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(x1, y1, x2, y2);
      p.drawingContext.setLineDash([]);
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Vector Addition Sandbox', width / 2, 10);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click & drag to create vectors | Right-click to delete | Drag tips to resize', width / 2, 30);

      // Grid
      p.stroke(30, 30, 60);
      p.strokeWeight(0.5);
      const gridSize = 40;
      for (let x = origin.x % gridSize; x < width; x += gridSize) {
        p.stroke(30, 30, x === origin.x ? 80 : 60);
        p.strokeWeight(x === origin.x ? 1 : 0.5);
        p.line(x, 0, x, height);
      }
      for (let y = origin.y % gridSize; y < height; y += gridSize) {
        p.stroke(30, 30, y === origin.y ? 80 : 60);
        p.strokeWeight(y === origin.y ? 1 : 0.5);
        p.line(0, y, width, y);
      }

      // Axes
      p.stroke(80, 80, 100);
      p.strokeWeight(1);
      p.line(0, origin.y, width, origin.y);
      p.line(origin.x, 0, origin.x, height);

      // Axis labels
      p.noStroke();
      p.fill(100, 100, 130);
      p.textSize(12);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.text('x', width - 5, origin.y - 5);
      p.textAlign(p.LEFT, p.TOP);
      p.text('y', origin.x + 5, 5);

      // Draw existing vectors
      let resultantX = 0;
      let resultantY = 0;

      vectors.forEach((v, i) => {
        const col = vecColors[i % vecColors.length];
        const x1 = origin.x + v.x1;
        const y1 = origin.y - v.y1;
        const x2 = origin.x + v.x2;
        const y2 = origin.y - v.y2;
        const isHovered = i === hoveredVector;

        // Components (dashed lines)
        if (showComponents) {
          drawDashedLine(x1, y1, x2, y1, col + '60');
          drawDashedLine(x2, y1, x2, y2, col + '60');
        }

        // Vector arrow
        drawArrow(x1, y1, x2, y2, col, isHovered ? 3 : 2, isHovered ? 15 : 8);

        // Magnitude and angle label
        const dx = v.x2 - v.x1;
        const dy = v.y2 - v.y1;
        const mag = Math.sqrt(dx * dx + dy * dy) / gridSize;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        resultantX += dx;
        resultantY += dy;

        p.noStroke();
        p.fill(col);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 8;
        p.text('V' + (i + 1) + ': ' + mag.toFixed(1) + ' @ ' + angle.toFixed(0) + '\u00B0', midX, midY);

        // Tip handle
        p.noStroke();
        p.fill(255, 255, 255, isHovered ? 200 : 100);
        p.ellipse(x2, y2, 8, 8);
      });

      // Resultant vector
      if (showResultant && vectors.length > 1) {
        const rx = origin.x + resultantX;
        const ry = origin.y - resultantY;
        const rMag = Math.sqrt(resultantX * resultantX + resultantY * resultantY) / gridSize;
        const rAngle = Math.atan2(resultantY, resultantX) * 180 / Math.PI;

        // Components
        if (showComponents) {
          drawDashedLine(origin.x, origin.y, rx, origin.y, '#00ff8860');
          drawDashedLine(rx, origin.y, rx, ry, '#00ff8860');
        }

        drawArrow(origin.x, origin.y, rx, ry, '#00ff88', 3, 15);

        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(11);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('R = ' + rMag.toFixed(2) + ' @ ' + rAngle.toFixed(1) + '\u00B0', (origin.x + rx) / 2, (origin.y + ry) / 2 - 10);
      }

      // Currently drawing vector
      if (drawingVector && drawStart && currentEnd) {
        const col = vecColors[vectors.length % vecColors.length];
        const x1 = drawStart.x;
        const y1 = drawStart.y;
        const x2 = currentEnd.x;
        const y2 = currentEnd.y;

        drawArrow(x1, y1, x2, y2, col, 2, 12);

        const dx = (x2 - x1);
        const dy = -(y2 - y1);
        const mag = Math.sqrt(dx * dx + dy * dy) / gridSize;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        p.noStroke();
        p.fill(col);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(mag.toFixed(1) + ' @ ' + angle.toFixed(0) + '\u00B0', (x1 + x2) / 2, (y1 + y2) / 2 - 8);
      }

      // Info panel
      const panelX = 10;
      const panelY = height - 120;
      p.fill(20, 20, 40, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 200, 110, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Vectors: ' + vectors.length, panelX + 10, panelY + 8);

      if (vectors.length > 0) {
        const rMag = Math.sqrt(resultantX * resultantX + resultantY * resultantY) / gridSize;
        const rAngle = Math.atan2(resultantY, resultantX) * 180 / Math.PI;

        p.fill(0, 255, 136);
        p.textSize(11);
        p.text('Resultant:', panelX + 10, panelY + 30);
        p.fill(200, 200, 220);
        p.textSize(10);
        p.text('Rx = ' + (resultantX / gridSize).toFixed(2), panelX + 10, panelY + 48);
        p.text('Ry = ' + (resultantY / gridSize).toFixed(2), panelX + 10, panelY + 63);
        p.text('|R| = ' + rMag.toFixed(2), panelX + 10, panelY + 78);
        p.text('\u03B8 = ' + rAngle.toFixed(1) + '\u00B0', panelX + 10, panelY + 93);
      }

      // Check hover
      hoveredVector = -1;
      for (let i = vectors.length - 1; i >= 0; i--) {
        const v = vectors[i];
        const tx = origin.x + v.x2;
        const ty = origin.y - v.y2;
        if (p.dist(p.mouseX, p.mouseY, tx, ty) < 12) {
          hoveredVector = i;
          break;
        }
      }
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Right click to delete
      if (p.mouseButton === p.RIGHT) {
        if (hoveredVector >= 0) {
          vectors.splice(hoveredVector, 1);
          hoveredVector = -1;
        }
        return false;
      }

      // Check if grabbing a vector tip
      for (let i = vectors.length - 1; i >= 0; i--) {
        const v = vectors[i];
        const tx = origin.x + v.x2;
        const ty = origin.y - v.y2;
        if (p.dist(p.mouseX, p.mouseY, tx, ty) < 12) {
          draggingTip = i;
          return;
        }
      }

      // Start drawing new vector from origin
      drawingVector = true;
      drawStart = { x: origin.x, y: origin.y };
      currentEnd = { x: p.mouseX, y: p.mouseY };
    };

    p.mouseDragged = () => {
      if (draggingTip >= 0) {
        vectors[draggingTip].x2 = p.mouseX - origin.x;
        vectors[draggingTip].y2 = -(p.mouseY - origin.y);
      } else if (drawingVector) {
        currentEnd = { x: p.mouseX, y: p.mouseY };
      }
    };

    p.mouseReleased = () => {
      if (draggingTip >= 0) {
        draggingTip = -1;
        return;
      }

      if (drawingVector && drawStart && currentEnd) {
        const dx = currentEnd.x - drawStart.x;
        const dy = -(currentEnd.y - drawStart.y);
        if (Math.sqrt(dx * dx + dy * dy) > 10) {
          vectors.push({
            x1: 0,
            y1: 0,
            x2: currentEnd.x - origin.x,
            y2: -(currentEnd.y - origin.y)
          });
        }
      }
      drawingVector = false;
      drawStart = null;
      currentEnd = null;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      origin.x = width / 2;
      origin.y = height / 2;
    };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
