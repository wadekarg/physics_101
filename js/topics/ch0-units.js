// Chapter 0: Units & Measurement — Interactive Unit Converter Visualization
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'units-measurement';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Measurement state
    let dragging = false;
    let measureStart = null;
    let measureEnd = null;
    let currentMouse = null;

    // Reference objects with real-world sizes (in meters)
    const objects = [
      { name: 'Ant', size: 0.003, color: '#ff6464', y: 0 },
      { name: 'Pencil', size: 0.19, color: '#ffaa00', y: 0 },
      { name: 'Basketball', size: 0.24, color: '#ff8844', y: 0 },
      { name: 'Guitar', size: 1.0, color: '#00ff88', y: 0 },
      { name: 'Human', size: 1.75, color: '#00b4d8', y: 0 },
      { name: 'Car', size: 4.5, color: '#8b5cf6', y: 0 },
      { name: 'Blue Whale', size: 25, color: '#ff44aa', y: 0 }
    ];

    // Unit systems
    const unitSystems = {
      metric: [
        { name: 'mm', factor: 1000 },
        { name: 'cm', factor: 100 },
        { name: 'm', factor: 1 },
        { name: 'km', factor: 0.001 }
      ],
      imperial: [
        { name: 'in', factor: 39.3701 },
        { name: 'ft', factor: 3.28084 },
        { name: 'yd', factor: 1.09361 },
        { name: 'mi', factor: 0.000621371 }
      ]
    };

    let selectedObject = 3; // Guitar by default
    let scale = 200; // pixels per meter
    let viewMode = 'compare'; // 'compare' or 'measure'

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function formatValue(val) {
      if (val >= 1000) return val.toFixed(0);
      if (val >= 1) return val.toFixed(2);
      if (val >= 0.01) return val.toFixed(3);
      return val.toExponential(2);
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Units & Measurement: Visual Comparison', width / 2, 10);

      p.textSize(11);
      p.fill(200, 200, 220, 180);
      p.text('Click objects to select | Drag on canvas to measure | Scroll to zoom', width / 2, 30);

      // Draw pixel ruler at top
      const rulerY = 55;
      p.stroke(0, 180, 216, 120);
      p.strokeWeight(1);
      p.line(20, rulerY, width - 20, rulerY);

      // Calculate ruler markings based on scale
      const metersVisible = (width - 40) / scale;
      let tickSpacing;
      if (metersVisible < 0.5) tickSpacing = 0.05;
      else if (metersVisible < 2) tickSpacing = 0.1;
      else if (metersVisible < 5) tickSpacing = 0.5;
      else if (metersVisible < 20) tickSpacing = 1;
      else tickSpacing = 5;

      for (let m = 0; m <= metersVisible; m += tickSpacing) {
        const px = 20 + m * scale;
        if (px > width - 20) break;
        const isMajor = Math.abs(m / tickSpacing % 5) < 0.01;
        p.stroke(0, 180, 216, isMajor ? 200 : 80);
        p.strokeWeight(isMajor ? 1.5 : 0.5);
        p.line(px, rulerY - (isMajor ? 10 : 5), px, rulerY + (isMajor ? 10 : 5));

        if (isMajor || tickSpacing >= 0.5) {
          p.noStroke();
          p.fill(0, 180, 216, 200);
          p.textSize(9);
          p.textAlign(p.CENTER, p.TOP);
          if (m >= 1) p.text(m.toFixed(m % 1 === 0 ? 0 : 1) + ' m', px, rulerY + 12);
          else p.text((m * 100).toFixed(0) + ' cm', px, rulerY + 12);
        }
      }

      // Draw comparison bars for objects
      const barStartY = 100;
      const barHeight = 30;
      const barGap = 10;

      objects.forEach((obj, i) => {
        const oy = barStartY + i * (barHeight + barGap);
        obj.y = oy;
        const barWidth = Math.max(2, obj.size * scale);
        const displayWidth = Math.min(barWidth, width - 40);

        // Background bar track
        p.fill(30, 30, 50);
        p.noStroke();
        p.rect(20, oy, width - 40, barHeight, 4);

        // Colored bar
        const isSelected = i === selectedObject;
        const c = p.color(obj.color);
        if (isSelected) {
          p.drawingContext.shadowBlur = 12;
          p.drawingContext.shadowColor = obj.color;
        }
        p.fill(p.red(c), p.green(c), p.blue(c), isSelected ? 255 : 150);
        p.noStroke();
        if (displayWidth >= 2) {
          p.rect(20, oy, displayWidth, barHeight, 4);
        } else {
          p.stroke(obj.color);
          p.strokeWeight(2);
          p.line(20, oy, 20, oy + barHeight);
        }
        p.drawingContext.shadowBlur = 0;

        // Label
        p.noStroke();
        p.fill(255, 255, 255, isSelected ? 255 : 180);
        p.textSize(isSelected ? 12 : 11);
        p.textAlign(p.LEFT, p.CENTER);
        const label = obj.name + ' (' + formatValue(obj.size) + ' m)';
        const labelX = Math.max(25, Math.min(displayWidth + 25, width - p.textWidth(label) - 10));
        p.text(label, labelX, oy + barHeight / 2);

        // Hover effect
        if (p.mouseY > oy && p.mouseY < oy + barHeight && p.mouseX > 20 && p.mouseX < width - 20) {
          p.noFill();
          p.stroke(255, 255, 255, 60);
          p.strokeWeight(1);
          p.rect(20, oy, width - 40, barHeight, 4);
        }
      });

      // Selected object detail panel
      const detailY = barStartY + objects.length * (barHeight + barGap) + 15;
      const sel = objects[selectedObject];
      p.fill(20, 20, 40, 230);
      p.stroke(p.color(sel.color));
      p.strokeWeight(1);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = sel.color;
      p.rect(20, detailY, width - 40, 110, 8);
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(sel.color);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text(sel.name + ' = ' + formatValue(sel.size) + ' meters', 35, detailY + 10);

      // Show in all units
      let col = 0;
      let row = 0;
      const unitStartY = detailY + 35;
      p.textSize(11);

      p.fill(0, 180, 216, 200);
      p.text('Metric:', 35, unitStartY);
      p.fill(200, 200, 220);
      unitSystems.metric.forEach((u, i) => {
        const val = sel.size * u.factor;
        p.text(formatValue(val) + ' ' + u.name, 35 + i * 120, unitStartY + 18);
      });

      p.fill(0, 255, 136, 200);
      p.text('Imperial:', 35, unitStartY + 42);
      p.fill(200, 200, 220);
      unitSystems.imperial.forEach((u, i) => {
        const val = sel.size * u.factor;
        p.text(formatValue(val) + ' ' + u.name, 35 + i * 120, unitStartY + 60);
      });

      // Measurement tool (drag on canvas)
      if (dragging && measureStart && currentMouse) {
        const dx = currentMouse.x - measureStart.x;
        const dist = Math.abs(dx);
        const meters = dist / scale;

        p.stroke(255, 255, 100);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#ffff64';
        p.line(measureStart.x, measureStart.y, currentMouse.x, currentMouse.y);

        // End markers
        p.line(measureStart.x, measureStart.y - 8, measureStart.x, measureStart.y + 8);
        p.line(currentMouse.x, currentMouse.y - 8, currentMouse.x, currentMouse.y + 8);
        p.drawingContext.shadowBlur = 0;

        // Measurement label
        p.noStroke();
        p.fill(255, 255, 100);
        p.textSize(13);
        p.textAlign(p.CENTER, p.BOTTOM);
        const midX = (measureStart.x + currentMouse.x) / 2;
        const midY = Math.min(measureStart.y, currentMouse.y) - 10;
        p.text(formatValue(meters) + ' m  |  ' + formatValue(meters * 100) + ' cm  |  ' + formatValue(meters * 3.28084) + ' ft', midX, midY);
      }

      // Zoom indicator
      p.fill(100, 100, 120);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.text('Scale: ' + scale.toFixed(0) + ' px/m  |  Scroll to zoom', width - 10, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Check if clicking on an object bar
      for (let i = 0; i < objects.length; i++) {
        if (p.mouseY > objects[i].y && p.mouseY < objects[i].y + 30) {
          selectedObject = i;
          return;
        }
      }

      // Start measuring
      dragging = true;
      measureStart = { x: p.mouseX, y: p.mouseY };
      currentMouse = { x: p.mouseX, y: p.mouseY };
    };

    p.mouseDragged = () => {
      if (dragging) {
        currentMouse = { x: p.mouseX, y: p.mouseY };
      }
    };

    p.mouseReleased = () => {
      if (dragging) {
        measureEnd = { x: p.mouseX, y: p.mouseY };
        dragging = false;
      }
    };

    p.mouseWheel = (event) => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      scale *= event.delta > 0 ? 0.9 : 1.1;
      scale = p.constrain(scale, 5, 5000);
      return false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
