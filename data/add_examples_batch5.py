#!/usr/bin/env python3
"""Batch 5: doppler-effect, pressure-pascal, buoyancy, bernoulli,
heat-temperature, ideal-gas-law, laws-thermodynamics, heat-engines"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"doppler-effect": [
  {"title":"Source Moving Toward Observer","steps":[
    {"text":"An ambulance siren at 600 Hz moves toward a stationary listener at 30 m/s. Speed of sound = 340 m/s. Find observed frequency.","latex":"","isFinal":False},
    {"text":"Doppler formula (source approaching): f' = f × v/(v − v_s)","latex":"f' = 600 \\times \\frac{340}{340 - 30} = 600 \\times \\frac{340}{310}","isFinal":False},
    {"text":"Calculate","latex":"f' = 600 \\times 1.097 \\approx 658\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Source Moving Away","steps":[
    {"text":"Same ambulance now moving away at 30 m/s. Find the observed frequency.","latex":"","isFinal":False},
    {"text":"Doppler formula (source receding): f' = f × v/(v + v_s)","latex":"f' = 600 \\times \\frac{340}{340 + 30} = 600 \\times \\frac{340}{370}","isFinal":False},
    {"text":"Calculate","latex":"f' = 600 \\times 0.919 \\approx 551\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Observer Moving Toward Source","steps":[
    {"text":"A stationary siren (500 Hz). An observer cycles toward it at 10 m/s. v_sound = 340 m/s. Find f'.","latex":"","isFinal":False},
    {"text":"Observer approaching: f' = f × (v + v_o)/v","latex":"f' = 500 \\times \\frac{340 + 10}{340} = 500 \\times \\frac{350}{340} \\approx 515\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Observer Moving Away","steps":[
    {"text":"Same siren (500 Hz), observer moves away at 10 m/s. Find f'.","latex":"","isFinal":False},
    {"text":"Observer receding: f' = f × (v − v_o)/v","latex":"f' = 500 \\times \\frac{340 - 10}{340} = 500 \\times \\frac{330}{340} \\approx 485\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Both Source and Observer Moving","steps":[
    {"text":"Source (400 Hz, 20 m/s toward observer) and observer (15 m/s toward source). v = 340 m/s.","latex":"","isFinal":False},
    {"text":"General Doppler formula","latex":"f' = f \\times \\frac{v + v_o}{v - v_s} = 400 \\times \\frac{340 + 15}{340 - 20}","isFinal":False},
    {"text":"Calculate","latex":"f' = 400 \\times \\frac{355}{320} \\approx 444\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Speed of Source from Frequency Shift","steps":[
    {"text":"A train whistle at 480 Hz. Stationary observer hears 510 Hz as it approaches. Find train speed (v = 340 m/s).","latex":"","isFinal":False},
    {"text":"510 = 480 × 340/(340 − v_s) → 340 − v_s = 480×340/510","latex":"340 - v_s = \\frac{163200}{510} = 320","isFinal":False},
    {"text":"v_s = 340 − 320 = 20 m/s","latex":"v_s = 20\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Doppler Radar","steps":[
    {"text":"A radar gun emits 24 GHz. A car approaches at 30 m/s. What is the shift in frequency? (c = 3×10⁸ m/s)","latex":"","isFinal":False},
    {"text":"For electromagnetic waves (v >> source speed): Δf ≈ 2f v/c","latex":"\\Delta f = \\frac{2 \\times 24\\times10^9 \\times 30}{3\\times10^8} = \\frac{1.44\\times10^{12}}{3\\times10^8} = 4800\\text{ Hz} = 4.8\\text{ kHz}","isFinal":True}
  ]},
  {"title":"Redshift of a Star","steps":[
    {"text":"A spectral line at 656 nm (hydrogen Hα) is observed at 669 nm. Find the recession velocity of the star.","latex":"","isFinal":False},
    {"text":"Doppler redshift (non-relativistic): Δλ/λ = v/c","latex":"\\frac{\\Delta\\lambda}{\\lambda} = \\frac{669-656}{656} = \\frac{13}{656} = 0.01982","isFinal":False},
    {"text":"","latex":"v = 0.01982 \\times 3\\times10^8 \\approx 5.95\\times10^6\\text{ m/s} = 5950\\text{ km/s}","isFinal":True}
  ]},
  {"title":"Sonic Boom Angle","steps":[
    {"text":"An aircraft travels at Mach 2 (twice the speed of sound). Find the half-angle of the Mach cone.","latex":"","isFinal":False},
    {"text":"sin θ = v_sound / v_aircraft = 1/M","latex":"\\sin\\theta = \\frac{1}{2} \\Rightarrow \\theta = 30°","isFinal":True}
  ]},
  {"title":"Doppler Ultrasound","steps":[
    {"text":"Ultrasound at 5 MHz reflects off blood moving at 0.3 m/s toward the probe. v_sound_in_tissue = 1540 m/s. Find frequency shift.","latex":"","isFinal":False},
    {"text":"Δf ≈ 2f v_blood/v_sound (both the transmitted and reflected wave shift)","latex":"\\Delta f = \\frac{2 \\times 5\\times10^6 \\times 0.3}{1540} \\approx \\frac{3\\times10^6}{1540} \\approx 1948\\text{ Hz} \\approx 1.95\\text{ kHz}","isFinal":True}
  ]}
],

"pressure-pascal": [
  {"title":"Pressure from Force and Area","steps":[
    {"text":"A 60 N force acts on an area of 0.015 m². Find the pressure.","latex":"","isFinal":False},
    {"text":"P = F/A","latex":"P = \\frac{60}{0.015} = 4000\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Hydrostatic Pressure","steps":[
    {"text":"Find the pressure at depth 15 m in sea water (ρ = 1025 kg/m³, g = 9.8 m/s², atm = 101 325 Pa).","latex":"","isFinal":False},
    {"text":"Total pressure = atmospheric + hydrostatic","latex":"P = P_0 + \\rho g h = 101325 + 1025 \\times 9.8 \\times 15","isFinal":False},
    {"text":"","latex":"P = 101325 + 150675 = 252\\,000\\text{ Pa} \\approx 2.49\\text{ atm}","isFinal":True}
  ]},
  {"title":"Pascal's Law — Hydraulic Lift","steps":[
    {"text":"A hydraulic press has piston areas A₁ = 0.01 m² and A₂ = 0.5 m². A force of 200 N is applied to A₁. Find the force exerted by A₂.","latex":"","isFinal":False},
    {"text":"Pascal's Law: pressure is transmitted equally → P₁ = P₂","latex":"\\frac{F_1}{A_1} = \\frac{F_2}{A_2}","isFinal":False},
    {"text":"Solve for F₂","latex":"F_2 = F_1 \\times \\frac{A_2}{A_1} = 200 \\times \\frac{0.5}{0.01} = 10\\,000\\text{ N}","isFinal":True}
  ]},
  {"title":"Manometer Reading","steps":[
    {"text":"A U-tube manometer with water (ρ = 1000 kg/m³). One side is 8 cm higher than the other. Find the gauge pressure difference.","latex":"","isFinal":False},
    {"text":"Gauge pressure ΔP = ρgh","latex":"\\Delta P = 1000 \\times 9.8 \\times 0.08 = 784\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Tire Pressure Conversion","steps":[
    {"text":"A tyre is inflated to 35 psi (gauge). Convert to Pa gauge and absolute. (1 psi = 6895 Pa, atm = 101 325 Pa)","latex":"","isFinal":False},
    {"text":"Gauge pressure","latex":"P_{gauge} = 35 \\times 6895 = 241\\,325\\text{ Pa} \\approx 241\\text{ kPa}","isFinal":False},
    {"text":"Absolute pressure","latex":"P_{abs} = 241325 + 101325 = 342\\,650\\text{ Pa} \\approx 342.7\\text{ kPa}","isFinal":True}
  ]},
  {"title":"Force on a Dam Wall","steps":[
    {"text":"Estimate the average pressure on a rectangular dam wall (height 10 m, width 50 m) filled with water.","latex":"","isFinal":False},
    {"text":"Average pressure = ρg × (h/2) (pressure at mid-depth)","latex":"P_{avg} = 1000 \\times 9.8 \\times 5 = 49\\,000\\text{ Pa}","isFinal":False},
    {"text":"Total force = P_avg × Area","latex":"F = 49000 \\times (10 \\times 50) = 24.5\\times10^6\\text{ N}","isFinal":True}
  ]},
  {"title":"Pressure at Bottom of a Tank","steps":[
    {"text":"A cylindrical tank (radius 1 m, height 3 m) is filled with oil (ρ = 850 kg/m³). Find the pressure at the base.","latex":"","isFinal":False},
    {"text":"Pressure at base = ρgh (depth = 3 m)","latex":"P = 850 \\times 9.8 \\times 3 = 24\\,990\\text{ Pa} \\approx 25\\text{ kPa (gauge)}","isFinal":True}
  ]},
  {"title":"Blood Pressure","steps":[
    {"text":"Blood pressure is 120/80 mmHg. Convert systolic pressure to Pa and kPa. (1 mmHg = 133.3 Pa)","latex":"","isFinal":False},
    {"text":"Systolic (120 mmHg)","latex":"P = 120 \\times 133.3 = 15\\,996\\text{ Pa} \\approx 16\\text{ kPa}","isFinal":True}
  ]},
  {"title":"Pressure with Different Fluids","steps":[
    {"text":"Two cylinders same height 0.5 m: one with water (1000), one with mercury (13 600 kg/m³). Find the pressure at the bottom of each.","latex":"","isFinal":False},
    {"text":"Water column","latex":"P_w = 1000 \\times 9.8 \\times 0.5 = 4900\\text{ Pa}","isFinal":False},
    {"text":"Mercury column","latex":"P_{Hg} = 13600 \\times 9.8 \\times 0.5 = 66\\,640\\text{ Pa} \\approx 13.6\\times P_w","isFinal":True}
  ]},
  {"title":"Pressure and Weight","steps":[
    {"text":"A 70 kg person stands on one foot (sole area 0.018 m²). Find the pressure on the floor.","latex":"","isFinal":False},
    {"text":"P = F/A = mg/A","latex":"P = \\frac{70 \\times 9.8}{0.018} = \\frac{686}{0.018} \\approx 38\\,111\\text{ Pa} \\approx 38.1\\text{ kPa}","isFinal":True}
  ]}
],

"buoyancy": [
  {"title":"Buoyant Force on a Submerged Object","steps":[
    {"text":"A 0.002 m³ rock is fully submerged in water (ρ = 1000 kg/m³). Find the buoyant force.","latex":"","isFinal":False},
    {"text":"Archimedes' Principle: F_b = ρ_fluid × V_displaced × g","latex":"F_b = 1000 \\times 0.002 \\times 9.8 = 19.6\\text{ N}","isFinal":True}
  ]},
  {"title":"Apparent Weight in Water","steps":[
    {"text":"A 5 kg metal block (density 8000 kg/m³) is submerged in water. Find its apparent weight.","latex":"","isFinal":False},
    {"text":"Volume of block V = m/ρ = 5/8000 = 6.25×10⁻⁴ m³","latex":"V = \\frac{5}{8000} = 6.25\\times10^{-4}\\text{ m}^3","isFinal":False},
    {"text":"Buoyant force","latex":"F_b = 1000 \\times 6.25\\times10^{-4} \\times 9.8 = 6.125\\text{ N}","isFinal":False},
    {"text":"Apparent weight = Weight − Buoyancy","latex":"W_{app} = 5 \\times 9.8 - 6.125 = 49 - 6.125 = 42.9\\text{ N}","isFinal":True}
  ]},
  {"title":"Will It Float?","steps":[
    {"text":"A wooden block (ρ = 600 kg/m³) is placed in water (ρ = 1000 kg/m³). Does it float or sink? What fraction is submerged?","latex":"","isFinal":False},
    {"text":"Since ρ_wood < ρ_water, the block floats. At equilibrium: ρ_fluid × V_sub = ρ_block × V_total","latex":"\\frac{V_{sub}}{V_{total}} = \\frac{\\rho_{block}}{\\rho_{fluid}} = \\frac{600}{1000} = 0.6","isFinal":False},
    {"text":"60% of the block is submerged, 40% above water.","latex":"","isFinal":True}
  ]},
  {"title":"Density from Apparent Weight","steps":[
    {"text":"An object weighs 20 N in air and 14 N when fully submerged in water. Find its density.","latex":"","isFinal":False},
    {"text":"Buoyant force = 20 − 14 = 6 N = ρ_w g V","latex":"V = \\frac{6}{1000 \\times 9.8} = 6.12\\times10^{-4}\\text{ m}^3","isFinal":False},
    {"text":"Mass = W/g = 20/9.8 = 2.04 kg; density = m/V","latex":"\\rho = \\frac{2.04}{6.12\\times10^{-4}} \\approx 3333\\text{ kg/m}^3","isFinal":True}
  ]},
  {"title":"Ship Loading","steps":[
    {"text":"A ship (empty mass 50 000 kg) floats in seawater (ρ = 1025 kg/m³). Its hull volume below waterline = 60 m³. How much cargo can it carry?","latex":"","isFinal":False},
    {"text":"Maximum buoyant force = ρ_sw × V × g = 1025 × 60 × 9.8 = 602 700 N","latex":"F_{b,max} = 602700\\text{ N}","isFinal":False},
    {"text":"Maximum total weight = 602 700 N → max total mass = 61 500 kg","latex":"m_{cargo} = 61500 - 50000 = 11\\,500\\text{ kg}","isFinal":True}
  ]},
  {"title":"Balloon Lift","steps":[
    {"text":"A balloon (V = 1000 m³) is filled with helium (ρ = 0.18 kg/m³) in air (ρ = 1.25 kg/m³). Find the net upward force.","latex":"","isFinal":False},
    {"text":"Buoyant force upward = ρ_air × V × g","latex":"F_b = 1.25 \\times 1000 \\times 9.8 = 12\\,250\\text{ N}","isFinal":False},
    {"text":"Weight of helium downward = ρ_He × V × g = 0.18 × 1000 × 9.8 = 1764 N","latex":"F_{net} = 12250 - 1764 = 10\\,486\\text{ N upward (before basket weight)}","isFinal":True}
  ]},
  {"title":"Plimsoll Line","steps":[
    {"text":"A ship displaces 5000 m³ in fresh water (ρ = 1000 kg/m³). How much does it displace in seawater (ρ = 1025 kg/m³)?","latex":"","isFinal":False},
    {"text":"Weight is same in both: ρ_fw × V_fw = ρ_sw × V_sw","latex":"V_{sw} = \\frac{1000 \\times 5000}{1025} \\approx 4878\\text{ m}^3","isFinal":False},
    {"text":"Ship rides higher in seawater (displaces less volume).","latex":"","isFinal":True}
  ]},
  {"title":"Buoyancy of Irregular Object","steps":[
    {"text":"An irregular rock is submerged in water (ρ = 1000 kg/m³) using a string. String tension decreases by 3.5 N when submerged. Find the rock's volume.","latex":"","isFinal":False},
    {"text":"Reduction in tension = buoyant force = ρ_w g V","latex":"V = \\frac{F_b}{\\rho_w g} = \\frac{3.5}{1000 \\times 9.8} = 3.57\\times10^{-4}\\text{ m}^3","isFinal":True}
  ]},
  {"title":"Ice Floating in Water","steps":[
    {"text":"Ice (ρ = 917 kg/m³) floats in water (ρ = 1000 kg/m³). Find the fraction submerged.","latex":"","isFinal":False},
    {"text":"Fraction submerged = ρ_ice / ρ_water","latex":"\\frac{V_{sub}}{V_{total}} = \\frac{917}{1000} = 0.917 = 91.7\\%","isFinal":False},
    {"text":"About 91.7% of an iceberg is below water — only 8.3% is visible.","latex":"","isFinal":True}
  ]},
  {"title":"Archimedes' Gold Crown","steps":[
    {"text":"A crown weighs 14.7 N in air and 13.4 N in water. Is it pure gold (ρ = 19 300 kg/m³)?","latex":"","isFinal":False},
    {"text":"Buoyant force = 14.7 − 13.4 = 1.3 N; volume V = 1.3/(1000×9.8) = 1.327×10⁻⁴ m³","latex":"V = 1.327\\times10^{-4}\\text{ m}^3","isFinal":False},
    {"text":"Mass = 14.7/9.8 = 1.5 kg; density = 1.5/1.327×10⁻⁴ ≈ 11 300 kg/m³ ≠ 19 300 → not pure gold","latex":"\\rho = \\frac{1.5}{1.327\\times10^{-4}} \\approx 11\\,300\\text{ kg/m}^3 \\neq 19300","isFinal":True}
  ]}
],

"bernoulli": [
  {"title":"Bernoulli's Principle — Venturi Tube","steps":[
    {"text":"Water flows through a wide pipe (A₁ = 0.04 m², v₁ = 2 m/s) into a narrow pipe (A₂ = 0.01 m²). Find v₂.","latex":"","isFinal":False},
    {"text":"Continuity equation: A₁v₁ = A₂v₂","latex":"v_2 = \\frac{A_1 v_1}{A_2} = \\frac{0.04 \\times 2}{0.01} = 8\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Pressure Drop in a Constriction","steps":[
    {"text":"Same pipes as above (ρ = 1000 kg/m³, P₁ = 150 000 Pa). Find P₂ (horizontal pipe).","latex":"","isFinal":False},
    {"text":"Apply Bernoulli's equation (horizontal, same height)","latex":"P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2","isFinal":False},
    {"text":"Solve for P₂","latex":"P_2 = 150000 + \\frac{1}{2}(1000)(4 - 64) = 150000 - 30000 = 120\\,000\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Torricelli's Theorem","steps":[
    {"text":"A large tank has water at height h = 0.8 m above a small hole. Find the exit speed of water.","latex":"","isFinal":False},
    {"text":"Torricelli's theorem: v = √(2gh)","latex":"v = \\sqrt{2 \\times 9.8 \\times 0.8} = \\sqrt{15.68} \\approx 3.96\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Lift on an Airfoil (Qualitative)","steps":[
    {"text":"Air flows over a wing at 80 m/s (top) and 60 m/s (bottom). ρ_air = 1.2 kg/m³. Find pressure difference (Bernoulli).","latex":"","isFinal":False},
    {"text":"P_bottom − P_top = ½ρ(v_top² − v_bottom²)","latex":"\\Delta P = \\frac{1}{2} \\times 1.2 \\times (80^2 - 60^2) = 0.6 \\times (6400 - 3600) = 0.6 \\times 2800 = 1680\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Flow Rate","steps":[
    {"text":"Water exits a hose (diameter 2 cm) at 4 m/s. Find the volume flow rate.","latex":"","isFinal":False},
    {"text":"Q = Av = π r² v","latex":"Q = \\pi \\times (0.01)^2 \\times 4 = \\pi \\times 10^{-4} \\times 4 = 1.257\\times10^{-3}\\text{ m}^3/\\text{s}","isFinal":True}
  ]},
  {"title":"Syringe Problem","steps":[
    {"text":"A doctor pushes a syringe plunger (A_plunger = 5 cm²) at 0.02 m/s. Find fluid speed at needle (A_needle = 0.05 cm²).","latex":"","isFinal":False},
    {"text":"Continuity: A₁v₁ = A₂v₂","latex":"v_{needle} = \\frac{5 \\times 0.02}{0.05} = 2\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Bernoulli with Height Change","steps":[
    {"text":"Water at P₁ = 200 000 Pa, v₁ = 1 m/s, h₁ = 0. It reaches h₂ = 3 m with v₂ = 1 m/s. Find P₂. (ρ = 1000 kg/m³)","latex":"","isFinal":False},
    {"text":"Bernoulli's full equation","latex":"P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2","isFinal":False},
    {"text":"Since v₁ = v₂, simplify","latex":"P_2 = P_1 - \\rho g (h_2 - h_1) = 200000 - 1000 \\times 9.8 \\times 3 = 200000 - 29400 = 170\\,600\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Spray Atomizer","steps":[
    {"text":"Air blows at 20 m/s over a small tube dipping in liquid (ρ = 1.2 kg/m³). Find the pressure drop above the tube.","latex":"","isFinal":False},
    {"text":"Bernoulli: pressure at fast-moving air is lower than static air","latex":"\\Delta P = \\frac{1}{2}\\rho v^2 = \\frac{1}{2} \\times 1.2 \\times 400 = 240\\text{ Pa}","isFinal":False},
    {"text":"This 240 Pa below atmospheric sucks the liquid up the tube into the airstream.","latex":"","isFinal":True}
  ]},
  {"title":"Pipe with Two Heights","steps":[
    {"text":"Pipe narrows from A₁ = 0.02 m² at h₁ = 0 to A₂ = 0.005 m² at h₂ = 2 m. v₁ = 1.5 m/s, P₁ = 180 000 Pa, ρ = 1000 kg/m³. Find P₂.","latex":"","isFinal":False},
    {"text":"Continuity: v₂ = v₁A₁/A₂ = 1.5×4 = 6 m/s","latex":"v_2 = 6\\text{ m/s}","isFinal":False},
    {"text":"Bernoulli","latex":"P_2 = 180000 + \\frac{1}{2}(1000)(1.5^2 - 6^2) - 1000(9.8)(2) = 180000 - 15750 - 19600 = 144\\,650\\text{ Pa}","isFinal":True}
  ]},
  {"title":"Pitot Tube","steps":[
    {"text":"An aircraft pitot tube stagnates air (v=0) at stagnation pressure 104 500 Pa. Static pressure = 101 325 Pa. ρ = 1.2 kg/m³. Find airspeed.","latex":"","isFinal":False},
    {"text":"Bernoulli between free stream and stagnation point: ½ρv² = P_stag − P_static","latex":"v = \\sqrt{\\frac{2(P_{stag} - P_{static})}{\\rho}} = \\sqrt{\\frac{2 \\times 3175}{1.2}} = \\sqrt{5292} \\approx 72.7\\text{ m/s}","isFinal":True}
  ]}
],

"heat-temperature": [
  {"title":"Converting Temperature Scales","steps":[
    {"text":"Convert 37°C (body temperature) to Fahrenheit and Kelvin.","latex":"","isFinal":False},
    {"text":"Fahrenheit","latex":"T_F = \\frac{9}{5} T_C + 32 = \\frac{9}{5}(37) + 32 = 66.6 + 32 = 98.6°F","isFinal":False},
    {"text":"Kelvin","latex":"T_K = T_C + 273.15 = 37 + 273.15 = 310.15\\text{ K}","isFinal":True}
  ]},
  {"title":"Heat Absorbed by Water","steps":[
    {"text":"How much heat is needed to raise 2 kg of water from 20°C to 80°C? (c = 4200 J/kg·K)","latex":"","isFinal":False},
    {"text":"Q = mcΔT","latex":"Q = 2 \\times 4200 \\times (80 - 20) = 2 \\times 4200 \\times 60 = 504\\,000\\text{ J} = 504\\text{ kJ}","isFinal":True}
  ]},
  {"title":"Mixing Hot and Cold Water","steps":[
    {"text":"200 g of water at 80°C is mixed with 300 g at 20°C. Find equilibrium temperature. (c same)","latex":"","isFinal":False},
    {"text":"Heat lost by hot = heat gained by cold: m₁c(T₁ − Tf) = m₂c(Tf − T₂)","latex":"200(80 - T_f) = 300(T_f - 20)","isFinal":False},
    {"text":"Solve","latex":"16000 - 200T_f = 300T_f - 6000 \\Rightarrow 500T_f = 22000 \\Rightarrow T_f = 44°C","isFinal":True}
  ]},
  {"title":"Latent Heat of Fusion","steps":[
    {"text":"How much heat is needed to melt 0.5 kg of ice at 0°C? (L_f = 334 000 J/kg)","latex":"","isFinal":False},
    {"text":"Q = mL_f","latex":"Q = 0.5 \\times 334000 = 167\\,000\\text{ J} = 167\\text{ kJ}","isFinal":True}
  ]},
  {"title":"Latent Heat of Vaporisation","steps":[
    {"text":"Steam condenses at 100°C to water: 0.2 kg. How much heat is released? (L_v = 2.26×10⁶ J/kg)","latex":"","isFinal":False},
    {"text":"Q = mL_v (heat released on condensation)","latex":"Q = 0.2 \\times 2.26\\times10^6 = 452\\,000\\text{ J} = 452\\text{ kJ}","isFinal":True}
  ]},
  {"title":"Thermal Expansion of a Rod","steps":[
    {"text":"A 2 m steel rod (α = 1.2×10⁻⁵ /°C) is heated from 20°C to 120°C. Find the increase in length.","latex":"","isFinal":False},
    {"text":"ΔL = αL₀ΔT","latex":"\\Delta L = 1.2\\times10^{-5} \\times 2 \\times 100 = 2.4\\times10^{-3}\\text{ m} = 2.4\\text{ mm}","isFinal":True}
  ]},
  {"title":"Specific Heat — Unknown Metal","steps":[
    {"text":"A 0.2 kg metal is heated to 200°C and dropped into 0.5 kg water at 25°C. Equilibrium = 35°C. Find metal's specific heat.","latex":"","isFinal":False},
    {"text":"Heat lost by metal = heat gained by water","latex":"0.2 \\times c_m \\times (200 - 35) = 0.5 \\times 4200 \\times (35 - 25)","isFinal":False},
    {"text":"Solve for c_m","latex":"c_m = \\frac{0.5 \\times 4200 \\times 10}{0.2 \\times 165} = \\frac{21000}{33} \\approx 636\\text{ J/kg·K (aluminium ~900)}","isFinal":True}
  ]},
  {"title":"Heating a Substance Through Multiple Phases","steps":[
    {"text":"Calculate the total heat needed to convert 0.3 kg ice at −20°C to steam at 100°C. (c_ice = 2100, L_f = 334 000, c_water = 4200, L_v = 2 260 000 J/kg·K)","latex":"","isFinal":False},
    {"text":"Stage 1: heat ice to 0°C; Stage 2: melt ice; Stage 3: heat water to 100°C; Stage 4: vaporise","latex":"Q_1 = 0.3 \\times 2100 \\times 20 = 12600\\text{ J}","isFinal":False},
    {"text":"Q₂ = 0.3×334 000 = 100 200 J; Q₃ = 0.3×4200×100 = 126 000 J; Q₄ = 0.3×2 260 000 = 678 000 J","latex":"Q_{total} = 12600+100200+126000+678000 = 916\\,800\\text{ J}","isFinal":True}
  ]},
  {"title":"Conduction Rate","steps":[
    {"text":"A glass window (k = 0.8 W/m·K, area 1.5 m², thickness 4 mm) has T_inside = 20°C and T_outside = −5°C. Find heat loss rate.","latex":"","isFinal":False},
    {"text":"Fourier's Law: P = kA ΔT / d","latex":"P = \\frac{0.8 \\times 1.5 \\times 25}{0.004} = \\frac{30}{0.004} = 7500\\text{ W}","isFinal":True}
  ]},
  {"title":"Stefan–Boltzmann Radiation","steps":[
    {"text":"A black body of area 0.5 m² at 500 K. Find the radiated power. (σ = 5.67×10⁻⁸ W/m²·K⁴)","latex":"","isFinal":False},
    {"text":"P = σAT⁴","latex":"P = 5.67\\times10^{-8} \\times 0.5 \\times (500)^4 = 5.67\\times10^{-8} \\times 0.5 \\times 6.25\\times10^{10} \\approx 1772\\text{ W}","isFinal":True}
  ]}
],

"ideal-gas-law": [
  {"title":"Finding Pressure with PV = nRT","steps":[
    {"text":"2 mol of ideal gas occupies 0.05 m³ at 300 K. Find the pressure. (R = 8.314 J/mol·K)","latex":"","isFinal":False},
    {"text":"PV = nRT → P = nRT/V","latex":"P = \\frac{2 \\times 8.314 \\times 300}{0.05} = \\frac{4988}{0.05} = 99\\,763\\text{ Pa} \\approx 100\\text{ kPa}","isFinal":True}
  ]},
  {"title":"Boyle's Law","steps":[
    {"text":"A gas at 150 kPa occupies 0.04 m³ (constant T). What volume at 300 kPa?","latex":"","isFinal":False},
    {"text":"Boyle's Law: P₁V₁ = P₂V₂","latex":"V_2 = \\frac{P_1 V_1}{P_2} = \\frac{150 \\times 0.04}{300} = 0.02\\text{ m}^3","isFinal":True}
  ]},
  {"title":"Charles' Law","steps":[
    {"text":"A gas at 27°C = 300 K has volume 2 L. It is heated to 127°C = 400 K (constant P). Find new volume.","latex":"","isFinal":False},
    {"text":"Charles' Law: V₁/T₁ = V₂/T₂","latex":"V_2 = V_1 \\times \\frac{T_2}{T_1} = 2 \\times \\frac{400}{300} = 2.67\\text{ L}","isFinal":True}
  ]},
  {"title":"Gay-Lussac's Law","steps":[
    {"text":"A sealed container at 300 K has pressure 100 kPa. It is heated to 450 K. Find new pressure.","latex":"","isFinal":False},
    {"text":"Gay-Lussac's: P₁/T₁ = P₂/T₂","latex":"P_2 = P_1 \\times \\frac{T_2}{T_1} = 100 \\times \\frac{450}{300} = 150\\text{ kPa}","isFinal":True}
  ]},
  {"title":"Combined Gas Law","steps":[
    {"text":"Gas: P₁ = 120 kPa, V₁ = 3 L, T₁ = 300 K. New state: P₂ = 160 kPa, T₂ = 400 K. Find V₂.","latex":"","isFinal":False},
    {"text":"Combined: P₁V₁/T₁ = P₂V₂/T₂","latex":"V_2 = \\frac{P_1 V_1 T_2}{T_1 P_2} = \\frac{120 \\times 3 \\times 400}{300 \\times 160} = \\frac{144000}{48000} = 3\\text{ L}","isFinal":True}
  ]},
  {"title":"Number of Moles","steps":[
    {"text":"A 10 L container holds gas at 200 kPa and 27°C = 300 K. Find the number of moles.","latex":"","isFinal":False},
    {"text":"n = PV/RT (convert: V = 0.01 m³, P = 200 000 Pa)","latex":"n = \\frac{200000 \\times 0.01}{8.314 \\times 300} = \\frac{2000}{2494} \\approx 0.802\\text{ mol}","isFinal":True}
  ]},
  {"title":"RMS Speed of Gas Molecules","steps":[
    {"text":"Find the rms speed of nitrogen molecules (M = 0.028 kg/mol) at 300 K.","latex":"","isFinal":False},
    {"text":"v_rms = √(3RT/M)","latex":"v_{rms} = \\sqrt{\\frac{3 \\times 8.314 \\times 300}{0.028}} = \\sqrt{\\frac{7483}{0.028}} = \\sqrt{267250} \\approx 517\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Ideal Gas at STP","steps":[
    {"text":"How many moles occupy 22.4 L at STP (T = 273.15 K, P = 101 325 Pa)?","latex":"","isFinal":False},
    {"text":"n = PV/RT","latex":"n = \\frac{101325 \\times 0.0224}{8.314 \\times 273.15} = \\frac{2269.7}{2271} \\approx 1.00\\text{ mol}","isFinal":False},
    {"text":"Confirming: 1 mole occupies 22.4 L at STP — Avogadro's standard.","latex":"","isFinal":True}
  ]},
  {"title":"Temperature from Kinetic Theory","steps":[
    {"text":"Find the temperature at which oxygen molecules (M = 0.032 kg/mol) have v_rms = 500 m/s.","latex":"","isFinal":False},
    {"text":"From v_rms = √(3RT/M) → T = Mv²_rms/(3R)","latex":"T = \\frac{0.032 \\times 500^2}{3 \\times 8.314} = \\frac{8000}{24.94} \\approx 321\\text{ K} \\approx 48°C","isFinal":True}
  ]},
  {"title":"Pressure from Molecular Kinetics","steps":[
    {"text":"0.5 mol of gas has average translational KE per molecule = 6.21×10⁻²¹ J. Find the temperature and pressure in a 10 L container.","latex":"","isFinal":False},
    {"text":"Average KE = (3/2)k_BT → T = 2KE/(3k_B)","latex":"T = \\frac{2 \\times 6.21\\times10^{-21}}{3 \\times 1.38\\times10^{-23}} = \\frac{1.242\\times10^{-20}}{4.14\\times10^{-23}} = 300\\text{ K}","isFinal":False},
    {"text":"Pressure","latex":"P = \\frac{nRT}{V} = \\frac{0.5 \\times 8.314 \\times 300}{0.01} = 124\\,710\\text{ Pa} \\approx 125\\text{ kPa}","isFinal":True}
  ]}
],

"laws-thermodynamics": [
  {"title":"First Law — Internal Energy Change","steps":[
    {"text":"500 J of heat is added to a gas and 200 J of work is done by the gas. Find the change in internal energy.","latex":"","isFinal":False},
    {"text":"First Law: ΔU = Q − W","latex":"\\Delta U = 500 - 200 = 300\\text{ J}","isFinal":True}
  ]},
  {"title":"Work Done by an Ideal Gas","steps":[
    {"text":"An ideal gas expands at constant pressure 150 kPa from 0.02 m³ to 0.05 m³. Find the work done by the gas.","latex":"","isFinal":False},
    {"text":"W = PΔV (isobaric process)","latex":"W = 150000 \\times (0.05 - 0.02) = 150000 \\times 0.03 = 4500\\text{ J}","isFinal":True}
  ]},
  {"title":"Isothermal Process","steps":[
    {"text":"2 mol of ideal gas expands isothermally at T = 300 K from V₁ = 0.01 m³ to V₂ = 0.04 m³. Find work done by gas.","latex":"","isFinal":False},
    {"text":"W = nRT ln(V₂/V₁)","latex":"W = 2 \\times 8.314 \\times 300 \\times \\ln\\!\\left(\\frac{0.04}{0.01}\\right) = 4988 \\times \\ln 4 = 4988 \\times 1.386 = 6913\\text{ J}","isFinal":True}
  ]},
  {"title":"Isochoric Process (Constant Volume)","steps":[
    {"text":"500 J of heat is added to a gas in a rigid container. Find the work done and change in internal energy.","latex":"","isFinal":False},
    {"text":"Rigid container → ΔV = 0 → W = 0","latex":"W = P\\Delta V = 0","isFinal":False},
    {"text":"From First Law: ΔU = Q − W = 500 − 0 = 500 J","latex":"\\Delta U = 500\\text{ J}","isFinal":True}
  ]},
  {"title":"Entropy Change","steps":[
    {"text":"1 kg of water absorbs 100 kJ of heat reversibly at 100°C = 373 K. Find the entropy change.","latex":"","isFinal":False},
    {"text":"ΔS = Q/T (reversible process)","latex":"\\Delta S = \\frac{100000}{373} \\approx 268\\text{ J/K}","isFinal":True}
  ]},
  {"title":"Second Law — Direction of Heat Flow","steps":[
    {"text":"600 J flows spontaneously from a 400 K hot body to a 300 K cold body. Find total entropy change.","latex":"","isFinal":False},
    {"text":"ΔS_hot = −Q/T_hot (heat lost)","latex":"\\Delta S_{hot} = -\\frac{600}{400} = -1.5\\text{ J/K}","isFinal":False},
    {"text":"ΔS_cold = +Q/T_cold","latex":"\\Delta S_{cold} = +\\frac{600}{300} = +2.0\\text{ J/K}","isFinal":False},
    {"text":"Total ΔS = 2.0 − 1.5 = 0.5 J/K > 0 → confirms irreversible process (2nd Law).","latex":"\\Delta S_{total} = 0.5\\text{ J/K} > 0 \\checkmark","isFinal":True}
  ]},
  {"title":"Zeroth Law — Thermal Equilibrium","steps":[
    {"text":"Object A is in thermal equilibrium with Object B. Object B is in equilibrium with Object C. What can we say about A and C?","latex":"","isFinal":False},
    {"text":"Zeroth Law of Thermodynamics: if A = B and B = C (in thermal equilibrium), then A = C.","latex":"T_A = T_B \\text{ and } T_B = T_C \\Rightarrow T_A = T_C","isFinal":False},
    {"text":"A and C are at the same temperature and would be in thermal equilibrium with each other.","latex":"","isFinal":True}
  ]},
  {"title":"Adiabatic Process","steps":[
    {"text":"A gas undergoes adiabatic compression. 300 J of work is done ON the gas. Find ΔU.","latex":"","isFinal":False},
    {"text":"Adiabatic: Q = 0. Work done on gas = −W (convention: W positive when done by gas).","latex":"W = -300\\text{ J (done BY gas)}","isFinal":False},
    {"text":"ΔU = Q − W = 0 − (−300) = +300 J","latex":"\\Delta U = +300\\text{ J (temperature rises)}","isFinal":True}
  ]},
  {"title":"Third Law","steps":[
    {"text":"What does the Third Law of Thermodynamics state, and what is the significance of absolute zero?","latex":"","isFinal":False},
    {"text":"Third Law: the entropy of a perfect crystal at absolute zero is zero.","latex":"S \\to 0 \\text{ as } T \\to 0\\text{ K}","isFinal":False},
    {"text":"Absolute zero (0 K) is the temperature at which molecular motion is minimised. It is unattainable in practice but serves as a reference for entropy calculations.","latex":"","isFinal":True}
  ]},
  {"title":"Total Heat in a Cycle","steps":[
    {"text":"A thermodynamic cycle has: Q_in = 800 J absorbed and W_net = 200 J done by system. Find Q_out.","latex":"","isFinal":False},
    {"text":"For a complete cycle, ΔU = 0 (returns to initial state).","latex":"\\Delta U = 0 \\Rightarrow Q_{net} = W_{net}","isFinal":False},
    {"text":"Q_net = Q_in − Q_out = W_net → Q_out = Q_in − W_net","latex":"Q_{out} = 800 - 200 = 600\\text{ J}","isFinal":True}
  ]}
],

"heat-engines": [
  {"title":"Carnot Efficiency","steps":[
    {"text":"A Carnot engine operates between T_H = 600 K and T_C = 300 K. Find the efficiency.","latex":"","isFinal":False},
    {"text":"η_Carnot = 1 − T_C/T_H","latex":"\\eta = 1 - \\frac{300}{600} = 1 - 0.5 = 0.5 = 50\\%","isFinal":True}
  ]},
  {"title":"Real Engine Efficiency","steps":[
    {"text":"An engine absorbs 1000 J of heat and produces 350 J of work. Find efficiency and heat rejected.","latex":"","isFinal":False},
    {"text":"Efficiency","latex":"\\eta = \\frac{W}{Q_H} = \\frac{350}{1000} = 35\\%","isFinal":False},
    {"text":"Heat rejected","latex":"Q_C = Q_H - W = 1000 - 350 = 650\\text{ J}","isFinal":True}
  ]},
  {"title":"Work from Efficiency","steps":[
    {"text":"A 40% efficient engine absorbs 2000 J per cycle. How much work is output per cycle?","latex":"","isFinal":False},
    {"text":"W = η × Q_H","latex":"W = 0.40 \\times 2000 = 800\\text{ J}","isFinal":True}
  ]},
  {"title":"Coefficient of Performance — Refrigerator","steps":[
    {"text":"A refrigerator removes 400 J from the cold reservoir using 100 J of work. Find COP.","latex":"","isFinal":False},
    {"text":"COP_fridge = Q_C / W","latex":"COP = \\frac{400}{100} = 4.0","isFinal":False},
    {"text":"Heat rejected to hot reservoir = Q_C + W = 500 J.","latex":"Q_H = 400 + 100 = 500\\text{ J}","isFinal":True}
  ]},
  {"title":"Maximum COP of a Refrigerator","steps":[
    {"text":"Find maximum COP of a refrigerator working between T_H = 300 K and T_C = 250 K.","latex":"","isFinal":False},
    {"text":"COP_max (Carnot refrigerator) = T_C / (T_H − T_C)","latex":"COP_{max} = \\frac{250}{300 - 250} = \\frac{250}{50} = 5.0","isFinal":True}
  ]},
  {"title":"Heat Pump COP","steps":[
    {"text":"A heat pump delivers 1200 J to a building per cycle, using 300 J of work. Find COP_hp.","latex":"","isFinal":False},
    {"text":"COP_hp = Q_H / W","latex":"COP_{hp} = \\frac{1200}{300} = 4.0","isFinal":True}
  ]},
  {"title":"Carnot Engine — Work and Heat","steps":[
    {"text":"A Carnot engine (T_H = 500 K, T_C = 200 K) absorbs 3000 J. Find work output and heat rejected.","latex":"","isFinal":False},
    {"text":"Efficiency η = 1 − 200/500 = 0.6","latex":"\\eta = 0.6","isFinal":False},
    {"text":"Work = η × Q_H = 0.6 × 3000 = 1800 J; Q_C = 3000 − 1800 = 1200 J","latex":"W = 1800\\text{ J}, \\quad Q_C = 1200\\text{ J}","isFinal":True}
  ]},
  {"title":"Power Output of Engine","steps":[
    {"text":"A car engine has efficiency 30%, fuel input 50 kW. Find useful power output.","latex":"","isFinal":False},
    {"text":"P_out = η × P_in","latex":"P_{out} = 0.30 \\times 50 = 15\\text{ kW}","isFinal":True}
  ]},
  {"title":"Fuel Economy","steps":[
    {"text":"A car engine (25% efficiency) burns petrol (energy density 34 MJ/L). At 80 km/h, the drag force is 600 N. How many km per litre?","latex":"","isFinal":False},
    {"text":"Power to overcome drag at 80 km/h = 80/3.6 m/s","latex":"P_{drag} = 600 \\times \\frac{80}{3.6} = 13333\\text{ W}","isFinal":False},
    {"text":"Fuel power needed = P_drag/η = 13333/0.25 = 53 333 W","latex":"","isFinal":False},
    {"text":"Fuel per km = Power / (speed × energy density) ","latex":"\\text{km/L} = \\frac{0.25 \\times 34\\times10^6 \\times (80/3.6)}{600 \\times 34\\times10^6 / (0.25 \\times 3.6)} \\approx \\frac{0.25 \\times 34\\times10^6}{600 \\times 1000 / 80} \\approx 11.3\\text{ km/L}","isFinal":True}
  ]},
  {"title":"Second Law Limit on Efficiency","steps":[
    {"text":"An engineer claims to build an engine with T_H = 800 K and T_C = 400 K that is 65% efficient. Is this possible?","latex":"","isFinal":False},
    {"text":"Carnot (maximum possible) efficiency","latex":"\\eta_{Carnot} = 1 - \\frac{400}{800} = 50\\%","isFinal":False},
    {"text":"65% > 50% — this violates the Second Law. Impossible!","latex":"65\\% > 50\\% \\Rightarrow \\text{IMPOSSIBLE (Second Law)}","isFinal":True}
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
