// Radioactive Decay — Grid of atoms decaying over time
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'radioactive-decay';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let atoms = [];
    let time = 0;
    let decayHistory = [];
    let initialized = false;

    function initAtoms() {
      const count = Math.round(engine.getParam('initialAtoms'));
      atoms = [];
      for (let i = 0; i < count; i++) {
        atoms.push({ decayed: false, decayTime: Infinity });
      }
      // Pre-calculate decay times
      const halfLife = engine.getParam('halfLife');
      const lambda = Math.log(2) / halfLife;
      for (const atom of atoms) {
        atom.decayTime = -Math.log(Math.random()) / lambda;
      }
      time = 0;
      decayHistory = [{ t: 0, n: count }];
      initialized = true;
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      initAtoms();
    };

    engine.onReset(() => initAtoms());

    p.draw = () => {
      p.background(10, 10, 26);
      if (!initialized) return;

      const halfLife = engine.getParam('halfLife');
      const totalAtoms = atoms.length;

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;

        // Check for decays
        for (const atom of atoms) {
          if (!atom.decayed && time >= atom.decayTime) {
            atom.decayed = true;
          }
        }

        // Record history
        const remaining = atoms.filter(a => !a.decayed).length;
        if (decayHistory.length === 0 || Math.abs(decayHistory[decayHistory.length - 1].n - remaining) > 0) {
          decayHistory.push({ t: time, n: remaining });
          if (decayHistory.length > 500) decayHistory.shift();
        }
      }

      // Draw atom grid (left half)
      const gridW = width * 0.45;
      const cols = Math.ceil(Math.sqrt(totalAtoms * gridW / (height - 100)));
      const rows = Math.ceil(totalAtoms / cols);
      const cellW = gridW / cols;
      const cellH = Math.min((height - 100) / rows, cellW);
      const gridX = 20, gridY = 50;

      for (let i = 0; i < atoms.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = gridX + col * cellW + cellW / 2;
        const cy = gridY + row * cellH + cellH / 2;
        const r = Math.min(cellW, cellH) * 0.35;

        if (atoms[i].decayed) {
          // Decayed atom (stable product)
          p.fill(80, 80, 100);
          p.noStroke();
          p.ellipse(cx, cy, r * 2, r * 2);
        } else {
          // Radioactive atom (glowing)
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#00f5d4';
          p.fill(0, 245, 212);
          p.noStroke();
          p.ellipse(cx, cy, r * 2, r * 2);
          p.drawingContext.shadowBlur = 0;
        }
      }

      // Decay curve (right half)
      const gx = width * 0.52, gy = 60, gw = width * 0.42, gh = height * 0.45;

      // Axes
      p.stroke(255, 255, 255, 60);
      p.strokeWeight(1);
      p.line(gx, gy, gx, gy + gh);
      p.line(gx, gy + gh, gx + gw, gy + gh);

      // Axis labels
      p.fill(255, 255, 255, 120);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Time (s)', gx + gw / 2, gy + gh + 40);
      p.textAlign(p.RIGHT);
      p.text(`${totalAtoms}`, gx - 5, gy + 6);
      p.text(`${Math.round(totalAtoms / 2)}`, gx - 5, gy + gh / 2 + 4);
      p.text('0', gx - 5, gy + gh + 4);

      // Theoretical curve
      const maxTime = Math.max(halfLife * 5, time + 1);
      p.stroke(0, 245, 212, 60);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.noFill();
      p.beginShape();
      for (let t = 0; t <= maxTime; t += maxTime / 100) {
        const n = totalAtoms * Math.pow(0.5, t / halfLife);
        const px = gx + (t / maxTime) * gw;
        const py = gy + gh - (n / totalAtoms) * gh;
        p.vertex(px, py);
      }
      p.endShape();
      p.drawingContext.setLineDash([]);

      // Half-life markers
      for (let i = 1; i <= 4; i++) {
        const tHL = halfLife * i;
        if (tHL <= maxTime) {
          const px = gx + (tHL / maxTime) * gw;
          p.stroke(255, 255, 255, 30);
          p.strokeWeight(1);
          p.line(px, gy, px, gy + gh);
          p.fill(255, 255, 255, 60);
          p.noStroke();
          p.textSize(9);
          p.textAlign(p.CENTER);
          p.text(`${i}τ`, px, gy + gh + 15);
        }
      }

      // Actual data points
      if (decayHistory.length > 1) {
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#00ff88';
        p.noFill();
        p.beginShape();
        for (const pt of decayHistory) {
          const px = gx + (pt.t / maxTime) * gw;
          const py = gy + gh - (pt.n / totalAtoms) * gh;
          if (px <= gx + gw) p.vertex(px, py);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Statistics
      const remaining = atoms.filter(a => !a.decayed).length;
      const decayed = totalAtoms - remaining;

      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(13);
      p.textAlign(p.LEFT);

      const infoY = gy + gh + 50;
      p.fill(0, 245, 212);
      p.text(`Remaining: ${remaining}`, gx, infoY);
      p.fill(80, 80, 100);
      p.text(`Decayed: ${decayed}`, gx, infoY + 22);
      p.fill(255, 255, 255, 180);
      p.text(`Time: ${time.toFixed(1)} s`, gx, infoY + 44);
      p.text(`Half-life: ${halfLife.toFixed(1)} s`, gx, infoY + 66);

      // Formula
      p.fill(0, 245, 212);
      p.textSize(14);
      p.textAlign(p.CENTER);
      p.text('N(t) = N₀ × (½)^(t/τ)', width / 2, height - 15);

      // Legend
      p.textSize(10);
      p.textAlign(p.LEFT);
      p.fill(0, 255, 136);
      p.text('━ Measured', gx + gw - 100, gy + 15);
      p.fill(0, 245, 212, 100);
      p.text('┅ Theory', gx + gw - 100, gy + 30);
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { halfLife: 5, initialAtoms: 100 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'halfLife', label: 'Half-Life', min: 1, max: 20, step: 0.5, value: 5, unit: 's' },
    { name: 'initialAtoms', label: 'Initial Atoms', min: 50, max: 200, step: 10, value: 100, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
