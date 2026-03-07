#!/usr/bin/env python3
"""Batch 7: electromagnets, faradays-law, generators-transformers, ac-circuits,
maxwells-equations, em-spectrum, reflection-mirrors, refraction"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"electromagnets": [
  {"title":"Magnetic Field of a Solenoid Electromagnet","steps":[
    {"text":"An electromagnet solenoid: 800 turns, 0.25 m long, 3 A. Find B inside.","latex":"","isFinal":False},
    {"text":"n = N/L = 800/0.25 = 3200 turns/m; B = μ₀nI","latex":"B = 4\\pi\\times10^{-7} \\times 3200 \\times 3 = 4\\pi\\times10^{-7} \\times 9600 \\approx 0.01206\\text{ T}","isFinal":True}
  ]},
  {"title":"Lifting Capacity of an Electromagnet","steps":[
    {"text":"An electromagnet produces B = 0.5 T over area A = 0.004 m². Find the holding force.","latex":"","isFinal":False},
    {"text":"Magnetic pressure / force: F = B²A/(2μ₀)","latex":"F = \\frac{(0.5)^2 \\times 0.004}{2 \\times 4\\pi\\times10^{-7}} = \\frac{10^{-3}}{8\\pi\\times10^{-7}} \\approx 398\\text{ N}","isFinal":True}
  ]},
  {"title":"Effect of Iron Core","steps":[
    {"text":"A solenoid without iron core has B₀ = 0.005 T. Iron core has relative permeability μ_r = 2000. Find B with core.","latex":"","isFinal":False},
    {"text":"B_core = μ_r × B₀","latex":"B = 2000 \\times 0.005 = 10\\text{ T}","isFinal":True}
  ]},
  {"title":"Current Needed for Target Field","steps":[
    {"text":"Design a solenoid (500 turns, 0.1 m long, iron core μ_r = 1000) to produce B = 0.2 T. Find required current.","latex":"","isFinal":False},
    {"text":"B = μ₀μ_r n I → I = B/(μ₀μ_r n)","latex":"n = 500/0.1 = 5000\\text{ turns/m}","isFinal":False},
    {"text":"","latex":"I = \\frac{0.2}{4\\pi\\times10^{-7} \\times 1000 \\times 5000} = \\frac{0.2}{6.283} \\approx 0.0318\\text{ A} \\approx 32\\text{ mA}","isFinal":True}
  ]},
  {"title":"Magnetic Reluctance","steps":[
    {"text":"A toroidal iron core (μ_r = 500, mean length 0.4 m, area 10⁻³ m²) has a coil of 200 turns. Find reluctance and inductance.","latex":"","isFinal":False},
    {"text":"Reluctance R = l/(μ₀μ_rA)","latex":"\\mathcal{R} = \\frac{0.4}{4\\pi\\times10^{-7} \\times 500 \\times 10^{-3}} = \\frac{0.4}{6.28\\times10^{-7}} = 6.37\\times10^5\\text{ H}^{-1}","isFinal":False},
    {"text":"Inductance L = N²/R","latex":"L = \\frac{200^2}{6.37\\times10^5} = \\frac{40000}{6.37\\times10^5} \\approx 0.0628\\text{ H} = 62.8\\text{ mH}","isFinal":True}
  ]},
  {"title":"Energy Stored in Electromagnet","steps":[
    {"text":"An electromagnet (L = 0.1 H) carries 5 A. Find energy stored in its magnetic field.","latex":"","isFinal":False},
    {"text":"E = ½LI²","latex":"E = \\frac{1}{2} \\times 0.1 \\times 25 = 1.25\\text{ J}","isFinal":True}
  ]},
  {"title":"Hysteresis Loss","steps":[
    {"text":"Explain why electromagnets made of soft iron lose less energy than hard iron for AC applications.","latex":"","isFinal":False},
    {"text":"The B–H hysteresis loop area = energy dissipated per cycle. Soft iron has a narrow loop (small area) → less heat loss per cycle.","latex":"W_{loss} \\propto \\oint H\\,dB\\text{ (loop area)}","isFinal":False},
    {"text":"Hard iron (used for permanent magnets) has a wide loop → large hysteresis losses → unsuitable for AC electromagnets.","latex":"","isFinal":True}
  ]},
  {"title":"Electromagnet vs Permanent Magnet","steps":[
    {"text":"An electromagnet and permanent magnet both produce B = 0.5 T. Compare the advantages.","latex":"","isFinal":False},
    {"text":"Electromagnet: can be switched on/off, field strength adjustable by varying current, can produce very strong fields with high currents.","latex":"","isFinal":False},
    {"text":"Permanent magnet: no electrical power needed, always-on (useful in motors/speakers/sensors), but field cannot be changed. An electromagnet is preferred when controllability is needed.","latex":"","isFinal":True}
  ]},
  {"title":"Magnetomotive Force","steps":[
    {"text":"A coil of 600 turns carries 0.5 A. Find the magnetomotive force (MMF).","latex":"","isFinal":False},
    {"text":"MMF = NI (analogous to EMF in electrical circuits)","latex":"MMF = N \\times I = 600 \\times 0.5 = 300\\text{ A·turns}","isFinal":True}
  ]},
  {"title":"Saturation Field","steps":[
    {"text":"An iron core saturates at B_sat = 2.0 T. A solenoid (n = 5000 turns/m) uses this core. Find the current needed to approach saturation.","latex":"","isFinal":False},
    {"text":"At saturation: B ≈ μ₀ H_sat (approximately); but B_sat = μ₀μ_r(sat) n I. For a simpler estimate, note μ_r drops near saturation.","latex":"","isFinal":False},
    {"text":"Using H = nI and H_sat ≈ B_sat/μ₀ (in air equivalent): I ≈ B_sat/(μ₀ n)","latex":"I \\approx \\frac{2.0}{4\\pi\\times10^{-7} \\times 5000} \\approx \\frac{2.0}{6.28\\times10^{-3}} \\approx 318\\text{ A}","isFinal":True}
  ]}
],

"faradays-law": [
  {"title":"EMF from Changing Flux","steps":[
    {"text":"A coil of 50 turns has flux changing at 0.02 Wb/s. Find the induced EMF.","latex":"","isFinal":False},
    {"text":"Faraday's Law: EMF = −N dΦ/dt","latex":"EMF = -50 \\times (-0.02) = 1\\text{ V (magnitude)}","isFinal":True}
  ]},
  {"title":"EMF from Area Change","steps":[
    {"text":"A 100-turn coil (area 0.01 m²) is in B = 0.5 T field. It collapses to area = 0 in 0.1 s. Find average EMF.","latex":"","isFinal":False},
    {"text":"ΔΦ per turn = B × ΔA = 0.5 × 0.01 = 0.005 Wb","latex":"","isFinal":False},
    {"text":"EMF = N ΔΦ/Δt","latex":"EMF = \\frac{100 \\times 0.005}{0.1} = 5\\text{ V}","isFinal":True}
  ]},
  {"title":"Lenz's Law Direction","steps":[
    {"text":"A bar magnet (north pole first) enters a coil. What is the direction of the induced current?","latex":"","isFinal":False},
    {"text":"Increasing flux into the coil (northward). Lenz's Law: induced current opposes increase.","latex":"","isFinal":False},
    {"text":"The induced current creates a magnetic field opposing the entering flux (facing the magnet with a north pole) → current flows counter-clockwise as seen from the magnet side.","latex":"\\text{Induced current: counter-clockwise (opposing)}","isFinal":True}
  ]},
  {"title":"Motional EMF — Moving Rod","steps":[
    {"text":"A 0.4 m conducting rod moves at 3 m/s perpendicular to B = 0.2 T. Find the induced EMF.","latex":"","isFinal":False},
    {"text":"Motional EMF: ε = BLv","latex":"\\varepsilon = 0.2 \\times 0.4 \\times 3 = 0.24\\text{ V}","isFinal":True}
  ]},
  {"title":"Current from Motional EMF","steps":[
    {"text":"The rod from above (0.24 V) is part of a circuit with resistance 2 Ω. Find the induced current.","latex":"","isFinal":False},
    {"text":"I = ε/R","latex":"I = \\frac{0.24}{2} = 0.12\\text{ A}","isFinal":True}
  ]},
  {"title":"Back-EMF in a Motor","steps":[
    {"text":"A DC motor connected to 120 V draws 4 A. Its coil resistance is 5 Ω. Find the back-EMF.","latex":"","isFinal":False},
    {"text":"Kirchhoff's voltage law: V_supply = back-EMF + I×R","latex":"back\\text{-}EMF = 120 - 4 \\times 5 = 120 - 20 = 100\\text{ V}","isFinal":True}
  ]},
  {"title":"Self-Inductance EMF","steps":[
    {"text":"An inductor (L = 0.2 H) has current changing at 5 A/s. Find the induced EMF.","latex":"","isFinal":False},
    {"text":"ε = −L(dI/dt)","latex":"|\\varepsilon| = 0.2 \\times 5 = 1\\text{ V}","isFinal":True}
  ]},
  {"title":"Mutual Inductance","steps":[
    {"text":"Two coils: when current in coil 1 changes at 10 A/s, EMF of 0.5 V is induced in coil 2. Find mutual inductance M.","latex":"","isFinal":False},
    {"text":"ε₂ = M (dI₁/dt)","latex":"M = \\frac{\\varepsilon_2}{dI_1/dt} = \\frac{0.5}{10} = 0.05\\text{ H} = 50\\text{ mH}","isFinal":True}
  ]},
  {"title":"Eddy Currents — Power Loss","steps":[
    {"text":"Explain how eddy currents are reduced in transformer cores and why this matters.","latex":"","isFinal":False},
    {"text":"Eddy currents are loops of current induced in the bulk core material by changing flux (Faraday's Law). They dissipate power as heat: P = V²/R.","latex":"","isFinal":False},
    {"text":"Laminating the core (thin insulated sheets) increases resistance to eddy current paths → reduces eddy currents → reduces power loss. Essential for efficient high-frequency transformers.","latex":"P_{eddy} \\propto f^2 B^2 d^2\\text{ (d = lamination thickness)}","isFinal":True}
  ]},
  {"title":"Generator Output Voltage","steps":[
    {"text":"A generator coil (N = 200 turns, A = 0.02 m², ω = 100π rad/s) rotates in B = 0.05 T. Find peak EMF.","latex":"","isFinal":False},
    {"text":"Peak EMF: ε₀ = NBAω","latex":"\\varepsilon_0 = 200 \\times 0.05 \\times 0.02 \\times 100\\pi = 200 \\times 0.05 \\times 0.02 \\times 314.2 \\approx 62.8\\text{ V}","isFinal":True}
  ]}
],

"generators-transformers": [
  {"title":"Transformer Turns Ratio","steps":[
    {"text":"A transformer: N₁ = 2000 turns, N₂ = 100 turns, V₁ = 240 V. Find V₂.","latex":"","isFinal":False},
    {"text":"V₂/V₁ = N₂/N₁","latex":"V_2 = 240 \\times \\frac{100}{2000} = 12\\text{ V}","isFinal":True}
  ]},
  {"title":"Transformer Current Ratio","steps":[
    {"text":"Same transformer (N₁ = 2000, N₂ = 100, V₁ = 240 V). If I₂ = 5 A, find I₁.","latex":"","isFinal":False},
    {"text":"Ideal transformer: I₁/I₂ = N₂/N₁ (power in = power out)","latex":"I_1 = 5 \\times \\frac{100}{2000} = 0.25\\text{ A}","isFinal":True}
  ]},
  {"title":"Generator Peak Voltage","steps":[
    {"text":"A generator coil (N = 500, A = 0.02 m²) rotates at 50 Hz in B = 0.1 T. Find peak and rms voltage.","latex":"","isFinal":False},
    {"text":"ω = 2πf = 100π rad/s; ε₀ = NBAω","latex":"\\varepsilon_0 = 500 \\times 0.1 \\times 0.02 \\times 100\\pi \\approx 314\\text{ V}","isFinal":False},
    {"text":"RMS voltage","latex":"V_{rms} = \\frac{\\varepsilon_0}{\\sqrt{2}} = \\frac{314}{1.414} \\approx 222\\text{ V}","isFinal":True}
  ]},
  {"title":"Power Transmission — Voltage Step-Up","steps":[
    {"text":"A 10 kW generator at 500 V is stepped up to 50 kV for transmission. Find the current in the transmission line.","latex":"","isFinal":False},
    {"text":"P = VI → I = P/V","latex":"I_{transmission} = \\frac{10000}{50000} = 0.2\\text{ A}","isFinal":False},
    {"text":"Stepping up voltage reduces current, reducing I²R power loss in the lines.","latex":"","isFinal":True}
  ]},
  {"title":"Efficiency of a Transformer","steps":[
    {"text":"A transformer: P_input = 1000 W, V₁ = 240 V, V₂ = 12 V, I₂ = 75 A. Find efficiency.","latex":"","isFinal":False},
    {"text":"Output power","latex":"P_{out} = V_2 I_2 = 12 \\times 75 = 900\\text{ W}","isFinal":False},
    {"text":"Efficiency","latex":"\\eta = \\frac{900}{1000} = 90\\%","isFinal":True}
  ]},
  {"title":"Turns Ratio from Voltage and Current","steps":[
    {"text":"A transformer converts 480 V/5 A to 120 V. Find turns ratio and output current (ideal).","latex":"","isFinal":False},
    {"text":"Turns ratio N₁:N₂ = V₁:V₂","latex":"\\frac{N_1}{N_2} = \\frac{480}{120} = 4:1","isFinal":False},
    {"text":"Current ratio is inverse (ideal)","latex":"I_2 = I_1 \\times \\frac{N_1}{N_2} = 5 \\times 4 = 20\\text{ A}","isFinal":True}
  ]},
  {"title":"DC Generator vs AC Generator","steps":[
    {"text":"Explain the key difference between AC and DC generators and the role of the commutator.","latex":"","isFinal":False},
    {"text":"Both convert mechanical energy to electrical via electromagnetic induction (Faraday's Law).","latex":"","isFinal":False},
    {"text":"AC generator (alternator) uses slip rings → outputs alternating current. DC generator uses a commutator (split rings) → rectifies output to pulsating DC.","latex":"V_{AC}(t) = V_0\\sin(\\omega t);\\quad V_{DC}\\text{ after commutator: rectified}","isFinal":True}
  ]},
  {"title":"Line Loss Calculation","steps":[
    {"text":"A power line has resistance 20 Ω and carries 10 A. Find the power lost.","latex":"","isFinal":False},
    {"text":"P_loss = I²R","latex":"P_{loss} = (10)^2 \\times 20 = 2000\\text{ W} = 2\\text{ kW}","isFinal":True}
  ]},
  {"title":"Why DC Transformers Don't Work","steps":[
    {"text":"Why does a transformer only work with AC?","latex":"","isFinal":False},
    {"text":"Faraday's Law: EMF = −N dΦ/dt. For DC, flux is constant → dΦ/dt = 0 → no induced EMF in secondary.","latex":"\\varepsilon = -N\\frac{d\\Phi}{dt} = 0\\text{ for DC (constant flux)}","isFinal":False},
    {"text":"AC produces continuously changing flux → continuous induction → transformer works.","latex":"","isFinal":True}
  ]},
  {"title":"Grid Distribution Network","steps":[
    {"text":"A power plant generates 50 MW at 10 kV. It is stepped up to 400 kV for national grid. Find the step-up turns ratio and transmission current.","latex":"","isFinal":False},
    {"text":"Turns ratio","latex":"\\frac{N_2}{N_1} = \\frac{400}{10} = 40","isFinal":False},
    {"text":"Transmission current","latex":"I = \\frac{P}{V} = \\frac{50\\times10^6}{400\\times10^3} = 125\\text{ A}","isFinal":True}
  ]}
],

"ac-circuits": [
  {"title":"RMS Voltage and Current","steps":[
    {"text":"A household supply: 240 V rms. Find peak voltage and peak current through 40 Ω.","latex":"","isFinal":False},
    {"text":"Peak voltage","latex":"V_0 = V_{rms}\\sqrt{2} = 240\\sqrt{2} \\approx 339.4\\text{ V}","isFinal":False},
    {"text":"Peak current","latex":"I_0 = \\frac{V_0}{R} = \\frac{339.4}{40} \\approx 8.49\\text{ A}","isFinal":True}
  ]},
  {"title":"Capacitive Reactance","steps":[
    {"text":"Find the capacitive reactance of a 100 μF capacitor at 50 Hz.","latex":"","isFinal":False},
    {"text":"X_C = 1/(2πfC)","latex":"X_C = \\frac{1}{2\\pi \\times 50 \\times 100\\times10^{-6}} = \\frac{1}{0.03142} = 31.8\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Inductive Reactance","steps":[
    {"text":"Find the inductive reactance of a 0.2 H inductor at 50 Hz.","latex":"","isFinal":False},
    {"text":"X_L = 2πfL","latex":"X_L = 2\\pi \\times 50 \\times 0.2 = 62.8\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Impedance of Series RC Circuit","steps":[
    {"text":"R = 30 Ω, C = 100 μF at f = 50 Hz. Find impedance.","latex":"","isFinal":False},
    {"text":"X_C = 31.8 Ω (from previous). Z = √(R² + X_C²)","latex":"Z = \\sqrt{30^2 + 31.8^2} = \\sqrt{900 + 1011} = \\sqrt{1911} \\approx 43.7\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Resonance in Series RLC","steps":[
    {"text":"Find the resonant frequency of L = 0.1 H and C = 10 μF.","latex":"","isFinal":False},
    {"text":"At resonance: X_L = X_C → f₀ = 1/(2π√LC)","latex":"f_0 = \\frac{1}{2\\pi\\sqrt{0.1 \\times 10\\times10^{-6}}} = \\frac{1}{2\\pi\\sqrt{10^{-6}}} = \\frac{1}{2\\pi \\times 10^{-3}} = \\frac{1000}{2\\pi} \\approx 159\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Power Factor","steps":[
    {"text":"An AC circuit has R = 30 Ω, X_L = 40 Ω. Find impedance, phase angle, and power factor.","latex":"","isFinal":False},
    {"text":"Z = √(30² + 40²) = 50 Ω","latex":"Z = 50\\text{ Ω}","isFinal":False},
    {"text":"Phase angle and power factor","latex":"\\phi = \\arctan\\!\\left(\\frac{X_L}{R}\\right) = \\arctan(1.33) = 53.1°, \\quad \\cos\\phi = \\frac{30}{50} = 0.6","isFinal":True}
  ]},
  {"title":"Average Power in AC Circuit","steps":[
    {"text":"V_rms = 100 V, I_rms = 2 A, power factor = 0.8. Find average power.","latex":"","isFinal":False},
    {"text":"P = V_rms × I_rms × cosφ","latex":"P = 100 \\times 2 \\times 0.8 = 160\\text{ W}","isFinal":True}
  ]},
  {"title":"Current at Resonance","steps":[
    {"text":"Series RLC circuit at resonance: V_rms = 100 V, R = 5 Ω. Find current and voltages across L and C (X_L = 200 Ω).","latex":"","isFinal":False},
    {"text":"At resonance Z = R only","latex":"I_{rms} = \\frac{V_{rms}}{R} = \\frac{100}{5} = 20\\text{ A}","isFinal":False},
    {"text":"Voltage across L (or C)","latex":"V_L = I_{rms} X_L = 20 \\times 200 = 4000\\text{ V} >> V_{supply}\\text{ (voltage magnification!)}","isFinal":True}
  ]},
  {"title":"Low-Pass RC Filter","steps":[
    {"text":"An RC low-pass filter: R = 1 kΩ, C = 1 μF. Find the cut-off frequency.","latex":"","isFinal":False},
    {"text":"Cut-off frequency f_c = 1/(2πRC)","latex":"f_c = \\frac{1}{2\\pi \\times 1000 \\times 10^{-6}} = \\frac{1}{6.283\\times10^{-3}} \\approx 159\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Phase Difference Between V and I","steps":[
    {"text":"A pure inductor is connected to AC. Describe the phase relationship between V and I.","latex":"","isFinal":False},
    {"text":"Voltage across an inductor leads the current by 90° (π/2 radians).","latex":"V_L = I_0 X_L \\sin(\\omega t + 90°) = I_0 X_L \\cos(\\omega t)","isFinal":False},
    {"text":"For a pure capacitor, voltage lags current by 90°. For a pure resistor, V and I are in phase.","latex":"","isFinal":True}
  ]}
],

"maxwells-equations": [
  {"title":"Gauss's Law — Electric Flux","steps":[
    {"text":"A point charge Q = 3 μC. Find the total electric flux through any closed surface surrounding it. (ε₀ = 8.85×10⁻¹² F/m)","latex":"","isFinal":False},
    {"text":"Gauss's Law: Φ_E = Q_enc/ε₀","latex":"\\Phi_E = \\frac{3\\times10^{-6}}{8.85\\times10^{-12}} = 3.39\\times10^5\\text{ V·m} = 339\\text{ kV·m}","isFinal":True}
  ]},
  {"title":"Gauss's Law — Spherical Symmetry","steps":[
    {"text":"Find E outside a uniformly charged sphere (Q = 1 μC, r = 0.5 m from centre).","latex":"","isFinal":False},
    {"text":"For a spherical Gaussian surface outside: E × 4πr² = Q/ε₀","latex":"E = \\frac{Q}{4\\pi\\varepsilon_0 r^2} = \\frac{8.99\\times10^9 \\times 10^{-6}}{0.25} = 35\\,960\\text{ N/C}","isFinal":True}
  ]},
  {"title":"Gauss's Law for Magnetism","steps":[
    {"text":"What is the total magnetic flux through any closed surface?","latex":"","isFinal":False},
    {"text":"Gauss's Law for magnetism: ∮ B·dA = 0 (no magnetic monopoles exist)","latex":"\\oint \\vec{B} \\cdot d\\vec{A} = 0","isFinal":False},
    {"text":"This means magnetic field lines always form closed loops — every north pole is paired with a south pole.","latex":"","isFinal":True}
  ]},
  {"title":"Faraday's Law in Integral Form","steps":[
    {"text":"A circular loop (r = 0.1 m) is in a field B increasing at 2 T/s. Find the induced EMF (Faraday's law).","latex":"","isFinal":False},
    {"text":"Faraday's Law: ∮ E·dl = −dΦ_B/dt","latex":"EMF = -\\frac{d\\Phi_B}{dt} = -\\frac{d(BA)}{dt} = -A\\frac{dB}{dt}","isFinal":False},
    {"text":"","latex":"EMF = -(\\pi \\times 0.01) \\times 2 = -0.0628\\text{ V}\\quad(|EMF| = 62.8\\text{ mV})","isFinal":True}
  ]},
  {"title":"Displacement Current","steps":[
    {"text":"A capacitor (C = 10 μF) charges with current I = 0.5 A. Find the displacement current between the plates.","latex":"","isFinal":False},
    {"text":"Displacement current equals the conduction current in the circuit (Maxwell's addition to Ampere's Law)","latex":"I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt} = I_c = 0.5\\text{ A}","isFinal":True}
  ]},
  {"title":"Ampere–Maxwell Law","steps":[
    {"text":"What modification did Maxwell add to Ampere's Law and why was it necessary?","latex":"","isFinal":False},
    {"text":"Original Ampere: ∮ B·dl = μ₀I_enc. Problem: this failed at a capacitor gap (no conduction current, but B field exists from changing E).","latex":"","isFinal":False},
    {"text":"Maxwell added displacement current I_D = ε₀ dΦ_E/dt: ∮ B·dl = μ₀(I + I_D)","latex":"\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0\\left(I + \\varepsilon_0\\frac{d\\Phi_E}{dt}\\right)","isFinal":True}
  ]},
  {"title":"Speed of Light from Maxwell's Equations","steps":[
    {"text":"Derive the speed of light from Maxwell's equations using μ₀ = 4π×10⁻⁷ and ε₀ = 8.85×10⁻¹² .","latex":"","isFinal":False},
    {"text":"Maxwell showed EM waves propagate at c = 1/√(μ₀ε₀)","latex":"c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{1}{\\sqrt{4\\pi\\times10^{-7} \\times 8.85\\times10^{-12}}}","isFinal":False},
    {"text":"","latex":"c = \\frac{1}{\\sqrt{1.113\\times10^{-17}}} = \\frac{1}{1.055\\times10^{-8/2}} \\approx 3\\times10^8\\text{ m/s}\\checkmark","isFinal":True}
  ]},
  {"title":"Electromagnetic Wave Energy","steps":[
    {"text":"Find the intensity of an EM wave with E₀ = 100 V/m. (c = 3×10⁸ m/s, ε₀ = 8.85×10⁻¹² F/m)","latex":"","isFinal":False},
    {"text":"Intensity I = ½ε₀cE₀²","latex":"I = \\frac{1}{2} \\times 8.85\\times10^{-12} \\times 3\\times10^8 \\times (100)^2","isFinal":False},
    {"text":"","latex":"I = \\frac{1}{2} \\times 8.85\\times10^{-12} \\times 3\\times10^{12} = \\frac{1}{2} \\times 26.55 = 13.3\\text{ W/m}^2","isFinal":True}
  ]},
  {"title":"E to B Ratio in EM Wave","steps":[
    {"text":"In an EM wave, E₀ = 300 V/m. Find B₀.","latex":"","isFinal":False},
    {"text":"E and B are related by E₀ = cB₀","latex":"B_0 = \\frac{E_0}{c} = \\frac{300}{3\\times10^8} = 10^{-6}\\text{ T} = 1\\text{ μT}","isFinal":True}
  ]},
  {"title":"Radiation Pressure","steps":[
    {"text":"Sunlight intensity at Earth = 1360 W/m². Find the radiation pressure on a perfectly absorbing surface.","latex":"","isFinal":False},
    {"text":"Radiation pressure P = I/c (for absorber)","latex":"P = \\frac{1360}{3\\times10^8} = 4.53\\times10^{-6}\\text{ Pa} = 4.53\\text{ μPa}","isFinal":True}
  ]}
],

"em-spectrum": [
  {"title":"Wavelength from Frequency","steps":[
    {"text":"Find the wavelength of a 100 MHz FM radio wave. (c = 3×10⁸ m/s)","latex":"","isFinal":False},
    {"text":"λ = c/f","latex":"\\lambda = \\frac{3\\times10^8}{100\\times10^6} = 3\\text{ m}","isFinal":True}
  ]},
  {"title":"Frequency from Wavelength","steps":[
    {"text":"Find the frequency of green light (λ = 550 nm).","latex":"","isFinal":False},
    {"text":"f = c/λ","latex":"f = \\frac{3\\times10^8}{550\\times10^{-9}} = \\frac{3\\times10^8}{5.5\\times10^{-7}} = 5.45\\times10^{14}\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Photon Energy","steps":[
    {"text":"Find the energy of a photon of X-ray radiation (λ = 0.1 nm). (h = 6.626×10⁻³⁴ J·s)","latex":"","isFinal":False},
    {"text":"E = hf = hc/λ","latex":"E = \\frac{6.626\\times10^{-34} \\times 3\\times10^8}{10^{-10}} = \\frac{1.988\\times10^{-25}}{10^{-10}} = 1.988\\times10^{-15}\\text{ J} \\approx 12.4\\text{ keV}","isFinal":True}
  ]},
  {"title":"Comparing Wavelengths","steps":[
    {"text":"Order these from shortest to longest wavelength: UV (300 nm), infrared (5 μm), microwave (3 cm), visible red (700 nm).","latex":"","isFinal":False},
    {"text":"Convert all to nm: UV=300 nm, visible=700 nm, IR=5000 nm, microwave=3×10⁷ nm","latex":"","isFinal":False},
    {"text":"Order: UV (300 nm) < visible red (700 nm) < infrared (5000 nm) < microwave (3 cm)","latex":"\\text{UV} < \\text{visible} < \\text{IR} < \\text{microwave}","isFinal":True}
  ]},
  {"title":"Gamma Ray Energy","steps":[
    {"text":"Find the energy of a gamma ray (f = 3×10²⁰ Hz) in Joules and eV.","latex":"","isFinal":False},
    {"text":"E = hf","latex":"E = 6.626\\times10^{-34} \\times 3\\times10^{20} = 1.99\\times10^{-13}\\text{ J}","isFinal":False},
    {"text":"Convert to eV (1 eV = 1.6×10⁻¹⁹ J)","latex":"E = \\frac{1.99\\times10^{-13}}{1.6\\times10^{-19}} = 1.24\\times10^6\\text{ eV} = 1.24\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Electromagnetic Spectrum Uses","steps":[
    {"text":"Match each EM wave to its application: (a) radio, (b) microwave, (c) X-ray, (d) UV.","latex":"","isFinal":False},
    {"text":"(a) Radio: broadcasting, communication (λ = cm to km). (b) Microwave: Wi-Fi, cooking, radar (λ = mm to cm).","latex":"","isFinal":False},
    {"text":"(c) X-ray: medical imaging, security scanning (λ = 0.01–10 nm). (d) UV: sterilisation, tanning, fluorescence (λ = 10–400 nm).","latex":"","isFinal":True}
  ]},
  {"title":"Wien's Displacement Law","steps":[
    {"text":"The Sun's peak emission is at λ_max = 502 nm. Find its surface temperature. (b = 2.898×10⁻³ m·K)","latex":"","isFinal":False},
    {"text":"Wien's Law: λ_max T = b","latex":"T = \\frac{b}{\\lambda_{max}} = \\frac{2.898\\times10^{-3}}{502\\times10^{-9}} \\approx 5773\\text{ K}","isFinal":True}
  ]},
  {"title":"Penetration Depth","steps":[
    {"text":"Arrange in order of penetrating ability (lowest to highest): radio waves, visible light, X-rays, gamma rays.","latex":"","isFinal":False},
    {"text":"Penetration increases with photon energy (higher frequency, shorter wavelength).","latex":"","isFinal":False},
    {"text":"Order: radio (lowest penetration through matter) < visible < X-rays < gamma rays (highest, can penetrate thick lead).","latex":"E_{photon} \\propto f \\propto \\text{penetrating ability}","isFinal":True}
  ]},
  {"title":"Mobile Phone Frequency to Wavelength","steps":[
    {"text":"A 4G signal at 2.6 GHz. Find the wavelength.","latex":"","isFinal":False},
    {"text":"λ = c/f","latex":"\\lambda = \\frac{3\\times10^8}{2.6\\times10^9} = 0.1154\\text{ m} \\approx 11.5\\text{ cm}","isFinal":True}
  ]},
  {"title":"EM Spectrum — Infrared Body Heat","steps":[
    {"text":"The human body (T = 310 K) radiates IR. Find the peak wavelength using Wien's Law.","latex":"","isFinal":False},
    {"text":"λ_max = b/T","latex":"\\lambda_{max} = \\frac{2.898\\times10^{-3}}{310} = 9.35\\times10^{-6}\\text{ m} = 9.35\\text{ μm (mid-infrared)}","isFinal":True}
  ]}
],

"reflection-mirrors": [
  {"title":"Law of Reflection","steps":[
    {"text":"A ray strikes a flat mirror at 35° to the normal. Find the angle of reflection.","latex":"","isFinal":False},
    {"text":"Law of reflection: angle of incidence = angle of reflection","latex":"\\theta_r = \\theta_i = 35°","isFinal":True}
  ]},
  {"title":"Image in a Plane Mirror","steps":[
    {"text":"An object is 30 cm in front of a plane mirror. Describe the image.","latex":"","isFinal":False},
    {"text":"Plane mirror forms a virtual, upright, same-size image behind the mirror.","latex":"","isFinal":False},
    {"text":"Image is 30 cm behind the mirror (same distance as object), virtual, and laterally inverted.","latex":"d_i = 30\\text{ cm behind mirror (virtual)}","isFinal":True}
  ]},
  {"title":"Concave Mirror — Focal Length","steps":[
    {"text":"A concave mirror has radius of curvature R = 24 cm. Find its focal length.","latex":"","isFinal":False},
    {"text":"f = R/2","latex":"f = \\frac{24}{2} = 12\\text{ cm}","isFinal":True}
  ]},
  {"title":"Mirror Equation — Real Image","steps":[
    {"text":"Object at 30 cm from a concave mirror (f = 10 cm). Find image distance.","latex":"","isFinal":False},
    {"text":"Mirror equation: 1/f = 1/d_o + 1/d_i","latex":"\\frac{1}{10} = \\frac{1}{30} + \\frac{1}{d_i}","isFinal":False},
    {"text":"Solve","latex":"\\frac{1}{d_i} = \\frac{1}{10} - \\frac{1}{30} = \\frac{2}{30} \\Rightarrow d_i = 15\\text{ cm (real, in front)}","isFinal":True}
  ]},
  {"title":"Magnification","steps":[
    {"text":"Object 30 cm from concave mirror (f = 10 cm, d_i = 15 cm). Find magnification and image height if object is 4 cm tall.","latex":"","isFinal":False},
    {"text":"m = −d_i/d_o","latex":"m = -\\frac{15}{30} = -0.5\\text{ (inverted, half-size)}","isFinal":False},
    {"text":"Image height","latex":"h_i = m \\times h_o = -0.5 \\times 4 = -2\\text{ cm}","isFinal":True}
  ]},
  {"title":"Convex Mirror — Virtual Image","steps":[
    {"text":"Object 20 cm from a convex mirror (f = −15 cm). Find image distance.","latex":"","isFinal":False},
    {"text":"1/f = 1/d_o + 1/d_i","latex":"\\frac{1}{-15} = \\frac{1}{20} + \\frac{1}{d_i}","isFinal":False},
    {"text":"","latex":"\\frac{1}{d_i} = \\frac{-1}{15} - \\frac{1}{20} = \\frac{-4-3}{60} = \\frac{-7}{60} \\Rightarrow d_i = -8.57\\text{ cm (virtual)}","isFinal":True}
  ]},
  {"title":"Object at Centre of Curvature","steps":[
    {"text":"Object at R = 2f = 20 cm from a concave mirror (f = 10 cm). Find image position.","latex":"","isFinal":False},
    {"text":"1/f = 1/d_o + 1/d_i","latex":"\\frac{1}{10} = \\frac{1}{20} + \\frac{1}{d_i} \\Rightarrow d_i = 20\\text{ cm}","isFinal":False},
    {"text":"Image forms at same distance as object (at centre of curvature), real, inverted, same size (m = −1).","latex":"m = -1\\text{ (real, inverted, same size)}","isFinal":True}
  ]},
  {"title":"Concave Mirror — Object Inside Focus","steps":[
    {"text":"Object 6 cm from a concave mirror (f = 10 cm). Find image.","latex":"","isFinal":False},
    {"text":"1/10 = 1/6 + 1/d_i","latex":"\\frac{1}{d_i} = \\frac{1}{10} - \\frac{1}{6} = \\frac{3-5}{30} = -\\frac{2}{30}","isFinal":False},
    {"text":"d_i = −15 cm (negative = virtual, behind mirror), m = −(−15)/6 = +2.5 (upright, magnified)","latex":"d_i = -15\\text{ cm (virtual, upright, magnified)}","isFinal":True}
  ]},
  {"title":"Multiple Reflections — Two Plane Mirrors","steps":[
    {"text":"Two plane mirrors face each other at 60°. How many images of an object placed between them are formed?","latex":"","isFinal":False},
    {"text":"Number of images n = (360°/θ) − 1","latex":"n = \\frac{360}{60} - 1 = 6 - 1 = 5\\text{ images}","isFinal":True}
  ]},
  {"title":"Parabolic vs Spherical Mirror","steps":[
    {"text":"Why are parabolic mirrors used in telescopes and headlights instead of spherical mirrors?","latex":"","isFinal":False},
    {"text":"Spherical mirrors suffer from spherical aberration — rays far from the axis focus at slightly different points.","latex":"","isFinal":False},
    {"text":"Parabolic mirrors focus all parallel rays to a single exact focal point, eliminating spherical aberration. Essential for high-resolution telescopes and focused headlight beams.","latex":"","isFinal":True}
  ]}
],

"refraction": [
  {"title":"Snell's Law","steps":[
    {"text":"Light passes from air (n₁ = 1.00) into glass (n₂ = 1.5) at angle of incidence 45°. Find the refraction angle.","latex":"","isFinal":False},
    {"text":"Snell's Law: n₁ sinθ₁ = n₂ sinθ₂","latex":"1.00 \\times \\sin 45° = 1.5 \\times \\sin\\theta_2","isFinal":False},
    {"text":"Solve","latex":"\\sin\\theta_2 = \\frac{\\sin 45°}{1.5} = \\frac{0.707}{1.5} = 0.471 \\Rightarrow \\theta_2 \\approx 28.1°","isFinal":True}
  ]},
  {"title":"Critical Angle","steps":[
    {"text":"Find the critical angle for total internal reflection at a glass–air interface (n_glass = 1.5).","latex":"","isFinal":False},
    {"text":"At critical angle: n sinθ_c = 1 × sin90° = 1","latex":"\\sin\\theta_c = \\frac{1}{n} = \\frac{1}{1.5} = 0.667","isFinal":False},
    {"text":"","latex":"\\theta_c = \\arcsin(0.667) \\approx 41.8°","isFinal":True}
  ]},
  {"title":"Speed of Light in a Medium","steps":[
    {"text":"Find the speed of light in diamond (n = 2.42).","latex":"","isFinal":False},
    {"text":"n = c/v → v = c/n","latex":"v = \\frac{3\\times10^8}{2.42} = 1.24\\times10^8\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Total Internal Reflection","steps":[
    {"text":"Light inside glass (n = 1.6) hits the surface at 50°. Does TIR occur? (Critical angle ≈ 38.7°)","latex":"","isFinal":False},
    {"text":"Since 50° > 38.7° (critical angle), total internal reflection DOES occur.","latex":"50° > \\theta_c = 38.7° \\Rightarrow \\text{TIR occurs}","isFinal":True}
  ]},
  {"title":"Refractive Index from Angles","steps":[
    {"text":"Light hits water at 60° and refracts at 40°. Find the refractive index of water.","latex":"","isFinal":False},
    {"text":"n = sin(θ_air)/sin(θ_water)","latex":"n = \\frac{\\sin 60°}{\\sin 40°} = \\frac{0.866}{0.643} \\approx 1.347","isFinal":True}
  ]},
  {"title":"Apparent Depth","steps":[
    {"text":"A fish is 2 m deep in water (n = 1.33). Find its apparent depth as seen from air.","latex":"","isFinal":False},
    {"text":"Apparent depth = real depth / n","latex":"d_{app} = \\frac{2}{1.33} \\approx 1.50\\text{ m}","isFinal":True}
  ]},
  {"title":"Light Ray in Multiple Media","steps":[
    {"text":"Light goes from water (n₁ = 1.33) to glass (n₂ = 1.5). Angle in water = 35°. Find angle in glass.","latex":"","isFinal":False},
    {"text":"Snell's Law: n₁ sinθ₁ = n₂ sinθ₂","latex":"1.33 \\times \\sin 35° = 1.5 \\times \\sin\\theta_2","isFinal":False},
    {"text":"Solve","latex":"\\sin\\theta_2 = \\frac{1.33 \\times 0.574}{1.5} = 0.509 \\Rightarrow \\theta_2 \\approx 30.6°","isFinal":True}
  ]},
  {"title":"Fibre Optic — Acceptance Angle","steps":[
    {"text":"An optical fibre has core n₁ = 1.5 and cladding n₂ = 1.45. Find the critical angle and acceptance angle.","latex":"","isFinal":False},
    {"text":"Critical angle inside fibre","latex":"\\theta_c = \\arcsin\\!\\left(\\frac{1.45}{1.5}\\right) = \\arcsin(0.967) \\approx 75.1°","isFinal":False},
    {"text":"Acceptance angle (numerical aperture): sin θ_acc = √(n₁² − n₂²)","latex":"\\sin\\theta_{acc} = \\sqrt{1.5^2 - 1.45^2} = \\sqrt{0.1475} \\approx 0.384 \\Rightarrow \\theta_{acc} \\approx 22.5°","isFinal":True}
  ]},
  {"title":"Dispersion — Rainbow","steps":[
    {"text":"Explain why a prism disperses white light into a spectrum.","latex":"","isFinal":False},
    {"text":"Refractive index n varies with wavelength (dispersion). Violet light (n ≈ 1.53) refracts more than red (n ≈ 1.51) in glass.","latex":"","isFinal":False},
    {"text":"Since n is higher for violet, it bends more at each interface → the spectrum spreads out by colour.","latex":"n_{violet} > n_{red} \\Rightarrow \\theta_{violet} > \\theta_{red}\\text{ (more refraction)}","isFinal":True}
  ]},
  {"title":"Prism Minimum Deviation","steps":[
    {"text":"A 60° prism shows minimum deviation D = 40° for yellow light. Find the refractive index.","latex":"","isFinal":False},
    {"text":"n = sin[(A + D_min)/2] / sin[A/2]","latex":"n = \\frac{\\sin[(60°+40°)/2]}{\\sin[60°/2]} = \\frac{\\sin 50°}{\\sin 30°} = \\frac{0.766}{0.5} = 1.532","isFinal":True}
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
