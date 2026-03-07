#!/usr/bin/env python3
"""Batch 4: orbital-mechanics, escape-velocity, springs-hookes-law,
pendulums, resonance, wave-properties, superposition, standing-waves"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"orbital-mechanics": [
  {"title":"Orbital Speed from Radius","steps":[
    {"text":"Find the orbital speed of a satellite at r = 7000 km from Earth's centre (M_E = 5.97×10²⁴ kg).","latex":"","isFinal":False},
    {"text":"Balance gravity and centripetal force: v = √(GM/r)","latex":"v = \\sqrt{\\frac{6.67\\times10^{-11} \\times 5.97\\times10^{24}}{7\\times10^6}}","isFinal":False},
    {"text":"Calculate","latex":"v = \\sqrt{\\frac{3.98\\times10^{14}}{7\\times10^6}} = \\sqrt{5.69\\times10^7} \\approx 7540\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Geostationary Orbit Radius","steps":[
    {"text":"Find the radius of a geostationary orbit (T = 24 h = 86 400 s, M_E = 5.97×10²⁴ kg).","latex":"","isFinal":False},
    {"text":"From T² = 4π²r³/GM → r³ = GMT²/(4π²)","latex":"r^3 = \\frac{6.67\\times10^{-11} \\times 5.97\\times10^{24} \\times (86400)^2}{4\\pi^2}","isFinal":False},
    {"text":"Calculate r","latex":"r = \\left(7.54\\times10^{22}\\right)^{1/3} \\approx 4.22\\times10^7\\text{ m} = 42\\,200\\text{ km}","isFinal":True}
  ]},
  {"title":"Kepler's Third Law for Moons","steps":[
    {"text":"Moon A orbits at 4×10⁸ m with period 12 days. Moon B orbits at 6×10⁸ m. Find Moon B's period.","latex":"","isFinal":False},
    {"text":"T² ∝ r³","latex":"\\frac{T_B^2}{T_A^2} = \\frac{r_B^3}{r_A^3} = \\left(\\frac{6}{4}\\right)^3 = 3.375","isFinal":False},
    {"text":"Solve","latex":"T_B = 12\\sqrt{3.375} \\approx 12 \\times 1.837 \\approx 22\\text{ days}","isFinal":True}
  ]},
  {"title":"Orbital Energy","steps":[
    {"text":"Find the total mechanical energy of a 500 kg satellite at r = 8×10⁶ m from Earth's centre.","latex":"","isFinal":False},
    {"text":"Total orbital energy E = −GMm/(2r)","latex":"E = -\\frac{6.67\\times10^{-11} \\times 5.97\\times10^{24} \\times 500}{2 \\times 8\\times10^6}","isFinal":False},
    {"text":"Calculate","latex":"E = -\\frac{1.99\\times10^{17}}{1.6\\times10^7} \\approx -1.24\\times10^{10}\\text{ J}","isFinal":True}
  ]},
  {"title":"Transfer Orbit (Hohmann)","steps":[
    {"text":"A spacecraft moves from circular orbit r₁ = 7000 km to r₂ = 42 000 km. Find the semi-major axis of the transfer ellipse.","latex":"","isFinal":False},
    {"text":"Semi-major axis of Hohmann transfer ellipse","latex":"a = \\frac{r_1 + r_2}{2} = \\frac{7000 + 42000}{2} = 24\\,500\\text{ km}","isFinal":True}
  ]},
  {"title":"Orbital Period at New Height","steps":[
    {"text":"A satellite in a 400 km altitude orbit. Find its period. (R_E = 6370 km, M_E = 5.97×10²⁴ kg)","latex":"","isFinal":False},
    {"text":"r = 6370 + 400 = 6770 km = 6.77×10⁶ m","latex":"","isFinal":False},
    {"text":"T = 2π√(r³/GM)","latex":"T = 2\\pi\\sqrt{\\frac{(6.77\\times10^6)^3}{3.98\\times10^{14}}} \\approx 2\\pi \\times 924 \\approx 5806\\text{ s} \\approx 96.8\\text{ min}","isFinal":True}
  ]},
  {"title":"Gravitational Assist — Slingshot","steps":[
    {"text":"Explain qualitatively how a gravitational slingshot increases spacecraft speed.","latex":"","isFinal":False},
    {"text":"The spacecraft falls toward the planet (gaining KE), swings around, and rises on the other side. In the planet's reference frame, speed is unchanged.","latex":"","isFinal":False},
    {"text":"In the Sun's reference frame, the spacecraft inherits the planet's orbital velocity component — net gain in heliocentric speed.","latex":"\\Delta v \\approx 2 v_{planet} \\sin(\\theta/2)\\text{ (maximum)}","isFinal":True}
  ]},
  {"title":"Elliptical Orbit — Periapsis Speed","steps":[
    {"text":"For an elliptical orbit with semi-major axis a = 10 000 km and periapsis r_p = 7000 km, find speed at periapsis. (M_E = 5.97×10²⁴ kg)","latex":"","isFinal":False},
    {"text":"Vis-viva equation: v² = GM(2/r − 1/a)","latex":"v_p^2 = \\frac{3.98\\times10^{14}\\left(\\frac{2}{7\\times10^6} - \\frac{1}{10^7}\\right)}{1}","isFinal":False},
    {"text":"Calculate","latex":"v_p = \\sqrt{3.98\\times10^{14}(2.857-1)\\times10^{-7}} = \\sqrt{7.39\\times10^7} \\approx 8595\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Satellite Weightlessness","steps":[
    {"text":"Why do astronauts feel weightless in orbit even though gravity still acts on them?","latex":"","isFinal":False},
    {"text":"The satellite is in free fall — both the astronaut and the spacecraft fall together with the same acceleration g(r).","latex":"","isFinal":False},
    {"text":"There is no normal force between the astronaut and the floor → apparent weight = 0 (weightlessness).","latex":"N = m(g - g_{orbit}) = 0\\text{ (both in free fall)}","isFinal":True}
  ]},
  {"title":"Mass of Planet from Orbital Data","steps":[
    {"text":"A moon orbits at r = 5×10⁸ m with period T = 2.0×10⁶ s. Find the planet's mass.","latex":"","isFinal":False},
    {"text":"From T² = 4π²r³/(GM_planet)","latex":"M = \\frac{4\\pi^2 r^3}{G T^2} = \\frac{4\\pi^2 \\times (5\\times10^8)^3}{6.67\\times10^{-11} \\times (2\\times10^6)^2}","isFinal":False},
    {"text":"Calculate","latex":"M = \\frac{4.93\\times10^{28}}{2.67\\times10^2} \\approx 1.85\\times10^{26}\\text{ kg}","isFinal":True}
  ]}
],

"escape-velocity": [
  {"title":"Escape Velocity from Earth","steps":[
    {"text":"Find Earth's escape velocity. (M_E = 5.97×10²⁴ kg, R_E = 6.37×10⁶ m)","latex":"","isFinal":False},
    {"text":"Set KE = |gravitational PE|","latex":"\\frac{1}{2}mv_{esc}^2 = \\frac{GMm}{R}","isFinal":False},
    {"text":"Solve","latex":"v_{esc} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{\\frac{2 \\times 3.98\\times10^{14}}{6.37\\times10^6}} \\approx 11\\,200\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Escape Velocity from the Moon","steps":[
    {"text":"Find Moon's escape velocity. (M_M = 7.34×10²² kg, R_M = 1.74×10⁶ m)","latex":"","isFinal":False},
    {"text":"","latex":"v_{esc} = \\sqrt{\\frac{2GM_M}{R_M}} = \\sqrt{\\frac{2 \\times 6.67\\times10^{-11} \\times 7.34\\times10^{22}}{1.74\\times10^6}}","isFinal":False},
    {"text":"Calculate","latex":"v_{esc} = \\sqrt{\\frac{9.79\\times10^{12}}{1.74\\times10^6}} = \\sqrt{5.63\\times10^6} \\approx 2370\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Comparing Escape Velocities","steps":[
    {"text":"Planet X has twice Earth's mass and twice Earth's radius. How does its escape velocity compare to Earth's?","latex":"","isFinal":False},
    {"text":"v_esc ∝ √(M/R)","latex":"\\frac{v_X}{v_E} = \\sqrt{\\frac{M_X/R_X}{M_E/R_E}} = \\sqrt{\\frac{2M_E/2R_E}{M_E/R_E}} = \\sqrt{1} = 1","isFinal":False},
    {"text":"Same escape velocity as Earth.","latex":"v_X = v_E = 11.2\\text{ km/s}","isFinal":True}
  ]},
  {"title":"Black Hole Radius (Schwarzschild)","steps":[
    {"text":"Find the Schwarzschild radius of a black hole with mass equal to the Sun (M = 1.99×10³⁰ kg). Set escape velocity = c = 3×10⁸ m/s.","latex":"","isFinal":False},
    {"text":"v_esc = c → ½mc² = GMm/R_s","latex":"R_s = \\frac{2GM}{c^2}","isFinal":False},
    {"text":"Calculate","latex":"R_s = \\frac{2 \\times 6.67\\times10^{-11} \\times 1.99\\times10^{30}}{(3\\times10^8)^2} = \\frac{2.65\\times10^{20}}{9\\times10^{16}} \\approx 2950\\text{ m} \\approx 3\\text{ km}","isFinal":True}
  ]},
  {"title":"Speed After Falling From Infinity","steps":[
    {"text":"An object falls from infinity to Earth's surface. Find its speed on arrival. (This is just escape velocity reversed.)","latex":"","isFinal":False},
    {"text":"By energy conservation (start from rest at infinity)","latex":"\\frac{1}{2}v^2 = \\frac{GM}{R}","isFinal":False},
    {"text":"v = escape velocity = 11.2 km/s","latex":"v = v_{esc} \\approx 11200\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Escape Velocity vs Orbital Speed","steps":[
    {"text":"Show that escape velocity is √2 times the circular orbital speed at the same radius.","latex":"","isFinal":False},
    {"text":"Orbital speed: v_orb = √(GM/r); Escape speed: v_esc = √(2GM/r)","latex":"","isFinal":False},
    {"text":"Ratio","latex":"\\frac{v_{esc}}{v_{orb}} = \\frac{\\sqrt{2GM/r}}{\\sqrt{GM/r}} = \\sqrt{2} \\approx 1.414","isFinal":True}
  ]},
  {"title":"Energy at Escape","steps":[
    {"text":"A 1000 kg spacecraft launches from Earth at escape velocity. What is its total mechanical energy?","latex":"","isFinal":False},
    {"text":"At escape velocity, the spacecraft reaches infinity with v = 0, so total energy = 0","latex":"E = KE + PE = \\frac{1}{2}mv_{esc}^2 - \\frac{GMm}{R} = 0","isFinal":True}
  ]},
  {"title":"Projectile Launched to Half Earth's Radius","steps":[
    {"text":"A projectile is launched vertically from Earth. It reaches a maximum height of R_E/2. Find the launch speed.","latex":"","isFinal":False},
    {"text":"Energy conservation (start at R_E, end at R_E + R_E/2 = 1.5 R_E)","latex":"\\frac{1}{2}mv^2 - \\frac{GMm}{R_E} = 0 - \\frac{GMm}{1.5R_E}","isFinal":False},
    {"text":"Solve","latex":"v = \\sqrt{\\frac{2GM}{R_E}\\left(1 - \\frac{1}{1.5}\\right)} = \\sqrt{\\frac{2gR_E}{3}} = \\sqrt{\\frac{2 \\times 9.8 \\times 6.37\\times10^6}{3}} \\approx 6470\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Escape Velocity at High Altitude","steps":[
    {"text":"Find escape velocity from a point 2 R_E above Earth's surface (i.e., at r = 3 R_E).","latex":"","isFinal":False},
    {"text":"v_esc(r) = √(2GM/r)","latex":"v_{esc} = \\sqrt{\\frac{2GM}{3R_E}} = \\frac{v_{esc,surface}}{\\sqrt{3}} = \\frac{11200}{\\sqrt{3}} \\approx 6470\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Gas Escape from Planetary Atmosphere","steps":[
    {"text":"Why does the Moon have no atmosphere while Earth does?","latex":"","isFinal":False},
    {"text":"Escape velocity from Moon ≈ 2.4 km/s; typical thermal speed of molecules at 300 K ≈ 0.5 km/s.","latex":"","isFinal":False},
    {"text":"Earth v_esc = 11.2 km/s >> thermal speed, so atmosphere is retained. Moon v_esc is only ~5× thermal speed, and some molecules escape — over time all gas is lost.","latex":"v_{esc,Moon} \\approx 2.4\\text{ km/s}\\quad v_{thermal} \\approx 0.5\\text{ km/s}","isFinal":True}
  ]}
],

"springs-hookes-law": [
  {"title":"Force from Extension","steps":[
    {"text":"A spring with k = 200 N/m is stretched 0.05 m. Find the restoring force.","latex":"","isFinal":False},
    {"text":"Hooke's Law: F = kx","latex":"F = 200 \\times 0.05 = 10\\text{ N}","isFinal":True}
  ]},
  {"title":"Finding Spring Constant","steps":[
    {"text":"A 4 kg mass stretches a spring by 8 cm. Find the spring constant.","latex":"","isFinal":False},
    {"text":"At equilibrium: kx = mg","latex":"k = \\frac{mg}{x} = \\frac{4 \\times 9.8}{0.08} = \\frac{39.2}{0.08} = 490\\text{ N/m}","isFinal":True}
  ]},
  {"title":"Elastic Potential Energy","steps":[
    {"text":"A spring (k = 500 N/m) is compressed 0.12 m. Find the stored elastic PE.","latex":"","isFinal":False},
    {"text":"PE_spring = ½kx²","latex":"PE = \\frac{1}{2} \\times 500 \\times (0.12)^2 = 250 \\times 0.0144 = 3.6\\text{ J}","isFinal":True}
  ]},
  {"title":"Spring Launcher — Finding Launch Speed","steps":[
    {"text":"A spring (k = 800 N/m) compressed 0.1 m launches a 0.2 kg ball horizontally. Find launch speed (frictionless surface).","latex":"","isFinal":False},
    {"text":"All spring PE → KE","latex":"\\frac{1}{2}kx^2 = \\frac{1}{2}mv^2","isFinal":False},
    {"text":"Solve for v","latex":"v = x\\sqrt{\\frac{k}{m}} = 0.1\\sqrt{\\frac{800}{0.2}} = 0.1 \\times 63.2 = 6.32\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Springs in Series","steps":[
    {"text":"Two springs (k₁ = 100 N/m, k₂ = 200 N/m) are connected in series. Find the effective spring constant.","latex":"","isFinal":False},
    {"text":"For springs in series: 1/k_eff = 1/k₁ + 1/k₂","latex":"\\frac{1}{k_{eff}} = \\frac{1}{100} + \\frac{1}{200} = \\frac{3}{200}","isFinal":False},
    {"text":"k_eff","latex":"k_{eff} = \\frac{200}{3} \\approx 66.7\\text{ N/m}","isFinal":True}
  ]},
  {"title":"Springs in Parallel","steps":[
    {"text":"Two springs (k₁ = 150 N/m, k₂ = 250 N/m) support a mass in parallel. Find effective k.","latex":"","isFinal":False},
    {"text":"For parallel springs: k_eff = k₁ + k₂","latex":"k_{eff} = 150 + 250 = 400\\text{ N/m}","isFinal":True}
  ]},
  {"title":"Work Done Stretching a Spring","steps":[
    {"text":"How much work is done stretching a spring (k = 300 N/m) from x = 0 to x = 0.2 m?","latex":"","isFinal":False},
    {"text":"Work = area under F–x graph = ½kx²","latex":"W = \\frac{1}{2} \\times 300 \\times (0.2)^2 = \\frac{1}{2} \\times 300 \\times 0.04 = 6\\text{ J}","isFinal":True}
  ]},
  {"title":"Maximum Compression","steps":[
    {"text":"A 2 kg block moving at 5 m/s compresses a spring (k = 1000 N/m). Find maximum compression.","latex":"","isFinal":False},
    {"text":"All KE → spring PE","latex":"\\frac{1}{2}mv^2 = \\frac{1}{2}kx^2","isFinal":False},
    {"text":"Solve for x","latex":"x = v\\sqrt{\\frac{m}{k}} = 5\\sqrt{\\frac{2}{1000}} = 5 \\times 0.0447 = 0.224\\text{ m}","isFinal":True}
  ]},
  {"title":"Period of Spring–Mass System","steps":[
    {"text":"A 0.5 kg mass on a spring (k = 200 N/m) oscillates. Find the period.","latex":"","isFinal":False},
    {"text":"T = 2π√(m/k)","latex":"T = 2\\pi\\sqrt{\\frac{0.5}{200}} = 2\\pi \\times 0.05 = 0.314\\text{ s}","isFinal":True}
  ]},
  {"title":"Extension Under Own Weight","steps":[
    {"text":"A 3 kg mass hangs from a spring (k = 600 N/m). Find extension at equilibrium.","latex":"","isFinal":False},
    {"text":"At equilibrium: kx = mg","latex":"x = \\frac{mg}{k} = \\frac{3 \\times 9.8}{600} = \\frac{29.4}{600} = 0.049\\text{ m} = 4.9\\text{ cm}","isFinal":True}
  ]}
],

"pendulums": [
  {"title":"Period of a Simple Pendulum","steps":[
    {"text":"A pendulum has length 1.5 m. Find its period (g = 9.8 m/s²).","latex":"","isFinal":False},
    {"text":"T = 2π√(L/g)","latex":"T = 2\\pi\\sqrt{\\frac{1.5}{9.8}} = 2\\pi \\times 0.391 = 2.46\\text{ s}","isFinal":True}
  ]},
  {"title":"Finding Length from Period","steps":[
    {"text":"A pendulum has a period of 3 s on Earth. Find its length.","latex":"","isFinal":False},
    {"text":"Rearrange T = 2π√(L/g) for L","latex":"L = g\\left(\\frac{T}{2\\pi}\\right)^2 = 9.8 \\times \\left(\\frac{3}{2\\pi}\\right)^2 = 9.8 \\times 0.228 = 2.24\\text{ m}","isFinal":True}
  ]},
  {"title":"Pendulum on the Moon","steps":[
    {"text":"A 1 m pendulum on Earth has T = 2.0 s. Find its period on the Moon (g_M = 1.6 m/s²).","latex":"","isFinal":False},
    {"text":"T ∝ 1/√g","latex":"T_{Moon} = 2\\pi\\sqrt{\\frac{1}{1.6}} = 2\\pi \\times 0.791 = 4.97\\text{ s}","isFinal":True}
  ]},
  {"title":"Maximum Speed of Pendulum Bob","steps":[
    {"text":"A pendulum (L = 0.8 m) is released from 10° amplitude. Find the maximum speed at the bottom.","latex":"","isFinal":False},
    {"text":"Height gained: h = L(1 − cosθ) = 0.8(1 − cos10°) = 0.8 × 0.01519 = 0.01215 m","latex":"h = L(1-\\cos\\theta) = 0.01215\\text{ m}","isFinal":False},
    {"text":"Energy conservation: ½mv² = mgh","latex":"v = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times 0.01215} \\approx 0.488\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Does Period Depend on Mass?","steps":[
    {"text":"Two pendulums: same length 1 m, masses 0.5 kg and 2 kg. Find both periods.","latex":"","isFinal":False},
    {"text":"T = 2π√(L/g) — mass does NOT appear","latex":"T_1 = T_2 = 2\\pi\\sqrt{\\frac{1}{9.8}} = 2\\pi \\times 0.319 = 2.0\\text{ s}","isFinal":False},
    {"text":"Both pendulums have identical periods — period is independent of mass.","latex":"","isFinal":True}
  ]},
  {"title":"Measuring g with a Pendulum","steps":[
    {"text":"A 1.2 m pendulum completes 20 oscillations in 44 s. Find g.","latex":"","isFinal":False},
    {"text":"Period T = 44/20 = 2.2 s","latex":"","isFinal":False},
    {"text":"g from T = 2π√(L/g)","latex":"g = \\frac{4\\pi^2 L}{T^2} = \\frac{4\\pi^2 \\times 1.2}{(2.2)^2} = \\frac{47.37}{4.84} \\approx 9.79\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Conical Pendulum","steps":[
    {"text":"A conical pendulum (L = 0.5 m) makes a 20° half-angle with vertical. Find the period.","latex":"","isFinal":False},
    {"text":"For conical pendulum: T = 2π√(L cosθ / g)","latex":"T = 2\\pi\\sqrt{\\frac{0.5 \\times \\cos 20°}{9.8}} = 2\\pi\\sqrt{\\frac{0.4698}{9.8}} = 2\\pi \\times 0.219 = 1.375\\text{ s}","isFinal":True}
  ]},
  {"title":"Energy of Oscillating Pendulum","steps":[
    {"text":"A 0.3 kg pendulum bob (L = 1 m) released from 15°. Find total energy.","latex":"","isFinal":False},
    {"text":"Total energy = initial PE = mgh = mgL(1 − cosθ)","latex":"E = 0.3 \\times 9.8 \\times 1 \\times (1 - \\cos 15°) = 2.94 \\times 0.0341 = 0.100\\text{ J}","isFinal":True}
  ]},
  {"title":"Pendulum Clock Adjustment","steps":[
    {"text":"A clock's pendulum runs 2 min slow per day. How should its length be adjusted? (T_desired = T - ΔT)","latex":"","isFinal":False},
    {"text":"Clock runs slow → period is too long → shorten pendulum. T ∝ √L so ΔT/T = ½ ΔL/L.","latex":"\\frac{\\Delta L}{L} = \\frac{2\\Delta T}{T} = \\frac{2 \\times 120}{86400} = 0.00278","isFinal":False},
    {"text":"Shorten by 0.278% of its length.","latex":"\\Delta L = 0.00278 L\\quad(\\text{shorten})","isFinal":True}
  ]},
  {"title":"Angular Frequency of Pendulum","steps":[
    {"text":"Find the angular frequency of a 0.6 m pendulum.","latex":"","isFinal":False},
    {"text":"ω = √(g/L)","latex":"\\omega = \\sqrt{\\frac{9.8}{0.6}} = \\sqrt{16.33} \\approx 4.04\\text{ rad/s}","isFinal":False},
    {"text":"Period T = 2π/ω = 2π/4.04 ≈ 1.55 s","latex":"T = \\frac{2\\pi}{\\omega} \\approx 1.55\\text{ s}","isFinal":True}
  ]}
],

"resonance": [
  {"title":"Natural Frequency of Spring–Mass","steps":[
    {"text":"A 0.4 kg mass on a spring (k = 160 N/m) is driven. Find its natural frequency.","latex":"","isFinal":False},
    {"text":"f₀ = (1/2π)√(k/m)","latex":"f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{160}{0.4}} = \\frac{1}{2\\pi}\\sqrt{400} = \\frac{20}{2\\pi} \\approx 3.18\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Resonance Condition","steps":[
    {"text":"An oscillator has f₀ = 5 Hz. At what driving frequency does resonance occur?","latex":"","isFinal":False},
    {"text":"Resonance occurs when the driving frequency equals the natural frequency.","latex":"f_{drive} = f_0 = 5\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Quality Factor (Q)","steps":[
    {"text":"A resonator has f₀ = 100 Hz and bandwidth Δf = 4 Hz. Find Q.","latex":"","isFinal":False},
    {"text":"Q = f₀ / Δf","latex":"Q = \\frac{100}{4} = 25","isFinal":False},
    {"text":"A high Q means sharp resonance (low damping); the oscillator rings for a long time.","latex":"","isFinal":True}
  ]},
  {"title":"Tacoma Narrows Bridge","steps":[
    {"text":"Explain why the Tacoma Narrows Bridge collapsed in terms of resonance.","latex":"","isFinal":False},
    {"text":"Wind-induced vortex shedding occurred at a frequency matching the bridge's natural torsional frequency.","latex":"","isFinal":False},
    {"text":"Energy was continuously added (resonance), causing amplitude to grow until structural failure. This is an example of forced resonance.","latex":"A \\propto \\frac{F_0}{\\sqrt{(\\omega_0^2-\\omega^2)^2 + (b\\omega/m)^2}} \\rightarrow \\infty\\text{ as }\\omega\\to\\omega_0, b\\to0","isFinal":True}
  ]},
  {"title":"Resonance Amplitude Peak","steps":[
    {"text":"An undamped oscillator (k = 400 N/m, m = 1 kg) is driven with F₀ = 10 N at resonance. Damping b = 8 N·s/m. Find steady-state amplitude.","latex":"","isFinal":False},
    {"text":"At resonance, amplitude A = F₀ / (b·ω₀)","latex":"\\omega_0 = \\sqrt{\\frac{k}{m}} = 20\\text{ rad/s}","isFinal":False},
    {"text":"","latex":"A = \\frac{F_0}{b\\omega_0} = \\frac{10}{8 \\times 20} = 0.0625\\text{ m}","isFinal":True}
  ]},
  {"title":"String Resonance — Harmonics","steps":[
    {"text":"A 0.6 m guitar string resonates in its 3rd harmonic at 480 Hz. Find the wave speed.","latex":"","isFinal":False},
    {"text":"3rd harmonic: wavelength λ = 2L/3","latex":"\\lambda = \\frac{2 \\times 0.6}{3} = 0.4\\text{ m}","isFinal":False},
    {"text":"Wave speed v = fλ","latex":"v = 480 \\times 0.4 = 192\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Avoiding Resonance in Buildings","steps":[
    {"text":"An earthquake generates 1 Hz vibrations. A 20-storey building has natural frequency 0.2 Hz. A 5-storey building has 1 Hz. Which is at risk?","latex":"","isFinal":False},
    {"text":"The 5-storey building has f₀ = 1 Hz, matching the earthquake frequency → resonance → amplified oscillations → risk of collapse.","latex":"f_{drive} = f_0 = 1\\text{ Hz (resonance for 5-storey)}","isFinal":False},
    {"text":"The 20-storey building (f₀ = 0.2 Hz ≠ 1 Hz) is not at resonance → less risk.","latex":"","isFinal":True}
  ]},
  {"title":"Helmholtz Resonator Frequency","steps":[
    {"text":"A bottle with neck area A = 2 cm², neck length l = 3 cm, cavity volume V = 500 cm³ acts as a Helmholtz resonator. Find its frequency.","latex":"","isFinal":False},
    {"text":"f = (c/2π)√(A/Vl); using c = 343 m/s and SI units","latex":"f = \\frac{343}{2\\pi}\\sqrt{\\frac{2\\times10^{-4}}{500\\times10^{-6} \\times 0.03}} = \\frac{343}{6.28}\\sqrt{\\frac{2\\times10^{-4}}{1.5\\times10^{-5}}}","isFinal":False},
    {"text":"","latex":"f = 54.6 \\times \\sqrt{13.3} = 54.6 \\times 3.65 \\approx 199\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Damping Effect on Resonance Peak","steps":[
    {"text":"How does increasing damping affect the resonance peak?","latex":"","isFinal":False},
    {"text":"Higher damping b → lower amplitude at resonance, broader peak (lower Q).","latex":"A_{max} = \\frac{F_0}{b\\omega_0}\\quad(\\text{inversely proportional to }b)","isFinal":False},
    {"text":"The resonance frequency also shifts slightly below ω₀: ω_res = √(ω₀² − b²/2m²).","latex":"\\omega_{res} = \\sqrt{\\omega_0^2 - \\frac{b^2}{2m^2}}","isFinal":True}
  ]},
  {"title":"MRI and Nuclear Resonance","steps":[
    {"text":"In MRI, hydrogen nuclei precess at the Larmor frequency. For B = 1.5 T, f₀ = 63.9 MHz. What happens when RF pulses match this frequency?","latex":"","isFinal":False},
    {"text":"The RF pulse frequency matches the Larmor frequency → resonance → energy is absorbed by the nuclei.","latex":"f_{RF} = f_0 = \\frac{\\gamma B}{2\\pi}","isFinal":False},
    {"text":"When RF is removed, nuclei emit energy at f₀ as they relax — detected to form the MRI image.","latex":"","isFinal":True}
  ]}
],

"wave-properties": [
  {"title":"Wave Speed from Frequency and Wavelength","steps":[
    {"text":"A wave has frequency 250 Hz and wavelength 1.4 m. Find its speed.","latex":"","isFinal":False},
    {"text":"v = fλ","latex":"v = 250 \\times 1.4 = 350\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Finding Wavelength from Speed and Frequency","steps":[
    {"text":"Sound travels at 340 m/s. A 440 Hz (A4 note) sound wave — find its wavelength.","latex":"","isFinal":False},
    {"text":"λ = v/f","latex":"\\lambda = \\frac{340}{440} = 0.773\\text{ m}","isFinal":True}
  ]},
  {"title":"Period and Frequency","steps":[
    {"text":"A wave has period 0.02 s. Find its frequency.","latex":"","isFinal":False},
    {"text":"f = 1/T","latex":"f = \\frac{1}{0.02} = 50\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Wave Speed in a String","steps":[
    {"text":"A string has tension 80 N and linear density 0.005 kg/m. Find wave speed.","latex":"","isFinal":False},
    {"text":"v = √(T/μ)","latex":"v = \\sqrt{\\frac{80}{0.005}} = \\sqrt{16000} \\approx 126.5\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Transverse vs Longitudinal","steps":[
    {"text":"Classify: (a) sound in air, (b) seismic S-waves, (c) ripples on water.","latex":"","isFinal":False},
    {"text":"(a) Sound in air: longitudinal (compression and rarefaction parallel to propagation).","latex":"","isFinal":False},
    {"text":"(b) Seismic S-waves: transverse (shear, perpendicular to propagation). (c) Water ripples: transverse (surface up-down).","latex":"","isFinal":True}
  ]},
  {"title":"Wave Number and Angular Frequency","steps":[
    {"text":"A wave has λ = 0.4 m and f = 50 Hz. Find the wave number k and angular frequency ω.","latex":"","isFinal":False},
    {"text":"Wave number k = 2π/λ","latex":"k = \\frac{2\\pi}{0.4} = 5\\pi \\approx 15.7\\text{ rad/m}","isFinal":False},
    {"text":"Angular frequency ω = 2πf","latex":"\\omega = 2\\pi \\times 50 = 100\\pi \\approx 314\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Intensity and Amplitude","steps":[
    {"text":"Wave A has amplitude 4 cm, Wave B has amplitude 8 cm (same frequency, medium). Compare their intensities.","latex":"","isFinal":False},
    {"text":"Intensity ∝ A²","latex":"\\frac{I_B}{I_A} = \\frac{(8)^2}{(4)^2} = \\frac{64}{16} = 4","isFinal":False},
    {"text":"Wave B carries 4× the intensity of Wave A.","latex":"","isFinal":True}
  ]},
  {"title":"Intensity Inverse Square Law","steps":[
    {"text":"A point source emits 100 W. Find intensity at 5 m.","latex":"","isFinal":False},
    {"text":"Intensity = Power / (4πr²)","latex":"I = \\frac{100}{4\\pi \\times 25} = \\frac{100}{314} \\approx 0.318\\text{ W/m}^2","isFinal":True}
  ]},
  {"title":"Phase Difference from Path Difference","steps":[
    {"text":"Two coherent sources emit waves (λ = 0.5 m). Point P is 1.75 m from source 1 and 1.25 m from source 2. Find phase difference.","latex":"","isFinal":False},
    {"text":"Path difference Δx = 1.75 − 1.25 = 0.5 m","latex":"","isFinal":False},
    {"text":"Phase difference","latex":"\\Delta\\phi = \\frac{2\\pi}{\\lambda}\\Delta x = \\frac{2\\pi}{0.5} \\times 0.5 = 2\\pi = 360°\\quad\\text{(constructive)}","isFinal":True}
  ]},
  {"title":"Speed of Sound — Temperature Dependence","steps":[
    {"text":"Speed of sound at 0°C is 331 m/s. Find speed at 25°C. (v ≈ 331 + 0.6T m/s, T in °C)","latex":"","isFinal":False},
    {"text":"Apply the formula","latex":"v = 331 + 0.6 \\times 25 = 331 + 15 = 346\\text{ m/s}","isFinal":True}
  ]}
],

"superposition": [
  {"title":"Adding Two Waves in Phase","steps":[
    {"text":"Two waves: y₁ = 3sin(ωt) and y₂ = 5sin(ωt). Find the resultant.","latex":"","isFinal":False},
    {"text":"Same frequency and phase → amplitudes add","latex":"y = (3+5)\\sin(\\omega t) = 8\\sin(\\omega t)","isFinal":True}
  ]},
  {"title":"Destructive Interference","steps":[
    {"text":"y₁ = 6sin(ωt) and y₂ = 6sin(ωt + π). Find the resultant.","latex":"","isFinal":False},
    {"text":"Phase difference π → completely out of phase (anti-phase) → destructive interference","latex":"y = 6\\sin(\\omega t) + 6\\sin(\\omega t + \\pi) = 6\\sin(\\omega t) - 6\\sin(\\omega t) = 0","isFinal":True}
  ]},
  {"title":"Path Difference for Constructive Interference","steps":[
    {"text":"Two coherent sources (λ = 0.6 m) interfere. At what path differences does constructive interference occur?","latex":"","isFinal":False},
    {"text":"Constructive: Δx = nλ (n = 0, ±1, ±2, ...)","latex":"\\Delta x = 0, \\pm 0.6, \\pm 1.2, \\pm 1.8, \\ldots\\text{ m}","isFinal":True}
  ]},
  {"title":"Destructive Interference Condition","steps":[
    {"text":"Same setup (λ = 0.6 m). At what path differences does destructive interference occur?","latex":"","isFinal":False},
    {"text":"Destructive: Δx = (n + ½)λ","latex":"\\Delta x = \\pm 0.3, \\pm 0.9, \\pm 1.5, \\ldots\\text{ m}","isFinal":True}
  ]},
  {"title":"Beat Frequency","steps":[
    {"text":"Two sound waves: f₁ = 440 Hz, f₂ = 446 Hz superpose. Find the beat frequency.","latex":"","isFinal":False},
    {"text":"Beat frequency = |f₁ − f₂|","latex":"f_{beat} = |440 - 446| = 6\\text{ Hz}","isFinal":False},
    {"text":"Six beats per second are heard.","latex":"","isFinal":True}
  ]},
  {"title":"Resultant Amplitude (Phasor Method)","steps":[
    {"text":"Two waves of equal amplitude A = 4 m, separated by phase φ = 60°. Find resultant amplitude.","latex":"","isFinal":False},
    {"text":"Resultant amplitude","latex":"A_R = 2A\\cos\\!\\left(\\frac{\\phi}{2}\\right) = 2 \\times 4 \\times \\cos 30° = 8 \\times 0.866 = 6.93\\text{ m}","isFinal":True}
  ]},
  {"title":"Young's Double Slit — Fringe Position","steps":[
    {"text":"Double slit: d = 0.5 mm, D = 2 m, λ = 600 nm. Find the position of the 2nd bright fringe.","latex":"","isFinal":False},
    {"text":"Fringe position y = nλD/d","latex":"y_2 = \\frac{2 \\times 600\\times10^{-9} \\times 2}{0.5\\times10^{-3}} = \\frac{2.4\\times10^{-6}}{5\\times10^{-4}} = 4.8\\times10^{-3}\\text{ m} = 4.8\\text{ mm}","isFinal":True}
  ]},
  {"title":"Fringe Width","steps":[
    {"text":"In Young's experiment: d = 1 mm, D = 1.5 m, λ = 500 nm. Find fringe width.","latex":"","isFinal":False},
    {"text":"Fringe width β = λD/d","latex":"\\beta = \\frac{500\\times10^{-9} \\times 1.5}{1\\times10^{-3}} = \\frac{7.5\\times10^{-7}}{10^{-3}} = 7.5\\times10^{-4}\\text{ m} = 0.75\\text{ mm}","isFinal":True}
  ]},
  {"title":"Superposition on a String","steps":[
    {"text":"Two pulses on a string: y₁ = +3 cm (at x = 0) and y₂ = −2 cm (at x = 0). What is the string displacement when they overlap?","latex":"","isFinal":False},
    {"text":"Superposition principle: add displacements","latex":"y_{total} = +3 + (-2) = +1\\text{ cm}","isFinal":True}
  ]},
  {"title":"Coherence Requirement","steps":[
    {"text":"Why must two sources be coherent to produce stable interference fringes?","latex":"","isFinal":False},
    {"text":"Coherent sources maintain a constant phase difference over time.","latex":"","isFinal":False},
    {"text":"Incoherent sources (random phase differences) produce fringes that shift rapidly — the detector time-averages to uniform intensity with no visible pattern.","latex":"\\langle I \\rangle = I_1 + I_2\\text{ (no fringes for incoherent)}","isFinal":True}
  ]}
],

"standing-waves": [
  {"title":"Fundamental Frequency of a String","steps":[
    {"text":"A string of length 0.8 m has wave speed 160 m/s. Find the fundamental frequency.","latex":"","isFinal":False},
    {"text":"Fundamental: λ = 2L","latex":"f_1 = \\frac{v}{\\lambda} = \\frac{v}{2L} = \\frac{160}{2 \\times 0.8} = 100\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Harmonics on a String","steps":[
    {"text":"A 0.5 m string vibrates at its 3rd harmonic. Wave speed = 240 m/s. Find the frequency.","latex":"","isFinal":False},
    {"text":"nth harmonic on string fixed at both ends: f_n = nv/(2L)","latex":"f_3 = \\frac{3 \\times 240}{2 \\times 0.5} = \\frac{720}{1} = 720\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Open Pipe Harmonics","steps":[
    {"text":"An open organ pipe (L = 0.4 m, v = 344 m/s). Find the first two harmonics.","latex":"","isFinal":False},
    {"text":"Open pipe: f_n = nv/(2L)","latex":"f_1 = \\frac{344}{0.8} = 430\\text{ Hz}, \\quad f_2 = 2 \\times 430 = 860\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Closed Pipe — Odd Harmonics Only","steps":[
    {"text":"A closed pipe (one end closed) has L = 0.3 m, v = 340 m/s. Find the first two resonant frequencies.","latex":"","isFinal":False},
    {"text":"Closed pipe: f_n = nv/(4L), odd n only (n = 1, 3, 5, ...)","latex":"f_1 = \\frac{340}{4 \\times 0.3} = \\frac{340}{1.2} \\approx 283\\text{ Hz}","isFinal":False},
    {"text":"Second resonance (n = 3)","latex":"f_3 = 3 \\times 283 = 850\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Node and Antinode Positions","steps":[
    {"text":"A 1 m string supports its fundamental standing wave. Locate the nodes and antinodes.","latex":"","isFinal":False},
    {"text":"Fundamental: one antinode at centre, nodes at both ends","latex":"\\text{Nodes: } x=0\\text{ and }x=1\\text{ m};\\quad\\text{Antinode: } x=0.5\\text{ m}","isFinal":True}
  ]},
  {"title":"Wavelength from Standing Wave","steps":[
    {"text":"Students observe 4 loops in a 1.6 m vibrating string. Find the wavelength.","latex":"","isFinal":False},
    {"text":"Each loop = half a wavelength","latex":"\\lambda = \\frac{2L}{n} = \\frac{2 \\times 1.6}{4} = 0.8\\text{ m}","isFinal":True}
  ]},
  {"title":"Speed of Sound from Resonance Tube","steps":[
    {"text":"A closed resonance tube (L = 0.85 m) resonates at 100 Hz. Find the speed of sound.","latex":"","isFinal":False},
    {"text":"First resonance (fundamental) of closed pipe: L = λ/4 → λ = 4L","latex":"\\lambda = 4 \\times 0.85 = 3.4\\text{ m}","isFinal":False},
    {"text":"v = fλ","latex":"v = 100 \\times 3.4 = 340\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Standing Wave Equation","steps":[
    {"text":"Write the equation of a standing wave formed from two waves: y₁ = A sin(kx − ωt) and y₂ = A sin(kx + ωt).","latex":"","isFinal":False},
    {"text":"Add using sum-to-product identity","latex":"y = y_1 + y_2 = 2A\\sin(kx)\\cos(\\omega t)","isFinal":False},
    {"text":"This shows nodes where sin(kx) = 0 (at x = nπ/k = nλ/2) and antinodes where |sin(kx)| = 1.","latex":"","isFinal":True}
  ]},
  {"title":"Resonance of Air Column — Finding Length","steps":[
    {"text":"A tuning fork at 512 Hz produces first resonance in an open pipe. Speed of sound = 341 m/s. Find L.","latex":"","isFinal":False},
    {"text":"First resonance of open pipe: L = λ/2","latex":"\\lambda = \\frac{v}{f} = \\frac{341}{512} = 0.666\\text{ m}","isFinal":False},
    {"text":"","latex":"L = \\frac{\\lambda}{2} = 0.333\\text{ m}","isFinal":True}
  ]},
  {"title":"Guitar Fret Positions","steps":[
    {"text":"A guitar string of length 0.65 m vibrates at 220 Hz. To raise by one octave (440 Hz), how should the effective length change?","latex":"","isFinal":False},
    {"text":"f ∝ 1/L for the fundamental. Doubling f requires halving L.","latex":"L_{new} = \\frac{0.65}{2} = 0.325\\text{ m}","isFinal":False},
    {"text":"Press fret at 0.325 m from the bridge (or 0.325 m from the nut).","latex":"","isFinal":True}
  ]}
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
