// Chapter 11: Laws of Thermodynamics — PV Diagram Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'laws-thermodynamics';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let animT = 0; // animation parameter 0-1

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    // Process types: 0=isothermal, 1=adiabatic, 2=isobaric, 3=isochoric
    const processNames = ['Isothermal', 'Adiabatic', 'Isobaric', 'Isochoric'];
    const processColors = [[0, 255, 200], [255, 80, 130], [255, 200, 50], [100, 180, 255]];
    const processDescriptions = [
      'T=const, \u0394U=0, Q=W',
      'Q=0, PV\u1D5E=const',
      'P=const, W=P\u0394V',
      'V=const, W=0, Q=\u0394U'
    ];

    p.draw = () => {
      p.background(10, 10, 26);

      const processType = Math.round(engine.getParam('processType'));
      const P0 = engine.getParam('initialP');
      const V0 = engine.getParam('initialV');
      const gamma = 1.4; // diatomic gas

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
        animT += 0.005 * engine.speed;
        if (animT > 1) animT = 0;
      }

      const processName = processNames[processType];
      const pColor = processColors[processType];

      // PV diagram area
      const plotLeft = 80;
      const plotRight = width * 0.55;
      const plotTop = 60;
      const plotBottom = 320;
      const plotW = plotRight - plotLeft;
      const plotH = plotBottom - plotTop;

      // Axis ranges
      const maxV = 6;
      const maxP = 6;

      function toScreenX(v) { return plotLeft + (v / maxV) * plotW; }
      function toScreenY(pr) { return plotBottom - (pr / maxP) * plotH; }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Thermodynamic Processes: PV Diagram', width / 2, 8);

      // Draw PV diagram axes
      p.stroke(255, 255, 255, 80);
      p.strokeWeight(2);
      p.line(plotLeft, plotTop, plotLeft, plotBottom);
      p.line(plotLeft, plotBottom, plotRight, plotBottom);

      // Arrowheads
      p.line(plotLeft, plotTop, plotLeft - 4, plotTop + 10);
      p.line(plotLeft, plotTop, plotLeft + 4, plotTop + 10);
      p.line(plotRight, plotBottom, plotRight - 10, plotBottom - 4);
      p.line(plotRight, plotBottom, plotRight - 10, plotBottom + 4);

      // Labels
      p.noStroke();
      p.fill(255, 255, 255, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Volume (L)', (plotLeft + plotRight) / 2, plotBottom + 10);
      p.push();
      p.translate(plotLeft - 35, (plotTop + plotBottom) / 2);
      p.rotate(-Math.PI / 2);
      p.text('Pressure (atm)', 0, 0);
      p.pop();

      // Axis ticks
      p.textSize(9);
      p.fill(150, 150, 170);
      for (let v = 1; v <= 5; v++) {
        const sx = toScreenX(v);
        p.stroke(255, 255, 255, 30);
        p.strokeWeight(1);
        p.line(sx, plotBottom, sx, plotBottom + 5);
        p.line(sx, plotTop, sx, plotBottom); // grid lines
        p.noStroke();
        p.textAlign(p.CENTER, p.TOP);
        p.text(v, sx, plotBottom + 7);
      }
      for (let pr = 1; pr <= 5; pr++) {
        const sy = toScreenY(pr);
        p.stroke(255, 255, 255, 30);
        p.strokeWeight(1);
        p.line(plotLeft - 5, sy, plotLeft, sy);
        p.line(plotLeft, sy, plotRight, sy); // grid lines
        p.noStroke();
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(pr, plotLeft - 8, sy);
      }

      // Generate process curve points
      const curvePoints = [];
      const steps = 100;
      const Vf = Math.min(5.5, V0 + 2); // final volume

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let v, pr;

        switch (processType) {
          case 0: // Isothermal: PV = const => P = P0*V0/V
            v = V0 + t * (Vf - V0);
            pr = P0 * V0 / v;
            break;
          case 1: // Adiabatic: PV^γ = const => P = P0*(V0/V)^γ
            v = V0 + t * (Vf - V0);
            pr = P0 * Math.pow(V0 / v, gamma);
            break;
          case 2: // Isobaric: P = const
            v = V0 + t * (Vf - V0);
            pr = P0;
            break;
          case 3: // Isochoric: V = const, P changes
            v = V0;
            pr = P0 + t * (P0 * 0.8); // pressure increases by 80%
            break;
        }

        curvePoints.push({ v, pr, t });
      }

      // Draw shaded area (work done = area under curve)
      if (processType !== 3) { // No work for isochoric
        p.fill(pColor[0], pColor[1], pColor[2], 30);
        p.noStroke();
        p.beginShape();
        p.vertex(toScreenX(V0), plotBottom);
        for (const pt of curvePoints) {
          p.vertex(toScreenX(pt.v), toScreenY(pt.pr));
        }
        p.vertex(toScreenX(curvePoints[curvePoints.length - 1].v), plotBottom);
        p.endShape(p.CLOSE);
      }

      // Draw the process curve
      p.noFill();
      p.stroke(pColor[0], pColor[1], pColor[2]);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = `rgb(${pColor[0]},${pColor[1]},${pColor[2]})`;
      p.beginShape();
      for (const pt of curvePoints) {
        p.vertex(toScreenX(pt.v), toScreenY(pt.pr));
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Animated point on curve
      const animIdx = Math.floor(animT * (curvePoints.length - 1));
      const animPt = curvePoints[animIdx];
      if (animPt) {
        const sx = toScreenX(animPt.v);
        const sy = toScreenY(animPt.pr);

        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = '#ffffff';
        p.fill(255, 255, 255);
        p.noStroke();
        p.ellipse(sx, sy, 10, 10);
        p.drawingContext.shadowBlur = 0;

        // Dashed lines to axes
        p.stroke(255, 255, 255, 60);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 3]);
        p.line(sx, sy, sx, plotBottom);
        p.line(sx, sy, plotLeft, sy);
        p.drawingContext.setLineDash([]);

        // Current values near point
        p.noStroke();
        p.fill(255, 255, 255, 200);
        p.textSize(9);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text('P=' + animPt.pr.toFixed(2) + ' atm', sx + 8, sy - 3);
        p.text('V=' + animPt.v.toFixed(2) + ' L', sx + 8, sy + 10);
      }

      // Start and end points
      const startPt = curvePoints[0];
      const endPt = curvePoints[curvePoints.length - 1];

      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ff88';
      p.fill(0, 255, 136);
      p.noStroke();
      p.ellipse(toScreenX(startPt.v), toScreenY(startPt.pr), 10, 10);
      p.drawingContext.shadowBlur = 0;
      p.textSize(10);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('Start', toScreenX(startPt.v) - 8, toScreenY(startPt.pr));

      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff5050';
      p.fill(255, 80, 80);
      p.ellipse(toScreenX(endPt.v), toScreenY(endPt.pr), 10, 10);
      p.drawingContext.shadowBlur = 0;
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('End', toScreenX(endPt.v) + 8, toScreenY(endPt.pr));

      // Direction arrow on curve
      if (curvePoints.length > 10) {
        const midIdx = Math.floor(curvePoints.length / 2);
        const midPt = curvePoints[midIdx];
        const nextPt = curvePoints[midIdx + 3];
        if (midPt && nextPt) {
          const dx = toScreenX(nextPt.v) - toScreenX(midPt.v);
          const dy = toScreenY(nextPt.pr) - toScreenY(midPt.pr);
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            const nx = dx / len;
            const ny = dy / len;
            const mx = toScreenX(midPt.v);
            const my = toScreenY(midPt.pr);
            p.stroke(pColor[0], pColor[1], pColor[2]);
            p.strokeWeight(2);
            p.line(mx, my, mx + nx * 12, my + ny * 12);
            p.line(mx + nx * 12, my + ny * 12, mx + nx * 12 - nx * 6 + ny * 4, my + ny * 12 - ny * 6 - nx * 4);
            p.line(mx + nx * 12, my + ny * 12, mx + nx * 12 - nx * 6 - ny * 4, my + ny * 12 - ny * 6 + nx * 4);
          }
        }
      }

      // Calculate work done
      let work = 0;
      switch (processType) {
        case 0: // Isothermal: W = nRT * ln(Vf/Vi) = PiVi * ln(Vf/Vi)
          work = P0 * V0 * Math.log(Vf / V0) * 101.325; // atm*L to J
          break;
        case 1: // Adiabatic: W = (P1V1 - P2V2)/(γ-1)
          const Pf = P0 * Math.pow(V0 / Vf, gamma);
          work = (P0 * V0 - Pf * Vf) / (gamma - 1) * 101.325;
          break;
        case 2: // Isobaric: W = P*ΔV
          work = P0 * (Vf - V0) * 101.325;
          break;
        case 3: // Isochoric: W = 0
          work = 0;
          break;
      }

      // Info panel
      const infoX = width * 0.6;
      const infoY = 50;
      p.fill(15, 15, 35, 220);
      p.stroke(pColor[0], pColor[1], pColor[2], 80);
      p.strokeWeight(1);
      p.rect(infoX, infoY, width * 0.36, 170, 8);

      p.noStroke();
      p.fill(pColor[0], pColor[1], pColor[2]);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text(processName + ' Process', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text(processDescriptions[processType], infoX + 10, infoY + 30);

      p.text('P\u2080 = ' + P0.toFixed(1) + ' atm', infoX + 10, infoY + 52);
      p.text('V\u2080 = ' + V0.toFixed(1) + ' L', infoX + 10, infoY + 68);

      if (processType === 0) {
        p.fill(0, 255, 200);
        p.text('T = PV/(nR) = constant', infoX + 10, infoY + 90);
        p.fill(200, 200, 220);
        p.text('\u0394U = 0 (internal energy unchanged)', infoX + 10, infoY + 106);
        p.text('Q = W (heat = work done)', infoX + 10, infoY + 122);
      } else if (processType === 1) {
        p.fill(255, 80, 130);
        p.text('PV^' + gamma.toFixed(1) + ' = constant', infoX + 10, infoY + 90);
        p.fill(200, 200, 220);
        p.text('Q = 0 (no heat exchange)', infoX + 10, infoY + 106);
        p.text('\u0394U = -W (energy from work)', infoX + 10, infoY + 122);
      } else if (processType === 2) {
        p.fill(255, 200, 50);
        p.text('P = constant = ' + P0.toFixed(1) + ' atm', infoX + 10, infoY + 90);
        p.fill(200, 200, 220);
        p.text('W = P\u0394V', infoX + 10, infoY + 106);
        p.text('Q = \u0394U + W', infoX + 10, infoY + 122);
      } else {
        p.fill(100, 180, 255);
        p.text('V = constant = ' + V0.toFixed(1) + ' L', infoX + 10, infoY + 90);
        p.fill(200, 200, 220);
        p.text('W = 0 (no volume change)', infoX + 10, infoY + 106);
        p.text('Q = \u0394U (all heat \u2192 \u0394U)', infoX + 10, infoY + 122);
      }

      p.fill(0, 255, 136);
      p.textSize(12);
      p.text('W = ' + work.toFixed(1) + ' J', infoX + 10, infoY + 145);

      // Laws of thermodynamics summary
      const lawX = width * 0.6;
      const lawY = infoY + 185;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(lawX, lawY, width * 0.36, 120, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Laws of Thermodynamics:', lawX + 10, lawY + 6);

      p.fill(200, 200, 220);
      p.textSize(9);
      p.text('0th: Thermal equilibrium is transitive', lawX + 10, lawY + 24);
      p.text('1st: \u0394U = Q - W', lawX + 10, lawY + 40);
      p.text('     (energy conservation)', lawX + 10, lawY + 52);
      p.text('2nd: Entropy never decreases', lawX + 10, lawY + 68);
      p.text('     (heat flows hot \u2192 cold)', lawX + 10, lawY + 80);
      p.text('3rd: S \u2192 0 as T \u2192 0 K', lawX + 10, lawY + 96);

      // Work label on diagram
      if (work !== 0) {
        p.fill(pColor[0], pColor[1], pColor[2], 180);
        p.textSize(11);
        p.textAlign(p.CENTER, p.CENTER);
        const labelV = (V0 + Vf) / 2;
        const labelP = processType === 2 ? P0 / 2 : P0 * 0.4;
        p.text('W = area', toScreenX(labelV), toScreenY(labelP));
      }

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Switch process type: 0=isothermal, 1=adiabatic, 2=isobaric, 3=isochoric', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      animT = 0;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { processType: 0, initialP: 3, initialV: 1.5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'processType', label: 'Process (0-3)', min: 0, max: 3, step: 1, value: 0, unit: '' },
    { name: 'initialP', label: 'Initial Pressure', min: 1, max: 5, step: 0.5, value: 3, unit: 'atm' },
    { name: 'initialV', label: 'Initial Volume', min: 1, max: 5, step: 0.5, value: 1.5, unit: 'L' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
