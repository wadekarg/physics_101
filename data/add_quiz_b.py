"""Add 3 new quiz questions per topic — Batch B: topics 16-30"""
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
    "potential-energy": [
        {"question": "A 2 kg ball rolls down a frictionless ramp of height 5 m. What is its speed at the bottom? (g = 10 m/s²)",
         "options": ["5 m/s", "10 m/s", "50 m/s", "7.07 m/s"],
         "correct": 1,
         "explanation": "Conservation of energy: mgh = ½mv² → v = √(2gh) = √(2 × 10 × 5) = √100 = 10 m/s."},
        {"question": "The gravitational potential energy of an object depends on:",
         "options": ["Its speed", "Its mass, height, and gravitational field strength",
                     "Its mass and speed only", "Its height and speed only"],
         "correct": 1,
         "explanation": "GPE = mgh, where m is mass, g is gravitational field strength, and h is height above the reference level."},
        {"question": "A spring is compressed by 2 cm and stores 0.04 J of energy. If compressed by 4 cm, how much energy is stored?",
         "options": ["0.08 J", "0.12 J", "0.16 J", "0.02 J"],
         "correct": 2,
         "explanation": "Elastic PE = ½kx². Doubling the compression quadruples the stored energy: 4 × 0.04 = 0.16 J."},
    ],
    "power-efficiency": [
        {"question": "A 60 W light bulb runs for 5 hours. How much energy (in kJ) does it consume?",
         "options": ["300 kJ", "1080 kJ", "18 kJ", "0.3 kJ"],
         "correct": 1,
         "explanation": "Energy = Power × time = 60 W × 5 × 3600 s = 1,080,000 J = 1080 kJ."},
        {"question": "A machine is 75% efficient and performs 600 J of useful work. How much energy was supplied to it?",
         "options": ["450 J", "675 J", "800 J", "600 J"],
         "correct": 2,
         "explanation": "Efficiency = useful output / input → input = output / efficiency = 600 / 0.75 = 800 J."},
        {"question": "Power can also be expressed as:",
         "options": ["Force × time", "Force × velocity", "Work × time", "Mass × velocity"],
         "correct": 1,
         "explanation": "P = W/t = (F × d)/t = F × (d/t) = F × v. Power equals force multiplied by velocity."},
    ],
    "momentum-impulse": [
        {"question": "A 0.5 kg ball moving at 6 m/s is brought to rest in 0.03 s. What is the average force applied?",
         "options": ["9 N", "100 N", "3 N", "90 N"],
         "correct": 1,
         "explanation": "Impulse = Δp = 0.5 × (0 − 6) = −3 N·s. Force = Impulse/time = 3/0.03 = 100 N."},
        {"question": "The momentum of a 1500 kg car moving at 20 m/s is:",
         "options": ["75 kg·m/s", "30,000 kg·m/s", "7500 kg·m/s", "1500 kg·m/s"],
         "correct": 1,
         "explanation": "p = mv = 1500 × 20 = 30,000 kg·m/s."},
        {"question": "Why does crumple zone technology in cars reduce injury during a collision?",
         "options": ["It reduces the car's momentum", "It makes the car lighter",
                     "It increases the collision time, reducing the average force on occupants",
                     "It absorbs heat from the collision"],
         "correct": 2,
         "explanation": "Crumple zones increase the time of the collision. Since Impulse = F × Δt and impulse (change in momentum) is fixed, a longer time means a smaller average force on the occupants."},
    ],
    "conservation-momentum": [
        {"question": "A 3 kg cart at 4 m/s collides with a 2 kg cart moving at −1 m/s. After a perfectly inelastic collision, what is the final velocity?",
         "options": ["1.6 m/s", "2 m/s", "3 m/s", "2.5 m/s"],
         "correct": 0,
         "explanation": "Total initial momentum = 3×4 + 2×(−1) = 12 − 2 = 10 kg·m/s. Final: (3+2)v = 10 → v = 2 m/s. Wait: let me recheck. p_initial = 12 − 2 = 10. v = 10/5 = 2 m/s. Selecting 1.6 m/s is wrong; the correct answer is 2 m/s."},
        {"question": "In which type of collision is kinetic energy conserved?",
         "options": ["Perfectly inelastic", "Inelastic", "Elastic", "All collisions"],
         "correct": 2,
         "explanation": "Kinetic energy is conserved only in perfectly elastic collisions. In inelastic collisions, some KE is lost to heat, sound, or deformation."},
        {"question": "A stationary firecracker explodes into two fragments of mass 1 kg and 3 kg. The 1 kg fragment moves at 12 m/s. What is the speed of the 3 kg fragment?",
         "options": ["4 m/s", "12 m/s", "36 m/s", "3 m/s"],
         "correct": 0,
         "explanation": "Initial momentum = 0. So 1×12 + 3×v = 0 → v = −4 m/s. Speed = 4 m/s (in the opposite direction)."},
    ],
    "2d-collisions": [
        {"question": "In a 2D elastic collision between two equal masses where one is initially at rest, the angle between the two post-collision velocity vectors is always:",
         "options": ["45°", "60°", "90°", "180°"],
         "correct": 2,
         "explanation": "For elastic collisions between equal masses (one initially at rest), conservation of both momentum and kinetic energy requires the two post-collision velocities to be perpendicular."},
        {"question": "Which quantity is NOT necessarily conserved in an inelastic 2D collision?",
         "options": ["Total momentum", "Total kinetic energy", "Total energy", "Total mass"],
         "correct": 1,
         "explanation": "Momentum is always conserved (Newton's laws). Total energy is conserved (first law). But kinetic energy is not conserved in inelastic collisions — some converts to heat or deformation."},
        {"question": "A 2 kg ball moving east at 5 m/s collides and sticks to a 3 kg ball at rest. What is the combined speed after impact?",
         "options": ["5 m/s", "3 m/s", "2 m/s", "10 m/s"],
         "correct": 2,
         "explanation": "Momentum conservation: 2×5 = (2+3)v → v = 10/5 = 2 m/s east."},
    ],
    "torque": [
        {"question": "A seesaw is balanced with a 60 kg person sitting 2 m from the pivot. How far must a 40 kg person sit on the other side to balance?",
         "options": ["2 m", "3 m", "1.5 m", "4 m"],
         "correct": 1,
         "explanation": "Torque balance: 60g × 2 = 40g × d → d = 120/40 = 3 m."},
        {"question": "What is the SI unit of torque?",
         "options": ["Joule", "Newton", "Newton-metre (N·m)", "Watt"],
         "correct": 2,
         "explanation": "Torque = Force × perpendicular distance, so its unit is Newton × metre = N·m. Although this has the same dimensions as energy (J), torque is a vector and energy is a scalar, so different names are used."},
        {"question": "If the same force is applied to a wrench twice as long, the torque:",
         "options": ["Stays the same", "Halves", "Doubles", "Quadruples"],
         "correct": 2,
         "explanation": "Torque = F × d. Doubling the distance d while keeping F constant doubles the torque."},
    ],
    "angular-momentum": [
        {"question": "A skater has moment of inertia 2 kg·m² spinning at 3 rad/s. She increases I to 6 kg·m² by extending her arms. What is her new angular velocity?",
         "options": ["9 rad/s", "3 rad/s", "1 rad/s", "6 rad/s"],
         "correct": 2,
         "explanation": "Angular momentum is conserved: I₁ω₁ = I₂ω₂ → 2×3 = 6×ω₂ → ω₂ = 1 rad/s."},
        {"question": "The Earth's rotation is slowly decreasing due to tidal friction. This means the Moon is:",
         "options": ["Getting closer to Earth", "Moving away from Earth",
                     "Staying at the same distance", "Increasing its orbital speed"],
         "correct": 1,
         "explanation": "As Earth loses angular momentum via tidal friction, the Moon gains angular momentum (conservation of total angular momentum of the Earth-Moon system), causing it to move to a slightly larger orbit."},
        {"question": "A spinning top slows down and begins to wobble (precess) more rapidly. This is because:",
         "options": ["Friction increases angular momentum",
                     "Lower angular momentum means a stronger precession for the same gravitational torque",
                     "The top gains mass as it slows",
                     "The gravitational torque decreases as it slows"],
         "correct": 1,
         "explanation": "Precession rate ω_p = τ/L. As the top slows down, L decreases, so ω_p = τ/L increases — the top precesses faster."},
    ],
    "gyroscopes": [
        {"question": "Why does a gyroscope resist changes in its orientation?",
         "options": ["It is very heavy",
                     "Its spinning creates angular momentum that resists changes in direction",
                     "It is attached to a fixed base",
                     "Air resistance stabilises it"],
         "correct": 1,
         "explanation": "By conservation of angular momentum, a spinning gyroscope's angular momentum vector tends to maintain its direction. Any applied torque causes precession rather than tipping."},
        {"question": "A gyroscope is spinning rapidly and precessing. If the spin rate increases, the precession rate:",
         "options": ["Increases", "Stays the same", "Decreases", "Becomes zero"],
         "correct": 2,
         "explanation": "Precession rate ω_p = mgd/(Iω). As spin ω increases, the precession rate decreases."},
        {"question": "Gyroscopes are used in aircraft instruments because:",
         "options": ["They measure airspeed accurately",
                     "They provide a stable direction reference that resists changes in orientation",
                     "They reduce air drag on the aircraft",
                     "They power the navigation systems"],
         "correct": 1,
         "explanation": "A gyroscope maintains a fixed orientation in space regardless of how the aircraft moves around it, making it ideal for attitude indicators, directional gyros, and heading references."},
    ],
    "universal-gravitation": [
        {"question": "The gravitational force between two 1 kg masses separated by 1 m is approximately:",
         "options": ["9.8 N", "6.67 × 10⁻¹¹ N", "1 N", "6.67 N"],
         "correct": 1,
         "explanation": "F = Gm₁m₂/r² = (6.67×10⁻¹¹ × 1 × 1)/1² = 6.67×10⁻¹¹ N. Gravity between ordinary masses is extremely weak."},
        {"question": "On the surface of a planet with twice Earth's mass but the same radius, the gravitational field strength g would be:",
         "options": ["Same as Earth", "Half of Earth's", "Twice Earth's", "Four times Earth's"],
         "correct": 2,
         "explanation": "g = GM/R². Doubling M while keeping R the same doubles g."},
        {"question": "What happens to the gravitational force between two masses if both masses are doubled AND the distance is also doubled?",
         "options": ["It stays the same", "It doubles", "It quadruples", "It halves"],
         "correct": 0,
         "explanation": "F = Gm₁m₂/r². Doubling both masses multiplies F by 4; doubling distance divides F by 4. Net effect: 4/4 = 1 — force stays the same."},
    ],
    "orbital-mechanics": [
        {"question": "Kepler's second law (equal areas in equal times) means a planet moves:",
         "options": ["At constant speed throughout its orbit",
                     "Faster when closer to the Sun and slower when farther away",
                     "In a perfectly circular orbit",
                     "Faster when farther from the Sun"],
         "correct": 1,
         "explanation": "To sweep equal areas in equal times, a planet must move faster when it is closer to the Sun (perihelion) and slower when farther (aphelion). This follows from conservation of angular momentum."},
        {"question": "A geostationary satellite appears stationary from Earth because:",
         "options": ["It is not actually orbiting", "Its orbital speed matches Earth's surface speed",
                     "Its orbital period equals Earth's rotation period",
                     "It is above the atmosphere where there is no gravity"],
         "correct": 2,
         "explanation": "A geostationary satellite orbits with a period of 24 hours, matching Earth's rotation. It therefore stays above the same point on Earth's equator."},
        {"question": "As a satellite moves to a higher orbit, its orbital speed:",
         "options": ["Increases", "Stays the same", "Decreases", "First increases then decreases"],
         "correct": 2,
         "explanation": "v = √(GM/r). As r increases, orbital speed decreases. Higher orbits have lower speeds but longer periods (Kepler's 3rd law)."},
    ],
    "escape-velocity": [
        {"question": "The escape velocity from Earth's surface is approximately:",
         "options": ["7.9 km/s", "11.2 km/s", "3 × 10⁸ m/s", "5 km/s"],
         "correct": 1,
         "explanation": "v_esc = √(2GM/R) ≈ 11.2 km/s for Earth. This is the minimum speed needed to escape Earth's gravitational field from the surface."},
        {"question": "Why does the Moon have almost no atmosphere?",
         "options": ["The Moon has no oxygen", "The Moon is too cold for gases",
                     "The Moon's escape velocity is too low for gas molecules to be retained",
                     "Solar wind blows away any atmosphere immediately"],
         "correct": 2,
         "explanation": "The Moon's escape velocity (~2.4 km/s) is low. At typical temperatures, lighter gas molecules (e.g., H₂, He) have thermal speeds exceeding this, so they escape. Over billions of years, all atmosphere is lost."},
        {"question": "Escape velocity from a planetary orbit (at orbital altitude) compared to from the surface is:",
         "options": ["Higher", "The same", "Lower", "Zero — no escape from orbit"],
         "correct": 2,
         "explanation": "v_esc = √(2GM/r). At a higher altitude r, the escape velocity is lower than from the surface (r = R). Satellites are already partway 'out' of the gravity well."},
    ],
    "springs-hookes-law": [
        {"question": "Two springs (k = 200 N/m each) are connected in series. What is the effective spring constant?",
         "options": ["400 N/m", "200 N/m", "100 N/m", "50 N/m"],
         "correct": 2,
         "explanation": "For springs in series: 1/k_eff = 1/k₁ + 1/k₂ = 1/200 + 1/200 = 2/200 → k_eff = 100 N/m."},
        {"question": "In simple harmonic motion (SHM), where is the restoring force at its maximum?",
         "options": ["At the equilibrium position", "At the maximum displacement (amplitude)",
                     "At the halfway point", "The force is constant throughout"],
         "correct": 1,
         "explanation": "The restoring force F = −kx is proportional to displacement. At maximum displacement (amplitude), x is largest, so force is maximum. At equilibrium x = 0, force = 0."},
        {"question": "A mass on a spring oscillates with period T. If the spring constant is doubled (same mass), the new period is:",
         "options": ["T/2", "T/√2", "T√2", "2T"],
         "correct": 1,
         "explanation": "T = 2π√(m/k). Doubling k gives T_new = 2π√(m/2k) = T/√2."},
    ],
    "pendulums": [
        {"question": "A pendulum has a period of 2 s. Its length is shortened to one-quarter. What is the new period?",
         "options": ["0.5 s", "1 s", "4 s", "8 s"],
         "correct": 1,
         "explanation": "T = 2π√(L/g). Reducing L to L/4 gives T_new = 2π√(L/4g) = T/2 = 1 s."},
        {"question": "The restoring force on a pendulum bob is:",
         "options": ["The full weight of the bob",
                     "The tension in the string",
                     "The component of gravity directed along the arc toward equilibrium",
                     "Centripetal force toward the pivot"],
         "correct": 2,
         "explanation": "For a simple pendulum, the restoring force is mg sinθ — the component of gravity along the arc pointing back toward the equilibrium (lowest) position."},
        {"question": "A pendulum clock keeps correct time at sea level. At the top of a mountain (where g is slightly less):",
         "options": ["It runs fast", "It runs slow", "It runs at the same rate", "It stops"],
         "correct": 1,
         "explanation": "T = 2π√(L/g). Lower g gives a longer period — the clock swings more slowly and runs slow (loses time)."},
    ],
    "resonance": [
        {"question": "A wine glass shatters when a singer hits a specific note. This is an example of:",
         "options": ["Constructive interference", "Resonance", "Destructive interference", "Diffraction"],
         "correct": 1,
         "explanation": "The singer's note matches the natural frequency of the glass. This drives resonance, causing rapidly increasing amplitude until the glass shatters."},
        {"question": "In a car's suspension system, shock absorbers are designed to:",
         "options": ["Increase the natural frequency of the car body",
                     "Damp oscillations and prevent resonance",
                     "Store energy from road bumps",
                     "Increase tyre contact with the road by adding weight"],
         "correct": 1,
         "explanation": "Shock absorbers introduce damping, which reduces the amplitude of oscillations and prevents the car body from resonating at the frequency of road bumps."},
        {"question": "A child on a swing is pushed by a parent at exactly the right moment each cycle. The swing's amplitude gradually increases. This is because:",
         "options": ["The parent is pushing harder each time",
                     "The pushing frequency matches the swing's natural frequency (resonance)",
                     "Gravity increases with each push",
                     "The swing gains mass with each push"],
         "correct": 1,
         "explanation": "When the forcing frequency matches the natural frequency, energy is added efficiently with each push. This is resonance — amplitude builds up over successive cycles."},
    ],
}

# Fix the conservation-momentum correct answer (was set incorrectly above)
# Re-check: p = 3×4 + 2×(−1) = 12 − 2 = 10. v = 10/5 = 2 m/s. Correct answer is "2 m/s" = index 1
new_questions["conservation-momentum"][0] = {
    "question": "A 3 kg cart at 4 m/s collides with a 2 kg cart moving at −1 m/s (opposite direction). After a perfectly inelastic collision, what is the final velocity?",
    "options": ["1.2 m/s", "2 m/s", "3 m/s", "2.5 m/s"],
    "correct": 1,
    "explanation": "Total momentum = 3×4 + 2×(−1) = 12 − 2 = 10 kg·m/s. Final: (3+2)v = 10 → v = 2 m/s in the original direction."
}

for slug, questions in new_questions.items():
    if slug not in slug_map:
        print(f'WARNING: {slug} not found')
        continue
    slug_map[slug].setdefault('quiz', []).extend(questions)

p.write_text(json.dumps(raw, indent=2, ensure_ascii=False))
loaded = json.loads(p.read_text())
data2 = loaded if isinstance(loaded, list) else loaded.get('chapters', loaded)
slug_map2 = {}
for ch in data2:
    for t in ch.get('topics', []):
        slug_map2[t.get('slug', t.get('id',''))] = t

print('Batch B done. Spot-check:')
for slug in new_questions:
    count = len(slug_map2.get(slug, {}).get('quiz', []))
    print(f'  {slug}: {count} questions')
