#!/usr/bin/env python3
"""Add 10 worked examples to batch 2 topics:
circular-motion, relative-motion, newtons-first-law, newtons-second-law,
newtons-third-law, free-body-diagrams, work-kinetic-energy, potential-energy
"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"circular-motion": [
  {"title":"Period and Frequency of a Circular Path","steps":[
    {"text":"A car completes 3 laps of a circular track in 60 s. Find the period and frequency.","latex":"","isFinal":False},
    {"text":"Period T = total time / number of laps","latex":"T = \\frac{60}{3} = 20\\text{ s}","isFinal":False},
    {"text":"Frequency f = 1/T","latex":"f = \\frac{1}{20} = 0.05\\text{ Hz}","isFinal":True}
  ]},
  {"title":"Orbital Speed from Radius and Period","steps":[
    {"text":"A satellite orbits at radius 7000 km with period 98 min. Find its orbital speed.","latex":"","isFinal":False},
    {"text":"Convert units: r = 7 × 10⁶ m, T = 5880 s","latex":"","isFinal":False},
    {"text":"Circumference = 2πr","latex":"C = 2\\pi \\times 7\\times10^6 = 4.398\\times10^7\\text{ m}","isFinal":False},
    {"text":"Speed v = C / T","latex":"v = \\frac{4.398\\times10^7}{5880} \\approx 7480\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Centripetal Acceleration","steps":[
    {"text":"A stone on a 0.5 m string moves at 4 m/s. Find the centripetal acceleration.","latex":"","isFinal":False},
    {"text":"Apply the centripetal acceleration formula","latex":"a_c = \\frac{v^2}{r} = \\frac{4^2}{0.5} = \\frac{16}{0.5} = 32\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Centripetal Force on a Car","steps":[
    {"text":"A 1200 kg car rounds a 50 m radius curve at 15 m/s. Find the centripetal force.","latex":"","isFinal":False},
    {"text":"Centripetal force formula","latex":"F_c = \\frac{mv^2}{r}","isFinal":False},
    {"text":"Substitute values","latex":"F_c = \\frac{1200 \\times 15^2}{50} = \\frac{270000}{50} = 5400\\text{ N}","isFinal":True}
  ]},
  {"title":"Angular Velocity","steps":[
    {"text":"A wheel completes 120 revolutions per minute. Find its angular velocity in rad/s.","latex":"","isFinal":False},
    {"text":"Convert rev/min to rev/s: 120/60 = 2 rev/s","latex":"","isFinal":False},
    {"text":"Each revolution = 2π rad","latex":"\\omega = 2 \\times 2\\pi = 4\\pi \\approx 12.57\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Minimum Speed at Top of Loop","steps":[
    {"text":"Find the minimum speed needed at the top of a 4 m radius vertical loop so the rider doesn't fall.","latex":"","isFinal":False},
    {"text":"At minimum speed, gravity provides all centripetal force: mg = mv²/r","latex":"g = \\frac{v^2}{r}","isFinal":False},
    {"text":"Solve for v","latex":"v_{min} = \\sqrt{gr} = \\sqrt{9.8 \\times 4} = \\sqrt{39.2} \\approx 6.26\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Tension in a Horizontal Circle","steps":[
    {"text":"A 0.2 kg ball on a 0.8 m string swings in a horizontal circle at 6 m/s. Find the tension.","latex":"","isFinal":False},
    {"text":"Tension provides the centripetal force (horizontal plane, ignore gravity)","latex":"T = \\frac{mv^2}{r} = \\frac{0.2 \\times 36}{0.8} = \\frac{7.2}{0.8} = 9\\text{ N}","isFinal":True}
  ]},
  {"title":"Banked Road Angle","steps":[
    {"text":"A road is banked for cars travelling at 20 m/s around a 100 m curve. Find the banking angle.","latex":"","isFinal":False},
    {"text":"For ideal banking (no friction needed): tan θ = v²/rg","latex":"\\tan\\theta = \\frac{v^2}{rg} = \\frac{400}{100 \\times 9.8} = 0.408","isFinal":False},
    {"text":"Find θ","latex":"\\theta = \\arctan(0.408) \\approx 22.2°","isFinal":True}
  ]},
  {"title":"Comparing Centripetal Accelerations","steps":[
    {"text":"Object A: r = 2 m, v = 4 m/s. Object B: r = 8 m, v = 4 m/s. Compare their centripetal accelerations.","latex":"","isFinal":False},
    {"text":"Object A","latex":"a_A = \\frac{4^2}{2} = 8\\text{ m/s}^2","isFinal":False},
    {"text":"Object B","latex":"a_B = \\frac{4^2}{8} = 2\\text{ m/s}^2","isFinal":False},
    {"text":"Conclusion: Object A has 4× the centripetal acceleration of Object B.","latex":"\\frac{a_A}{a_B} = 4","isFinal":True}
  ]},
  {"title":"Gravity as Centripetal Force","steps":[
    {"text":"The Moon orbits Earth at r = 3.84 × 10⁸ m with T = 27.3 days. Find the centripetal acceleration and compare with g at that distance.","latex":"","isFinal":False},
    {"text":"Convert T to seconds: T = 27.3 × 86400 = 2.36 × 10⁶ s","latex":"","isFinal":False},
    {"text":"Orbital speed","latex":"v = \\frac{2\\pi r}{T} = \\frac{2\\pi \\times 3.84\\times10^8}{2.36\\times10^6} \\approx 1022\\text{ m/s}","isFinal":False},
    {"text":"Centripetal acceleration","latex":"a_c = \\frac{v^2}{r} = \\frac{1022^2}{3.84\\times10^8} \\approx 0.00272\\text{ m/s}^2","isFinal":True}
  ]}
],

"relative-motion": [
  {"title":"Relative Velocity in Same Direction","steps":[
    {"text":"Car A travels at 80 km/h. Car B travels at 50 km/h in the same direction. What is A's velocity relative to B?","latex":"","isFinal":False},
    {"text":"Relative velocity = v_A − v_B (same direction)","latex":"v_{A\\text{ rel }B} = 80 - 50 = 30\\text{ km/h (forward)}","isFinal":True}
  ]},
  {"title":"Relative Velocity in Opposite Directions","steps":[
    {"text":"Two trains approach each other, one at 60 km/h and the other at 80 km/h. Find their relative speed.","latex":"","isFinal":False},
    {"text":"When moving towards each other, relative speed = sum of speeds","latex":"v_{rel} = 60 + 80 = 140\\text{ km/h}","isFinal":True}
  ]},
  {"title":"Swimmer Crossing a River","steps":[
    {"text":"A swimmer can swim at 3 m/s in still water. A river flows at 4 m/s. Find the resultant speed.","latex":"","isFinal":False},
    {"text":"Velocity vectors are perpendicular (swimmer aims across, river flows along)","latex":"v_{res} = \\sqrt{3^2 + 4^2} = \\sqrt{9+16} = \\sqrt{25} = 5\\text{ m/s}","isFinal":False},
    {"text":"Direction: θ = arctan(4/3) ≈ 53.1° downstream from intended direction","latex":"\\theta = \\arctan\\!\\left(\\frac{4}{3}\\right) \\approx 53.1°","isFinal":True}
  ]},
  {"title":"Minimum Drift Across River","steps":[
    {"text":"River width 100 m, river current 4 m/s, swimmer speed 5 m/s. At what angle should the swimmer aim to land directly opposite?","latex":"","isFinal":False},
    {"text":"Swim upstream at angle θ so horizontal components cancel: 5 sin θ = 4","latex":"\\sin\\theta = \\frac{4}{5} = 0.8 \\Rightarrow \\theta = 53.1°\\text{ upstream}","isFinal":False},
    {"text":"Effective crossing speed","latex":"v_{cross} = \\sqrt{5^2 - 4^2} = 3\\text{ m/s}, \\quad t = \\frac{100}{3} \\approx 33.3\\text{ s}","isFinal":True}
  ]},
  {"title":"Aircraft in Wind","steps":[
    {"text":"An aircraft heads north at 300 km/h (airspeed). Wind blows east at 40 km/h. Find the ground speed and direction.","latex":"","isFinal":False},
    {"text":"Ground velocity components: north 300, east 40","latex":"v_g = \\sqrt{300^2 + 40^2} = \\sqrt{90000+1600} = \\sqrt{91600} \\approx 302.7\\text{ km/h}","isFinal":False},
    {"text":"Drift angle east of north","latex":"\\theta = \\arctan\\!\\left(\\frac{40}{300}\\right) \\approx 7.6°\\text{ east of north}","isFinal":True}
  ]},
  {"title":"Time to Overtake","steps":[
    {"text":"Car A (100 km/h) is 500 m behind Car B (80 km/h), both heading the same way. How long to overtake?","latex":"","isFinal":False},
    {"text":"Relative speed of A w.r.t. B","latex":"v_{rel} = 100 - 80 = 20\\text{ km/h} = \\frac{20}{3.6} \\approx 5.56\\text{ m/s}","isFinal":False},
    {"text":"Time to close 500 m gap","latex":"t = \\frac{500}{5.56} \\approx 90\\text{ s}","isFinal":True}
  ]},
  {"title":"Ball Thrown From Moving Train","steps":[
    {"text":"A train moves at 20 m/s. A passenger throws a ball forward at 10 m/s relative to the train. What is the ball's speed relative to the ground?","latex":"","isFinal":False},
    {"text":"Velocities in same direction add","latex":"v_{ball,ground} = 20 + 10 = 30\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Collision Frame Analysis","steps":[
    {"text":"Two cars: A at +10 m/s, B at −15 m/s (opposite direction). Find velocity of A as seen from B.","latex":"","isFinal":False},
    {"text":"Relative velocity of A with respect to B","latex":"v_{A/B} = v_A - v_B = 10 - (-15) = 25\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Rain and Umbrella Angle","steps":[
    {"text":"Rain falls vertically at 8 m/s. A person walks at 3 m/s. At what angle should they tilt their umbrella?","latex":"","isFinal":False},
    {"text":"Rain's velocity relative to walker: vertical 8 m/s down, horizontal 3 m/s backward","latex":"","isFinal":False},
    {"text":"Tilt angle from vertical","latex":"\\theta = \\arctan\\!\\left(\\frac{3}{8}\\right) \\approx 20.6°\\text{ forward}","isFinal":True}
  ]},
  {"title":"Escalator Problem","steps":[
    {"text":"An escalator moves at 1.5 m/s. A person walks on it at 1 m/s in the same direction. Find their speed relative to ground and time to cover 20 m.","latex":"","isFinal":False},
    {"text":"Combined speed","latex":"v = 1.5 + 1 = 2.5\\text{ m/s}","isFinal":False},
    {"text":"Time","latex":"t = \\frac{20}{2.5} = 8\\text{ s}","isFinal":True}
  ]}
],

"newtons-first-law": [
  {"title":"Identifying Net Force = 0","steps":[
    {"text":"A book sits on a table. Forces: weight 15 N down, normal force 15 N up. Is the net force zero?","latex":"","isFinal":False},
    {"text":"Sum forces","latex":"\\Sigma F = 15 - 15 = 0\\text{ N}","isFinal":False},
    {"text":"Since net force = 0, the book remains at rest — consistent with Newton's First Law.","latex":"","isFinal":True}
  ]},
  {"title":"Finding the Missing Force for Equilibrium","steps":[
    {"text":"Three forces act on an object: 10 N east, 6 N west, and unknown force F. For equilibrium, find F.","latex":"","isFinal":False},
    {"text":"For equilibrium, net force = 0. East positive.","latex":"10 - 6 + F = 0 \\Rightarrow F = -4\\text{ N}","isFinal":False},
    {"text":"F = 4 N directed west","latex":"","isFinal":True}
  ]},
  {"title":"Inertia and Mass","steps":[
    {"text":"Object A has mass 2 kg, Object B has mass 8 kg. Which has greater inertia? How much more?","latex":"","isFinal":False},
    {"text":"Inertia is directly proportional to mass","latex":"\\frac{m_B}{m_A} = \\frac{8}{2} = 4","isFinal":False},
    {"text":"Object B has 4× the inertia of Object A and resists changes in motion 4× more.","latex":"","isFinal":True}
  ]},
  {"title":"Passenger in Braking Bus","steps":[
    {"text":"A bus travelling at 15 m/s brakes to a stop. Why does a standing passenger lurch forward?","latex":"","isFinal":False},
    {"text":"The passenger's body has inertia — it tends to continue at 15 m/s.","latex":"","isFinal":False},
    {"text":"The bus decelerates but no sufficient horizontal force acts on the passenger's upper body to decelerate it equally, so they lurch forward.","latex":"","isFinal":True}
  ]},
  {"title":"Tablecloth Trick Explanation","steps":[
    {"text":"A tablecloth is yanked quickly from under dishes. The dishes barely move. Explain using Newton's First Law.","latex":"","isFinal":False},
    {"text":"The dishes are at rest and have inertia. The contact time is very brief, so the friction impulse is small.","latex":"\\Delta p = F\\,\\Delta t \\approx 0\\text{ (very small)}","isFinal":False},
    {"text":"The dishes remain approximately at rest because the net force on them was negligible — Newton's First Law.","latex":"","isFinal":True}
  ]},
  {"title":"Ball Rolling on Frictionless Surface","steps":[
    {"text":"A 3 kg ball rolls at constant 5 m/s on a frictionless surface. What is the net force on it?","latex":"","isFinal":False},
    {"text":"Constant velocity means zero acceleration, so by Newton's First Law","latex":"\\Sigma F = ma = 3 \\times 0 = 0\\text{ N}","isFinal":True}
  ]},
  {"title":"Astronaut in Deep Space","steps":[
    {"text":"An astronaut pushes a 10 kg crate at 2 m/s and releases it in deep space (no gravity, no friction). What happens?","latex":"","isFinal":False},
    {"text":"No net force acts on the crate after release.","latex":"","isFinal":False},
    {"text":"By Newton's First Law, the crate continues at 2 m/s indefinitely.","latex":"v = 2\\text{ m/s (constant)}","isFinal":True}
  ]},
  {"title":"Two Equal Opposite Forces","steps":[
    {"text":"A rope tug-of-war: Team A pulls 500 N left, Team B pulls 500 N right. What is the rope's acceleration?","latex":"","isFinal":False},
    {"text":"Net force on rope","latex":"\\Sigma F = 500 - 500 = 0\\text{ N}","isFinal":False},
    {"text":"By Newton's First Law, a = 0; rope remains stationary (or moves at constant velocity if already moving).","latex":"","isFinal":True}
  ]},
  {"title":"Equilibrium of a Hanging Sign","steps":[
    {"text":"A sign of weight 80 N hangs from two equal wires making 30° each with the horizontal. Find the tension in each wire.","latex":"","isFinal":False},
    {"text":"Vertical equilibrium: 2T sin30° = W","latex":"2T \\times 0.5 = 80","isFinal":False},
    {"text":"Solve for T","latex":"T = \\frac{80}{1} = 80\\text{ N}","isFinal":True}
  ]},
  {"title":"Car at Constant Velocity on Highway","steps":[
    {"text":"A car moves at 100 km/h on a straight highway. Engine provides 2000 N forward. What is the air resistance?","latex":"","isFinal":False},
    {"text":"Constant velocity → net force = 0","latex":"F_{engine} - F_{drag} = 0","isFinal":False},
    {"text":"Drag force equals engine force","latex":"F_{drag} = 2000\\text{ N}","isFinal":True}
  ]}
],

"newtons-second-law": [
  {"title":"Finding Acceleration from Net Force","steps":[
    {"text":"A 5 kg object has a net force of 20 N applied. Find its acceleration.","latex":"","isFinal":False},
    {"text":"Apply F = ma","latex":"a = \\frac{F}{m} = \\frac{20}{5} = 4\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Finding Mass from Force and Acceleration","steps":[
    {"text":"A net force of 36 N gives an object acceleration 9 m/s². Find the mass.","latex":"","isFinal":False},
    {"text":"Rearrange F = ma for m","latex":"m = \\frac{F}{a} = \\frac{36}{9} = 4\\text{ kg}","isFinal":True}
  ]},
  {"title":"Net Force with Friction","steps":[
    {"text":"A 10 kg box is pushed with 60 N. Friction is 20 N. Find the acceleration.","latex":"","isFinal":False},
    {"text":"Net force = applied − friction","latex":"F_{net} = 60 - 20 = 40\\text{ N}","isFinal":False},
    {"text":"Apply Newton's Second Law","latex":"a = \\frac{F_{net}}{m} = \\frac{40}{10} = 4\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Object on an Incline","steps":[
    {"text":"A 6 kg block slides down a frictionless 30° incline. Find its acceleration.","latex":"","isFinal":False},
    {"text":"Component of gravity along incline","latex":"F_{\\parallel} = mg\\sin 30° = 6 \\times 9.8 \\times 0.5 = 29.4\\text{ N}","isFinal":False},
    {"text":"Acceleration","latex":"a = \\frac{29.4}{6} = 4.9\\text{ m/s}^2\\text{ (down the slope)}","isFinal":True}
  ]},
  {"title":"Atwood Machine","steps":[
    {"text":"Two masses: m₁ = 3 kg and m₂ = 5 kg hang over a frictionless pulley. Find the acceleration.","latex":"","isFinal":False},
    {"text":"Net unbalanced force = (m₂ − m₁)g","latex":"F_{net} = (5-3) \\times 9.8 = 19.6\\text{ N}","isFinal":False},
    {"text":"Total mass being accelerated = m₁ + m₂","latex":"a = \\frac{F_{net}}{m_1+m_2} = \\frac{19.6}{8} = 2.45\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Rocket Thrust","steps":[
    {"text":"A 500 kg rocket fires engines producing 12000 N thrust upward. Find the acceleration (g = 9.8 m/s²).","latex":"","isFinal":False},
    {"text":"Weight of rocket","latex":"W = mg = 500 \\times 9.8 = 4900\\text{ N}","isFinal":False},
    {"text":"Net upward force","latex":"F_{net} = 12000 - 4900 = 7100\\text{ N}","isFinal":False},
    {"text":"Acceleration","latex":"a = \\frac{7100}{500} = 14.2\\text{ m/s}^2\\text{ upward}","isFinal":True}
  ]},
  {"title":"Braking Distance Force","steps":[
    {"text":"A 1000 kg car decelerates from 20 m/s to rest in 5 s. Find the braking force.","latex":"","isFinal":False},
    {"text":"Find deceleration first","latex":"a = \\frac{\\Delta v}{t} = \\frac{0 - 20}{5} = -4\\text{ m/s}^2","isFinal":False},
    {"text":"Apply Newton's Second Law","latex":"F = ma = 1000 \\times (-4) = -4000\\text{ N (braking)}","isFinal":True}
  ]},
  {"title":"Two Connected Objects","steps":[
    {"text":"Mass A (4 kg) is pushed with 30 N. It is connected to mass B (2 kg) via a string. Both are on a frictionless surface. Find acceleration and tension.","latex":"","isFinal":False},
    {"text":"System acceleration (treat as one 6 kg mass)","latex":"a = \\frac{30}{4+2} = 5\\text{ m/s}^2","isFinal":False},
    {"text":"Tension in string (acts on B alone)","latex":"T = m_B \\times a = 2 \\times 5 = 10\\text{ N}","isFinal":True}
  ]},
  {"title":"Variable Forces — Average Acceleration","steps":[
    {"text":"A 2 kg object experiences forces: 10 N for 3 s, then 4 N for 2 s. Find average acceleration over each interval.","latex":"","isFinal":False},
    {"text":"First interval","latex":"a_1 = \\frac{10}{2} = 5\\text{ m/s}^2","isFinal":False},
    {"text":"Second interval","latex":"a_2 = \\frac{4}{2} = 2\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Weight vs Mass","steps":[
    {"text":"An astronaut has mass 75 kg. Find their weight on Earth (g = 9.8) and on the Moon (g = 1.6 m/s²).","latex":"","isFinal":False},
    {"text":"Weight on Earth","latex":"W_E = 75 \\times 9.8 = 735\\text{ N}","isFinal":False},
    {"text":"Weight on Moon","latex":"W_M = 75 \\times 1.6 = 120\\text{ N}","isFinal":False},
    {"text":"Mass is the same (75 kg) everywhere; weight changes with gravitational field.","latex":"","isFinal":True}
  ]}
],

"newtons-third-law": [
  {"title":"Identifying Action–Reaction Pairs","steps":[
    {"text":"A person pushes a wall with 50 N. Identify the action–reaction pair.","latex":"","isFinal":False},
    {"text":"Action: Person pushes wall with 50 N east.","latex":"F_{\\text{person}\\to\\text{wall}} = 50\\text{ N east}","isFinal":False},
    {"text":"Reaction: Wall pushes person with 50 N west.","latex":"F_{\\text{wall}\\to\\text{person}} = 50\\text{ N west}","isFinal":True}
  ]},
  {"title":"Recoil Velocity of a Gun","steps":[
    {"text":"A 3 kg rifle fires a 0.015 kg bullet at 400 m/s. Find the rifle's recoil velocity.","latex":"","isFinal":False},
    {"text":"Momentum conservation (initial momentum = 0)","latex":"0 = m_{bullet}v_{bullet} + m_{rifle}v_{rifle}","isFinal":False},
    {"text":"Solve for rifle velocity","latex":"v_{rifle} = -\\frac{0.015 \\times 400}{3} = -2\\text{ m/s}","isFinal":False},
    {"text":"Rifle recoils at 2 m/s opposite to bullet direction.","latex":"","isFinal":True}
  ]},
  {"title":"Rocket Propulsion","steps":[
    {"text":"A rocket ejects gas at 600 m/s at a rate of 10 kg/s. Find the thrust force.","latex":"","isFinal":False},
    {"text":"Thrust = mass flow rate × exhaust velocity (Newton's 3rd Law)","latex":"F_{thrust} = \\dot{m} \\times v_{exhaust} = 10 \\times 600 = 6000\\text{ N}","isFinal":True}
  ]},
  {"title":"Normal Force as Reaction","steps":[
    {"text":"A 70 kg person stands on the floor. Explain the normal force using Newton's Third Law.","latex":"","isFinal":False},
    {"text":"Person pushes floor down with weight","latex":"F_{\\text{person}\\to\\text{floor}} = 70 \\times 9.8 = 686\\text{ N down}","isFinal":False},
    {"text":"Floor pushes person up with equal and opposite normal force","latex":"N = 686\\text{ N upward}","isFinal":True}
  ]},
  {"title":"Swimmer Pushing Off Wall","steps":[
    {"text":"A 60 kg swimmer pushes off the pool wall with 300 N for 0.5 s. Find their speed after push-off.","latex":"","isFinal":False},
    {"text":"By Newton's 3rd Law, wall pushes swimmer with 300 N. Impulse = Ft","latex":"J = 300 \\times 0.5 = 150\\text{ N·s}","isFinal":False},
    {"text":"Change in momentum = Impulse","latex":"v = \\frac{J}{m} = \\frac{150}{60} = 2.5\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Horse and Cart Paradox","steps":[
    {"text":"A horse pulls a cart. If the cart pulls back equally, why does the cart move?","latex":"","isFinal":False},
    {"text":"The action–reaction forces act on DIFFERENT objects. The horse pulls cart forward; cart pulls horse backward — these don't cancel.","latex":"","isFinal":False},
    {"text":"The cart moves because the net force ON IT (horse's pull minus friction on cart wheels) is forward.","latex":"F_{net,cart} = F_{horse\\to cart} - F_{friction,cart} > 0","isFinal":True}
  ]},
  {"title":"Ball Bouncing Off Floor","steps":[
    {"text":"A 0.5 kg ball hits the floor with velocity 6 m/s downward and bounces at 4 m/s upward. Find the force if contact time is 0.02 s.","latex":"","isFinal":False},
    {"text":"Change in momentum (upward positive)","latex":"\\Delta p = m(v_f - v_i) = 0.5(4 - (-6)) = 0.5 \\times 10 = 5\\text{ N·s}","isFinal":False},
    {"text":"Average force from floor on ball","latex":"F = \\frac{\\Delta p}{\\Delta t} = \\frac{5}{0.02} = 250\\text{ N upward}","isFinal":True}
  ]},
  {"title":"Jumping off a Boat","steps":[
    {"text":"A 60 kg person jumps horizontally off a 200 kg boat at 3 m/s. Find the boat's recoil speed.","latex":"","isFinal":False},
    {"text":"System initially at rest; total momentum = 0","latex":"m_p v_p + m_b v_b = 0","isFinal":False},
    {"text":"Solve for boat velocity","latex":"v_b = -\\frac{60 \\times 3}{200} = -0.9\\text{ m/s (opposite to person)}","isFinal":True}
  ]},
  {"title":"Tension in Rope Between Two Blocks","steps":[
    {"text":"Block A (5 kg) pulls Block B (3 kg) via a rope on a frictionless surface with 40 N applied to A. Find the tension.","latex":"","isFinal":False},
    {"text":"System acceleration","latex":"a = \\frac{40}{5+3} = 5\\text{ m/s}^2","isFinal":False},
    {"text":"Tension = force needed to accelerate B at 5 m/s²","latex":"T = 3 \\times 5 = 15\\text{ N}","isFinal":True}
  ]},
  {"title":"Newton's 3rd Law in a Collision","steps":[
    {"text":"Car A (1000 kg) hits Car B (1500 kg). Car A exerts 9000 N on B during impact. What force does B exert on A?","latex":"","isFinal":False},
    {"text":"Newton's Third Law: forces are equal and opposite","latex":"F_{B\\to A} = 9000\\text{ N (in opposite direction)}","isFinal":False},
    {"text":"Car A's deceleration vs Car B's acceleration","latex":"a_A = \\frac{9000}{1000} = 9\\text{ m/s}^2, \\quad a_B = \\frac{9000}{1500} = 6\\text{ m/s}^2","isFinal":True}
  ]}
],

"free-body-diagrams": [
  {"title":"FBD of a Resting Block","steps":[
    {"text":"A 5 kg block rests on a table. Identify all forces and verify equilibrium.","latex":"","isFinal":False},
    {"text":"Forces: Weight W = mg downward, Normal N upward","latex":"W = 5 \\times 9.8 = 49\\text{ N}\\downarrow, \\quad N = 49\\text{ N}\\uparrow","isFinal":False},
    {"text":"Net force = 0, confirming static equilibrium (Newton's First Law)","latex":"\\Sigma F = N - W = 49 - 49 = 0","isFinal":True}
  ]},
  {"title":"FBD on a Frictionless Incline","steps":[
    {"text":"A 4 kg block sits on a 35° frictionless incline. Draw the FBD and find the normal force.","latex":"","isFinal":False},
    {"text":"Forces: Weight W = mg along vertical, Normal N perpendicular to surface","latex":"W = 4 \\times 9.8 = 39.2\\text{ N}","isFinal":False},
    {"text":"Normal force balances perpendicular component of weight","latex":"N = mg\\cos 35° = 39.2 \\times 0.819 \\approx 32.1\\text{ N}","isFinal":True}
  ]},
  {"title":"FBD with Friction","steps":[
    {"text":"A 10 kg box is pushed at 30 N on a surface with friction force 10 N. Draw FBD and find net force.","latex":"","isFinal":False},
    {"text":"Horizontal forces: push 30 N right, friction 10 N left","latex":"F_{net,x} = 30 - 10 = 20\\text{ N (right)}","isFinal":False},
    {"text":"Vertical forces balance (N = W). Net force = 20 N right","latex":"a = \\frac{20}{10} = 2\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"FBD of a Hanging Object","steps":[
    {"text":"A 3 kg ornament hangs from the ceiling by a string. Find tension.","latex":"","isFinal":False},
    {"text":"Forces: Tension T upward, weight W downward. In equilibrium:","latex":"T = W = mg = 3 \\times 9.8 = 29.4\\text{ N}","isFinal":True}
  ]},
  {"title":"Two-Rope Suspension","steps":[
    {"text":"A 60 N lamp is supported by two ropes: one horizontal, one at 60° from horizontal. Find both tensions.","latex":"","isFinal":False},
    {"text":"Rope 2 (angled at 60°) provides vertical support: T₂sin60° = 60","latex":"T_2 = \\frac{60}{\\sin 60°} = \\frac{60}{0.866} \\approx 69.3\\text{ N}","isFinal":False},
    {"text":"Rope 1 (horizontal) balances T₂'s horizontal component","latex":"T_1 = T_2 \\cos 60° = 69.3 \\times 0.5 = 34.6\\text{ N}","isFinal":True}
  ]},
  {"title":"FBD During Elevator Acceleration","steps":[
    {"text":"A 70 kg person stands in an elevator accelerating upward at 2 m/s². Find the normal force.","latex":"","isFinal":False},
    {"text":"Apply Newton's Second Law: N − mg = ma","latex":"N = m(g + a) = 70(9.8 + 2) = 70 \\times 11.8 = 826\\text{ N}","isFinal":True}
  ]},
  {"title":"FBD with Angle Push","steps":[
    {"text":"A 50 N force is applied at 25° below horizontal on a 8 kg box on a flat surface (μ = 0.3). Find normal force.","latex":"","isFinal":False},
    {"text":"The downward component of applied force adds to weight","latex":"N = mg + F\\sin 25° = 8(9.8) + 50(0.423) = 78.4 + 21.1 = 99.5\\text{ N}","isFinal":True}
  ]},
  {"title":"FBD of a Car on a Slope","steps":[
    {"text":"A 1200 kg car sits on a 15° slope. Find the friction force keeping it stationary.","latex":"","isFinal":False},
    {"text":"The component of gravity down the slope must be balanced by static friction","latex":"f_s = mg\\sin 15° = 1200 \\times 9.8 \\times 0.259 = 3045\\text{ N}","isFinal":True}
  ]},
  {"title":"FBD of a Pulley System","steps":[
    {"text":"A 5 kg mass hangs on one side of a pulley, a 3 kg mass on the other. Draw FBDs and find acceleration.","latex":"","isFinal":False},
    {"text":"Net force on system = (5 − 3)g","latex":"F_{net} = 2 \\times 9.8 = 19.6\\text{ N}","isFinal":False},
    {"text":"Total mass = 8 kg","latex":"a = \\frac{19.6}{8} = 2.45\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Static vs Kinetic Friction in FBD","steps":[
    {"text":"A 20 kg crate: μₛ = 0.4, μₖ = 0.3. Find max static friction and kinetic friction.","latex":"","isFinal":False},
    {"text":"Normal force on flat surface","latex":"N = 20 \\times 9.8 = 196\\text{ N}","isFinal":False},
    {"text":"Max static friction","latex":"f_{s,max} = \\mu_s N = 0.4 \\times 196 = 78.4\\text{ N}","isFinal":False},
    {"text":"Kinetic friction (once moving)","latex":"f_k = \\mu_k N = 0.3 \\times 196 = 58.8\\text{ N}","isFinal":True}
  ]}
],

"work-kinetic-energy": [
  {"title":"Work Done by a Constant Force","steps":[
    {"text":"A 50 N force is applied at 0° (horizontal) to move a box 8 m. Find the work done.","latex":"","isFinal":False},
    {"text":"Apply W = Fd cosθ with θ = 0°","latex":"W = 50 \\times 8 \\times \\cos 0° = 50 \\times 8 \\times 1 = 400\\text{ J}","isFinal":True}
  ]},
  {"title":"Work by Force at an Angle","steps":[
    {"text":"A 40 N force at 60° above horizontal drags a block 5 m. Find work done by this force.","latex":"","isFinal":False},
    {"text":"Only horizontal component does work on horizontal displacement","latex":"W = F \\cos\\theta \\times d = 40 \\times \\cos 60° \\times 5 = 40 \\times 0.5 \\times 5 = 100\\text{ J}","isFinal":True}
  ]},
  {"title":"Work–Energy Theorem","steps":[
    {"text":"A 2 kg ball at rest is pushed with net force 10 N over 5 m. Find final speed.","latex":"","isFinal":False},
    {"text":"Work done = net force × displacement","latex":"W_{net} = 10 \\times 5 = 50\\text{ J}","isFinal":False},
    {"text":"Work–Energy Theorem: W_net = ΔKE = ½mv² − 0","latex":"50 = \\frac{1}{2} \\times 2 \\times v^2 \\Rightarrow v^2 = 50 \\Rightarrow v \\approx 7.07\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Finding KE from Speed","steps":[
    {"text":"A 1500 kg car moves at 20 m/s. Find its kinetic energy.","latex":"","isFinal":False},
    {"text":"KE formula","latex":"KE = \\frac{1}{2}mv^2 = \\frac{1}{2} \\times 1500 \\times 400 = 300\\,000\\text{ J} = 300\\text{ kJ}","isFinal":True}
  ]},
  {"title":"Work Against Friction","steps":[
    {"text":"A 10 kg box is pushed 6 m at constant speed with 30 N applied. Find friction force and work done by each force.","latex":"","isFinal":False},
    {"text":"Constant speed → net work = 0 → friction = applied force = 30 N","latex":"f = 30\\text{ N}","isFinal":False},
    {"text":"Work by applied force: +180 J. Work by friction: −180 J. Net work = 0.","latex":"W_{applied} = 30 \\times 6 = +180\\text{ J}, \\quad W_{friction} = -180\\text{ J}","isFinal":True}
  ]},
  {"title":"Change in Speed from Work","steps":[
    {"text":"A 5 kg object has KE = 200 J. A 50 J net work is done on it. Find its new speed.","latex":"","isFinal":False},
    {"text":"New KE = old KE + work done","latex":"KE_{new} = 200 + 50 = 250\\text{ J}","isFinal":False},
    {"text":"Find speed from KE","latex":"v = \\sqrt{\\frac{2 \\times KE}{m}} = \\sqrt{\\frac{500}{5}} = \\sqrt{100} = 10\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Negative Work","steps":[
    {"text":"A braking force of 500 N stops a car over 20 m. How much work does the brakes do?","latex":"","isFinal":False},
    {"text":"Force is opposite to displacement → θ = 180°","latex":"W = F d \\cos 180° = 500 \\times 20 \\times (-1) = -10000\\text{ J}","isFinal":False},
    {"text":"The brakes remove 10 000 J of kinetic energy from the car.","latex":"","isFinal":True}
  ]},
  {"title":"Work Done by Gravity","steps":[
    {"text":"A 3 kg ball falls 5 m under gravity (g = 9.8 m/s²). How much work does gravity do?","latex":"","isFinal":False},
    {"text":"Weight W = mg acts downward, displacement is also downward (θ = 0°)","latex":"W_g = mgh = 3 \\times 9.8 \\times 5 = 147\\text{ J}","isFinal":True}
  ]},
  {"title":"Power and Work","steps":[
    {"text":"A 60 W motor lifts a 10 kg load. How high can it lift the load in 15 s?","latex":"","isFinal":False},
    {"text":"Work done by motor = Power × time","latex":"W = P \\times t = 60 \\times 15 = 900\\text{ J}","isFinal":False},
    {"text":"Work against gravity = mgh","latex":"h = \\frac{W}{mg} = \\frac{900}{10 \\times 9.8} = \\frac{900}{98} \\approx 9.18\\text{ m}","isFinal":True}
  ]},
  {"title":"KE Ratio for Different Speeds","steps":[
    {"text":"A car doubles its speed from 20 m/s to 40 m/s. How does its kinetic energy change?","latex":"","isFinal":False},
    {"text":"KE is proportional to v²","latex":"\\frac{KE_2}{KE_1} = \\frac{v_2^2}{v_1^2} = \\frac{40^2}{20^2} = \\frac{1600}{400} = 4","isFinal":False},
    {"text":"Kinetic energy quadruples when speed doubles. Braking distance also quadruples.","latex":"","isFinal":True}
  ]}
],

"potential-energy": [
  {"title":"Gravitational PE at Height","steps":[
    {"text":"Find the gravitational PE gained when a 5 kg ball is lifted 10 m (g = 9.8 m/s²).","latex":"","isFinal":False},
    {"text":"Apply PE = mgh","latex":"PE = 5 \\times 9.8 \\times 10 = 490\\text{ J}","isFinal":True}
  ]},
  {"title":"Converting PE to KE","steps":[
    {"text":"A 2 kg ball drops from rest at height 8 m. Find its speed just before hitting the ground.","latex":"","isFinal":False},
    {"text":"All PE converts to KE (no air resistance)","latex":"mgh = \\frac{1}{2}mv^2","isFinal":False},
    {"text":"Cancel m and solve for v","latex":"v = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times 8} = \\sqrt{156.8} \\approx 12.5\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Spring Potential Energy","steps":[
    {"text":"A spring with k = 400 N/m is compressed 0.15 m. Find the stored elastic PE.","latex":"","isFinal":False},
    {"text":"Elastic PE formula","latex":"PE_{spring} = \\frac{1}{2}kx^2 = \\frac{1}{2} \\times 400 \\times (0.15)^2 = 200 \\times 0.0225 = 4.5\\text{ J}","isFinal":True}
  ]},
  {"title":"Height from PE","steps":[
    {"text":"A 3 kg object gains 120 J of gravitational PE. How high was it lifted?","latex":"","isFinal":False},
    {"text":"Rearrange PE = mgh for h","latex":"h = \\frac{PE}{mg} = \\frac{120}{3 \\times 9.8} = \\frac{120}{29.4} \\approx 4.08\\text{ m}","isFinal":True}
  ]},
  {"title":"Conservation of Energy on a Ramp","steps":[
    {"text":"A 4 kg block slides down a frictionless ramp of height 6 m. Find its speed at the bottom.","latex":"","isFinal":False},
    {"text":"Conservation of energy: loss in PE = gain in KE","latex":"mgh = \\frac{1}{2}mv^2","isFinal":False},
    {"text":"Solve for v","latex":"v = \\sqrt{2 \\times 9.8 \\times 6} = \\sqrt{117.6} \\approx 10.8\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Roller Coaster Maximum Height","steps":[
    {"text":"A roller coaster starts at 30 m height with v = 0. What is the maximum height it can reach again (ignore friction)?","latex":"","isFinal":False},
    {"text":"By conservation of energy, maximum height reached = starting height","latex":"h_{max} = \\frac{v_{initial}^2}{2g} + h_{initial} = 0 + 30 = 30\\text{ m}","isFinal":True}
  ]},
  {"title":"Work Done Against Gravity","steps":[
    {"text":"How much work must be done to raise a 200 kg block to a height of 5 m?","latex":"","isFinal":False},
    {"text":"Work done against gravity = gain in gravitational PE","latex":"W = mgh = 200 \\times 9.8 \\times 5 = 9800\\text{ J}","isFinal":True}
  ]},
  {"title":"Spring Launcher","steps":[
    {"text":"A spring (k = 500 N/m) compressed 0.1 m launches a 0.05 kg ball vertically. Find maximum height.","latex":"","isFinal":False},
    {"text":"Spring PE converts entirely to gravitational PE at max height","latex":"\\frac{1}{2}kx^2 = mgh","isFinal":False},
    {"text":"Solve for h","latex":"h = \\frac{kx^2}{2mg} = \\frac{500 \\times 0.01}{2 \\times 0.05 \\times 9.8} = \\frac{5}{0.98} \\approx 5.1\\text{ m}","isFinal":True}
  ]},
  {"title":"Pendulum PE and KE","steps":[
    {"text":"A 0.5 kg pendulum bob swings from rest at 0.4 m above lowest point. Find speed at the bottom.","latex":"","isFinal":False},
    {"text":"All PE converts to KE at lowest point","latex":"v = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times 0.4} = \\sqrt{7.84} \\approx 2.8\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Energy with Friction Loss","steps":[
    {"text":"A 3 kg block slides down a 5 m ramp (h = 3 m) but arrives at the bottom with only 40 J of KE. Find energy lost to friction.","latex":"","isFinal":False},
    {"text":"Initial PE","latex":"PE = mgh = 3 \\times 9.8 \\times 3 = 88.2\\text{ J}","isFinal":False},
    {"text":"Energy lost = PE − KE gained","latex":"W_{friction} = 88.2 - 40 = 48.2\\text{ J}","isFinal":True}
  ]}
]

}

for slug, exs in examples.items():
    if slug in data:
        data[slug]['workedExamples'] = exs
        print(f"{slug}: {len(exs)} examples")
    else:
        print(f"WARNING: slug '{slug}' not found in data")

p.write_text(json.dumps(data, indent=2, ensure_ascii=False))
print("Done. Validating...")
json.loads(p.read_text())
print("JSON valid.")
