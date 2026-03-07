#!/usr/bin/env python3
"""Batch 8a: lenses, wave-optics, time-dilation, length-contraction,
emc-squared, photoelectric-effect, wave-particle-duality, energy-levels, radioactive-decay"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"lenses": [
  {"title":"Converging Lens — Real Image","steps":[
    {"text":"Object 30 cm from a converging lens (f = 10 cm). Find image distance.","latex":"","isFinal":False},
    {"text":"Lens equation: 1/f = 1/d_o + 1/d_i","latex":"\\frac{1}{10} = \\frac{1}{30} + \\frac{1}{d_i}","isFinal":False},
    {"text":"Solve","latex":"\\frac{1}{d_i} = \\frac{1}{10} - \\frac{1}{30} = \\frac{2}{30} \\Rightarrow d_i = 15\\text{ cm (real)}","isFinal":True}
  ]},
  {"title":"Magnification by a Lens","steps":[
    {"text":"Object 4 cm tall, 30 cm from lens (d_i = 15 cm from above). Find image height.","latex":"","isFinal":False},
    {"text":"m = −d_i/d_o","latex":"m = -\\frac{15}{30} = -0.5\\text{ (inverted)}","isFinal":False},
    {"text":"Image height","latex":"h_i = m \\times h_o = -0.5 \\times 4 = -2\\text{ cm (inverted, 2 cm tall)}","isFinal":True}
  ]},
  {"title":"Diverging Lens — Virtual Image","steps":[
    {"text":"Object 20 cm from a diverging lens (f = −12 cm). Find image distance.","latex":"","isFinal":False},
    {"text":"1/f = 1/d_o + 1/d_i","latex":"\\frac{1}{-12} = \\frac{1}{20} + \\frac{1}{d_i}","isFinal":False},
    {"text":"","latex":"\\frac{1}{d_i} = -\\frac{1}{12} - \\frac{1}{20} = -\\frac{8}{60} \\Rightarrow d_i = -7.5\\text{ cm (virtual, same side)}","isFinal":True}
  ]},
  {"title":"Focal Length from Lens Maker's Equation","steps":[
    {"text":"A biconvex glass lens (n = 1.5, R₁ = 20 cm, R₂ = −20 cm). Find focal length.","latex":"","isFinal":False},
    {"text":"Lens maker's equation: 1/f = (n−1)(1/R₁ − 1/R₂)","latex":"\\frac{1}{f} = (1.5-1)\\left(\\frac{1}{20} - \\frac{1}{-20}\\right) = 0.5 \\times \\frac{2}{20} = \\frac{1}{20}","isFinal":False},
    {"text":"","latex":"f = 20\\text{ cm}","isFinal":True}
  ]},
  {"title":"Object at Focal Point","steps":[
    {"text":"Object placed at f = 15 cm from a converging lens (f = 15 cm). Where does the image form?","latex":"","isFinal":False},
    {"text":"1/f = 1/d_o + 1/d_i → 1/d_i = 1/15 − 1/15 = 0","latex":"\\frac{1}{d_i} = 0 \\Rightarrow d_i = \\infty","isFinal":False},
    {"text":"Rays emerge parallel — image at infinity (used in projectors and collimators).","latex":"","isFinal":True}
  ]},
  {"title":"Power of a Lens","steps":[
    {"text":"A lens has f = 25 cm. Find its power in dioptres.","latex":"","isFinal":False},
    {"text":"P = 1/f (in metres)","latex":"P = \\frac{1}{0.25} = +4\\text{ D (converging)}","isFinal":True}
  ]},
  {"title":"Combined Lens Power","steps":[
    {"text":"A +3 D and −1 D lens are placed in contact. Find the effective focal length.","latex":"","isFinal":False},
    {"text":"P_total = P₁ + P₂","latex":"P = 3 + (-1) = 2\\text{ D}","isFinal":False},
    {"text":"f = 1/P = 0.5 m = 50 cm","latex":"f = \\frac{1}{2} = 0.5\\text{ m} = 50\\text{ cm}","isFinal":True}
  ]},
  {"title":"Near-Sightedness Correction","steps":[
    {"text":"A near-sighted person can see only up to 50 cm. Find the lens needed to see objects at infinity.","latex":"","isFinal":False},
    {"text":"The lens must form a virtual image at 50 cm when object is at infinity (d_o = ∞, d_i = −50 cm)","latex":"\\frac{1}{f} = \\frac{1}{\\infty} + \\frac{1}{-50} = -\\frac{1}{50}","isFinal":False},
    {"text":"f = −50 cm → P = −2 D (diverging lens needed)","latex":"P = -2\\text{ D (diverging)}","isFinal":True}
  ]},
  {"title":"Far-Sightedness Correction","steps":[
    {"text":"A far-sighted person's near point is 75 cm (needs to read at 25 cm). Find the required lens power.","latex":"","isFinal":False},
    {"text":"Lens must form virtual image at −75 cm when object is at 25 cm","latex":"\\frac{1}{f} = \\frac{1}{25} + \\frac{1}{-75} = \\frac{3-1}{75} = \\frac{2}{75}","isFinal":False},
    {"text":"f = 37.5 cm → P = 1/0.375 = +2.67 D (converging)","latex":"P = +2.67\\text{ D (converging)}","isFinal":True}
  ]},
  {"title":"Simple Magnifier","steps":[
    {"text":"A magnifying glass (f = 5 cm) is used with the image at the near point (25 cm). Find the magnification.","latex":"","isFinal":False},
    {"text":"For image at near point: M = 1 + D/f","latex":"M = 1 + \\frac{25}{5} = 1 + 5 = 6\\times","isFinal":False},
    {"text":"For relaxed eye (image at infinity): M = D/f = 25/5 = 5×","latex":"M_{relaxed} = \\frac{25}{5} = 5\\times","isFinal":True}
  ]}
],

"wave-optics": [
  {"title":"Young's Double Slit — Fringe Spacing","steps":[
    {"text":"Double slit: d = 0.3 mm, screen at D = 1.5 m, λ = 600 nm. Find fringe spacing.","latex":"","isFinal":False},
    {"text":"Fringe spacing β = λD/d","latex":"\\beta = \\frac{600\\times10^{-9} \\times 1.5}{0.3\\times10^{-3}} = \\frac{9\\times10^{-7}}{3\\times10^{-4}} = 3\\times10^{-3}\\text{ m} = 3\\text{ mm}","isFinal":True}
  ]},
  {"title":"Single Slit Diffraction — First Minimum","steps":[
    {"text":"A single slit (width a = 0.1 mm) is illuminated by λ = 500 nm. Find the angle to the first minimum.","latex":"","isFinal":False},
    {"text":"First minimum: a sinθ = λ","latex":"\\sin\\theta = \\frac{\\lambda}{a} = \\frac{500\\times10^{-9}}{10^{-4}} = 5\\times10^{-3}","isFinal":False},
    {"text":"θ = arcsin(0.005) ≈ 0.286°","latex":"\\theta \\approx 0.286°","isFinal":True}
  ]},
  {"title":"Thin Film Interference","steps":[
    {"text":"Soap film (n = 1.4, t = 300 nm). Find the visible wavelengths showing constructive interference in reflection.","latex":"","isFinal":False},
    {"text":"For reflection at top surface (phase change) and bottom (no change): 2nt = (m + ½)λ → constructive","latex":"\\lambda = \\frac{2nt}{m + 1/2} = \\frac{2 \\times 1.4 \\times 300}{m + 0.5}\\text{ nm}","isFinal":False},
    {"text":"m=0: λ = 840/0.5 = 1680 nm (IR); m=1: λ = 840/1.5 = 560 nm (green ✓); m=2: λ = 840/2.5 = 336 nm (UV)","latex":"\\lambda_{m=1} = 560\\text{ nm (visible green)}","isFinal":True}
  ]},
  {"title":"Diffraction Grating","steps":[
    {"text":"A grating with 500 lines/mm. Find the angle for the first order maximum of λ = 550 nm.","latex":"","isFinal":False},
    {"text":"Grating spacing d = 1/500 mm = 2×10⁻⁶ m; grating equation: d sinθ = mλ","latex":"\\sin\\theta = \\frac{m\\lambda}{d} = \\frac{1 \\times 550\\times10^{-9}}{2\\times10^{-6}} = 0.275","isFinal":False},
    {"text":"","latex":"\\theta = \\arcsin(0.275) \\approx 15.96° \\approx 16°","isFinal":True}
  ]},
  {"title":"Resolving Power of Grating","steps":[
    {"text":"A grating has N = 5000 lines illuminated, used in 2nd order. Find resolving power and minimum resolvable wavelength difference near λ = 500 nm.","latex":"","isFinal":False},
    {"text":"R = mN","latex":"R = 2 \\times 5000 = 10\\,000","isFinal":False},
    {"text":"Δλ = λ/R","latex":"\\Delta\\lambda = \\frac{500}{10000} = 0.05\\text{ nm}","isFinal":True}
  ]},
  {"title":"Polarisation — Malus's Law","steps":[
    {"text":"Polarised light (I₀ = 100 W/m²) passes through a polariser at 45°. Find the transmitted intensity.","latex":"","isFinal":False},
    {"text":"Malus's Law: I = I₀ cos²θ","latex":"I = 100 \\times \\cos^2 45° = 100 \\times 0.5 = 50\\text{ W/m}^2","isFinal":True}
  ]},
  {"title":"Brewster's Angle","steps":[
    {"text":"Find Brewster's angle for glass (n = 1.5).","latex":"","isFinal":False},
    {"text":"tan θ_B = n₂/n₁ = 1.5/1.0","latex":"\\theta_B = \\arctan(1.5) \\approx 56.3°","isFinal":False},
    {"text":"At this angle, reflected light is completely polarised (parallel component zero).","latex":"","isFinal":True}
  ]},
  {"title":"Michelson Interferometer","steps":[
    {"text":"In a Michelson interferometer, one mirror moves 0.15 mm. For λ = 600 nm, how many fringes shift?","latex":"","isFinal":False},
    {"text":"Each fringe = half-wavelength path difference (2×mirror movement per fringe)","latex":"N = \\frac{2d}{\\lambda} = \\frac{2 \\times 0.15\\times10^{-3}}{600\\times10^{-9}} = \\frac{3\\times10^{-4}}{6\\times10^{-7}} = 500\\text{ fringes}","isFinal":True}
  ]},
  {"title":"Anti-Reflection Coating","steps":[
    {"text":"Find the minimum thickness of an anti-reflection coating (n = 1.38) for λ = 550 nm green light.","latex":"","isFinal":False},
    {"text":"For destructive interference on reflection: 2nt = λ/2 → t = λ/(4n)","latex":"t = \\frac{550}{4 \\times 1.38} = \\frac{550}{5.52} \\approx 99.6\\text{ nm} \\approx 100\\text{ nm}","isFinal":True}
  ]},
  {"title":"Rayleigh Criterion","steps":[
    {"text":"A telescope has aperture D = 0.1 m. Find the minimum resolvable angle for λ = 550 nm.","latex":"","isFinal":False},
    {"text":"Rayleigh criterion: θ_min = 1.22 λ/D","latex":"\\theta_{min} = \\frac{1.22 \\times 550\\times10^{-9}}{0.1} = 6.71\\times10^{-6}\\text{ rad} \\approx 1.38\"","isFinal":True}
  ]}
],

"time-dilation": [
  {"title":"Time Dilation at 0.6c","steps":[
    {"text":"A muon lives for t₀ = 2.2 μs in its rest frame. It travels at v = 0.6c. Find its lifetime as measured in the lab.","latex":"","isFinal":False},
    {"text":"γ = 1/√(1 − v²/c²) = 1/√(1 − 0.36) = 1/√0.64 = 1/0.8 = 1.25","latex":"\\gamma = 1.25","isFinal":False},
    {"text":"t = γ t₀","latex":"t = 1.25 \\times 2.2 = 2.75\\text{ μs}","isFinal":True}
  ]},
  {"title":"Lorentz Factor Calculation","steps":[
    {"text":"Find γ for v = 0.8c, 0.9c, and 0.99c.","latex":"","isFinal":False},
    {"text":"γ = 1/√(1 − β²) where β = v/c","latex":"\\gamma_{0.8c} = \\frac{1}{\\sqrt{1-0.64}} = \\frac{1}{0.6} = 1.667","isFinal":False},
    {"text":"","latex":"\\gamma_{0.9c} = \\frac{1}{\\sqrt{0.19}} \\approx 2.294; \\quad \\gamma_{0.99c} = \\frac{1}{\\sqrt{0.0199}} \\approx 7.09","isFinal":True}
  ]},
  {"title":"Muon Reaching Earth","steps":[
    {"text":"Muons created 10 km up travel at 0.998c. Their rest lifetime is 2.2 μs. Do they reach Earth?","latex":"","isFinal":False},
    {"text":"γ = 1/√(1 − 0.998²) ≈ 15.8","latex":"\\gamma = 15.8","isFinal":False},
    {"text":"Lab lifetime: t = 15.8 × 2.2 = 34.7 μs; distance covered = 0.998c × 34.7 μs ≈ 10.4 km > 10 km → YES","latex":"d = 0.998c \\times 34.7\\times10^{-6} \\approx 10.4\\text{ km}\\checkmark","isFinal":True}
  ]},
  {"title":"Twin Paradox","steps":[
    {"text":"Twin A travels at 0.8c for 6 years (Earth time) and returns. How much does A age?","latex":"","isFinal":False},
    {"text":"γ = 1/0.6 = 1.667 (from v = 0.8c)","latex":"","isFinal":False},
    {"text":"Proper time experienced by A = t/γ = 6/1.667 = 3.6 years. A is 2.4 years younger on return.","latex":"\\Delta\\tau = \\frac{t}{\\gamma} = \\frac{6}{1.667} = 3.6\\text{ years}","isFinal":True}
  ]},
  {"title":"GPS Time Correction","steps":[
    {"text":"GPS satellites travel at ~3870 m/s. Find the daily time dilation (SR effect only).","latex":"","isFinal":False},
    {"text":"Δt ≈ ½(v/c)² per unit time (for v << c)","latex":"\\frac{\\Delta t}{t} \\approx \\frac{v^2}{2c^2} = \\frac{(3870)^2}{2(3\\times10^8)^2} = 8.33\\times10^{-11}","isFinal":False},
    {"text":"Daily SR time loss: 8.33×10⁻¹¹ × 86 400 ≈ 7.2 μs/day (clocks run slower → corrected by GPS system)","latex":"\\Delta t_{SR} \\approx 7.2\\text{ μs/day (slow)}","isFinal":True}
  ]},
  {"title":"Relativistic Velocity Addition","steps":[
    {"text":"Rocket at 0.6c fires a missile at 0.8c relative to itself. Find missile's speed relative to Earth.","latex":"","isFinal":False},
    {"text":"Relativistic addition: u' = (u + v)/(1 + uv/c²)","latex":"u' = \\frac{0.6c + 0.8c}{1 + 0.6 \\times 0.8} = \\frac{1.4c}{1.48} = 0.946c","isFinal":True}
  ]},
  {"title":"Time Dilation and Simultaneity","steps":[
    {"text":"In frame S', two events occur at the same location 3 s apart. In frame S (v = 0.6c), what is the time between events?","latex":"","isFinal":False},
    {"text":"This is the proper time interval (same location in S') → dilated in S","latex":"\\Delta t = \\gamma \\Delta t' = 1.25 \\times 3 = 3.75\\text{ s}","isFinal":True}
  ]},
  {"title":"Atomic Clock Experiment","steps":[
    {"text":"An aeroplane carrying an atomic clock flies for 20 h at v = 250 m/s. By how much does it fall behind a ground clock?","latex":"","isFinal":False},
    {"text":"Time difference Δt ≈ ½(v/c)² × t","latex":"\\Delta t = \\frac{(250)^2}{2(3\\times10^8)^2} \\times 72000 = \\frac{62500}{1.8\\times10^{17}} \\times 72000 \\approx 2.5\\times10^{-8}\\text{ s} = 25\\text{ ns}","isFinal":True}
  ]},
  {"title":"Particle Accelerator Lifetime","steps":[
    {"text":"A pion (rest lifetime 26 ns) is accelerated to γ = 30. How far does it travel before decaying?","latex":"","isFinal":False},
    {"text":"Lab lifetime: t = γ × t₀ = 30 × 26 ns = 780 ns","latex":"t_{lab} = 780\\text{ ns}","isFinal":False},
    {"text":"Distance (at v ≈ c)","latex":"d = v \\times t \\approx c \\times 780\\times10^{-9} = 3\\times10^8 \\times 7.8\\times10^{-7} \\approx 234\\text{ m}","isFinal":True}
  ]},
  {"title":"Time Dilation Near Black Hole","steps":[
    {"text":"Near a black hole, a clock at r = 1.1 R_s (just outside Schwarzschild radius) ticks at what rate compared to infinity?","latex":"","isFinal":False},
    {"text":"Gravitational time dilation: Δτ = Δt √(1 − R_s/r)","latex":"\\frac{d\\tau}{dt} = \\sqrt{1 - \\frac{R_s}{1.1 R_s}} = \\sqrt{1 - \\frac{1}{1.1}} = \\sqrt{\\frac{0.1}{1.1}} = \\sqrt{0.0909} \\approx 0.302","isFinal":False},
    {"text":"The clock near the black hole ticks at only ~30% the rate of a distant clock.","latex":"","isFinal":True}
  ]}
],

"length-contraction": [
  {"title":"Contracted Length at 0.8c","steps":[
    {"text":"A spaceship is 100 m long in its rest frame. It passes at v = 0.8c. Find its contracted length.","latex":"","isFinal":False},
    {"text":"γ = 1/√(1 − 0.64) = 1/0.6 = 1.667","latex":"","isFinal":False},
    {"text":"L = L₀/γ","latex":"L = \\frac{100}{1.667} = 60\\text{ m}","isFinal":True}
  ]},
  {"title":"Length Contraction and Muons","steps":[
    {"text":"In the muon frame (γ = 15.8), the 10 km atmosphere appears to be how long?","latex":"","isFinal":False},
    {"text":"L = L₀/γ","latex":"L = \\frac{10000}{15.8} \\approx 633\\text{ m}","isFinal":False},
    {"text":"The muon easily travels 633 m in its 2.2 μs lifetime (d = 0.998c × 2.2 μs ≈ 659 m ≥ 633 m).","latex":"d = 0.998c \\times 2.2\\times10^{-6} \\approx 659\\text{ m}\\checkmark","isFinal":True}
  ]},
  {"title":"Finding Speed from Contraction","steps":[
    {"text":"A rod appears 80% of its rest length. Find its speed.","latex":"","isFinal":False},
    {"text":"L/L₀ = 1/γ → γ = L₀/L = 1/0.8 = 1.25","latex":"\\gamma = 1.25","isFinal":False},
    {"text":"From γ: v = c√(1 − 1/γ²) = c√(1 − 0.64) = 0.6c","latex":"v = 0.6c","isFinal":True}
  ]},
  {"title":"Pole-Barn Paradox Setup","steps":[
    {"text":"A 20 m pole moves at 0.866c through a 10 m barn. From the barn frame, does the pole fit?","latex":"","isFinal":False},
    {"text":"γ at 0.866c: γ = 1/√(1 − 0.75) = 1/0.5 = 2","latex":"\\gamma = 2","isFinal":False},
    {"text":"Contracted pole length L = 20/2 = 10 m → fits exactly in the barn (in barn frame).","latex":"L = \\frac{20}{2} = 10\\text{ m = barn length}","isFinal":True}
  ]},
  {"title":"Length Contraction is Along Motion Only","steps":[
    {"text":"A cube (side 1 m) moves at v = 0.6c along the x-axis. Find its dimensions.","latex":"","isFinal":False},
    {"text":"Contraction only along direction of motion; γ = 1.25","latex":"L_x = \\frac{1}{1.25} = 0.8\\text{ m}","isFinal":False},
    {"text":"y and z dimensions unchanged: L_y = L_z = 1 m. The cube appears as a rectangular prism 0.8 × 1 × 1 m.","latex":"","isFinal":True}
  ]},
  {"title":"Contracted Length at 0.99c","steps":[
    {"text":"A 300 m spacecraft moves at 0.99c. Find its contracted length.","latex":"","isFinal":False},
    {"text":"γ = 1/√(1 − 0.9801) = 1/√0.0199 ≈ 7.09","latex":"\\gamma \\approx 7.09","isFinal":False},
    {"text":"L = 300/7.09 ≈ 42.3 m","latex":"L = \\frac{300}{7.09} \\approx 42.3\\text{ m}","isFinal":True}
  ]},
  {"title":"Simultaneity and Length","steps":[
    {"text":"Explain why length contraction requires reconsideration of simultaneity.","latex":"","isFinal":False},
    {"text":"To measure a moving rod's length, both ends must be recorded simultaneously in the observer's frame.","latex":"","isFinal":False},
    {"text":"But events simultaneous in one frame are not simultaneous in another — this relativity of simultaneity is what makes length contraction consistent.","latex":"\\Delta t' = \\gamma\\left(\\Delta t - \\frac{v\\Delta x}{c^2}\\right)","isFinal":True}
  ]},
  {"title":"Lorentz Transformation of Position","steps":[
    {"text":"An event at x = 100 m, t = 0 in frame S. Frame S' moves at v = 0.6c. Find x' in S' at t' = 0.","latex":"","isFinal":False},
    {"text":"Lorentz transformation: x' = γ(x − vt)","latex":"x' = 1.25 \\times (100 - 0.6c \\times 0) = 1.25 \\times 100 = 125\\text{ m}","isFinal":True}
  ]},
  {"title":"Relativistic Doppler — Blueshift","steps":[
    {"text":"A source moves toward you at 0.5c. f₀ = 10¹⁴ Hz. Find the observed frequency.","latex":"","isFinal":False},
    {"text":"Relativistic Doppler (approaching): f = f₀√((1+β)/(1−β))","latex":"f = 10^{14}\\sqrt{\\frac{1.5}{0.5}} = 10^{14}\\sqrt{3} \\approx 1.732\\times10^{14}\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Proper Length vs Coordinate Length","steps":[
    {"text":"Define proper length and coordinate length. Which is always larger?","latex":"","isFinal":False},
    {"text":"Proper length L₀ is the length measured in the object's rest frame (longest possible measurement).","latex":"","isFinal":False},
    {"text":"Coordinate length L = L₀/γ is measured in a frame where the object is moving. Since γ ≥ 1, L ≤ L₀. Proper length is always the largest.","latex":"L = \\frac{L_0}{\\gamma} \\leq L_0","isFinal":True}
  ]}
],

"emc-squared": [
  {"title":"Rest Energy of a Proton","steps":[
    {"text":"Find the rest energy of a proton (m = 1.67×10⁻²⁷ kg).","latex":"","isFinal":False},
    {"text":"E = mc²","latex":"E = 1.67\\times10^{-27} \\times (3\\times10^8)^2 = 1.67\\times10^{-27} \\times 9\\times10^{16} = 1.503\\times10^{-10}\\text{ J}","isFinal":False},
    {"text":"Convert to MeV (1 MeV = 1.6×10⁻¹³ J)","latex":"E = \\frac{1.503\\times10^{-10}}{1.6\\times10^{-13}} \\approx 938.5\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Mass–Energy in Nuclear Fission","steps":[
    {"text":"Fission of U-235 releases 200 MeV. Find the mass converted to energy.","latex":"","isFinal":False},
    {"text":"E = 200 MeV = 200 × 1.6×10⁻¹³ = 3.2×10⁻¹¹ J","latex":"","isFinal":False},
    {"text":"m = E/c²","latex":"m = \\frac{3.2\\times10^{-11}}{(3\\times10^8)^2} = \\frac{3.2\\times10^{-11}}{9\\times10^{16}} \\approx 3.56\\times10^{-28}\\text{ kg}","isFinal":True}
  ]},
  {"title":"Binding Energy of Helium-4","steps":[
    {"text":"He-4: mass defect = 0.0304 u. Find binding energy. (1 u = 931.5 MeV/c²)","latex":"","isFinal":False},
    {"text":"E_binding = Δm × c² = Δm (in u) × 931.5 MeV/u","latex":"E_b = 0.0304 \\times 931.5 = 28.3\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Relativistic Kinetic Energy","steps":[
    {"text":"Find the kinetic energy of an electron (m = 9.11×10⁻³¹ kg) moving at 0.8c.","latex":"","isFinal":False},
    {"text":"KE = (γ − 1)mc² where γ = 1/0.6 = 1.667","latex":"KE = (1.667 - 1) \\times 9.11\\times10^{-31} \\times 9\\times10^{16}","isFinal":False},
    {"text":"","latex":"KE = 0.667 \\times 8.2\\times10^{-14} = 5.47\\times10^{-14}\\text{ J} \\approx 0.341\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Total Relativistic Energy","steps":[
    {"text":"Find total energy of an electron at 0.8c (m_e = 9.11×10⁻³¹ kg).","latex":"","isFinal":False},
    {"text":"E_total = γmc² = 1.667 × m_e c²","latex":"E_{rest} = m_e c^2 = 0.511\\text{ MeV}","isFinal":False},
    {"text":"E_total = 1.667 × 0.511 = 0.852 MeV","latex":"E_{total} = \\gamma m_e c^2 = 1.667 \\times 0.511 \\approx 0.852\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Pair Production Threshold","steps":[
    {"text":"What is the minimum photon energy needed for electron-positron pair production?","latex":"","isFinal":False},
    {"text":"Two particles produced (electron + positron): each has rest energy m_e c²","latex":"E_{min} = 2m_e c^2 = 2 \\times 0.511 = 1.022\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Solar Energy Output","steps":[
    {"text":"The Sun converts 4.3×10⁹ kg/s to energy. Find power output.","latex":"","isFinal":False},
    {"text":"P = (dm/dt) × c²","latex":"P = 4.3\\times10^9 \\times (3\\times10^8)^2 = 4.3\\times10^9 \\times 9\\times10^{16} = 3.87\\times10^{26}\\text{ W}","isFinal":True}
  ]},
  {"title":"Nuclear Reaction Q-value","steps":[
    {"text":"In a reaction, reactant masses total 10.0125 u and products total 10.0082 u. Find Q-value in MeV.","latex":"","isFinal":False},
    {"text":"Mass defect: Δm = 10.0125 − 10.0082 = 0.0043 u","latex":"\\Delta m = 0.0043\\text{ u}","isFinal":False},
    {"text":"Q = Δm × 931.5 MeV/u","latex":"Q = 0.0043 \\times 931.5 = 4.0\\text{ MeV (exothermic)}","isFinal":True}
  ]},
  {"title":"Annihilation — Photon Energy","steps":[
    {"text":"An electron and positron annihilate. Find the energy of each photon produced.","latex":"","isFinal":False},
    {"text":"Total energy = 2m_e c² = 1.022 MeV, split between 2 photons","latex":"E_{photon} = m_e c^2 = 0.511\\text{ MeV each}","isFinal":True}
  ]},
  {"title":"Speed to Double Rest Mass Energy","steps":[
    {"text":"At what speed does the total relativistic energy equal twice the rest energy?","latex":"","isFinal":False},
    {"text":"E_total = γmc² = 2mc² → γ = 2","latex":"\\frac{1}{\\sqrt{1-v^2/c^2}} = 2 \\Rightarrow v^2/c^2 = 1 - 1/4 = 3/4","isFinal":False},
    {"text":"","latex":"v = \\frac{\\sqrt{3}}{2}c \\approx 0.866c","isFinal":True}
  ]}
],

"photoelectric-effect": [
  {"title":"Maximum Kinetic Energy of Photoelectrons","steps":[
    {"text":"Light of f = 8×10¹⁴ Hz shines on metal (φ = 2.0 eV). Find KE_max. (h = 6.626×10⁻³⁴ J·s)","latex":"","isFinal":False},
    {"text":"Einstein's equation: KE_max = hf − φ","latex":"KE_{max} = 6.626\\times10^{-34} \\times 8\\times10^{14} - 2.0 \\times 1.6\\times10^{-19}","isFinal":False},
    {"text":"","latex":"KE_{max} = 5.30\\times10^{-19} - 3.20\\times10^{-19} = 2.10\\times10^{-19}\\text{ J} = 1.31\\text{ eV}","isFinal":True}
  ]},
  {"title":"Threshold Frequency","steps":[
    {"text":"A metal has work function φ = 3.0 eV. Find the threshold frequency.","latex":"","isFinal":False},
    {"text":"hf₀ = φ → f₀ = φ/h","latex":"f_0 = \\frac{3.0 \\times 1.6\\times10^{-19}}{6.626\\times10^{-34}} = \\frac{4.8\\times10^{-19}}{6.626\\times10^{-34}} = 7.24\\times10^{14}\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Stopping Potential","steps":[
    {"text":"KE_max of photoelectrons = 1.5 eV. Find the stopping potential.","latex":"","isFinal":False},
    {"text":"Stopping potential V_s stops the most energetic electrons: eV_s = KE_max","latex":"V_s = \\frac{KE_{max}}{e} = \\frac{1.5\\text{ eV}}{e} = 1.5\\text{ V}","isFinal":True}
  ]},
  {"title":"Work Function from Stopping Potential","steps":[
    {"text":"Light (λ = 250 nm) causes stopping potential of 2.3 V. Find the work function.","latex":"","isFinal":False},
    {"text":"Photon energy","latex":"E_{photon} = \\frac{hc}{\\lambda} = \\frac{6.626\\times10^{-34} \\times 3\\times10^8}{250\\times10^{-9}} = 7.95\\times10^{-19}\\text{ J} = 4.97\\text{ eV}","isFinal":False},
    {"text":"φ = hf − eV_s = 4.97 − 2.3 = 2.67 eV","latex":"\\phi = 4.97 - 2.3 = 2.67\\text{ eV}","isFinal":True}
  ]},
  {"title":"Effect of Intensity","steps":[
    {"text":"The light intensity is doubled but frequency kept constant. How does the photoelectric current change?","latex":"","isFinal":False},
    {"text":"Doubling intensity doubles the number of photons per second → double the photoelectrons ejected per second.","latex":"","isFinal":False},
    {"text":"Photoelectric current doubles, but KE_max remains unchanged (depends only on frequency, not intensity).","latex":"I_{current} \\propto \\text{intensity};\\quad KE_{max}\\text{ unchanged}","isFinal":True}
  ]},
  {"title":"Photoelectron from X-ray","steps":[
    {"text":"X-ray (λ = 0.05 nm) ejects an electron from a metal (φ = 5 eV). Find KE_max.","latex":"","isFinal":False},
    {"text":"Photon energy","latex":"E = \\frac{hc}{\\lambda} = \\frac{1240\\text{ eV·nm}}{0.05} = 24800\\text{ eV} = 24.8\\text{ keV}","isFinal":False},
    {"text":"KE_max = E − φ ≈ 24.8 keV (much larger than φ)","latex":"KE_{max} \\approx 24795\\text{ eV} \\approx 24.8\\text{ keV}","isFinal":True}
  ]},
  {"title":"Planck's Constant from Graph","steps":[
    {"text":"A graph of KE_max vs frequency gives slope = 6.5×10⁻³⁴ J·s and x-intercept = 5.5×10¹⁴ Hz. Find h and φ.","latex":"","isFinal":False},
    {"text":"Slope = h","latex":"h = 6.5\\times10^{-34}\\text{ J·s} \\approx 6.63\\times10^{-34}\\text{ J·s}","isFinal":False},
    {"text":"Work function φ = hf₀ = 6.5×10⁻³⁴ × 5.5×10¹⁴","latex":"\\phi = 3.575\\times10^{-19}\\text{ J} = 2.23\\text{ eV}","isFinal":True}
  ]},
  {"title":"Photon Momentum","steps":[
    {"text":"Find the momentum of a photon of λ = 400 nm visible light.","latex":"","isFinal":False},
    {"text":"p = h/λ","latex":"p = \\frac{6.626\\times10^{-34}}{400\\times10^{-9}} = 1.657\\times10^{-27}\\text{ kg·m/s}","isFinal":True}
  ]},
  {"title":"Number of Photons per Second","steps":[
    {"text":"A 10 mW laser at λ = 500 nm. Find photons emitted per second.","latex":"","isFinal":False},
    {"text":"Energy per photon E = hc/λ = 1240/500 eV = 2.48 eV = 3.97×10⁻¹⁹ J","latex":"E_{photon} = 3.97\\times10^{-19}\\text{ J}","isFinal":False},
    {"text":"N/t = P/E_photon","latex":"\\frac{N}{t} = \\frac{0.01}{3.97\\times10^{-19}} = 2.52\\times10^{16}\\text{ photons/s}","isFinal":True}
  ]},
  {"title":"Compton Scattering","steps":[
    {"text":"X-ray (λ₀ = 0.1 nm) scatters off an electron at θ = 90°. Find the wavelength shift.","latex":"","isFinal":False},
    {"text":"Compton shift: Δλ = (h/m_e c)(1 − cosθ)","latex":"\\Delta\\lambda = \\frac{6.626\\times10^{-34}}{9.11\\times10^{-31} \\times 3\\times10^8}(1 - \\cos 90°) = 2.426\\times10^{-12} \\times 1 = 2.43\\text{ pm}","isFinal":True}
  ]}
],

"wave-particle-duality": [
  {"title":"de Broglie Wavelength of an Electron","steps":[
    {"text":"An electron (m = 9.11×10⁻³¹ kg) moves at 2×10⁶ m/s. Find its de Broglie wavelength.","latex":"","isFinal":False},
    {"text":"λ = h/mv","latex":"\\lambda = \\frac{6.626\\times10^{-34}}{9.11\\times10^{-31} \\times 2\\times10^6} = \\frac{6.626\\times10^{-34}}{1.822\\times10^{-24}} = 3.64\\times10^{-10}\\text{ m} = 0.364\\text{ nm}","isFinal":True}
  ]},
  {"title":"de Broglie Wavelength of a Ball","steps":[
    {"text":"A 0.1 kg cricket ball moves at 30 m/s. Find its de Broglie wavelength.","latex":"","isFinal":False},
    {"text":"λ = h/(mv)","latex":"\\lambda = \\frac{6.626\\times10^{-34}}{0.1 \\times 30} = \\frac{6.626\\times10^{-34}}{3} = 2.21\\times10^{-34}\\text{ m}","isFinal":False},
    {"text":"This wavelength is far smaller than any physical object — wave effects are completely undetectable for macroscopic objects.","latex":"","isFinal":True}
  ]},
  {"title":"Electron Diffraction","steps":[
    {"text":"Electrons with λ = 0.15 nm are diffracted from crystal planes (d = 0.2 nm). Find the first-order Bragg angle.","latex":"","isFinal":False},
    {"text":"Bragg's Law: 2d sinθ = mλ","latex":"\\sin\\theta = \\frac{\\lambda}{2d} = \\frac{0.15}{2 \\times 0.2} = 0.375","isFinal":False},
    {"text":"","latex":"\\theta = \\arcsin(0.375) \\approx 22.0°","isFinal":True}
  ]},
  {"title":"Heisenberg Uncertainty — Position and Momentum","steps":[
    {"text":"An electron is confined to a region Δx = 0.1 nm. Find the minimum uncertainty in its momentum.","latex":"","isFinal":False},
    {"text":"Heisenberg: ΔxΔp ≥ ℏ/2","latex":"\\Delta p \\geq \\frac{\\hbar}{2\\Delta x} = \\frac{1.055\\times10^{-34}}{2 \\times 10^{-10}} = 5.28\\times10^{-25}\\text{ kg·m/s}","isFinal":True}
  ]},
  {"title":"Heisenberg — Energy and Time","steps":[
    {"text":"An excited state has lifetime Δt = 1 ns. Find the energy uncertainty.","latex":"","isFinal":False},
    {"text":"ΔEΔt ≥ ℏ/2","latex":"\\Delta E \\geq \\frac{\\hbar}{2\\Delta t} = \\frac{1.055\\times10^{-34}}{2 \\times 10^{-9}} = 5.28\\times10^{-26}\\text{ J} = 3.3\\times10^{-7}\\text{ eV}","isFinal":True}
  ]},
  {"title":"Davisson-Germer Experiment","steps":[
    {"text":"Electrons (54 eV) are reflected from Ni crystal (d = 0.215 nm). Find their de Broglie λ and verify the first diffraction peak.","latex":"","isFinal":False},
    {"text":"KE = 54 eV = 8.64×10⁻¹⁸ J; p = √(2mKE)","latex":"p = \\sqrt{2 \\times 9.11\\times10^{-31} \\times 8.64\\times10^{-18}} = \\sqrt{1.575\\times10^{-47}} = 3.97\\times10^{-24}\\text{ kg·m/s}","isFinal":False},
    {"text":"λ = h/p = 6.626×10⁻³⁴ / 3.97×10⁻²⁴ ≈ 0.167 nm; Bragg: sinθ = λ/(2d) → θ ≈ 23°","latex":"\\lambda \\approx 0.167\\text{ nm} \\Rightarrow \\theta \\approx 23°\\checkmark\\text{(observed at 50° incidence)}","isFinal":True}
  ]},
  {"title":"Wavelength from Accelerating Voltage","steps":[
    {"text":"Electrons are accelerated through V = 100 V. Find their de Broglie wavelength.","latex":"","isFinal":False},
    {"text":"KE = eV; p = √(2meV)","latex":"p = \\sqrt{2 \\times 9.11\\times10^{-31} \\times 1.6\\times10^{-19} \\times 100} = \\sqrt{2.916\\times10^{-47}} = 1.708\\times10^{-23.5}\\text{ kg·m/s}","isFinal":False},
    {"text":"λ = h/p = 6.626×10⁻³⁴ / (1.71×10⁻²³·⁵) ≈ 0.123 nm","latex":"\\lambda = \\frac{h}{\\sqrt{2m_e eV}} = \\frac{1.226}{\\sqrt{V}}\\text{ nm} = \\frac{1.226}{\\sqrt{100}} = 0.123\\text{ nm}","isFinal":True}
  ]},
  {"title":"Complementarity Principle","steps":[
    {"text":"In a double-slit experiment, a detector is placed at one slit to determine which slit the electron passes through. What happens to the interference pattern?","latex":"","isFinal":False},
    {"text":"Observing which slit is used collapses the wave function — the electron is forced to behave as a particle.","latex":"","isFinal":False},
    {"text":"The interference pattern disappears! Wave and particle behaviours are complementary — you cannot observe both simultaneously (Bohr's Complementarity Principle).","latex":"","isFinal":True}
  ]},
  {"title":"Zero-Point Energy","steps":[
    {"text":"An electron is confined in a 1D box of width L = 1 nm. Find its ground state (zero-point) energy.","latex":"","isFinal":False},
    {"text":"E₁ = h²/(8mL²)","latex":"E_1 = \\frac{(6.626\\times10^{-34})^2}{8 \\times 9.11\\times10^{-31} \\times (10^{-9})^2} = \\frac{4.39\\times10^{-67}}{7.29\\times10^{-48}} = 6.02\\times10^{-20}\\text{ J} = 0.376\\text{ eV}","isFinal":True}
  ]},
  {"title":"Photon vs Electron Wavelength","steps":[
    {"text":"Compare the de Broglie wavelength of a 100 eV electron to a 100 eV photon.","latex":"","isFinal":False},
    {"text":"Photon: λ = hc/E = 1240 eV·nm / 100 eV = 12.4 nm (X-ray range)","latex":"\\lambda_{photon} = 12.4\\text{ nm}","isFinal":False},
    {"text":"Electron: λ = 1.226/√(100) ≈ 0.123 nm (hard X-ray / crystal spacing)","latex":"\\lambda_{electron} = 0.123\\text{ nm}\\quad(\\sim 100\\times\\text{ shorter than photon at same energy})","isFinal":True}
  ]}
],

"energy-levels": [
  {"title":"Hydrogen Energy Levels","steps":[
    {"text":"Find the energy of the n=3 level in hydrogen. (E₁ = −13.6 eV)","latex":"","isFinal":False},
    {"text":"E_n = E₁/n²","latex":"E_3 = \\frac{-13.6}{3^2} = \\frac{-13.6}{9} = -1.51\\text{ eV}","isFinal":True}
  ]},
  {"title":"Photon Wavelength from Transition","steps":[
    {"text":"Hydrogen: n=4 → n=2 transition. Find photon wavelength (Balmer series).","latex":"","isFinal":False},
    {"text":"E₄ = −13.6/16 = −0.85 eV; E₂ = −13.6/4 = −3.4 eV","latex":"\\Delta E = E_4 - E_2 = -0.85 - (-3.4) = 2.55\\text{ eV}","isFinal":False},
    {"text":"λ = hc/ΔE = 1240/2.55 nm","latex":"\\lambda = \\frac{1240}{2.55} \\approx 486\\text{ nm (blue-green, H-β)}","isFinal":True}
  ]},
  {"title":"Ionisation Energy","steps":[
    {"text":"Find the minimum energy needed to ionise a hydrogen atom in its ground state.","latex":"","isFinal":False},
    {"text":"Ionisation means removing electron to n = ∞ (E = 0)","latex":"E_{ionisation} = 0 - E_1 = 0 - (-13.6) = 13.6\\text{ eV}","isFinal":True}
  ]},
  {"title":"Bohr Radius","steps":[
    {"text":"Find the radius of the n=2 orbit in hydrogen. (a₀ = 0.0529 nm)","latex":"","isFinal":False},
    {"text":"r_n = n² a₀","latex":"r_2 = 4 \\times 0.0529 = 0.212\\text{ nm}","isFinal":True}
  ]},
  {"title":"Lyman vs Balmer Series","steps":[
    {"text":"The n=2→1 Lyman transition emits a photon. Find its wavelength. Compare to the n=3→2 Balmer line.","latex":"","isFinal":False},
    {"text":"ΔE(2→1) = −3.4 − (−13.6) = 10.2 eV; λ = 1240/10.2 = 121.6 nm (UV)","latex":"\\lambda_{Lyman} = 121.6\\text{ nm (UV)}","isFinal":False},
    {"text":"ΔE(3→2) = −1.51 − (−3.4) = 1.89 eV; λ = 1240/1.89 = 656 nm (red)","latex":"\\lambda_{Balmer} = 656\\text{ nm (visible red, H-α)}","isFinal":True}
  ]},
  {"title":"Energy Level Diagram","steps":[
    {"text":"Draw a schematic of hydrogen energy levels. How many photon energies are possible from n=4?","steps":[
    {"text":"Energy levels n=1 to 4: −13.6, −3.4, −1.51, −0.85 eV","latex":"E_n = \\frac{-13.6}{n^2}\\text{ eV}","isFinal":False},
    {"text":"Possible transitions from n=4: 4→1, 4→2, 4→3; from n=3: 3→1, 3→2; from n=2: 2→1","latex":"","isFinal":False},
    {"text":"Total distinct transitions (and photon energies) from n=4 downward: 4+3+2+1 = 6 lines","latex":"N = \\frac{n(n-1)}{2} = \\frac{4 \\times 3}{2} = 6","isFinal":True}
  ]}]},
  {"title":"X-Ray Emission","steps":[
    {"text":"An electron bombards a copper atom, knocking out a K-shell electron. The L→K transition emits a Kα X-ray. If ΔE = 8040 eV, find λ.","latex":"","isFinal":False},
    {"text":"λ = hc/ΔE = 1240 eV·nm / 8040 eV","latex":"\\lambda = \\frac{1240}{8040} \\approx 0.154\\text{ nm} = 154\\text{ pm (Cu Kα characteristic X-ray)}","isFinal":True}
  ]},
  {"title":"Absorption vs Emission Spectra","steps":[
    {"text":"Explain why absorption and emission spectra for the same element have lines at the same wavelengths but appear as dark vs bright lines.","latex":"","isFinal":False},
    {"text":"Emission: excited atoms drop to lower levels, emitting photons of specific ΔE = hf → bright lines.","latex":"","isFinal":False},
    {"text":"Absorption: white light passes through cool gas; photons matching ΔE are absorbed (exciting atoms) → dark lines at same λ. Same transitions, opposite direction.","latex":"","isFinal":True}
  ]},
  {"title":"Franck-Hertz Experiment","steps":[
    {"text":"In the Franck-Hertz experiment with mercury, current drops sharply at V = 4.9 eV. What does this indicate?","latex":"","isFinal":False},
    {"text":"Electrons with exactly 4.9 eV transfer all energy to Hg atoms in inelastic collisions, exciting them to the first excited state.","latex":"\\Delta E_1 = 4.9\\text{ eV (first excited state of Hg)}","isFinal":False},
    {"text":"Electrons lose all KE → current drops. This confirmed discrete atomic energy levels experimentally.","latex":"\\lambda = \\frac{1240}{4.9} \\approx 253\\text{ nm (UV, observed from Hg)}","isFinal":True}
  ]},
  {"title":"Energy Level Spacing in a Box","steps":[
    {"text":"An electron in a 0.2 nm box (particle-in-a-box). Find the energy difference E₂ − E₁.","latex":"","isFinal":False},
    {"text":"E_n = n²h²/(8mL²)","latex":"E_1 = \\frac{h^2}{8m_e L^2} = \\frac{(6.626\\times10^{-34})^2}{8 \\times 9.11\\times10^{-31} \\times (2\\times10^{-10})^2} = 1.505\\times10^{-18}\\text{ J} = 9.4\\text{ eV}","isFinal":False},
    {"text":"E₂ = 4E₁ = 37.6 eV; ΔE = E₂ − E₁ = 3E₁ = 28.2 eV","latex":"\\Delta E = 3E_1 = 28.2\\text{ eV}","isFinal":True}
  ]}
],

"radioactive-decay": [
  {"title":"Activity from Decay Constant","steps":[
    {"text":"A radioactive sample has N = 10¹⁵ atoms and λ = 2×10⁻⁵ s⁻¹. Find the activity.","latex":"","isFinal":False},
    {"text":"A = λN","latex":"A = 2\\times10^{-5} \\times 10^{15} = 10^{10}\\text{ decays/s} = 10\\text{ GBq}","isFinal":True}
  ]},
  {"title":"Half-Life","steps":[
    {"text":"A nucleus has λ = 0.05 s⁻¹. Find its half-life.","latex":"","isFinal":False},
    {"text":"t₁/₂ = ln2/λ = 0.693/λ","latex":"t_{1/2} = \\frac{0.693}{0.05} = 13.86\\text{ s}","isFinal":True}
  ]},
  {"title":"Remaining Activity After Time","steps":[
    {"text":"A sample (t₁/₂ = 8 days) has initial activity 1000 Bq. Find activity after 24 days.","latex":"","isFinal":False},
    {"text":"Number of half-lives: 24/8 = 3","latex":"A = A_0 \\times \\left(\\frac{1}{2}\\right)^3 = 1000 \\times \\frac{1}{8} = 125\\text{ Bq}","isFinal":True}
  ]},
  {"title":"Exponential Decay","steps":[
    {"text":"N₀ = 10⁶ atoms, λ = 0.1 s⁻¹. Find N after 20 s.","latex":"","isFinal":False},
    {"text":"N(t) = N₀ e^{−λt}","latex":"N = 10^6 \\times e^{-0.1 \\times 20} = 10^6 \\times e^{-2} = 10^6 \\times 0.1353 = 1.353\\times10^5\\text{ atoms}","isFinal":True}
  ]},
  {"title":"Alpha Decay — Identifying Product","steps":[
    {"text":"Radium-226 undergoes alpha decay. Identify the daughter nucleus.","latex":"","isFinal":False},
    {"text":"Alpha particle: ⁴₂He. Subtract from Ra-226 (Z=88, A=226)","latex":"^{226}_{88}\\text{Ra} \\to ^{222}_{86}\\text{Rn} + ^4_2\\text{He}","isFinal":False},
    {"text":"Daughter is Radon-222 (Rn, Z=86).","latex":"","isFinal":True}
  ]},
  {"title":"Beta Decay","steps":[
    {"text":"Carbon-14 undergoes beta-minus decay. Write the decay equation.","latex":"","isFinal":False},
    {"text":"Beta-minus: neutron → proton, emitting electron and antineutrino","latex":"^{14}_{6}\\text{C} \\to ^{14}_{7}\\text{N} + e^- + \\bar{\\nu}_e","isFinal":True}
  ]},
  {"title":"Radiocarbon Dating","steps":[
    {"text":"A sample has 25% of the original C-14. t₁/₂(C-14) = 5730 years. Find its age.","latex":"","isFinal":False},
    {"text":"25% = (½)²: 2 half-lives have passed","latex":"t = 2 \\times 5730 = 11\\,460\\text{ years}","isFinal":True}
  ]},
  {"title":"Gamma Decay","steps":[
    {"text":"After alpha decay, Thorium-234 is in an excited state. It emits a gamma ray of 0.063 MeV. Find the photon wavelength.","latex":"","isFinal":False},
    {"text":"λ = hc/E = 1240 eV·nm / (0.063×10⁶ eV)","latex":"\\lambda = \\frac{1240}{63000} \\approx 0.01968\\text{ nm} = 19.7\\text{ pm (gamma ray)}","isFinal":True}
  ]},
  {"title":"Decay Constant from Half-Life","steps":[
    {"text":"Iodine-131 has t₁/₂ = 8.02 days. Find the decay constant λ.","latex":"","isFinal":False},
    {"text":"λ = ln2/t₁/₂ = 0.693/(8.02 × 86400 s)","latex":"\\lambda = \\frac{0.693}{8.02 \\times 86400} = \\frac{0.693}{6.93\\times10^5} = 10^{-6}\\text{ s}^{-1}","isFinal":True}
  ]},
  {"title":"Nuclear Equation Balancing","steps":[
    {"text":"Complete: ²³⁵U + n → ¹⁴¹Ba + ? + 3n","latex":"","isFinal":False},
    {"text":"Conserve mass number: 235+1 = 141 + A + 3×1 → A = 236−144 = 92","latex":"A = 236 - 141 - 3 = 92", "isFinal":False},
    {"text":"Conserve atomic number: 92+0 = 56 + Z + 0 → Z = 36 (Krypton)","latex":"^{235}_{92}\\text{U} + n \\to ^{141}_{56}\\text{Ba} + ^{92}_{36}\\text{Kr} + 3n","isFinal":True}
  ]}
]

}

# Fix the energy-levels example 6 which has a nested steps issue
examples["energy-levels"][5] = {
  "title":"Transitions from n=4 — Counting Lines",
  "steps":[
    {"text":"How many distinct spectral lines can be produced by transitions from n=4 down to n=1 in hydrogen?","latex":"","isFinal":False},
    {"text":"Possible transitions: 4→3, 4→2, 4→1, 3→2, 3→1, 2→1","latex":"","isFinal":False},
    {"text":"Total = n(n−1)/2 for n levels","latex":"N = \\frac{4 \\times 3}{2} = 6\\text{ distinct lines}","isFinal":True}
  ]
}

for slug, exs in examples.items():
    if slug in data:
        data[slug]['workedExamples'] = exs
        print(f"{slug}: {len(exs)} examples")
    else:
        print(f"WARNING: slug '{slug}' not found")

p.write_text(json.dumps(data, indent=2, ensure_ascii=False))
print("Done. Validating...")
json.loads(p.read_text())
print("JSON valid.")
