"""Update Challenge Lab descriptions — Batch A: topics 1-15"""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

challenges = {
    "scientific-method": {
        "title": "Designing a Friction Experiment",
        "description": "A student claims heavier objects experience more friction on the same surface. Design a controlled experiment to test this. (a) State a testable hypothesis. (b) Identify the independent, dependent, and all controlled variables. (c) Describe the method using school lab equipment. (d) State two sources of systematic error and how to reduce them. (e) Sketch a results table and predict the shape of a friction-force vs mass graph.",
        "hint": "Friction force F = μN = μmg. If μ stays constant, friction is proportional to weight — but does the experiment actually test whether μ changes? Think carefully about what variable you are isolating.",
        "xpBonus": 75
    },
    "units-measurement": {
        "title": "Uncertainty in a Pendulum Period",
        "description": "A student times 20 complete swings and records: 32.4 s, 32.6 s, 32.5 s across 3 trials. (a) Find the period T (one swing) and its absolute uncertainty. (b) Calculate L using T = 2π√(L/g), g = 9.81 m/s². (c) Find % uncertainty in T, then propagate to find % uncertainty in L (hint: L ∝ T²). (d) Express L with correct significant figures and uncertainty. (e) If a 4th trial gives 32.9 s, recalculate and comment on the outlier.",
        "hint": "Absolute uncertainty in T = (max − min) / 2 from the 3 values. For propagation: %unc in L = 2 × %unc in T because L ∝ T². Always divide by number of swings (20) first to get single-swing period.",
        "xpBonus": 75
    },
    "vectors": {
        "title": "River Crossing Navigation",
        "description": "A boat's speed in still water is 5.0 m/s. A river 80 m wide flows east at 3.0 m/s. (a) If the boat aims directly north, find the resultant velocity (magnitude and direction east of north). (b) Find the actual crossing time and how far downstream the boat lands. (c) Find the heading the boat must aim to travel directly north — calculate the required angle and crossing time. (d) Which strategy gets to the other bank faster — crossing directly or going straight across?",
        "hint": "For (a): resultant = √(5² + 3²), direction = arctan(3/5) east of north. For (c): the boat's eastward component must cancel the current, so v_boat × sinθ = 3 m/s. Then northward speed = v_boat × cosθ.",
        "xpBonus": 75
    },
    "position-velocity": {
        "title": "Analysing a Sprint Race",
        "description": "A 100 m sprinter's motion: Phase 1 (0–2 s): accelerates uniformly from 0 to 9 m/s. Phase 2 (2–10 s): constant 9 m/s. Phase 3 (10–10.8 s): decelerates uniformly to 7 m/s at finish. (a) Find acceleration in phase 1 and deceleration in phase 3. (b) Calculate distance covered in each phase and verify total ≈ 100 m. (c) Find average speed for the whole race. (d) Sketch the v-t graph with correct shape and labelled values. (e) What does the area under the v-t graph represent?",
        "hint": "Distance from v-t graph = area under the line. Phase 1: triangle area = ½ × base × height. Phase 2: rectangle. Phase 3: trapezium area = ½(v₁ + v₂) × t. Average speed = total distance / total time.",
        "xpBonus": 75
    },
    "equations-of-motion": {
        "title": "Emergency Braking Distance",
        "description": "A car travels at 120 km/h. Reaction time is 0.30 s. After braking, deceleration is 8.0 m/s². (a) Convert speed to m/s. (b) Find thinking distance (distance during reaction time). (c) Find braking distance using v² = u² + 2as. (d) Find total stopping distance. (e) Repeat for 100 km/h with same deceleration. (f) Express the reduction in stopping distance as a percentage — use this to explain why speed limits save lives.",
        "hint": "120 km/h = 120/3.6 m/s. Thinking distance = speed × reaction time. For braking: final velocity = 0, use v² = u² − 2as to find s. Total = thinking + braking.",
        "xpBonus": 75
    },
    "free-fall": {
        "title": "Falling from a Bridge",
        "description": "A stone is dropped from a bridge and hits water 3.2 s later. (a) Find the height of the bridge (ignore air resistance). (b) Find speed just before impact. (c) A second stone is thrown downward at 5.0 m/s — find its speed on hitting water and time to fall. (d) At what height above the water do both stones have the same speed? (e) How would air resistance change each result qualitatively?",
        "hint": "Dropped stone: h = ½gt², v = gt. Thrown stone: h = ut + ½gt², v² = u² + 2gh. For (d): set the velocity equations equal to find the height where they match.",
        "xpBonus": 75
    },
    "motion-graphs": {
        "title": "Decoding a Car Journey",
        "description": "A car's velocity-time data: 0–5 s accelerates uniformly 0→25 m/s; 5–15 s constant 25 m/s; 15–20 s decelerates uniformly 25→10 m/s; 20–25 s constant 10 m/s; 25–30 s decelerates uniformly 10→0 m/s. (a) Find acceleration/deceleration in each changing phase. (b) Calculate total distance travelled. (c) Find average speed for the whole journey. (d) Find average velocity if all motion is in the same direction. (e) Sketch the corresponding acceleration-time graph.",
        "hint": "Total distance = sum of all areas under v-t graph. For triangles: ½ × base × height. For trapeziums: ½(v₁ + v₂) × t. Average speed = total distance / total time. Average velocity = displacement / time (same here since one direction).",
        "xpBonus": 75
    },
    "projectile-motion": {
        "title": "Water Fountain Trajectory",
        "description": "Water is launched from ground level at 12 m/s at 60° above horizontal. (a) Find horizontal and vertical components of initial velocity. (b) Calculate maximum height reached. (c) Find total time of flight. (d) Find horizontal range. (e) At what other launch angle (with same speed) does water land at the same range? (f) Find the speed of the water at maximum height. Why is it not zero?",
        "hint": "At max height, vertical velocity = 0: use v_y² = u_y² − 2gh. Time of flight = 2 × time to max height. Range = v_x × total time. Complementary angles (60° and 30°) give the same range. At max height only the horizontal component remains.",
        "xpBonus": 75
    },
    "circular-motion": {
        "title": "Loop-the-Loop Roller Coaster",
        "description": "A roller coaster car (mass 800 kg with passengers) enters a vertical loop of radius 12 m. (a) Find the minimum speed at the top for the car to maintain contact (at minimum, normal force = 0). (b) Using energy conservation, find the minimum speed needed at the bottom of the loop (no friction). (c) Find the normal force on the passengers at the bottom if the car travels at 20 m/s. (d) Express this normal force as a multiple of weight — is this comfortable for passengers?",
        "hint": "Top of loop minimum: mg = mv²/r (N=0), so v_top = √(gr). Bottom: energy conservation from top to bottom with height difference 2r. Normal force at bottom: N − mg = mv²/r, so N = mg + mv²/r.",
        "xpBonus": 75
    },
    "relative-motion": {
        "title": "Aircraft in a Crosswind",
        "description": "A plane must fly due north at 250 km/h relative to the ground. Wind blows at 60 km/h from the west. (a) Draw a vector diagram showing airspeed, wind velocity, and groundspeed. (b) Find the direction the pilot must point the aircraft and the required airspeed. (c) Destination is 500 km due north — find actual flight time. (d) How would the answers change if the wind came from the north (headwind)? Find new airspeed and flight time.",
        "hint": "Vector addition: groundspeed (north) = airspeed (direction θ) + wind (east). The aircraft must aim slightly west to compensate. For (b): v_east_component = −60 (cancels wind), so airspeed × sinθ = 60. Use Pythagoras for total airspeed.",
        "xpBonus": 75
    },
    "newtons-first-law": {
        "title": "Seatbelt Force in a Crash",
        "description": "A 75 kg passenger in a car at 60 km/h is brought to rest in a collision. (a) If no seatbelt and contact with dashboard stops the passenger in 0.05 s, find deceleration and force. (b) A seatbelt extends the stopping time to 0.25 s — recalculate the force. (c) Express both forces as multiples of the passenger's weight (mg). (d) Calculate the distance the seatbelt stretches over 0.25 s. (e) Explain using Newton's first law why an unrestrained passenger continues moving forward.",
        "hint": "Convert speed: 60 km/h = 16.7 m/s. a = Δv/Δt. F = ma. Distance during deceleration: average velocity = (16.7 + 0)/2, then d = average velocity × time. A larger time means smaller force — this is the principle behind crumple zones.",
        "xpBonus": 75
    },
    "newtons-second-law": {
        "title": "Elevator Scale Readings",
        "description": "A 60 kg person stands on a scale in an elevator. The scale reads: (a) 648 N while accelerating upward; (b) 528 N while decelerating downward; (c) 600 N at constant velocity. For each: identify forces, apply F_net = ma, find acceleration magnitude and direction. (d) The cable snaps — what does the scale read? Explain in terms of apparent weightlessness. (e) What scale reading would produce the sensation of being twice as heavy?",
        "hint": "Scale reading = Normal force N. Newton's 2nd law (up = positive): N − mg = ma. When N > mg, acceleration is upward. When N < mg, acceleration is downward. Weightlessness: N = 0, so a = −g (free fall).",
        "xpBonus": 75
    },
    "newtons-third-law": {
        "title": "Rocket Thrust and Acceleration",
        "description": "A rocket (total initial mass 50,000 kg including 40,000 kg fuel) ejects gas at 2500 m/s relative to the rocket at a burn rate of 500 kg/s. (a) Find the thrust force (thrust = burn rate × exhaust speed). (b) Find the initial acceleration at launch (subtract weight). (c) After 60 s of burning, find the new mass and new acceleration (thrust unchanged). (d) Explain why acceleration increases as fuel burns even though thrust stays constant. (e) What happens to Newton's 3rd law pairs as gas is ejected?",
        "hint": "Thrust F = (Δm/Δt) × v_exhaust = 500 × 2500 N. Net force = Thrust − Weight. As fuel burns, mass decreases, so a = F_net/m increases. The 3rd law pair: rocket pushes gas backward, gas pushes rocket forward.",
        "xpBonus": 75
    },
    "free-body-diagrams": {
        "title": "Box on an Inclined Plane",
        "description": "A 15 kg box sits on a ramp inclined at 25°. Coefficient of static friction μs = 0.45. (a) Draw a fully labelled free-body diagram with all four forces (weight, normal, friction, any applied forces). (b) Calculate components of gravity along and perpendicular to the slope. (c) Determine whether the box slides or remains stationary. (d) Find the minimum angle at which the box will begin to slide. (e) A force F is applied up the slope — find the minimum F needed to prevent sliding if the ramp angle is increased to 40°.",
        "hint": "Weight components: along slope = mg sinθ, perpendicular to slope = mg cosθ. The box slides when mg sinθ > μs × mg cosθ, i.e. when tanθ > μs. Critical angle: θ_c = arctan(μs).",
        "xpBonus": 75
    },
    "work-kinetic-energy": {
        "title": "Pile Driver Impact Force",
        "description": "A 500 kg pile driver falls freely from rest through 8.0 m. (a) Find its speed just before impact using energy conservation. (b) The driver embeds 25 cm into the ground. Find the average resistive force from the ground. (c) Calculate total work done by gravity over the full 8.25 m (fall + embedding). (d) Verify energy conservation: all GPE converts to work against resistance. (e) The same pile driver is now used to drive a pile that requires 900 kN of average resistance — what minimum drop height is needed?",
        "hint": "KE at impact = mgh. Work-energy theorem during embedding: F_net × d = ΔKE = 0 − ½mv². F_net = gravity − resistance. Total work by gravity = mgh_total. For (e): mgh = F_resistance × 0.25, solve for h.",
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
print(f'Batch A done. Spot-check:')
for slug in challenges:
    title = loaded.get(slug, {}).get('challenge', {}).get('title', 'MISSING')
    print(f'  {slug}: {title}')
