// Chapter 12: Capacitors — Parallel Plate Capacitor Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'capacitors';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    const epsilon0 = 8.854e-12; // F/m
    let time = 0;

    // Particles representing charges on plates
    let posCharges = [];
    let negCharges = [];
    let fieldParticles = [];

    function initParticles(numCharges) {
      posCharges = [];
      negCharges = [];
      fieldParticles = [];
      for (let i = 0; i < numCharges; i++) {
        posCharges.push({ yOff: Math.random(), drift: Math.random() * 0.5 + 0.5 });
        negCharges.push({ yOff: Math.random(), drift: Math.random() * 0.5 + 0.5 });
      }
      for (let i = 0; i < 20; i++) {
        fieldParticles.push({ x: Math.random(), y: Math.random(), speed: Math.random() * 0.3 + 0.2 });
      }
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      initParticles(15);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) time += 0.016 * engine.speed;

      const plateArea = engine.getParam('plateArea');   // cm²
      const distance = engine.getParam('distance');     // mm
      const dielectric = engine.getParam('dielectric'); // κ
      const voltage = engine.getParam('voltage');       // V

      // Physics calculations
      const areaM2 = plateArea * 1e-4;       // cm² to m²
      const distM = distance * 1e-3;         // mm to m
      const capacitance = dielectric * epsilon0 * areaM2 / distM; // Farads
      const charge = capacitance * voltage;   // Coulombs
      const energy = 0.5 * capacitance * voltage * voltage; // Joules
      const eField = voltage / distM;         // V/m

      // Capacitor geometry
      const centerX = width * 0.4;
      const centerY = height / 2;
      const plateHeight = Math.max(60, plateArea * 18);
      const plateGap = Math.max(30, distance * 8);
      const plateThick = 8;

      const leftPlateX = centerX - plateGap / 2;
      const rightPlateX = centerX + plateGap / 2;

      // Draw dielectric between plates
      if (dielectric > 1) {
        p.noStroke();
        const alpha = Math.min(80, (dielectric - 1) * 12);
        p.fill(139, 92, 246, alpha);
        p.rect(leftPlateX + plateThick, centerY - plateHeight / 2, plateGap - plateThick, plateHeight);

        p.fill(139, 92, 246, 50);
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('κ = ' + dielectric.toFixed(1), centerX, centerY + plateHeight / 2 + 15);
      }

      // Draw electric field lines between plates
      if (voltage > 0) {
        const numFieldLines = Math.min(12, Math.max(4, Math.round(voltage)));
        p.stroke(139, 92, 246, 60);
        p.strokeWeight(1);
        for (let i = 0; i < numFieldLines; i++) {
          const yPos = centerY - plateHeight / 2 + (i + 0.5) * plateHeight / numFieldLines;
          p.drawingContext.setLineDash([3, 5]);
          p.line(leftPlateX + plateThick + 4, yPos, rightPlateX - 4, yPos);
          p.drawingContext.setLineDash([]);

          // Arrow in middle
          const midX = centerX;
          p.line(midX + 4, yPos, midX, yPos - 3);
          p.line(midX + 4, yPos, midX, yPos + 3);
        }

        // Animated field particles
        p.noStroke();
        for (const fp of fieldParticles) {
          if (engine.isPlaying) fp.x += fp.speed * 0.01;
          if (fp.x > 1) fp.x = 0;
          const px = leftPlateX + plateThick + 6 + fp.x * (plateGap - plateThick - 12);
          const py = centerY - plateHeight / 2 + fp.y * plateHeight;
          p.fill(139, 92, 246, 120);
          p.ellipse(px, py, 3, 3);
        }
      }

      // Draw left plate (positive)
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#ff5050';
      p.noStroke();
      p.fill(200, 80, 80);
      p.rect(leftPlateX, centerY - plateHeight / 2, plateThick, plateHeight, 2);
      p.drawingContext.shadowBlur = 0;

      // Draw right plate (negative)
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#5082ff';
      p.fill(80, 130, 255);
      p.rect(rightPlateX, centerY - plateHeight / 2, plateThick, plateHeight, 2);
      p.drawingContext.shadowBlur = 0;

      // Draw charges on plates
      const numVisCharges = Math.min(15, Math.max(2, Math.round(voltage * 1.2)));
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      for (let i = 0; i < numVisCharges && i < posCharges.length; i++) {
        const yPos = centerY - plateHeight / 2 + 10 + posCharges[i].yOff * (plateHeight - 20);
        const bob = Math.sin(time * posCharges[i].drift * 3) * 2;
        p.fill(255, 120, 120);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#ff5050';
        p.text('+', leftPlateX + plateThick / 2 + bob, yPos);
        p.drawingContext.shadowBlur = 0;
      }
      for (let i = 0; i < numVisCharges && i < negCharges.length; i++) {
        const yPos = centerY - plateHeight / 2 + 10 + negCharges[i].yOff * (plateHeight - 20);
        const bob = Math.sin(time * negCharges[i].drift * 3 + 1) * 2;
        p.fill(120, 160, 255);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#5082ff';
        p.text('−', rightPlateX + plateThick / 2 + bob, yPos);
        p.drawingContext.shadowBlur = 0;
      }

      // Draw wires and battery
      p.stroke(180, 180, 200);
      p.strokeWeight(2);
      // Left wire up
      p.line(leftPlateX + plateThick / 2, centerY - plateHeight / 2, leftPlateX + plateThick / 2, centerY - plateHeight / 2 - 40);
      p.line(leftPlateX + plateThick / 2, centerY - plateHeight / 2 - 40, centerX, centerY - plateHeight / 2 - 40);
      // Right wire up
      p.line(rightPlateX + plateThick / 2, centerY - plateHeight / 2, rightPlateX + plateThick / 2, centerY - plateHeight / 2 - 40);
      p.line(rightPlateX + plateThick / 2, centerY - plateHeight / 2 - 40, centerX, centerY - plateHeight / 2 - 40);

      // Battery symbol
      const batY = centerY - plateHeight / 2 - 40;
      p.stroke(255, 200, 50);
      p.strokeWeight(3);
      p.line(centerX - 8, batY - 8, centerX - 8, batY + 8);
      p.strokeWeight(2);
      p.line(centerX + 4, batY - 4, centerX + 4, batY + 4);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(voltage.toFixed(0) + 'V', centerX, batY - 12);

      // Info panel
      const panelX = width - 230;
      const panelY = 50;
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 218, 210, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Capacitor Properties', panelX + 12, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      const lines = [
        'Plate Area: ' + plateArea.toFixed(1) + ' cm²',
        'Separation: ' + distance.toFixed(1) + ' mm',
        'Dielectric κ: ' + dielectric.toFixed(1),
        'Voltage: ' + voltage.toFixed(1) + ' V',
        '',
        'C = κε₀A/d',
        'C = ' + formatSI(capacitance, 'F'),
        'Q = CV = ' + formatSI(charge, 'C'),
        'E = V/d = ' + formatSI(eField, 'V/m'),
        'U = ½CV² = ' + formatSI(energy, 'J')
      ];
      for (let i = 0; i < lines.length; i++) {
        const isFormula = i >= 5;
        p.fill(isFormula ? p.color(139, 92, 246) : p.color(200, 200, 220));
        p.text(lines[i], panelX + 12, panelY + 30 + i * 17);
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Parallel Plate Capacitor: C = κε₀A/d', width / 2, 10);

      // Bottom formula
      p.fill(139, 92, 246, 150);
      p.textSize(13);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Energy Stored: U = ½CV²  |  Electric Field: E = V/d', width / 2, height - 10);
    };

    function formatSI(value, unit) {
      if (Math.abs(value) === 0) return '0 ' + unit;
      const prefixes = [
        { threshold: 1e-15, prefix: 'f', div: 1e-15 },
        { threshold: 1e-12, prefix: 'p', div: 1e-12 },
        { threshold: 1e-9, prefix: 'n', div: 1e-9 },
        { threshold: 1e-6, prefix: 'μ', div: 1e-6 },
        { threshold: 1e-3, prefix: 'm', div: 1e-3 },
        { threshold: 1, prefix: '', div: 1 },
        { threshold: 1e3, prefix: 'k', div: 1e3 },
        { threshold: 1e6, prefix: 'M', div: 1e6 }
      ];
      const absVal = Math.abs(value);
      for (let i = 0; i < prefixes.length - 1; i++) {
        if (absVal < prefixes[i + 1].threshold) {
          return (value / prefixes[i].div).toFixed(2) + ' ' + prefixes[i].prefix + unit;
        }
      }
      const last = prefixes[prefixes.length - 1];
      return (value / last.div).toFixed(2) + ' ' + last.prefix + unit;
    }

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { plateArea: 5, distance: 3, dielectric: 1, voltage: 6 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'plateArea', label: 'Plate Area', min: 1, max: 10, step: 0.5, value: 5, unit: 'cm²' },
    { name: 'distance', label: 'Plate Distance', min: 1, max: 10, step: 0.5, value: 3, unit: 'mm' },
    { name: 'dielectric', label: 'Dielectric Constant', min: 1, max: 10, step: 0.5, value: 1, unit: 'κ' },
    { name: 'voltage', label: 'Voltage', min: 1, max: 12, step: 0.5, value: 6, unit: 'V' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
