// Chapter 10: Buoyancy — Archimedes' Principle Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'buoyancy';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let objectY = 0;
    let objectVy = 0;
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
      objectY = 100;
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const objDensity = engine.getParam('objectDensity');
      const fluidDensity = engine.getParam('fluidDensity');
      const objSize = engine.getParam('objectSize');
      const g = 9.81;

      // Fluid surface
      const surfaceY = 120;
      const fluidBottom = height - 40;
      const containerLeft = width * 0.15;
      const containerRight = width * 0.55;
      const containerWidth = containerRight - containerLeft;
      const objX = (containerLeft + containerRight) / 2;

      // Physics
      const objVolume = Math.pow(objSize / 40, 3); // normalized volume in m³
      const objMass = objDensity * objVolume;
      const weight = objMass * g;

      // Calculate equilibrium position
      const densityRatio = objDensity / fluidDensity;
      let eqSubmergedFraction = Math.min(1, densityRatio);
      // Equilibrium y: object center when submerged fraction is right
      let eqY;
      if (densityRatio <= 1) {
        // Floats: top of object at surface - (1 - submergedFraction) * objSize
        eqY = surfaceY + eqSubmergedFraction * objSize / 2;
      } else {
        // Sinks to bottom
        eqY = fluidBottom - objSize / 2 - 5;
      }

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Calculate submerged volume based on current position
        const objTop = objectY - objSize / 2;
        const objBot = objectY + objSize / 2;
        let submergedDepth = 0;
        if (objBot > surfaceY) {
          submergedDepth = Math.min(objSize, objBot - Math.max(surfaceY, objTop));
        }
        const submergedFraction = submergedDepth / objSize;
        const displacedVolume = objVolume * submergedFraction;

        // Forces
        const buoyantForce = fluidDensity * g * displacedVolume;
        const netForce = weight - buoyantForce;
        const dragCoeff = 0.5; // fluid drag
        const drag = -dragCoeff * objectVy * Math.abs(objectVy);

        const accel = (netForce + drag) / objMass;
        objectVy += accel * dt;
        objectY += objectVy * 20 * dt; // scale for visibility

        // Clamp
        if (objectY + objSize / 2 > fluidBottom - 5) {
          objectY = fluidBottom - objSize / 2 - 5;
          objectVy *= -0.3;
        }
        if (objectY - objSize / 2 < 40) {
          objectY = 40 + objSize / 2;
          objectVy *= -0.3;
        }
      }

      // Calculate current submerged fraction for display
      const objTop = objectY - objSize / 2;
      const objBot = objectY + objSize / 2;
      let submergedDepth = 0;
      if (objBot > surfaceY) {
        submergedDepth = Math.min(objSize, objBot - Math.max(surfaceY, objTop));
      }
      const submergedFraction = submergedDepth / objSize;
      const displacedVolume = objVolume * submergedFraction;
      const buoyantForce = fluidDensity * g * displacedVolume;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Buoyancy: Archimedes\' Principle', width / 2, 8);

      // Draw container
      p.stroke(100, 120, 150);
      p.strokeWeight(3);
      p.noFill();
      p.line(containerLeft, surfaceY - 30, containerLeft, fluidBottom);
      p.line(containerLeft, fluidBottom, containerRight, fluidBottom);
      p.line(containerRight, fluidBottom, containerRight, surfaceY - 30);

      // Draw fluid
      p.noStroke();
      // Fluid gradient
      for (let y = surfaceY; y < fluidBottom; y += 2) {
        const t = (y - surfaceY) / (fluidBottom - surfaceY);
        const alpha = 80 + t * 60;
        // Color based on density
        const densityNorm = (fluidDensity - 500) / 1500;
        p.fill(20 + densityNorm * 30, 100 + densityNorm * 50, 200 - densityNorm * 50, alpha);
        p.rect(containerLeft + 2, y, containerWidth - 4, 2);
      }

      // Water surface with wave effect
      p.stroke(0, 200, 255, 150);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00c8ff';
      p.noFill();
      p.beginShape();
      for (let x = containerLeft + 2; x < containerRight - 2; x += 3) {
        const waveY = surfaceY + Math.sin(x * 0.05 + time * 3) * 2;
        p.vertex(x, waveY);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Surface label
      p.noStroke();
      p.fill(0, 200, 255, 150);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('Surface', containerLeft - 5, surfaceY);

      // Draw object
      const objColor = densityRatio <= 0.5 ? [80, 255, 180] :
                        densityRatio <= 1 ? [255, 200, 80] :
                        [255, 80, 80];
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = `rgb(${objColor[0]},${objColor[1]},${objColor[2]})`;
      p.fill(objColor[0], objColor[1], objColor[2]);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(objX, objectY, objSize, objSize, 6);
      p.rectMode(p.CORNER);
      p.drawingContext.shadowBlur = 0;

      // Density label on object
      p.fill(0, 0, 0, 180);
      p.textSize(Math.min(10, objSize / 5));
      p.textAlign(p.CENTER, p.CENTER);
      p.text(objDensity + '\nkg/m\u00B3', objX, objectY);

      // Force arrows
      // Weight (down)
      const weightScale = Math.min(60, weight * 0.3);
      p.stroke(255, 80, 80);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ff5050';
      p.line(objX + objSize / 2 + 15, objectY, objX + objSize / 2 + 15, objectY + weightScale);
      p.line(objX + objSize / 2 + 15, objectY + weightScale, objX + objSize / 2 + 10, objectY + weightScale - 7);
      p.line(objX + objSize / 2 + 15, objectY + weightScale, objX + objSize / 2 + 20, objectY + weightScale - 7);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 80, 80);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('W=' + weight.toFixed(1) + 'N', objX + objSize / 2 + 22, objectY + weightScale / 2);

      // Buoyant force (up)
      if (buoyantForce > 0.01) {
        const buoyScale = Math.min(60, buoyantForce * 0.3);
        p.stroke(0, 255, 200);
        p.strokeWeight(2.5);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#00ffc8';
        p.line(objX - objSize / 2 - 15, objectY, objX - objSize / 2 - 15, objectY - buoyScale);
        p.line(objX - objSize / 2 - 15, objectY - buoyScale, objX - objSize / 2 - 20, objectY - buoyScale + 7);
        p.line(objX - objSize / 2 - 15, objectY - buoyScale, objX - objSize / 2 - 10, objectY - buoyScale + 7);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(0, 255, 200);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('F_b=' + buoyantForce.toFixed(1) + 'N', objX - objSize / 2 - 22, objectY - buoyScale / 2);
      }

      // Status indicator
      let statusText, statusColor;
      if (densityRatio < 0.98) {
        statusText = 'FLOATING';
        statusColor = [80, 255, 180];
      } else if (densityRatio <= 1.02) {
        statusText = 'NEUTRAL BUOYANCY';
        statusColor = [255, 200, 80];
      } else {
        statusText = 'SINKING';
        statusColor = [255, 80, 80];
      }
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = `rgb(${statusColor[0]},${statusColor[1]},${statusColor[2]})`;
      p.fill(statusColor[0], statusColor[1], statusColor[2]);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text(statusText, (containerLeft + containerRight) / 2, 32);
      p.drawingContext.shadowBlur = 0;

      // Info panel
      const infoX = width * 0.6;
      const infoY = 50;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, width * 0.36, 170, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Archimedes\' Principle:', infoX + 10, infoY + 8);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('F_b = \u03C1_fluid \u00D7 g \u00D7 V_disp', infoX + 10, infoY + 28);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('\u03C1_object = ' + objDensity + ' kg/m\u00B3', infoX + 10, infoY + 50);
      p.text('\u03C1_fluid  = ' + fluidDensity + ' kg/m\u00B3', infoX + 10, infoY + 66);
      p.text('Ratio: \u03C1_obj/\u03C1_fluid = ' + densityRatio.toFixed(2), infoX + 10, infoY + 82);
      p.text('', infoX + 10, infoY + 98);
      p.text('Weight (W) = ' + weight.toFixed(2) + ' N', infoX + 10, infoY + 98);
      p.text('Buoyancy (F_b) = ' + buoyantForce.toFixed(2) + ' N', infoX + 10, infoY + 114);
      p.text('Submerged: ' + (submergedFraction * 100).toFixed(0) + '%', infoX + 10, infoY + 130);

      p.fill(densityRatio <= 1 ? '#00ff88' : '#ff5050');
      p.textSize(11);
      p.text(densityRatio <= 1 ? 'Object floats (\u03C1_obj \u2264 \u03C1_fluid)' : 'Object sinks (\u03C1_obj > \u03C1_fluid)', infoX + 10, infoY + 150);

      // Fluid density legend
      const legX = width * 0.6;
      const legY = infoY + 180;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(legX, legY, width * 0.36, 60, 8);

      p.noStroke();
      p.fill(200, 200, 220);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Common fluids:', legX + 10, legY + 6);
      p.text('Water: 1000 kg/m\u00B3', legX + 10, legY + 20);
      p.text('Oil: ~800 kg/m\u00B3', legX + 10, legY + 34);
      p.text('Mercury: ~13600 kg/m\u00B3', legX + 10, legY + 48);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Click to reset. Adjust densities to see floating, sinking, or neutral buoyancy', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      objectY = 80;
      objectVy = 0;
      time = 0;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { objectDensity: 500, fluidDensity: 1000, objectSize: 50 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'objectDensity', label: 'Object Density', min: 100, max: 5000, step: 100, value: 500, unit: 'kg/m\u00B3' },
    { name: 'fluidDensity', label: 'Fluid Density', min: 500, max: 2000, step: 50, value: 1000, unit: 'kg/m\u00B3' },
    { name: 'objectSize', label: 'Object Size', min: 20, max: 80, step: 5, value: 50, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
