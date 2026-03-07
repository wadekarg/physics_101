"""Add 3 new quiz questions per topic — Batch E: all remaining topics at 3 questions"""
import json
from pathlib import Path

p = Path('chapters.json')
raw = json.loads(p.read_text())
data = raw if isinstance(raw, list) else raw.get('chapters', raw)
slug_map = {}
for ch in data:
    for t in ch.get('topics', []):
        slug_map[t.get('slug', t.get('id', ''))] = t

new_questions = {
    "magnetic-force-charges": [
        {
            "question": "An electron moves at 3×10⁶ m/s perpendicular to a 0.5 T magnetic field. What is the radius of its circular path? (m_e = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C)",
            "options": ["0.034 mm", "0.034 m", "34 m", "3.4 mm"],
            "correct": 1,
            "explanation": "r = mv/(qB) = (9.11×10⁻³¹ × 3×10⁶)/(1.6×10⁻¹⁹ × 0.5) = 2.73×10⁻²⁴/8×10⁻²⁰ ≈ 0.034 m."
        },
        {
            "question": "A charged particle moves parallel to a magnetic field. The magnetic force on it is:",
            "options": ["Maximum", "Half the maximum", "Zero", "Inversely proportional to its speed"],
            "correct": 2,
            "explanation": "F = qvB sinθ. When the particle moves parallel to B, θ = 0°, so sin0° = 0 and F = 0."
        },
        {
            "question": "In a mass spectrometer, ions of the same charge but different masses are separated because heavier ions:",
            "options": ["Travel faster in the magnetic field", "Curve with a larger radius in the magnetic field", "Lose charge in the magnetic field", "Absorb more energy from the field"],
            "correct": 1,
            "explanation": "r = mv/(qB). For the same charge and speed, heavier ions (larger m) travel in a larger radius arc, landing farther from the source."
        }
    ],
    "electromagnets": [
        {
            "question": "Which of the following will increase the strength of an electromagnet?",
            "options": ["Decreasing the current", "Reducing the number of coil turns", "Adding a soft iron core", "Increasing the resistance of the wire"],
            "correct": 2,
            "explanation": "A soft iron core becomes magnetised and greatly amplifies the magnetic field, substantially increasing the electromagnet's strength."
        },
        {
            "question": "A solenoid has 500 turns, length 0.25 m, and carries 2 A. What is the magnetic field inside? (μ₀ = 4π×10⁻⁷ T·m/A)",
            "options": ["5.0×10⁻³ T", "2.5×10⁻³ T", "1.0×10⁻² T", "5.0×10⁻⁴ T"],
            "correct": 0,
            "explanation": "B = μ₀nI = μ₀(N/L)I = 4π×10⁻⁷ × (500/0.25) × 2 = 4π×10⁻⁷ × 2000 × 2 ≈ 5.03×10⁻³ T."
        },
        {
            "question": "Why is soft iron (not steel) used as the core of an electromagnet?",
            "options": ["Soft iron has higher electrical conductivity", "Soft iron is easily magnetised and demagnetised", "Soft iron retains its magnetism permanently", "Soft iron has no free electrons"],
            "correct": 1,
            "explanation": "Soft iron has high magnetic permeability and low coercivity — it magnetises strongly when current flows and demagnetises quickly when the current is switched off."
        }
    ],
    "faradays-law": [
        {
            "question": "A circular coil of 50 turns and area 0.01 m² is placed in a field that changes from 0.2 T to 0.8 T in 0.5 s. What is the induced EMF?",
            "options": ["0.12 V", "0.6 V", "6 V", "0.06 V"],
            "correct": 1,
            "explanation": "EMF = −N × ΔΦ/Δt = −50 × (0.8−0.2)×0.01 / 0.5 = −50 × 0.006/0.5 = −0.6 V. Magnitude = 0.6 V."
        },
        {
            "question": "What does Faraday's law relate?",
            "options": ["Current to resistance", "The rate of change of magnetic flux to induced EMF", "Voltage to charge stored", "The magnetic force on a moving charge"],
            "correct": 1,
            "explanation": "Faraday's law: EMF = −N(ΔΦ/Δt). The induced EMF equals the negative rate of change of magnetic flux linkage."
        },
        {
            "question": "A transformer core is made of laminated iron sheets rather than a solid block to:",
            "options": ["Increase the magnetic permeability", "Reduce eddy currents and energy losses", "Improve electrical conductivity", "Allow higher operating temperatures"],
            "correct": 1,
            "explanation": "Laminations interrupt the paths of eddy currents (induced circulating currents in the core), reducing I²R heating losses in the core."
        }
    ],
    "generators-transformers": [
        {
            "question": "A step-up transformer increases voltage by a factor of 10. By what factor does the current change (assuming ideal transformer)?",
            "options": ["Increases by 10", "Decreases by 10", "Stays the same", "Decreases by 100"],
            "correct": 1,
            "explanation": "Power is conserved in an ideal transformer: P = IV. If V increases by 10, I must decrease by 10 to keep P constant."
        },
        {
            "question": "In an AC generator, what is the role of slip rings?",
            "options": ["To reverse the current every half rotation", "To provide continuous connection to the rotating coil without reversing current", "To increase the output voltage", "To reduce friction on the axle"],
            "correct": 1,
            "explanation": "Slip rings allow the coil to rotate freely while maintaining continuous electrical contact, delivering AC output. A commutator (used in DC generators) reverses polarity."
        },
        {
            "question": "National electricity grids transmit at high voltage (e.g. 400 kV) primarily to:",
            "options": ["Increase the current for consumers", "Minimise power losses in the transmission cables", "Make the electricity cheaper to generate", "Increase the frequency of the AC supply"],
            "correct": 1,
            "explanation": "Transmission line power loss P = I²R. High voltage allows low current, drastically reducing resistive losses over long distances."
        }
    ],
    "maxwells-equations": [
        {
            "question": "Maxwell's modification to Ampere's law introduced the concept of:",
            "options": ["Magnetic monopoles", "Displacement current", "Static electric fields", "Gravitational waves"],
            "correct": 1,
            "explanation": "Maxwell added the displacement current term (ε₀ dΦ_E/dt) to Ampere's law, which predicts that a changing electric field produces a magnetic field — even in a vacuum."
        },
        {
            "question": "Which of Maxwell's equations states that magnetic monopoles do not exist?",
            "options": ["Gauss's law for electricity", "Gauss's law for magnetism (∇·B = 0)", "Faraday's law", "The Ampere-Maxwell law"],
            "correct": 1,
            "explanation": "Gauss's law for magnetism (∇·B = 0) states that magnetic field lines have no source or sink — they always form closed loops, implying no magnetic monopoles."
        },
        {
            "question": "Electromagnetic waves in a vacuum travel at speed c because:",
            "options": ["They carry electric charge", "The wave speed follows from Maxwell's equations: c = 1/√(μ₀ε₀)", "They have zero rest mass", "They travel only in straight lines"],
            "correct": 1,
            "explanation": "Maxwell showed that c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s. When he calculated this from electric and magnetic constants, it matched the measured speed of light — showing light is an EM wave."
        }
    ],
    "em-spectrum": [
        {
            "question": "Which part of the electromagnetic spectrum has the highest frequency?",
            "options": ["Radio waves", "Visible light", "X-rays", "Gamma rays"],
            "correct": 3,
            "explanation": "Gamma rays have the highest frequency (and shortest wavelength) in the electromagnetic spectrum, giving them the most energy per photon."
        },
        {
            "question": "All electromagnetic waves in a vacuum travel at the same speed regardless of:",
            "options": ["Their energy", "Their frequency or wavelength", "The direction of travel", "Their polarisation"],
            "correct": 1,
            "explanation": "All EM waves travel at c = 3×10⁸ m/s in a vacuum, regardless of frequency or wavelength. Their frequency and wavelength adjust to satisfy c = fλ."
        },
        {
            "question": "Mobile phones use which part of the EM spectrum to communicate?",
            "options": ["Infrared", "Visible light", "Microwaves / radio waves", "Ultraviolet"],
            "correct": 2,
            "explanation": "Mobile phones operate in the microwave/radio wave range (roughly 700 MHz – 6 GHz for 4G/5G), which can penetrate buildings and travel long distances."
        }
    ],
    "reflection-mirrors": [
        {
            "question": "A concave mirror has a focal length of 15 cm. An object is placed 45 cm in front of it. Where is the image?",
            "options": ["22.5 cm in front of mirror (real)", "22.5 cm behind mirror (virtual)", "45 cm in front (real)", "30 cm in front (real)"],
            "correct": 0,
            "explanation": "1/v + 1/u = 1/f → 1/v = 1/15 − 1/45 = 3/45 − 1/45 = 2/45, so v = 22.5 cm. Positive v means real image in front of mirror."
        },
        {
            "question": "A convex mirror always produces an image that is:",
            "options": ["Real, inverted, and magnified", "Virtual, upright, and diminished", "Real, upright, and diminished", "Virtual, inverted, and magnified"],
            "correct": 1,
            "explanation": "A convex (diverging) mirror always forms a virtual, upright, diminished image behind the mirror — useful for wide-field-of-view applications like car side mirrors."
        },
        {
            "question": "The law of reflection states that the angle of incidence equals the angle of reflection. Both angles are measured from:",
            "options": ["The mirror surface", "The normal to the mirror surface", "The horizontal", "The incoming ray"],
            "correct": 1,
            "explanation": "By convention, angles of incidence and reflection are always measured from the normal (perpendicular) to the reflecting surface, not from the surface itself."
        }
    ],
    "refraction": [
        {
            "question": "A ray of light passes from air (n = 1.0) into water (n = 1.33) at an angle of incidence of 45°. What is the angle of refraction? (sin 45° = 0.707)",
            "options": ["45°", "32°", "58°", "27°"],
            "correct": 1,
            "explanation": "Snell's law: n₁sinθ₁ = n₂sinθ₂ → sinθ₂ = 1.0 × 0.707/1.33 = 0.532, so θ₂ ≈ 32°. Light bends toward the normal entering water."
        },
        {
            "question": "Optical fibres transmit light using total internal reflection. This requires the light to travel:",
            "options": ["From a less dense medium to a denser medium", "At exactly the critical angle", "From a denser medium to a less dense medium at an angle greater than the critical angle", "Perpendicular to the fibre axis"],
            "correct": 2,
            "explanation": "Total internal reflection occurs when light travels from a denser medium to a less dense medium (e.g. glass to air) at an angle of incidence greater than the critical angle."
        },
        {
            "question": "A glass prism disperses white light into a spectrum because:",
            "options": ["Different colours reflect at different angles", "Different colours travel at different speeds in glass (different refractive indices)", "The prism absorbs some colours more than others", "Diffraction separates the wavelengths"],
            "correct": 1,
            "explanation": "Dispersion occurs because glass has a slightly different refractive index for each frequency of light. Violet light bends more than red light, separating the colours."
        }
    ],
    "time-dilation": [
        {
            "question": "A spaceship travels at 0.8c relative to Earth. Its onboard clock ticks at a rate that, to an Earth observer, appears:",
            "options": ["Faster than Earth clocks", "Slower than Earth clocks", "The same rate as Earth clocks", "Dependent on direction of travel"],
            "correct": 1,
            "explanation": "Time dilation (special relativity): moving clocks run slow from the perspective of a stationary observer. At 0.8c, γ = 1/√(1−0.64) = 1/0.6 ≈ 1.67, so the ship's clock runs at 1/1.67 ≈ 60% of Earth's rate."
        },
        {
            "question": "A muon created in the upper atmosphere at 0.99c has a rest-frame lifetime of 2.2 μs. What is its dilated lifetime as measured on Earth?",
            "options": ["2.2 μs", "15.6 μs", "0.31 μs", "22 μs"],
            "correct": 1,
            "explanation": "γ = 1/√(1−0.99²) = 1/√0.0199 ≈ 7.09. Dilated lifetime = γ × 2.2 = 7.09 × 2.2 ≈ 15.6 μs. This allows muons to reach Earth's surface."
        },
        {
            "question": "The twin paradox involves one twin travelling at high speed and returning to find their twin has aged more. The travelling twin ages less because:",
            "options": ["They accelerated, breaking the symmetry of the situation", "Gravity acts differently on them", "They carried a faster clock", "Special relativity does not apply to humans"],
            "correct": 0,
            "explanation": "The travelling twin undergoes acceleration (turning around), which breaks the symmetry between the two frames. Only the non-inertial (accelerating) twin has a preferred frame analysis, and they genuinely age less."
        }
    ],
    "length-contraction": [
        {
            "question": "A spaceship of rest length 100 m travels at 0.6c past Earth. What length does an Earth observer measure?",
            "options": ["100 m", "80 m", "60 m", "125 m"],
            "correct": 1,
            "explanation": "L = L₀/γ = L₀√(1 − v²/c²) = 100 × √(1 − 0.36) = 100 × 0.8 = 80 m. Objects appear shorter along the direction of motion."
        },
        {
            "question": "Length contraction occurs:",
            "options": ["In all directions equally", "Only in the direction of motion", "Only perpendicular to motion", "Only for objects with mass greater than 1 kg"],
            "correct": 1,
            "explanation": "Length contraction (Lorentz contraction) only affects dimensions along the direction of relative motion. Dimensions perpendicular to motion are unchanged."
        },
        {
            "question": "According to special relativity, an observer in a rocket sees stationary Earth objects as:",
            "options": ["Longer in the direction of flight", "Shorter in the direction of flight", "Unchanged in length", "Rotating"],
            "correct": 1,
            "explanation": "Length contraction is symmetric — each observer sees the other's objects as contracted along the direction of relative motion. Earth objects appear shorter to the rocket observer."
        }
    ],
    "emc-squared": [
        {
            "question": "A nuclear reaction converts 0.001 kg of mass entirely to energy. How much energy is released? (c = 3×10⁸ m/s)",
            "options": ["3×10⁵ J", "9×10¹³ J", "3×10¹¹ J", "9×10¹⁶ J"],
            "correct": 1,
            "explanation": "E = mc² = 0.001 × (3×10⁸)² = 0.001 × 9×10¹⁶ = 9×10¹³ J."
        },
        {
            "question": "The rest energy of an electron (m = 9.11×10⁻³¹ kg) in MeV is approximately:",
            "options": ["0.511 MeV", "5.11 MeV", "0.0511 MeV", "511 MeV"],
            "correct": 0,
            "explanation": "E = mc² = 9.11×10⁻³¹ × (3×10⁸)² = 8.2×10⁻¹⁴ J. Converting: 8.2×10⁻¹⁴ / 1.6×10⁻¹³ = 0.511 MeV."
        },
        {
            "question": "The equation E = mc² implies that:",
            "options": ["Mass and energy are the same thing expressed in different units", "Only nuclear reactions can convert mass to energy", "Energy increases with velocity without limit", "Rest mass is always conserved in reactions"],
            "correct": 0,
            "explanation": "E = mc² shows mass-energy equivalence — mass is a form of stored energy. The conversion factor c² is very large, so small mass changes release enormous energy."
        }
    ],
    "wave-particle-duality": [
        {
            "question": "The de Broglie wavelength of a particle is given by λ = h/p. For a faster particle with the same mass, the de Broglie wavelength will:",
            "options": ["Increase", "Decrease", "Stay the same", "Become zero"],
            "correct": 1,
            "explanation": "λ = h/p = h/(mv). Faster particle → larger momentum p → smaller wavelength λ. More massive or faster particles have shorter de Broglie wavelengths."
        },
        {
            "question": "In the double-slit experiment with electrons, which observation demonstrates wave nature?",
            "options": ["Electrons hit the screen in clusters at two bright spots", "An interference pattern of bright and dark fringes appears on the screen", "Electrons are deflected by the slits", "Electrons pass through both slits simultaneously as particles"],
            "correct": 1,
            "explanation": "An interference pattern (alternating bright/dark fringes) is the hallmark of wave behaviour. This appears even when electrons are sent one at a time, showing each electron interferes with itself."
        },
        {
            "question": "Calculate the de Broglie wavelength of a proton moving at 1×10⁷ m/s. (m_p = 1.67×10⁻²⁷ kg, h = 6.63×10⁻³⁴ J·s)",
            "options": ["3.97×10⁻¹⁴ m", "3.97×10⁻¹¹ m", "3.97×10⁻⁸ m", "3.97×10⁻⁵ m"],
            "correct": 0,
            "explanation": "λ = h/(mv) = 6.63×10⁻³⁴ / (1.67×10⁻²⁷ × 1×10⁷) = 6.63×10⁻³⁴ / 1.67×10⁻²⁰ ≈ 3.97×10⁻¹⁴ m."
        }
    ],
    "energy-levels": [
        {
            "question": "The energy levels of hydrogen are given by E_n = −13.6/n² eV. What is the ionisation energy from the ground state?",
            "options": ["−13.6 eV", "13.6 eV", "3.4 eV", "6.8 eV"],
            "correct": 1,
            "explanation": "Ionisation energy is the energy needed to remove the electron from n=1 (E₁ = −13.6 eV) to n=∞ (E=0). It requires +13.6 eV, so the ionisation energy is 13.6 eV."
        },
        {
            "question": "An electron in an atom absorbs a photon and moves to a higher energy level. The photon's energy must equal:",
            "options": ["The total energy of the upper level", "The difference between the upper and lower energy levels", "The kinetic energy of the electron", "The binding energy of the nucleus"],
            "correct": 1,
            "explanation": "The photon energy E = hf must exactly equal the energy difference ΔE = E_upper − E_lower. Photons with too little or too much energy cannot be absorbed."
        },
        {
            "question": "The Heisenberg uncertainty principle (ΔxΔp ≥ ℏ/2) means that:",
            "options": ["Measurement instruments are imperfect", "Position and momentum cannot simultaneously have precisely defined values", "Energy is always conserved", "Particles cannot occupy the same state"],
            "correct": 1,
            "explanation": "The uncertainty principle is a fundamental feature of quantum mechanics, not an instrument limitation. A particle cannot simultaneously have a precisely defined position and momentum."
        }
    ],
    "radioactive-decay": [
        {
            "question": "In beta-minus (β⁻) decay, the nucleus emits:",
            "options": ["A helium nucleus", "A high-energy photon", "An electron and an antineutrino", "A positron and a neutrino"],
            "correct": 2,
            "explanation": "In β⁻ decay, a neutron converts to a proton: n → p + e⁻ + ν̄_e. The nucleus emits an electron and an antineutrino, and the atomic number increases by 1."
        },
        {
            "question": "Which type of radiation is stopped by a sheet of paper?",
            "options": ["Alpha (α)", "Beta (β)", "Gamma (γ)", "Neutron"],
            "correct": 0,
            "explanation": "Alpha particles (helium nuclei) are large and highly ionising. They travel only a few centimetres in air and are stopped by a thin sheet of paper or skin."
        },
        {
            "question": "A radioactive isotope has an activity of 800 Bq. After 6 hours the activity is 100 Bq. What is the half-life?",
            "options": ["1 hour", "2 hours", "3 hours", "4 hours"],
            "correct": 1,
            "explanation": "Activity drops from 800 to 100 — a factor of 8 = 2³. So 3 half-lives have elapsed in 6 hours. Half-life = 6/3 = 2 hours."
        }
    ],
    "fission-fusion": [
        {
            "question": "In nuclear fusion, energy is released because:",
            "options": ["Heavy nuclei split into lighter fragments", "Light nuclei combine and the product has less mass than the reactants", "Protons are converted directly to electrons", "Neutrons are absorbed by the nucleus"],
            "correct": 1,
            "explanation": "When light nuclei (e.g. hydrogen isotopes) fuse, the product has less mass than the sum of reactants. This mass deficit is released as energy via E = mc²."
        },
        {
            "question": "A nuclear chain reaction in a fission reactor is controlled using:",
            "options": ["Lead shields", "Control rods made of neutron-absorbing materials (e.g. boron)", "A moderator that speeds up neutrons", "Cooling water that reflects neutrons"],
            "correct": 1,
            "explanation": "Control rods (boron, cadmium) absorb excess neutrons, reducing the reaction rate. Inserting them more deeply slows or stops the chain reaction."
        },
        {
            "question": "Why is nuclear fusion difficult to achieve on Earth?",
            "options": ["Fusion fuel is extremely rare", "Extremely high temperatures (~10⁷–10⁸ K) are needed to overcome electrostatic repulsion between nuclei", "Fusion produces dangerous radiation that is hard to contain", "No materials can withstand the fusion reaction"],
            "correct": 1,
            "explanation": "Protons repel each other strongly. Fusion requires nuclei to come close enough (within ~10⁻¹⁵ m) for the strong force to dominate, which requires enormous kinetic energy — achievable only at very high temperatures."
        }
    ],
    "standard-model": [
        {
            "question": "Quarks are held together inside protons and neutrons by which fundamental force?",
            "options": ["Gravitational force", "Electromagnetic force", "Weak nuclear force", "Strong nuclear force"],
            "correct": 3,
            "explanation": "The strong nuclear force, mediated by gluons, binds quarks together inside hadrons (protons and neutrons) and also holds the nucleus together."
        },
        {
            "question": "A proton is composed of:",
            "options": ["Three electrons", "Two up quarks and one down quark", "One up quark and two down quarks", "Two protons and one neutron"],
            "correct": 1,
            "explanation": "A proton (charge +1) is made of two up quarks (charge +2/3 each) and one down quark (charge −1/3). Total charge = 2/3 + 2/3 − 1/3 = +1."
        },
        {
            "question": "The Higgs boson, discovered in 2012, is associated with:",
            "options": ["The strong nuclear force", "The electromagnetic force", "The mechanism by which particles acquire mass", "Gravitational attraction between particles"],
            "correct": 2,
            "explanation": "The Higgs field (and its associated boson) gives fundamental particles their mass via the Higgs mechanism — particles that interact more strongly with the Higgs field are heavier."
        }
    ],
    "pn-junction": [
        {
            "question": "In a reverse-biased p-n junction:",
            "options": ["Large current flows as majority carriers cross the junction", "The depletion region widens and very little current flows", "The diode emits light", "The junction breaks down immediately"],
            "correct": 1,
            "explanation": "Reverse bias widens the depletion region, removing majority carriers from the junction. Only a tiny reverse saturation current (due to minority carriers) flows."
        },
        {
            "question": "A light-emitting diode (LED) emits light when:",
            "options": ["Reverse biased above breakdown voltage", "Forward biased, as electrons and holes recombine and release photons", "Exposed to external light", "Connected to an AC supply"],
            "correct": 1,
            "explanation": "In a forward-biased LED, electrons from the n-side and holes from the p-side recombine at the junction, releasing energy as photons. The colour depends on the semiconductor's bandgap."
        },
        {
            "question": "The depletion region of an unbiased p-n junction forms because:",
            "options": ["The battery removes charge from both sides", "Electrons diffuse from n to p and holes diffuse from p to n, creating a charge-free zone", "The semiconductor heats up at the junction", "Covalent bonds break spontaneously"],
            "correct": 1,
            "explanation": "Carriers diffuse down concentration gradients (electrons to p-side, holes to n-side), recombining and leaving behind fixed donor/acceptor ions. This creates a built-in electric field that stops further diffusion."
        }
    ],
    "modulation": [
        {
            "question": "In AM (amplitude modulation) radio, the information signal is encoded by varying the:",
            "options": ["Frequency of the carrier wave", "Amplitude of the carrier wave", "Phase of the carrier wave", "Wavelength of the carrier wave"],
            "correct": 1,
            "explanation": "In AM, the amplitude of a high-frequency carrier wave is varied in proportion to the audio signal. The carrier frequency itself remains constant."
        },
        {
            "question": "FM (frequency modulation) has better noise immunity than AM because:",
            "options": ["FM uses a higher frequency carrier", "Noise affects amplitude more than frequency, and FM encodes information in frequency", "FM signals travel farther", "FM uses digital encoding"],
            "correct": 1,
            "explanation": "Most electrical noise manifests as amplitude variations. Since FM encodes information in frequency (not amplitude), amplitude noise can be clipped/filtered without losing the audio signal."
        },
        {
            "question": "A digital signal is different from an analogue signal in that it:",
            "options": ["Always has a higher frequency", "Only takes discrete values (e.g. 0 and 1)", "Cannot be transmitted wirelessly", "Requires more bandwidth"],
            "correct": 1,
            "explanation": "A digital signal uses discrete levels (binary: 0 and 1). Analogue signals vary continuously. Digital signals are more resistant to noise and can be perfectly regenerated."
        }
    ],
    "wave-propagation": [
        {
            "question": "Ground waves in radio propagation:",
            "options": ["Reflect off the ionosphere", "Travel along the Earth's surface and are attenuated by it", "Require line-of-sight between transmitter and receiver", "Only travel in a vacuum"],
            "correct": 1,
            "explanation": "Ground (surface) waves travel along the Earth's surface and are gradually attenuated. They are used for low-frequency AM broadcasts and can propagate beyond the horizon."
        },
        {
            "question": "Sky waves (shortwave) can travel long distances because they:",
            "options": ["Travel faster than the speed of light", "Reflect off the ionosphere back to Earth", "Diffract over the horizon", "Are guided by underground cables"],
            "correct": 1,
            "explanation": "Sky waves (HF, shortwave) refract/reflect off the ionosphere and return to Earth, allowing them to travel thousands of kilometres — used for international broadcasts."
        },
        {
            "question": "Why do higher-frequency (UHF/microwave) signals generally require line-of-sight transmission?",
            "options": ["They are reflected by the ionosphere too strongly", "Their short wavelengths diffract less around obstacles", "They travel slower than lower-frequency waves", "They are absorbed by the atmosphere completely"],
            "correct": 1,
            "explanation": "Diffraction angle is approximately λ/d. Higher-frequency (shorter wavelength) signals diffract less around obstacles and terrain, so they require a relatively clear path between transmitter and receiver."
        }
    ],
    "digital-communication": [
        {
            "question": "An analogue-to-digital converter (ADC) samples an audio signal at 44,100 Hz with 16-bit resolution. The bit rate of the digital audio is:",
            "options": ["44,100 bps", "705,600 bps", "16 bps", "88,200 bps"],
            "correct": 1,
            "explanation": "Bit rate = sample rate × bit depth = 44,100 × 16 = 705,600 bits/s (705.6 kbps). This is the standard for CD-quality audio (mono channel)."
        },
        {
            "question": "The Nyquist theorem states that to accurately digitise a signal, the sampling rate must be:",
            "options": ["Equal to the signal's highest frequency", "At least twice the signal's highest frequency", "Half the signal's highest frequency", "Ten times the signal's highest frequency"],
            "correct": 1,
            "explanation": "The Nyquist-Shannon theorem: to reconstruct a signal without aliasing, the sampling rate must be at least 2f_max. CD audio samples at 44.1 kHz to faithfully capture audio up to ~22 kHz."
        },
        {
            "question": "Error correction codes in digital communication work by:",
            "options": ["Slowing down the transmission to reduce errors", "Adding redundant bits that allow detection and correction of transmission errors", "Increasing signal amplitude", "Using only analogue signals as backup"],
            "correct": 1,
            "explanation": "Error-correcting codes (e.g. Hamming codes, Reed-Solomon) add carefully chosen redundant bits. The receiver uses these to detect and correct errors without needing to request a retransmission."
        }
    ]
}

updated = []
for slug, qs in new_questions.items():
    t = slug_map.get(slug)
    if t is None:
        print(f"WARNING: slug '{slug}' not found")
        continue
    t['quiz'] = t.get('quiz', []) + qs
    updated.append(slug)

p.write_text(json.dumps(raw, indent=2, ensure_ascii=False))
print(f"Batch E done. Updated {len(updated)} topics:")
for slug in updated:
    t = slug_map[slug]
    print(f"  {slug}: {len(t['quiz'])} questions")
