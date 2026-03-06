// Chapter 1: Motion Graphs — Draw & Watch
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'motion-graphs';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Mode: 'position' = draw x-t graph; 'velocity' = draw v-t graph
    let mode = 'position';

    // Graph state
    let drawingPoints = []; // User-drawn points (normalized 0-1 for both axes)
    let isDrawing = false;
    let playbackTime = 0;
    let isPlayingBack = false;

    // Graph areas
    let graphRect = { x: 60, y: 60, w: 0, h: 0 };
    let trackRect = { x: 60, y: 0, w: 0, h: 60 };

    // Derived data
    let derivedPoints = []; // velocity from position or position from velocity

    // Buttons
    let modeBtnRect = { x: 0, y: 0, w: 160, h: 30 };
    let clearBtnRect = { x: 0, y: 0, w: 80, h: 30 };
    let playBtnRect = { x: 0, y: 0, w: 100, h: 30 };

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      updateLayout();
    };

    function updateLayout() {
      graphRect = { x: 70, y: 130, w: width - 100, h: 150 };
      trackRect = { x: 70, y: 60, w: width - 100, h: 50 };
      modeBtnRect = { x: 20, y: 12, w: 160, h: 28 };
      clearBtnRect = { x: 195, y: 12, w: 80, h: 28 };
      playBtnRect = { x: 290, y: 12, w: 100, h: 28 };
    }

    function computeDerived() {
      derivedPoints = [];
      if (drawingPoints.length < 2) return;

      // Sort by x (time)
      const sorted = [...drawingPoints].sort((a, b) => a.x - b.x);

      if (mode === 'position') {
        // Derive velocity = dx/dt (numerical derivative)
        for (let i = 0; i < sorted.length - 1; i++) {
          const dt = sorted[i + 1].x - sorted[i].x;
          if (dt < 0.001) continue;
          const dxdt = (sorted[i + 1].y - sorted[i].y) / dt;
          derivedPoints.push({
            x: (sorted[i].x + sorted[i + 1].x) / 2,
            y: dxdt
          });
        }
      } else {
        // Derive position = integral of velocity (area under curve via trapezoidal)
        let pos = 0;
        derivedPoints.push({ x: sorted[0].x, y: 0 });
        for (let i = 0; i < sorted.length - 1; i++) {
          const dt = sorted[i + 1].x - sorted[i].x;
          pos += 0.5 * (sorted[i].y + sorted[i + 1].y) * dt;
          derivedPoints.push({ x: sorted[i + 1].x, y: pos });
        }
      }
    }

    function getPositionAtTime(t) {
      if (drawingPoints.length < 2) return 0.5;
      const sorted = [...drawingPoints].sort((a, b) => a.x - b.x);

      if (mode === 'position') {
        // Interpolate position directly from drawn graph
        for (let i = 0; i < sorted.length - 1; i++) {
          if (t >= sorted[i].x && t <= sorted[i + 1].x) {
            const frac = (t - sorted[i].x) / (sorted[i + 1].x - sorted[i].x);
            return sorted[i].y + frac * (sorted[i + 1].y - sorted[i].y);
          }
        }
        return sorted[sorted.length - 1].y;
      } else {
        // Integrate velocity to get position
        let pos = 0;
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i + 1].x > t) {
            const dt = t - sorted[i].x;
            const frac = dt / (sorted[i + 1].x - sorted[i].x);
            const vAtT = sorted[i].y + frac * (sorted[i + 1].y - sorted[i].y);
            pos += 0.5 * (sorted[i].y + vAtT) * dt;
            return 0.5 + pos;
          }
          const dt = sorted[i + 1].x - sorted[i].x;
          pos += 0.5 * (sorted[i].y + sorted[i + 1].y) * dt;
        }
        return 0.5 + pos;
      }
    }

    function pointInRect(px, py, r) {
      return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Playback
      if (isPlayingBack && engine.isPlaying) {
        playbackTime += (1 / 60) * engine.speed * 0.05;
        if (playbackTime > 1) {
          playbackTime = 0;
          isPlayingBack = false;
        }
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(15);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Motion Graphs: Draw & Watch', width / 2, 42);

      // Buttons
      drawButton(modeBtnRect, 'Mode: ' + (mode === 'position' ? 'Draw x(t)' : 'Draw v(t)'), '#8b5cf6');
      drawButton(clearBtnRect, 'Clear', '#ff6464');
      drawButton(playBtnRect, isPlayingBack ? 'Playing...' : 'Play', '#00ff88');

      // === Track ===
      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(trackRect.x, trackRect.y, trackRect.w, trackRect.h, 6);

      // Car position
      const carNorm = getPositionAtTime(playbackTime);
      const carX = trackRect.x + carNorm * trackRect.w;
      const carY = trackRect.y + trackRect.h / 2;

      // Track center line
      p.stroke(40, 40, 60);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([10, 8]);
      p.line(trackRect.x + 5, carY, trackRect.x + trackRect.w - 5, carY);
      p.drawingContext.setLineDash([]);

      // Car
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.rect(carX - 18, carY - 8, 36, 16, 4);
      p.fill(0, 220, 255);
      p.rect(carX - 14, carY - 6, 12, 8, 2);
      p.drawingContext.shadowBlur = 0;
      p.fill(30, 30, 50);
      p.ellipse(carX - 10, carY + 9, 7, 7);
      p.ellipse(carX + 10, carY + 9, 7, 7);

      // === Drawing graph ===
      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(graphRect.x, graphRect.y, graphRect.w, graphRect.h, 6);

      // Graph label
      p.noStroke();
      p.fill(mode === 'position' ? '#00b4d8' : '#00ff88');
      p.textSize(12);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(mode === 'position' ? 'Position x(t) - Draw here!' : 'Velocity v(t) - Draw here!', graphRect.x + 5, graphRect.y - 3);

      // Axes labels
      p.fill(100, 100, 130);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('time \u2192', graphRect.x + graphRect.w / 2, graphRect.y + graphRect.h + 5);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(mode === 'position' ? 'x' : 'v', graphRect.x - 5, graphRect.y + graphRect.h / 2);

      // Zero line for velocity mode
      if (mode === 'velocity') {
        p.stroke(60, 60, 80);
        p.strokeWeight(0.5);
        p.line(graphRect.x, graphRect.y + graphRect.h / 2, graphRect.x + graphRect.w, graphRect.y + graphRect.h / 2);
      }

      // Draw user points
      if (drawingPoints.length > 1) {
        const sorted = [...drawingPoints].sort((a, b) => a.x - b.x);
        const col = mode === 'position' ? p.color(0, 180, 216) : p.color(0, 255, 136);
        p.noFill();
        p.stroke(col);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = mode === 'position' ? '#00b4d8' : '#00ff88';
        p.beginShape();
        for (const pt of sorted) {
          p.vertex(
            graphRect.x + pt.x * graphRect.w,
            graphRect.y + (1 - pt.y) * graphRect.h
          );
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;

        // Playback indicator
        if (isPlayingBack) {
          const px = graphRect.x + playbackTime * graphRect.w;
          p.stroke(255, 200, 50);
          p.strokeWeight(1.5);
          p.line(px, graphRect.y, px, graphRect.y + graphRect.h);
        }
      }

      // === Derived graph ===
      const derivedRect = { x: graphRect.x, y: graphRect.y + graphRect.h + 30, w: graphRect.w, h: 130 };
      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(derivedRect.x, derivedRect.y, derivedRect.w, derivedRect.h, 6);

      const derivedLabel = mode === 'position' ? 'Derived: Velocity v(t) = dx/dt' : 'Derived: Position x(t) = \u222Bv dt';
      const derivedColor = mode === 'position' ? '#00ff88' : '#00b4d8';
      p.noStroke();
      p.fill(derivedColor);
      p.textSize(12);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(derivedLabel, derivedRect.x + 5, derivedRect.y - 3);

      // Zero line
      p.stroke(60, 60, 80);
      p.strokeWeight(0.5);
      p.line(derivedRect.x, derivedRect.y + derivedRect.h / 2, derivedRect.x + derivedRect.w, derivedRect.y + derivedRect.h / 2);

      // Draw derived data
      if (derivedPoints.length > 1) {
        // Find range for normalization
        let minV = Infinity, maxV = -Infinity;
        for (const dp of derivedPoints) {
          if (dp.y < minV) minV = dp.y;
          if (dp.y > maxV) maxV = dp.y;
        }
        const range = Math.max(Math.abs(minV), Math.abs(maxV), 0.01) * 1.2;

        p.noFill();
        p.stroke(derivedColor);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = derivedColor;
        p.beginShape();
        for (const dp of derivedPoints) {
          p.vertex(
            derivedRect.x + dp.x * derivedRect.w,
            derivedRect.y + derivedRect.h / 2 - (dp.y / range) * (derivedRect.h / 2)
          );
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;

        // Playback indicator
        if (isPlayingBack) {
          const px = derivedRect.x + playbackTime * derivedRect.w;
          p.stroke(255, 200, 50);
          p.strokeWeight(1.5);
          p.line(px, derivedRect.y, px, derivedRect.y + derivedRect.h);
        }
      }

      // Axes labels for derived
      p.fill(100, 100, 130);
      p.noStroke();
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('time \u2192', derivedRect.x + derivedRect.w / 2, derivedRect.y + derivedRect.h + 5);
    };

    function drawButton(rect, label, color) {
      const hover = pointInRect(p.mouseX, p.mouseY, rect);
      p.fill(hover ? 40 : 25, hover ? 40 : 25, hover ? 60 : 45);
      p.stroke(color + (hover ? 'ff' : '80'));
      p.strokeWeight(1);
      p.rect(rect.x, rect.y, rect.w, rect.h, 5);
      p.noStroke();
      p.fill(color);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
    }

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Button clicks
      if (pointInRect(p.mouseX, p.mouseY, modeBtnRect)) {
        mode = mode === 'position' ? 'velocity' : 'position';
        drawingPoints = [];
        derivedPoints = [];
        playbackTime = 0;
        isPlayingBack = false;
        return;
      }
      if (pointInRect(p.mouseX, p.mouseY, clearBtnRect)) {
        drawingPoints = [];
        derivedPoints = [];
        playbackTime = 0;
        isPlayingBack = false;
        return;
      }
      if (pointInRect(p.mouseX, p.mouseY, playBtnRect)) {
        if (drawingPoints.length > 1) {
          isPlayingBack = true;
          playbackTime = 0;
        }
        return;
      }

      // Start drawing on graph
      if (pointInRect(p.mouseX, p.mouseY, graphRect)) {
        isDrawing = true;
        addDrawPoint();
      }
    };

    function addDrawPoint() {
      const nx = (p.mouseX - graphRect.x) / graphRect.w;
      const ny = 1 - (p.mouseY - graphRect.y) / graphRect.h;
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        drawingPoints.push({ x: nx, y: ny });
        computeDerived();
      }
    }

    p.mouseDragged = () => {
      if (isDrawing && pointInRect(p.mouseX, p.mouseY, graphRect)) {
        addDrawPoint();
      }
    };

    p.mouseReleased = () => {
      isDrawing = false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      updateLayout();
    };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
