// Escape Velocity — Launch rocket and see if it escapes
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'escape-velocity';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let rocketY, rocketVy, launched, escaped, crashed, time;
    let trail = [];

    function resetState() {
      rocketY = 0; rocketVy = 0; launched = false; escaped = false; crashed = false; time = 0; trail = [];
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      resetState();
    };

    engine.onReset(() => resetState());

    p.draw = () => {
      p.background(10, 10, 26);
      const planetR = engine.getParam('planetRadius');
      const planetM = engine.getParam('planetMass');
      const launchFactor = engine.getParam('launchSpeed');

      const G = 6.674;
      const escapeV = Math.sqrt(2 * G * planetM / planetR);
      const launchV = launchFactor * escapeV;

      const groundY = height - 80;
      const planetVisR = 60 * planetR;
      const scale = 2;

      // Draw starfield
      p.randomSeed(42);
      p.fill(255, 255, 255, 80);
      p.noStroke();
      for (let i = 0; i < 60; i++) {
        p.ellipse(p.random(width), p.random(height * 0.7), p.random(1, 3));
      }
      p.randomSeed(p.millis());

      // Draw planet surface
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(20, 40, 80);
      p.noStroke();
      p.arc(width / 2, height + planetVisR - 80, planetVisR * 2, planetVisR * 2, p.PI, 0);
      p.drawingContext.shadowBlur = 0;

      // Ground line
      p.stroke(0, 180, 216, 100);
      p.strokeWeight(1);
      p.line(0, groundY, width, groundY);

      // Launch on click
      if (p.mouseIsPressed && p.mouseY < height && !launched) {
        launched = true;
        rocketVy = -launchV;
        rocketY = 0;
        trail = [];
        escaped = false;
        crashed = false;
        time = 0;
      }

      // Physics
      if (engine.isPlaying && launched && !escaped && !crashed) {
        const dt = (1 / 60) * engine.speed;
        time += dt;
        const dist = planetR + Math.max(rocketY * 0.01, 0);
        const gravity = G * planetM / (dist * dist);
        rocketVy += gravity * dt;
        rocketY -= rocketVy * scale * dt;

        trail.push({ y: rocketY });
        if (trail.length > 300) trail.shift();

        if (rocketY > 0) { crashed = true; rocketY = 0; }
        if (rocketY < -(height + 200)) escaped = true;
      }

      // Draw trail
      for (let i = 1; i < trail.length; i++) {
        const alpha = (i / trail.length) * 200;
        const screenY = groundY + trail[i].y;
        if (screenY > 0 && screenY < height) {
          p.fill(255, 170, 0, alpha);
          p.noStroke();
          p.ellipse(width / 2 + (Math.random() - 0.5) * 4, screenY, 3, 3);
        }
      }

      // Draw rocket
      const rocketScreenY = Math.max(groundY + rocketY, 20);
      if (rocketScreenY < height && !escaped) {
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ff006e';
        p.fill(255, 0, 110);
        p.noStroke();
        p.triangle(width / 2 - 8, rocketScreenY + 15, width / 2 + 8, rocketScreenY + 15, width / 2, rocketScreenY - 15);
        p.drawingContext.shadowBlur = 0;

        // Flame
        if (launched && time < 0.5) {
          p.fill(255, 170, 0, 200);
          p.triangle(width / 2 - 5, rocketScreenY + 15, width / 2 + 5, rocketScreenY + 15, width / 2, rocketScreenY + 25 + Math.random() * 10);
        }
      }

      // Info panel
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Escape Velocity: ${escapeV.toFixed(2)} m/s`, 15, 25);
      p.text(`Launch Velocity: ${launchV.toFixed(2)} m/s (${(launchFactor * 100).toFixed(0)}% of escape)`, 15, 45);

      if (launched) {
        p.text(`Current Velocity: ${Math.abs(rocketVy).toFixed(2)} m/s`, 15, 65);
        p.text(`Time: ${time.toFixed(1)} s`, 15, 85);
      }

      if (escaped) {
        p.fill(0, 255, 136);
        p.textSize(20);
        p.textAlign(p.CENTER);
        p.text('ESCAPED!', width / 2, height / 3);
      } else if (crashed) {
        p.fill(255, 68, 102);
        p.textSize(20);
        p.textAlign(p.CENTER);
        p.text('Fell back to surface', width / 2, height / 3);
      } else if (!launched) {
        p.fill(255, 255, 255, 120);
        p.textSize(14);
        p.textAlign(p.CENTER);
        p.text('Click to launch!', width / 2, height / 3);
      }
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { launchSpeed: 0.8, planetMass: 5, planetRadius: 1 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'launchSpeed', label: 'Launch Speed', min: 0.3, max: 2, step: 0.05, value: 0.8, unit: '× v_esc' },
    { name: 'planetMass', label: 'Planet Mass', min: 1, max: 10, step: 0.5, value: 5, unit: 'M⊕' },
    { name: 'planetRadius', label: 'Planet Radius', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'R⊕' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
