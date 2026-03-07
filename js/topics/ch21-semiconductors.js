// ch21-semiconductors.js — Semiconductors & Energy Bands
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'semiconductors';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let time = 0;
    // Electron particles in conduction band
    let electrons = [];

    function resetState() {
      time = 0;
      electrons = [];
    }

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
    };

    engine.onReset(resetState);

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      const dopingType = Math.round(engine.getParam('dopingType')); // 0=intrinsic,1=n-type,2=p-type
      const T = engine.getParam('temperature');
      const doping = engine.getParam('dopingConcentration');

      // Layout: left half = band diagram, right half = lattice
      const halfW = W / 2;

      // --- LEFT: Energy Band Diagram ---
      const bandX = 20;
      const bandW = halfW - 40;

      // Band positions (y)
      const condTop = 40, condBot = 120;      // conduction band
      const gapTop = 120, gapBot = 260;       // band gap
      const valTop = 260, valBot = 340;       // valence band

      // Draw bands
      p.noStroke();
      // Conduction band (blue glow)
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = 'rgba(0,180,255,0.6)';
      p.fill(0, 60, 120, 180);
      p.rect(bandX, condTop, bandW, condBot - condTop, 6);

      // Valence band (purple glow)
      p.drawingContext.shadowColor = 'rgba(139,92,246,0.6)';
      p.fill(60, 0, 120, 180);
      p.rect(bandX, valTop, bandW, valBot - valTop, 6);
      p.drawingContext.shadowBlur = 0;

      // Band gap label
      p.fill(160, 160, 180);
      p.textSize(11);
      p.textAlign(p.LEFT);
      const Eg = dopingType === 0 ? 1.12 : (dopingType === 1 ? 1.12 : 1.12);
      p.text(`Band Gap = ${Eg} eV (Si)`, bandX + 4, (gapTop + gapBot) / 2 + 4);

      // Band labels
      p.fill(120, 200, 255);
      p.textSize(11);
      p.text('Conduction Band', bandX + 4, condTop + 16);
      p.fill(180, 120, 255);
      p.text('Valence Band', bandX + 4, valTop + 16);

      // Donor / acceptor levels
      if (dopingType === 1) {
        // n-type: donor level just below conduction band
        p.stroke(255, 200, 50); p.strokeWeight(1); p.drawingContext.setLineDash([4, 4]);
        const donorY = gapTop + 20;
        p.line(bandX, donorY, bandX + bandW, donorY);
        p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(255, 200, 50); p.textSize(10);
        p.text('Donor level (P)', bandX + 4, donorY - 3);
      } else if (dopingType === 2) {
        // p-type: acceptor level just above valence band
        p.stroke(255, 100, 180); p.strokeWeight(1); p.drawingContext.setLineDash([4, 4]);
        const acceptorY = gapBot - 20;
        p.line(bandX, acceptorY, bandX + bandW, acceptorY);
        p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(255, 100, 180); p.textSize(10);
        p.text('Acceptor level (B)', bandX + 4, acceptorY - 3);
      }

      // Electrons in conduction band
      // Intrinsic: thermal generation, Boltzmann factor
      const k = 8.617e-5; // eV/K
      const thermalFactor = Math.exp(-Eg / (2 * k * T));
      let numElec = Math.round(thermalFactor * 3000);
      if (dopingType === 1) numElec += Math.round(doping * 4);
      numElec = Math.min(numElec, 20);

      p.noStroke();
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = 'rgba(0,245,212,0.8)';
      p.fill(0, 245, 212);
      for (let i = 0; i < numElec; i++) {
        const ex = bandX + 10 + (i % 8) * ((bandW - 20) / 8);
        const ey = condTop + 10 + Math.sin(time * 2 + i * 1.3) * 15 + (Math.floor(i / 8)) * 25;
        p.circle(ex, Math.max(condTop + 5, Math.min(condBot - 5, ey)), 7);
      }
      p.drawingContext.shadowBlur = 0;

      // Holes in valence band (for p-type or intrinsic)
      let numHoles = dopingType === 2 ? Math.round(doping * 4) : numElec;
      numHoles = Math.min(numHoles, 20);
      p.stroke(255, 100, 180); p.strokeWeight(1.5); p.noFill();
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = 'rgba(255,100,180,0.7)';
      for (let i = 0; i < numHoles; i++) {
        const hx = bandX + 10 + (i % 8) * ((bandW - 20) / 8);
        const hy = valTop + 10 + Math.sin(time * 2 + i * 1.7 + 1) * 12 + (Math.floor(i / 8)) * 25;
        p.circle(hx, Math.max(valTop + 5, Math.min(valBot - 5, hy)), 7);
      }
      p.drawingContext.shadowBlur = 0;

      // Temperature label
      p.noStroke(); p.fill(200, 200, 220); p.textSize(12); p.textAlign(p.LEFT);
      const typeLabels = ['Intrinsic', 'N-type (donor: P)', 'P-type (acceptor: B)'];
      p.text(typeLabels[dopingType], bandX, H - 60);
      p.text(`T = ${T} K`, bandX, H - 44);
      p.text(`Electrons in CB: ~${numElec}`, bandX, H - 28);

      // --- RIGHT: Crystal Lattice ---
      const latX = halfW + 20;
      const latY = 60;
      const latticeSpacing = 52;
      const rows = 5, cols = 5;

      p.textSize(10); p.textAlign(p.CENTER);
      // Draw bonds first
      p.stroke(60, 60, 90); p.strokeWeight(1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = latX + c * latticeSpacing;
          const y = latY + r * latticeSpacing;
          if (c < cols - 1) p.line(x, y, x + latticeSpacing, y);
          if (r < rows - 1) p.line(x, y, x, y + latticeSpacing);
        }
      }

      // Draw atoms
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = latX + c * latticeSpacing;
          // Jiggle with temperature
          const jiggleAmt = (T - 100) / 500 * 3;
          const jiggleX = Math.sin(time * 3 + r * 1.3 + c * 0.7) * jiggleAmt;
          const jiggleY = Math.cos(time * 2.5 + r * 0.8 + c * 1.1) * jiggleAmt;
          const y = latY + r * latticeSpacing;

          // Special impurity atom in center
          const isCenterAtom = (r === 2 && c === 2);
          let atomColor, label;
          if (isCenterAtom && dopingType === 1) {
            atomColor = [255, 200, 50]; label = 'P';
          } else if (isCenterAtom && dopingType === 2) {
            atomColor = [255, 120, 180]; label = 'B';
          } else {
            atomColor = [100, 140, 220]; label = 'Si';
          }

          p.noStroke();
          if (isCenterAtom && dopingType !== 0) {
            p.drawingContext.shadowBlur = 12;
            p.drawingContext.shadowColor = `rgba(${atomColor[0]},${atomColor[1]},${atomColor[2]},0.8)`;
          }
          p.fill(atomColor[0], atomColor[1], atomColor[2]);
          p.circle(x + jiggleX, y + jiggleY, 22);
          p.drawingContext.shadowBlur = 0;
          p.fill(20); p.textSize(9);
          p.text(label, x + jiggleX, y + jiggleY + 3);
        }
      }

      // Free electron for n-type
      if (dopingType === 1) {
        const centerX = latX + 2 * latticeSpacing;
        const centerY = latY + 2 * latticeSpacing;
        const freeAngle = time * 1.5;
        const freeR = 30 + Math.sin(time * 2) * 10;
        const fx = centerX + Math.cos(freeAngle) * freeR;
        const fy = centerY + Math.sin(freeAngle) * freeR;
        p.noStroke();
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = 'rgba(0,245,212,0.9)';
        p.fill(0, 245, 212);
        p.circle(fx, fy, 9);
        p.fill(0, 200, 170); p.textSize(9);
        p.text('e\u207B', fx, fy + 3);
        p.drawingContext.shadowBlur = 0;
      }

      // Hole for p-type
      if (dopingType === 2) {
        const centerX = latX + 2 * latticeSpacing;
        const centerY = latY + 2 * latticeSpacing;
        const holeAngle = time * 1.2;
        const holeR = 28 + Math.sin(time * 1.8) * 8;
        const hx2 = centerX + Math.cos(holeAngle) * holeR;
        const hy2 = centerY + Math.sin(holeAngle) * holeR;
        p.noFill();
        p.stroke(255, 100, 180); p.strokeWeight(2);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = 'rgba(255,100,180,0.9)';
        p.circle(hx2, hy2, 9);
        p.fill(255, 100, 180); p.noStroke(); p.textSize(9);
        p.text('h\u207A', hx2 + 0, hy2 + 3);
        p.drawingContext.shadowBlur = 0;
      }

      // Right panel title
      p.noStroke(); p.fill(160, 160, 200); p.textSize(11); p.textAlign(p.CENTER);
      p.text('Silicon Crystal Lattice', latX + (cols - 1) * latticeSpacing / 2, latY - 20);
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { dopingType: 0, temperature: 300, dopingConcentration: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'dopingType', label: 'Semiconductor Type', type: 'radio', value: 0,
      options: [{ value: 0, label: 'Intrinsic' }, { value: 1, label: 'N-type' }, { value: 2, label: 'P-type' }] },
    { name: 'temperature', label: 'Temperature', min: 100, max: 600, step: 10, value: 300, unit: 'K' },
    { name: 'dopingConcentration', label: 'Doping Level', min: 0, max: 10, step: 1, value: 5, unit: '\u00d710\u00b9\u2076/cm\u00b3' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
