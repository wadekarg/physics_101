// Energy Levels & Spectra — Hydrogen atom transitions
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'energy-levels';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let photons = [];
    let electronN = 1;
    let transitioning = false;
    let transProgress = 0;
    let transFrom = 1, transTo = 1;

    const levels = [
      { n: 1, energy: -13.6 },
      { n: 2, energy: -3.4 },
      { n: 3, energy: -1.51 },
      { n: 4, energy: -0.85 },
      { n: 5, energy: -0.54 },
      { n: 6, energy: -0.38 }
    ];

    function energyToY(e) {
      return p.map(e, -14, 0, height - 60, 60);
    }

    function wavelengthToColor(wl) {
      // wl in nm
      if (wl < 380) return [150, 0, 255]; // UV
      if (wl < 440) return [100 + (440 - wl) / 60 * 155, 0, 255];
      if (wl < 490) return [0, (wl - 440) / 50 * 255, 255];
      if (wl < 510) return [0, 255, 255 - (wl - 490) / 20 * 255];
      if (wl < 580) return [(wl - 510) / 70 * 255, 255, 0];
      if (wl < 645) return [255, 255 - (wl - 580) / 65 * 255, 0];
      if (wl < 781) return [255, 0, 0];
      return [255, 0, 0]; // IR
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const levelX = 60, levelW = width * 0.4;

      // Draw energy levels
      for (const level of levels) {
        const y = energyToY(level.energy);
        const isOccupied = level.n === electronN && !transitioning;

        p.stroke(isOccupied ? [0, 245, 212] : [255, 255, 255, 60]);
        p.strokeWeight(isOccupied ? 3 : 1);
        if (isOccupied) {
          p.drawingContext.shadowBlur = 8;
          p.drawingContext.shadowColor = '#00f5d4';
        }
        p.line(levelX, y, levelX + levelW, y);
        p.drawingContext.shadowBlur = 0;

        // Labels
        p.fill(255, 255, 255, 180);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.RIGHT);
        p.text(`n=${level.n}`, levelX - 10, y + 4);
        p.textAlign(p.LEFT);
        p.text(`${level.energy.toFixed(2)} eV`, levelX + levelW + 10, y + 4);
      }

      // Axis
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(levelX - 5, 50, levelX - 5, height - 50);
      p.fill(255, 255, 255, 80);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Energy (eV)', levelX + levelW / 2, height - 15);
      p.text('0 eV (free)', levelX + levelW / 2, 50);

      // Draw electron
      let electronY;
      if (transitioning) {
        if (engine.isPlaying) {
          transProgress += 0.03 * engine.speed;
        }
        if (transProgress >= 1) {
          transitioning = false;
          electronN = transTo;
          transProgress = 0;
        }
        const fromY = energyToY(levels[transFrom - 1].energy);
        const toY = energyToY(levels[transTo - 1].energy);
        electronY = fromY + (toY - fromY) * easeInOutCubic(transProgress);
      } else {
        electronY = energyToY(levels[electronN - 1].energy);
      }

      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00f5d4';
      p.fill(0, 245, 212);
      p.noStroke();
      p.ellipse(levelX + levelW / 2, electronY - 10, 14, 14);
      p.fill(255);
      p.textSize(9);
      p.textAlign(p.CENTER);
      p.text('e⁻', levelX + levelW / 2, electronY - 7);
      p.drawingContext.shadowBlur = 0;

      // Update photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const ph = photons[i];
        if (engine.isPlaying) {
          ph.x += ph.vx * engine.speed;
          ph.life -= 0.01 * engine.speed;
        }
        if (ph.life <= 0 || ph.x > width + 20) {
          photons.splice(i, 1);
          continue;
        }
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = `rgb(${ph.color[0]},${ph.color[1]},${ph.color[2]})`;
        p.fill(ph.color[0], ph.color[1], ph.color[2], ph.life * 255);
        p.noStroke();
        p.ellipse(ph.x, ph.y, 8, 8);
        // Wavy trail
        p.stroke(ph.color[0], ph.color[1], ph.color[2], ph.life * 100);
        p.strokeWeight(1);
        p.noFill();
        p.beginShape();
        for (let dx = -25; dx <= 0; dx += 2) {
          p.vertex(ph.x + dx, ph.y + Math.sin(dx * 0.5 + ph.x * 0.1) * 3);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Transition buttons (right side)
      const btnX = width * 0.65;
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(14);
      p.textAlign(p.LEFT);
      p.text('Click a transition:', btnX, 35);

      const transitions = [];
      // Emission: can go down from current level
      if (electronN > 1) {
        for (let to = 1; to < electronN; to++) {
          transitions.push({ from: electronN, to, type: 'emission' });
        }
      }
      // Absorption: can go up from current level
      for (let to = electronN + 1; to <= 6; to++) {
        transitions.push({ from: electronN, to, type: 'absorption' });
      }

      for (let i = 0; i < transitions.length; i++) {
        const tr = transitions[i];
        const dE = Math.abs(levels[tr.to - 1].energy - levels[tr.from - 1].energy);
        const wl = 1240 / dE; // nm
        const col = wavelengthToColor(wl);
        const bY = 55 + i * 32;

        // Button background
        const isHover = p.mouseX > btnX && p.mouseX < btnX + 180 && p.mouseY > bY - 12 && p.mouseY < bY + 14;
        p.fill(col[0], col[1], col[2], isHover ? 40 : 15);
        p.stroke(col[0], col[1], col[2], 80);
        p.strokeWeight(1);
        p.rect(btnX, bY - 12, 180, 26, 4);

        p.fill(col[0], col[1], col[2]);
        p.noStroke();
        p.textSize(11);
        const arrow = tr.type === 'emission' ? '↓' : '↑';
        p.text(`${arrow} n=${tr.from} → n=${tr.to}  (${wl.toFixed(0)} nm)`, btnX + 8, bY + 4);
      }

      // Spectrum bar at bottom
      const specY = height - 45, specH = 15;
      p.fill(255, 255, 255, 80);
      p.noStroke();
      p.textSize(9);
      p.textAlign(p.CENTER);
      p.text('Emission Spectrum', width / 2, specY + 2);

      // Draw rainbow background for visible range
      for (let x = 0; x < width - 40; x++) {
        const wl = 380 + (x / (width - 40)) * 400;
        const c = wavelengthToColor(wl);
        p.stroke(c[0], c[1], c[2], 30);
        p.line(20 + x, specY, 20 + x, specY + specH);
      }

      // Draw spectral lines from all previous photons
      const emittedWavelengths = new Set();
      for (const ph of photons) {
        if (ph.wavelength) emittedWavelengths.add(ph.wavelength);
      }
    };

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    p.mouseClicked = () => {
      if (transitioning) return;
      const btnX = width * 0.65;

      const transitions = [];
      if (electronN > 1) {
        for (let to = 1; to < electronN; to++) {
          transitions.push({ from: electronN, to, type: 'emission' });
        }
      }
      for (let to = electronN + 1; to <= 6; to++) {
        transitions.push({ from: electronN, to, type: 'absorption' });
      }

      for (let i = 0; i < transitions.length; i++) {
        const bY = 55 + i * 32;
        if (p.mouseX > btnX && p.mouseX < btnX + 180 && p.mouseY > bY - 12 && p.mouseY < bY + 14) {
          const tr = transitions[i];
          transFrom = tr.from;
          transTo = tr.to;
          transitioning = true;
          transProgress = 0;

          // Emit photon for emission
          if (tr.type === 'emission') {
            const dE = Math.abs(levels[tr.to - 1].energy - levels[tr.from - 1].energy);
            const wl = 1240 / dE;
            const col = wavelengthToColor(wl);
            const fromY = energyToY(levels[tr.from - 1].energy);
            photons.push({
              x: 60 + (width * 0.4) / 2 + 20,
              y: fromY - 10,
              vx: 4,
              color: col,
              wavelength: wl,
              life: 1
            });
          }
          break;
        }
      }
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
