// The Standard Model — Interactive particle zoo
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'standard-model';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const particleData = [
    // Quarks
    { name: 'Up', symbol: 'u', mass: '2.2 MeV', charge: '+2/3', spin: '1/2', type: 'quark', gen: 1 },
    { name: 'Down', symbol: 'd', mass: '4.7 MeV', charge: '-1/3', spin: '1/2', type: 'quark', gen: 1 },
    { name: 'Charm', symbol: 'c', mass: '1.28 GeV', charge: '+2/3', spin: '1/2', type: 'quark', gen: 2 },
    { name: 'Strange', symbol: 's', mass: '96 MeV', charge: '-1/3', spin: '1/2', type: 'quark', gen: 2 },
    { name: 'Top', symbol: 't', mass: '173 GeV', charge: '+2/3', spin: '1/2', type: 'quark', gen: 3 },
    { name: 'Bottom', symbol: 'b', mass: '4.18 GeV', charge: '-1/3', spin: '1/2', type: 'quark', gen: 3 },
    // Leptons
    { name: 'Electron', symbol: 'e', mass: '0.511 MeV', charge: '-1', spin: '1/2', type: 'lepton', gen: 1 },
    { name: 'Electron Neutrino', symbol: 'νe', mass: '<2 eV', charge: '0', spin: '1/2', type: 'lepton', gen: 1 },
    { name: 'Muon', symbol: 'μ', mass: '106 MeV', charge: '-1', spin: '1/2', type: 'lepton', gen: 2 },
    { name: 'Muon Neutrino', symbol: 'νμ', mass: '<0.2 MeV', charge: '0', spin: '1/2', type: 'lepton', gen: 2 },
    { name: 'Tau', symbol: 'τ', mass: '1.78 GeV', charge: '-1', spin: '1/2', type: 'lepton', gen: 3 },
    { name: 'Tau Neutrino', symbol: 'ντ', mass: '<18 MeV', charge: '0', spin: '1/2', type: 'lepton', gen: 3 },
    // Bosons
    { name: 'Photon', symbol: 'γ', mass: '0', charge: '0', spin: '1', type: 'boson', force: 'Electromagnetic' },
    { name: 'W Boson', symbol: 'W±', mass: '80.4 GeV', charge: '±1', spin: '1', type: 'boson', force: 'Weak' },
    { name: 'Z Boson', symbol: 'Z⁰', mass: '91.2 GeV', charge: '0', spin: '1', type: 'boson', force: 'Weak' },
    { name: 'Gluon', symbol: 'g', mass: '0', charge: '0', spin: '1', type: 'boson', force: 'Strong' },
    { name: 'Higgs', symbol: 'H', mass: '125 GeV', charge: '0', spin: '0', type: 'higgs', force: 'Mass mechanism' }
  ];

  const typeColors = {
    quark: [255, 0, 110],
    lepton: [0, 180, 216],
    boson: [139, 92, 246],
    higgs: [255, 170, 0]
  };

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let selectedIdx = -1;
    let hoverIdx = -1;
    let cardPositions = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      calculatePositions();
    };

    function calculatePositions() {
      cardPositions = [];
      const cols = 6;
      const cardW = Math.min(70, (width - 40) / cols - 8);
      const cardH = cardW * 1.2;
      const startX = 20;
      const startY = 50;
      const gap = 6;

      // Row 1: quarks (6)
      for (let i = 0; i < 6; i++) {
        cardPositions.push({
          x: startX + i * (cardW + gap),
          y: startY,
          w: cardW, h: cardH
        });
      }
      // Row 2: leptons (6)
      for (let i = 0; i < 6; i++) {
        cardPositions.push({
          x: startX + i * (cardW + gap),
          y: startY + cardH + gap,
          w: cardW, h: cardH
        });
      }
      // Row 3: bosons (5)
      for (let i = 0; i < 5; i++) {
        cardPositions.push({
          x: startX + i * (cardW + gap),
          y: startY + (cardH + gap) * 2,
          w: cardW, h: cardH
        });
      }
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER);
      p.text('The Standard Model of Particle Physics', width / 2, 30);

      // Row labels
      p.textSize(10);
      p.textAlign(p.LEFT);
      p.fill(255, 0, 110, 150);
      const rowY1 = cardPositions[0] ? cardPositions[0].y + cardPositions[0].h / 2 : 80;
      p.text('Quarks', 5, rowY1);
      p.fill(0, 180, 216, 150);
      const rowY2 = cardPositions[6] ? cardPositions[6].y + cardPositions[6].h / 2 : 160;
      p.text('Leptons', 5, rowY2);
      p.fill(139, 92, 246, 150);
      const rowY3 = cardPositions[12] ? cardPositions[12].y + cardPositions[12].h / 2 : 240;
      p.text('Bosons', 5, rowY3);

      // Generation labels
      if (cardPositions.length > 0) {
        p.textSize(9);
        p.textAlign(p.CENTER);
        p.fill(255, 255, 255, 60);
        const cw = cardPositions[0].w + 6;
        p.text('Gen I', cardPositions[0].x + cw / 2, cardPositions[0].y - 5);
        p.text('Gen II', cardPositions[2].x + cw / 2, cardPositions[0].y - 5);
        p.text('Gen III', cardPositions[4].x + cw / 2, cardPositions[0].y - 5);
      }

      // Check hover
      hoverIdx = -1;
      for (let i = 0; i < cardPositions.length; i++) {
        const pos = cardPositions[i];
        if (p.mouseX >= pos.x && p.mouseX <= pos.x + pos.w &&
            p.mouseY >= pos.y && p.mouseY <= pos.y + pos.h) {
          hoverIdx = i;
          break;
        }
      }

      // Draw particle cards
      for (let i = 0; i < particleData.length && i < cardPositions.length; i++) {
        const part = particleData[i];
        const pos = cardPositions[i];
        const col = typeColors[part.type] || [200, 200, 200];
        const isSelected = i === selectedIdx;
        const isHovered = i === hoverIdx;

        // Card background
        if (isSelected || isHovered) {
          p.drawingContext.shadowBlur = 12;
          p.drawingContext.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`;
        }
        p.fill(col[0], col[1], col[2], isSelected ? 40 : isHovered ? 25 : 12);
        p.stroke(col[0], col[1], col[2], isSelected ? 200 : isHovered ? 120 : 50);
        p.strokeWeight(isSelected ? 2 : 1);
        p.rect(pos.x, pos.y, pos.w, pos.h, 6);
        p.drawingContext.shadowBlur = 0;

        // Symbol
        p.fill(col[0], col[1], col[2]);
        p.noStroke();
        p.textSize(Math.min(pos.w * 0.35, 22));
        p.textAlign(p.CENTER);
        p.textStyle(p.BOLD);
        p.text(part.symbol, pos.x + pos.w / 2, pos.y + pos.h * 0.45);
        p.textStyle(p.NORMAL);

        // Name
        p.fill(255, 255, 255, 150);
        p.textSize(Math.max(9, Math.min(pos.w * 0.16, 11)));
        p.text(part.name, pos.x + pos.w / 2, pos.y + pos.h * 0.7);

        // Mass
        p.fill(255, 255, 255, 80);
        p.textSize(Math.max(9, Math.min(pos.w * 0.14, 10)));
        p.text(part.mass, pos.x + pos.w / 2, pos.y + pos.h * 0.88);
      }

      // Detail panel for selected particle
      if (selectedIdx >= 0 && selectedIdx < particleData.length) {
        const part = particleData[selectedIdx];
        const col = typeColors[part.type] || [200, 200, 200];
        const panelY = cardPositions.length > 12
          ? cardPositions[12].y + cardPositions[12].h + 20
          : 300;
        const panelH = height - panelY - 15;

        // Panel background
        p.fill(col[0], col[1], col[2], 10);
        p.stroke(col[0], col[1], col[2], 40);
        p.strokeWeight(1);
        p.rect(20, panelY, width - 40, panelH, 10);

        // Symbol large
        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`;
        p.fill(col[0], col[1], col[2]);
        p.noStroke();
        p.textSize(48);
        p.textAlign(p.LEFT);
        p.textStyle(p.BOLD);
        p.text(part.symbol, 40, panelY + 55);
        p.textStyle(p.NORMAL);
        p.drawingContext.shadowBlur = 0;

        // Name and type
        p.fill(255);
        p.textSize(20);
        p.text(part.name, 120, panelY + 35);
        p.fill(col[0], col[1], col[2], 180);
        p.textSize(12);
        p.text(part.type.charAt(0).toUpperCase() + part.type.slice(1), 120, panelY + 60);

        // Properties
        const propsX = 40;
        const propsY = panelY + 80;
        p.fill(255, 255, 255, 180);
        p.textSize(13);
        const props = [
          `Mass: ${part.mass}`,
          `Charge: ${part.charge}`,
          `Spin: ${part.spin}`,
        ];
        if (part.force) props.push(`Force: ${part.force}`);
        if (part.gen) props.push(`Generation: ${part.gen}`);

        for (let i = 0; i < props.length; i++) {
          const col2 = i % 2 === 0 ? 200 : 150;
          p.fill(255, 255, 255, col2);
          p.text(props[i], propsX + Math.floor(i / 3) * 220, propsY + (i % 3) * 22);
        }
      } else {
        // Hint text
        const hintY = cardPositions.length > 12
          ? cardPositions[12].y + cardPositions[12].h + 40
          : 320;
        p.fill(255, 255, 255, 80);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text('Click on any particle to see its properties', width / 2, hintY);
      }
    };

    p.mouseClicked = () => {
      if (hoverIdx >= 0) {
        selectedIdx = selectedIdx === hoverIdx ? -1 : hoverIdx;
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      calculatePositions();
    };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
