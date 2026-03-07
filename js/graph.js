// graph.js — Real-time graph renderer using Canvas 2D for Physics 101
// Draws axes, labels, grid lines, and line plots with neon colors on dark bg.

/**
 * Real-time line graph rendered on a <canvas> element.
 *
 * @example
 *   const graph = new RealtimeGraph(canvasEl, {
 *     title: 'Position vs Time',
 *     xLabel: 'Time (s)',
 *     yLabel: 'Position (m)',
 *     series: [
 *       { name: 'x', color: '#00ffff' },
 *       { name: 'y', color: '#ff00ff' },
 *     ],
 *     maxPoints: 500,
 *   });
 *
 *   // In your animation loop:
 *   graph.addPoint('x', t, posX);
 *   graph.addPoint('y', t, posY);
 *   graph.render();
 */
export class RealtimeGraph {
  /**
   * @param {HTMLCanvasElement} canvasEl
   * @param {Object} options
   * @param {string}  [options.title]
   * @param {string}  [options.xLabel]
   * @param {string}  [options.yLabel]
   * @param {Array}   [options.series]     — [{ name, color }]
   * @param {number}  [options.maxPoints]  — max data points per series (default 500)
   * @param {Array}   [options.xRange]     — [min, max] fixed x-axis range (auto if omitted)
   * @param {Array}   [options.yRange]     — [min, max] fixed y-axis range (auto if omitted)
   */
  constructor(canvasEl, options = {}) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.title = options.title || '';
    this.xLabel = options.xLabel || '';
    this.yLabel = options.yLabel || '';
    this.maxPoints = options.maxPoints || 500;
    this.xRange = options.xRange || null;   // [min, max] or null for auto
    this.yRange = options.yRange || null;
    this.seriesConfig = options.series || [];

    // Map: seriesName -> [{ x, y }, ...]
    this.data = {};
    this.seriesConfig.forEach((s) => {
      this.data[s.name] = [];
    });

    // Styling constants
    this.padding = { top: 40, right: 20, bottom: 50, left: 60 };
    this.bgColor = '#0d1117';
    this.gridColor = 'rgba(255, 255, 255, 0.08)';
    this.axisColor = 'rgba(255, 255, 255, 0.4)';
    this.textColor = 'rgba(255, 255, 255, 0.7)';
    this.titleColor = 'rgba(255, 255, 255, 0.9)';

    // Default neon colors if series config omits them
    this.defaultColors = [
      '#00ffff', '#ff00ff', '#00ff88', '#ffff00',
      '#ff6644', '#44aaff', '#ff44aa', '#88ff44',
    ];

    // Handle high-DPI displays
    this._setupHiDPI();
  }

  /**
   * Add a data point to a named series.
   * @param {string} seriesName
   * @param {number} x
   * @param {number} y
   */
  addPoint(seriesName, x, y) {
    if (!this.data[seriesName]) {
      // Auto-create series if not pre-defined
      this.data[seriesName] = [];
      this.seriesConfig.push({ name: seriesName, color: null });
    }

    this.data[seriesName].push({ x, y });

    // Trim to maxPoints
    if (this.data[seriesName].length > this.maxPoints) {
      this.data[seriesName].shift();
    }
  }

  /**
   * Clear all data points (keeps series definitions).
   */
  clear() {
    Object.keys(this.data).forEach((name) => {
      this.data[name] = [];
    });
  }

  /**
   * Render the graph.
   */
  render() {
    const ctx = this.ctx;
    const w = this.canvas.width / (this._dpr || 1);
    const h = this.canvas.height / (this._dpr || 1);
    const pad = this.padding;

    const plotX = pad.left;
    const plotY = pad.top;
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Clear
    ctx.save();
    ctx.setTransform(this._dpr || 1, 0, 0, this._dpr || 1, 0, 0);

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, w, h);

    // Compute data bounds
    const bounds = this._computeBounds();
    const xMin = bounds.xMin;
    const xMax = bounds.xMax;
    const yMin = bounds.yMin;
    const yMax = bounds.yMax;

    const xSpan = xMax - xMin || 1;
    const ySpan = yMax - yMin || 1;

    // ── Grid lines ──────────────────────────────────────────────
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;

    const xTicks = this._niceTicks(xMin, xMax, 6);
    const yTicks = this._niceTicks(yMin, yMax, 5);

    xTicks.forEach((val) => {
      const px = plotX + ((val - xMin) / xSpan) * plotW;
      ctx.beginPath();
      ctx.moveTo(px, plotY);
      ctx.lineTo(px, plotY + plotH);
      ctx.stroke();
    });

    yTicks.forEach((val) => {
      const py = plotY + plotH - ((val - yMin) / ySpan) * plotH;
      ctx.beginPath();
      ctx.moveTo(plotX, py);
      ctx.lineTo(plotX + plotW, py);
      ctx.stroke();
    });

    // ── Axes ────────────────────────────────────────────────────
    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 1.5;
    // X axis
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    // ── Tick labels ─────────────────────────────────────────────
    ctx.fillStyle = this.textColor;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    xTicks.forEach((val) => {
      const px = plotX + ((val - xMin) / xSpan) * plotW;
      ctx.fillText(this._formatTick(val), px, plotY + plotH + 6);
    });

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    yTicks.forEach((val) => {
      const py = plotY + plotH - ((val - yMin) / ySpan) * plotH;
      ctx.fillText(this._formatTick(val), plotX - 8, py);
    });

    // ── Axis labels ─────────────────────────────────────────────
    ctx.fillStyle = this.textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (this.xLabel) {
      ctx.fillText(this.xLabel, plotX + plotW / 2, plotY + plotH + 28);
    }

    if (this.yLabel) {
      ctx.save();
      ctx.translate(14, plotY + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.yLabel, 0, 0);
      ctx.restore();
    }

    // ── Title ───────────────────────────────────────────────────
    if (this.title) {
      ctx.fillStyle = this.titleColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(this.title, plotX + plotW / 2, 10);
    }

    // ── Data series ─────────────────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.rect(plotX, plotY, plotW, plotH);
    ctx.clip();

    this.seriesConfig.forEach((series, idx) => {
      const points = this.data[series.name];
      if (!points || points.length < 2) return;

      const color = series.color || this.defaultColors[idx % this.defaultColors.length];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Neon glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      points.forEach((pt, i) => {
        const px = plotX + ((pt.x - xMin) / xSpan) * plotW;
        const py = plotY + plotH - ((pt.y - yMin) / ySpan) * plotH;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;
    });

    ctx.restore(); // un-clip

    // ── Legend ───────────────────────────────────────────────────
    if (this.seriesConfig.length > 1) {
      this._drawLegend(ctx, plotX + plotW - 10, plotY + 8);
    }

    ctx.restore(); // un-scale
  }

  // ── private helpers ───────────────────────────────────────────

  _setupHiDPI() {
    this._dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || this.canvas.width;
    const h = rect.height || this.canvas.height;

    this.canvas.width = w * this._dpr;
    this.canvas.height = h * this._dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
  }

  _computeBounds() {
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;

    this.seriesConfig.forEach((s) => {
      const pts = this.data[s.name];
      if (!pts) return;
      pts.forEach((pt) => {
        if (pt.x < xMin) xMin = pt.x;
        if (pt.x > xMax) xMax = pt.x;
        if (pt.y < yMin) yMin = pt.y;
        if (pt.y > yMax) yMax = pt.y;
      });
    });

    // Fallback if no data yet
    if (!isFinite(xMin)) { xMin = 0; xMax = 1; }
    if (!isFinite(yMin)) { yMin = 0; yMax = 1; }

    // Apply fixed ranges if configured
    if (this.xRange) { xMin = this.xRange[0]; xMax = this.xRange[1]; }
    if (this.yRange) { yMin = this.yRange[0]; yMax = this.yRange[1]; }

    // Add a small margin so lines don't sit right on the axis
    if (!this.yRange) {
      const yPad = (yMax - yMin) * 0.08 || 0.5;
      yMin -= yPad;
      yMax += yPad;
    }
    if (!this.xRange) {
      const xPad = (xMax - xMin) * 0.02 || 0.1;
      xMin -= xPad;
      xMax += xPad;
    }

    return { xMin, xMax, yMin, yMax };
  }

  /**
   * Generate "nice" evenly-spaced tick values in a range.
   */
  _niceTicks(min, max, approxCount) {
    const range = max - min;
    if (range === 0) return [min];

    const roughStep = range / approxCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const residual = roughStep / magnitude;

    let niceStep;
    if (residual <= 1.5) niceStep = magnitude;
    else if (residual <= 3) niceStep = 2 * magnitude;
    else if (residual <= 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;

    const tickMin = Math.ceil(min / niceStep) * niceStep;
    const ticks = [];
    for (let v = tickMin; v <= max + niceStep * 0.01; v += niceStep) {
      ticks.push(v);
    }
    return ticks;
  }

  _formatTick(val) {
    const abs = Math.abs(val);
    if (abs === 0) return '0';
    if (abs >= 1000) return val.toExponential(1);
    if (abs < 0.01) return val.toExponential(1);
    // Remove trailing zeros
    return parseFloat(val.toPrecision(4)).toString();
  }

  _drawLegend(ctx, rightX, topY) {
    const lineHeight = 18;
    const swatchW = 16;
    const gap = 6;

    // Measure max label width
    ctx.font = '11px sans-serif';
    let maxLabelW = 0;
    this.seriesConfig.forEach((s) => {
      const w = ctx.measureText(s.name).width;
      if (w > maxLabelW) maxLabelW = w;
    });

    const boxW = swatchW + gap + maxLabelW + 16;
    const boxH = this.seriesConfig.length * lineHeight + 10;
    const boxX = rightX - boxW;
    const boxY = topY;

    // Background
    ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(boxX, boxY, boxW, boxH, 4)
                  : ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    // Entries
    this.seriesConfig.forEach((series, idx) => {
      const color = series.color || this.defaultColors[idx % this.defaultColors.length];
      const y = boxY + 8 + idx * lineHeight;

      // Swatch line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(boxX + 8, y + 4);
      ctx.lineTo(boxX + 8 + swatchW, y + 4);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = this.textColor;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(series.name, boxX + 8 + swatchW + gap, y + 4);
    });
  }
}
