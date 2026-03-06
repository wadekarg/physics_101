// Chapter 17: Reflection & Mirrors — Ray tracing with flat and curved mirrors
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'reflection-mirrors';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const PINK = [255, 0, 110];      // #ff006e — optics accent
  const PINK_HEX = '#ff006e';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const curvature = engine.getParam('mirrorCurvature');
      const rayAngleDeg = engine.getParam('rayAngle');
      const rayAngle = rayAngleDeg * Math.PI / 180;

      const mirrorX = width * 0.55;
      const mirrorCenterY = height / 2;
      const mirrorHeight = 260;

      // --- Draw title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Law of Reflection: \u03B8\u1D62 = \u03B8\u1D63', width / 2, 8);

      // --- Compute mirror shape ---
      // curvature: 0 = flat, positive = concave, negative = convex
      const R = curvature !== 0 ? 300 / Math.abs(curvature) : Infinity;
      const focalLength = curvature !== 0 ? R / 2 : Infinity;
      const mirrorPoints = [];
      const numPts = 80;

      for (let i = 0; i <= numPts; i++) {
        const t = (i / numPts - 0.5) * mirrorHeight;
        let mx, my;
        if (Math.abs(curvature) < 0.01) {
          // flat mirror
          mx = mirrorX;
          my = mirrorCenterY + t;
        } else {
          // curved mirror: circle segment
          const centerX = curvature > 0 ? mirrorX + R : mirrorX - R;
          const angle = Math.asin(Math.min(1, Math.max(-1, t / R)));
          mx = centerX + (curvature > 0 ? -1 : 1) * Math.sqrt(Math.max(0, R * R - t * t));
          my = mirrorCenterY + t;
        }
        mirrorPoints.push({ x: mx, y: my });
      }

      // --- Draw mirror ---
      p.noFill();
      p.strokeWeight(3);
      p.stroke(PINK[0], PINK[1], PINK[2]);
      p.drawingContext.shadowColor = PINK_HEX;
      p.drawingContext.shadowBlur = 15;
      p.beginShape();
      for (const pt of mirrorPoints) {
        p.vertex(pt.x, pt.y);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Hatch marks behind mirror
      p.strokeWeight(1);
      p.stroke(PINK[0], PINK[1], PINK[2], 80);
      for (let i = 0; i < mirrorPoints.length; i += 4) {
        const pt = mirrorPoints[i];
        p.line(pt.x, pt.y, pt.x + 10, pt.y - 6);
      }

      // --- Compute ray-mirror intersection ---
      // Ray origin: left side
      const rayOriginX = 40;
      const rayOriginY = mirrorCenterY;

      // Ray direction
      const rayDirX = Math.cos(-rayAngle);
      const rayDirY = Math.sin(-rayAngle);

      // Find intersection with mirror (iterative for curved mirrors)
      let hitPoint = null;
      let hitNormal = null;
      let minDist = Infinity;

      for (let i = 1; i < mirrorPoints.length; i++) {
        const p1 = mirrorPoints[i - 1];
        const p2 = mirrorPoints[i];
        // Ray-segment intersection
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const denom = rayDirX * dy - rayDirY * dx;
        if (Math.abs(denom) < 1e-10) continue;
        const t = ((p1.x - rayOriginX) * dy - (p1.y - rayOriginY) * dx) / denom;
        const u = ((p1.x - rayOriginX) * rayDirY - (p1.y - rayOriginY) * rayDirX) / denom;
        if (t > 10 && u >= 0 && u <= 1) {
          if (t < minDist) {
            minDist = t;
            hitPoint = {
              x: rayOriginX + rayDirX * t,
              y: rayOriginY + rayDirY * t
            };
            // Normal: perpendicular to segment, pointing left (toward source)
            const segLen = Math.sqrt(dx * dx + dy * dy);
            let nx = -dy / segLen;
            let ny = dx / segLen;
            // Ensure normal points toward ray source (left)
            if (nx > 0) { nx = -nx; ny = -ny; }
            hitNormal = { x: nx, y: ny };
          }
        }
      }

      if (hitPoint && hitNormal) {
        // --- Draw incident ray ---
        p.strokeWeight(2.5);
        p.stroke(255, 220, 50);
        p.drawingContext.shadowColor = '#ffdc32';
        p.drawingContext.shadowBlur = 10;
        p.line(rayOriginX, rayOriginY, hitPoint.x, hitPoint.y);
        p.drawingContext.shadowBlur = 0;

        // --- Draw normal at hit point ---
        const normalLen = 80;
        p.strokeWeight(1);
        p.stroke(255, 255, 255, 120);
        p.drawingContext.setLineDash([5, 5]);
        p.line(
          hitPoint.x - hitNormal.x * normalLen,
          hitPoint.y - hitNormal.y * normalLen,
          hitPoint.x + hitNormal.x * normalLen,
          hitPoint.y + hitNormal.y * normalLen
        );
        p.drawingContext.setLineDash([]);

        // --- Compute reflected ray ---
        // r = d - 2(d.n)n
        const dotDN = rayDirX * hitNormal.x + rayDirY * hitNormal.y;
        const refDirX = rayDirX - 2 * dotDN * hitNormal.x;
        const refDirY = rayDirY - 2 * dotDN * hitNormal.y;

        // Draw reflected ray
        p.strokeWeight(2.5);
        p.stroke(PINK[0], PINK[1], PINK[2]);
        p.drawingContext.shadowColor = PINK_HEX;
        p.drawingContext.shadowBlur = 10;
        const refEndX = hitPoint.x + refDirX * 500;
        const refEndY = hitPoint.y + refDirY * 500;
        p.line(hitPoint.x, hitPoint.y, refEndX, refEndY);
        p.drawingContext.shadowBlur = 0;

        // --- Draw angle arcs ---
        const arcRadius = 40;
        // Angle of incidence (between incoming ray reversed and normal)
        const incAngle = Math.acos(Math.min(1, Math.max(-1,
          (-rayDirX) * hitNormal.x + (-rayDirY) * hitNormal.y
        )));
        // Angle of reflection
        const refAngle = Math.acos(Math.min(1, Math.max(-1,
          refDirX * hitNormal.x + refDirY * hitNormal.y
        )));

        // Draw incidence angle arc
        const normalAngle = Math.atan2(hitNormal.y, hitNormal.x);
        const incRayAngle = Math.atan2(-rayDirY, -rayDirX);
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(255, 220, 50, 180);
        p.arc(hitPoint.x, hitPoint.y, arcRadius * 2, arcRadius * 2,
          Math.min(normalAngle, incRayAngle), Math.max(normalAngle, incRayAngle));

        // Draw reflection angle arc
        const refRayAngle = Math.atan2(refDirY, refDirX);
        p.stroke(PINK[0], PINK[1], PINK[2], 180);
        p.arc(hitPoint.x, hitPoint.y, arcRadius * 2 + 6, arcRadius * 2 + 6,
          Math.min(normalAngle, refRayAngle), Math.max(normalAngle, refRayAngle));

        // --- Hit point glow ---
        p.noStroke();
        p.fill(255, 255, 255, 180);
        p.drawingContext.shadowColor = '#ffffff';
        p.drawingContext.shadowBlur = 20;
        p.ellipse(hitPoint.x, hitPoint.y, 8, 8);
        p.drawingContext.shadowBlur = 0;

        // --- Angle labels ---
        const angleDeg = (incAngle * 180 / Math.PI).toFixed(1);
        p.fill(255, 220, 50);
        p.noStroke();
        p.textSize(13);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('\u03B8\u1D62 = ' + angleDeg + '\u00B0', hitPoint.x - 60, hitPoint.y - 50);
        p.fill(PINK[0], PINK[1], PINK[2]);
        p.text('\u03B8\u1D63 = ' + angleDeg + '\u00B0', hitPoint.x - 60, hitPoint.y + 50);
      } else {
        // Draw ray that misses
        p.strokeWeight(2.5);
        p.stroke(255, 220, 50);
        p.drawingContext.shadowColor = '#ffdc32';
        p.drawingContext.shadowBlur = 10;
        p.line(rayOriginX, rayOriginY, rayOriginX + rayDirX * 800, rayOriginY + rayDirY * 800);
        p.drawingContext.shadowBlur = 0;
      }

      // --- Draw focal point for curved mirrors ---
      if (Math.abs(curvature) > 0.01) {
        const focalX = curvature > 0 ? mirrorX - focalLength : mirrorX + focalLength;
        p.noStroke();
        p.fill(0, 245, 212, 200);
        p.drawingContext.shadowColor = '#00f5d4';
        p.drawingContext.shadowBlur = 15;
        p.ellipse(focalX, mirrorCenterY, 10, 10);
        p.drawingContext.shadowBlur = 0;
        p.fill(0, 245, 212);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('F', focalX, mirrorCenterY + 10);

        // Draw center of curvature
        const centerCurvX = curvature > 0 ? mirrorX - R : mirrorX + R;
        p.fill(255, 255, 255, 100);
        p.ellipse(centerCurvX, mirrorCenterY, 6, 6);
        p.textSize(10);
        p.text('C', centerCurvX, mirrorCenterY + 10);
      }

      // --- Draw principal axis ---
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([3, 6]);
      p.line(30, mirrorCenterY, width - 30, mirrorCenterY);
      p.drawingContext.setLineDash([]);

      // --- Legend ---
      p.noStroke();
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.fill(255, 220, 50);
      p.text('\u2500 Incident ray', 15, height - 60);
      p.fill(PINK[0], PINK[1], PINK[2]);
      p.text('\u2500 Reflected ray', 15, height - 44);
      p.fill(255, 255, 255, 120);
      p.text('--- Normal', 15, height - 28);

      // Mirror type label
      let mirrorLabel = 'Flat Mirror';
      if (curvature > 0.01) mirrorLabel = 'Concave Mirror (R=' + R.toFixed(0) + ')';
      else if (curvature < -0.01) mirrorLabel = 'Convex Mirror (R=' + R.toFixed(0) + ')';
      p.fill(PINK[0], PINK[1], PINK[2]);
      p.textSize(13);
      p.textAlign(p.RIGHT, p.TOP);
      p.text(mirrorLabel, width - 15, height - 28);

      // --- Info panel ---
      p.fill(15, 15, 35, 200);
      p.stroke(PINK[0], PINK[1], PINK[2], 60);
      p.strokeWeight(1);
      p.rect(width - 220, 40, 200, 80, 8);
      p.noStroke();
      p.fill(PINK[0], PINK[1], PINK[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Law of Reflection', width - 210, 48);
      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('\u03B8 incidence = \u03B8 reflection', width - 210, 66);
      if (Math.abs(curvature) > 0.01) {
        p.text('f = R/2 = ' + focalLength.toFixed(1) + ' px', width - 210, 82);
        p.text('R = ' + R.toFixed(1) + ' px', width - 210, 98);
      }

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust mirror curvature and ray angle to explore reflection', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mirrorCurvature: 0, rayAngle: 30 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mirrorCurvature', label: 'Mirror Curvature', min: -1, max: 1, step: 0.05, value: 0, unit: '(-1=convex, +1=concave)' },
    { name: 'rayAngle', label: 'Ray Angle', min: 0, max: 80, step: 1, value: 30, unit: '\u00B0' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
