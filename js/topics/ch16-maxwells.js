// Maxwell's Equations & EM Waves — oscillating charge producing EM wave
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'maxwells-equations';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const freq = engine.getParam('frequency');
      const amp = engine.getParam('amplitude');

      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      const cy = height / 2;
      const startX = 80;
      const waveLen = width - 120;

      // Draw propagation direction
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(startX, cy, startX + waveLen, cy);

      // E field (vertical, red/orange)
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ff6644';
      p.stroke(255, 102, 68);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let x = 0; x <= waveLen; x += 3) {
        const phase = (x / waveLen) * freq * 4 * Math.PI - time * freq * 3;
        const ey = cy - Math.sin(phase) * amp;
        p.vertex(startX + x, ey);
      }
      p.endShape();

      // E field arrows
      for (let x = 0; x <= waveLen; x += 30) {
        const phase = (x / waveLen) * freq * 4 * Math.PI - time * freq * 3;
        const ey = -Math.sin(phase) * amp * 0.6;
        if (Math.abs(ey) > 5) {
          p.stroke(255, 102, 68, 100);
          p.strokeWeight(1);
          p.line(startX + x, cy, startX + x, cy + ey);
        }
      }

      // B field (horizontal depth, shown as dots/crosses, blue)
      p.drawingContext.shadowColor = '#00b4d8';
      p.stroke(0, 180, 216);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let x = 0; x <= waveLen; x += 3) {
        const phase = (x / waveLen) * freq * 4 * Math.PI - time * freq * 3;
        const bz = cy + Math.cos(phase) * amp * 0.5; // 90° phase to E, different plane
        p.vertex(startX + x, bz);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // B field dots/crosses (into/out of screen representation)
      for (let x = 0; x <= waveLen; x += 40) {
        const phase = (x / waveLen) * freq * 4 * Math.PI - time * freq * 3;
        const bVal = Math.cos(phase);
        const bx = startX + x;
        const by = cy + bVal * amp * 0.5;
        p.noStroke();
        if (bVal > 0.3) {
          // Coming out of screen (dot)
          p.fill(0, 180, 216, 150);
          p.ellipse(bx, by, 6, 6);
        } else if (bVal < -0.3) {
          // Going into screen (cross)
          p.stroke(0, 180, 216, 150);
          p.strokeWeight(1.5);
          p.line(bx - 3, by - 3, bx + 3, by + 3);
          p.line(bx - 3, by + 3, bx + 3, by - 3);
        }
      }

      // Oscillating charge at source
      const chargeY = cy - Math.sin(time * freq * 3) * amp * 0.5;
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#ffaa00';
      p.fill(255, 170, 0);
      p.noStroke();
      p.ellipse(startX - 20, chargeY, 16, 16);
      p.fill(255);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('+', startX - 20, chargeY + 4);
      p.drawingContext.shadowBlur = 0;

      // Propagation arrow
      p.stroke(255, 255, 255, 150);
      p.strokeWeight(2);
      const arrX = startX + waveLen + 10;
      p.line(arrX - 20, cy, arrX, cy);
      p.line(arrX, cy, arrX - 8, cy - 5);
      p.line(arrX, cy, arrX - 8, cy + 5);
      p.fill(255, 255, 255, 150);
      p.noStroke();
      p.textSize(11);
      p.text('c', arrX + 8, cy + 4);

      // Labels
      p.fill(255, 102, 68);
      p.textSize(14);
      p.textAlign(p.LEFT);
      p.text('E field', startX, cy - amp - 15);

      p.fill(0, 180, 216);
      p.text('B field', startX, cy + amp * 0.5 + 25);

      // Info
      p.fill(255, 255, 255, 200);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Frequency: ${freq.toFixed(1)} (visual)`, 15, 25);
      p.text(`c = 3 × 10⁸ m/s`, 15, 45);

      // Formula
      p.fill(139, 92, 246);
      p.textSize(14);
      p.textAlign(p.CENTER);
      p.text('c = 1/√(μ₀ε₀) = fλ', width / 2, height - 30);
      p.fill(255, 255, 255, 100);
      p.textSize(11);
      p.text('E ⊥ B ⊥ propagation direction', width / 2, height - 12);
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { frequency: 2, amplitude: 60 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'frequency', label: 'Frequency', min: 0.5, max: 5, step: 0.1, value: 2, unit: '' },
    { name: 'amplitude', label: 'Amplitude', min: 20, max: 80, step: 5, value: 60, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
