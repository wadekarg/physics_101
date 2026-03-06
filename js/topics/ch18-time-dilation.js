// Chapter 18: Time Dilation — Light Clock Visualization
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'time-dilation';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const CYAN = [0, 245, 212];
  const CYAN_HEX = '#00f5d4';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const v = engine.getParam('velocity'); // fraction of c

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const gamma = 1 / Math.sqrt(1 - v * v);

      // Layout: two clocks side by side
      const restClockX = width * 0.25;
      const movingClockX = width * 0.7;
      const clockTopY = 80;
      const clockBottomY = 320;
      const mirrorH = clockBottomY - clockTopY;
      const mirrorW = 60;

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Time Dilation: Light Clock', width / 2, 8);

      // === REST FRAME CLOCK (left) ===
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Rest Frame', restClockX, 38);

      // Mirrors
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 180);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = CYAN_HEX;
      p.drawingContext.shadowBlur = 8;
      p.line(restClockX - mirrorW / 2, clockTopY, restClockX + mirrorW / 2, clockTopY);
      p.line(restClockX - mirrorW / 2, clockBottomY, restClockX + mirrorW / 2, clockBottomY);
      p.drawingContext.shadowBlur = 0;

      // Light photon bouncing straight up and down
      const restPeriod = 2; // seconds for one bounce cycle
      const restPhase = (time % restPeriod) / restPeriod; // 0 to 1
      let restPhotonY;
      if (restPhase < 0.5) {
        restPhotonY = clockTopY + (restPhase * 2) * mirrorH;
      } else {
        restPhotonY = clockBottomY - ((restPhase - 0.5) * 2) * mirrorH;
      }

      // Light trail (rest)
      p.stroke(255, 220, 50, 60);
      p.strokeWeight(1);
      if (restPhase < 0.5) {
        p.line(restClockX, clockTopY, restClockX, restPhotonY);
      } else {
        p.line(restClockX, clockTopY, restClockX, clockBottomY);
        p.line(restClockX, clockBottomY, restClockX, restPhotonY);
      }

      // Photon
      p.noStroke();
      p.fill(255, 220, 50);
      p.drawingContext.shadowColor = '#ffdc32';
      p.drawingContext.shadowBlur = 20;
      p.ellipse(restClockX, restPhotonY, 12, 12);
      p.drawingContext.shadowBlur = 0;

      // Distance label
      p.fill(255, 255, 255, 100);
      p.textSize(11);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('L', restClockX - mirrorW / 2 - 10, (clockTopY + clockBottomY) / 2);

      // Rest clock time
      const restTicks = Math.floor(time / restPeriod);
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(13);
      p.textAlign(p.CENTER, p.TOP);
      p.text('t\u2080 = ' + (time).toFixed(2) + ' s', restClockX, clockBottomY + 15);
      p.text('Ticks: ' + restTicks, restClockX, clockBottomY + 33);

      // === MOVING FRAME CLOCK (right) ===
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Moving Frame (v = ' + v.toFixed(2) + 'c)', movingClockX, 38);

      // Moving clock runs slower by factor gamma
      const movingPeriod = restPeriod * gamma;
      const movingPhase = (time % movingPeriod) / movingPeriod;

      // Horizontal displacement due to velocity
      const totalHorizDisp = mirrorW * 1.5 * v;
      const horizOffset = movingPhase < 0.5
        ? -totalHorizDisp / 2 + (movingPhase * 2) * totalHorizDisp
        : totalHorizDisp / 2 - ((movingPhase - 0.5) * 2) * totalHorizDisp;

      // Mirror positions (moving with the frame)
      const mvMirrorCenterX = movingClockX + horizOffset * 0.5;

      // Mirrors
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 180);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = CYAN_HEX;
      p.drawingContext.shadowBlur = 8;
      p.line(mvMirrorCenterX - mirrorW / 2, clockTopY, mvMirrorCenterX + mirrorW / 2, clockTopY);
      p.line(mvMirrorCenterX - mirrorW / 2, clockBottomY, mvMirrorCenterX + mirrorW / 2, clockBottomY);
      p.drawingContext.shadowBlur = 0;

      // Photon takes diagonal path
      let movingPhotonX, movingPhotonY;
      if (movingPhase < 0.5) {
        const frac = movingPhase * 2;
        movingPhotonX = mvMirrorCenterX - totalHorizDisp / 2 + frac * totalHorizDisp;
        movingPhotonY = clockTopY + frac * mirrorH;
      } else {
        const frac = (movingPhase - 0.5) * 2;
        movingPhotonX = mvMirrorCenterX + totalHorizDisp / 2 - frac * totalHorizDisp;
        movingPhotonY = clockBottomY - frac * mirrorH;
      }

      // Diagonal light trail
      p.stroke(255, 220, 50, 60);
      p.strokeWeight(1);
      if (movingPhase < 0.5) {
        p.line(mvMirrorCenterX - totalHorizDisp / 2, clockTopY, movingPhotonX, movingPhotonY);
      } else {
        p.line(mvMirrorCenterX - totalHorizDisp / 2, clockTopY,
               mvMirrorCenterX + totalHorizDisp / 2, clockBottomY);
        p.line(mvMirrorCenterX + totalHorizDisp / 2, clockBottomY, movingPhotonX, movingPhotonY);
      }

      // Photon
      p.noStroke();
      p.fill(255, 220, 50);
      p.drawingContext.shadowColor = '#ffdc32';
      p.drawingContext.shadowBlur = 20;
      p.ellipse(movingPhotonX, movingPhotonY, 12, 12);
      p.drawingContext.shadowBlur = 0;

      // Diagonal distance label
      if (v > 0.05) {
        p.fill(255, 255, 255, 80);
        p.textSize(10);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('L\' > L (longer path)', movingClockX + mirrorW / 2 + 15, (clockTopY + clockBottomY) / 2);
      }

      // Moving clock time (dilated)
      const dilatedTime = time / gamma;
      const movingTicks = Math.floor(time / movingPeriod);
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(13);
      p.textAlign(p.CENTER, p.TOP);
      p.text("t' = " + dilatedTime.toFixed(2) + ' s', movingClockX, clockBottomY + 15);
      p.text('Ticks: ' + movingTicks, movingClockX, clockBottomY + 33);

      // --- Velocity arrow ---
      if (v > 0.01) {
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = '#ff6464';
        p.drawingContext.shadowBlur = 6;
        const arrowStartX = movingClockX - 40;
        const arrowEndX = movingClockX + 40;
        const arrowY = clockTopY - 15;
        p.line(arrowStartX, arrowY, arrowEndX, arrowY);
        p.line(arrowEndX, arrowY, arrowEndX - 8, arrowY - 5);
        p.line(arrowEndX, arrowY, arrowEndX - 8, arrowY + 5);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(255, 100, 100);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('v = ' + v.toFixed(2) + 'c', movingClockX, arrowY - 4);
      }

      // --- Gamma info panel ---
      const panelW = 340;
      const panelX = width / 2 - panelW / 2;
      const panelY = clockBottomY + 55;
      const panelH = 55;
      p.fill(15, 15, 35, 220);
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 60);
      p.strokeWeight(1);
      p.rect(panelX, panelY, panelW, panelH, 8);
      p.noStroke();

      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text('\u03B3 = 1/\u221A(1 - v\u00B2/c\u00B2) = ' + gamma.toFixed(4), panelX + panelW / 2, panelY + 8);
      p.fill(200, 200, 220);
      p.textSize(12);
      p.text("\u0394t = \u03B3 \u00B7 \u0394t\u2080  |  Moving clock runs " +
        (gamma > 1.001 ? (gamma).toFixed(2) + '\u00D7 slower' : 'at same rate'),
        panelX + panelW / 2, panelY + 30);

      // --- Divider ---
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(width / 2, 60, width / 2, clockBottomY + 10);
      p.drawingContext.setLineDash([]);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.noStroke();
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Increase velocity to see the moving clock slow down (time dilation)', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { velocity: 0.5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'velocity', label: 'Velocity', min: 0, max: 0.99, step: 0.01, value: 0.5, unit: 'c' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
