// ch22-modulation.js — Modulation & Signal Transmission
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'modulation';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let timeOffset = 0;

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
    };

    engine.onReset(() => { timeOffset = 0; });

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) timeOffset += (1 / 60) * engine.speed * 1.5;

      const modType = Math.round(engine.getParam('modulationType')); // 0=AM, 1=FM
      const mu = engine.getParam('modulationIndex');
      const fm = engine.getParam('messageFrequency');
      const fc = engine.getParam('carrierFrequency');

      const Ac = 1, Am = mu;

      // Three waveform rows
      const rowHeight = 110;
      const rowPad = 18;
      const rows = [
        { label: 'Message Signal', color: [139, 92, 246], cy: rowPad + rowHeight / 2 },
        { label: 'Carrier Wave', color: [0, 180, 255], cy: rowPad + rowHeight + rowPad + rowHeight / 2 },
        { label: modType === 0 ? 'AM Output' : 'FM Output', color: [0, 245, 212], cy: rowPad + 2 * (rowHeight + rowPad) + rowHeight / 2 },
      ];

      const amp = rowHeight * 0.38;
      const labelW = 110;
      const waveX = labelW;
      const waveW = W - waveX - 10;

      rows.forEach((row, idx) => {
        // Row background
        p.noStroke(); p.fill(20, 20, 35);
        p.rect(waveX, row.cy - rowHeight / 2, waveW, rowHeight, 4);

        // Row label
        p.fill(row.color[0], row.color[1], row.color[2]);
        p.textSize(10); p.textAlign(p.RIGHT);
        p.text(row.label, labelW - 6, row.cy + 4);

        // Draw waveform
        p.stroke(row.color[0], row.color[1], row.color[2]); p.strokeWeight(1.8);
        p.drawingContext.shadowBlur = 5;
        p.drawingContext.shadowColor = `rgba(${row.color[0]},${row.color[1]},${row.color[2]},0.5)`;
        p.noFill(); p.beginShape();
        for (let px = waveX; px < waveX + waveW; px++) {
          const t = timeOffset + (px - waveX) / waveW * 4; // 4 cycles visible
          let y;
          if (idx === 0) {
            y = row.cy - amp * 0.7 * Math.sin(2 * Math.PI * fm * t / fc * 4);
          } else if (idx === 1) {
            y = row.cy - amp * Math.sin(2 * Math.PI * t * 4);
          } else {
            if (modType === 0) {
              // AM
              const envelope = 1 + mu * Math.sin(2 * Math.PI * fm * t / fc * 4);
              y = row.cy - amp * envelope * Math.sin(2 * Math.PI * t * 4);
            } else {
              // FM
              y = row.cy - amp * Math.sin(2 * Math.PI * t * 4 + mu * 3 * Math.sin(2 * Math.PI * fm * t / fc * 4));
            }
          }
          p.vertex(px, y);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;

        // AM envelope lines
        if (idx === 2 && modType === 0) {
          p.stroke(row.color[0], row.color[1], row.color[2], 80);
          p.strokeWeight(1); p.drawingContext.setLineDash([3, 3]);
          p.noFill(); p.beginShape();
          for (let px = waveX; px < waveX + waveW; px++) {
            const t = timeOffset + (px - waveX) / waveW * 4;
            const env = amp * (1 + mu * Math.sin(2 * Math.PI * fm * t / fc * 4));
            p.vertex(px, row.cy - env);
          }
          p.endShape();
          p.beginShape();
          for (let px = waveX; px < waveX + waveW; px++) {
            const t = timeOffset + (px - waveX) / waveW * 4;
            const env = amp * (1 + mu * Math.sin(2 * Math.PI * fm * t / fc * 4));
            p.vertex(px, row.cy + env);
          }
          p.endShape();
          p.drawingContext.setLineDash([]);
        }
      });

      // Info panel bottom
      p.noStroke(); p.fill(160, 160, 200); p.textSize(11); p.textAlign(p.LEFT);
      const bw = modType === 0 ? `BW = 2\u00d7fm = ${(2 * fm).toFixed(0)} Hz` : `BW = 2(\u0394f + fm) \u2248 wider than AM`;
      p.text(modType === 0 ? `AM  |  \u03bc = ${mu.toFixed(1)}  |  fc = ${fc} Hz  |  fm = ${fm} Hz  |  ${bw}` :
        `FM  |  \u03b2 = ${mu.toFixed(1)}  |  fc = ${fc} Hz  |  fm = ${fm} Hz  |  ${bw}`, waveX, H - 14);
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { modulationType: 0, modulationIndex: 0.5, messageFrequency: 3, carrierFrequency: 40 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'modulationType', label: 'Mode (0=AM, 1=FM)', min: 0, max: 1, step: 1, value: 0, unit: '' },
    { name: 'modulationIndex', label: 'Modulation Index (\u03bc / \u03b2)', min: 0.1, max: 2, step: 0.1, value: 0.5, unit: '' },
    { name: 'messageFrequency', label: 'Message Freq (fm)', min: 1, max: 10, step: 1, value: 3, unit: 'Hz' },
    { name: 'carrierFrequency', label: 'Carrier Freq (fc)', min: 20, max: 60, step: 5, value: 40, unit: 'Hz' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
