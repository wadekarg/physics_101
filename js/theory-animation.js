// theory-animation.js — Inline animated canvas explainers inside #theory
// Covers: motion-graphs, position-velocity, equations-of-motion, free-fall

const CW = 800, CH = 160; // fixed internal canvas resolution

const BG    = '#0a0a1a';
const CYAN  = '#00b4d8';
const GREEN = '#00ff88';
const PRP   = '#8b5cf6';
const ORG   = '#ffaa00';
const RED   = '#ff6464';
const MUT   = 'rgba(120,120,160,0.75)';
const GRID  = 'rgba(40,40,70,0.9)';

// ── Public entry point ────────────────────────────────────────────────────

export function renderTheoryAnimation(theoryEl, slug) {
  if (!theoryEl) return;
  const handlers = {
    'motion-graphs':       injectMotionGraphs,
    'position-velocity':   injectPositionVelocity,
    'equations-of-motion': injectEquationsOfMotion,
    'free-fall':           injectFreeFall,
  };
  if (handlers[slug]) handlers[slug](theoryEl);
}

// ── Shared animation factory ───────────────────────────────────────────────

function makeAnim(title, scenes, sdur, drawFn, noteFn) {
  const { el, canvas, noteEl, btn } = makeShell(title, scenes);
  let activeIdx = 0, sceneT = 0, lastTs = null, paused = false, rafId = null;

  el.querySelectorAll('.theory-anim__tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activeIdx = i; sceneT = 0; lastTs = null; noteEl.textContent = '';
      el.querySelectorAll('.theory-anim__tab').forEach((t, j) =>
        t.classList.toggle('theory-anim__tab--active', j === i));
    });
  });

  function tick(ts) {
    if (paused) return;
    if (lastTs !== null) sceneT += Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;
    const prg = (sceneT % sdur) / sdur;
    if (noteFn) { const n = noteFn(scenes[activeIdx], prg); if (n != null) noteEl.textContent = n; }
    try {
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawFn(ctx, scenes[activeIdx], prg);
    } catch (e) { console.error('[theory-anim]', e); }
    rafId = requestAnimationFrame(tick);
  }

  btn.addEventListener('click', () => {
    paused = !paused; btn.textContent = paused ? '▶' : '⏸';
    if (!paused) { lastTs = null; rafId = requestAnimationFrame(tick); }
    else cancelAnimationFrame(rafId);
  });

  return { el, start() { rafId = requestAnimationFrame(tick); } };
}

// ── motion-graphs injector ─────────────────────────────────────────────────

function injectMotionGraphs(theoryEl) {
  const paras = theoryEl.querySelectorAll('p');
  if (paras.length < 2) return;
  const anim1 = makeSlopeAnim();
  const anim2 = makeAreaAnim();
  paras[0].insertAdjacentElement('afterend', anim1.el);
  paras[1].insertAdjacentElement('afterend', anim2.el);
  anim1.start();
  anim2.start();
}

// ── Animation 1: Slope = Velocity ─────────────────────────────────────────

function makeSlopeAnim() {
  const SCENES = [
    { label: '🚗 Fast',        v: 30, col: CYAN,  note: 'Steep slope → high speed'  },
    { label: '🐢 Slow',        v: 10, col: ORG,   note: 'Gentle slope → low speed'  },
    { label: '🛑 Stationary',  v: 0,  col: RED,   note: 'Flat line → zero velocity' },
  ];
  const SDUR = 3.0;

  const { el, canvas, noteEl, btn } = makeShell(
    '📈 Slope on an x-t graph = velocity',
    SCENES
  );

  let activeIdx = 0, sceneT = 0, lastTs = null, paused = false, rafId = null;

  // Wire tabs
  el.querySelectorAll('.theory-anim__tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activeIdx = i;
      sceneT = 0;
      lastTs = null;
      el.querySelectorAll('.theory-anim__tab').forEach((t, j) =>
        t.classList.toggle('theory-anim__tab--active', j === i)
      );
      noteEl.textContent = '';
    });
  });

  function tick(ts) {
    if (paused) return;
    if (lastTs !== null) sceneT += Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    const sc  = SCENES[activeIdx];
    const prg = (sceneT % SDUR) / SDUR;

    // Update note when annotation becomes visible
    if (prg > 0.55) noteEl.textContent = sc.note;

    try {
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawSlope(ctx, sc, prg);
    } catch (e) {
      console.error('[theory-anim slope]', e);
    }

    rafId = requestAnimationFrame(tick);
  }

  btn.addEventListener('click', () => {
    paused = !paused;
    btn.textContent = paused ? '▶' : '⏸';
    if (!paused) { lastTs = null; rafId = requestAnimationFrame(tick); }
    else cancelAnimationFrame(rafId);
  });

  return { el, start() { rafId = requestAnimationFrame(tick); } };
}

function drawSlope(ctx, sc, prg) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  // ── Left: track ────────────────────────────────────────────────────
  const TL = 18, TR = 360;
  const TY = 82, TH = 36;

  ctx.fillStyle = 'rgba(15,15,35,0.95)';
  rrect(ctx, TL, TY - TH / 2, TR - TL, TH, 6);
  ctx.fill();
  ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.stroke();

  // Dashed centre
  ctx.strokeStyle = 'rgba(55,55,90,0.7)'; ctx.lineWidth = 1;
  dashed(ctx, [8, 6], () => {
    ctx.beginPath(); ctx.moveTo(TL + 6, TY); ctx.lineTo(TR - 6, TY); ctx.stroke();
  });

  // Ruler ticks
  for (let m = 0; m <= 100; m += 25) {
    const tx = TL + (m / 100) * (TR - TL);
    ctx.strokeStyle = 'rgba(55,55,85,0.6)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(tx, TY + TH / 2 - 2); ctx.lineTo(tx, TY + TH / 2 + 3); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '8px monospace'; ctx.textAlign = 'center';
    ctx.fillText(m + 'm', tx, TY + TH / 2 + 13);
  }

  // Car X: distance = v × (prg × 3s)
  const carX = TL + Math.min((sc.v * prg * 3.0) / 100, 0.94) * (TR - TL);

  // Velocity arrow
  if (sc.v > 0) {
    const aLen = Math.min(sc.v * 0.85, 52);
    ctx.strokeStyle = GREEN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(carX + 18, TY - 22); ctx.lineTo(carX + 18 + aLen, TY - 22); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(carX + 18 + aLen, TY - 22);
    ctx.lineTo(carX + 18 + aLen - 6, TY - 27);
    ctx.moveTo(carX + 18 + aLen, TY - 22);
    ctx.lineTo(carX + 18 + aLen - 6, TY - 17);
    ctx.stroke();
    ctx.fillStyle = GREEN; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('v', carX + 18 + aLen * 0.5, TY - 30);
  }

  // Car body
  ctx.shadowBlur = 14; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col;
  rrect(ctx, carX - 18, TY - 10, 36, 20, 5); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,210,255,0.8)';
  rrect(ctx, carX - 12, TY - 8, 12, 11, 2); ctx.fill();
  ctx.fillStyle = 'rgba(20,20,40,0.95)';
  circ(ctx, carX - 10, TY + 11, 5); circ(ctx, carX + 10, TY + 11, 5);

  ctx.fillStyle = MUT; ctx.font = '10px monospace'; ctx.textAlign = 'left';
  ctx.fillText('Track', TL + 4, TY + TH / 2 + 28);

  // ── Timer badge (track area, bottom-right) ─────────────────────────
  const tSec = prg * 3.0;
  const timerStr = 't = ' + tSec.toFixed(1) + ' s';
  const badgeX = TR - 66, badgeY = TY + TH / 2 + 16;
  ctx.fillStyle = 'rgba(15,15,35,0.85)';
  rrect(ctx, badgeX - 4, badgeY - 12, 66, 18, 4); ctx.fill();
  ctx.strokeStyle = ORG + '99'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = ORG; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText(timerStr, badgeX + 29, badgeY + 1);

  // ── Right: x-t graph ─────────────────────────────────────────────
  const GL = 390, GR = CW - 16;
  const GT = 14,  GB = CH - 22;
  const GW = GR - GL, GH = GB - GT;

  ctx.fillStyle = 'rgba(12,12,30,0.95)';
  rrect(ctx, GL, GT, GW, GH, 6); ctx.fill();
  ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.stroke();

  // Axes
  ctx.strokeStyle = 'rgba(80,80,130,0.65)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(GL + 16, GT + 6); ctx.lineTo(GL + 16, GB - 4); ctx.lineTo(GR - 4, GB - 4);
  ctx.stroke();

  ctx.fillStyle = MUT; ctx.font = '9px monospace';
  ctx.textAlign = 'center'; ctx.fillText('time (s) →', GL + GW / 2, CH - 5);
  ctx.textAlign = 'right';  ctx.fillText('x', GL + 13, GT + GH / 2 + 4);

  for (let s = 0; s <= 3; s++) {
    const tx = GL + 16 + (s / 3) * (GW - 22);
    ctx.strokeStyle = 'rgba(50,50,80,0.5)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(tx, GB - 4); ctx.lineTo(tx, GB + 1); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '8px monospace'; ctx.textAlign = 'center';
    ctx.fillText(s, tx, GB + 11);
  }

  // Graph line
  const x0   = GL + 16;
  const lineW = GW - 22, lineH = GH - 14;
  const startNorm = sc.v === 0 ? 0.5 : 0;
  const endNorm   = sc.v === 0 ? 0.5 : Math.min((sc.v * 3.0 * prg) / 100, 0.95);
  const y0px  = GB - 6 - startNorm * lineH;
  const xEnd  = x0 + prg * lineW;
  const yEnd  = GB - 6 - endNorm * lineH;

  ctx.shadowBlur = 10; ctx.shadowColor = sc.col;
  ctx.strokeStyle = sc.col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x0, y0px); ctx.lineTo(xEnd, yEnd); ctx.stroke();
  ctx.shadowBlur = 0;

  // Tip dot
  ctx.shadowBlur = 8; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col; circ(ctx, xEnd, yEnd, 4.5); ctx.shadowBlur = 0;

  // Slope annotation (fades in after 55%)
  if (prg > 0.5 && sc.v > 0) {
    const alpha = Math.min((prg - 0.5) / 0.2, 1);
    ctx.globalAlpha = alpha;

    const mx  = x0 + 0.52 * prg * lineW;
    const my  = GB - 6 - (sc.v * 3.0 * 0.52 * prg / 100) * lineH;
    const run = 28, rise = (sc.v / 100) * lineH * (run / lineW) * 3.0;

    ctx.strokeStyle = 'rgba(139,92,246,0.55)'; ctx.lineWidth = 1;
    dashed(ctx, [3, 3], () => {
      ctx.beginPath();
      ctx.moveTo(mx, my); ctx.lineTo(mx + run, my); ctx.lineTo(mx + run, my - rise);
      ctx.stroke();
    });
    ctx.fillStyle = PRP; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('slope = v', mx + run / 2, my + 12);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = sc.col; ctx.font = '9px monospace'; ctx.textAlign = 'left';
  ctx.fillText('x-t graph', GL + 4, GB + 22);
}

// ── Animation 2: Area = Displacement ──────────────────────────────────────

function makeAreaAnim() {
  const SCENES = [
    {
      label:   '📦 Constant velocity',
      col:     CYAN,
      vFn:     () => 5,
      formula: (t) => `Displacement = v × t = 5 × ${t.toFixed(1)} = ${(5 * t).toFixed(1)} m`,
    },
    {
      label:   '🚀 Uniform acceleration',
      col:     GREEN,
      vFn:     (t) => 2 * t,
      formula: (t) => `Displacement = ½ × t × v = ½ × ${t.toFixed(1)} × ${(2*t).toFixed(1)} = ${(t*t).toFixed(1)} m`,
    },
  ];
  const SDUR = 5.0, T_MAX = 4, V_MAX = 10;

  const { el, canvas, noteEl, btn } = makeShell(
    '📐 Area under a v-t graph = displacement',
    SCENES
  );

  let activeIdx = 0, sceneT = 0, lastTs = null, paused = false, rafId = null;

  el.querySelectorAll('.theory-anim__tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activeIdx = i;
      sceneT = 0;
      lastTs = null;
      noteEl.textContent = '';
      el.querySelectorAll('.theory-anim__tab').forEach((t, j) =>
        t.classList.toggle('theory-anim__tab--active', j === i)
      );
    });
  });

  function tick(ts) {
    if (paused) return;
    if (lastTs !== null) sceneT += Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    const sc  = SCENES[activeIdx];
    const prg = (sceneT % SDUR) / SDUR;
    if (prg > 0.35) noteEl.textContent = '← shaded area = displacement';

    try {
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawArea(ctx, sc, prg, T_MAX, V_MAX);
    } catch (e) {
      console.error('[theory-anim area]', e);
    }

    rafId = requestAnimationFrame(tick);
  }

  btn.addEventListener('click', () => {
    paused = !paused;
    btn.textContent = paused ? '▶' : '⏸';
    if (!paused) { lastTs = null; rafId = requestAnimationFrame(tick); }
    else cancelAnimationFrame(rafId);
  });

  return { el, start() { rafId = requestAnimationFrame(tick); } };
}

function drawArea(ctx, sc, prg, T_MAX, V_MAX) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  const GL = 46, GR = CW - 16;
  const GT = 14, GB = CH - 24;
  const GW = GR - GL, GH = GB - GT;

  ctx.fillStyle = 'rgba(12,12,30,0.95)';
  rrect(ctx, GL, GT, GW, GH, 6); ctx.fill();
  ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.stroke();

  for (let v = 0; v <= V_MAX; v += 2) {
    const gy = GB - (v / V_MAX) * GH;
    ctx.strokeStyle = 'rgba(35,35,65,0.5)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(GL, gy); ctx.lineTo(GR, gy); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '9px monospace'; ctx.textAlign = 'right';
    ctx.fillText(v, GL - 3, gy + 3);
  }

  for (let s = 0; s <= T_MAX; s++) {
    const gx = GL + (s / T_MAX) * GW;
    ctx.strokeStyle = 'rgba(35,35,65,0.5)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(gx, GT); ctx.lineTo(gx, GB); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(s + 's', gx, CH - 7);
  }

  const tNow = prg * T_MAX;
  const STEPS = 80;

  // Shaded area
  ctx.beginPath();
  ctx.moveTo(GL, GB);
  for (let i = 0; i <= STEPS; i++) {
    const ti = (i / STEPS) * tNow;
    ctx.lineTo(GL + (ti / T_MAX) * GW, GB - (sc.vFn(ti) / V_MAX) * GH);
  }
  ctx.lineTo(GL + (tNow / T_MAX) * GW, GB);
  ctx.closePath();
  ctx.fillStyle = sc.col + '30'; ctx.fill();

  // Curve
  ctx.shadowBlur = 10; ctx.shadowColor = sc.col;
  ctx.strokeStyle = sc.col; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= STEPS; i++) {
    const ti = (i / STEPS) * tNow;
    const xi = GL + (ti / T_MAX) * GW;
    const yi = GB - (sc.vFn(ti) / V_MAX) * GH;
    i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
  }
  ctx.stroke(); ctx.shadowBlur = 0;

  // Axes
  ctx.strokeStyle = 'rgba(90,90,145,0.7)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(GL, GT); ctx.lineTo(GL, GB); ctx.lineTo(GR, GB); ctx.stroke();

  ctx.fillStyle = MUT; ctx.font = '10px monospace';
  ctx.textAlign = 'center'; ctx.fillText('time →', GL + GW / 2, CH - 6);
  ctx.save(); ctx.translate(12, GT + GH / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('velocity (m/s)', 0, 0); ctx.restore();

  // Tip dot
  const xNow = GL + (tNow / T_MAX) * GW;
  const yNow = GB - (sc.vFn(tNow) / V_MAX) * GH;
  ctx.shadowBlur = 8; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col; circ(ctx, xNow, yNow, 5); ctx.shadowBlur = 0;

  // Time cursor + floating timer label
  ctx.strokeStyle = ORG + 'aa'; ctx.lineWidth = 1;
  dashed(ctx, [4, 4], () => {
    ctx.beginPath(); ctx.moveTo(xNow, GT); ctx.lineTo(xNow, GB); ctx.stroke();
  });

  const tLabel = 't = ' + tNow.toFixed(1) + ' s';
  const lblW = 62, lblX = GR - lblW - 6;
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  rrect(ctx, lblX, GT + 4, lblW, 18, 4); ctx.fill();
  ctx.strokeStyle = ORG + '99'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = ORG; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText(tLabel, lblX + lblW / 2, GT + 16);

  // Formula
  if (prg > 0.18) {
    const alpha = Math.min((prg - 0.18) / 0.15, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = sc.col; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
    ctx.fillText(sc.formula(tNow), GL + 8, GT + 18);
    ctx.globalAlpha = 1;
  }
}

// ── position-velocity ─────────────────────────────────────────────────────

function injectPositionVelocity(theoryEl) {
  const paras = theoryEl.querySelectorAll('p');
  if (paras.length < 1) return;
  const anim = makeAnim(
    '📍 Position, Displacement & Distance',
    [
      { label: '→ Forward',    col: CYAN,  startX: -20, endX:  40, roundTrip: false, peakX: 0  },
      { label: '↩ Round Trip', col: ORG,   startX:   0, endX:   0, roundTrip: true,  peakX: 50 },
      { label: '← Backward',   col: RED,   startX:  60, endX: -20, roundTrip: false, peakX: 0  },
    ],
    4.0,
    drawNumberLine,
    (sc, prg) => {
      if (prg < 0.05) return null;
      if (sc.roundTrip) {
        const dist = 2 * sc.peakX * prg;
        return `distance = ${dist.toFixed(0)} m · displacement = 0 m (back at start)`;
      }
      const disp = (sc.endX - sc.startX) * prg;
      return `displacement = ${disp >= 0 ? '+' : ''}${disp.toFixed(0)} m · distance = ${Math.abs(disp).toFixed(0)} m`;
    }
  );
  paras[0].insertAdjacentElement('afterend', anim.el);
  anim.start();
}

function drawNumberLine(ctx, sc, prg) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  // Number line
  const NL = 40, NR = CW - 40, NY = 78, NMIN = -30, NMAX = 110;
  const nScale = (NR - NL) / (NMAX - NMIN);
  const toX = v => NL + (v - NMIN) * nScale;

  ctx.strokeStyle = 'rgba(55,55,95,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(NL, NY); ctx.lineTo(NR, NY); ctx.stroke();

  // Arrow tip on right
  ctx.beginPath(); ctx.moveTo(NR, NY); ctx.lineTo(NR - 8, NY - 4); ctx.moveTo(NR, NY); ctx.lineTo(NR - 8, NY + 4); ctx.stroke();

  // Ticks + labels
  for (let m = -20; m <= 100; m += 20) {
    const tx = toX(m);
    ctx.strokeStyle = 'rgba(60,60,100,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(tx, NY - 7); ctx.lineTo(tx, NY + 7); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(m + 'm', tx, NY + 18);
  }

  ctx.fillStyle = MUT; ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('Position (metres)', (NL + NR) / 2, NY + 32);

  // Current position
  let curX;
  if (sc.roundTrip) {
    curX = prg <= 0.5
      ? sc.startX + (sc.peakX - sc.startX) * prg / 0.5
      : sc.startX + (sc.peakX - sc.startX) * (1 - prg) / 0.5;
  } else {
    curX = sc.startX + (sc.endX - sc.startX) * prg;
  }

  const pxStart = toX(sc.startX);
  const pxCur   = toX(curX);

  // Displacement arrow (orange, from start to current)
  if (Math.abs(pxCur - pxStart) > 6) {
    const arrowY = NY - 30;
    ctx.strokeStyle = ORG; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(pxStart, arrowY); ctx.lineTo(pxCur, arrowY); ctx.stroke();
    const dir = pxCur > pxStart ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(pxCur, arrowY); ctx.lineTo(pxCur - dir * 8, arrowY - 5);
    ctx.moveTo(pxCur, arrowY); ctx.lineTo(pxCur - dir * 8, arrowY + 5);
    ctx.stroke();
    const disp = curX - sc.startX;
    ctx.fillStyle = ORG; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`Δx = ${disp >= 0 ? '+' : ''}${disp.toFixed(0)} m`, (pxStart + pxCur) / 2, arrowY - 9);
  }

  // Start dot (green) + label
  ctx.shadowBlur = 8; ctx.shadowColor = GREEN;
  ctx.fillStyle = GREEN; circ(ctx, pxStart, NY, 7);
  ctx.shadowBlur = 0;
  ctx.fillStyle = GREEN; ctx.font = '9px monospace'; ctx.textAlign = 'center';
  ctx.fillText('start', pxStart, NY - 44);
  ctx.fillText(sc.startX + ' m', pxStart, NY - 55);

  // Current position dot (scene color)
  ctx.shadowBlur = 14; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col; circ(ctx, pxCur, NY, 10);
  ctx.shadowBlur = 0;
  if (Math.abs(pxCur - pxStart) > 16) {
    ctx.fillStyle = sc.col; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(curX.toFixed(0) + ' m', pxCur, NY - 18);
  }

  // Timer badge — top right
  const tSec = prg * 4.0;
  const lblW = 64;
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  rrect(ctx, CW - lblW - 8, 6, lblW, 18, 4); ctx.fill();
  ctx.strokeStyle = ORG + '99'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = ORG; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('t = ' + tSec.toFixed(1) + ' s', CW - lblW / 2 - 8, 18);
}

// ── equations-of-motion ────────────────────────────────────────────────────

function injectEquationsOfMotion(theoryEl) {
  const paras = theoryEl.querySelectorAll('p');
  if (paras.length < 1) return;
  const anim = makeAnim(
    '⚡ Kinematic Equations — Live Values',
    [
      { label: '🚀 Speeding Up', col: CYAN,  v0: 5,  a:  3, tMax: 4.0 },
      { label: '🛑 Braking',     col: RED,   v0: 20, a: -4, tMax: 5.0 },
      { label: '🏁 From Rest',   col: GREEN, v0: 0,  a:  6, tMax: 4.0 },
    ],
    5.0,
    drawLiveEqs,
    (sc, prg) => {
      const t = prg * sc.tMax;
      const v = sc.v0 + sc.a * t;
      const s = Math.max(0, sc.v0 * t + 0.5 * sc.a * t * t);
      return `v₀=${sc.v0} · a=${sc.a > 0 ? '+' : ''}${sc.a} m/s² · t=${t.toFixed(1)} s → v=${v.toFixed(1)} m/s · s=${s.toFixed(1)} m`;
    }
  );
  paras[0].insertAdjacentElement('afterend', anim.el);
  anim.start();
}

function drawLiveEqs(ctx, sc, prg) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  const t  = prg * sc.tMax;
  const v  = sc.v0 + sc.a * t;
  const s  = Math.max(0, sc.v0 * t + 0.5 * sc.a * t * t);
  const sMax = Math.max(1, sc.v0 * sc.tMax + 0.5 * sc.a * sc.tMax * sc.tMax);

  // ── Track strip ────────────────────────────────────────────────────
  const TL = 18, TR = 430, TY = 34, TH = 28;
  ctx.fillStyle = 'rgba(15,15,35,0.9)';
  rrect(ctx, TL, TY - TH / 2, TR - TL, TH, 5); ctx.fill();
  ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.stroke();

  for (let m = 0; m <= sMax; m += Math.ceil(sMax / 5)) {
    const tx = TL + Math.min(m / sMax, 1) * (TR - TL);
    ctx.strokeStyle = 'rgba(55,55,85,0.5)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(tx, TY + TH / 2 - 2); ctx.lineTo(tx, TY + TH / 2 + 3); ctx.stroke();
    ctx.fillStyle = MUT; ctx.font = '8px monospace'; ctx.textAlign = 'center';
    ctx.fillText(Math.round(m) + 'm', tx, TY + TH / 2 + 12);
  }

  const carX = TL + 18 + Math.min(s / sMax, 0.96) * (TR - TL - 36);

  // Velocity arrow
  if (Math.abs(v) > 0.4) {
    const aLen = Math.min(Math.abs(v) * 2.2, 48) * Math.sign(v);
    ctx.strokeStyle = GREEN; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(carX, TY - 18); ctx.lineTo(carX + aLen, TY - 18); ctx.stroke();
    const dir = aLen > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(carX + aLen, TY - 18); ctx.lineTo(carX + aLen - dir * 5, TY - 22);
    ctx.moveTo(carX + aLen, TY - 18); ctx.lineTo(carX + aLen - dir * 5, TY - 14);
    ctx.stroke();
    ctx.fillStyle = GREEN; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(v.toFixed(1) + ' m/s', carX + aLen / 2, TY - 27);
  }

  // Car body
  ctx.shadowBlur = 12; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col;
  rrect(ctx, carX - 15, TY - 8, 30, 16, 4); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,210,255,0.7)';
  rrect(ctx, carX - 9, TY - 6, 9, 9, 2); ctx.fill();

  // Timer badge
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  rrect(ctx, TR - 64, TY - TH / 2 - 20, 62, 16, 4); ctx.fill();
  ctx.strokeStyle = ORG + '99'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = ORG; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('t = ' + t.toFixed(1) + ' s', TR - 33, TY - TH / 2 - 8);

  // Progress bar
  ctx.fillStyle = 'rgba(25,25,45,0.8)';
  rrect(ctx, TL, TY + TH / 2 + 16, TR - TL, 5, 2); ctx.fill();
  ctx.shadowBlur = 5; ctx.shadowColor = sc.col;
  ctx.fillStyle = sc.col;
  rrect(ctx, TL, TY + TH / 2 + 16, (TR - TL) * prg, 5, 2); ctx.fill();
  ctx.shadowBlur = 0;

  // ── Equations panel ────────────────────────────────────────────────
  const EL = 444, ER = CW - 8, ET = 6, EB = CH - 6;
  ctx.fillStyle = 'rgba(10,10,28,0.95)';
  rrect(ctx, EL, ET, ER - EL, EB - ET, 6); ctx.fill();
  ctx.strokeStyle = PRP + '44'; ctx.lineWidth = 1; ctx.stroke();

  const eqs = [
    { label: 'v = v₀ + at',     val: v.toFixed(2) + ' m/s'    },
    { label: 's = v₀t + ½at²',  val: s.toFixed(2) + ' m'      },
    { label: 'v² = v₀² + 2as',  val: (v * v).toFixed(1) + ' m²/s²' },
  ];
  eqs.forEach((eq, i) => {
    const ey = ET + 16 + i * 40;
    ctx.fillStyle = 'rgba(0,255,136,0.05)';
    rrect(ctx, EL + 4, ey - 3, ER - EL - 8, 30, 3); ctx.fill();
    ctx.fillStyle = GREEN; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
    ctx.fillText(eq.label, EL + 10, ey + 9);
    ctx.fillStyle = ORG; ctx.textAlign = 'right';
    ctx.fillText('= ' + eq.val, ER - 8, ey + 9);
    ctx.strokeStyle = 'rgba(50,50,80,0.4)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(EL + 4, ey + 26); ctx.lineTo(ER - 4, ey + 26); ctx.stroke();
  });

  // Param row
  const params = [
    { k: 'v₀', v: sc.v0 + ' m/s', col: CYAN },
    { k: 'a',  v: (sc.a > 0 ? '+' : '') + sc.a + ' m/s²', col: RED },
  ];
  const pw = (ER - EL - 16) / params.length;
  params.forEach((p, i) => {
    const px = EL + 8 + i * pw;
    ctx.fillStyle = p.col; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(p.k + ' = ' + p.v, px + pw / 2, EB - 8);
  });
}

// ── free-fall ──────────────────────────────────────────────────────────────

function injectFreeFall(theoryEl) {
  const paras = theoryEl.querySelectorAll('p');
  if (paras.length < 1) return;
  const anim = makeAnim(
    '🌍 Free Fall: Gravity Comparison',
    [
      { label: '🌍 Earth', col: CYAN,  g: 9.8,  name: 'Earth' },
      { label: '🔴 Mars',  col: RED,   g: 3.7,  name: 'Mars'  },
      { label: '🌕 Moon',  col: GREEN, g: 1.62, name: 'Moon'  },
    ],
    6.0,
    drawFreeFall,
    (sc, prg) => {
      const H = 45, tLand = Math.sqrt(2 * H / sc.g);
      const t = Math.min(prg * 6.0, tLand);
      const h = Math.max(0, H - 0.5 * sc.g * t * t);
      const v = sc.g * t;
      return h > 0.5
        ? `${sc.name}: g = ${sc.g} m/s²  ·  h = ${h.toFixed(1)} m  ·  v = ${v.toFixed(1)} m/s ↓`
        : `${sc.name}: Landed in ${tLand.toFixed(2)} s  ·  h = v²/2g = ${(v*v/(2*sc.g)).toFixed(1)} m check ✓`;
    }
  );
  paras[0].insertAdjacentElement('afterend', anim.el);
  anim.start();
}

function drawFreeFall(ctx, sc, prg) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  const H = 45;
  const BODIES = [
    { g: 9.8,  col: CYAN,  name: 'Earth' },
    { g: 3.7,  col: RED,   name: 'Mars'  },
    { g: 1.62, col: GREEN, name: 'Moon'  },
  ];

  const shaftW = 140, shaftH = CH - 44, shaftY = 8;
  const totalW = BODIES.length * shaftW + (BODIES.length - 1) * 36;
  const startX = (CW - totalW) / 2;

  BODIES.forEach((body, bi) => {
    const sx  = startX + bi * (shaftW + 36);
    const isActive = body.name === sc.name;
    const bTLand = Math.sqrt(2 * H / body.g);
    const bT     = Math.min(prg * 6.0, bTLand);
    const bH     = Math.max(0, H - 0.5 * body.g * bT * bT);
    const ballY  = shaftY + 10 + ((H - bH) / H) * (shaftH - 22);

    // Shaft background
    ctx.fillStyle = isActive ? 'rgba(18,18,44,0.95)' : 'rgba(12,12,28,0.6)';
    rrect(ctx, sx, shaftY, shaftW, shaftH, 6); ctx.fill();
    ctx.strokeStyle = isActive ? body.col + '88' : 'rgba(40,40,70,0.4)';
    ctx.lineWidth = isActive ? 1.5 : 0.8; ctx.stroke();

    // Ground line
    ctx.strokeStyle = isActive ? body.col + 'cc' : 'rgba(55,55,90,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx + 6, shaftY + shaftH - 4);
    ctx.lineTo(sx + shaftW - 6, shaftY + shaftH - 4);
    ctx.stroke();

    // Height scale marks
    for (let hm = 0; hm <= H; hm += 15) {
      const ty = shaftY + 10 + (1 - hm / H) * (shaftH - 22);
      ctx.strokeStyle = 'rgba(45,45,75,0.5)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx + 4, ty); ctx.lineTo(sx + 8, ty); ctx.stroke();
      ctx.fillStyle = MUT; ctx.font = '7px monospace'; ctx.textAlign = 'left';
      ctx.fillText(hm + 'm', sx + 10, ty + 3);
    }

    // Trail
    for (let i = 12; i >= 0; i--) {
      const trailT = Math.max(0, bT - i * 0.1);
      const trailH = Math.max(0, H - 0.5 * body.g * trailT * trailT);
      const ty = shaftY + 10 + ((H - trailH) / H) * (shaftH - 22);
      ctx.globalAlpha = (1 - i / 13) * (isActive ? 0.55 : 0.25);
      ctx.fillStyle = body.col;
      circ(ctx, sx + shaftW / 2, ty, isActive ? 5 - i * 0.3 : 3.5 - i * 0.2);
    }
    ctx.globalAlpha = 1;

    // Ball
    ctx.shadowBlur = isActive ? 16 : 5;
    ctx.shadowColor = body.col;
    ctx.fillStyle = body.col;
    circ(ctx, sx + shaftW / 2, ballY, isActive ? 10 : 7);
    ctx.shadowBlur = 0;

    // Velocity label on active
    if (isActive && bT > 0.3) {
      const v = body.g * bT;
      ctx.fillStyle = body.col; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
      ctx.fillText('↓ ' + v.toFixed(1) + ' m/s', sx + shaftW / 2, ballY + 18);
    }

    // Landing time badge (once landed)
    if (bT >= bTLand - 0.06) {
      ctx.fillStyle = body.col; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
      ctx.fillText('✓ ' + bTLand.toFixed(2) + ' s', sx + shaftW / 2, shaftY + shaftH - 10);
    }

    // Planet name + g label
    ctx.fillStyle = isActive ? body.col : MUT;
    ctx.font = (isActive ? 'bold ' : '') + '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(body.name, sx + shaftW / 2, shaftY + shaftH + 14);
    ctx.fillStyle = MUT; ctx.font = '8px monospace';
    ctx.fillText('g = ' + body.g + ' m/s²', sx + shaftW / 2, shaftY + shaftH + 25);
  });

  // Timer badge — top right
  const tSec = Math.min(prg * 6.0, Math.sqrt(2 * H / sc.g));
  const lblW = 64;
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  rrect(ctx, CW - lblW - 8, 6, lblW, 18, 4); ctx.fill();
  ctx.strokeStyle = ORG + '99'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = ORG; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('t = ' + tSec.toFixed(1) + ' s', CW - lblW / 2 - 8, 18);
}

// ── DOM shell ─────────────────────────────────────────────────────────────

/**
 * Creates the wrapper element with a title bar, tab row, note span, and canvas.
 * @param {string} title
 * @param {Array}  scenes  — each needs .label and .col
 */
function makeShell(title, scenes) {
  const el = document.createElement('div');
  el.className = 'theory-anim';

  const tabsHtml = scenes.map((sc, i) => `
    <button class="theory-anim__tab${i === 0 ? ' theory-anim__tab--active' : ''}"
            style="--tab-col:${sc.col}">${sc.label}</button>
  `).join('');

  el.innerHTML = `
    <div class="theory-anim__bar">
      <span class="theory-anim__title">${title}</span>
      <button class="theory-anim__pause" title="Pause / Resume">⏸</button>
    </div>
    <div class="theory-anim__tabs">${tabsHtml}</div>
    <div class="theory-anim__note"></div>
    <canvas class="theory-anim__canvas" width="${CW}" height="${CH}"></canvas>
  `;

  return {
    el,
    canvas:  el.querySelector('canvas'),
    noteEl:  el.querySelector('.theory-anim__note'),
    btn:     el.querySelector('.theory-anim__pause'),
  };
}

// ── Canvas helpers ────────────────────────────────────────────────────────

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function circ(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function dashed(ctx, pattern, fn) {
  ctx.setLineDash(pattern); fn(); ctx.setLineDash([]);
}
