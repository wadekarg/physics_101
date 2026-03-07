"""Update Challenge Lab descriptions — Batch C: topics 31-45"""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

challenges = {
    "superposition": {
        "title": "Speaker Interference Pattern",
        "description": "Two speakers 3.0 m apart emit 680 Hz sound waves in phase. Speed of sound = 340 m/s. (a) Find the wavelength. (b) A listener is 4.0 m directly in front of one speaker and 5.0 m from the other. Find the path difference and determine if it is constructive or destructive interference. (c) Find positions (distance from the centre line) along a line 4.0 m from the speakers where destructive interference occurs. (d) How many nodal lines (destructive interference) exist between the two speakers?",
        "hint": "λ = v/f. Constructive: path diff = nλ. Destructive: path diff = (n+½)λ. For (b): PD = 5.0 − 4.0 = 1.0 m = 2λ (constructive). For (c): find positions where PD = ½λ, 1.5λ, 2.5λ using geometry.",
        "xpBonus": 75
    },
    "standing-waves": {
        "title": "Guitar String Harmonics",
        "description": "A guitar's B string (length 65 cm, mass per unit length μ = 5.0 × 10⁻⁴ kg/m) vibrates at 247 Hz fundamental frequency. (a) Find the wave speed on the string. (b) Calculate the string tension T using v = √(T/μ). (c) Find the frequencies of the 2nd, 3rd, and 4th harmonics. (d) The string is fretted 5 cm from one end — find the new fundamental frequency. (e) To tune the B string down to A (220 Hz), should tension increase or decrease? By what factor?",
        "hint": "Fundamental: λ₁ = 2L, v = f₁λ₁. Tension: T = v²μ. Harmonics: f_n = nf₁. Fretted: new L = 65 − 5 = 60 cm, new f₁ = v/(2×0.60). For tension: f ∝ √T, so T_new/T_old = (f_new/f_old)².",
        "xpBonus": 75
    },
    "doppler-effect": {
        "title": "Police Radar Speed Detection",
        "description": "A police radar gun emits 24 GHz microwaves. A car approaches and the reflected signal is 24.00320 GHz. Speed of light c = 3 × 10⁸ m/s. (a) Find the Doppler frequency shift Δf. (b) For radar: Δf = 2vf/c (factor of 2 because wave is reflected). Solve for the car's speed in m/s and km/h. (c) What reflected frequency corresponds to exactly 130 km/h? (d) Why does the radar formula have a factor of 2? Explain in terms of two separate Doppler shifts.",
        "hint": "Δf = f_reflected − f_emitted. Rearrange Δf = 2vf/c to get v = Δfc/(2f). The factor of 2 arises because: (1) the moving car receives a Doppler-shifted wave, then (2) re-emits it as a moving source — two shifts compound.",
        "xpBonus": 75
    },
    "pressure-pascal": {
        "title": "Hydraulic Car Jack",
        "description": "A hydraulic jack has a small piston (diameter 2.0 cm) and a large piston (diameter 16 cm). (a) Calculate cross-sectional areas of each piston. (b) A mechanic applies 200 N to the small piston — find the force on the large piston and the pressure transmitted. (c) A 1400 kg car needs lifting — is this jack sufficient? By what factor? (d) If the large piston must rise 30 cm to lift the car, how far must the small piston travel? (Use A₁d₁ = A₂d₂ for incompressible fluid.)",
        "hint": "Pascal's law: F₁/A₁ = F₂/A₂ = pressure. Area = π(d/2)². Area ratio = (D₂/D₁)² = 64. For volume conservation: A₁d₁ = A₂d₂, so d₁ = d₂×(A₂/A₁).",
        "xpBonus": 75
    },
    "buoyancy": {
        "title": "Testing the Purity of a Crown",
        "description": "A gold crown weighs 9.50 N in air. Submerged in water it weighs 8.85 N. (a) Find the buoyant force and use it to calculate the crown's volume (ρ_water = 1000 kg/m³). (b) Find the density of the crown. (c) Pure gold has density 19,300 kg/m³. Is the crown pure gold? (d) If the crown is a gold-silver alloy (ρ_silver = 10,500 kg/m³), find the percentage by volume of each metal. (e) What percentage by mass is gold?",
        "hint": "Buoyant force F_b = W_air − W_water. Volume V = F_b/(ρ_water × g). Density ρ = mass/volume. For alloy: ρ_alloy = f×ρ_gold + (1−f)×ρ_silver. Solve for f (volume fraction of gold).",
        "xpBonus": 75
    },
    "bernoulli": {
        "title": "Aircraft Wing Lift Calculation",
        "description": "An aircraft wing has total area 80 m². Air flows over the top at 240 m/s and under the bottom at 220 m/s. Air density ρ = 1.25 kg/m³. (a) Use Bernoulli's equation to find the pressure difference between top and bottom surfaces. (b) Calculate the lift force. (c) The aircraft has mass 70,000 kg — does this lift exceed weight? Find the excess lift force. (d) At take-off speed (80 m/s), the speed ratio top:bottom stays the same — recalculate lift. Can it take off? What is the minimum speed needed for lift = weight?",
        "hint": "Bernoulli: P + ½ρv² = constant. ΔP = ½ρ(v_bottom² − v_top²)... wait, top has lower pressure: ΔP = ½ρ(v_top² − v_bottom²). Lift = ΔP × A. At lower speeds: v_top and v_bottom scale with aircraft speed — so ΔP ∝ v².",
        "xpBonus": 75
    },
    "heat-temperature": {
        "title": "Steel Bridge Thermal Expansion",
        "description": "A steel bridge is 1200 m long at 0°C. Linear expansion coefficient α = 12 × 10⁻⁶ /°C. (a) Find the bridge length at 40°C (summer). (b) Calculate total thermal expansion in centimetres. (c) Expansion joints each absorb up to 5.0 cm. How many joints are needed? (d) A 200 m concrete road section (α = 10 × 10⁻⁶ /°C) is laid at 20°C with 2 cm gaps between sections. What is the highest temperature before sections start pressing against each other?",
        "hint": "ΔL = αL₀ΔT. Number of joints = total expansion / capacity per joint (round up). For concrete: set ΔL = 0.02 m (gap width), solve for ΔT, then T_max = T_initial + ΔT.",
        "xpBonus": 75
    },
    "ideal-gas-law": {
        "title": "Car Tyre Pressure Safety",
        "description": "A car tyre at 20°C contains gas at 200 kPa gauge pressure with volume 0.025 m³. Atmospheric pressure = 101 kPa. (a) Find absolute pressure and number of moles of gas. (b) After driving, temperature rises to 65°C — find new absolute pressure (volume constant). (c) Express the pressure rise as a percentage — is this a concern? (d) A puncture means gas slowly leaks until half the moles remain at 20°C. Find the new pressure. What is the new gauge pressure?",
        "hint": "Absolute P = gauge + atmospheric. Always use T in Kelvin (K = °C + 273). Constant volume: P₁/T₁ = P₂/T₂. For half moles at same T and V: P ∝ n, so new P = old P/2.",
        "xpBonus": 75
    },
    "laws-thermodynamics": {
        "title": "Refrigerator Efficiency",
        "description": "A refrigerator removes 150 J of heat from the cold interior per cycle. Its compressor does 60 J of work per cycle. (a) Find the heat dumped to the room (hot reservoir) per cycle. (b) Calculate the actual Coefficient of Performance (COP = Q_cold / W_in). (c) Find the COP of an ideal Carnot refrigerator operating between T_cold = 5°C and T_hot = 25°C (use Kelvin). (d) Compare actual vs Carnot COP. What does the Second Law say about this comparison? (e) Find the minimum work needed per cycle if COP = COP_Carnot.",
        "hint": "Energy conservation: Q_hot = Q_cold + W. COP = Q_cold/W. Carnot COP = T_cold/(T_hot − T_cold) in Kelvin. The 2nd Law states actual COP ≤ Carnot COP — real fridges are always less efficient than ideal.",
        "xpBonus": 75
    },
    "heat-engines": {
        "title": "Coal Power Station Efficiency",
        "description": "A steam power station burns coal to produce steam at 550°C; steam exhausts at 45°C. (a) Find the Carnot (maximum) efficiency. (b) The actual efficiency is 38%. Find useful work output per 1000 J of heat input. (c) Find heat wasted per 1000 J for the actual engine. (d) The station outputs 500 MW of electricity. Find fuel energy input per second and coal consumption per hour if coal provides 30 MJ/kg. (e) Why can't the actual efficiency equal the Carnot efficiency?",
        "hint": "All temperatures in Kelvin. Carnot efficiency η_C = 1 − T_cold/T_hot. Actual W = η_actual × Q_in. Waste heat = Q_in − W. Input rate = output power / efficiency. Real engines have friction, heat losses, non-ideal processes.",
        "xpBonus": 75
    },
    "coulombs-law": {
        "title": "Charged Spheres in Equilibrium",
        "description": "Two identical charged spheres (mass 0.015 kg each) hang from insulating strings of length 30 cm. They repel each other, each hanging at 10° from vertical. (a) Draw a free-body diagram showing tension, gravity, and electric force. (b) Resolve forces to find the electric force between the spheres. (c) Find the separation between the sphere centres. (d) Use Coulomb's law to find the charge on each sphere (assuming equal charges). (e) Compare the electric force to the gravitational force between the spheres.",
        "hint": "At equilibrium: F_electric = mg × tan(10°). Separation: r = 2L × sin(10°). Coulomb's law: F = kq²/r² → q = r√(F/k). For (e): F_grav = Gm²/r² — note the enormous ratio F_electric/F_grav.",
        "xpBonus": 75
    },
    "electric-fields": {
        "title": "Electron in a Cathode Ray Tube",
        "description": "Electrons are accelerated through 5000 V in a CRT. m_e = 9.11 × 10⁻³¹ kg, e = 1.6 × 10⁻¹⁹ C. (a) Find the KE gained and the final speed of each electron. (b) The electron enters a uniform electric field of 8000 V/m between plates 4.0 cm long (horizontal). Find vertical deflection while between the plates. (c) Find the deflection angle as the electron exits. (d) Find where the electron hits a screen 20 cm past the end of the plates.",
        "hint": "Energy: eV = ½mv² → v = √(2eV/m). In field: a = eE/m (vertical). Time in field: t = L/v_x. Deflection: y = ½at². Angle: tanθ = v_y/v_x. Extra deflection past plates: additional y = tanθ × 0.20 m.",
        "xpBonus": 75
    },
    "capacitors": {
        "title": "Camera Flash Energy",
        "description": "A camera flash uses a 2200 μF capacitor charged to 300 V. (a) Find the charge stored and energy stored. (b) The flash discharges through a 5 Ω flash tube. Find the time constant τ = RC. (c) After one time constant, voltage drops to V₀/e ≈ 0.37V₀. Find remaining charge and energy. (d) What fraction of the total energy is released in the first time constant? (e) Calculate how long it takes to discharge to 1% of initial voltage (t = τ × ln(100)).",
        "hint": "Q = CV, E = ½CV². Time constant τ = RC. After one τ: V₁ = V₀/e, so Q₁ = Q₀/e, E₁ = E₀/e². Fraction released = (E₀ − E₁)/E₀ = 1 − 1/e².",
        "xpBonus": 75
    },
    "ohms-law": {
        "title": "Kitchen Circuit Safety",
        "description": "A household circuit is protected by a 20 A fuse at 240 V. Appliances connected: kettle (2000 W), microwave (1200 W), toaster (800 W). (a) Find maximum power the circuit can supply. (b) Find the current drawn by each appliance. (c) Find total current — will the fuse blow? (d) Each appliance is used 30 min/day. Calculate total daily energy use (kWh) and monthly cost at $0.28/kWh (30 days). (e) The kettle's element has resistance R — find R at operating temperature.",
        "hint": "I = P/V. Check if total I > 20 A. Energy in kWh = (power in kW) × (time in hours). Kettle resistance: R = V²/P = 240²/2000.",
        "xpBonus": 75
    },
    "series-parallel": {
        "title": "LED Strip Circuit Design",
        "description": "24 identical LEDs (each: forward voltage 2.5 V, operating current 20 mA) must run from a 12 V supply. (a) How many LEDs per series string to get closest to 12 V total? Explain rounding. (b) With 4 LEDs per string, a series resistor drops the remaining voltage. Find resistor value and power dissipated. (c) How many parallel strings are needed for all 24 LEDs? (d) Find total current from supply and total power consumed. (e) Compare power consumed by LEDs vs wasted in resistors — calculate circuit efficiency.",
        "hint": "4 LEDs: 4 × 2.5 = 10 V drop, leaving 2 V for resistor. R = 2 V / 0.020 A. 24 LEDs ÷ 4 per string = 6 strings in parallel. Total I = 6 × 20 mA. Efficiency = (power in LEDs) / (total power).",
        "xpBonus": 75
    },
}

for slug, ch in challenges.items():
    if slug in data:
        data[slug]['challenge'] = ch
    else:
        print(f'WARNING: slug not found: {slug}')

p.write_text(json.dumps(data, indent=2, ensure_ascii=False))
loaded = json.loads(p.read_text())
print('Batch C done. Spot-check:')
for slug in challenges:
    title = loaded.get(slug, {}).get('challenge', {}).get('title', 'MISSING')
    print(f'  {slug}: {title}')
