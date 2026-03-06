// Chapter 17: Refraction — Snell's Law & Total Internal Reflection
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'refraction';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const PINK = [255, 0, 110];
  const PINK_HEX = '#ff006e';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    function wavelengthToRGB(wl) {
      // Convert wavelength (nm) to approximate RGB
      let r = 0, g = 0, b = 0;
      if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
      else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
      else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
      else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
      else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
      else if (wl >= 645 && wl <= 700) { r = 1; }
      return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const n1 = engine.getParam('n1');
      const n2 = engine.getParam('n2');
      const incidentAngleDeg = engine.getParam('incidentAngle');
      const theta1 = incidentAngleDeg * Math.PI / 180;

      const interfaceY = height / 2;
      const interfaceX = width * 0.45;

      // Compute wavelength for display color (use 550nm base, shift with n2)
      const baseWL = 550;
      const beamColor = wavelengthToRGB(baseWL);
      const beamHex = `rgb(${beamColor[0]},${beamColor[1]},${beamColor[2]})`;

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Snell's Law: n\u2081 sin\u03B8\u2081 = n\u2082 sin\u03B8\u2082", width / 2, 8);

      // --- Draw media ---
      // Medium 1 (top) - lighter
      p.noStroke();
      p.fill(20, 20, 50, 200);
      p.rect(0, 0, width, interfaceY);
      // Medium 2 (bottom) - denser appearance
      p.fill(30, 50, 80, 200);
      p.rect(0, interfaceY, width, height - interfaceY);

      // Medium labels
      p.fill(200, 200, 220);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Medium 1 (n\u2081 = ' + n1.toFixed(2) + ')', 15, 35);
      p.text('Medium 2 (n\u2082 = ' + n2.toFixed(2) + ')', 15, interfaceY + 15);

      // --- Draw interface ---
      p.stroke(PINK[0], PINK[1], PINK[2], 150);
      p.strokeWeight(2);
      p.drawingContext.shadowColor = PINK_HEX;
      p.drawingContext.shadowBlur = 8;
      p.line(0, interfaceY, width, interfaceY);
      p.drawingContext.shadowBlur = 0;

      // --- Draw normal ---
      p.stroke(255, 255, 255, 80);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([5, 5]);
      p.line(interfaceX, interfaceY - 160, interfaceX, interfaceY + 160);
      p.drawingContext.setLineDash([]);

      // Normal label
      p.noStroke();
      p.fill(255, 255, 255, 100);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('normal', interfaceX + 5, interfaceY - 155);

      // --- Incident ray ---
      // Ray comes from upper-left toward interface point
      const rayLen = 200;
      const incStartX = interfaceX - rayLen * Math.sin(theta1);
      const incStartY = interfaceY - rayLen * Math.cos(theta1);

      p.strokeWeight(3);
      p.stroke(beamColor[0], beamColor[1], beamColor[2]);
      p.drawingContext.shadowColor = beamHex;
      p.drawingContext.shadowBlur = 12;
      p.line(incStartX, incStartY, interfaceX, interfaceY);

      // Arrow on incident ray
      const arrowSize = 10;
      const midIncX = (incStartX + interfaceX) / 2;
      const midIncY = (incStartY + interfaceY) / 2;
      const incDirX = Math.sin(theta1);
      const incDirY = Math.cos(theta1);
      p.line(midIncX - arrowSize * (incDirX + incDirY * 0.4),
             midIncY - arrowSize * (incDirY - incDirX * 0.4),
             midIncX, midIncY);
      p.line(midIncX - arrowSize * (incDirX - incDirY * 0.4),
             midIncY - arrowSize * (incDirY + incDirX * 0.4),
             midIncX, midIncY);

      // --- Compute refraction (Snell's law) ---
      const sinTheta2 = (n1 / n2) * Math.sin(theta1);
      const criticalAngleDeg = n1 < n2 ? 90 : (Math.asin(n2 / n1) * 180 / Math.PI);
      const isTotalReflection = Math.abs(sinTheta2) > 1;

      if (!isTotalReflection) {
        // Refracted ray
        const theta2 = Math.asin(sinTheta2);
        const refEndX = interfaceX + rayLen * Math.sin(theta2);
        const refEndY = interfaceY + rayLen * Math.cos(theta2);

        p.strokeWeight(3);
        p.stroke(beamColor[0], beamColor[1], beamColor[2]);
        p.drawingContext.shadowColor = beamHex;
        p.drawingContext.shadowBlur = 12;
        p.line(interfaceX, interfaceY, refEndX, refEndY);
        p.drawingContext.shadowBlur = 0;

        // --- Partial reflection (always present) ---
        const reflEndX = interfaceX - rayLen * Math.sin(theta1);
        const reflEndY = interfaceY - rayLen * Math.cos(theta1);
        // Fresnel approx for reflectance
        const cosI = Math.cos(theta1);
        const cosT = Math.cos(theta2);
        const Rs = Math.pow((n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT), 2);
        const reflAlpha = Math.min(200, Math.max(30, Rs * 255));

        p.strokeWeight(1.5);
        p.stroke(beamColor[0], beamColor[1], beamColor[2], reflAlpha);
        p.drawingContext.shadowBlur = 4;
        // Reflect about normal: flip the x-component
        const reflRayX = interfaceX + rayLen * Math.sin(theta1);
        const reflRayY = interfaceY - rayLen * Math.cos(theta1);
        p.line(interfaceX, interfaceY, reflRayX, reflRayY);
        p.drawingContext.shadowBlur = 0;

        // --- Angle arcs ---
        const arcR = 50;
        // Incident angle arc (from normal upward)
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(255, 220, 50, 180);
        const startAngleInc = -Math.PI / 2 - theta1;
        const endAngleInc = -Math.PI / 2;
        p.arc(interfaceX, interfaceY, arcR * 2, arcR * 2, startAngleInc, endAngleInc);

        // Refracted angle arc
        p.stroke(PINK[0], PINK[1], PINK[2], 180);
        const startAngleRef = Math.PI / 2;
        const endAngleRef = Math.PI / 2 + theta2;
        p.arc(interfaceX, interfaceY, arcR * 2 + 6, arcR * 2 + 6, startAngleRef, endAngleRef);

        // Angle labels
        p.noStroke();
        p.fill(255, 220, 50);
        p.textSize(13);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('\u03B8\u2081 = ' + incidentAngleDeg.toFixed(1) + '\u00B0', interfaceX - 35, interfaceY - 40);

        p.fill(PINK[0], PINK[1], PINK[2]);
        p.textAlign(p.RIGHT, p.CENTER);
        const theta2Deg = (theta2 * 180 / Math.PI).toFixed(1);
        p.text('\u03B8\u2082 = ' + theta2Deg + '\u00B0', interfaceX - 35, interfaceY + 45);

      } else {
        // --- Total internal reflection ---
        p.strokeWeight(3);
        p.stroke(beamColor[0], beamColor[1], beamColor[2]);
        p.drawingContext.shadowColor = beamHex;
        p.drawingContext.shadowBlur = 15;
        const reflRayX = interfaceX + rayLen * Math.sin(theta1);
        const reflRayY = interfaceY - rayLen * Math.cos(theta1);
        p.line(interfaceX, interfaceY, reflRayX, reflRayY);
        p.drawingContext.shadowBlur = 0;

        // TIR label
        p.noStroke();
        p.fill(255, 80, 80);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.drawingContext.shadowColor = '#ff5050';
        p.drawingContext.shadowBlur = 10;
        p.text('TOTAL INTERNAL REFLECTION', width / 2, interfaceY + 60);
        p.drawingContext.shadowBlur = 0;

        // Still show incident angle
        p.fill(255, 220, 50);
        p.textSize(13);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('\u03B8\u2081 = ' + incidentAngleDeg.toFixed(1) + '\u00B0', interfaceX - 35, interfaceY - 40);
      }

      // --- Glowing hit point ---
      p.noStroke();
      p.fill(255, 255, 255, 220);
      p.drawingContext.shadowColor = '#ffffff';
      p.drawingContext.shadowBlur = 20;
      p.ellipse(interfaceX, interfaceY, 8, 8);
      p.drawingContext.shadowBlur = 0;

      // --- Info panel ---
      const panelX = width - 250;
      const panelY = 40;
      p.fill(15, 15, 35, 220);
      p.stroke(PINK[0], PINK[1], PINK[2], 60);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 230, 130, 8);
      p.noStroke();

      p.fill(PINK[0], PINK[1], PINK[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text("Snell's Law", panelX + 10, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('n\u2081 = ' + n1.toFixed(2), panelX + 10, panelY + 28);
      p.text('n\u2082 = ' + n2.toFixed(2), panelX + 10, panelY + 44);
      p.text('\u03B8\u2081 = ' + incidentAngleDeg.toFixed(1) + '\u00B0', panelX + 10, panelY + 60);

      if (!isTotalReflection) {
        const theta2 = Math.asin(sinTheta2);
        p.text('\u03B8\u2082 = ' + (theta2 * 180 / Math.PI).toFixed(1) + '\u00B0', panelX + 10, panelY + 76);
      } else {
        p.fill(255, 80, 80);
        p.text('\u03B8\u2082 = N/A (TIR)', panelX + 10, panelY + 76);
      }

      p.fill(200, 200, 220);
      if (n1 > n2) {
        p.text('Critical angle: ' + criticalAngleDeg.toFixed(1) + '\u00B0', panelX + 10, panelY + 96);
      } else {
        p.text('No TIR (n\u2081 \u2264 n\u2082)', panelX + 10, panelY + 96);
      }
      p.text('n\u2081 sin\u03B8\u2081 = ' + (n1 * Math.sin(theta1)).toFixed(3), panelX + 10, panelY + 112);

      // --- Legend ---
      p.noStroke();
      p.textSize(11);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.fill(beamColor[0], beamColor[1], beamColor[2]);
      p.text('\u2500 Light beam', 15, height - 38);
      p.fill(255, 255, 255, 100);
      p.text('--- Normal', 15, height - 22);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust refractive indices and angle to explore refraction and total internal reflection', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { n1: 1.5, n2: 1.0, incidentAngle: 30 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'n1', label: 'n\u2081 (Medium 1)', min: 1, max: 2.5, step: 0.01, value: 1.5, unit: '' },
    { name: 'n2', label: 'n\u2082 (Medium 2)', min: 1, max: 2.5, step: 0.01, value: 1.0, unit: '' },
    { name: 'incidentAngle', label: 'Incident Angle', min: 0, max: 89, step: 1, value: 30, unit: '\u00B0' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
