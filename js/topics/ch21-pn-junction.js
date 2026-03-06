// ch21-pn-junction.js — p-n Junction Diode
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'pn-junction';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let time = 0;
    let carriers = [];

    function initCarriers() {
      carriers = [];
      for (let i = 0; i < 15; i++) {
        carriers.push({ x: Math.random(), y: Math.random(), side: 'n' });
      }
    }

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
      initCarriers();
    };

    engine.onReset(() => { time = 0; initCarriers(); });

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      const V = engine.getParam('voltage');
      const T = engine.getParam('temperature');

      // --- LEFT: Junction cross-section ---
      const juncX = W * 0.05;
      const juncW = W * 0.42;
      const juncH = 260;
      const juncY = 80;
      const midX = juncX + juncW / 2;

      // Built-in potential and depletion width
      const Vbi = 0.7;
      let deplW;
      if (V >= 0) {
        deplW = Math.max(8, Math.round(50 * Math.sqrt(Math.max(0.01, Vbi - V) / Vbi)));
      } else {
        deplW = Math.min(80, Math.round(50 * Math.sqrt((Vbi - V) / Vbi)));
      }
      const deplLeft = midX - deplW;
      const deplRight = midX + deplW;

      // p-region
      p.noStroke();
      p.fill(80, 20, 60, 200);
      p.rect(juncX, juncY, deplLeft - juncX, juncH, 8, 0, 0, 8);
      // n-region
      p.fill(20, 40, 90, 200);
      p.rect(deplRight, juncY, juncX + juncW - deplRight, juncH, 0, 8, 8, 0);
      // depletion region
      p.fill(30, 30, 50, 180);
      p.rect(deplLeft, juncY, deplW * 2, juncH);

      // Labels
      p.fill(255, 120, 180); p.textSize(13); p.textAlign(p.CENTER);
      p.text('p-type', juncX + (deplLeft - juncX) / 2, juncY + 22);
      p.fill(100, 160, 255);
      p.text('n-type', deplRight + (juncX + juncW - deplRight) / 2, juncY + 22);
      p.fill(150, 150, 180); p.textSize(10);
      p.text('Depletion\nRegion', midX, juncY + juncH / 2 - 8);

      // Fixed ion charges in depletion region
      const ionSpacing = 14;
      for (let y2 = juncY + 20; y2 < juncY + juncH - 20; y2 += ionSpacing) {
        for (let x2 = deplLeft + 4; x2 < midX - 4; x2 += ionSpacing) {
          p.fill(255, 80, 100); p.textSize(10); p.textAlign(p.CENTER);
          p.text('\u2212', x2, y2);
        }
        for (let x2 = midX + 4; x2 < deplRight - 4; x2 += ionSpacing) {
          p.fill(100, 180, 255); p.textSize(10); p.textAlign(p.CENTER);
          p.text('+', x2, y2);
        }
      }

      // E-field arrows in depletion region
      if (deplW > 15) {
        p.stroke(255, 200, 50); p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = 'rgba(255,200,50,0.5)';
        for (let ay = juncY + 40; ay < juncY + juncH - 30; ay += 40) {
          p.line(midX + 10, ay, midX - 10, ay);
          p.fill(255, 200, 50); p.noStroke();
          // arrowhead pointing left (n->p direction)
          p.triangle(midX - 10, ay, midX - 4, ay - 4, midX - 4, ay + 4);
          p.stroke(255, 200, 50); p.strokeWeight(1.5);
        }
        p.drawingContext.shadowBlur = 0; p.noStroke();
        p.fill(255, 200, 50); p.textSize(9); p.textAlign(p.CENTER);
        p.text('E-field', midX, juncY + juncH - 10);
      }

      // Animated current carriers (only in forward bias V > 0.4)
      if (V > 0.4 && engine.isPlaying) {
        carriers.forEach(c => {
          if (c.side === 'n') {
            c.x -= 0.008 * V * engine.speed;
            if (c.x < 0) { c.x = 1; c.y = Math.random(); }
          }
        });
      }
      if (V > 0.4) {
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = 'rgba(0,245,212,0.8)';
        p.fill(0, 245, 212); p.noStroke();
        carriers.forEach(c => {
          const cx = deplRight + c.x * (juncX + juncW - deplRight);
          const cy = juncY + 10 + c.y * (juncH - 20);
          p.circle(cx, cy, 6);
        });
        p.drawingContext.shadowBlur = 0;
      }

      // --- RIGHT: I-V Characteristic ---
      const graphX = W * 0.52;
      const graphW = W * 0.44;
      const graphH = 300;
      const graphY = 60;
      const originX = graphX + graphW * 0.65; // V=0 at 65% from left
      const originY = graphY + graphH * 0.85;  // I=0 at 85% from top

      const VminPlot = -2, VmaxPlot = 1;
      const ImaxPlot = 0.08; // 80 mA max display

      function toScreenX(v) { return originX + (v / (VmaxPlot - VminPlot)) * graphW * 1.0; }
      function toScreenY(i) { return originY - (i / ImaxPlot) * (graphH * 0.8); }

      // Axes
      p.stroke(80, 80, 120); p.strokeWeight(1.5);
      p.line(graphX, originY, graphX + graphW, originY); // V-axis
      p.line(originX, graphY, originX, graphY + graphH);  // I-axis
      // Axis labels
      p.noStroke(); p.fill(160, 160, 200); p.textSize(11); p.textAlign(p.CENTER);
      p.text('V (volts)', graphX + graphW / 2 + 20, originY + 20);
      p.textAlign(p.RIGHT);
      p.text('I', originX - 6, graphY + 12);
      p.fill(100, 100, 140); p.textSize(9);
      p.textAlign(p.CENTER);
      p.text('0', originX, originY + 12);
      p.text('-2', toScreenX(-2), originY + 12);
      p.text('1', toScreenX(1), originY + 12);

      // Plot I-V curve
      const VT = 0.02585 * (T / 300); // thermal voltage
      p.noFill(); p.stroke(0, 245, 212); p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = 'rgba(0,245,212,0.6)';
      p.beginShape();
      for (let px = graphX; px < graphX + graphW; px++) {
        const v = VminPlot + ((px - graphX) / graphW) * (VmaxPlot - VminPlot);
        const i = 1e-9 * (Math.exp(v / VT) - 1);
        const iClamped = Math.max(-0.005, Math.min(ImaxPlot, i));
        p.vertex(px, toScreenY(iClamped));
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Operating point
      const Vop = V;
      const Iop = 1e-9 * (Math.exp(Vop / VT) - 1);
      const IopClamped = Math.max(-0.005, Math.min(ImaxPlot, Iop));
      const opX = toScreenX(Vop);
      const opY = toScreenY(IopClamped);
      p.noStroke(); p.fill(255, 200, 50);
      p.drawingContext.shadowBlur = 12; p.drawingContext.shadowColor = 'rgba(255,200,50,0.9)';
      p.circle(opX, opY, 10);
      p.drawingContext.shadowBlur = 0;

      // Current readout
      p.fill(200, 200, 220); p.textSize(11); p.textAlign(p.LEFT);
      const ImA = Iop * 1000;
      p.text(`V = ${V.toFixed(2)} V`, graphX, graphY + graphH + 30);
      p.text(`I = ${ImA < 1 ? (Iop * 1e6).toFixed(2) + ' \u03bcA' : ImA.toFixed(2) + ' mA'}`, graphX, graphY + graphH + 46);
      p.text(V > 0.5 ? '\u25b6 Forward conducting' : V > 0 ? '\u25b6 Near knee voltage' : '\u25b6 Reverse blocking', graphX, graphY + graphH + 62);

      // Knee voltage marker
      p.stroke(255, 100, 100, 150); p.strokeWeight(1); p.drawingContext.setLineDash([3, 3]);
      p.line(toScreenX(0.7), graphY, toScreenX(0.7), originY);
      p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(255, 100, 100); p.textSize(9); p.textAlign(p.CENTER);
      p.text('0.7 V', toScreenX(0.7), graphY - 4);
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { voltage: 0, temperature: 300 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'voltage', label: 'Applied Voltage', min: -2, max: 1, step: 0.05, value: 0, unit: 'V' },
    { name: 'temperature', label: 'Temperature', min: 200, max: 400, step: 10, value: 300, unit: 'K' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
