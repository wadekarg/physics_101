// ch22-digital.js — Digital Communication & Information
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'digital-communication';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let time = 0;
    let sampleBuffer = [];
    const maxSamples = 16;

    function resetSamples() {
      sampleBuffer = [];
      time = 0;
    }

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
    };

    engine.onReset(resetSamples);

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      const bits = Math.round(engine.getParam('bits'));
      const fs = engine.getParam('samplingRate');
      const sigFreq = engine.getParam('signalFrequency');

      const levels = Math.pow(2, bits);
      const levelStep = 2 / levels; // signal range -1 to 1

      // Sample the signal periodically
      const sampleInterval = 1 / fs;
      if (engine.isPlaying) {
        const lastSampleTime = sampleBuffer.length > 0 ? sampleBuffer[sampleBuffer.length - 1].t : -Infinity;
        if (time - lastSampleTime >= sampleInterval) {
          const rawVal = Math.sin(2 * Math.PI * sigFreq * time);
          const qLevel = Math.round((rawVal + 1) / levelStep);
          const qClamped = Math.max(0, Math.min(levels - 1, qLevel));
          const qVal = qClamped * levelStep - 1;
          sampleBuffer.push({ t: time, raw: rawVal, q: qVal, level: qClamped, binary: qClamped.toString(2).padStart(bits, '0') });
          if (sampleBuffer.length > maxSamples) sampleBuffer.shift();
        }
      }

      // Nyquist warning
      const nyquistViolation = fs < 2 * sigFreq;

      // --- Panel layout ---
      const panelH = 120;
      const panelPad = 12;
      const labelW = 108;
      const waveX = labelW;
      const waveW = W - labelW - 10;

      // Row 1: Analog signal
      const row1Y = panelPad;
      const row2Y = row1Y + panelH + panelPad;
      const row3Y = row2Y + panelH + panelPad;
      const amp = panelH * 0.38;
      const timeDuration = maxSamples / fs; // seconds shown

      function timeToX(t) {
        const tStart = sampleBuffer.length > 0 ? sampleBuffer[0].t : 0;
        return waveX + ((t - tStart) / timeDuration) * waveW;
      }

      // Row 1: Analog signal
      p.noStroke(); p.fill(20, 20, 35); p.rect(waveX, row1Y, waveW, panelH, 4);
      p.fill(139, 92, 246); p.textSize(9); p.textAlign(p.RIGHT);
      p.text('Analog\nSignal', labelW - 6, row1Y + panelH / 2 + 4);
      const row1CY = row1Y + panelH / 2;

      p.stroke(139, 92, 246); p.strokeWeight(1.8); p.noFill();
      p.drawingContext.shadowBlur = 5; p.drawingContext.shadowColor = 'rgba(139,92,246,0.5)';
      p.beginShape();
      const tStart = sampleBuffer.length > 0 ? sampleBuffer[0].t : time - timeDuration;
      for (let px = waveX; px < waveX + waveW; px++) {
        const t2 = tStart + ((px - waveX) / waveW) * timeDuration;
        const y = row1CY - amp * Math.sin(2 * Math.PI * sigFreq * t2);
        p.vertex(px, y);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Sample markers on row 1
      sampleBuffer.forEach(s => {
        const sx = timeToX(s.t);
        if (sx >= waveX && sx <= waveX + waveW) {
          const sy = row1CY - amp * s.raw;
          p.stroke(255, 200, 50); p.strokeWeight(1);
          p.drawingContext.setLineDash([2, 2]);
          p.line(sx, row1CY - amp, sx, row1CY + amp);
          p.drawingContext.setLineDash([]);
          p.noStroke(); p.fill(255, 200, 50);
          p.circle(sx, sy, 5);
        }
      });

      // Row 2: Quantized signal (staircase)
      p.noStroke(); p.fill(20, 20, 35); p.rect(waveX, row2Y, waveW, panelH, 4);
      p.fill(0, 245, 212); p.textSize(9); p.textAlign(p.RIGHT);
      p.text('Quantized\n(' + levels + ' levels)', labelW - 6, row2Y + panelH / 2 + 4);
      const row2CY = row2Y + panelH / 2;

      // Draw quantization level lines
      p.stroke(40, 60, 60); p.strokeWeight(0.5);
      for (let lvl = 0; lvl <= levels; lvl++) {
        const qy = row2CY + amp - (lvl / levels) * amp * 2;
        p.line(waveX, qy, waveX + waveW, qy);
      }

      // Draw staircase
      if (sampleBuffer.length > 1) {
        p.stroke(0, 245, 212); p.strokeWeight(2);
        p.noFill();
        p.drawingContext.shadowBlur = 5; p.drawingContext.shadowColor = 'rgba(0,245,212,0.5)';
        p.beginShape();
        for (let i = 0; i < sampleBuffer.length; i++) {
          const s = sampleBuffer[i];
          const x1 = timeToX(s.t);
          const x2 = i < sampleBuffer.length - 1 ? timeToX(sampleBuffer[i + 1].t) : waveX + waveW;
          const sy = row2CY - amp * s.q;
          if (x1 >= waveX && x2 <= waveX + waveW + 2) {
            p.vertex(Math.max(waveX, x1), sy);
            p.vertex(Math.min(waveX + waveW, x2), sy);
          }
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Row 3: Binary PCM output
      p.noStroke(); p.fill(20, 20, 35); p.rect(waveX, row3Y, waveW, panelH, 4);
      p.fill(0, 200, 136); p.textSize(9); p.textAlign(p.RIGHT);
      p.text(`PCM\n${bits}-bit`, labelW - 6, row3Y + panelH / 2 + 4);

      if (sampleBuffer.length > 0) {
        const recentSamples = sampleBuffer.slice(-8);
        const bitsTotal = recentSamples.length * bits;
        const bitW = Math.min(30, waveW / bitsTotal);
        let bx = waveX + 4;
        const highY = row3Y + 16;
        const lowY = row3Y + panelH - 16;

        recentSamples.forEach((s, si) => {
          const isLatest = si === recentSamples.length - 1;
          s.binary.split('').forEach(bit => {
            const isHigh = bit === '1';
            const bColor = isLatest ? [255, 200, 50] : [0, 180, 120];
            p.stroke(bColor[0], bColor[1], bColor[2]); p.strokeWeight(1.5);
            p.noFill();
            p.rect(bx, isHigh ? highY : lowY - (lowY - highY) / 2, bitW - 1, (lowY - highY) / 2, 1);
            p.fill(bColor[0], bColor[1], bColor[2]); p.noStroke(); p.textSize(8); p.textAlign(p.CENTER);
            p.text(bit, bx + bitW / 2, isHigh ? highY + 9 : lowY - 4);
            bx += bitW;
          });
          // Sample separator
          p.stroke(60, 60, 80); p.strokeWeight(1);
          p.drawingContext.setLineDash([2, 2]);
          p.line(bx, row3Y + 4, bx, row3Y + panelH - 4);
          p.drawingContext.setLineDash([]);
          bx += 1;
        });
      }

      // Info bar
      const bitRate = fs * bits;
      p.noStroke(); p.fill(160, 160, 200); p.textSize(10); p.textAlign(p.LEFT);
      p.text(`Levels: 2^${bits} = ${levels}  |  Sampling: ${fs} Hz  |  Bit rate: ${bitRate} bps`, waveX, H - 28);

      // Nyquist warning
      if (nyquistViolation) {
        const flashAlpha = (Math.sin(time * 6) + 1) / 2 * 200 + 55;
        p.fill(255, 60, 60, flashAlpha);
        p.drawingContext.shadowBlur = 12; p.drawingContext.shadowColor = 'rgba(255,60,60,0.8)';
        p.textSize(13); p.textAlign(p.CENTER);
        p.text(`\u26a0 ALIASING! fs (${fs} Hz) < 2\u00d7fm (${2 * sigFreq} Hz) \u2014 Nyquist violated`, W / 2, H - 10);
        p.drawingContext.shadowBlur = 0;
      } else {
        p.fill(0, 200, 136); p.textSize(10); p.textAlign(p.LEFT);
        p.text(`\u2713 Nyquist OK: fs (${fs}) \u2265 2\u00d7fm (${2 * sigFreq})`, waveX, H - 10);
      }
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { bits: 4, samplingRate: 16, signalFrequency: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'bits', label: 'Bit Depth (Resolution)', min: 2, max: 8, step: 1, value: 4, unit: 'bits' },
    { name: 'samplingRate', label: 'Sampling Rate', min: 4, max: 40, step: 2, value: 16, unit: 'samples/s' },
    { name: 'signalFrequency', label: 'Signal Frequency', min: 1, max: 8, step: 1, value: 3, unit: 'Hz' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
