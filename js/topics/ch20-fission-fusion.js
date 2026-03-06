// Nuclear Fission & Fusion — Chain reaction and stellar fusion
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'fission-fusion';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let particles = [];
    let flashes = [];
    let time = 0;
    let started = false;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      resetSim();
    };

    function resetSim() {
      particles = [];
      flashes = [];
      time = 0;
      started = false;
      const mode = Math.round(engine.getParam('reactionType'));

      if (mode === 0) {
        // Fission: place uranium atoms in grid
        for (let i = 0; i < 25; i++) {
          particles.push({
            x: width * 0.2 + (i % 5) * 50 + Math.random() * 20,
            y: 100 + Math.floor(i / 5) * 60 + Math.random() * 20,
            vx: 0, vy: 0,
            type: 'uranium', radius: 18, split: false
          });
        }
        // Initial neutron
        particles.push({
          x: 30, y: height / 2,
          vx: 4, vy: 0,
          type: 'neutron', radius: 5
        });
        started = true;
      } else {
        // Fusion: hydrogen atoms
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2;
          particles.push({
            x: width * 0.3 + Math.random() * width * 0.4,
            y: 80 + Math.random() * (height - 160),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            type: 'hydrogen', radius: 10
          });
        }
        started = true;
      }
    }

    engine.onReset(() => resetSim());

    p.draw = () => {
      p.background(10, 10, 26);
      const mode = Math.round(engine.getParam('reactionType'));

      if (engine.isPlaying) time += (1 / 60) * engine.speed;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER);
      p.text(mode === 0 ? 'Nuclear Fission — Chain Reaction' : 'Nuclear Fusion — Stellar Energy', width / 2, 30);

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i];
        if (!engine.isPlaying) break;

        part.x += part.vx * engine.speed;
        part.y += part.vy * engine.speed;

        // Bounce off walls
        if (part.x < 10 || part.x > width - 10) part.vx *= -1;
        if (part.y < 50 || part.y > height - 30) part.vy *= -1;
        part.x = p.constrain(part.x, 10, width - 10);
        part.y = p.constrain(part.y, 50, height - 30);

        // Fission: neutron hits uranium
        if (mode === 0 && part.type === 'neutron') {
          for (let j = particles.length - 1; j >= 0; j--) {
            const other = particles[j];
            if (other.type !== 'uranium' || other.split) continue;
            const d = p.dist(part.x, part.y, other.x, other.y);
            if (d < part.radius + other.radius) {
              // Split uranium!
              other.split = true;
              other.type = 'fragment';
              other.radius = 10;
              other.vx = (Math.random() - 0.5) * 4;
              other.vy = (Math.random() - 0.5) * 4;

              // Create fragment
              particles.push({
                x: other.x + 15, y: other.y - 10,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                type: 'fragment', radius: 10
              });

              // Release 2-3 neutrons
              for (let k = 0; k < 2 + (Math.random() > 0.5 ? 1 : 0); k++) {
                const angle = Math.random() * Math.PI * 2;
                particles.push({
                  x: other.x, y: other.y,
                  vx: Math.cos(angle) * (3 + Math.random() * 2),
                  vy: Math.sin(angle) * (3 + Math.random() * 2),
                  type: 'neutron', radius: 5
                });
              }

              // Flash
              flashes.push({ x: other.x, y: other.y, life: 1, r: 30 });

              // Remove the neutron that caused the split
              particles.splice(i, 1);
              break;
            }
          }
        }

        // Fusion: hydrogen + hydrogen → helium
        if (mode === 1 && part.type === 'hydrogen') {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            if (other.type !== 'hydrogen') continue;
            const d = p.dist(part.x, part.y, other.x, other.y);
            if (d < part.radius + other.radius + 2) {
              // Fuse!
              const cx = (part.x + other.x) / 2;
              const cy = (part.y + other.y) / 2;

              particles[i] = {
                x: cx, y: cy,
                vx: (part.vx + other.vx) * 0.3,
                vy: (part.vy + other.vy) * 0.3,
                type: 'helium', radius: 14
              };
              particles.splice(j, 1);

              flashes.push({ x: cx, y: cy, life: 1, r: 40 });

              // Release energy photon
              const angle = Math.random() * Math.PI * 2;
              particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                type: 'photon', radius: 4, life: 1
              });
              break;
            }
          }
        }

        // Photons lose life
        if (part.type === 'photon') {
          part.life = (part.life || 1) - 0.01 * engine.speed;
          if (part.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        }
      }

      // Draw flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        if (engine.isPlaying) f.life -= 0.03 * engine.speed;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }

        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowColor = mode === 0 ? '#ffaa00' : '#00f5d4';
        p.fill(255, 255, 255, f.life * 200);
        p.noStroke();
        p.ellipse(f.x, f.y, f.r * f.life * 2, f.r * f.life * 2);
        p.drawingContext.shadowBlur = 0;
      }

      // Draw particles
      for (const part of particles) {
        p.noStroke();
        switch (part.type) {
          case 'uranium':
            p.drawingContext.shadowBlur = 6;
            p.drawingContext.shadowColor = '#00f5d4';
            p.fill(0, 200, 180);
            p.ellipse(part.x, part.y, part.radius * 2);
            p.fill(255);
            p.textSize(9);
            p.textAlign(p.CENTER);
            p.text('U', part.x, part.y + 3);
            break;
          case 'neutron':
            p.drawingContext.shadowBlur = 8;
            p.drawingContext.shadowColor = '#ffaa00';
            p.fill(255, 170, 0);
            p.ellipse(part.x, part.y, part.radius * 2);
            break;
          case 'fragment':
            p.fill(100, 150, 130);
            p.ellipse(part.x, part.y, part.radius * 2);
            break;
          case 'hydrogen':
            p.drawingContext.shadowBlur = 6;
            p.drawingContext.shadowColor = '#ff006e';
            p.fill(255, 0, 110);
            p.ellipse(part.x, part.y, part.radius * 2);
            p.fill(255);
            p.textSize(9);
            p.textAlign(p.CENTER);
            p.text('H', part.x, part.y + 3);
            break;
          case 'helium':
            p.drawingContext.shadowBlur = 8;
            p.drawingContext.shadowColor = '#ffaa00';
            p.fill(255, 200, 50);
            p.ellipse(part.x, part.y, part.radius * 2);
            p.fill(40);
            p.textSize(9);
            p.textAlign(p.CENTER);
            p.text('He', part.x, part.y + 3);
            break;
          case 'photon':
            p.drawingContext.shadowBlur = 10;
            p.drawingContext.shadowColor = '#00f5d4';
            p.fill(0, 245, 212, (part.life || 1) * 200);
            p.ellipse(part.x, part.y, part.radius * 2);
            break;
        }
        p.drawingContext.shadowBlur = 0;
      }

      // Info
      p.fill(255, 255, 255, 150);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.LEFT);
      if (mode === 0) {
        const uraniums = particles.filter(p => p.type === 'uranium').length;
        const neutrons = particles.filter(p => p.type === 'neutron').length;
        p.text(`Uranium atoms: ${uraniums}  |  Neutrons: ${neutrons}`, 15, height - 15);
      } else {
        const hydrogens = particles.filter(p => p.type === 'hydrogen').length;
        const heliums = particles.filter(p => p.type === 'helium').length;
        p.text(`Hydrogen: ${hydrogens}  |  Helium: ${heliums}`, 15, height - 15);
      }
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { reactionType: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'reactionType', label: 'Reaction Type (0=Fission, 1=Fusion)', min: 0, max: 1, step: 1, value: 0, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
