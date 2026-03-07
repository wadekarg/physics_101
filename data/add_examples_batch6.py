#!/usr/bin/env python3
"""Batch 6: coulombs-law, electric-fields, capacitors, ohms-law,
series-parallel, kirchhoffs-laws, magnetic-fields, magnetic-force-charges"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"coulombs-law": [
  {"title":"Force Between Two Charges","steps":[
    {"text":"Find the force between +3 μC and −4 μC charges separated by 0.2 m. (k = 8.99×10⁹ N·m²/C²)","latex":"","isFinal":False},
    {"text":"Coulomb's Law: F = kq₁q₂/r²","latex":"F = \\frac{8.99\\times10^9 \\times 3\\times10^{-6} \\times 4\\times10^{-6}}{(0.2)^2}","isFinal":False},
    {"text":"Calculate","latex":"F = \\frac{8.99\\times10^9 \\times 1.2\\times10^{-11}}{0.04} = \\frac{0.1079}{0.04} \\approx 2.70\\text{ N (attractive)}","isFinal":True}
  ]},
  {"title":"Comparing Gravitational and Electric Forces","steps":[
    {"text":"For two protons (m = 1.67×10⁻²⁷ kg, q = 1.6×10⁻¹⁹ C) separated by 1 nm, find ratio F_E/F_G.","latex":"","isFinal":False},
    {"text":"Electric force","latex":"F_E = \\frac{8.99\\times10^9 \\times (1.6\\times10^{-19})^2}{(10^{-9})^2} = 2.30\\times10^{-10}\\text{ N}","isFinal":False},
    {"text":"Gravitational force","latex":"F_G = \\frac{6.67\\times10^{-11} \\times (1.67\\times10^{-27})^2}{(10^{-9})^2} = 1.86\\times10^{-46}\\text{ N}","isFinal":False},
    {"text":"Ratio F_E/F_G ≈ 1.24×10³⁶ — electric force is vastly stronger.","latex":"\\frac{F_E}{F_G} \\approx 1.24\\times10^{36}","isFinal":True}
  ]},
  {"title":"Equilibrium Position","steps":[
    {"text":"Charges Q₁ = +4 μC at x = 0 and Q₂ = +1 μC at x = 0.3 m. Where is the electric force zero on the axis?","latex":"","isFinal":False},
    {"text":"At distance d from Q₂ (between them): k Q₁/(0.3 − d)² = k Q₂/d²","latex":"\\frac{4}{(0.3-d)^2} = \\frac{1}{d^2}","isFinal":False},
    {"text":"√4 = 2 → 2d = 0.3 − d → 3d = 0.3 → d = 0.1 m from Q₂ (x = 0.2 m)","latex":"d = 0.1\\text{ m from }Q_2 \\Rightarrow x = 0.2\\text{ m}","isFinal":True}
  ]},
  {"title":"Net Force on a Third Charge","steps":[
    {"text":"Q₁ = +5 μC at (0,0), Q₂ = −5 μC at (0.4, 0) m. Find force on Q₃ = +2 μC at (0.2, 0.2) m.","latex":"","isFinal":False},
    {"text":"r₁₃ = r₂₃ = √(0.2² + 0.2²) = 0.283 m. F₁₃ (repulsive from Q₁), F₂₃ (attractive to Q₂).","latex":"F = \\frac{8.99\\times10^9 \\times 5\\times10^{-6} \\times 2\\times10^{-6}}{(0.283)^2} = 1.124\\text{ N each}","isFinal":False},
    {"text":"By symmetry, x-components cancel; y-components add (both point to −y): F_net = 2×1.124×sin45° ≈ 1.59 N downward","latex":"F_{net} \\approx 1.59\\text{ N downward}","isFinal":True}
  ]},
  {"title":"Coulomb's Law — Changing Distance","steps":[
    {"text":"Two charges produce force F at separation r. If separation is tripled, what is the new force?","latex":"","isFinal":False},
    {"text":"F ∝ 1/r²","latex":"F' = F \\times \\frac{r^2}{(3r)^2} = \\frac{F}{9}","isFinal":True}
  ]},
  {"title":"Charge Needed for a Given Force","steps":[
    {"text":"Two equal charges are 0.5 m apart and attract with 0.1 N. Find the magnitude of each charge.","latex":"","isFinal":False},
    {"text":"F = kq²/r² → q² = Fr²/k","latex":"q = \\sqrt{\\frac{0.1 \\times 0.25}{8.99\\times10^9}} = \\sqrt{2.78\\times10^{-12}} \\approx 1.67\\times10^{-6}\\text{ C} = 1.67\\text{ μC}","isFinal":True}
  ]},
  {"title":"Superposition of Forces","steps":[
    {"text":"Three charges in a line: +2 μC at x=0, −3 μC at x=0.3 m, +4 μC at x=0.6 m. Find force on middle charge.","latex":"","isFinal":False},
    {"text":"F from Q₁ (repulsion, to right): F₁ = k×2×3×10⁻¹²/0.09 = 8.99×10⁹×6×10⁻¹²/0.09 = 0.599 N","latex":"F_1 = 0.599\\text{ N rightward}","isFinal":False},
    {"text":"F from Q₃ (attraction, to right): F₂ = k×3×4×10⁻¹²/0.09 = 1.199 N","latex":"F_2 = 1.199\\text{ N rightward}","isFinal":False},
    {"text":"Net force = 0.599 + 1.199 = 1.80 N to the right","latex":"F_{net} = 1.80\\text{ N rightward}","isFinal":True}
  ]},
  {"title":"Permittivity of Free Space","steps":[
    {"text":"Express Coulomb's constant k in terms of ε₀ and find ε₀.","latex":"","isFinal":False},
    {"text":"k = 1/(4πε₀)","latex":"\\varepsilon_0 = \\frac{1}{4\\pi k} = \\frac{1}{4\\pi \\times 8.99\\times10^9}","isFinal":False},
    {"text":"","latex":"\\varepsilon_0 = \\frac{1}{1.131\\times10^{11}} = 8.85\\times10^{-12}\\text{ C}^2/\\text{N·m}^2\\text{ (F/m)}","isFinal":True}
  ]},
  {"title":"Force in a Medium","steps":[
    {"text":"Two charges (10 μC each, 0.1 m apart) in water (κ = 80). Find the force.","latex":"","isFinal":False},
    {"text":"In a medium: F = kq₁q₂/(κr²)","latex":"F = \\frac{8.99\\times10^9 \\times (10^{-5})^2}{80 \\times (0.1)^2} = \\frac{8.99\\times10^9 \\times 10^{-10}}{0.8} = \\frac{0.899}{0.8} \\approx 1.12\\text{ N}","isFinal":True}
  ]},
  {"title":"Coulomb vs Gravitational for Electron-Proton","steps":[
    {"text":"Find the electric and gravitational forces between an electron and proton in a hydrogen atom (r ≈ 0.53 Å = 5.3×10⁻¹¹ m).","latex":"","isFinal":False},
    {"text":"Electric force","latex":"F_E = \\frac{8.99\\times10^9 \\times (1.6\\times10^{-19})^2}{(5.3\\times10^{-11})^2} \\approx 8.2\\times10^{-8}\\text{ N}","isFinal":False},
    {"text":"Gravitational force (m_p = 1.67×10⁻²⁷, m_e = 9.11×10⁻³¹ kg)","latex":"F_G = \\frac{6.67\\times10^{-11} \\times 1.67\\times10^{-27} \\times 9.11\\times10^{-31}}{(5.3\\times10^{-11})^2} \\approx 3.6\\times10^{-47}\\text{ N}","isFinal":True}
  ]}
],

"electric-fields": [
  {"title":"Electric Field from a Point Charge","steps":[
    {"text":"Find the electric field 0.3 m from a +5 μC charge.","latex":"","isFinal":False},
    {"text":"E = kq/r²","latex":"E = \\frac{8.99\\times10^9 \\times 5\\times10^{-6}}{(0.3)^2} = \\frac{44950}{0.09} \\approx 499\\,444\\text{ N/C} \\approx 500\\text{ kN/C}","isFinal":True}
  ]},
  {"title":"Force on a Charge in a Field","steps":[
    {"text":"A charge of +3 μC is placed in a uniform field of 2000 N/C. Find the force on it.","latex":"","isFinal":False},
    {"text":"F = qE","latex":"F = 3\\times10^{-6} \\times 2000 = 6\\times10^{-3}\\text{ N} = 6\\text{ mN}","isFinal":True}
  ]},
  {"title":"Field Due to Two Charges","steps":[
    {"text":"Two charges: +4 μC at x = 0 and +4 μC at x = 0.4 m. Find E at x = 0.2 m (midpoint).","latex":"","isFinal":False},
    {"text":"Fields from both charges point in opposite directions (both pushing away from same side)","latex":"E_1 = \\frac{8.99\\times10^9 \\times 4\\times10^{-6}}{(0.2)^2} = 899\\,000\\text{ N/C (right)}","isFinal":False},
    {"text":"By symmetry, E₂ = 899 000 N/C (left) → net field = 0","latex":"E_{net} = 0\\text{ (by symmetry)}","isFinal":True}
  ]},
  {"title":"Uniform Field Between Parallel Plates","steps":[
    {"text":"Two parallel plates are 0.01 m apart with voltage 500 V. Find the electric field.","latex":"","isFinal":False},
    {"text":"E = V/d (uniform field between plates)","latex":"E = \\frac{500}{0.01} = 50\\,000\\text{ N/C} = 50\\text{ kN/C}","isFinal":True}
  ]},
  {"title":"Field Line Direction","steps":[
    {"text":"An electron is placed in a 10 000 N/C field pointing east. Find the force on the electron.","latex":"","isFinal":False},
    {"text":"Force on negative charge is opposite to E","latex":"F = qE = 1.6\\times10^{-19} \\times 10000 = 1.6\\times10^{-15}\\text{ N west}","isFinal":True}
  ]},
  {"title":"Work Done Moving Charge in Field","steps":[
    {"text":"A +2 μC charge is moved 0.1 m in the direction of E = 5000 N/C. Find work done by the field.","latex":"","isFinal":False},
    {"text":"W = qEd (moving along field direction)","latex":"W = 2\\times10^{-6} \\times 5000 \\times 0.1 = 10^{-3}\\text{ J} = 1\\text{ mJ}","isFinal":True}
  ]},
  {"title":"Electric Potential vs Field","steps":[
    {"text":"The potential difference between two points is 200 V and they are 0.04 m apart. Find the electric field (assuming uniform).","latex":"","isFinal":False},
    {"text":"E = ΔV/d","latex":"E = \\frac{200}{0.04} = 5000\\text{ V/m} = 5\\text{ kN/C}","isFinal":True}
  ]},
  {"title":"Field at Conductor Surface","steps":[
    {"text":"A conductor has surface charge density σ = 4×10⁻⁶ C/m². Find the electric field just outside.","latex":"","isFinal":False},
    {"text":"E = σ/ε₀ (field just outside a conductor)","latex":"E = \\frac{4\\times10^{-6}}{8.85\\times10^{-12}} = 4.52\\times10^5\\text{ N/C}","isFinal":True}
  ]},
  {"title":"Dipole Field at Equator","steps":[
    {"text":"An electric dipole: q = 2 μC, separation d = 0.01 m. Find the field at 0.5 m from centre (on perpendicular bisector).","latex":"","isFinal":False},
    {"text":"At equatorial point: E = kp/r³ where p = qd (dipole moment)","latex":"p = 2\\times10^{-6} \\times 0.01 = 2\\times10^{-8}\\text{ C·m}","isFinal":False},
    {"text":"","latex":"E = \\frac{8.99\\times10^9 \\times 2\\times10^{-8}}{(0.5)^3} = \\frac{0.1799}{0.125} = 1.44\\text{ N/C}","isFinal":True}
  ]},
  {"title":"Millikan Oil Drop","steps":[
    {"text":"An oil drop (m = 5×10⁻¹⁵ kg) is suspended in a 50 000 N/C upward field. Find its charge.","latex":"","isFinal":False},
    {"text":"Equilibrium: qE = mg","latex":"q = \\frac{mg}{E} = \\frac{5\\times10^{-15} \\times 9.8}{50000} = \\frac{4.9\\times10^{-14}}{5\\times10^4} = 9.8\\times10^{-19}\\text{ C}","isFinal":False},
    {"text":"This is approximately 6 elementary charges (6 × 1.6×10⁻¹⁹ = 9.6×10⁻¹⁹ C).","latex":"n = \\frac{9.8\\times10^{-19}}{1.6\\times10^{-19}} \\approx 6\\text{ elementary charges}","isFinal":True}
  ]}
],

"capacitors": [
  {"title":"Charge on a Capacitor","steps":[
    {"text":"A 20 μF capacitor is connected to a 12 V supply. Find the charge stored.","latex":"","isFinal":False},
    {"text":"Q = CV","latex":"Q = 20\\times10^{-6} \\times 12 = 2.4\\times10^{-4}\\text{ C} = 240\\text{ μC}","isFinal":True}
  ]},
  {"title":"Energy Stored in a Capacitor","steps":[
    {"text":"A 50 μF capacitor charged to 100 V. Find the energy stored.","latex":"","isFinal":False},
    {"text":"E = ½CV²","latex":"E = \\frac{1}{2} \\times 50\\times10^{-6} \\times 100^2 = \\frac{1}{2} \\times 50\\times10^{-6} \\times 10000 = 0.25\\text{ J}","isFinal":True}
  ]},
  {"title":"Capacitors in Series","steps":[
    {"text":"C₁ = 4 μF and C₂ = 12 μF in series. Find C_eff.","latex":"","isFinal":False},
    {"text":"1/C_eff = 1/C₁ + 1/C₂","latex":"\\frac{1}{C_{eff}} = \\frac{1}{4} + \\frac{1}{12} = \\frac{3}{12} + \\frac{1}{12} = \\frac{4}{12}","isFinal":False},
    {"text":"","latex":"C_{eff} = 3\\text{ μF}","isFinal":True}
  ]},
  {"title":"Capacitors in Parallel","steps":[
    {"text":"C₁ = 6 μF, C₂ = 10 μF, C₃ = 4 μF in parallel. Find C_eff.","latex":"","isFinal":False},
    {"text":"C_eff = C₁ + C₂ + C₃","latex":"C_{eff} = 6 + 10 + 4 = 20\\text{ μF}","isFinal":True}
  ]},
  {"title":"Parallel Plate Capacitance","steps":[
    {"text":"A parallel plate capacitor has A = 0.01 m², d = 0.001 m. Find C. (ε₀ = 8.85×10⁻¹² F/m)","latex":"","isFinal":False},
    {"text":"C = ε₀A/d","latex":"C = \\frac{8.85\\times10^{-12} \\times 0.01}{0.001} = \\frac{8.85\\times10^{-14}}{10^{-3}} = 8.85\\times10^{-11}\\text{ F} = 88.5\\text{ pF}","isFinal":True}
  ]},
  {"title":"Dielectric Effect","steps":[
    {"text":"A capacitor has C = 100 pF in vacuum. A dielectric (κ = 5) is inserted. Find new capacitance.","latex":"","isFinal":False},
    {"text":"C_new = κ × C₀","latex":"C_{new} = 5 \\times 100 = 500\\text{ pF}","isFinal":True}
  ]},
  {"title":"Voltage from Charge and Capacitance","steps":[
    {"text":"A 30 μF capacitor stores 1.5×10⁻³ C. Find the voltage.","latex":"","isFinal":False},
    {"text":"V = Q/C","latex":"V = \\frac{1.5\\times10^{-3}}{30\\times10^{-6}} = 50\\text{ V}","isFinal":True}
  ]},
  {"title":"RC Time Constant","steps":[
    {"text":"A 100 μF capacitor charges through a 10 kΩ resistor from a 12 V supply. Find time constant and voltage at t = τ.","latex":"","isFinal":False},
    {"text":"Time constant τ = RC","latex":"\\tau = 10\\times10^3 \\times 100\\times10^{-6} = 1\\text{ s}","isFinal":False},
    {"text":"Voltage at t = τ","latex":"V(\\tau) = 12(1 - e^{-1}) = 12 \\times 0.632 = 7.58\\text{ V}","isFinal":True}
  ]},
  {"title":"Energy Before and After Connecting Capacitors","steps":[
    {"text":"C₁ = 10 μF charged to 100 V; C₂ = 30 μF uncharged. They are connected. Find final voltage.","latex":"","isFinal":False},
    {"text":"Charge conservation: Q_total = C₁V₁ = 10×10⁻⁶×100 = 10⁻³ C","latex":"","isFinal":False},
    {"text":"Final voltage (shared charge): V_f = Q/(C₁+C₂) = 10⁻³/(40×10⁻⁶) = 25 V","latex":"V_f = \\frac{10^{-3}}{40\\times10^{-6}} = 25\\text{ V}","isFinal":True}
  ]},
  {"title":"Field Between Capacitor Plates","steps":[
    {"text":"A 200 V capacitor with plate separation 2 mm. Find E between plates.","latex":"","isFinal":False},
    {"text":"E = V/d","latex":"E = \\frac{200}{2\\times10^{-3}} = 100\\,000\\text{ V/m} = 100\\text{ kV/m}","isFinal":True}
  ]}
],

"ohms-law": [
  {"title":"Voltage from Current and Resistance","steps":[
    {"text":"A 4 Ω resistor carries 3 A. Find the voltage across it.","latex":"","isFinal":False},
    {"text":"V = IR","latex":"V = 3 \\times 4 = 12\\text{ V}","isFinal":True}
  ]},
  {"title":"Current from Voltage and Resistance","steps":[
    {"text":"A 15 V battery is connected across a 30 Ω resistor. Find the current.","latex":"","isFinal":False},
    {"text":"I = V/R","latex":"I = \\frac{15}{30} = 0.5\\text{ A}","isFinal":True}
  ]},
  {"title":"Resistance from Voltage and Current","steps":[
    {"text":"A lamp draws 0.4 A from a 240 V supply. Find its resistance.","latex":"","isFinal":False},
    {"text":"R = V/I","latex":"R = \\frac{240}{0.4} = 600\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Power Dissipated in Resistor","steps":[
    {"text":"A 50 Ω resistor carries 2 A. Find the power dissipated.","latex":"","isFinal":False},
    {"text":"P = I²R","latex":"P = (2)^2 \\times 50 = 4 \\times 50 = 200\\text{ W}","isFinal":True}
  ]},
  {"title":"Power from Voltage and Resistance","steps":[
    {"text":"A 120 V supply connected to a 960 Ω heating element. Find the power.","latex":"","isFinal":False},
    {"text":"P = V²/R","latex":"P = \\frac{(120)^2}{960} = \\frac{14400}{960} = 15\\text{ W}","isFinal":True}
  ]},
  {"title":"Resistance of a Wire","steps":[
    {"text":"A copper wire (ρ = 1.7×10⁻⁸ Ω·m, L = 10 m, A = 1 mm² = 10⁻⁶ m²). Find resistance.","latex":"","isFinal":False},
    {"text":"R = ρL/A","latex":"R = \\frac{1.7\\times10^{-8} \\times 10}{10^{-6}} = \\frac{1.7\\times10^{-7}}{10^{-6}} = 0.17\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Energy Used by Appliance","steps":[
    {"text":"A 2000 W electric kettle runs for 3 minutes. Find the energy used.","latex":"","isFinal":False},
    {"text":"E = Pt","latex":"E = 2000 \\times 180 = 360\\,000\\text{ J} = 360\\text{ kJ}","isFinal":True}
  ]},
  {"title":"Temperature Effect on Resistance","steps":[
    {"text":"A tungsten filament has R = 5 Ω at 20°C and α = 4.5×10⁻³ /°C. Find R at 2500°C.","latex":"","isFinal":False},
    {"text":"R_T = R₀(1 + αΔT)","latex":"R_T = 5 \\times (1 + 4.5\\times10^{-3} \\times 2480) = 5 \\times (1 + 11.16) = 5 \\times 12.16 = 60.8\\text{ Ω}","isFinal":True}
  ]},
  {"title":"EMF and Internal Resistance","steps":[
    {"text":"A battery (EMF = 6 V, internal resistance r = 0.5 Ω) drives 2 A through an external resistor. Find terminal voltage.","latex":"","isFinal":False},
    {"text":"Voltage drop across internal resistance","latex":"V_{int} = I \\times r = 2 \\times 0.5 = 1\\text{ V}","isFinal":False},
    {"text":"Terminal voltage = EMF − V_int","latex":"V_t = 6 - 1 = 5\\text{ V}","isFinal":True}
  ]},
  {"title":"Maximum Power Transfer","steps":[
    {"text":"A source (EMF = 12 V, r = 3 Ω). Find the external resistance that maximises power transfer.","latex":"","isFinal":False},
    {"text":"Maximum power is transferred when R_ext = r","latex":"R_{ext} = 3\\text{ Ω}","isFinal":False},
    {"text":"Maximum power","latex":"P_{max} = \\frac{EMF^2}{4r} = \\frac{144}{12} = 12\\text{ W}","isFinal":True}
  ]}
],

"series-parallel": [
  {"title":"Resistors in Series","steps":[
    {"text":"Three resistors (4 Ω, 6 Ω, 10 Ω) are connected in series across 40 V. Find total resistance and current.","latex":"","isFinal":False},
    {"text":"R_total = R₁ + R₂ + R₃","latex":"R_T = 4 + 6 + 10 = 20\\text{ Ω}","isFinal":False},
    {"text":"Current I = V/R_T","latex":"I = \\frac{40}{20} = 2\\text{ A (same through all)}","isFinal":True}
  ]},
  {"title":"Resistors in Parallel","steps":[
    {"text":"Three resistors (6 Ω, 12 Ω, 4 Ω) in parallel across 12 V. Find total resistance and total current.","latex":"","isFinal":False},
    {"text":"1/R_T = 1/6 + 1/12 + 1/4 = 2/12 + 1/12 + 3/12 = 6/12","latex":"R_T = 2\\text{ Ω}","isFinal":False},
    {"text":"Total current","latex":"I = \\frac{12}{2} = 6\\text{ A}","isFinal":True}
  ]},
  {"title":"Voltage Divider","steps":[
    {"text":"R₁ = 8 Ω and R₂ = 12 Ω in series across 100 V. Find V across R₂.","latex":"","isFinal":False},
    {"text":"Current I = V/(R₁+R₂) = 100/20 = 5 A","latex":"","isFinal":False},
    {"text":"V₂ = IR₂","latex":"V_2 = 5 \\times 12 = 60\\text{ V}","isFinal":True}
  ]},
  {"title":"Current Divider","steps":[
    {"text":"R₁ = 10 Ω and R₂ = 15 Ω in parallel, total current = 5 A. Find current through each.","latex":"","isFinal":False},
    {"text":"Voltage is same across both: V = I × R_parallel","latex":"R_p = \\frac{10 \\times 15}{25} = 6\\text{ Ω}, \\quad V = 5 \\times 6 = 30\\text{ V}","isFinal":False},
    {"text":"","latex":"I_1 = \\frac{30}{10} = 3\\text{ A}, \\quad I_2 = \\frac{30}{15} = 2\\text{ A}","isFinal":True}
  ]},
  {"title":"Mixed Series-Parallel Circuit","steps":[
    {"text":"R₁ = 6 Ω in series with parallel combination of R₂ = 12 Ω and R₃ = 12 Ω, across 30 V. Find total current.","latex":"","isFinal":False},
    {"text":"Parallel combination: R₂₃ = 12×12/(12+12) = 6 Ω","latex":"R_{23} = 6\\text{ Ω}","isFinal":False},
    {"text":"Total resistance and current","latex":"R_T = 6 + 6 = 12\\text{ Ω}, \\quad I = \\frac{30}{12} = 2.5\\text{ A}","isFinal":True}
  ]},
  {"title":"Power in Each Branch","steps":[
    {"text":"From previous circuit (V=30V, R₁=6Ω, R₂₃=6Ω, I=2.5A): find power in R₁ and in each of R₂, R₃.","latex":"","isFinal":False},
    {"text":"P₁ = I²R₁ = 2.5² × 6 = 37.5 W","latex":"P_1 = 37.5\\text{ W}","isFinal":False},
    {"text":"Voltage across R₂₃ = 2.5 × 6 = 15 V; current in each R₂,R₃ = 15/12 = 1.25 A","latex":"P_2 = P_3 = (1.25)^2 \\times 12 = 18.75\\text{ W each}","isFinal":True}
  ]},
  {"title":"Short Circuit in Parallel Branch","steps":[
    {"text":"R₁ = 10 Ω and R₂ = 20 Ω are in parallel across 20 V. R₂ then short-circuits. Find new total current.","latex":"","isFinal":False},
    {"text":"With R₂ shorted: R_parallel = 0 Ω, so total resistance = 0","latex":"I = \\frac{V}{0} \\to \\infty\\text{ (dangerous short circuit!)}","isFinal":False},
    {"text":"In practice, fuses blow to protect the circuit.","latex":"","isFinal":True}
  ]},
  {"title":"Three-Branch Parallel","steps":[
    {"text":"Three bulbs (60 W, 100 W, 40 W) all on 240 V. Find resistance of each and total current.","latex":"","isFinal":False},
    {"text":"R = V²/P","latex":"R_{60} = \\frac{240^2}{60} = 960\\text{ Ω}, \\quad R_{100} = \\frac{240^2}{100} = 576\\text{ Ω}, \\quad R_{40} = \\frac{240^2}{40} = 1440\\text{ Ω}","isFinal":False},
    {"text":"Total current = P_total/V = (60+100+40)/240 = 0.833 A","latex":"I_T = \\frac{200}{240} \\approx 0.833\\text{ A}","isFinal":True}
  ]},
  {"title":"Equivalent Resistance — Ladder Network","steps":[
    {"text":"Two 6 Ω resistors in parallel (=3 Ω), in series with 7 Ω, in parallel with 10 Ω. Find R_eq.","latex":"","isFinal":False},
    {"text":"Step 1: parallel pair → 3 Ω","latex":"R_{12} = 3\\text{ Ω}","isFinal":False},
    {"text":"Step 2: 3 + 7 = 10 Ω, in parallel with 10 Ω","latex":"R_{eq} = \\frac{10 \\times 10}{20} = 5\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Measuring Unknown Resistance","steps":[
    {"text":"Unknown R is in parallel with 20 Ω. Total current = 3 A from 30 V. Find R.","latex":"","isFinal":False},
    {"text":"Effective resistance R_eff = V/I = 30/3 = 10 Ω","latex":"","isFinal":False},
    {"text":"1/R_eff = 1/R + 1/20 → 1/R = 1/10 − 1/20 = 1/20","latex":"R = 20\\text{ Ω}","isFinal":True}
  ]}
],

"kirchhoffs-laws": [
  {"title":"KCL at a Junction","steps":[
    {"text":"At a junction: I₁ = 5 A and I₂ = 3 A flow in; I₃ flows out. Find I₃.","latex":"","isFinal":False},
    {"text":"KCL: sum of currents in = sum of currents out","latex":"I_3 = I_1 + I_2 = 5 + 3 = 8\\text{ A}","isFinal":True}
  ]},
  {"title":"KVL around a Simple Loop","steps":[
    {"text":"A 12 V battery, 3 Ω and 9 Ω resistors in series. Verify KVL.","latex":"","isFinal":False},
    {"text":"Current I = 12/(3+9) = 1 A","latex":"","isFinal":False},
    {"text":"Sum of voltage drops = I×3 + I×9 = 3 + 9 = 12 V = EMF ✓","latex":"V_{EMF} = V_{R1} + V_{R2} \\Rightarrow 12 = 3 + 9 = 12\\checkmark","isFinal":True}
  ]},
  {"title":"Two-Mesh KVL","steps":[
    {"text":"Loop 1: 10 V source, 2 Ω and 4 Ω resistors. Loop 2: 6 V source, 4 Ω and 3 Ω sharing 4 Ω with Loop 1. Find loop currents I₁, I₂.","latex":"","isFinal":False},
    {"text":"KVL Loop 1: 10 = 2I₁ + 4(I₁ − I₂) = 6I₁ − 4I₂","latex":"6I_1 - 4I_2 = 10\\quad\\text{...(1)}","isFinal":False},
    {"text":"KVL Loop 2: 6 = 3I₂ + 4(I₂ − I₁) = −4I₁ + 7I₂","latex":"-4I_1 + 7I_2 = 6\\quad\\text{...(2)}","isFinal":False},
    {"text":"Solve: From (1)×7 + (2)×4: 42I₁−28I₂−16I₁+28I₂=70+24 → 26I₁=94 → I₁≈3.62 A, then I₂≈(6+4×3.62)/7≈2.92 A","latex":"I_1 \\approx 3.62\\text{ A}, \\quad I_2 \\approx 2.92\\text{ A}","isFinal":True}
  ]},
  {"title":"Finding an Unknown EMF","steps":[
    {"text":"KVL around loop: EMF₁ = 20 V, R₁ = 4 Ω, I = 2 A, R₂ = 3 Ω, unknown EMF₂. Find EMF₂.","latex":"","isFinal":False},
    {"text":"KVL: EMF₁ − IR₁ − IR₂ − EMF₂ = 0","latex":"20 - 2(4) - 2(3) - EMF_2 = 0","isFinal":False},
    {"text":"Solve","latex":"EMF_2 = 20 - 8 - 6 = 6\\text{ V}","isFinal":True}
  ]},
  {"title":"Node Voltage Method","steps":[
    {"text":"Node V between R₁ = 4 Ω (to 12 V) and R₂ = 6 Ω (to 0 V). Find node voltage.","latex":"","isFinal":False},
    {"text":"KCL: (12 − V)/4 = V/6","latex":"","isFinal":False},
    {"text":"Solve: 3(12−V) = 2V → 36 = 5V → V = 7.2 V","latex":"V = 7.2\\text{ V}","isFinal":True}
  ]},
  {"title":"Wheatstone Bridge Balance","steps":[
    {"text":"Wheatstone bridge: R₁ = 100 Ω, R₂ = 150 Ω, R₃ = 200 Ω. Find R₄ for balance.","latex":"","isFinal":False},
    {"text":"Balance condition: R₁/R₂ = R₃/R₄","latex":"\\frac{100}{150} = \\frac{200}{R_4}","isFinal":False},
    {"text":"Solve","latex":"R_4 = \\frac{200 \\times 150}{100} = 300\\text{ Ω}","isFinal":True}
  ]},
  {"title":"Three-Node Circuit","steps":[
    {"text":"Node A connected by 2 Ω to 10 V, 3 Ω to 0 V, and 6 Ω to another node B (grounded). Find V_A.","latex":"","isFinal":False},
    {"text":"KCL at A: (10 − V_A)/2 = V_A/3 + V_A/6","latex":"","isFinal":False},
    {"text":"Multiply through by 6: 3(10−V_A) = 2V_A + V_A → 30 = 6V_A → V_A = 5 V","latex":"V_A = 5\\text{ V}","isFinal":True}
  ]},
  {"title":"Current in Each Branch","steps":[
    {"text":"12 V battery in series with 4 Ω, connected to two parallel resistors of 6 Ω and 12 Ω. Find current in each resistor.","latex":"","isFinal":False},
    {"text":"Parallel R₂₃ = 6×12/18 = 4 Ω. Total R = 4 + 4 = 8 Ω. Total I = 12/8 = 1.5 A.","latex":"I_{total} = 1.5\\text{ A}","isFinal":False},
    {"text":"Voltage across parallel part = 1.5 × 4 = 6 V","latex":"I_{6\\Omega} = \\frac{6}{6} = 1\\text{ A}, \\quad I_{12\\Omega} = \\frac{6}{12} = 0.5\\text{ A}","isFinal":True}
  ]},
  {"title":"Power in a Network","steps":[
    {"text":"From the above circuit (12 V, 4 Ω series, parallel 6 and 12 Ω): find total power and power in each element.","latex":"","isFinal":False},
    {"text":"Total power P = V × I_total = 12 × 1.5 = 18 W","latex":"P_{total} = 18\\text{ W}","isFinal":False},
    {"text":"P(4Ω) = 1.5²×4 = 9 W; P(6Ω) = 1²×6 = 6 W; P(12Ω) = 0.5²×12 = 3 W. Total = 18 W ✓","latex":"9 + 6 + 3 = 18\\text{ W}\\checkmark","isFinal":True}
  ]},
  {"title":"Superposition Theorem","steps":[
    {"text":"Two batteries: V₁ = 10 V through R₁ = 5 Ω; V₂ = 6 V through R₂ = 3 Ω; both connected to R₃ = 6 Ω. Use superposition to find I₃.","latex":"","isFinal":False},
    {"text":"V₁ alone: R₂||R₃ = 3×6/9 = 2 Ω; I_total = 10/7; I₃' = (10/7)×(3/9) = 10/21 A","latex":"I_3' = \\frac{10}{21}\\text{ A}","isFinal":False},
    {"text":"V₂ alone: R₁||R₃ = 5×6/11; I_total = 6/(3+30/11)=... I₃'' ≈ 0.325 A; total I₃ = I₃' + I₃'' ≈ 0.476 + 0.325 ≈ 0.80 A","latex":"I_3 \\approx 0.80\\text{ A (approximate)}","isFinal":True}
  ]}
],

"magnetic-fields": [
  {"title":"Magnetic Field from a Long Straight Wire","steps":[
    {"text":"A wire carries 5 A. Find the magnetic field 0.1 m away. (μ₀ = 4π×10⁻⁷ T·m/A)","latex":"","isFinal":False},
    {"text":"B = μ₀I/(2πr)","latex":"B = \\frac{4\\pi\\times10^{-7} \\times 5}{2\\pi \\times 0.1} = \\frac{2\\times10^{-6}}{0.2} = 10^{-5}\\text{ T} = 10\\text{ μT}","isFinal":True}
  ]},
  {"title":"Force Between Two Parallel Wires","steps":[
    {"text":"Two wires 0.05 m apart, both carrying 10 A in the same direction. Find the force per unit length.","latex":"","isFinal":False},
    {"text":"F/L = μ₀I₁I₂/(2πd)","latex":"\\frac{F}{L} = \\frac{4\\pi\\times10^{-7} \\times 10 \\times 10}{2\\pi \\times 0.05} = \\frac{4\\times10^{-5}}{0.1} = 4\\times10^{-4}\\text{ N/m (attractive)}","isFinal":True}
  ]},
  {"title":"Field at Centre of a Circular Loop","steps":[
    {"text":"A circular coil of radius 0.1 m carries 2 A. Find the field at the centre.","latex":"","isFinal":False},
    {"text":"B = μ₀I/(2r)","latex":"B = \\frac{4\\pi\\times10^{-7} \\times 2}{2 \\times 0.1} = \\frac{8\\pi\\times10^{-7}}{0.2} = 4\\pi\\times10^{-6} \\approx 12.6\\text{ μT}","isFinal":True}
  ]},
  {"title":"Solenoid Magnetic Field","steps":[
    {"text":"A solenoid: 500 turns, 0.2 m long, carries 3 A. Find the interior field.","latex":"","isFinal":False},
    {"text":"n = N/L = 500/0.2 = 2500 turns/m","latex":"","isFinal":False},
    {"text":"B = μ₀nI","latex":"B = 4\\pi\\times10^{-7} \\times 2500 \\times 3 = 4\\pi\\times10^{-7} \\times 7500 \\approx 9.42\\times10^{-3}\\text{ T}","isFinal":True}
  ]},
  {"title":"Right-Hand Rule — Field Direction","steps":[
    {"text":"A wire carries current pointing out of the page. Use the right-hand rule to find the direction of B at a point directly above the wire.","latex":"","isFinal":False},
    {"text":"Thumb points out of page (current direction). Fingers curl: above the wire they point to the left.","latex":"","isFinal":False},
    {"text":"B field at the point above is directed to the LEFT.","latex":"\\vec{B}\\text{ at point above} \\rightarrow \\text{left}","isFinal":True}
  ]},
  {"title":"Magnetic Flux","steps":[
    {"text":"A 0.5 m² loop is in a 0.04 T field at 30° to the normal. Find the magnetic flux.","latex":"","isFinal":False},
    {"text":"Φ = BA cosθ (θ is angle between B and normal to loop)","latex":"\\Phi = 0.04 \\times 0.5 \\times \\cos 30° = 0.02 \\times 0.866 = 0.01732\\text{ Wb}","isFinal":True}
  ]},
  {"title":"Toroid Magnetic Field","steps":[
    {"text":"A toroid (mean radius 0.1 m, 1000 turns, 4 A). Find B inside.","latex":"","isFinal":False},
    {"text":"B = μ₀NI/(2πr)","latex":"B = \\frac{4\\pi\\times10^{-7} \\times 1000 \\times 4}{2\\pi \\times 0.1} = \\frac{4\\pi\\times10^{-7} \\times 4000}{0.628} = 8\\times10^{-3}\\text{ T} = 8\\text{ mT}","isFinal":True}
  ]},
  {"title":"Helmholtz Coils","steps":[
    {"text":"Two coils (N = 100 turns each, radius R = 0.1 m, I = 2 A) are spaced R apart. Find field at midpoint.","latex":"","isFinal":False},
    {"text":"For Helmholtz coil at midpoint: B = 0.7155 μ₀NI/R","latex":"B = 0.7155 \\times \\frac{4\\pi\\times10^{-7} \\times 100 \\times 2}{0.1} = 0.7155 \\times 2.513\\times10^{-3} \\approx 1.79\\times10^{-3}\\text{ T}","isFinal":True}
  ]},
  {"title":"Magnetic Field vs Distance (Inverse Law)","steps":[
    {"text":"A wire at 0.05 m produces B = 40 μT. Find B at 0.2 m from the wire.","latex":"","isFinal":False},
    {"text":"B ∝ 1/r for a long wire","latex":"\\frac{B_2}{B_1} = \\frac{r_1}{r_2} = \\frac{0.05}{0.2} = 0.25","isFinal":False},
    {"text":"B₂ = 0.25 × 40 = 10 μT","latex":"B_2 = 10\\text{ μT}","isFinal":True}
  ]},
  {"title":"Earth's Magnetic Field — Compass Needle","steps":[
    {"text":"A compass needle aligns with Earth's B ≈ 50 μT. A wire 0.1 m below carries current I. Find I that would produce B equal to Earth's.","latex":"","isFinal":False},
    {"text":"B = μ₀I/(2πr) = 50 μT","latex":"I = \\frac{2\\pi r B}{\\mu_0} = \\frac{2\\pi \\times 0.1 \\times 50\\times10^{-6}}{4\\pi\\times10^{-7}} = \\frac{3.14\\times10^{-5}}{4\\pi\\times10^{-7}} = 25\\text{ A}","isFinal":True}
  ]}
],

"magnetic-force-charges": [
  {"title":"Force on a Moving Charge","steps":[
    {"text":"A proton (q = 1.6×10⁻¹⁹ C) moves at 3×10⁶ m/s perpendicular to B = 0.5 T. Find the magnetic force.","latex":"","isFinal":False},
    {"text":"F = qvB sinθ (θ = 90°)","latex":"F = 1.6\\times10^{-19} \\times 3\\times10^6 \\times 0.5 = 2.4\\times10^{-13}\\text{ N}","isFinal":True}
  ]},
  {"title":"Radius of Circular Motion","steps":[
    {"text":"An electron (m = 9.11×10⁻³¹ kg, q = 1.6×10⁻¹⁹ C) moves at 2×10⁶ m/s in B = 0.01 T. Find the radius of its circular path.","latex":"","isFinal":False},
    {"text":"Magnetic force provides centripetal force: qvB = mv²/r → r = mv/(qB)","latex":"r = \\frac{mv}{qB} = \\frac{9.11\\times10^{-31} \\times 2\\times10^6}{1.6\\times10^{-19} \\times 0.01}","isFinal":False},
    {"text":"Calculate","latex":"r = \\frac{1.822\\times10^{-24}}{1.6\\times10^{-21}} = 1.14\\times10^{-3}\\text{ m} = 1.14\\text{ mm}","isFinal":True}
  ]},
  {"title":"Force on a Current-Carrying Wire","steps":[
    {"text":"A 0.3 m wire carries 4 A in B = 0.5 T (perpendicular). Find the force.","latex":"","isFinal":False},
    {"text":"F = BIL","latex":"F = 0.5 \\times 4 \\times 0.3 = 0.6\\text{ N}","isFinal":True}
  ]},
  {"title":"Force at an Angle","steps":[
    {"text":"A 1 m wire carries 5 A at 60° to a 0.4 T field. Find the force.","latex":"","isFinal":False},
    {"text":"F = BIL sinθ","latex":"F = 0.4 \\times 5 \\times 1 \\times \\sin 60° = 2 \\times 0.866 = 1.73\\text{ N}","isFinal":True}
  ]},
  {"title":"Velocity Selector","steps":[
    {"text":"A velocity selector has E = 2×10⁴ V/m and B = 0.01 T. What speed passes through undeflected?","latex":"","isFinal":False},
    {"text":"Electric and magnetic forces balance: qE = qvB","latex":"v = \\frac{E}{B} = \\frac{2\\times10^4}{0.01} = 2\\times10^6\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Torque on a Current Loop","steps":[
    {"text":"A 0.05 m × 0.08 m rectangular loop carries 2 A in a 0.3 T field. Find maximum torque.","latex":"","isFinal":False},
    {"text":"τ_max = NIAB (N=1 turn, sin90° = 1)","latex":"\\tau = 1 \\times 2 \\times (0.05 \\times 0.08) \\times 0.3 = 2 \\times 0.004 \\times 0.3 = 2.4\\times10^{-3}\\text{ N·m}","isFinal":True}
  ]},
  {"title":"Mass Spectrometer","steps":[
    {"text":"In a mass spectrometer, B = 0.08 T and v = 4×10⁵ m/s. An ion (q = 1.6×10⁻¹⁹ C) has radius r = 0.25 m. Find the mass.","latex":"","isFinal":False},
    {"text":"r = mv/(qB) → m = qBr/v","latex":"m = \\frac{1.6\\times10^{-19} \\times 0.08 \\times 0.25}{4\\times10^5} = \\frac{3.2\\times10^{-21}}{4\\times10^5} = 8\\times10^{-27}\\text{ kg}","isFinal":False},
    {"text":"≈ 8 × 1.67×10⁻²⁷ kg ≈ atomic mass 4.8 (roughly oxygen isotope range)","latex":"m \\approx 8\\times10^{-27}\\text{ kg}","isFinal":True}
  ]},
  {"title":"Cyclotron Frequency","steps":[
    {"text":"Find the cyclotron frequency of a proton in B = 0.5 T. (m_p = 1.67×10⁻²⁷ kg, q = 1.6×10⁻¹⁹ C)","latex":"","isFinal":False},
    {"text":"f_c = qB/(2πm)","latex":"f_c = \\frac{1.6\\times10^{-19} \\times 0.5}{2\\pi \\times 1.67\\times10^{-27}} = \\frac{8\\times10^{-20}}{1.05\\times10^{-26}} \\approx 7.62\\times10^6\\text{ Hz} = 7.62\\text{ MHz}","isFinal":True}
  ]},
  {"title":"Hall Effect","steps":[
    {"text":"A conductor carries I = 5 A in a B = 0.2 T field (perpendicular to both current and width w = 0.01 m). Carrier density n = 10²⁸/m³, charge q = 1.6×10⁻¹⁹ C, thickness t = 0.001 m. Find Hall voltage.","latex":"","isFinal":False},
    {"text":"Hall voltage V_H = IB/(nqt)","latex":"V_H = \\frac{5 \\times 0.2}{10^{28} \\times 1.6\\times10^{-19} \\times 0.001} = \\frac{1}{1.6\\times10^{6}} = 6.25\\times10^{-7}\\text{ V}","isFinal":True}
  ]},
  {"title":"Charged Particle in Crossed Fields","steps":[
    {"text":"An electron (q = −1.6×10⁻¹⁹ C) enters a region with E = 5000 V/m (up) and B = 0.01 T (into page), moving right. Find the net force.","latex":"","isFinal":False},
    {"text":"Electric force: F_E = qE = 1.6×10⁻¹⁹ × 5000 = 8×10⁻¹⁶ N downward (negative charge)","latex":"F_E = 8\\times10^{-16}\\text{ N downward}","isFinal":False},
    {"text":"For this to equal the magnetic force (upward for electron moving right in B into page), equilibrium requires v = E/B = 5×10⁵ m/s","latex":"v_{equilibrium} = \\frac{E}{B} = 5\\times10^5\\text{ m/s}","isFinal":True}
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
