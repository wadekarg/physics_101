// Generators & Transformers — AC generator + transformer
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'generators-transformers';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let angle = 0;
    let emfHistory = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const rpm = engine.getParam('rotationSpeed');
      const n1 = Math.round(engine.getParam('turns1'));
      const n2 = Math.round(engine.getParam('turns2'));

      if (engine.isPlaying) {
        angle += rpm * 0.05 * engine.speed;
      }

      // --- Left half: Generator ---
      const genX = width * 0.25, genY = height * 0.35;

      // Magnetic field (N and S poles)
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff4466';
      p.fill(200, 50, 50);
      p.noStroke();
      p.rect(genX - 100, genY - 50, 30, 100, 4);
      p.fill(255);
      p.textSize(14);
      p.textAlign(p.CENTER);
      p.text('N', genX - 85, genY + 5);

      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(50, 50, 200);
      p.rect(genX + 70, genY - 50, 30, 100, 4);
      p.fill(255);
      p.text('S', genX + 85, genY + 5);
      p.drawingContext.shadowBlur = 0;

      // B field arrows
      p.stroke(139, 92, 246, 60);
      p.strokeWeight(1);
      for (let i = -2; i <= 2; i++) {
        const ly = genY + i * 20;
        p.line(genX - 65, ly, genX + 65, ly);
        p.line(genX + 60, ly, genX + 55, ly - 3);
        p.line(genX + 60, ly, genX + 55, ly + 3);
      }

      // Rotating coil
      p.push();
      p.translate(genX, genY);
      p.rotate(angle);
      p.stroke(200, 160, 50);
      p.strokeWeight(3);
      p.noFill();
      p.rect(-35, -25, 70, 50, 3);
      p.pop();

      // EMF = N*B*A*ω*sin(ωt)
      const emf = n1 * Math.sin(angle) * 5;
      emfHistory.push(emf);
      if (emfHistory.length > 200) emfHistory.shift();

      // EMF waveform
      const gwY = height * 0.75, gwH = 80, gwX = 30, gwW = width * 0.45;
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(gwX, gwY, gwX + gwW, gwY);
      p.line(gwX, gwY - gwH, gwX, gwY + gwH);

      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#00ff88';
      p.noFill();
      p.beginShape();
      for (let i = 0; i < emfHistory.length; i++) {
        const px = gwX + (i / 200) * gwW;
        const py = gwY - (emfHistory[i] / (n1 * 5 + 1)) * gwH;
        p.vertex(px, py);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 255, 255, 150);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Generator EMF', gwX + gwW / 2, gwY + gwH + 15);

      // --- Right half: Transformer ---
      const txX = width * 0.7, txY = height * 0.35;

      // Core
      p.fill(80, 80, 100);
      p.noStroke();
      p.rect(txX - 50, txY - 50, 100, 100, 4);
      p.fill(10, 10, 26);
      p.rect(txX - 35, txY - 35, 70, 70, 2);

      // Primary coil (left side of core)
      p.stroke(255, 100, 100);
      p.strokeWeight(2);
      p.noFill();
      const primaryX = txX - 50;
      for (let i = 0; i < Math.min(n1 / 5, 10); i++) {
        const cy = txY - 40 + i * 8;
        p.arc(primaryX - 5, cy, 15, 8, -p.HALF_PI, p.HALF_PI);
      }

      // Secondary coil (right side of core)
      p.stroke(0, 180, 216);
      const secondaryX = txX + 50;
      for (let i = 0; i < Math.min(n2 / 5, 10); i++) {
        const cy = txY - 40 + i * 8;
        p.arc(secondaryX + 5, cy, 15, 8, p.HALF_PI, -p.HALF_PI);
      }

      // Transformer output
      const v1 = Math.abs(emf);
      const v2 = v1 * (n2 / n1);

      // Labels
      p.fill(255, 100, 100);
      p.noStroke();
      p.textSize(11);
      p.textAlign(p.CENTER);
      p.text(`V₁ = ${v1.toFixed(1)}V`, primaryX - 20, txY + 70);
      p.text(`N₁ = ${n1}`, primaryX - 20, txY + 85);

      p.fill(0, 180, 216);
      p.text(`V₂ = ${v2.toFixed(1)}V`, secondaryX + 20, txY + 70);
      p.text(`N₂ = ${n2}`, secondaryX + 20, txY + 85);

      // Transformer equation
      p.fill(139, 92, 246);
      p.textSize(14);
      p.text('V₁/V₂ = N₁/N₂', txX, txY + 110);

      // Ratio
      p.fill(255, 170, 0);
      p.textSize(12);
      const ratio = n2 / n1;
      const type = ratio > 1 ? 'Step-Up' : ratio < 1 ? 'Step-Down' : 'Equal';
      p.text(`${type} (ratio: 1:${ratio.toFixed(2)})`, txX, txY + 130);

      // Title labels
      p.fill(255);
      p.textSize(15);
      p.textAlign(p.CENTER);
      p.text('AC Generator', genX, 20);
      p.text('Transformer', txX, 20);
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { rotationSpeed: 3, turns1: 50, turns2: 100 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'rotationSpeed', label: 'Rotation Speed', min: 1, max: 10, step: 0.5, value: 3, unit: 'Hz' },
    { name: 'turns1', label: 'Primary Turns', min: 10, max: 100, step: 5, value: 50, unit: '' },
    { name: 'turns2', label: 'Secondary Turns', min: 10, max: 100, step: 5, value: 100, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
