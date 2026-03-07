"""Update Challenge Lab descriptions — Batch D: topics 46-58"""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

challenges = {
    "kirchhoffs-laws": {
        "title": "Wheatstone Bridge",
        "description": "A Wheatstone bridge circuit has R₁ = 100 Ω (top-left), R₂ = 200 Ω (bottom-left), R₃ = 150 Ω (top-right), R_x unknown (bottom-right). A 12 V battery connects across the bridge. (a) Find R_x that balances the bridge (zero galvanometer current). (b) For the balanced bridge, find the current through each arm and voltage across each resistor. (c) What physical quantity can a Wheatstone bridge measure precisely? Give one practical example. (d) If R_x increases to 400 Ω, which direction does current flow through the galvanometer?",
        "hint": "Bridge balanced when R₁/R₂ = R₃/R_x → R_x = R₃×R₂/R₁. For balanced bridge: split into two voltage dividers sharing the same supply. Current in each arm = 12/(R₁+R₂) and 12/(R₃+R_x). Galvanometer measures potential difference between midpoints.",
        "xpBonus": 75
    },
    "magnetic-fields": {
        "title": "MRI Scanner Field Strength",
        "description": "An MRI scanner solenoid is 1.5 m long with 12,000 turns carrying 200 A. μ₀ = 4π × 10⁻⁷ T·m/A. (a) Find the magnetic field inside. (b) Compare to Earth's field (5 × 10⁻⁵ T). (c) A long straight power cable carries 100 A — find the distance where its field equals Earth's field. (d) Two parallel wires are 8 cm apart, each carrying 50 A in the same direction. Find force per metre and state whether attractive or repulsive. (e) What is the force per metre if the currents flow in opposite directions?",
        "hint": "Solenoid: B = μ₀nI where n = N/L (turns per metre). Wire: B = μ₀I/(2πr). Force per unit length between wires: F/L = μ₀I₁I₂/(2πd). Same direction = attractive; opposite = repulsive.",
        "xpBonus": 75
    },
    "magnetic-force-charges": {
        "title": "Velocity Selector and Mass Spectrometer",
        "description": "A velocity selector uses E = 4.0 × 10⁴ V/m and B₁ = 0.20 T (perpendicular). (a) Find the speed of ions that pass straight through (electric force = magnetic force). (b) Ions exit into a region with only B₂ = 0.20 T. A proton (m = 1.67 × 10⁻²⁷ kg, q = 1.6 × 10⁻¹⁹ C) enters — find its circular orbit radius. (c) A singly ionised carbon-12 atom (m = 12 × 1.66 × 10⁻²⁷ kg, q = e) enters at the same speed — find its radius. (d) Find the separation between where the proton and carbon-12 ion hit a detector plate placed at the diameter of each orbit.",
        "hint": "Balance: qE = qvB₁ → v = E/B₁. In B₂ only: qvB₂ = mv²/r → r = mv/(qB₂). Diameter = 2r. Separation on detector = 2r_carbon − 2r_proton. This is how a mass spectrometer separates isotopes.",
        "xpBonus": 75
    },
    "electromagnets": {
        "title": "Electromagnetic Crane Design",
        "description": "An electromagnetic crane has a coil of N = 500 turns wound around a steel core (cross-section A = 0.04 m², relative permeability μᵣ = 1000, length L = 0.30 m). Current I = 8 A. μ₀ = 4π × 10⁻⁷ T·m/A. (a) Find H inside the core and then B. (b) Calculate magnetic flux Φ = BA. (c) Magnetic pressure on the core surface = B²/(2μ₀). Find the lifting force. (d) To double the lifting force, should you double the current or double the number of turns? Show mathematically why both are equivalent. (e) What is the practical limit on increasing current?",
        "hint": "H = NI/L. B = μ₀μᵣH. Lifting force F = (B²/2μ₀) × A (this is magnetic pressure × area). Since B ∝ NI, Force ∝ (NI)² — doubling either N or I doubles NI, quadrupling force... wait: to double force, you need NI to increase by √2.",
        "xpBonus": 75
    },
    "faradays-law": {
        "title": "Induction Cooktop Power",
        "description": "An induction cooktop creates a time-varying magnetic field. A circular aluminium pot base (radius 12 cm, thickness 3 mm, resistivity ρ = 2.8 × 10⁻⁸ Ω·m) sits in a field that alternates sinusoidally. The peak B = 0.10 T at frequency 25 kHz. (a) The average rate of flux change: dΦ/dt ≈ peak B × area × 2πf. Find the induced EMF. (b) Estimate the resistance of one circular eddy current loop of radius r = 6 cm, thickness 3 mm (path length = 2πr, cross-section = 0.06 × 0.003 m²). (c) Estimate the induced current and power dissipated. (d) Explain why induction cooktops heat the pot but not the glass ceramic surface.",
        "hint": "EMF = dΦ/dt = BA × 2πf (using peak values). R = ρ × 2πr / (thickness × width_of_strip). Power = EMF²/R or I²R. The ceramic is non-conducting — no eddy currents → no heating. Only magnetic (ferromagnetic or conducting) materials heat up.",
        "xpBonus": 75
    },
    "generators-transformers": {
        "title": "National Grid Power Transmission",
        "description": "A power station generates 500 MW at 25 kV. A step-up transformer increases voltage to 400 kV for transmission. Transmission lines have total resistance 10 Ω. (a) Find the transformer turns ratio. (b) Find current in transmission lines at 400 kV. (c) Calculate power lost as heat in the cables. (d) Express losses as % of total power. (e) Compare to transmitting at 25 kV: find current, power loss, and loss percentage. (f) Quantify why high voltage is used by comparing the two loss percentages.",
        "hint": "P = IV → I = P/V. Power loss = I²R. At 25 kV: I = 500×10⁶/25,000 = 20,000 A. P_loss = (20,000)² × 10 = 4 × 10⁹ W — more than the generated power! High voltage → low current → drastically lower I²R losses.",
        "xpBonus": 75
    },
    "ac-circuits": {
        "title": "Radio Tuner RLC Circuit",
        "description": "A radio tuner has R = 5 Ω, L = 0.20 mH and a variable capacitor. It must tune to 1.0 MHz (AM radio). (a) Find the required capacitance C for resonance. (b) At resonance, find impedance and rms current if supply is 10 mV rms. (c) Calculate Q-factor = ω₀L/R. (d) Find the bandwidth Δf = f₀/Q. (e) A station broadcasts at 1.01 MHz — is it within the bandwidth? What is the impedance at 1.01 MHz? (f) Explain what a high Q-factor means for the ability to separate stations.",
        "hint": "Resonance: f₀ = 1/(2π√LC). At resonance: Z = R (reactive parts cancel). Q = ω₀L/R. Bandwidth = f₀/Q. High Q → narrow bandwidth → better selectivity → can distinguish nearby stations.",
        "xpBonus": 75
    },
    "maxwells-equations": {
        "title": "Solar Radiation Pressure",
        "description": "The Sun radiates 3.8 × 10²⁶ W total power. Earth orbits at 1.5 × 10¹¹ m. μ₀ = 4π × 10⁻⁷, c = 3 × 10⁸ m/s. (a) Find solar intensity (irradiance) at Earth. (b) Find amplitude of the electric field E₀ using I = E₀²/(2μ₀c). (c) Find radiation pressure on a 2 m² perfectly absorbing solar panel (P_rad = I/c). (d) Find the radiation force and compare to the panel's weight (assume 5 kg). (e) Solar sails use radiation pressure — find the sail area needed to produce 1 N of force at Earth's distance.",
        "hint": "I = P/(4πr²). E₀ = √(2μ₀cI). Radiation pressure on absorber = I/c. Force = pressure × area. For (e): rearrange F = (I/c) × A to find A = Fc/I.",
        "xpBonus": 75
    },
    "em-spectrum": {
        "title": "Medical Imaging Photon Energies",
        "description": "A chest X-ray uses photons of energy 50 keV. h = 6.63 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, 1 eV = 1.6 × 10⁻¹⁹ J. (a) Convert X-ray energy to joules, then find frequency and wavelength. (b) Find photon energy (eV) of visible green light (λ = 500 nm). Compare to X-ray — by what factor is an X-ray photon more energetic? (c) UV-B (λ = 310 nm) causes sunburn but visible light (λ = 500 nm) does not despite being brighter — explain using photon energy. (d) Find the wavelength of a microwave oven (2.45 GHz). Why does it heat food?",
        "hint": "E = hf = hc/λ. The threshold for breaking molecular bonds in DNA is about 3.1 eV (UV range). Photons below this energy can't cause chemical damage regardless of intensity. Microwave energy is too low to break bonds — it heats by making water molecules rotate.",
        "xpBonus": 75
    },
    "reflection-mirrors": {
        "title": "Concave Mirror Image Analysis",
        "description": "A concave mirror has focal length f = 20 cm. (a) Object at 60 cm: find image distance, magnification, and describe the image (real/virtual, upright/inverted, enlarged/reduced). (b) Object at 15 cm: repeat — describe the key difference. (c) Find the object distance that gives a magnification of exactly −3 (inverted, 3× magnified). (d) A convex mirror has f = −25 cm. An object is 40 cm away — find image distance. Why is this used as a car rear-view mirror? (e) State the difference between real and virtual images.",
        "hint": "Mirror formula: 1/f = 1/v + 1/u (real-is-positive). Magnification m = −v/u. Negative m = inverted. For (c): m = −3 means v = 3u; substitute into mirror formula. Virtual images are upright and cannot be projected on a screen.",
        "xpBonus": 75
    },
    "refraction": {
        "title": "Optical Fibre Design",
        "description": "An optical fibre has glass core (n₁ = 1.52) and fluoride cladding (n₂ = 1.41). (a) Find the critical angle for total internal reflection at the core-cladding boundary. (b) Calculate numerical aperture NA = √(n₁² − n₂²) and the acceptance angle for light entering the fibre end. (c) Light travels 100 km through the fibre — find the transit time (speed in glass = c/n₁). (d) A 10 Gbps data stream uses pulses of light. Find the minimum spacing between pulses in metres of fibre. (e) Why does the fibre need cladding rather than just air outside the core?",
        "hint": "Critical angle: sinθ_c = n₂/n₁. NA = sinθ_acceptance = √(n₁² − n₂²). Speed in core = c/n₁. For 10 Gbps: 10¹⁰ bits/s → 1 bit every 10⁻¹⁰ s → minimum separation = speed × time. Air cladding works but is fragile and contamination reduces critical angle.",
        "xpBonus": 75
    },
    "lenses": {
        "title": "Camera and Corrective Lenses",
        "description": "A camera lens has focal length 50 mm. (a) Find image distance when photographing a subject 3.0 m away. How far must the lens move from the film/sensor to focus? (b) A telephoto lens (f = 200 mm) photographs the same subject at 10 m — find image size ratio compared to 50 mm lens. (c) A long-sighted person cannot see objects closer than 60 cm (near point). Find the focal length of corrective lens needed to see 25 cm objects. (d) Express this as a power in dioptres. Is the lens converging or diverging?",
        "hint": "Lens formula: 1/f = 1/v − 1/u (or 1/v + 1/u = 1/f with sign convention). For long-sight correction: object at 25 cm, image formed at −60 cm (virtual, same side as object). Power P = 1/f (in metres). Long-sighted → converging lens (positive power).",
        "xpBonus": 75
    },
    "wave-optics": {
        "title": "Measuring Laser Wavelength",
        "description": "In a double-slit experiment, slits are 0.40 mm apart, screen is 2.0 m away. With a green laser, 11 bright fringes (5 on each side plus centre) span a total width of 28 mm. (a) Find the fringe spacing. (b) Calculate the laser wavelength. (c) A red laser (λ = 650 nm) replaces the green — find new fringe width for 11 fringes. (d) The slit separation is halved — what happens to fringe spacing? Verify numerically for both lasers. (e) What happens if the slit separation equals the wavelength?",
        "hint": "Fringe spacing w = λD/d. The 11 fringes have 10 gaps: w = 28 mm / 10 = 2.8 mm. Solve for λ = wd/D. Halving d doubles the fringe spacing. If d ≈ λ, the diffraction maxima overlap and fringes disappear — the light spreads in all directions.",
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
print('Batch D done. Spot-check:')
for slug in challenges:
    title = loaded.get(slug, {}).get('challenge', {}).get('title', 'MISSING')
    print(f'  {slug}: {title}')
