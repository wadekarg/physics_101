"""Add 3 new quiz questions per topic — Batch D: topics 47-60"""
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
    "magnetic-fields": [
        {
            "question": "A proton moves east at 2×10⁶ m/s through a magnetic field pointing north. What is the direction of the magnetic force on the proton?",
            "options": ["Upward", "Downward", "West", "East"],
            "correct": 0,
            "explanation": "F = qv×B. Velocity east × B north (using right-hand rule: fingers east, curl north, thumb points upward). Proton is positive, so force is upward."
        },
        {
            "question": "A wire carries 5 A in a magnetic field of 0.3 T. The 0.2 m wire is perpendicular to the field. What is the force on the wire?",
            "options": ["0.03 N", "0.30 N", "1.5 N", "0.15 N"],
            "correct": 1,
            "explanation": "F = BIL = 0.3 × 5 × 0.2 = 0.30 N."
        },
        {
            "question": "Which of the following will NOT experience a force in a magnetic field?",
            "options": ["A moving electron", "A stationary proton", "A current-carrying wire", "A moving proton"],
            "correct": 1,
            "explanation": "Magnetic force F = qv×B requires motion. A stationary charge has v = 0, so F = 0."
        }
    ],
    "electromagnetic-induction": [
        {
            "question": "A coil of 100 turns experiences a flux change of 0.05 Wb in 0.1 s. What is the induced EMF?",
            "options": ["0.05 V", "0.5 V", "50 V", "5 V"],
            "correct": 2,
            "explanation": "EMF = N × ΔΦ/Δt = 100 × 0.05/0.1 = 50 V."
        },
        {
            "question": "Lenz's law states that the induced current opposes the change that caused it. This is an expression of:",
            "options": ["Conservation of energy", "Coulomb's law", "Newton's third law", "Ampere's law"],
            "correct": 0,
            "explanation": "Lenz's law is a consequence of conservation of energy — the induced current creates a force opposing the motion, so work must be done to maintain induction."
        },
        {
            "question": "A straight conductor of length 0.5 m moves at 4 m/s perpendicular to a 0.2 T field. What EMF is induced?",
            "options": ["0.1 V", "0.4 V", "1.6 V", "4 V"],
            "correct": 1,
            "explanation": "EMF = BLv = 0.2 × 0.5 × 4 = 0.40 V."
        }
    ],
    "transformers": [
        {
            "question": "A transformer has 200 primary turns and 50 secondary turns. If the primary voltage is 240 V, what is the secondary voltage?",
            "options": ["60 V", "120 V", "480 V", "960 V"],
            "correct": 0,
            "explanation": "Vs/Vp = Ns/Np → Vs = 240 × 50/200 = 60 V. This is a step-down transformer."
        },
        {
            "question": "An ideal transformer with a turns ratio of 1:10 has a primary current of 5 A. What is the secondary current?",
            "options": ["50 A", "5 A", "0.5 A", "0.05 A"],
            "correct": 2,
            "explanation": "Power conserved: Ip×Vp = Is×Vs. Voltage stepped up 10×, so current steps down 10×: Is = 5/10 = 0.5 A."
        },
        {
            "question": "Why is electrical power transmitted at high voltage over long distances?",
            "options": ["Higher voltage increases the speed of electrons", "Lower current reduces resistive power loss (P = I²R)", "High voltage reduces the need for transformers", "High voltage increases magnetic field strength"],
            "correct": 1,
            "explanation": "Power loss in transmission lines is P_loss = I²R. Stepping up voltage reduces current, dramatically reducing resistive losses."
        }
    ],
    "ac-circuits": [
        {
            "question": "An AC source has a peak voltage of 170 V. What is the RMS voltage?",
            "options": ["170 V", "120 V", "85 V", "240 V"],
            "correct": 1,
            "explanation": "V_rms = V_peak / √2 = 170 / 1.414 ≈ 120 V. Household 120 V AC has a peak of about 170 V."
        },
        {
            "question": "In a purely capacitive AC circuit, the current:",
            "options": ["Lags voltage by 90°", "Is in phase with voltage", "Leads voltage by 90°", "Lags voltage by 45°"],
            "correct": 2,
            "explanation": "In a capacitor, current leads voltage by 90°. The capacitor charges/discharges, so current peaks before voltage does."
        },
        {
            "question": "At resonance in a series RLC circuit, which statement is true?",
            "options": ["Impedance is maximum", "Inductive reactance equals capacitive reactance", "Current is minimum", "Voltage across R is zero"],
            "correct": 1,
            "explanation": "At resonance, X_L = X_C, so they cancel. Net impedance equals R (minimum) and current is maximum."
        }
    ],
    "motors-generators": [
        {
            "question": "A generator converts:",
            "options": ["Electrical energy to mechanical energy", "Mechanical energy to electrical energy", "Chemical energy to electrical energy", "Magnetic energy to kinetic energy"],
            "correct": 1,
            "explanation": "A generator uses electromagnetic induction — rotating coils in a magnetic field — to convert mechanical energy into electrical energy."
        },
        {
            "question": "The back-EMF of a motor is 90 V when connected to a 120 V supply through a 6 Ω armature resistance. What is the armature current?",
            "options": ["20 A", "5 A", "15 A", "2.5 A"],
            "correct": 1,
            "explanation": "Net voltage = 120 − 90 = 30 V (back-EMF opposes supply). I = 30/6 = 5 A."
        },
        {
            "question": "In a DC motor, the commutator serves to:",
            "options": ["Increase the magnetic field strength", "Reverse current direction every half rotation to maintain torque", "Reduce friction in the bearings", "Step up the supply voltage"],
            "correct": 1,
            "explanation": "The commutator reverses current direction in the coil every half turn, ensuring torque always acts in the same rotational direction."
        }
    ],
    "reflection-refraction": [
        {
            "question": "A ray of light strikes a plane mirror at 35° to the mirror surface. What is the angle of reflection (measured from the normal)?",
            "options": ["35°", "55°", "70°", "45°"],
            "correct": 1,
            "explanation": "Angles are measured from the normal. If the ray is 35° from the surface, it is 55° from the normal. Angle of reflection = 55°."
        },
        {
            "question": "Light travels from water (n = 1.33) into glass (n = 1.5). The light will:",
            "options": ["Bend away from the normal", "Travel straight without bending", "Bend toward the normal", "Undergo total internal reflection"],
            "correct": 2,
            "explanation": "Light bends toward the normal when entering a denser medium (higher n). Glass (1.5) is denser than water (1.33)."
        },
        {
            "question": "The critical angle for total internal reflection depends on:",
            "options": ["The frequency of light only", "The refractive indices of both media", "The angle of the incident ray only", "The speed of light in a vacuum only"],
            "correct": 1,
            "explanation": "sin(θ_c) = n₂/n₁, where n₁ is the denser medium and n₂ the less dense. Both refractive indices determine the critical angle."
        }
    ],
    "lenses": [
        {
            "question": "An object is placed 30 cm from a converging lens of focal length 10 cm. Where is the image formed?",
            "options": ["15 cm, same side as object", "15 cm, opposite side", "20 cm, opposite side", "30 cm, opposite side"],
            "correct": 1,
            "explanation": "Using 1/v − 1/u = 1/f with sign convention: 1/v = 1/10 − 1/30 = 2/30, so v = 15 cm on the far side."
        },
        {
            "question": "A diverging lens always produces an image that is:",
            "options": ["Real, inverted, and larger", "Virtual, upright, and smaller", "Real, upright, and smaller", "Virtual, inverted, and larger"],
            "correct": 1,
            "explanation": "A diverging (concave) lens always produces a virtual, upright, diminished image on the same side as the object."
        },
        {
            "question": "The power of a lens with focal length 25 cm is:",
            "options": ["4 D", "0.25 D", "25 D", "40 D"],
            "correct": 0,
            "explanation": "Power P = 1/f (in metres) = 1/0.25 = 4 dioptres."
        }
    ],
    "wave-optics": [
        {
            "question": "In Young's double-slit experiment, increasing the slit separation will:",
            "options": ["Increase fringe spacing", "Decrease fringe spacing", "Have no effect on fringe spacing", "Make fringes disappear"],
            "correct": 1,
            "explanation": "Fringe spacing y = λD/d. Increasing slit separation d decreases fringe spacing — fringes become closer together."
        },
        {
            "question": "Which phenomenon can ONLY be explained by the wave nature of light?",
            "options": ["Reflection", "Refraction", "Diffraction", "Rectilinear propagation"],
            "correct": 2,
            "explanation": "Diffraction (bending around obstacles) requires wave behaviour. Reflection and refraction can be modelled with rays."
        },
        {
            "question": "In thin-film interference with one phase reversal on reflection, the condition for constructive interference is:",
            "options": ["2nt = mλ", "2nt = (m + ½)λ", "nt = mλ", "t = mλ/n"],
            "correct": 1,
            "explanation": "With one phase reversal, constructive interference in reflected light requires 2nt = (m + ½)λ, where m = 0, 1, 2,..."
        }
    ],
    "photoelectric-effect": [
        {
            "question": "In the photoelectric effect, increasing the intensity of light (keeping frequency constant) will:",
            "options": ["Increase the maximum KE of emitted electrons", "Increase the number of emitted electrons per second", "Decrease the work function", "Increase the threshold frequency"],
            "correct": 1,
            "explanation": "More intensity means more photons per second. Each photon has the same energy (frequency unchanged), so KE_max is unchanged but more electrons are emitted per second."
        },
        {
            "question": "The stopping voltage in the photoelectric effect is the voltage needed to:",
            "options": ["Accelerate electrons toward the collector", "Prevent all electrons from reaching the collector", "Increase photon energy", "Reduce the threshold frequency"],
            "correct": 1,
            "explanation": "Stopping voltage V_s is the reverse voltage that halts the most energetic electrons: eV_s = KE_max = hf − φ."
        },
        {
            "question": "Light of frequency 8×10¹⁴ Hz hits a metal with work function 2.0 eV. What is the maximum KE of emitted electrons? (h = 4.14×10⁻¹⁵ eV·s)",
            "options": ["1.31 eV", "3.31 eV", "2.0 eV", "5.31 eV"],
            "correct": 0,
            "explanation": "hf = 4.14×10⁻¹⁵ × 8×10¹⁴ = 3.31 eV. KE_max = 3.31 − 2.0 = 1.31 eV."
        }
    ],
    "atomic-models": [
        {
            "question": "In Bohr's model of hydrogen, when an electron transitions from n=3 to n=1, a photon is:",
            "options": ["Absorbed with energy E₃ − E₁", "Emitted with energy E₃ − E₁", "Absorbed with energy E₁ − E₃", "No photon is involved"],
            "correct": 1,
            "explanation": "Electrons moving to lower energy levels release energy as an emitted photon. E_photon = E₃ − E₁ (the energy difference, always positive)."
        },
        {
            "question": "Which series of hydrogen spectral lines falls in the visible range?",
            "options": ["Lyman series", "Balmer series", "Paschen series", "Brackett series"],
            "correct": 1,
            "explanation": "The Balmer series (transitions to n=2) produces visible light (400–700 nm). Lyman is UV; Paschen and Brackett are infrared."
        },
        {
            "question": "Rutherford's gold foil experiment disproved Thomson's 'plum pudding' model because:",
            "options": ["Electrons were deflected at large angles", "Most alpha particles passed straight through", "A few alpha particles were deflected at large angles", "All alpha particles were absorbed"],
            "correct": 2,
            "explanation": "A small fraction of alpha particles bounced back at large angles, revealing a tiny, dense, positively charged nucleus — impossible in a uniform Thomson model."
        }
    ],
    "nuclear-physics": [
        {
            "question": "Carbon-14 has a half-life of 5730 years. What fraction of a sample remains after 17190 years?",
            "options": ["1/2", "1/4", "1/8", "1/16"],
            "correct": 2,
            "explanation": "17190 / 5730 = 3 half-lives. (1/2)³ = 1/8 of the original sample remains."
        },
        {
            "question": "In alpha decay, the parent nucleus loses:",
            "options": ["2 protons and 2 neutrons", "1 proton and 0 neutrons", "0 protons and 1 neutron", "1 proton and 1 electron"],
            "correct": 0,
            "explanation": "An alpha particle is a helium-4 nucleus: 2 protons + 2 neutrons. The parent loses mass number 4 and atomic number 2."
        },
        {
            "question": "Nuclear fission releases large amounts of energy because:",
            "options": ["Electrons are accelerated to high speeds", "The products have less mass than the reactants; the mass deficit becomes energy (E = mc²)", "Protons and neutrons are created in the reaction", "The chain reaction produces visible light"],
            "correct": 1,
            "explanation": "Fission products (mid-mass nuclei) have greater binding energy per nucleon than heavy nuclei like uranium. The mass deficit is released as energy via E = mc²."
        }
    ],
    "semiconductors": [
        {
            "question": "In an n-type semiconductor, the majority charge carriers are:",
            "options": ["Holes", "Protons", "Electrons", "Positrons"],
            "correct": 2,
            "explanation": "N-type semiconductors are doped with donor atoms (e.g., phosphorus in silicon) that donate extra electrons, making electrons the majority carriers."
        },
        {
            "question": "A p-n junction diode allows current to flow easily when:",
            "options": ["The p-side is connected to the negative terminal (reverse bias)", "The p-side is connected to the positive terminal (forward bias)", "No voltage is applied (zero bias)", "Reverse breakdown voltage is applied"],
            "correct": 1,
            "explanation": "Forward bias (p-side positive) reduces the depletion region and allows majority carriers to flow across the junction."
        },
        {
            "question": "What is the main function of a transistor in a digital circuit?",
            "options": ["To convert AC to DC", "To act as a switch or amplifier", "To store electrical charge", "To increase resistance"],
            "correct": 1,
            "explanation": "Transistors act as electronically controlled switches (in digital circuits) or amplifiers (in analog circuits) — they are the fundamental building block of modern electronics."
        }
    ],
    "transistors": [
        {
            "question": "In a common-emitter BJT amplifier, a small base current controls a:",
            "options": ["Large collector current", "Small emitter voltage", "Large base voltage", "Small collector resistance"],
            "correct": 0,
            "explanation": "BJT current gain β = I_C / I_B. A small base current I_B controls a much larger collector current I_C, providing current amplification."
        },
        {
            "question": "In a MOSFET, the gate terminal controls current flow by:",
            "options": ["Changing the doping level of the channel", "Creating or eliminating a conducting channel via electric field", "Heating the semiconductor", "Injecting charge carriers directly"],
            "correct": 1,
            "explanation": "Voltage on the MOSFET gate creates an electric field that induces a conducting channel between source and drain — no gate current flows (extremely high input impedance)."
        },
        {
            "question": "A BJT has β = 150 and a base current of 0.04 mA. What is the collector current?",
            "options": ["6 mA", "0.6 mA", "60 mA", "0.06 mA"],
            "correct": 0,
            "explanation": "I_C = β × I_B = 150 × 0.04 = 6 mA."
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
print(f"Batch D done. Updated {len(updated)} topics:")
for slug in updated:
    t = slug_map[slug]
    print(f"  {slug}: {len(t['quiz'])} questions")
