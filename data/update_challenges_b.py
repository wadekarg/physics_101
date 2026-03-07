"""Update Challenge Lab descriptions — Batch B: topics 16-30"""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

challenges = {
    "potential-energy": {
        "title": "Roller Coaster Energy Audit",
        "description": "A frictionless roller coaster starts from rest at point A (height 45 m). (a) Find speed at point B (height 15 m). (b) Find speed at point C (ground level). (c) What minimum height must point A be for the car to complete a vertical loop of radius 8 m? (d) If friction causes 15% energy loss between A and B, recalculate speed at B. (e) Can the car still complete the loop after the 15% energy loss? Show your working.",
        "hint": "Energy conservation: ½mv² = mg(h_A − h_B). For minimum loop height: speed at top of loop must satisfy v² = gr (N=0 condition). Height of top of loop = 2r above ground. For 15% loss: KE_B = 0.85 × mgh_A − mgh_B.",
        "xpBonus": 75
    },
    "power-efficiency": {
        "title": "Electric Vehicle Power Analysis",
        "description": "An electric car (mass 1800 kg) accelerates from 0 to 100 km/h in 5.5 s on a flat road. (a) Find the kinetic energy gained. (b) Calculate average mechanical power output. (c) The motor is 85% efficient — find electrical energy consumed. (d) At 100 km/h on a highway it uses 15 kWh per 100 km. Find the continuous power draw. (e) Compare acceleration power to highway power — which phase draws more power and why?",
        "hint": "KE = ½mv². Power = Work/time. Electrical energy = useful output / efficiency. Highway: energy rate = (15 kWh / 100 km) × speed in km/s = power in kW. Convert kWh to kJ: 1 kWh = 3600 kJ.",
        "xpBonus": 75
    },
    "momentum-impulse": {
        "title": "Cricket Ball Bat Impact",
        "description": "A 0.156 kg cricket ball bowled at 140 km/h is hit back at 160 km/h in the opposite direction. Contact time is 1.5 ms. (a) Convert both speeds to m/s. (b) Calculate change in momentum (take bowling direction as positive). (c) Find the average force exerted by the bat on the ball. (d) Express this force in multiples of the ball's weight. (e) If the ball had been stopped (not hit back), how much would the average force change? By what factor?",
        "hint": "Δp = m(v_f − v_i). Take v_i as positive (bowling direction). After hit, v_f is negative (opposite direction). Impulse = Δp = F × Δt. The force on the ball from the bat equals Δp/Δt.",
        "xpBonus": 75
    },
    "conservation-momentum": {
        "title": "Ballistic Pendulum",
        "description": "A 0.020 kg bullet is fired into a stationary 5.0 kg wooden block suspended on a string. The bullet embeds in the block which swings up 12 cm. (a) Use energy conservation to find the speed of the block+bullet just after impact. (b) Use momentum conservation to find the bullet's initial speed. (c) Calculate KE before and after — what fraction was lost? (d) Where did the lost energy go? (e) If the block only swings up 6 cm, what was the bullet's initial speed?",
        "hint": "Step 1 (energy): ½(m+M)v² = (m+M)gh → v = √(2gh). Step 2 (momentum): mv₀ = (m+M)v. The KE loss appears as heat and deformation during the perfectly inelastic collision.",
        "xpBonus": 75
    },
    "2d-collisions": {
        "title": "Snooker Ball Collision",
        "description": "A 0.17 kg snooker ball (white) moving at 3.0 m/s east strikes an identical stationary ball. After the collision, the white ball moves at 1.5 m/s at 40° north of east. (a) Calculate momentum components (x and y) of the white ball after collision. (b) Use conservation of momentum to find the velocity (magnitude and direction) of the struck ball. (c) Calculate total KE before and after — is the collision elastic or inelastic? (d) What angle do the two post-collision velocities make with each other?",
        "hint": "Initial momentum is purely eastward (x-direction). Set up x and y component equations separately. For KE check: elastic means total KE is conserved. Note: for equal-mass elastic collisions, the two balls always move at 90° to each other.",
        "xpBonus": 75
    },
    "torque": {
        "title": "Crane Load Limit",
        "description": "A uniform horizontal crane arm (mass 800 kg, length 12 m) is hinged to a wall at one end. A cable attached at 8 m from the wall makes 30° with the arm and provides tension T. A load W hangs from the end (12 m). (a) Find the torque due to the arm's weight about the wall hinge. (b) Find torque due to the load W. (c) If T = 18,000 N, find the maximum load W. (d) Find the horizontal and vertical reaction forces at the hinge.",
        "hint": "Torques about hinge: arm weight acts at 6 m (centre). Cable torque = T × 8 × sin(30°). Sum torques = 0 for equilibrium: T×8×sin30° = W×12 + 800g×6. For hinge forces: resolve horizontal and vertical separately.",
        "xpBonus": 75
    },
    "angular-momentum": {
        "title": "Figure Skater Spin",
        "description": "A figure skater with arms extended has moment of inertia I₁ = 4.5 kg·m² and spins at 1.5 rev/s. She pulls her arms in, reducing I to 1.2 kg·m². (a) Find her new angular velocity. (b) Calculate rotational KE before and after — where does the extra energy come from? (c) To stop spinning, she extends her arms and a coach applies a braking torque of 25 N·m. How long does it take to stop? (d) Through what angle (radians and full turns) does she rotate while stopping?",
        "hint": "Angular momentum L = Iω is conserved (no external torque). Convert rev/s to rad/s: multiply by 2π. KE = ½Iω². Extra energy comes from internal work done by muscles. Braking: τ×t = ΔL = 0 − L_final.",
        "xpBonus": 75
    },
    "gyroscopes": {
        "title": "Gyroscopic Bicycle Wheel",
        "description": "A bicycle wheel (treat as ring, mass 1.5 kg, radius 0.35 m) spins at 4 rev/s as the bike moves at 15 km/h. (a) Calculate the wheel's moment of inertia (I = mr² for a ring). (b) Calculate angular momentum L (convert rev/s to rad/s). (c) If the wheel is held horizontal on one end of a 15 cm axle, calculate the precession angular velocity ω_p = mgr/L, where r = 0.15 m. (d) In which direction does the wheel precess? (e) Explain why a faster-spinning wheel precesses more slowly.",
        "hint": "I = mr² for a thin ring. ω = 2π × rev/s. L = Iω. Precession: τ = mgr (gravity torque), ω_p = τ/L = mgr/(Iω). Faster spin → larger L → smaller ω_p. The gyroscopic effect is what keeps a moving bicycle upright.",
        "xpBonus": 75
    },
    "universal-gravitation": {
        "title": "Weighing a Planet",
        "description": "A moon orbits a planet with orbital radius 4.2 × 10⁸ m and period 7.5 days. (a) Convert period to seconds and find orbital speed. (b) Set centripetal force = gravitational force and solve for the planet's mass. (c) Compare to Earth's mass (6 × 10²⁴ kg) — what multiple of Earth's mass is this planet? (d) The planet's radius is 60,000 km. Find surface gravity g. How much would a 70 kg person weigh there?",
        "hint": "Orbital speed v = 2πr/T. Centripetal = gravity: mv²/r = GMm/r². Solve for M = v²r/G. Surface gravity: g_surface = GM/R². Weight = mg_surface.",
        "xpBonus": 75
    },
    "orbital-mechanics": {
        "title": "Geostationary Satellite Altitude",
        "description": "Find the altitude of a geostationary satellite. G = 6.67 × 10⁻¹¹ N·m²/kg², M_Earth = 6.0 × 10²⁴ kg, R_Earth = 6.4 × 10⁶ m. (a) State what geostationary means and what orbital period T must be (in seconds). (b) Use T² = (4π²/GM)r³ to find orbital radius r. (c) Find altitude h = r − R_Earth in km. (d) Find the orbital speed and compare to the ISS at 400 km altitude — which is faster and why? (e) Why can't geostationary satellites orbit above the poles?",
        "hint": "T = 24 h = 86,400 s. Rearrange: r = (GMT²/4π²)^(1/3). Altitude = r − R. Lower orbits have shorter periods and faster speeds (Kepler's 3rd law). Geostationary requires equatorial orbit to stay fixed above one point.",
        "xpBonus": 75
    },
    "escape-velocity": {
        "title": "Escaping from Mars",
        "description": "Mars: mass 6.4 × 10²³ kg, radius 3.4 × 10⁶ m. (a) Calculate escape velocity from Mars's surface. (b) Compare to Earth's 11.2 km/s — express as a ratio. (c) Gas molecules need 11 km/s to escape Earth's atmosphere. Mars's escape velocity is lower — explain why Mars has almost no atmosphere. (d) A probe launches from Mars orbit at 300 km altitude — calculate escape velocity from this height. (e) Calculate energy needed per kilogram to escape Mars vs Earth.",
        "hint": "v_esc = √(2GM/r). For orbit altitude: r = R_planet + altitude (convert km to m). Energy per kg = ½v_esc² = GM/r. Compare ratios to understand why Mars lost its atmosphere.",
        "xpBonus": 75
    },
    "springs-hookes-law": {
        "title": "Spring Collision on a Track",
        "description": "Trolley A (2 kg) moves at 3.0 m/s east toward stationary trolley B (3 kg) which has a spring (k = 800 N/m) on its front. (a) At maximum spring compression, both trolleys move at the same velocity — find this common velocity using momentum conservation. (b) Find maximum spring compression using energy conservation. (c) Find the final velocities after the spring fully extends (elastic collision — use both conservation laws). (d) Verify that momentum and KE are both conserved in your final answer.",
        "hint": "Common velocity: p_total = (m_A + m_B)v_common. Max compression: ½(m_A+m_B)v_common² + ½kx² = ½m_A u². For elastic collision final velocities: v_A = (m_A−m_B)u/(m_A+m_B), v_B = 2m_A u/(m_A+m_B).",
        "xpBonus": 75
    },
    "pendulums": {
        "title": "Grandfather Clock Altitude Correction",
        "description": "A grandfather clock uses a pendulum of length 1.000 m and keeps correct time at sea level (g = 9.810 m/s²). (a) Find the period at sea level. (b) The clock is moved to a mountain where g = 9.780 m/s². Find the new period. (c) Calculate how many seconds per day the clock loses (hint: Δtime/day = ΔT/T × 86400). (d) Find the new pendulum length needed to keep correct time at the mountain. (e) If instead the clock is taken to the Moon (g = 1.62 m/s²), by how many minutes per day does it lose?",
        "hint": "T = 2π√(L/g). Seconds lost per day = (T_new − T_old)/T_old × 86400. For new length: set T_old = 2π√(L_new/g_new) and solve for L_new.",
        "xpBonus": 75
    },
    "resonance": {
        "title": "Tacoma Narrows Bridge Analysis",
        "description": "A suspension bridge has natural oscillation frequency 0.20 Hz. Engineers test resonance risk. (a) Find the bridge's natural period T₀. (b) Strong winds create periodic vortex forces at 0.20 Hz — is this a resonance risk? Find amplitude ratio after 3 cycles if each cycle the wind adds 5% more amplitude. (c) Dampers reduce oscillation amplitude by 25% per cycle. Starting at amplitude A₀, find amplitude after 6 cycles. (d) At what wind-forcing frequency (close to 0.20 Hz) does resonance pose a risk? Define a 'danger zone' bandwidth. (e) Suggest two engineering solutions.",
        "hint": "Period T = 1/f. Resonance risk when f_forcing ≈ f_natural. Amplitude growth: A_n = A₀ × 1.05^n. With damping: A_n = A₀ × 0.75^n. Engineers typically define danger zone as within ±10% of natural frequency.",
        "xpBonus": 75
    },
    "wave-properties": {
        "title": "Earthquake Wave Detection",
        "description": "An earthquake produces P-waves (v = 6000 m/s) and S-waves (v = 3500 m/s). A seismograph records P-waves, then S-waves 28 s later. (a) Set up equations for both arrival times (distance d is unknown) and solve for d. (b) Find the P-wave wavelength if its frequency is 2.0 Hz. (c) Verify the 28 s time difference using your calculated distance. (d) A second station is 840 km from the epicentre — find its P-wave and S-wave arrival time difference. (e) Why can't S-waves travel through the Earth's liquid outer core?",
        "hint": "Both waves travel distance d. Arrival time: t_P = d/v_P, t_S = d/v_S. Time difference: d/v_S − d/v_P = 28 s. Solve for d. S-waves are transverse — they require a medium that can support shear stress (not possible in liquids).",
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
print('Batch B done. Spot-check:')
for slug in challenges:
    title = loaded.get(slug, {}).get('challenge', {}).get('title', 'MISSING')
    print(f'  {slug}: {title}')
