// Chapter 0: The Scientific Method — Interactive Ball Drop Experiment
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'scientific-method';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    const g = 9.81;

    // Drag constants (spherical ball in air)
    const airDensity = 1.225; // kg/m³
    const dragCoeff = 0.47;   // sphere
    const panelW = 220;       // info panel width (pixels)

    // Experiment state (physics tracked in metres, converted to pixels for drawing)
    let fallDist = 0;   // metres fallen so far
    let ballVy = 0;     // m/s downward
    let dropping = false;
    let landed = false;
    let dropTime = 0;
    let elapsedTime = 0;
    let trials = [];
    let phase = 'question'; // question, hypothesis, running, analysis, conclusion
    let airOn = false;

    function theoreticalTime(h) {
      return Math.sqrt(2 * h / g);
    }

    function ballCrossSection(mass) {
      const density = 2000;
      const volume = mass / density;
      const radius = Math.cbrt(3 * volume / (4 * Math.PI));
      return Math.PI * radius * radius;
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      resetExperiment();
    };

    function resetExperiment() {
      fallDist = 0;
      ballVy = 0;
      dropping = false;
      landed = false;
      dropTime = 0;
      elapsedTime = 0;
      phase = 'question';
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const h = engine.getParam('height');
      const mass = engine.getParam('mass');

      // Scale: map height (1-20m) to pixels
      const groundY = height - 60;
      const topY = 60;
      const pixelsPerMeter = (groundY - topY) / 20;
      const dropPixels = h * pixelsPerMeter;
      const startY = groundY - dropPixels;
      const ballRadius = Math.max(8, Math.min(20, mass * 2.5));

      // ── Instruction text at top (the main prompt for current phase) ──
      p.noStroke();
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(13);
      p.fill(255, 255, 255, 220);
      if (phase === 'question') {
        p.fill(0, 180, 216);
        p.text('Question: Does mass affect how fast an object falls?', width / 2, 10);
        p.fill(255, 255, 255, 140);
        p.textSize(11);
        p.text('Set height & mass with sliders below. Click canvas to proceed.', width / 2, 30);
      } else if (phase === 'hypothesis') {
        p.fill(139, 92, 246);
        p.text('Hypothesis: "In vacuum, all objects fall at the same rate."', width / 2, 10);
        p.fill(255, 255, 255, 140);
        p.textSize(11);
        p.text('Click canvas to run the experiment and test this hypothesis.', width / 2, 30);
      } else if (phase === 'running') {
        p.fill(255, 200, 50);
        p.text('Experiment running \u2014 observing the drop...', width / 2, 10);
      } else if (phase === 'analysis') {
        p.fill(0, 255, 136);
        p.text('Analyze: Compare measured time vs vacuum prediction.', width / 2, 10);
        p.fill(255, 255, 255, 140);
        p.textSize(11);
        p.text('Check the data panel on the right. Click canvas to conclude.', width / 2, 30);
      } else if (phase === 'conclusion') {
        p.fill(0, 255, 136);
        if (airOn) {
          p.text('With air, heavier objects fall slightly faster (less drag/kg).', width / 2, 10);
        } else {
          p.text('Confirmed! In vacuum, mass doesn\u2019t matter \u2014 only height.', width / 2, 10);
        }
        p.fill(255, 255, 255, 140);
        p.textSize(11);
        p.text('Click canvas to start a new experiment. Try toggling air resistance!', width / 2, 30);
      }

      // ── Draw measurement ruler on left ──
      p.stroke(100, 100, 120);
      p.strokeWeight(1);
      const rulerX = 50;
      p.line(rulerX, topY, rulerX, groundY);
      for (let m = 0; m <= 20; m += 2) {
        const ry = groundY - m * pixelsPerMeter;
        p.line(rulerX - 5, ry, rulerX + 5, ry);
        p.noStroke();
        p.fill(150, 150, 170);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(m + 'm', rulerX - 8, ry);
        p.stroke(100, 100, 120);
        p.strokeWeight(1);
      }

      // ── Draw ground ──
      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ff88';
      p.line(30, groundY, width - panelW - 30, groundY);
      p.drawingContext.shadowBlur = 0;

      // ── Draw drop height indicator ──
      p.stroke(0, 180, 216, 100);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(width / 3, startY, width / 3, groundY);
      p.drawingContext.setLineDash([]);
      p.noStroke();
      p.fill(0, 180, 216, 150);
      p.textSize(11);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('h = ' + h.toFixed(1) + ' m', width / 3 + 10, (startY + groundY) / 2);

      // ── Physics update (all in metres, pixels only for drawing) ──
      if (dropping && !landed && engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        elapsedTime += dt;

        let ay = g;

        // Air resistance: F_drag = 0.5 * rho * Cd * A * v^2
        if (airOn && ballVy > 0) {
          const area = ballCrossSection(mass);
          const dragForce = 0.5 * airDensity * dragCoeff * area * ballVy * ballVy;
          const dragAccel = dragForce / mass;
          ay = g - dragAccel;
          if (ay < 0) ay = 0; // terminal velocity
        }

        // Verlet integration (position first, then velocity) for accuracy
        const prevFall = fallDist;
        fallDist += ballVy * dt + 0.5 * ay * dt * dt;
        ballVy += ay * dt;

        if (fallDist >= h) {
          // Interpolate exact landing time
          const overshoot = fallDist - h;
          const frameTravel = fallDist - prevFall;
          const frac = frameTravel > 0 ? overshoot / frameTravel : 0;
          dropTime = elapsedTime - frac * dt;

          fallDist = h;
          landed = true;
          phase = 'analysis';
          trials.push({
            height: h,
            mass: mass,
            air: airOn,
            time: dropTime,
            theoretical: theoreticalTime(h)
          });
        }
      }

      // Convert metres → pixel Y for drawing
      const displayY = dropping ? startY + fallDist * pixelsPerMeter : startY;
      const clampedY = Math.min(displayY, groundY - ballRadius);

      // ── Draw air resistance particles ──
      if (airOn && dropping && !landed) {
        p.noStroke();
        for (let i = 0; i < 6; i++) {
          const px = width / 3 + (Math.random() - 0.5) * ballRadius * 3;
          const py = clampedY - ballRadius - Math.random() * 20;
          const sz = 1 + Math.random() * 2;
          p.fill(255, 170, 0, 80 + Math.random() * 80);
          p.ellipse(px, py, sz, sz);
        }
      }
      // ── Draw ball ──
      p.noStroke();
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(139, 92, 246);
      p.ellipse(width / 3, clampedY, ballRadius * 2, ballRadius * 2);
      p.drawingContext.shadowBlur = 8;
      p.fill(180, 140, 255);
      p.ellipse(width / 3 - ballRadius * 0.25, clampedY - ballRadius * 0.25, ballRadius * 0.6, ballRadius * 0.6);
      p.drawingContext.shadowBlur = 0;

      // ── Draw velocity arrow ──
      if (dropping && !landed) {
        const arrowLen = Math.min(ballVy * 3, 80);
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ff6464';
        p.line(width / 3 + ballRadius + 5, clampedY, width / 3 + ballRadius + 5, clampedY + arrowLen);
        p.line(width / 3 + ballRadius + 5, clampedY + arrowLen, width / 3 + ballRadius, clampedY + arrowLen - 6);
        p.line(width / 3 + ballRadius + 5, clampedY + arrowLen, width / 3 + ballRadius + 10, clampedY + arrowLen - 6);
        p.drawingContext.shadowBlur = 0;
      }

      // ── Info panel on the right (cursor-based layout, no overlap) ──
      const panelX = width - panelW - 10;
      const panelTop = 55;
      let cy = panelTop + 10; // running cursor Y

      // Pre-calculate panel height so we can draw background first
      let panelH = 10; // top padding
      panelH += 20;    // "Variables:" header
      panelH += 16 * 3; // height, mass, g
      panelH += 8;     // gap before formula
      panelH += airOn ? 16 * 3 : 16 * 2; // formula lines
      if (dropping || landed) { panelH += 8 + 16 * 2; } // measured + velocity
      if (landed) { panelH += 8 + 16 * 2; } // result + explanation
      if (trials.length > 0) {
        panelH += 12; // divider gap
        panelH += 16; // table header
        panelH += Math.min(trials.length, 4) * 15; // rows
      }
      panelH += 10; // bottom padding

      // Panel background
      p.fill(20, 20, 40, 220);
      p.stroke(0, 180, 216, 80);
      p.strokeWeight(1);
      p.rect(panelX - 10, panelTop, panelW + 10, panelH, 8);
      p.noStroke();
      p.textAlign(p.LEFT, p.TOP);

      // Header
      p.fill(0, 180, 216);
      p.textSize(13);
      p.text('Variables:', panelX, cy);
      cy += 22;

      // Variables
      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Height: ' + h.toFixed(1) + ' m', panelX, cy); cy += 16;
      p.text('Mass: ' + mass.toFixed(1) + ' kg', panelX, cy); cy += 16;
      p.text('g = 9.81 m/s\u00B2', panelX, cy); cy += 16;

      // Formula
      cy += 8;
      if (airOn) {
        p.fill(255, 170, 0);
        p.textSize(11);
        p.text('With air: no simple formula', panelX, cy); cy += 16;
        p.fill(200, 200, 220);
        p.textSize(11);
        p.text('F = mg \u2212 \u00BDC\u1D48\u03C1Av\u00B2', panelX, cy); cy += 16;
        p.fill(150, 150, 170);
        p.textSize(10);
        p.text('(solved numerically each frame)', panelX, cy); cy += 16;
      } else {
        p.fill(139, 92, 246);
        p.textSize(12);
        p.text('Vacuum:  t = \u221A(2h / g)', panelX, cy); cy += 18;
        p.fill(0, 255, 136);
        p.textSize(12);
        p.text('  = ' + theoreticalTime(h).toFixed(3) + ' s', panelX, cy); cy += 16;
      }

      // Measured / velocity (only while running or landed)
      if (dropping || landed) {
        cy += 8;
        p.fill(255, 200, 50);
        p.textSize(11);
        p.text('Measured: ' + (landed ? dropTime.toFixed(3) : elapsedTime.toFixed(3)) + ' s', panelX, cy); cy += 16;
        p.text('Velocity: ' + ballVy.toFixed(2) + ' m/s', panelX, cy); cy += 16;
      }

      // Result message (only when landed)
      if (landed) {
        cy += 8;
        if (airOn) {
          const err = dropTime - theoreticalTime(h);
          p.fill('#ffaa00');
          p.textSize(11);
          p.text('Slower by: ' + err.toFixed(4) + ' s', panelX, cy); cy += 16;
          p.fill(200, 200, 220);
          p.textSize(10);
          p.text('(vs vacuum prediction)', panelX, cy); cy += 14;
        } else {
          p.fill(0, 255, 136);
          p.textSize(11);
          p.text('\u2714 Matches prediction!', panelX, cy); cy += 16;
          p.fill(200, 200, 220);
          p.textSize(10);
          p.text('In vacuum, mass has no', panelX, cy); cy += 14;
          p.text('effect on drop time.', panelX, cy); cy += 14;
        }
      }

      // Trial records table (inside same panel)
      if (trials.length > 0) {
        cy += 6;
        // Divider line
        p.stroke(0, 180, 216, 40);
        p.strokeWeight(1);
        p.line(panelX, cy, panelX + panelW - 10, cy);
        p.noStroke();
        cy += 6;

        p.fill(0, 180, 216);
        p.textSize(9);
        p.text('#  h(m)  m(kg)  env   t(s)', panelX, cy); cy += 16;

        const display = trials.slice(-4);
        display.forEach((tr, i) => {
          p.fill(200, 200, 220);
          p.textSize(9);
          const env = tr.air ? 'air' : 'vac';
          const num = trials.length - display.length + i + 1;
          const line = `${num}  ${tr.height.toFixed(1)}   ${tr.mass.toFixed(1)}    ${env}   ${tr.time.toFixed(3)}`;
          p.text(line, panelX, cy); cy += 15;
        });
      }

      // ── Read toggle state from engine param ──
      airOn = engine.getParam('airResistance') >= 1;

      // ── Step labels at bottom ──
      const steps = ['1. Question', '2. Hypothesis', '3. Experiment', '4. Analyze', '5. Conclude'];
      const phaseMap = { question: 0, hypothesis: 1, running: 2, analysis: 3, conclusion: 4 };
      const stepIdx = phaseMap[phase] ?? 0;
      p.textAlign(p.CENTER, p.BOTTOM);
      for (let i = 0; i < steps.length; i++) {
        const sx = 40 + i * ((width - 80) / (steps.length - 1));
        const sy = height - 10;
        p.fill(i === stepIdx ? '#00ff88' : i < stepIdx ? '#00b4d8' : 'rgba(255,255,255,0.3)');
        p.textSize(i === stepIdx ? 12 : 10);
        p.text(steps[i], sx, sy);
        if (i === stepIdx) {
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#00ff88';
          p.fill(0, 255, 136);
          p.ellipse(sx, sy - 18, 6, 6);
          p.drawingContext.shadowBlur = 0;
        }
      }
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Phase transitions
      if (phase === 'question') {
        phase = 'hypothesis';
      } else if (phase === 'hypothesis') {
        dropping = true;
        phase = 'running';
        fallDist = 0;
        ballVy = 0;
        elapsedTime = 0;
      } else if (phase === 'analysis') {
        phase = 'conclusion';
      } else if (phase === 'conclusion') {
        dropping = false;
        landed = false;
        fallDist = 0;
        ballVy = 0;
        elapsedTime = 0;
        dropTime = 0;
        phase = 'question';
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { height: 10, mass: 1, airResistance: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'height', label: 'Drop Height', min: 1, max: 20, step: 0.5, value: 10, unit: 'm' },
    { name: 'mass', label: 'Ball Mass', min: 0.1, max: 10, step: 0.1, value: 1, unit: 'kg' }
  ]);

  // ── Environment toggle (HTML, below sliders) ──
  const controlsEl = document.getElementById('sim-controls');
  if (controlsEl) {
    const toggleRow = document.createElement('div');
    toggleRow.className = 'sim-param-row';
    toggleRow.style.marginTop = '4px';

    const label = document.createElement('label');
    label.className = 'sim-param-label';
    label.textContent = 'Environment';
    label.htmlFor = 'sim-param-air';

    const toggleWrap = document.createElement('div');
    toggleWrap.style.cssText = 'display:flex;align-items:center;gap:8px;flex:1;';

    const toggle = document.createElement('button');
    toggle.id = 'sim-param-air';
    toggle.type = 'button';
    toggle.style.cssText = `
      position:relative; width:52px; height:26px; border-radius:13px;
      border:1.5px solid var(--accent); background:var(--bg-tertiary);
      cursor:pointer; transition:all 0.25s ease; padding:0;
    `.replace(/\n/g, '');

    const knob = document.createElement('span');
    knob.style.cssText = `
      position:absolute; top:2px; left:2px; width:20px; height:20px;
      border-radius:50%; background:var(--accent); transition:all 0.25s ease;
      box-shadow:0 0 6px var(--accent);
    `.replace(/\n/g, '');
    toggle.appendChild(knob);

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'sim-param-value';
    valueDisplay.textContent = 'Vacuum';

    function updateToggle(on) {
      engine.setParam('airResistance', on ? 1 : 0);
      knob.style.left = on ? '28px' : '2px';
      toggle.style.borderColor = on ? '#ffaa00' : 'var(--accent)';
      knob.style.background = on ? '#ffaa00' : 'var(--accent)';
      knob.style.boxShadow = on ? '0 0 6px #ffaa00' : '0 0 6px var(--accent)';
      valueDisplay.textContent = on ? 'Air' : 'Vacuum';
      valueDisplay.style.color = on ? '#ffaa00' : '';
    }

    toggle.addEventListener('click', () => {
      const isOn = engine.getParam('airResistance') >= 1;
      updateToggle(!isOn);
    });

    toggleWrap.appendChild(toggle);
    toggleRow.appendChild(label);
    toggleRow.appendChild(toggleWrap);
    toggleRow.appendChild(valueDisplay);

    const paramsEl = controlsEl.querySelector('.sim-params');
    if (paramsEl) {
      paramsEl.appendChild(toggleRow);
    } else {
      controlsEl.appendChild(toggleRow);
    }
  }

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
