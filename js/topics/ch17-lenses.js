// Chapter 17: Lenses — Thin Lens Image Formation with Principal Rays
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'lenses';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const PINK = [255, 0, 110];
  const PINK_HEX = '#ff006e';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function drawArrow(x, y1, y2, col, weight) {
      p.stroke(col[0], col[1], col[2]);
      p.strokeWeight(weight);
      p.line(x, y1, x, y2);
      const dir = y2 < y1 ? -1 : 1;
      p.line(x, y2, x - 5, y2 - 8 * dir);
      p.line(x, y2, x + 5, y2 - 8 * dir);
    }

    p.draw = () => {
      p.background(10, 10, 26);

      const f = engine.getParam('focalLength');
      const objDist = engine.getParam('objectDistance');
      const lensTypeParam = engine.getParam('lensType');
      const isConverging = lensTypeParam < 0.5;

      // Sign convention: distances positive to left of lens for object
      const fSigned = isConverging ? f : -f;

      const lensX = width * 0.45;
      const axisY = height * 0.5;
      const objHeight = 60;

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Thin Lens Equation: 1/f = 1/d\u1D62 + 1/d\u2092', width / 2, 8);

      // --- Draw principal axis ---
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(10, axisY, width - 10, axisY);

      // --- Draw lens ---
      p.stroke(PINK[0], PINK[1], PINK[2]);
      p.strokeWeight(2.5);
      p.drawingContext.shadowColor = PINK_HEX;
      p.drawingContext.shadowBlur = 12;
      p.noFill();
      const lensH = 140;
      if (isConverging) {
        // Double convex shape
        p.beginShape();
        for (let i = -lensH / 2; i <= lensH / 2; i += 2) {
          const bulge = 12 * Math.cos(i / lensH * Math.PI);
          p.vertex(lensX - bulge, axisY + i);
        }
        p.endShape();
        p.beginShape();
        for (let i = -lensH / 2; i <= lensH / 2; i += 2) {
          const bulge = 12 * Math.cos(i / lensH * Math.PI);
          p.vertex(lensX + bulge, axisY + i);
        }
        p.endShape();
        // Arrows at top and bottom pointing outward
        p.line(lensX - 6, axisY - lensH / 2, lensX, axisY - lensH / 2 - 8);
        p.line(lensX + 6, axisY - lensH / 2, lensX, axisY - lensH / 2 - 8);
        p.line(lensX - 6, axisY + lensH / 2, lensX, axisY + lensH / 2 + 8);
        p.line(lensX + 6, axisY + lensH / 2, lensX, axisY + lensH / 2 + 8);
      } else {
        // Double concave shape
        p.beginShape();
        for (let i = -lensH / 2; i <= lensH / 2; i += 2) {
          const bulge = 10 * Math.cos(i / lensH * Math.PI);
          p.vertex(lensX + bulge, axisY + i);
        }
        p.endShape();
        p.beginShape();
        for (let i = -lensH / 2; i <= lensH / 2; i += 2) {
          const bulge = 10 * Math.cos(i / lensH * Math.PI);
          p.vertex(lensX - bulge, axisY + i);
        }
        p.endShape();
        // Inward-pointing arrows
        p.line(lensX - 6, axisY - lensH / 2 - 8, lensX, axisY - lensH / 2);
        p.line(lensX + 6, axisY - lensH / 2 - 8, lensX, axisY - lensH / 2);
        p.line(lensX - 6, axisY + lensH / 2 + 8, lensX, axisY + lensH / 2);
        p.line(lensX + 6, axisY + lensH / 2 + 8, lensX, axisY + lensH / 2);
      }
      p.drawingContext.shadowBlur = 0;

      // --- Draw focal points ---
      p.noStroke();
      p.fill(0, 245, 212, 200);
      p.drawingContext.shadowColor = '#00f5d4';
      p.drawingContext.shadowBlur = 12;
      p.ellipse(lensX - f, axisY, 10, 10);
      p.ellipse(lensX + f, axisY, 10, 10);
      p.drawingContext.shadowBlur = 0;
      p.fill(0, 245, 212);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('F', lensX - f, axisY + 8);
      p.text("F'", lensX + f, axisY + 8);

      // --- Draw 2F points ---
      p.fill(255, 255, 255, 60);
      p.ellipse(lensX - 2 * f, axisY, 6, 6);
      p.ellipse(lensX + 2 * f, axisY, 6, 6);
      p.textSize(9);
      p.fill(255, 255, 255, 80);
      p.text('2F', lensX - 2 * f, axisY + 8);
      p.text("2F'", lensX + 2 * f, axisY + 8);

      // --- Draw object (arrow) ---
      const objX = lensX - objDist;
      const objTopY = axisY - objHeight;

      p.drawingContext.shadowColor = '#00ff88';
      p.drawingContext.shadowBlur = 8;
      drawArrow(objX, axisY, objTopY, [0, 255, 136], 3);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Object', objX, objTopY - 5);

      // --- Thin lens equation: 1/f = 1/do + 1/di ---
      // di = (f * do) / (do - f)
      const di = (fSigned * objDist) / (objDist - fSigned);
      const magnification = -di / objDist;
      const imgHeight = magnification * objHeight;

      // Image position
      const imgX = lensX + di;
      const imgTopY = axisY - imgHeight;
      const isVirtual = di < 0;
      const isReal = !isVirtual;

      // --- Draw principal rays ---
      const rayAlpha = 200;

      // Ray 1: Parallel to axis, then through F' (converging) or away from F' (diverging)
      p.strokeWeight(1.5);
      p.stroke(255, 220, 50, rayAlpha);
      p.drawingContext.shadowColor = 'rgba(255,220,50,0.3)';
      p.drawingContext.shadowBlur = 4;
      // From object top, horizontal to lens
      p.line(objX, objTopY, lensX, objTopY);
      if (isConverging) {
        // Through F' on other side
        if (isReal) {
          p.line(lensX, objTopY, imgX, imgTopY);
          // Extend beyond
          const extX = imgX + (imgX - lensX) * 0.3;
          const extY = imgTopY + (imgTopY - objTopY) * 0.3;
          p.stroke(255, 220, 50, 80);
          p.line(imgX, imgTopY, extX, extY);
        } else {
          // Ray goes through F', extend to edge
          const slope = (objTopY - axisY) / (lensX - (lensX + f));
          const farX = width - 10;
          const farY = objTopY + slope * (farX - lensX);
          p.line(lensX, objTopY, farX, farY);
          // Virtual extension back (dashed)
          p.stroke(255, 220, 50, 80);
          p.drawingContext.setLineDash([4, 4]);
          p.line(lensX, objTopY, imgX, imgTopY);
          p.drawingContext.setLineDash([]);
        }
      } else {
        // Diverging: ray bends away from F on same side
        const slope = (objTopY - axisY) / (lensX - (lensX - f));
        const farX = width - 10;
        const farY = objTopY + slope * (farX - lensX);
        p.line(lensX, objTopY, farX, farY);
        // Virtual extension back
        p.stroke(255, 220, 50, 80);
        p.drawingContext.setLineDash([4, 4]);
        p.line(lensX, objTopY, imgX, imgTopY);
        p.drawingContext.setLineDash([]);
      }

      // Ray 2: Through center of lens (undeviated)
      p.stroke(0, 200, 255, rayAlpha);
      p.drawingContext.setLineDash([]);
      p.drawingContext.shadowColor = 'rgba(0,200,255,0.3)';
      const centralSlope = (objTopY - axisY) / (objX - lensX);
      const centralFarX = width - 10;
      const centralFarY = axisY + centralSlope * (centralFarX - lensX);
      p.line(objX, objTopY, centralFarX, centralFarY);

      // Ray 3: Through F (converging) or toward F' (diverging), then parallel
      p.stroke(PINK[0], PINK[1], PINK[2], rayAlpha);
      p.drawingContext.shadowColor = 'rgba(255,0,110,0.3)';
      if (isConverging) {
        // From object top, aimed at F on object side, hits lens, then parallel
        const slopeToF = (objTopY - axisY) / (objX - (lensX - f));
        const lensHitY = objTopY + slopeToF * (lensX - objX);
        p.line(objX, objTopY, lensX, lensHitY);
        if (isReal) {
          p.line(lensX, lensHitY, imgX, imgTopY);
          const extX = imgX + (imgX - lensX) * 0.3;
          p.stroke(PINK[0], PINK[1], PINK[2], 80);
          p.line(imgX, imgTopY, extX, lensHitY);
        } else {
          p.line(lensX, lensHitY, width - 10, lensHitY);
          // Virtual back
          p.stroke(PINK[0], PINK[1], PINK[2], 80);
          p.drawingContext.setLineDash([4, 4]);
          p.line(lensX, lensHitY, imgX, imgTopY);
          p.drawingContext.setLineDash([]);
        }
      } else {
        // From object top, aimed toward F' on other side, hits lens, then parallel
        const slopeToFp = (objTopY - axisY) / (objX - (lensX + f));
        const lensHitY = objTopY + slopeToFp * (lensX - objX);
        p.line(objX, objTopY, lensX, lensHitY);
        p.line(lensX, lensHitY, width - 10, lensHitY);
        // Virtual extension
        p.stroke(PINK[0], PINK[1], PINK[2], 80);
        p.drawingContext.setLineDash([4, 4]);
        p.line(lensX, lensHitY, imgX, imgTopY);
        p.drawingContext.setLineDash([]);
      }
      p.drawingContext.setLineDash([]);
      p.drawingContext.shadowBlur = 0;

      // --- Draw image (arrow) ---
      if (Math.abs(di) < 2000 && Math.abs(imgHeight) < 500) {
        const imgColor = isVirtual ? [255, 255, 100] : [255, 100, 100];
        p.drawingContext.shadowColor = isVirtual ? '#ffff64' : '#ff6464';
        p.drawingContext.shadowBlur = 8;
        if (isVirtual) {
          p.drawingContext.setLineDash([6, 4]);
        }
        drawArrow(imgX, axisY, imgTopY, imgColor, 3);
        p.drawingContext.setLineDash([]);
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(imgColor[0], imgColor[1], imgColor[2]);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        const imgLabel = isVirtual ? 'Virtual Image' : 'Real Image';
        const labelY = imgHeight > 0 ? axisY + imgHeight + 15 : imgTopY - 5;
        p.text(imgLabel, imgX, labelY);
      }

      // --- Info panel ---
      const panelX = width - 230;
      const panelY = 40;
      p.fill(15, 15, 35, 220);
      p.stroke(PINK[0], PINK[1], PINK[2], 60);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 215, 168, 8);
      p.noStroke();

      p.fill(PINK[0], PINK[1], PINK[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text(isConverging ? 'Converging Lens' : 'Diverging Lens', panelX + 10, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('f = ' + f.toFixed(0) + ' px', panelX + 10, panelY + 28);
      p.text('d\u2092 = ' + objDist.toFixed(0) + ' px', panelX + 10, panelY + 44);
      p.text('d\u1D62 = ' + di.toFixed(1) + ' px', panelX + 10, panelY + 60);
      p.text('M = ' + magnification.toFixed(2), panelX + 10, panelY + 76);

      p.fill(0, 255, 136);
      p.text('Image: ' + (isVirtual ? 'Virtual' : 'Real'), panelX + 10, panelY + 96);
      p.text(magnification > 0 ? 'Upright' : 'Inverted', panelX + 10, panelY + 112);
      p.text('|M| = ' + Math.abs(magnification).toFixed(2) +
        (Math.abs(magnification) > 1 ? ' (enlarged)' : ' (reduced)'), panelX + 10, panelY + 128);

      // Ray legend
      p.textSize(10);
      p.fill(255, 220, 50);
      p.text('\u2500 Parallel ray', panelX + 10, panelY + 148);
      p.fill(0, 200, 255);
      p.text('\u2500 Central ray', panelX + 80, panelY + 148);
      p.fill(PINK[0], PINK[1], PINK[2]);
      p.text('\u2500 Focal ray', panelX + 155, panelY + 148);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Move the object and change focal length to see image formation', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { focalLength: 100, objectDistance: 200, lensType: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'focalLength', label: 'Focal Length', min: 50, max: 200, step: 5, value: 100, unit: 'px' },
    { name: 'objectDistance', label: 'Object Distance', min: 50, max: 400, step: 5, value: 200, unit: 'px' },
    { name: 'lensType', label: 'Lens Type', min: 0, max: 1, step: 1, value: 0, unit: '(0=converging, 1=diverging)' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
