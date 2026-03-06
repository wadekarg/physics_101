// ch21-transistors.js — Transistors & Logic Gates
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'transistors';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let time = 0;
    let currentDots = [];

    function initDots() {
      currentDots = [];
      for (let i = 0; i < 20; i++) {
        currentDots.push({ t: i / 20 });
      }
    }

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
      initDots();
    };

    engine.onReset(() => { time = 0; initDots(); });

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      const IB_uA = engine.getParam('baseCurrentuA');
      const beta = engine.getParam('beta');
      const RL = engine.getParam('loadResistance');
      const VCC = 12;

      const IC_mA = (IB_uA * beta) / 1000; // mA
      const IC_mA_clamped = Math.min(IC_mA, VCC / RL * 1000); // saturation limit
      const VCE = VCC - IC_mA_clamped * RL / 1000;

      const isOn = IB_uA > 5;
      const isSaturated = VCE < 0.3;

      // --- LEFT: Transistor Symbol ---
      const symX = W * 0.06;
      const symY = 100;
      const symW = W * 0.38;
      const symH = 280;
      const cx = symX + symW / 2;
      const cy = symY + symH / 2;

      // Draw NPN transistor symbol
      // Vertical base line
      p.stroke(100, 140, 200); p.strokeWeight(2.5);
      p.line(cx - 20, cy - 60, cx - 20, cy + 60);
      // Base lead
      p.line(cx - 60, cy, cx - 20, cy);
      // Collector (top diagonal)
      p.line(cx - 20, cy - 40, cx + 40, cy - 90);
      // Emitter (bottom diagonal with arrow)
      p.line(cx - 20, cy + 40, cx + 40, cy + 90);

      // Emitter arrow (NPN: points outward/down)
      const arrowX = cx + 40, arrowY = cy + 90;
      p.fill(100, 140, 200); p.noStroke();
      // Arrow at emitter tip pointing outward
      const angle = Math.atan2((cy + 90) - (cy + 40), (cx + 40) - (cx - 20));
      p.push();
      p.translate(arrowX, arrowY);
      p.rotate(angle);
      p.triangle(8, 0, -2, 4, -2, -4);
      p.pop();

      // Labels
      p.noStroke(); p.fill(160, 160, 200); p.textSize(11); p.textAlign(p.CENTER);
      p.text('C (Collector)', cx + 40, cy - 100);
      p.text('E (Emitter)', cx + 40, cy + 104);
      p.text('B (Base)', cx - 80, cy + 4);

      // Current dots on collector-emitter path
      if (isOn) {
        if (engine.isPlaying) {
          currentDots.forEach(d => {
            d.t += 0.008 * engine.speed * (IC_mA_clamped / 5 + 0.1);
            if (d.t > 1) d.t -= 1;
          });
        }
        const numVisible = Math.round((IC_mA_clamped / (VCC / RL * 1000)) * 15) + 1;
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = 'rgba(0,255,136,0.8)';
        p.fill(0, 255, 136);
        currentDots.slice(0, numVisible).forEach(d => {
          const t = d.t;
          // Path: from collector (cx+40, cy-90) through transistor to emitter (cx+40, cy+90)
          let dx, dy;
          if (t < 0.5) {
            const s = t * 2;
            dx = p.lerp(cx + 40, cx - 20, s);
            dy = p.lerp(cy - 90, cy + 0, s);
          } else {
            const s = (t - 0.5) * 2;
            dx = p.lerp(cx - 20, cx + 40, s);
            dy = p.lerp(cy, cy + 90, s);
          }
          p.circle(dx, dy, 7);
        });
        p.drawingContext.shadowBlur = 0;
      }

      // State indicator
      const stateColor = isSaturated ? [50, 255, 50] : isOn ? [0, 200, 255] : [180, 60, 60];
      p.noStroke(); p.fill(stateColor[0], stateColor[1], stateColor[2]);
      p.textSize(13); p.textAlign(p.CENTER);
      p.text(isSaturated ? '\u2b24 SATURATED (ON)' : isOn ? '\u2b24 ACTIVE (Amplifying)' : '\u2b24 CUTOFF (OFF)', cx, symY + symH + 30);

      // Measurements
      p.fill(200, 200, 220); p.textSize(11); p.textAlign(p.LEFT);
      p.text(`IB = ${IB_uA} \u03bcA`, symX, symY + symH + 56);
      p.text(`IC = ${IC_mA_clamped.toFixed(2)} mA (\u03b2\u00d7IB = ${IC_mA.toFixed(2)})`, symX, symY + symH + 72);
      p.text(`VCE = ${Math.max(0, VCE).toFixed(2)} V`, symX, symY + symH + 88);

      // --- RIGHT: Output Characteristics Graph ---
      const grX = W * 0.52;
      const grW = W * 0.45;
      const grH = 300;
      const grY = 50;
      const grOriginX = grX;
      const grOriginY = grY + grH;

      const VCEmax = 12, ICmax = VCC / RL * 1000 * 1.3; // mA

      function toGX(vce) { return grOriginX + (vce / VCEmax) * grW; }
      function toGY(ic) { return grOriginY - (ic / ICmax) * grH; }

      // Axes
      p.stroke(80, 80, 120); p.strokeWeight(1.5);
      p.line(grOriginX, grOriginY, grOriginX + grW, grOriginY);
      p.line(grOriginX, grY, grOriginX, grOriginY);
      p.noStroke(); p.fill(160, 160, 200); p.textSize(10); p.textAlign(p.CENTER);
      p.text('VCE (V)', grOriginX + grW / 2, grOriginY + 18);
      p.textAlign(p.RIGHT);
      p.text('IC (mA)', grOriginX - 4, grY + 10);

      // IB curves
      const IBcurves = [0, 20, 40, 60, 80];
      const curveColors = [
        [60, 60, 100], [80, 120, 200], [100, 180, 255],
        [100, 220, 200], [0, 245, 212],
      ];
      IBcurves.forEach((ib, idx) => {
        const ic_active = ib * beta / 1000;
        const ic_sat = VCC / RL * 1000;
        const col = curveColors[idx];
        const isSelected = Math.abs(ib - IB_uA) < 12;
        p.stroke(col[0], col[1], col[2]);
        p.strokeWeight(isSelected ? 2.5 : 1);
        if (isSelected) { p.drawingContext.shadowBlur = 6; p.drawingContext.shadowColor = `rgba(${col[0]},${col[1]},${col[2]},0.7)`; }
        p.noFill();
        p.beginShape();
        for (let vce = 0; vce <= VCEmax; vce += 0.1) {
          const ic = ib === 0 ? 0 : Math.min(ic_active, Math.max(0, vce / 0.3 * ic_active));
          p.vertex(toGX(vce), toGY(ic));
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
        p.noStroke(); p.fill(col[0], col[1], col[2]); p.textSize(9); p.textAlign(p.LEFT);
        p.text(`IB=${ib}\u03bcA`, grOriginX + grW + 2, toGY(Math.min(ic_active, ic_sat)) + 4);
      });

      // Load line
      p.stroke(255, 200, 50, 180); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]);
      p.line(toGX(0), toGY(VCC / RL * 1000), toGX(VCC), toGY(0));
      p.drawingContext.setLineDash([]);

      // Q-point
      const qVCE = Math.max(0, VCE);
      const qIC = IC_mA_clamped;
      if (qVCE >= 0 && qIC >= 0) {
        p.noStroke(); p.fill(255, 200, 50);
        p.drawingContext.shadowBlur = 12; p.drawingContext.shadowColor = 'rgba(255,200,50,0.9)';
        p.circle(toGX(qVCE), toGY(qIC), 10);
        p.drawingContext.shadowBlur = 0;
        p.fill(255, 200, 50); p.textSize(9); p.textAlign(p.LEFT);
        p.text('Q', toGX(qVCE) + 6, toGY(qIC) - 4);
      }
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { baseCurrentuA: 40, beta: 100, loadResistance: 500 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'baseCurrentuA', label: 'Base Current IB', min: 0, max: 100, step: 5, value: 40, unit: '\u03bcA' },
    { name: 'beta', label: 'Current Gain \u03b2', min: 20, max: 300, step: 10, value: 100, unit: '' },
    { name: 'loadResistance', label: 'Load Resistance RL', min: 100, max: 2000, step: 100, value: 500, unit: '\u03a9' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
