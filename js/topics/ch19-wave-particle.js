// Wave-Particle Duality — Double slit with single particles building pattern
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'wave-particle-duality';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let hits = [];
    let activeParticles = [];
    let totalFired = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    engine.onReset(() => { hits = []; activeParticles = []; totalFired = 0; });

    p.draw = () => {
      p.background(10, 10, 26);
      const rate = engine.getParam('particleRate');
      const slitSep = engine.getParam('slitSeparation');

      const slitX = width * 0.35;
      const screenX = width * 0.75;
      const sourceX = 40;
      const cy = height / 2;

      // Barrier with double slit
      p.fill(60, 60, 90);
      p.noStroke();
      p.rect(slitX - 5, 0, 10, cy - slitSep / 2 - 8);
      p.rect(slitX - 5, cy - slitSep / 2 + 8, 10, slitSep - 16);
      p.rect(slitX - 5, cy + slitSep / 2 - 8 + 16, 10, height - cy - slitSep / 2 + 8);

      // Slit openings glow
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00f5d4';
      p.fill(0, 245, 212, 100);
      p.rect(slitX - 3, cy - slitSep / 2 - 8, 6, 16, 2);
      p.rect(slitX - 3, cy + slitSep / 2 - 8, 6, 16, 2);
      p.drawingContext.shadowBlur = 0;

      // Detection screen
      p.fill(30, 30, 50);
      p.noStroke();
      p.rect(screenX, 20, 8, height - 40, 3);

      // Source
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00f5d4';
      p.fill(0, 245, 212);
      p.noStroke();
      p.ellipse(sourceX, cy, 16, 16);
      p.drawingContext.shadowBlur = 0;
      p.fill(255, 255, 255, 100);
      p.textSize(9);
      p.textAlign(p.CENTER);
      p.text('Source', sourceX, cy + 20);

      // Fire particles
      if (engine.isPlaying && Math.random() < rate * 0.02 * engine.speed) {
        activeParticles.push({
          x: sourceX + 10,
          y: cy + (Math.random() - 0.5) * 10,
          phase: Math.random() * Math.PI * 2
        });
        totalFired++;
      }

      // Update active particles
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const part = activeParticles[i];
        if (engine.isPlaying) {
          part.x += 5 * engine.speed;
        }

        // When reaching slits, determine landing position using interference
        if (part.x >= screenX) {
          // Calculate interference pattern landing position
          // Use probability distribution based on double-slit intensity
          const y = sampleInterferenceY(cy, slitSep, height);
          hits.push({ y: y, age: 0 });
          activeParticles.splice(i, 1);
          continue;
        }

        // Draw particle
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#00f5d4';
        p.fill(0, 245, 212);
        p.noStroke();
        p.ellipse(part.x, part.y, 5, 5);
        p.drawingContext.shadowBlur = 0;
      }

      // Draw detection hits on screen
      for (const hit of hits) {
        hit.age = Math.min((hit.age || 0) + 0.02, 1);
        p.fill(0, 245, 212, hit.age * 200);
        p.noStroke();
        p.ellipse(screenX + 4, hit.y, 3, 3);
      }

      // Histogram of hits (right side)
      const histX = screenX + 25;
      const histW = width - histX - 20;
      const bins = 60;
      const binH = (height - 60) / bins;
      const histogram = new Array(bins).fill(0);

      for (const hit of hits) {
        const bin = Math.floor((hit.y - 20) / ((height - 40) / bins));
        if (bin >= 0 && bin < bins) histogram[bin]++;
      }

      const maxCount = Math.max(...histogram, 1);

      for (let i = 0; i < bins; i++) {
        const barW = (histogram[i] / maxCount) * histW;
        if (barW > 0) {
          p.fill(0, 245, 212, 100);
          p.noStroke();
          p.rect(histX, 20 + i * binH, barW, binH - 1, 1);
        }
      }

      // Theoretical pattern (thin line)
      p.stroke(0, 245, 212, 60);
      p.strokeWeight(1);
      p.noFill();
      p.beginShape();
      for (let y = 20; y < height - 20; y += 2) {
        const dy = y - cy;
        const theta = dy * 0.01;
        const d = slitSep * 0.01;
        const beta = Math.PI * d * Math.sin(theta) / 0.05; // wavelength factor
        const intensity = Math.pow(Math.cos(beta), 2);
        // Single slit envelope
        const alpha = Math.PI * 8 * Math.sin(theta) / 0.05;
        const envelope = alpha === 0 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
        const total = intensity * envelope;
        p.vertex(histX + total * histW * 0.8, y);
      }
      p.endShape();

      // Info
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Particles fired: ${totalFired}`, 15, 25);
      p.text(`Hits detected: ${hits.length}`, 15, 45);

      p.fill(0, 245, 212);
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text('Each particle goes through BOTH slits!', width / 2, height - 30);
      p.fill(255, 255, 255, 100);
      p.textSize(11);
      p.text('Pattern builds one particle at a time', width / 2, height - 12);
    };

    function sampleInterferenceY(cy, sep, h) {
      // Rejection sampling from double-slit intensity pattern
      for (let attempt = 0; attempt < 100; attempt++) {
        const y = 30 + Math.random() * (h - 60);
        const dy = y - cy;
        const theta = dy * 0.008;
        const d = sep * 0.01;
        const beta = Math.PI * d * Math.sin(theta) / 0.05;
        const intensity = Math.pow(Math.cos(beta), 2);
        const alpha = Math.PI * 8 * Math.sin(theta) / 0.05;
        const envelope = alpha === 0 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
        const prob = intensity * envelope;

        if (Math.random() < prob) return y;
      }
      return cy + (Math.random() - 0.5) * 50;
    }

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { particleRate: 15, slitSeparation: 60 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'particleRate', label: 'Particle Rate', min: 1, max: 50, step: 1, value: 15, unit: '/s' },
    { name: 'slitSeparation', label: 'Slit Separation', min: 20, max: 100, step: 5, value: 60, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
