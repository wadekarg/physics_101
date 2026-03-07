#!/usr/bin/env python3
"""Batch 3: power-efficiency, momentum-impulse, conservation-momentum,
2d-collisions, torque, angular-momentum, gyroscopes, universal-gravitation"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"power-efficiency": [
  {"title":"Calculating Power from Work and Time","steps":[
    {"text":"An engine does 12 000 J of work in 40 s. Find its power output.","latex":"","isFinal":False},
    {"text":"Power = Work / Time","latex":"P = \\frac{W}{t} = \\frac{12000}{40} = 300\\text{ W}","isFinal":True}
  ]},
  {"title":"Power from Force and Velocity","steps":[
    {"text":"A car engine exerts 4000 N while travelling at 25 m/s. Find the power output.","latex":"","isFinal":False},
    {"text":"P = Fv","latex":"P = 4000 \\times 25 = 100\\,000\\text{ W} = 100\\text{ kW}","isFinal":True}
  ]},
  {"title":"Efficiency of a Machine","steps":[
    {"text":"A motor takes in 500 W and delivers 350 W of useful output. Find its efficiency.","latex":"","isFinal":False},
    {"text":"Efficiency formula","latex":"\\eta = \\frac{P_{out}}{P_{in}} \\times 100 = \\frac{350}{500} \\times 100 = 70\\%","isFinal":True}
  ]},
  {"title":"Useful Output Power","steps":[
    {"text":"A 60% efficient pump uses 800 W of electrical power. What is its useful mechanical output?","latex":"","isFinal":False},
    {"text":"P_out = η × P_in","latex":"P_{out} = 0.60 \\times 800 = 480\\text{ W}","isFinal":True}
  ]},
  {"title":"Energy Wasted as Heat","steps":[
    {"text":"A 200 W heater is 80% efficient (useful heat output). How much energy is wasted per second?","latex":"","isFinal":False},
    {"text":"Useful output","latex":"P_{useful} = 0.80 \\times 200 = 160\\text{ W}","isFinal":False},
    {"text":"Wasted power","latex":"P_{waste} = 200 - 160 = 40\\text{ W}","isFinal":True}
  ]},
  {"title":"Horse Power Conversion","steps":[
    {"text":"A 150 hp car engine — convert to watts and find force at 30 m/s. (1 hp = 746 W)","latex":"","isFinal":False},
    {"text":"Power in watts","latex":"P = 150 \\times 746 = 111\\,900\\text{ W}","isFinal":False},
    {"text":"Force = P/v","latex":"F = \\frac{111900}{30} = 3730\\text{ N}","isFinal":True}
  ]},
  {"title":"Time to Climb Stairs","steps":[
    {"text":"A 60 kg student climbs 4 m of stairs in 5 s. Find the power developed.","latex":"","isFinal":False},
    {"text":"Work against gravity","latex":"W = mgh = 60 \\times 9.8 \\times 4 = 2352\\text{ J}","isFinal":False},
    {"text":"Power","latex":"P = \\frac{2352}{5} = 470.4\\text{ W}","isFinal":True}
  ]},
  {"title":"Cascaded Efficiency","steps":[
    {"text":"A generator (90% efficient) drives a pump (75% efficient). Overall efficiency?","latex":"","isFinal":False},
    {"text":"Overall efficiency = product of individual efficiencies","latex":"\\eta_{total} = 0.90 \\times 0.75 = 0.675 = 67.5\\%","isFinal":True}
  ]},
  {"title":"Electrical Power Bill","steps":[
    {"text":"A 2 kW heater runs 3 hours per day for 30 days. Find energy used in kWh.","latex":"","isFinal":False},
    {"text":"Energy = Power × time","latex":"E = 2\\text{ kW} \\times (3 \\times 30)\\text{ h} = 2 \\times 90 = 180\\text{ kWh}","isFinal":True}
  ]},
  {"title":"Comparing Motor Efficiencies","steps":[
    {"text":"Motor A: 1000 W in, 700 W out. Motor B: 800 W in, 600 W out. Which is more efficient?","latex":"","isFinal":False},
    {"text":"Efficiency A","latex":"\\eta_A = \\frac{700}{1000} = 70\\%","isFinal":False},
    {"text":"Efficiency B","latex":"\\eta_B = \\frac{600}{800} = 75\\%","isFinal":False},
    {"text":"Motor B is more efficient (75% vs 70%).","latex":"","isFinal":True}
  ]}
],

"momentum-impulse": [
  {"title":"Calculating Momentum","steps":[
    {"text":"A 4 kg ball moves at 6 m/s. Find its momentum.","latex":"","isFinal":False},
    {"text":"p = mv","latex":"p = 4 \\times 6 = 24\\text{ kg·m/s}","isFinal":True}
  ]},
  {"title":"Impulse from Force and Time","steps":[
    {"text":"A 200 N force acts on an object for 0.3 s. Find the impulse.","latex":"","isFinal":False},
    {"text":"Impulse J = FΔt","latex":"J = 200 \\times 0.3 = 60\\text{ N·s}","isFinal":True}
  ]},
  {"title":"Change in Momentum from Impulse","steps":[
    {"text":"A 3 kg ball receives an impulse of 15 N·s. Find the change in velocity.","latex":"","isFinal":False},
    {"text":"Impulse = change in momentum = mΔv","latex":"\\Delta v = \\frac{J}{m} = \\frac{15}{3} = 5\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Force from Impulse–Momentum","steps":[
    {"text":"A 0.5 kg ball goes from 0 to 20 m/s in 0.05 s. Find the average force.","latex":"","isFinal":False},
    {"text":"Impulse = Δp","latex":"F \\times \\Delta t = m \\Delta v","isFinal":False},
    {"text":"Solve for F","latex":"F = \\frac{m\\Delta v}{\\Delta t} = \\frac{0.5 \\times 20}{0.05} = 200\\text{ N}","isFinal":True}
  ]},
  {"title":"Airbag Safety — Extending Impact Time","steps":[
    {"text":"A 70 kg passenger decelerates from 15 m/s to 0. Without airbag: 0.01 s. With airbag: 0.15 s. Compare forces.","latex":"","isFinal":False},
    {"text":"Impulse (same in both cases)","latex":"\\Delta p = 70 \\times 15 = 1050\\text{ N·s}","isFinal":False},
    {"text":"Without airbag","latex":"F_{no} = \\frac{1050}{0.01} = 105\\,000\\text{ N}","isFinal":False},
    {"text":"With airbag","latex":"F_{bag} = \\frac{1050}{0.15} = 7000\\text{ N (15× safer)}","isFinal":True}
  ]},
  {"title":"Tennis Ball Bounce","steps":[
    {"text":"A 0.06 kg tennis ball hits a wall at 20 m/s and bounces at 18 m/s. Contact time = 0.004 s. Find average force.","latex":"","isFinal":False},
    {"text":"Taking approach as positive, Δp = m(v_f − v_i)","latex":"\\Delta p = 0.06 \\times (-18 - 20) = 0.06 \\times (-38) = -2.28\\text{ N·s}","isFinal":False},
    {"text":"Average force magnitude","latex":"F = \\frac{|\\Delta p|}{\\Delta t} = \\frac{2.28}{0.004} = 570\\text{ N}","isFinal":True}
  ]},
  {"title":"Impulse Equals Area Under F–t Graph","steps":[
    {"text":"A force increases linearly from 0 to 100 N over 2 s, then drops to 0. Find the total impulse.","latex":"","isFinal":False},
    {"text":"Area under the triangular F–t graph","latex":"J = \\frac{1}{2} \\times base \\times height = \\frac{1}{2} \\times 2 \\times 100 = 100\\text{ N·s}","isFinal":True}
  ]},
  {"title":"Finding Initial Velocity","steps":[
    {"text":"A 2 kg object receives an impulse of −12 N·s and has final velocity 3 m/s. Find initial velocity.","latex":"","isFinal":False},
    {"text":"J = Δp = m(v_f − v_i)","latex":"-12 = 2(3 - v_i) \\Rightarrow 3 - v_i = -6 \\Rightarrow v_i = 9\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Momentum Units Equivalence","steps":[
    {"text":"Show that 1 N·s = 1 kg·m/s.","latex":"","isFinal":False},
    {"text":"Expand the Newton unit","latex":"1\\text{ N} = 1\\text{ kg·m/s}^2","isFinal":False},
    {"text":"Multiply by s","latex":"1\\text{ N·s} = 1\\text{ kg·m/s}^2 \\times \\text{s} = 1\\text{ kg·m/s} \\checkmark","isFinal":True}
  ]},
  {"title":"Momentum of System of Two Objects","steps":[
    {"text":"Object A: 3 kg at +5 m/s. Object B: 2 kg at −4 m/s. Find total momentum.","latex":"","isFinal":False},
    {"text":"Total momentum = sum of individual momenta","latex":"p_{total} = (3)(5) + (2)(-4) = 15 - 8 = 7\\text{ kg·m/s}","isFinal":True}
  ]}
],

"conservation-momentum": [
  {"title":"1D Perfectly Inelastic Collision","steps":[
    {"text":"4 kg cart at 6 m/s hits and sticks to a 2 kg cart at rest. Find their common velocity.","latex":"","isFinal":False},
    {"text":"Conservation of momentum: p_before = p_after","latex":"m_1 v_1 = (m_1 + m_2) v_f","isFinal":False},
    {"text":"Solve for v_f","latex":"v_f = \\frac{4 \\times 6}{4 + 2} = \\frac{24}{6} = 4\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Elastic Collision — Finding Final Velocities","steps":[
    {"text":"Equal masses: m = 2 kg. Ball 1 at 5 m/s hits stationary Ball 2 (elastic). Find final velocities.","latex":"","isFinal":False},
    {"text":"For equal-mass elastic collision: Ball 1 stops, Ball 2 takes full velocity","latex":"v_1' = 0\\text{ m/s}, \\quad v_2' = 5\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Two-Object Collision, Both Moving","steps":[
    {"text":"Car A (1000 kg, 10 m/s east) collides with Car B (1500 kg, 4 m/s west). They stick together. Find v.","latex":"","isFinal":False},
    {"text":"Taking east as positive","latex":"p_{total} = 1000(10) + 1500(-4) = 10000 - 6000 = 4000\\text{ kg·m/s}","isFinal":False},
    {"text":"After collision (total mass = 2500 kg)","latex":"v_f = \\frac{4000}{2500} = 1.6\\text{ m/s east}","isFinal":True}
  ]},
  {"title":"Recoil of Cannon","steps":[
    {"text":"A 400 kg cannon fires an 8 kg shell at 300 m/s. Find the recoil velocity.","latex":"","isFinal":False},
    {"text":"Initial momentum = 0 (both at rest)","latex":"0 = m_{shell} v_{shell} + m_{cannon} v_{cannon}","isFinal":False},
    {"text":"Solve for cannon velocity","latex":"v_{cannon} = -\\frac{8 \\times 300}{400} = -6\\text{ m/s}","isFinal":True}
  ]},
  {"title":"KE Conserved in Elastic Collision?","steps":[
    {"text":"Verify KE is conserved for: 2 kg at 6 m/s (elastic) → 0 m/s; 2 kg at 0 m/s → 6 m/s.","latex":"","isFinal":False},
    {"text":"KE before","latex":"KE_i = \\frac{1}{2}(2)(6^2) = 36\\text{ J}","isFinal":False},
    {"text":"KE after","latex":"KE_f = \\frac{1}{2}(2)(6^2) = 36\\text{ J} \\checkmark","isFinal":True}
  ]},
  {"title":"KE Lost in Inelastic Collision","steps":[
    {"text":"3 kg at 8 m/s hits 1 kg at rest, they stick. Find KE lost.","latex":"","isFinal":False},
    {"text":"Final velocity","latex":"v_f = \\frac{3 \\times 8}{4} = 6\\text{ m/s}","isFinal":False},
    {"text":"KE before = 96 J, KE after = ½(4)(36) = 72 J","latex":"\\Delta KE = 96 - 72 = 24\\text{ J lost as heat/deformation}","isFinal":True}
  ]},
  {"title":"Explosion — Two Fragments","steps":[
    {"text":"A 5 kg object at rest explodes into a 3 kg piece at 10 m/s east and a 2 kg piece. Find the 2 kg piece's velocity.","latex":"","isFinal":False},
    {"text":"Momentum conservation: initial = 0","latex":"0 = 3(10) + 2 v_2","isFinal":False},
    {"text":"Solve for v_2","latex":"v_2 = \\frac{-30}{2} = -15\\text{ m/s (west)}","isFinal":True}
  ]},
  {"title":"Bullet–Block System","steps":[
    {"text":"A 0.01 kg bullet at 400 m/s embeds in a 1.99 kg block at rest on a frictionless surface. Find block speed.","latex":"","isFinal":False},
    {"text":"Conservation of momentum","latex":"(0.01)(400) = (0.01 + 1.99) v_f","isFinal":False},
    {"text":"Solve","latex":"v_f = \\frac{4}{2} = 2\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Rocket Propulsion as Momentum Conservation","steps":[
    {"text":"A 1000 kg rocket (including 200 kg fuel) ejects all fuel at 600 m/s. Find final rocket speed (initially at rest).","latex":"","isFinal":False},
    {"text":"Initial momentum = 0","latex":"0 = m_{fuel}(-v_{exhaust}) + m_{rocket} v_{rocket}","isFinal":False},
    {"text":"Solve (simplified, single burst)","latex":"v_{rocket} = \\frac{200 \\times 600}{800} = 150\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Coefficient of Restitution","steps":[
    {"text":"A ball dropped from 2 m bounces to 1.28 m. Find the coefficient of restitution e.","latex":"","isFinal":False},
    {"text":"e = ratio of separation speed to approach speed = √(h_bounce/h_drop)","latex":"e = \\sqrt{\\frac{1.28}{2}} = \\sqrt{0.64} = 0.8","isFinal":True}
  ]}
],

"2d-collisions": [
  {"title":"2D Collision — Decomposing Momentum","steps":[
    {"text":"2 kg object moving at 5 m/s east collides with 2 kg at rest. After collision, first moves at 3 m/s north-east (45°). Find second object's velocity.","latex":"","isFinal":False},
    {"text":"x-momentum before = 10 kg·m/s. x-momentum of 1st after = 3cos45° × 2 ≈ 4.24 kg·m/s","latex":"p_{2x} = 10 - 4.24 = 5.76\\text{ kg·m/s}","isFinal":False},
    {"text":"y-momentum: 0 before = 3sin45°×2 + p_{2y} → p_{2y} = −4.24 kg·m/s","latex":"v_{2} = \\frac{\\sqrt{5.76^2+4.24^2}}{2} = \\frac{\\sqrt{33.18+17.98}}{2} \\approx \\frac{7.15}{2} \\approx 3.58\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Perfectly Inelastic 2D Collision","steps":[
    {"text":"3 kg at 4 m/s east; 2 kg at 3 m/s north. They stick. Find magnitude and direction of combined velocity.","latex":"","isFinal":False},
    {"text":"x-momentum: 3 × 4 = 12 kg·m/s; y-momentum: 2 × 3 = 6 kg·m/s","latex":"","isFinal":False},
    {"text":"Final velocity components (total mass 5 kg)","latex":"v_x = \\frac{12}{5} = 2.4\\text{ m/s}, \\quad v_y = \\frac{6}{5} = 1.2\\text{ m/s}","isFinal":False},
    {"text":"Magnitude and angle","latex":"v = \\sqrt{2.4^2+1.2^2} \\approx 2.68\\text{ m/s}, \\quad \\theta = \\arctan\\!\\left(\\frac{1.2}{2.4}\\right) = 26.6°\\text{ N of E}","isFinal":True}
  ]},
  {"title":"Billiard Ball Glancing Collision","steps":[
    {"text":"Ball A (0.16 kg) at 3 m/s east hits stationary Ball B. A deflects at 30° north of east at 2 m/s. Find B's velocity.","latex":"","isFinal":False},
    {"text":"x: 0.16(3) = 0.16(2cos30°) + 0.16 v_{Bx}","latex":"v_{Bx} = 3 - 2(0.866) = 3 - 1.73 = 1.27\\text{ m/s}","isFinal":False},
    {"text":"y: 0 = 0.16(2sin30°) + 0.16 v_{By}","latex":"v_{By} = -2(0.5) = -1\\text{ m/s (south)}","isFinal":False},
    {"text":"Speed of B","latex":"v_B = \\sqrt{1.27^2 + 1^2} \\approx 1.62\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Checking if Elastic (2D)","steps":[
    {"text":"Before: 1 kg at (3,0) m/s and 1 kg at (0,0). After: (0, 2) and (3,−2) m/s. Is KE conserved?","latex":"","isFinal":False},
    {"text":"KE before","latex":"KE_i = \\frac{1}{2}(1)(3^2) = 4.5\\text{ J}","isFinal":False},
    {"text":"KE after = ½(1)(4) + ½(1)(9+4) = 2 + 6.5 = 8.5 J ≠ 4.5 J → not elastic","latex":"KE_f = 8.5\\text{ J} \\neq 4.5\\text{ J}\\quad\\text{(not elastic)}","isFinal":True}
  ]},
  {"title":"Oblique Elastic Collision","steps":[
    {"text":"In an elastic collision between equal masses, one initially at rest, show the angle between final velocities is 90°.","latex":"","isFinal":False},
    {"text":"Momentum conservation and energy conservation together constrain angles.","latex":"","isFinal":False},
    {"text":"Proof: |p₁'|² + |p₂'|² = |p₁|² (from KE conservation), so the vectors form a right triangle → angle between v₁' and v₂' is 90°.","latex":"\\vec{v}_1'^{\\,2} + \\vec{v}_2'^{\\,2} = \\vec{v}_1^{\\,2} \\Rightarrow \\theta_{12} = 90°","isFinal":True}
  ]},
  {"title":"Centre-of-Mass Frame","steps":[
    {"text":"Two equal masses (2 kg) move at +4 m/s and −2 m/s. Find the velocity of the centre of mass.","latex":"","isFinal":False},
    {"text":"v_cm = total momentum / total mass","latex":"v_{cm} = \\frac{2(4)+2(-2)}{4} = \\frac{4}{4} = 1\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Impulse Direction in 2D","steps":[
    {"text":"A 0.5 kg puck deflects: before v = (4, 0) m/s, after v = (2, 3) m/s. Find impulse vector and magnitude.","latex":"","isFinal":False},
    {"text":"Impulse = m × Δv","latex":"\\vec{J} = 0.5(2-4, 3-0) = 0.5(-2, 3) = (-1, 1.5)\\text{ N·s}","isFinal":False},
    {"text":"Magnitude","latex":"|J| = \\sqrt{1+2.25} = \\sqrt{3.25} \\approx 1.80\\text{ N·s}","isFinal":True}
  ]},
  {"title":"Explosion in 2D (Three Fragments)","steps":[
    {"text":"5 kg object at rest explodes into 3 pieces: A (2 kg, +x 5 m/s), B (1 kg, +y 8 m/s), C (2 kg, ?). Find C's velocity.","latex":"","isFinal":False},
    {"text":"x-momentum: 0 = 2(5) + 1(0) + 2 v_{Cx} → v_{Cx} = −5 m/s","latex":"v_{Cx} = -5\\text{ m/s}","isFinal":False},
    {"text":"y-momentum: 0 = 2(0) + 1(8) + 2 v_{Cy} → v_{Cy} = −4 m/s","latex":"v_{Cy} = -4\\text{ m/s}, \\quad |v_C| = \\sqrt{25+16} \\approx 6.4\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Traffic Accident Reconstruction","steps":[
    {"text":"Car A (1200 kg, north 15 m/s) and Car B (1000 kg, east 20 m/s) collide and stick. Find direction and speed.","latex":"","isFinal":False},
    {"text":"North momentum: 1200 × 15 = 18 000 kg·m/s","latex":"","isFinal":False},
    {"text":"East momentum: 1000 × 20 = 20 000 kg·m/s","latex":"","isFinal":False},
    {"text":"Final speed (total mass 2200 kg) and angle","latex":"v = \\frac{\\sqrt{18000^2+20000^2}}{2200} \\approx \\frac{26907}{2200} \\approx 12.2\\text{ m/s at }\\arctan(20000/18000) \\approx 48°\\text{ E of N}","isFinal":True}
  ]},
  {"title":"Satellite Collision in Orbit","steps":[
    {"text":"1000 kg satellite (east 7000 m/s) collides with 500 kg debris (west 500 m/s). They stick. Find velocity.","latex":"","isFinal":False},
    {"text":"East positive; initial momentum","latex":"p = 1000(7000) + 500(-500) = 7000000 - 250000 = 6750000\\text{ kg·m/s}","isFinal":False},
    {"text":"Final velocity","latex":"v_f = \\frac{6750000}{1500} = 4500\\text{ m/s east}","isFinal":True}
  ]}
],

"torque": [
  {"title":"Torque from Perpendicular Force","steps":[
    {"text":"A 30 N force is applied perpendicular to a wrench 0.4 m from the pivot. Find the torque.","latex":"","isFinal":False},
    {"text":"τ = r × F (force perpendicular to lever arm)","latex":"\\tau = 0.4 \\times 30 = 12\\text{ N·m}","isFinal":True}
  ]},
  {"title":"Torque at an Angle","steps":[
    {"text":"A 50 N force is applied at 40° to a 0.6 m lever arm. Find the torque.","latex":"","isFinal":False},
    {"text":"Torque = r F sinθ (θ is angle between r and F)","latex":"\\tau = 0.6 \\times 50 \\times \\sin 40° = 30 \\times 0.643 = 19.3\\text{ N·m}","isFinal":True}
  ]},
  {"title":"Rotational Equilibrium","steps":[
    {"text":"A seesaw (4 m long, pivot at centre). 30 kg child sits 1.8 m from pivot. Where must 20 kg child sit?","latex":"","isFinal":False},
    {"text":"Torque balance: τ₁ = τ₂","latex":"m_1 g d_1 = m_2 g d_2","isFinal":False},
    {"text":"Solve for d₂","latex":"d_2 = \\frac{m_1 d_1}{m_2} = \\frac{30 \\times 1.8}{20} = 2.7\\text{ m from pivot}","isFinal":True}
  ]},
  {"title":"Net Torque on a Rod","steps":[
    {"text":"A 1 m rod has 20 N upward at 0.3 m from left end, and 15 N downward at 0.8 m. Find net torque about left end.","latex":"","isFinal":False},
    {"text":"Clockwise torques positive, CCW negative (convention)","latex":"\\tau_1 = +20 \\times 0.3 = +6\\text{ N·m (CCW)}","isFinal":False},
    {"text":"","latex":"\\tau_2 = -15 \\times 0.8 = -12\\text{ N·m (CW)}","isFinal":False},
    {"text":"Net torque","latex":"\\tau_{net} = 6 - 12 = -6\\text{ N·m (clockwise)}","isFinal":True}
  ]},
  {"title":"Opening a Door","steps":[
    {"text":"A 25 N force opens a door 0.9 m wide, applied at the edge perpendicular to door. Find torque about hinges.","latex":"","isFinal":False},
    {"text":"","latex":"\\tau = F \\times r = 25 \\times 0.9 = 22.5\\text{ N·m}","isFinal":True}
  ]},
  {"title":"Torque and Angular Acceleration","steps":[
    {"text":"A 2 kg·m² flywheel is acted on by 8 N·m net torque. Find angular acceleration.","latex":"","isFinal":False},
    {"text":"Rotational Newton's Second Law: τ = Iα","latex":"\\alpha = \\frac{\\tau}{I} = \\frac{8}{2} = 4\\text{ rad/s}^2","isFinal":True}
  ]},
  {"title":"Moment of Inertia — Thin Rod","steps":[
    {"text":"Find the moment of inertia of a 2 kg, 1.2 m uniform rod about its centre.","latex":"","isFinal":False},
    {"text":"I = (1/12)mL² for rotation about centre","latex":"I = \\frac{1}{12} \\times 2 \\times (1.2)^2 = \\frac{1}{12} \\times 2.88 = 0.24\\text{ kg·m}^2","isFinal":True}
  ]},
  {"title":"Torque from Weight — Centre of Mass","steps":[
    {"text":"A 3 kg uniform horizontal beam (2 m long) is supported at left end. Find torque due to its weight about the support.","latex":"","isFinal":False},
    {"text":"Weight acts at the centre of mass (midpoint, 1 m from support)","latex":"\\tau = mg \\times \\frac{L}{2} = 3 \\times 9.8 \\times 1 = 29.4\\text{ N·m}","isFinal":True}
  ]},
  {"title":"Ladder in Equilibrium","steps":[
    {"text":"A 5 m, 20 kg ladder leans against a smooth wall at 60° from horizontal. Find the normal force from the wall (using torques about foot of ladder).","latex":"","isFinal":False},
    {"text":"Torque by weight about foot (acts at midpoint)","latex":"\\tau_W = 20 \\times 9.8 \\times \\frac{5}{2} \\cos 60° = 196 \\times 1.25 = 245\\text{ N·m (CW)}","isFinal":False},
    {"text":"Torque by wall force N about foot","latex":"\\tau_N = N \\times 5\\sin 60° \\Rightarrow N = \\frac{245}{5 \\times 0.866} \\approx 56.6\\text{ N}","isFinal":True}
  ]},
  {"title":"Work Done by a Torque","steps":[
    {"text":"A torque of 12 N·m rotates an object through 4 radians. Find the work done.","latex":"","isFinal":False},
    {"text":"Work = τ × θ (rotational analogue of W = Fd)","latex":"W = 12 \\times 4 = 48\\text{ J}","isFinal":True}
  ]}
],

"angular-momentum": [
  {"title":"Calculating Angular Momentum","steps":[
    {"text":"A 3 kg particle moves in a circle of radius 2 m at 5 m/s. Find its angular momentum.","latex":"","isFinal":False},
    {"text":"L = mvr (for circular motion)","latex":"L = 3 \\times 5 \\times 2 = 30\\text{ kg·m}^2/\\text{s}","isFinal":True}
  ]},
  {"title":"Conservation — Skater Spinning","steps":[
    {"text":"A spinning skater (I = 4 kg·m², ω = 2 rad/s) pulls arms in (I = 1 kg·m²). Find new ω.","latex":"","isFinal":False},
    {"text":"Conservation of angular momentum: I₁ω₁ = I₂ω₂","latex":"4 \\times 2 = 1 \\times \\omega_2","isFinal":False},
    {"text":"Solve","latex":"\\omega_2 = 8\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Angular Momentum of Rotation","steps":[
    {"text":"A solid disc (I = 0.5 kg·m²) spins at 10 rad/s. Find its angular momentum.","latex":"","isFinal":False},
    {"text":"L = Iω","latex":"L = 0.5 \\times 10 = 5\\text{ kg·m}^2/\\text{s}","isFinal":True}
  ]},
  {"title":"Torque and Change in Angular Momentum","steps":[
    {"text":"A 2 N·m torque acts on a body for 3 s. Find the change in angular momentum.","latex":"","isFinal":False},
    {"text":"τ = ΔL/Δt → ΔL = τΔt (angular impulse)","latex":"\\Delta L = 2 \\times 3 = 6\\text{ kg·m}^2/\\text{s}","isFinal":True}
  ]},
  {"title":"Planet Sweeping Equal Areas","steps":[
    {"text":"A planet at 1.0 AU moves at 30 km/s. At 1.5 AU (aphelion), apply conservation of angular momentum to find speed.","latex":"","isFinal":False},
    {"text":"L₁ = L₂: m r₁ v₁ = m r₂ v₂","latex":"1.0 \\times 30 = 1.5 \\times v_2","isFinal":False},
    {"text":"Solve","latex":"v_2 = \\frac{30}{1.5} = 20\\text{ km/s}","isFinal":True}
  ]},
  {"title":"Diver Tucking In","steps":[
    {"text":"A diver's moment of inertia decreases from 8 to 2 kg·m² while spinning at 1 rev/s. Find new rotation rate.","latex":"","isFinal":False},
    {"text":"L conserved: I₁ω₁ = I₂ω₂","latex":"8 \\times (2\\pi) = 2 \\times \\omega_2","isFinal":False},
    {"text":"","latex":"\\omega_2 = 4 \\times 2\\pi = 8\\pi\\text{ rad/s} = 4\\text{ rev/s}","isFinal":True}
  ]},
  {"title":"Point Mass on Rotating Platform","steps":[
    {"text":"A 60 kg person stands at edge of a 2 m radius platform (I_platform = 500 kg·m²) rotating at 0.5 rad/s. Person moves to centre. Find new ω.","latex":"","isFinal":False},
    {"text":"Initial L: I_total × ω = (500 + 60×4) × 0.5 = (500+240) × 0.5 = 370 kg·m²/s","latex":"L_i = 370\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"Final I (person at centre): 500 kg·m²","latex":"\\omega_f = \\frac{370}{500} = 0.74\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Angular Momentum Compared to Linear","steps":[
    {"text":"Show the analogy: linear p = mv; angular L = Iω. How are they related for a point mass?","latex":"","isFinal":False},
    {"text":"For circular motion, I = mr², ω = v/r","latex":"L = Iω = mr^2 \\cdot \\frac{v}{r} = mvr","isFinal":False},
    {"text":"So L = r × p (the cross product magnitude), confirming the direct link between linear and angular momentum.","latex":"","isFinal":True}
  ]},
  {"title":"Gyroscopic Precession Rate","steps":[
    {"text":"A gyroscope has L = 10 kg·m²/s. A 2 N·m torque acts perpendicular to L. Find precession rate.","latex":"","isFinal":False},
    {"text":"Precession rate Ω = τ/L","latex":"\\Omega = \\frac{\\tau}{L} = \\frac{2}{10} = 0.2\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Two Discs Coupling","steps":[
    {"text":"Disc A (I = 2 kg·m², ω = 6 rad/s) is dropped onto stationary Disc B (I = 4 kg·m²). They reach common ω.","latex":"","isFinal":False},
    {"text":"Conservation of angular momentum","latex":"I_A \\omega_A = (I_A + I_B)\\omega_f","isFinal":False},
    {"text":"Solve","latex":"\\omega_f = \\frac{2 \\times 6}{2 + 4} = \\frac{12}{6} = 2\\text{ rad/s}","isFinal":True}
  ]}
],

"gyroscopes": [
  {"title":"Why a Gyroscope Stays Upright","steps":[
    {"text":"Explain qualitatively why a spinning top resists falling over.","latex":"","isFinal":False},
    {"text":"The spinning top has angular momentum L along its axis. Gravity exerts a torque τ perpendicular to L.","latex":"","isFinal":False},
    {"text":"dL/dt = τ, so L rotates (precesses) instead of falling — the axis sweeps out a cone, not tips over.","latex":"\\frac{d\\vec{L}}{dt} = \\vec{\\tau} \\Rightarrow \\text{precession, not falling}","isFinal":True}
  ]},
  {"title":"Precession Angular Velocity","steps":[
    {"text":"A 0.5 kg gyroscope wheel has radius 0.1 m, spinning at 100 rad/s (I = 0.0025 kg·m²). Pivot is 0.05 m from CM. Find precession rate.","latex":"","isFinal":False},
    {"text":"Angular momentum L = Iω","latex":"L = 0.0025 \\times 100 = 0.25\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"Torque from gravity = mgr","latex":"\\tau = 0.5 \\times 9.8 \\times 0.05 = 0.245\\text{ N·m}","isFinal":False},
    {"text":"Precession rate","latex":"\\Omega = \\frac{\\tau}{L} = \\frac{0.245}{0.25} = 0.98\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Effect of Spin Speed on Precession","steps":[
    {"text":"If the spin speed of a gyroscope doubles, what happens to precession rate?","latex":"","isFinal":False},
    {"text":"L doubles (L = Iω), torque τ unchanged","latex":"\\Omega = \\frac{\\tau}{L}","isFinal":False},
    {"text":"Precession rate halves — faster spin = slower, more stable precession.","latex":"\\Omega \\propto \\frac{1}{\\omega_{spin}}","isFinal":True}
  ]},
  {"title":"Ship Stabilisation","steps":[
    {"text":"A ship gyroscope (I = 500 kg·m²) spins at 200 rad/s. A rolling torque of 2000 N·m acts. Find precession rate.","latex":"","isFinal":False},
    {"text":"L = Iω = 500 × 200 = 100 000 kg·m²/s","latex":"L = 100\\,000\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"Precession rate","latex":"\\Omega = \\frac{2000}{100000} = 0.02\\text{ rad/s (very slow — stable)}","isFinal":True}
  ]},
  {"title":"Gyrocompass Principle","steps":[
    {"text":"Explain why a gyrocompass aligns with Earth's rotation axis.","latex":"","isFinal":False},
    {"text":"Earth's rotation ωE produces a torque on the gimbal bearing that acts to align the spin axis with Earth's rotation axis.","latex":"","isFinal":False},
    {"text":"When aligned with Earth's axis, there is no torque, so the gyrocompass points true north (geographic, not magnetic).","latex":"","isFinal":True}
  ]},
  {"title":"Nutation Frequency","steps":[
    {"text":"A gyroscope has I_spin = 0.01 kg·m², ω = 500 rad/s, I_transverse = 0.002 kg·m². Find nutation frequency.","latex":"","isFinal":False},
    {"text":"Nutation frequency ωN = L / I_transverse","latex":"L = I_{spin}\\omega = 0.01 \\times 500 = 5\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"","latex":"\\omega_N = \\frac{L}{I_{trans}} = \\frac{5}{0.002} = 2500\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Gyroscope in Zero Gravity","steps":[
    {"text":"A gyroscope spins at 1000 rad/s in free space (no gravity). A 0.5 N·m torque is applied for 0.1 s. Find ΔL.","latex":"","isFinal":False},
    {"text":"ΔL = τ × Δt (angular impulse)","latex":"\\Delta L = 0.5 \\times 0.1 = 0.05\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"The spin axis tilts by angle Δθ = ΔL / L (small angle)","latex":"","isFinal":True}
  ]},
  {"title":"Gyroscope Toy — Reaction Force","steps":[
    {"text":"A toy gyroscope (mass 0.1 kg) balances at the end of a 0.2 m rod with no support at the other end. Explain the upward support force at the pivot.","latex":"","isFinal":False},
    {"text":"The pivot supplies an upward normal force N = mg to prevent the CM from falling.","latex":"N = 0.1 \\times 9.8 = 0.98\\text{ N upward}","isFinal":False},
    {"text":"The spin angular momentum causes precession; the pivot doesn't tip over because of conservation of angular momentum.","latex":"","isFinal":True}
  ]},
  {"title":"Bicycle Wheel Stability","steps":[
    {"text":"A bicycle wheel (I = 0.1 kg·m²) spins at 30 rad/s. A sideways tipping torque of 3 N·m acts. Find precession rate.","latex":"","isFinal":False},
    {"text":"L = Iω = 0.1 × 30 = 3 kg·m²/s","latex":"L = 3\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"Precession rate (bicycle steers into tilt)","latex":"\\Omega = \\frac{3}{3} = 1\\text{ rad/s}","isFinal":True}
  ]},
  {"title":"Spin-Stabilised Satellite","steps":[
    {"text":"A 200 kg satellite (I = 50 kg·m²) spins at 5 rad/s. A disturbance torque of 0.1 N·m persists for 10 s. Find change in spin rate.","latex":"","isFinal":False},
    {"text":"Angular impulse → ΔL = τΔt = 0.1 × 10 = 1 kg·m²/s","latex":"\\Delta L = 1\\text{ kg·m}^2/\\text{s}","isFinal":False},
    {"text":"Change in ω = ΔL / I = 1/50 = 0.02 rad/s — very stable","latex":"\\Delta\\omega = \\frac{1}{50} = 0.02\\text{ rad/s}","isFinal":True}
  ]}
],

"universal-gravitation": [
  {"title":"Gravitational Force Between Two Masses","steps":[
    {"text":"Find the gravitational force between 5 kg and 10 kg masses separated by 2 m. (G = 6.67×10⁻¹¹ N·m²/kg²)","latex":"","isFinal":False},
    {"text":"Apply Newton's Law of Gravitation","latex":"F = \\frac{Gm_1m_2}{r^2} = \\frac{6.67\\times10^{-11} \\times 5 \\times 10}{4}","isFinal":False},
    {"text":"Calculate","latex":"F = \\frac{3.335\\times10^{-9}}{4} = 8.34\\times10^{-10}\\text{ N}","isFinal":True}
  ]},
  {"title":"Gravitational Field Strength on Earth's Surface","steps":[
    {"text":"Derive g at Earth's surface using M_E = 5.97×10²⁴ kg, R_E = 6.37×10⁶ m.","latex":"","isFinal":False},
    {"text":"g = GM/R²","latex":"g = \\frac{6.67\\times10^{-11} \\times 5.97\\times10^{24}}{(6.37\\times10^6)^2}","isFinal":False},
    {"text":"Calculate","latex":"g = \\frac{3.98\\times10^{14}}{4.06\\times10^{13}} \\approx 9.8\\text{ m/s}^2 \\checkmark","isFinal":True}
  ]},
  {"title":"Weight at Altitude","steps":[
    {"text":"Find the gravitational acceleration at altitude h = R_E (i.e., double Earth's radius from centre).","latex":"","isFinal":False},
    {"text":"g varies as 1/r², so at r = 2R_E","latex":"g' = \\frac{g}{(2)^2} = \\frac{9.8}{4} = 2.45\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Orbital Period from Radius","steps":[
    {"text":"Find the orbital period of a satellite at r = 8000 km from Earth's centre (M_E = 5.97×10²⁴ kg).","latex":"","isFinal":False},
    {"text":"Set centripetal force = gravitational force","latex":"\\frac{mv^2}{r} = \\frac{GMm}{r^2} \\Rightarrow v = \\sqrt{\\frac{GM}{r}}","isFinal":False},
    {"text":"Period T = 2πr/v","latex":"T = 2\\pi\\sqrt{\\frac{r^3}{GM}} = 2\\pi\\sqrt{\\frac{(8\\times10^6)^3}{3.98\\times10^{14}}} \\approx 7116\\text{ s} \\approx 118.6\\text{ min}","isFinal":True}
  ]},
  {"title":"Escape Velocity","steps":[
    {"text":"Find escape velocity from Earth's surface (M_E = 5.97×10²⁴ kg, R_E = 6.37×10⁶ m).","latex":"","isFinal":False},
    {"text":"Escape velocity: KE = gravitational PE","latex":"v_{esc} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{\\frac{2 \\times 6.67\\times10^{-11} \\times 5.97\\times10^{24}}{6.37\\times10^6}}","isFinal":False},
    {"text":"Calculate","latex":"v_{esc} = \\sqrt{\\frac{7.96\\times10^{14}}{6.37\\times10^6}} = \\sqrt{1.25\\times10^8} \\approx 11\\,200\\text{ m/s}","isFinal":True}
  ]},
  {"title":"Gravitational PE","steps":[
    {"text":"Find the gravitational PE of a 500 kg satellite at r = 10 000 km from Earth's centre.","latex":"","isFinal":False},
    {"text":"U = −GMm/r","latex":"U = -\\frac{6.67\\times10^{-11} \\times 5.97\\times10^{24} \\times 500}{10^7}","isFinal":False},
    {"text":"Calculate","latex":"U = -\\frac{1.99\\times10^{17}}{10^7} = -1.99\\times10^{10}\\text{ J}","isFinal":True}
  ]},
  {"title":"Comparing Gravity on Different Planets","steps":[
    {"text":"Mars has mass 0.107 M_E and radius 0.532 R_E. Find g on Mars.","latex":"","isFinal":False},
    {"text":"g ∝ M/R²","latex":"g_{Mars} = g_{Earth} \\times \\frac{0.107}{(0.532)^2} = 9.8 \\times \\frac{0.107}{0.283} \\approx 3.71\\text{ m/s}^2","isFinal":True}
  ]},
  {"title":"Double Distance Effect","steps":[
    {"text":"If the distance between two masses doubles, how does the gravitational force change?","latex":"","isFinal":False},
    {"text":"F ∝ 1/r²","latex":"\\frac{F_2}{F_1} = \\frac{r_1^2}{r_2^2} = \\frac{r^2}{(2r)^2} = \\frac{1}{4}","isFinal":False},
    {"text":"Force is reduced to one quarter.","latex":"F_2 = \\frac{F_1}{4}","isFinal":True}
  ]},
  {"title":"Tidal Force Concept","steps":[
    {"text":"Why is the gravitational pull of the Moon on the near side of Earth slightly stronger than on the far side?","latex":"","isFinal":False},
    {"text":"Let d = Earth–Moon distance, R = Earth's radius. Near side distance = d − R, far side = d + R.","latex":"","isFinal":False},
    {"text":"Difference in gravitational acceleration (tidal force per unit mass)","latex":"\\Delta g = \\frac{GM_{moon}}{(d-R)^2} - \\frac{GM_{moon}}{(d+R)^2} \\approx \\frac{2GM_{moon}R}{d^3}","isFinal":True}
  ]},
  {"title":"Kepler's Third Law Verification","steps":[
    {"text":"Earth orbits at 1 AU in 1 year. Mars orbits at 1.52 AU. Find Mars's orbital period.","latex":"","isFinal":False},
    {"text":"Kepler's Third Law: T² ∝ r³","latex":"\\frac{T_{Mars}^2}{T_{Earth}^2} = \\frac{r_{Mars}^3}{r_{Earth}^3}","isFinal":False},
    {"text":"Solve","latex":"T_{Mars} = T_E \\times \\left(\\frac{1.52}{1}\\right)^{3/2} = 1 \\times 1.874 = 1.87\\text{ years}","isFinal":True}
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
