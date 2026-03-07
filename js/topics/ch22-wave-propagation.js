// ch22-wave-propagation.js — Propagation of EM Waves
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'wave-propagation';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let W, H;
    let time = 0;
    let signalPackets = [];

    function resetPackets() {
      signalPackets = [];
      for (let i = 0; i < 5; i++) {
        signalPackets.push({ t: i / 5, active: true });
      }
    }

    p.setup = () => {
      W = Math.min(p.windowWidth - 40, 800);
      H = 450;
      p.createCanvas(W, H);
      p.textFont('monospace');
      resetPackets();
    };

    engine.onReset(() => { time = 0; resetPackets(); });

    p.draw = () => {
      p.background(10, 10, 26);
      if (engine.isPlaying) { time += (1 / 60) * engine.speed; }

      const mode = Math.round(engine.getParam('propagationMode'));
      const antHeight = engine.getParam('antennaHeight');

      // Earth curve
      const earthCY = H + 220; // center of earth circle below canvas
      const earthR = 270;
      const ionoR = earthR + 80;

      // Draw ionosphere (sky wave mode emphasis)
      const ionoAlpha = mode === 1 ? 200 : 60;
      p.noFill();
      p.stroke(0, 245, 212, ionoAlpha);
      p.strokeWeight(mode === 1 ? 3 : 1.5);
      p.drawingContext.shadowBlur = mode === 1 ? 15 : 4;
      p.drawingContext.shadowColor = 'rgba(0,245,212,0.5)';
      p.arc(W / 2, earthCY, ionoR * 2, ionoR * 2, p.PI + 0.3, p.TWO_PI - 0.3);
      p.drawingContext.shadowBlur = 0;
      if (mode === 1) {
        p.noStroke(); p.fill(0, 245, 212, 60); p.textSize(10); p.textAlign(p.CENTER);
        p.text('Ionosphere', W / 2, earthCY - ionoR - 4);
      }

      // Draw troposphere band
      p.noFill();
      p.stroke(100, 180, 255, 40); p.strokeWeight(1);
      p.arc(W / 2, earthCY, (earthR + 30) * 2, (earthR + 30) * 2, p.PI + 0.3, p.TWO_PI - 0.3);
      p.noStroke(); p.fill(100, 180, 255, 25); p.textSize(9); p.textAlign(p.CENTER);
      p.text('Troposphere', W / 2, earthCY - earthR - 25);

      // Draw Earth surface arc
      p.noFill();
      p.stroke(80, 120, 60); p.strokeWeight(3);
      p.drawingContext.shadowBlur = 6; p.drawingContext.shadowColor = 'rgba(80,160,80,0.4)';
      p.arc(W / 2, earthCY, earthR * 2, earthR * 2, p.PI + 0.3, p.TWO_PI - 0.3);
      p.drawingContext.shadowBlur = 0;

      // Earth fill below arc
      p.fill(20, 40, 20, 150); p.noStroke();
      p.beginShape();
      for (let a = p.PI + 0.3; a <= p.TWO_PI - 0.3; a += 0.05) {
        p.vertex(W / 2 + earthR * Math.cos(a), earthCY + earthR * Math.sin(a));
      }
      p.vertex(W / 2 + earthR * Math.cos(p.TWO_PI - 0.3), H + 20);
      p.vertex(W / 2 + earthR * Math.cos(p.PI + 0.3), H + 20);
      p.endShape(p.CLOSE);

      // Transmitter tower (left side)
      const txAngle = p.PI + 0.55;
      const txBase = { x: W / 2 + earthR * Math.cos(txAngle), y: earthCY + earthR * Math.sin(txAngle) };
      const towerH = Math.min(60, 10 + antHeight / 10);
      const txTop = { x: txBase.x - towerH * Math.sin(txAngle - p.PI), y: txBase.y + towerH * Math.cos(txAngle - p.PI) };

      p.stroke(200, 200, 100); p.strokeWeight(2);
      p.line(txBase.x, txBase.y, txTop.x, txTop.y);
      p.noStroke(); p.fill(255, 200, 50);
      p.drawingContext.shadowBlur = 8; p.drawingContext.shadowColor = 'rgba(255,200,50,0.7)';
      p.circle(txTop.x, txTop.y, 6);
      p.drawingContext.shadowBlur = 0;
      p.fill(200, 200, 160); p.textSize(9); p.textAlign(p.CENTER);
      p.text('TX', txTop.x, txTop.y - 10);

      // Receiver (right side)
      const rxAngle = p.TWO_PI - 0.55;
      const rxBase = { x: W / 2 + earthR * Math.cos(rxAngle), y: earthCY + earthR * Math.sin(rxAngle) };
      const rxTop = { x: rxBase.x - 20 * Math.sin(rxAngle - p.PI), y: rxBase.y + 20 * Math.cos(rxAngle - p.PI) };
      p.stroke(100, 200, 255); p.strokeWeight(2);
      p.line(rxBase.x, rxBase.y, rxTop.x, rxTop.y);
      p.noStroke(); p.fill(100, 200, 255);
      p.circle(rxTop.x, rxTop.y, 6);
      p.fill(160, 200, 220); p.textSize(9); p.textAlign(p.CENTER);
      p.text('RX', rxTop.x, rxTop.y - 10);

      // Animate signal packets based on mode
      if (engine.isPlaying) {
        signalPackets.forEach(pk => { pk.t = (pk.t + 0.004 * engine.speed) % 1; });
      }

      const packetColor = mode === 0 ? [255, 200, 50] : mode === 1 ? [0, 245, 212] : [139, 92, 246];

      signalPackets.forEach(pk => {
        let px, py;
        const t = pk.t;

        if (mode === 0) {
          // Ground wave: follows Earth surface
          const a = p.lerp(txAngle, rxAngle, t);
          px = W / 2 + (earthR + 6) * Math.cos(a);
          py = earthCY + (earthR + 6) * Math.sin(a);
        } else if (mode === 1) {
          // Sky wave: tx -> ionosphere -> rx
          if (t < 0.5) {
            const s = t * 2;
            px = p.lerp(txTop.x, W / 2, s);
            py = p.lerp(txTop.y, earthCY - ionoR, s);
          } else {
            const s = (t - 0.5) * 2;
            px = p.lerp(W / 2, rxTop.x, s);
            py = p.lerp(earthCY - ionoR, rxTop.y, s);
          }
        } else {
          // Space wave: straight line TX -> RX
          px = p.lerp(txTop.x, rxTop.x, t);
          py = p.lerp(txTop.y, rxTop.y, t);
        }

        p.noStroke(); p.fill(packetColor[0], packetColor[1], packetColor[2]);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = `rgba(${packetColor[0]},${packetColor[1]},${packetColor[2]},0.8)`;
        p.circle(px, py, 8);
        p.drawingContext.shadowBlur = 0;
      });

      // Info panel
      const modeNames = ['Ground Wave', 'Sky Wave (Ionospheric)', 'Space Wave (Line-of-Sight)'];
      const modeFreq = ['< 2 MHz (AM broadcast)', '3\u201330 MHz (HF shortwave)', 'VHF/UHF/Microwave (TV, FM, satellite)'];
      const d_km = Math.sqrt(2 * 6400000 * antHeight) / 1000;

      p.noStroke(); p.fill(160, 160, 200); p.textSize(11); p.textAlign(p.LEFT);
      p.text(`Mode: ${modeNames[mode]}`, 10, 26);
      p.text(`Freq range: ${modeFreq[mode]}`, 10, 42);
      if (mode === 2) p.text(`Max range: d = \u221a(2Rh) = ${d_km.toFixed(1)} km  (h = ${antHeight} m)`, 10, 58);
      if (mode === 1) p.text('Reflects off ionosphere \u2192 global reach', 10, 58);
      if (mode === 0) p.text('Follows Earth curvature (long wavelength diffraction)', 10, 58);
    };

    p.windowResized = () => {
      W = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(W, H);
    };
  }, { propagationMode: 0, antennaHeight: 100 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'propagationMode', label: 'Propagation Mode', type: 'radio', value: 0,
      options: [{ value: 0, label: 'Ground Wave' }, { value: 1, label: 'Sky Wave' }, { value: 2, label: 'Space Wave' }] },
    { name: 'antennaHeight', label: 'Antenna Height', min: 10, max: 500, step: 10, value: 100, unit: 'm' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
