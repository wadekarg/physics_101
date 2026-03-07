// sim-controls.js — Auto-generates simulation control UI from parameter config
// for Physics 101.

/**
 * Render simulation controls (play/pause, reset, speed, parameter sliders)
 * inside the given container.
 *
 * @param {HTMLElement} containerEl — element to render controls into
 * @param {import('./sim-engine.js').SimEngine} engine — SimEngine instance
 * @param {Array} paramConfig — array of parameter descriptors:
 *   [{ name, label, min, max, step, value, unit }, ...]
 */
export function renderSimControls(containerEl, engine, paramConfig) {
  if (!containerEl || !engine) return;

  containerEl.innerHTML = '';
  containerEl.classList.add('sim-controls');

  // ── Toolbar: play/pause, reset, speed ──────────────────────────

  const toolbar = document.createElement('div');
  toolbar.className = 'sim-toolbar';

  // Play / Pause button
  const playBtn = document.createElement('button');
  playBtn.className = 'sim-btn sim-btn-play';
  playBtn.title = 'Play / Pause';
  updatePlayButton(playBtn, engine.isPlaying);

  playBtn.addEventListener('click', () => {
    if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
    updatePlayButton(playBtn, engine.isPlaying);
  });
  toolbar.appendChild(playBtn);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'sim-btn sim-btn-reset';
  resetBtn.title = 'Reset simulation';
  resetBtn.innerHTML = '\u21BA <span class="btn-label">Reset</span>';
  resetBtn.addEventListener('click', () => {
    engine.reset();
    updatePlayButton(playBtn, engine.isPlaying);
    // Reset sliders to initial values
    resetSliders(containerEl, engine, paramConfig);
  });
  toolbar.appendChild(resetBtn);

  // Speed selector
  const speedGroup = document.createElement('div');
  speedGroup.className = 'sim-speed-group';

  const speedLabel = document.createElement('span');
  speedLabel.className = 'sim-speed-label';
  speedLabel.textContent = 'Speed:';
  speedGroup.appendChild(speedLabel);

  const speeds = [0.5, 1, 2, 4];
  speeds.forEach((spd) => {
    const btn = document.createElement('button');
    btn.className = 'sim-btn sim-btn-speed';
    if (engine.speed === spd) btn.classList.add('active');
    btn.textContent = spd + 'x';
    btn.dataset.speed = spd;

    btn.addEventListener('click', () => {
      engine.setSpeed(spd);
      // Update active state on all speed buttons
      speedGroup.querySelectorAll('.sim-btn-speed').forEach((b) => {
        b.classList.toggle('active', parseFloat(b.dataset.speed) === spd);
      });
    });

    speedGroup.appendChild(btn);
  });

  toolbar.appendChild(speedGroup);
  containerEl.appendChild(toolbar);

  // ── Parameter sliders ─────────────────────────────────────────

  if (paramConfig && paramConfig.length > 0) {
    const slidersEl = document.createElement('div');
    slidersEl.className = 'sim-params';

    paramConfig.forEach((cfg) => {
      const row = cfg.type === 'radio' ? createRadioRow(cfg, engine) : createSliderRow(cfg, engine);
      slidersEl.appendChild(row);
    });

    containerEl.appendChild(slidersEl);
  }

  // ── Listen for engine state changes (e.g. from external calls) ─

  document.addEventListener('qp:sim-state', () => {
    updatePlayButton(playBtn, engine.isPlaying);
    // Update speed buttons
    speedGroup.querySelectorAll('.sim-btn-speed').forEach((b) => {
      b.classList.toggle('active', parseFloat(b.dataset.speed) === engine.speed);
    });
  });

  // On reset, re-sync the play button
  engine.onReset(() => {
    updatePlayButton(playBtn, engine.isPlaying);
  });
}

// ── internal helpers ────────────────────────────────────────────────

function createSliderRow(cfg, engine) {
  const row = document.createElement('div');
  row.className = 'sim-param-row';
  row.dataset.param = cfg.name;

  const label = document.createElement('label');
  label.className = 'sim-param-label';
  label.textContent = cfg.label || cfg.name;
  label.htmlFor = `sim-param-${cfg.name}`;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'sim-param-slider';
  slider.id = `sim-param-${cfg.name}`;
  slider.min = cfg.min !== undefined ? cfg.min : 0;
  slider.max = cfg.max !== undefined ? cfg.max : 100;
  slider.step = cfg.step !== undefined ? cfg.step : 1;
  slider.value = cfg.value !== undefined ? cfg.value : engine.getParam(cfg.name) || 0;

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'sim-param-value';
  valueDisplay.textContent = formatValue(slider.value, cfg.unit);

  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    engine.setParam(cfg.name, val);
    valueDisplay.textContent = formatValue(val, cfg.unit);
  });

  row.appendChild(label);
  row.appendChild(slider);
  row.appendChild(valueDisplay);

  return row;
}

function createRadioRow(cfg, engine) {
  const row = document.createElement('div');
  row.className = 'sim-param-row sim-param-row--radio';
  row.dataset.param = cfg.name;

  const label = document.createElement('label');
  label.className = 'sim-param-label';
  label.textContent = cfg.label || cfg.name;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'sim-radio-group';

  const currentVal = cfg.value !== undefined ? cfg.value : (engine.getParam(cfg.name) || 0);
  cfg.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'sim-radio-btn';
    btn.textContent = opt.label;
    btn.dataset.value = opt.value;
    if (opt.value === currentVal) btn.classList.add('active');

    btn.addEventListener('click', () => {
      engine.setParam(cfg.name, opt.value);
      btnGroup.querySelectorAll('.sim-radio-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
    });

    btnGroup.appendChild(btn);
  });

  row.appendChild(label);
  row.appendChild(btnGroup);
  return row;
}

function resetSliders(containerEl, engine, paramConfig) {
  if (!paramConfig) return;
  paramConfig.forEach((cfg) => {
    if (cfg.type === 'radio') {
      const initial = cfg.value !== undefined ? cfg.value : 0;
      engine.setParam(cfg.name, initial);
      const row = containerEl.querySelector(`[data-param="${cfg.name}"]`);
      if (row) {
        row.querySelectorAll('.sim-radio-btn').forEach((b) => {
          b.classList.toggle('active', parseFloat(b.dataset.value) === initial);
        });
      }
    } else {
      const slider = containerEl.querySelector(`#sim-param-${cfg.name}`);
      if (slider) {
        const initial = cfg.value !== undefined ? cfg.value : 0;
        slider.value = initial;
        engine.setParam(cfg.name, initial);
        const valueDisplay = slider.parentElement.querySelector('.sim-param-value');
        if (valueDisplay) {
          valueDisplay.textContent = formatValue(initial, cfg.unit);
        }
      }
    }
  });
}

function updatePlayButton(btn, isPlaying) {
  if (isPlaying) {
    btn.innerHTML = '\u23F8 <span class="btn-label">Pause</span>';
    btn.classList.add('playing');
    btn.classList.remove('paused');
  } else {
    btn.innerHTML = '\u25B6 <span class="btn-label">Play</span>';
    btn.classList.remove('playing');
    btn.classList.add('paused');
  }
}

function formatValue(val, unit) {
  const num = parseFloat(val);
  // Show a sensible number of decimal places
  const display = Number.isInteger(num) ? num.toString() : num.toFixed(2);
  return unit ? `${display} ${unit}` : display;
}
