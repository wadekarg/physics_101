// The EM Spectrum — Interactive spectrum explorer
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'em-spectrum';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const bands = [
    { name: 'Radio', freqMin: 3e3, freqMax: 3e9, wlMin: 0.1, wlMax: 1e5, color: [255, 80, 80], app: 'FM/AM Radio, TV' },
    { name: 'Microwave', freqMin: 3e9, freqMax: 3e11, wlMin: 1e-3, wlMax: 0.1, color: [255, 150, 50], app: 'WiFi, Cooking, Radar' },
    { name: 'Infrared', freqMin: 3e11, freqMax: 4.3e14, wlMin: 7e-7, wlMax: 1e-3, color: [255, 50, 50], app: 'Heat, Remote Controls, Night Vision' },
    { name: 'Visible', freqMin: 4.3e14, freqMax: 7.5e14, wlMin: 4e-7, wlMax: 7e-7, color: [255, 255, 255], app: 'Human Vision, Photography' },
    { name: 'Ultraviolet', freqMin: 7.5e14, freqMax: 3e16, wlMin: 1e-8, wlMax: 4e-7, color: [150, 80, 255], app: 'Sterilization, Black Lights' },
    { name: 'X-ray', freqMin: 3e16, freqMax: 3e19, wlMin: 1e-11, wlMax: 1e-8, color: [80, 200, 255], app: 'Medical Imaging, Security' },
    { name: 'Gamma', freqMin: 3e19, freqMax: 3e24, wlMin: 1e-16, wlMax: 1e-11, color: [0, 255, 136], app: 'Cancer Treatment, Nuclear' }
  ];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let sliderX = 0.5; // 0 to 1, position on spectrum
    let isDragging = false;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('sans-serif');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const barY = 80, barH = 50;
      const barX = 50, barW = width - 100;

      // Draw spectrum bar
      for (let i = 0; i < barW; i++) {
        const t = i / barW;
        const bandIdx = Math.floor(t * bands.length);
        const band = bands[Math.min(bandIdx, bands.length - 1)];
        const localT = (t * bands.length) - bandIdx;

        // Visible light gets rainbow colors
        if (band.name === 'Visible') {
          const hue = 270 - localT * 270; // violet to red
          p.colorMode(p.HSB);
          p.stroke(hue, 90, 95);
          p.colorMode(p.RGB);
        } else {
          p.stroke(band.color[0], band.color[1], band.color[2], 180);
        }
        p.strokeWeight(1);
        p.line(barX + i, barY, barX + i, barY + barH);
      }

      // Band labels
      p.textSize(9);
      p.textAlign(p.CENTER);
      p.noStroke();
      for (let i = 0; i < bands.length; i++) {
        const x = barX + (i + 0.5) / bands.length * barW;
        p.fill(bands[i].color[0], bands[i].color[1], bands[i].color[2], 200);
        p.text(bands[i].name, x, barY - 8);
      }

      // Arrows
      p.fill(255, 255, 255, 100);
      p.textSize(10);
      p.textAlign(p.LEFT);
      p.text('← Lower Frequency / Longer λ', barX, barY + barH + 20);
      p.textAlign(p.RIGHT);
      p.text('Higher Frequency / Shorter λ →', barX + barW, barY + barH + 20);

      // Slider indicator
      const sliderPx = barX + sliderX * barW;
      p.stroke(255);
      p.strokeWeight(2);
      p.line(sliderPx, barY - 15, sliderPx, barY + barH + 5);
      p.fill(255);
      p.noStroke();
      p.triangle(sliderPx - 6, barY - 15, sliderPx + 6, barY - 15, sliderPx, barY - 5);

      // Calculate current values
      const logFreqMin = Math.log10(3e3);
      const logFreqMax = Math.log10(3e24);
      const logFreq = logFreqMin + sliderX * (logFreqMax - logFreqMin);
      const freq = Math.pow(10, logFreq);
      const wavelength = 3e8 / freq;
      const energy = 6.626e-34 * freq; // E = hf

      // Find current band
      let currentBand = bands[0];
      for (const b of bands) {
        if (freq >= b.freqMin && freq <= b.freqMax) { currentBand = b; break; }
      }

      // Info display
      const infoY = barY + barH + 60;

      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = `rgb(${currentBand.color[0]},${currentBand.color[1]},${currentBand.color[2]})`;
      p.fill(currentBand.color[0], currentBand.color[1], currentBand.color[2]);
      p.textSize(24);
      p.textAlign(p.CENTER);
      p.text(currentBand.name, width / 2, infoY);
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 255, 255, 200);
      p.textSize(14);
      p.text(`Frequency: ${formatSci(freq)} Hz`, width / 2, infoY + 35);
      p.text(`Wavelength: ${formatWavelength(wavelength)}`, width / 2, infoY + 60);
      p.text(`Photon Energy: ${formatSci(energy)} J`, width / 2, infoY + 85);

      p.fill(currentBand.color[0], currentBand.color[1], currentBand.color[2], 180);
      p.textSize(13);
      p.text(`Applications: ${currentBand.app}`, width / 2, infoY + 115);

      // Animated wave visualization
      const waveY = height - 70;
      const waveH = 30;
      const waveSpeed = Math.min(sliderX * 5 + 0.5, 5);
      const waveFreqVis = Math.min(sliderX * 20 + 2, 30);

      if (currentBand.name === 'Visible') {
        const hue = 270 - ((freq - 4.3e14) / (7.5e14 - 4.3e14)) * 270;
        p.colorMode(p.HSB);
        p.stroke(Math.max(0, Math.min(hue, 360)), 90, 95);
        p.colorMode(p.RGB);
      } else {
        p.stroke(currentBand.color[0], currentBand.color[1], currentBand.color[2]);
      }
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = `rgb(${currentBand.color[0]},${currentBand.color[1]},${currentBand.color[2]})`;
      p.noFill();
      p.beginShape();
      for (let x = 0; x < barW; x += 2) {
        const phase = (x / barW) * waveFreqVis * Math.PI * 2;
        const t = engine.isPlaying ? p.millis() * 0.003 * waveSpeed : 0;
        p.vertex(barX + x, waveY + Math.sin(phase - t) * waveH);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Drag hint
      if (!isDragging) {
        p.fill(255, 255, 255, 80);
        p.noStroke();
        p.textSize(11);
        p.textAlign(p.CENTER);
        p.text('↔ Drag the slider across the spectrum', width / 2, barY + barH + 35);
      }
    };

    function formatSci(num) {
      if (num === 0) return '0';
      const exp = Math.floor(Math.log10(Math.abs(num)));
      const mantissa = num / Math.pow(10, exp);
      return `${mantissa.toFixed(2)} × 10^${exp}`;
    }

    function formatWavelength(wl) {
      if (wl >= 1) return `${wl.toFixed(2)} m`;
      if (wl >= 1e-3) return `${(wl * 1e3).toFixed(2)} mm`;
      if (wl >= 1e-6) return `${(wl * 1e6).toFixed(2)} μm`;
      if (wl >= 1e-9) return `${(wl * 1e9).toFixed(2)} nm`;
      if (wl >= 1e-12) return `${(wl * 1e12).toFixed(2)} pm`;
      return formatSci(wl) + ' m';
    }

    p.mousePressed = () => {
      if (p.mouseY > 60 && p.mouseY < 150 && p.mouseX > 50 && p.mouseX < width - 50) {
        isDragging = true;
        sliderX = p.constrain((p.mouseX - 50) / (width - 100), 0, 1);
      }
    };
    p.mouseDragged = () => {
      if (isDragging) {
        sliderX = p.constrain((p.mouseX - 50) / (width - 100), 0, 1);
      }
    };
    p.mouseReleased = () => { isDragging = false; };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
