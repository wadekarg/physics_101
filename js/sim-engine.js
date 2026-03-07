// sim-engine.js — Core simulation engine wrapping p5.js for Physics 101
// Creates a p5 instance in a container, provides play/pause/reset/speed controls.

/**
 * SimEngine wraps a p5.js sketch in instance mode and provides
 * play/pause, reset, speed, and parameter management.
 *
 * @example
 *   const engine = new SimEngine('sim-container', (p, engine) => {
 *     p.setup = () => { p.createCanvas(600, 400); };
 *     p.draw = () => {
 *       if (!engine.isPlaying) return;
 *       const speed = engine.speed;
 *       const mass = engine.getParam('mass');
 *       // ... drawing logic
 *     };
 *   }, { mass: 1, gravity: 9.8 });
 */
export class SimEngine {
  /**
   * @param {string} containerId — DOM id of the container element
   * @param {function(p5Instance, SimEngine)} sketchFn — p5 sketch builder
   * @param {Object} params — initial parameter values (name -> value)
   */
  constructor(containerId, sketchFn, params = {}) {
    this.containerId = containerId;
    this.containerEl = document.getElementById(containerId);
    this.sketchFn = sketchFn;
    this.isPlaying = true;
    this.speed = 1;
    this.params = Object.assign({}, params);
    this.initialParams = Object.assign({}, params);
    this.p5Instance = null;
    this._onResetCallbacks = [];

    if (!this.containerEl) {
      console.error(`[SimEngine] Container #${containerId} not found.`);
      return;
    }

    this._createP5();
  }

  /**
   * Resume the simulation.
   */
  play() {
    this.isPlaying = true;
    if (this.p5Instance && this.p5Instance.loop) {
      this.p5Instance.loop();
    }
    this._dispatchState();
  }

  /**
   * Pause the simulation.
   */
  pause() {
    this.isPlaying = false;
    // We do NOT call p5.noLoop() so that draw() still fires (the sketch
    // checks engine.isPlaying to decide whether to advance physics).
    this._dispatchState();
  }

  /**
   * Reset the simulation: restore initial params, rebuild the p5 sketch.
   */
  reset() {
    this.isPlaying = false;
    this.speed = 1;
    this.params = Object.assign({}, this.initialParams);

    // Destroy and recreate
    this._destroyP5();
    this._createP5();

    // Notify listeners
    this._onResetCallbacks.forEach((cb) => cb());
    this._dispatchState();

    // Auto-play after reset
    this.isPlaying = true;
    this._dispatchState();
  }

  /**
   * Set the speed multiplier.
   * @param {number} speed — one of 0.5, 1, 2, 4 (or any positive number)
   */
  setSpeed(speed) {
    this.speed = Math.max(0.1, speed);
    this._dispatchState();
  }

  /**
   * Get the current value of a named parameter.
   * @param {string} name
   * @returns {*}
   */
  getParam(name) {
    return this.params[name];
  }

  /**
   * Set a parameter value at runtime.
   * @param {string} name
   * @param {*} value
   */
  setParam(name, value) {
    this.params[name] = value;
    document.dispatchEvent(
      new CustomEvent('qp:sim-param', { detail: { name, value } })
    );
  }

  /**
   * Register a callback that fires on reset.
   * @param {function} cb
   */
  onReset(cb) {
    this._onResetCallbacks.push(cb);
  }

  /**
   * Fully tear down the p5 instance and clean up the container.
   */
  destroy() {
    this._destroyP5();
  }

  // ── private ─────────────────────────────────────────────────────

  _createP5() {
    if (typeof p5 === 'undefined') {
      console.error('[SimEngine] p5.js is not loaded. Add it via a <script> tag.');
      return;
    }

    const self = this;

    this.p5Instance = new p5((p) => {
      // Let the user-provided sketch function set up setup/draw/etc.
      self.sketchFn(p, self);
    }, this.containerEl);
  }

  _destroyP5() {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
  }

  _dispatchState() {
    document.dispatchEvent(
      new CustomEvent('qp:sim-state', {
        detail: {
          isPlaying: this.isPlaying,
          speed: this.speed,
          params: Object.assign({}, this.params),
        },
      })
    );
  }
}
