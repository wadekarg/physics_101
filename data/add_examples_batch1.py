"""Add 10 worked examples to the first 8 topics in topic-extras.json"""
import json, os

path = os.path.join(os.path.dirname(__file__), 'topic-extras.json')
with open(path) as f:
    data = json.load(f)

# ── helpers ──────────────────────────────────────────────────────
def steps(*args):
    """Each arg is (text, latex_or_None, isFinal_bool)"""
    out = []
    for i, a in enumerate(args):
        s = {"text": a[0], "latex": a[1] if len(a) > 1 else "", "isFinal": a[2] if len(a) > 2 else False}
        if not s["latex"]: del s["latex"]
        out.append(s)
    return out

# ════════════════════════════════════════════════════════════════
# 1. scientific-method
# ════════════════════════════════════════════════════════════════
data['scientific-method']['workedExamples'] = [
  { "title": "% Uncertainty of a Length",
    "steps": steps(
      ("A ruler measures 24.6 cm ± 0.1 cm. Calculate the percentage uncertainty.",),
      ("Apply the formula.", "\\%u = \\frac{\\Delta x}{x} \\times 100"),
      ("Substitute values.", "\\%u = \\frac{0.1}{24.6} \\times 100 = 0.41\\%", True))},

  { "title": "% Uncertainty of a Time Measurement",
    "steps": steps(
      ("A stopwatch reads 8.4 s ± 0.2 s. Find the percentage uncertainty.",),
      ("Apply the formula.", "\\%u = \\frac{0.2}{8.4} \\times 100"),
      ("Calculate.", "\\%u = 2.38\\%", True))},

  { "title": "Absolute Uncertainty from % Uncertainty",
    "steps": steps(
      ("A mass has a 1.5% uncertainty and reads 340 g. Find the absolute uncertainty.",),
      ("Rearrange the formula.", "\\Delta m = \\frac{\\%u}{100} \\times m = \\frac{1.5}{100} \\times 340"),
      ("Calculate.", "\\Delta m = 5.1\\,\\text{g}", True))},

  { "title": "Combining Uncertainties in Addition",
    "steps": steps(
      ("Length A = 12.0 ± 0.2 cm, Length B = 7.5 ± 0.1 cm. Find A + B with uncertainty.",),
      ("Add the values: A + B = 19.5 cm. For addition, add absolute uncertainties.",
       "\\Delta(A+B) = \\Delta A + \\Delta B = 0.2 + 0.1 = 0.3\\,\\text{cm}"),
      ("State the result.", "A + B = 19.5 \\pm 0.3\\,\\text{cm}", True))},

  { "title": "Combining Uncertainties in Multiplication",
    "steps": steps(
      ("v = d/t where d = 5.0 ± 0.1 m and t = 2.0 ± 0.1 s. Find % uncertainty in v.",),
      ("For division, add percentage uncertainties.",
       "\\%u_v = \\frac{0.1}{5.0} \\times 100 + \\frac{0.1}{2.0} \\times 100 = 2\\% + 5\\% = 7\\%"),
      ("Find absolute uncertainty in v = 2.5 m/s.",
       "\\Delta v = 0.07 \\times 2.5 = 0.175 \\approx 0.2\\,\\text{m/s}", True))},

  { "title": "Percentage Error vs Accepted Value",
    "steps": steps(
      ("Measured g = 9.4 m/s². Accepted g = 9.8 m/s². Find the percentage error.",),
      ("Apply the formula.",
       "\\%\\,\\text{error} = \\frac{|\\text{measured} - \\text{accepted}|}{\\text{accepted}} \\times 100"),
      ("Substitute.", "\\%\\,\\text{error} = \\frac{|9.4 - 9.8|}{9.8} \\times 100 = \\frac{0.4}{9.8} \\times 100 = 4.08\\%", True))},

  { "title": "Mean of Repeated Measurements",
    "steps": steps(
      ("Five readings of a period: 1.42, 1.38, 1.40, 1.44, 1.41 s. Find the mean.",),
      ("Sum all values.", "\\sum T = 1.42 + 1.38 + 1.40 + 1.44 + 1.41 = 7.05\\,\\text{s}"),
      ("Divide by n = 5.", "\\bar{T} = \\frac{7.05}{5} = 1.41\\,\\text{s}", True))},

  { "title": "Uncertainty from Range of Readings",
    "steps": steps(
      ("Five readings: 1.42, 1.38, 1.40, 1.44, 1.41 s. Estimate the uncertainty.",),
      ("Find range = max − min.", "\\text{range} = 1.44 - 1.38 = 0.06\\,\\text{s}"),
      ("Uncertainty = range ÷ 2.", "\\Delta T = 0.06 / 2 = 0.03\\,\\text{s}", True))},

  { "title": "Uncertainty in a Squared Quantity",
    "steps": steps(
      ("Speed v = 12.0 ± 0.5 m/s. Find the % uncertainty in v².",),
      ("For a power n, multiply % uncertainty by n.",
       "\\%u_{v^2} = 2 \\times \\%u_v = 2 \\times \\frac{0.5}{12.0} \\times 100"),
      ("Calculate.", "\\%u_{v^2} = 2 \\times 4.17\\% = 8.33\\%", True))},

  { "title": "Identifying Systematic vs Random Error",
    "steps": steps(
      ("A thermometer always reads 2°C too high. Is this systematic or random?",),
      ("Check if the error is consistent across all readings.",
       "\\text{Every reading is offset by the same } +2°C"),
      ("Consistent offset = systematic error. It cannot be reduced by averaging.",
       "\\text{Systematic: shifts all results in one direction}", True))},
]

# ════════════════════════════════════════════════════════════════
# 2. units-measurement
# ════════════════════════════════════════════════════════════════
data['units-measurement']['workedExamples'] = [
  { "title": "km/h to m/s",
    "steps": steps(
      ("Convert 108 km/h to m/s.",),
      ("1 km = 1000 m, 1 h = 3600 s.", "v = 108 \\times \\frac{1000}{3600}"),
      ("Calculate.", "v = 30\\,\\text{m/s}", True))},

  { "title": "m/s to km/h",
    "steps": steps(
      ("Convert 25 m/s to km/h.",),
      ("Multiply by 3.6.", "v = 25 \\times 3.6"),
      ("Calculate.", "v = 90\\,\\text{km/h}", True))},

  { "title": "cm² to m²",
    "steps": steps(
      ("Convert 450 cm² to m².",),
      ("1 m = 100 cm, so 1 m² = (100)² cm² = 10⁴ cm².", "A = 450\\,\\text{cm}^2 \\div 10^4"),
      ("Calculate.", "A = 0.0450\\,\\text{m}^2 = 4.50 \\times 10^{-2}\\,\\text{m}^2", True))},

  { "title": "g/cm³ to kg/m³",
    "steps": steps(
      ("Convert density 8.9 g/cm³ to kg/m³.",),
      ("1 g = 10⁻³ kg, 1 cm³ = 10⁻⁶ m³.",
       "\\rho = 8.9\\,\\frac{\\text{g}}{\\text{cm}^3} \\times \\frac{10^{-3}\\,\\text{kg}}{10^{-6}\\,\\text{m}^3}"),
      ("Calculate.", "\\rho = 8.9 \\times 10^3 = 8900\\,\\text{kg/m}^3", True))},

  { "title": "Nanometres to Metres",
    "steps": steps(
      ("A wavelength is 589 nm. Express in metres.",),
      ("1 nm = 10⁻⁹ m.", "\\lambda = 589 \\times 10^{-9}\\,\\text{m}"),
      ("Write in standard form.", "\\lambda = 5.89 \\times 10^{-7}\\,\\text{m}", True))},

  { "title": "Dimensional Analysis of Force",
    "steps": steps(
      ("Show that 1 N = 1 kg·m·s⁻².",),
      ("From F = ma, units of F = units of m × units of a.",
       "[F] = \\text{kg} \\times \\text{m/s}^2"),
      ("Write with negative exponents.", "[F] = \\text{kg}\\cdot\\text{m}\\cdot\\text{s}^{-2} = \\text{N}", True))},

  { "title": "Dimensional Analysis of Energy",
    "steps": steps(
      ("Show that 1 J = 1 kg·m²·s⁻².",),
      ("From W = Fd, units of W = N × m.", "[W] = \\text{kg}\\cdot\\text{m}\\cdot\\text{s}^{-2} \\times \\text{m}"),
      ("Simplify.", "[W] = \\text{kg}\\cdot\\text{m}^2\\cdot\\text{s}^{-2} = \\text{J}", True))},

  { "title": "Scientific Notation — Large Number",
    "steps": steps(
      ("Express the speed of light c = 300,000,000 m/s in scientific notation.",),
      ("Count decimal places to move.", "3.00 \\times 10^8\\,\\text{m/s}"),
      ("Verify: 3.00 × 10⁸ = 300,000,000 ✓", "c = 3.00 \\times 10^8\\,\\text{m/s}", True))},

  { "title": "Scientific Notation — Small Number",
    "steps": steps(
      ("Express the charge of an electron e = 0.00000000000000000016 C in scientific notation.",),
      ("Move decimal 19 places right.", "e = 1.6 \\times 10^{-19}\\,\\text{C}"),
      ("This is a standard value to memorise.", "e = 1.6 \\times 10^{-19}\\,\\text{C}", True))},

  { "title": "SI Prefix Chain",
    "steps": steps(
      ("Convert 3.5 GHz to Hz, then to kHz.",),
      ("1 GHz = 10⁹ Hz.", "3.5\\,\\text{GHz} = 3.5 \\times 10^9\\,\\text{Hz}"),
      ("Divide by 10³ to get kHz.", "3.5 \\times 10^9\\,\\text{Hz} = 3.5 \\times 10^6\\,\\text{kHz}", True))},
]

# ════════════════════════════════════════════════════════════════
# 3. vectors
# ════════════════════════════════════════════════════════════════
data['vectors']['workedExamples'] = [
  { "title": "Resultant of Two Perpendicular Vectors",
    "steps": steps(
      ("A = 6 N East, B = 8 N North. Find the resultant.",),
      ("Apply Pythagoras.", "R = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100}"),
      ("Find angle.", "R = 10\\,\\text{N},\\quad \\theta = \\tan^{-1}(8/6) = 53.1°\\,\\text{N of E}", True))},

  { "title": "Resolving a Vector into Components",
    "steps": steps(
      ("A force of 50 N acts at 37° above the horizontal. Find Fx and Fy.",),
      ("Horizontal component:", "F_x = 50\\cos 37° = 50 \\times 0.799 = 39.9\\,\\text{N}"),
      ("Vertical component:", "F_y = 50\\sin 37° = 50 \\times 0.602 = 30.1\\,\\text{N}", True))},

  { "title": "Adding Vectors by Components",
    "steps": steps(
      ("P = 10 N at 30°, Q = 8 N at 120°. Find the resultant.",),
      ("Sum x-components: Rx = 10cos30° + 8cos120° = 8.66 − 4.0 = 4.66 N. "
       "Sum y-components: Ry = 10sin30° + 8sin120° = 5.0 + 6.93 = 11.93 N.",
       "R_x = 4.66\\,\\text{N},\\quad R_y = 11.93\\,\\text{N}"),
      ("Find magnitude and direction.",
       "R = \\sqrt{4.66^2 + 11.93^2} = 12.8\\,\\text{N},\\quad \\theta = \\tan^{-1}(11.93/4.66) = 68.7°", True))},

  { "title": "Subtraction of Vectors",
    "steps": steps(
      ("A = 5 m/s East (+5), B = 3 m/s East (+3). Find A − B.",),
      ("Vector subtraction = add the negative of B.",
       "\\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B}) = 5 + (-3)"),
      ("Result.", "\\vec{A} - \\vec{B} = 2\\,\\text{m/s East}", True))},

  { "title": "Unit Vector",
    "steps": steps(
      ("Vector F = (9 N, 12 N). Find the unit vector in the direction of F.",),
      ("Find magnitude.", "|F| = \\sqrt{9^2 + 12^2} = \\sqrt{225} = 15\\,\\text{N}"),
      ("Divide each component by magnitude.",
       "\\hat{F} = \\left(\\frac{9}{15},\\,\\frac{12}{15}\\right) = (0.6,\\;0.8)", True))},

  { "title": "Three Forces in Equilibrium",
    "steps": steps(
      ("Two forces: 10 N East, 6 N North. What third force F₃ produces equilibrium?",),
      ("For equilibrium, ΣF = 0, so F₃ must cancel the resultant of the first two.",
       "\\vec{F}_3 = -(F_x, F_y) = (-10, -6)\\,\\text{N}"),
      ("Find magnitude and direction.",
       "|F_3| = \\sqrt{100 + 36} = 11.7\\,\\text{N at } 31° \\text{ S of W}", True))},

  { "title": "Displacement from Origin",
    "steps": steps(
      ("A person walks 8 m East then 6 m South. Find their displacement from start.",),
      ("x = +8 m, y = −6 m. Apply Pythagoras.", "d = \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10\\,\\text{m}"),
      ("Find direction.", "\\theta = \\tan^{-1}(6/8) = 36.9°\\,\\text{South of East}", True))},

  { "title": "Velocity Vector Components",
    "steps": steps(
      ("A ball is launched at 25 m/s at 53° to the horizontal. Find vx and vy.",),
      ("Horizontal:", "v_x = 25\\cos 53° = 25 \\times 0.6 = 15\\,\\text{m/s}"),
      ("Vertical:", "v_y = 25\\sin 53° = 25 \\times 0.8 = 20\\,\\text{m/s}", True))},

  { "title": "Resultant of Three Vectors",
    "steps": steps(
      ("Forces: 4 N East, 3 N West, 5 N North. Find the resultant.",),
      ("Sum x: 4 − 3 = 1 N East. Sum y: 5 N North.",
       "R_x = 1\\,\\text{N},\\quad R_y = 5\\,\\text{N}"),
      ("Magnitude and direction.",
       "R = \\sqrt{1^2 + 5^2} = \\sqrt{26} \\approx 5.1\\,\\text{N at } \\tan^{-1}(5/1) = 78.7°\\,\\text{N of E}", True))},

  { "title": "Finding the Angle of a Resultant",
    "steps": steps(
      ("Rx = 7 N, Ry = 7 N. Find the direction of the resultant.",),
      ("Apply tan θ = Ry/Rx.", "\\theta = \\tan^{-1}\\left(\\frac{7}{7}\\right) = \\tan^{-1}(1)"),
      ("Calculate.", "\\theta = 45°\\,\\text{above positive x-axis}", True))},
]

# ════════════════════════════════════════════════════════════════
# 4. position-velocity
# ════════════════════════════════════════════════════════════════
data['position-velocity']['workedExamples'] = [
  { "title": "Average Velocity — Basic",
    "steps": steps(
      ("Object moves from x = 3 m to x = 19 m in 4 s. Find average velocity.",),
      ("Apply v = Δx/Δt.", "v = \\frac{19 - 3}{4} = \\frac{16}{4}"),
      ("Result.", "v = 4\\,\\text{m/s}", True))},

  { "title": "Average Speed vs Average Velocity",
    "steps": steps(
      ("A runner goes 60 m East then 20 m West in 40 s. Find average speed and velocity.",),
      ("Average speed uses total distance.", "\\text{speed} = \\frac{60 + 20}{40} = 2.0\\,\\text{m/s}"),
      ("Average velocity uses net displacement (40 m East).",
       "v_{\\text{avg}} = \\frac{40}{40} = 1.0\\,\\text{m/s East}", True))},

  { "title": "Average Acceleration",
    "steps": steps(
      ("A car's velocity changes from 10 m/s to 34 m/s in 6 s. Find average acceleration.",),
      ("Apply a = Δv/Δt.", "a = \\frac{v_f - v_i}{\\Delta t} = \\frac{34 - 10}{6}"),
      ("Calculate.", "a = 4\\,\\text{m/s}^2", True))},

  { "title": "Deceleration",
    "steps": steps(
      ("A ball slows from 20 m/s to 5 m/s in 3 s. Find acceleration (sign included).",),
      ("Apply a = Δv/Δt.", "a = \\frac{5 - 20}{3} = \\frac{-15}{3}"),
      ("Negative sign indicates deceleration.", "a = -5\\,\\text{m/s}^2", True))},

  { "title": "Negative Displacement (Return Journey)",
    "steps": steps(
      ("A car goes from x = 50 m to x = 10 m in 8 s. Find velocity.",),
      ("Displacement is negative (moved in −x direction).",
       "\\Delta x = 10 - 50 = -40\\,\\text{m}"),
      ("Find velocity.", "v = \\frac{-40}{8} = -5\\,\\text{m/s}", True))},

  { "title": "Finding Displacement from Velocity and Time",
    "steps": steps(
      ("Object moves at constant 7 m/s for 9 s. Find displacement.",),
      ("Rearrange v = Δx/Δt.", "\\Delta x = v \\times \\Delta t"),
      ("Substitute.", "\\Delta x = 7 \\times 9 = 63\\,\\text{m}", True))},

  { "title": "Instantaneous Velocity Approximation",
    "steps": steps(
      ("Position: x(t) = 2t². Find instantaneous velocity at t = 3 s using a small interval.",),
      ("Use Δt = 0.01 s: x(3) = 18 m, x(3.01) = 2(3.01)² = 18.1202 m.",
       "\\Delta x \\approx 18.1202 - 18.0000 = 0.1202\\,\\text{m}"),
      ("v ≈ Δx/Δt ≈ 0.1202/0.01 = 12.02 m/s ≈ 12 m/s (exact: 4t = 12).",
       "v \\approx 12\\,\\text{m/s}", True))},

  { "title": "Finding Time from Velocity and Displacement",
    "steps": steps(
      ("Object travels 45 m at an average velocity of 9 m/s. How long did it take?",),
      ("Rearrange v = Δx/Δt.", "\\Delta t = \\frac{\\Delta x}{v} = \\frac{45}{9}"),
      ("Calculate.", "\\Delta t = 5\\,\\text{s}", True))},

  { "title": "Multi-Interval Average Velocity",
    "steps": steps(
      ("Segment 1: 30 m in 5 s. Segment 2: 50 m in 10 s. Find average velocity for whole journey.",),
      ("Total displacement = 80 m. Total time = 15 s.",
       "\\Delta x_{\\text{total}} = 80\\,\\text{m},\\quad \\Delta t_{\\text{total}} = 15\\,\\text{s}"),
      ("Apply v_avg = Δx/Δt.", "v_{\\text{avg}} = \\frac{80}{15} = 5.33\\,\\text{m/s}", True))},

  { "title": "Acceleration with Direction Change",
    "steps": steps(
      ("Ball thrown upward at +15 m/s, 3 s later velocity is −14.4 m/s. Find acceleration.",),
      ("Apply a = Δv/Δt.", "a = \\frac{-14.4 - 15}{3} = \\frac{-29.4}{3}"),
      ("Result (gravitational acceleration downward).", "a = -9.8\\,\\text{m/s}^2", True))},
]

# ════════════════════════════════════════════════════════════════
# 5. equations-of-motion
# ════════════════════════════════════════════════════════════════
data['equations-of-motion']['workedExamples'] = [
  { "title": "Find Final Velocity — v = u + at",
    "steps": steps(
      ("A train starts at 5 m/s and accelerates at 2 m/s² for 8 s. Find final velocity.",),
      ("Apply v = u + at.", "v = 5 + (2)(8) = 5 + 16"),
      ("Result.", "v = 21\\,\\text{m/s}", True))},

  { "title": "Find Distance from Rest — s = ½at²",
    "steps": steps(
      ("A car starts from rest and accelerates at 4 m/s² for 6 s. Find distance.",),
      ("u = 0, so s = ½at².", "s = \\tfrac{1}{2} \\times 4 \\times 6^2 = 2 \\times 36"),
      ("Result.", "s = 72\\,\\text{m}", True))},

  { "title": "Braking Distance — v² = u² + 2as",
    "steps": steps(
      ("A motorcycle at 30 m/s brakes at −6 m/s². Find stopping distance.",),
      ("v = 0 at stop. Rearrange v² = u² + 2as.",
       "s = \\frac{v^2 - u^2}{2a} = \\frac{0 - 900}{2(-6)} = \\frac{-900}{-12}"),
      ("Result.", "s = 75\\,\\text{m}", True))},

  { "title": "Find Time Given Velocities and Acceleration",
    "steps": steps(
      ("A bus accelerates from 4 m/s to 22 m/s at 3 m/s². Find the time taken.",),
      ("Rearrange v = u + at for t.", "t = \\frac{v - u}{a} = \\frac{22 - 4}{3} = \\frac{18}{3}"),
      ("Result.", "t = 6\\,\\text{s}", True))},

  { "title": "Find Initial Velocity",
    "steps": steps(
      ("An object reaches 40 m/s after accelerating at 5 m/s² for 4 s. Find initial velocity.",),
      ("Rearrange v = u + at.", "u = v - at = 40 - (5)(4) = 40 - 20"),
      ("Result.", "u = 20\\,\\text{m/s}", True))},

  { "title": "Find Acceleration from v, u, s",
    "steps": steps(
      ("A ball changes speed from 8 m/s to 20 m/s over 42 m. Find acceleration.",),
      ("Use v² = u² + 2as.", "a = \\frac{v^2 - u^2}{2s} = \\frac{400 - 64}{84} = \\frac{336}{84}"),
      ("Result.", "a = 4\\,\\text{m/s}^2", True))},

  { "title": "Object Thrown Upward — Max Height",
    "steps": steps(
      ("Ball thrown upward at 20 m/s. Find maximum height. (g = 10 m/s²)",),
      ("At max height v = 0. Use v² = u² − 2gs.",
       "s = \\frac{u^2}{2g} = \\frac{20^2}{2 \\times 10} = \\frac{400}{20}"),
      ("Result.", "s = 20\\,\\text{m}", True))},

  { "title": "Object Thrown Upward — Time to Peak",
    "steps": steps(
      ("Ball thrown upward at 15 m/s. Find time to reach max height. (g = 10 m/s²)",),
      ("At max height v = 0. Apply v = u − gt.",
       "t = \\frac{u}{g} = \\frac{15}{10}"),
      ("Result.", "t = 1.5\\,\\text{s}", True))},

  { "title": "Two-Stage Motion",
    "steps": steps(
      ("Car accelerates from rest at 3 m/s² for 5 s, then decelerates at 2 m/s² to stop. "
       "Find total distance.",),
      ("Stage 1: v₁ = 0 + 3×5 = 15 m/s, s₁ = ½×3×25 = 37.5 m. "
       "Stage 2: s₂ = v₁²/(2×2) = 225/4 = 56.25 m.",
       "s_1 = 37.5\\,\\text{m},\\quad s_2 = 56.25\\,\\text{m}"),
      ("Total distance.", "s_{\\text{total}} = 37.5 + 56.25 = 93.75\\,\\text{m}", True))},

  { "title": "Displacement in the nth Second",
    "steps": steps(
      ("Find the displacement in the 4th second for u = 2 m/s, a = 3 m/s².",),
      ("Use s_n = u + a(n − ½).", "s_4 = 2 + 3(4 - 0.5) = 2 + 3(3.5) = 2 + 10.5"),
      ("Result.", "s_4 = 12.5\\,\\text{m}", True))},
]

# ════════════════════════════════════════════════════════════════
# 6. free-fall
# ════════════════════════════════════════════════════════════════
data['free-fall']['workedExamples'] = [
  { "title": "Time to Fall from Height",
    "steps": steps(
      ("A stone is dropped from 80 m. How long to reach the ground? (g = 10 m/s²)",),
      ("Use h = ½gt², rearrange.", "t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times 80}{10}} = \\sqrt{16}"),
      ("Result.", "t = 4\\,\\text{s}", True))},

  { "title": "Velocity Just Before Impact",
    "steps": steps(
      ("An object falls freely from 45 m. Find velocity on impact. (g = 10 m/s²)",),
      ("Use v² = 2gh.", "v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 45} = \\sqrt{900}"),
      ("Result.", "v = 30\\,\\text{m/s}", True))},

  { "title": "Height from Fall Time",
    "steps": steps(
      ("A ball falls for 3.5 s. How far did it fall? (g = 9.8 m/s²)",),
      ("Apply h = ½gt².", "h = \\tfrac{1}{2} \\times 9.8 \\times 3.5^2 = 4.9 \\times 12.25"),
      ("Result.", "h = 60.0\\,\\text{m}", True))},

  { "title": "Object Thrown Upward — Total Time in Air",
    "steps": steps(
      ("Ball thrown upward at 25 m/s. Find total time in air. (g = 10 m/s²)",),
      ("Time up = u/g = 25/10 = 2.5 s. Total time = 2 × time up.",
       "T = \\frac{2u}{g} = \\frac{2 \\times 25}{10} = 5\\,\\text{s}"),
      ("Result.", "T = 5\\,\\text{s}", True))},

  { "title": "Velocity at Any Point During Ascent",
    "steps": steps(
      ("Ball thrown up at 30 m/s. Find velocity after 2 s. (g = 10 m/s²)",),
      ("Apply v = u − gt.", "v = 30 - (10)(2) = 30 - 20"),
      ("Result (positive = still going up).", "v = 10\\,\\text{m/s \\,(upward)}", True))},

  { "title": "Height at Given Time During Flight",
    "steps": steps(
      ("Ball thrown upward at 20 m/s. Find height after 1.5 s. (g = 10 m/s²)",),
      ("Apply h = ut − ½gt².", "h = 20(1.5) - \\tfrac{1}{2}(10)(1.5)^2 = 30 - 11.25"),
      ("Result.", "h = 18.75\\,\\text{m}", True))},

  { "title": "Free Fall on the Moon",
    "steps": steps(
      ("On the Moon (g = 1.6 m/s²) a rock is dropped from 10 m. Find fall time.",),
      ("Apply t = √(2h/g).", "t = \\sqrt{\\frac{2 \\times 10}{1.6}} = \\sqrt{12.5}"),
      ("Compare: on Earth the same drop takes √2 ≈ 1.41 s.",
       "t_{\\text{Moon}} = 3.54\\,\\text{s vs } t_{\\text{Earth}} = 1.43\\,\\text{s}", True))},

  { "title": "Finding g Experimentally",
    "steps": steps(
      ("A ball dropped from 2.5 m takes 0.714 s to land. Calculate g.",),
      ("Rearrange h = ½gt².", "g = \\frac{2h}{t^2} = \\frac{2 \\times 2.5}{(0.714)^2} = \\frac{5}{0.510}"),
      ("Result.", "g \\approx 9.81\\,\\text{m/s}^2", True))},

  { "title": "Two Balls Dropped at Different Times",
    "steps": steps(
      ("Ball A dropped from 80 m. Ball B dropped 1 s later from same height. "
       "When does A hit ground? (g = 10)",),
      ("Ball A: t_A = √(2×80/10) = 4 s.",
       "t_A = \\sqrt{\\frac{2 \\times 80}{10}} = 4\\,\\text{s}"),
      ("Ball B is still in air at that moment (only 3 s of fall, fallen 45 m).",
       "t_A = 4\\,\\text{s after A released}", True))},

  { "title": "Impact Velocity from Cliff",
    "steps": steps(
      ("A ball is dropped from a 122.5 m cliff. Find impact velocity. (g = 9.8 m/s²)",),
      ("Use v² = 2gh.", "v = \\sqrt{2 \\times 9.8 \\times 122.5} = \\sqrt{2401}"),
      ("Result.", "v = 49\\,\\text{m/s}", True))},
]

# ════════════════════════════════════════════════════════════════
# 7. motion-graphs
# ════════════════════════════════════════════════════════════════
data['motion-graphs']['workedExamples'] = [
  { "title": "Velocity from x–t Graph (Slope)",
    "steps": steps(
      ("x–t graph: x increases from 4 m to 28 m as t increases from 0 to 6 s. Find velocity.",),
      ("Velocity = slope of x–t graph.", "v = \\frac{\\Delta x}{\\Delta t} = \\frac{28 - 4}{6 - 0} = \\frac{24}{6}"),
      ("Result.", "v = 4\\,\\text{m/s}", True))},

  { "title": "Displacement from v–t Graph (Rectangle)",
    "steps": steps(
      ("v–t graph: constant v = 12 m/s from t = 2 s to t = 7 s. Find displacement.",),
      ("Displacement = area under v–t graph.", "s = v \\times \\Delta t = 12 \\times (7 - 2) = 12 \\times 5"),
      ("Result.", "s = 60\\,\\text{m}", True))},

  { "title": "Displacement from v–t Graph (Triangle)",
    "steps": steps(
      ("v–t graph: velocity increases linearly from 0 to 18 m/s over 6 s. Find displacement.",),
      ("Area = triangle.", "s = \\tfrac{1}{2} \\times \\text{base} \\times \\text{height} = \\tfrac{1}{2} \\times 6 \\times 18"),
      ("Result.", "s = 54\\,\\text{m}", True))},

  { "title": "Acceleration from v–t Graph (Slope)",
    "steps": steps(
      ("v–t graph: v changes from 5 m/s to 29 m/s between t = 0 and t = 6 s. Find acceleration.",),
      ("Acceleration = slope of v–t graph.", "a = \\frac{\\Delta v}{\\Delta t} = \\frac{29 - 5}{6 - 0} = \\frac{24}{6}"),
      ("Result.", "a = 4\\,\\text{m/s}^2", True))},

  { "title": "Displacement from Trapezoid Area",
    "steps": steps(
      ("v–t graph: v = 10 m/s at t = 0, v = 20 m/s at t = 5 s (linear). Find displacement.",),
      ("Area of trapezoid = ½(a + b) × h.",
       "s = \\tfrac{1}{2}(10 + 20) \\times 5 = \\tfrac{1}{2} \\times 30 \\times 5"),
      ("Result.", "s = 75\\,\\text{m}", True))},

  { "title": "Stationary Object on x–t Graph",
    "steps": steps(
      ("x–t graph is a horizontal line at x = 15 m. What is the velocity?",),
      ("Slope of horizontal line = 0.", "v = \\frac{\\Delta x}{\\Delta t} = \\frac{0}{\\Delta t} = 0"),
      ("Object is stationary.", "v = 0\\,\\text{m/s}", True))},

  { "title": "Negative Velocity on x–t Graph",
    "steps": steps(
      ("x–t graph: x decreases from 30 m to 6 m over 4 s. Find velocity.",),
      ("Negative slope means moving in −x direction.",
       "v = \\frac{6 - 30}{4} = \\frac{-24}{4}"),
      ("Result.", "v = -6\\,\\text{m/s}", True))},

  { "title": "Area Under a–t Graph",
    "steps": steps(
      ("a–t graph shows constant a = 3 m/s² from t = 0 to t = 5 s. If u = 4 m/s, find v.",),
      ("Area under a–t = change in velocity.", "\\Delta v = a \\times \\Delta t = 3 \\times 5 = 15\\,\\text{m/s}"),
      ("Final velocity.", "v = u + \\Delta v = 4 + 15 = 19\\,\\text{m/s}", True))},

  { "title": "Multi-segment v–t Graph",
    "steps": steps(
      ("v–t graph: 0→4 s constant at 6 m/s; 4→8 s increases to 14 m/s. Find total displacement.",),
      ("Segment 1 (rectangle): s₁ = 6 × 4 = 24 m. "
       "Segment 2 (trapezoid): s₂ = ½(6+14)×4 = 40 m.",
       "s_1 = 24\\,\\text{m},\\quad s_2 = 40\\,\\text{m}"),
      ("Total.", "s = 24 + 40 = 64\\,\\text{m}", True))},

  { "title": "Finding Distance (Not Displacement) when v Changes Sign",
    "steps": steps(
      ("v–t graph: +8 m/s for 3 s, then −4 m/s for 3 s. Find total distance travelled.",),
      ("Distance uses area magnitudes (ignore sign).",
       "d = |8 \\times 3| + |{-4} \\times 3| = 24 + 12"),
      ("Total distance (not displacement).", "d = 36\\,\\text{m}", True))},
]

# ════════════════════════════════════════════════════════════════
# 8. projectile-motion
# ════════════════════════════════════════════════════════════════
data['projectile-motion']['workedExamples'] = [
  { "title": "Range at 45° (Maximum Range)",
    "steps": steps(
      ("A ball is launched at 14 m/s at 45°. Find the range. (g = 9.8 m/s²)",),
      ("At 45°, sin 2θ = sin 90° = 1.", "R = \\frac{v_0^2}{g} = \\frac{14^2}{9.8} = \\frac{196}{9.8}"),
      ("Result.", "R = 20\\,\\text{m}", True))},

  { "title": "Range at 30°",
    "steps": steps(
      ("Projectile launched at 20 m/s at 30°. Find range. (g = 10 m/s²)",),
      ("sin 2(30°) = sin 60° = 0.866.", "R = \\frac{v_0^2 \\sin 2\\theta}{g} = \\frac{400 \\times 0.866}{10}"),
      ("Result.", "R = 34.6\\,\\text{m}", True))},

  { "title": "Maximum Height at 60°",
    "steps": steps(
      ("Launched at 20 m/s at 60°. Find maximum height. (g = 10 m/s²)",),
      ("sin²60° = 0.75.", "H = \\frac{v_0^2 \\sin^2\\theta}{2g} = \\frac{400 \\times 0.75}{20}"),
      ("Result.", "H = 15\\,\\text{m}", True))},

  { "title": "Time of Flight at 30°",
    "steps": steps(
      ("Launched at 25 m/s at 30°. Find time of flight. (g = 10 m/s²)",),
      ("sin 30° = 0.5.", "T = \\frac{2v_0 \\sin\\theta}{g} = \\frac{2 \\times 25 \\times 0.5}{10} = \\frac{25}{10}"),
      ("Result.", "T = 2.5\\,\\text{s}", True))},

  { "title": "Horizontal Launch from a Height",
    "steps": steps(
      ("Ball launched horizontally at 15 m/s from 20 m cliff. Find range. (g = 10 m/s²)",),
      ("Time to fall: h = ½gt², t = √(2h/g) = √4 = 2 s.",
       "t = \\sqrt{\\frac{2 \\times 20}{10}} = 2\\,\\text{s}"),
      ("Horizontal range.", "R = v_x \\times t = 15 \\times 2 = 30\\,\\text{m}", True))},

  { "title": "Vertical Velocity at Given Time",
    "steps": steps(
      ("Launched at 30 m/s at 53°. Find vertical velocity at t = 2 s. (g = 10 m/s²)",),
      ("Initial vertical component: vy₀ = 30sin53° = 24 m/s.",
       "v_{y0} = 30 \\times 0.8 = 24\\,\\text{m/s}"),
      ("Apply vy = vy₀ − gt.",
       "v_y = 24 - (10)(2) = 4\\,\\text{m/s (still rising)}", True))},

  { "title": "Speed at Given Time (Vector Sum)",
    "steps": steps(
      ("Launched at 25 m/s at 53°. Find speed at t = 1.5 s. (g = 10 m/s²)",),
      ("vx = 25cos53° = 15 m/s (constant). vy₀ = 25sin53° = 20 m/s. "
       "vy = 20 − 10×1.5 = 5 m/s.",
       "v_x = 15\\,\\text{m/s},\\quad v_y = 5\\,\\text{m/s}"),
      ("Total speed.", "v = \\sqrt{15^2 + 5^2} = \\sqrt{250} \\approx 15.8\\,\\text{m/s}", True))},

  { "title": "Finding Launch Speed from Range",
    "steps": steps(
      ("A ball lands 50 m away when launched at 45°. Find launch speed. (g = 10 m/s²)",),
      ("At 45°, R = v₀²/g. Rearrange.", "v_0 = \\sqrt{Rg} = \\sqrt{50 \\times 10} = \\sqrt{500}"),
      ("Result.", "v_0 \\approx 22.4\\,\\text{m/s}", True))},

  { "title": "Complementary Angles Give Same Range",
    "steps": steps(
      ("Show that 30° and 60° give the same range for v₀ = 20 m/s. (g = 10 m/s²)",),
      ("sin2(30°) = sin60° = 0.866; sin2(60°) = sin120° = 0.866.",
       "R_{30°} = \\frac{400 \\times 0.866}{10} = 34.6\\,\\text{m}"),
      ("Both give 34.6 m — complementary angles always give equal range.",
       "R_{60°} = \\frac{400 \\times 0.866}{10} = 34.6\\,\\text{m}", True))},

  { "title": "Height and Range Together",
    "steps": steps(
      ("Find both max height and range for v₀ = 30 m/s at 37°. (g = 10 m/s²)",),
      ("sin37° = 0.6, cos37° = 0.8, sin74° ≈ 0.961.",
       "H = \\frac{900 \\times 0.36}{20} = 16.2\\,\\text{m}"),
      ("Range.",
       "R = \\frac{900 \\times 0.961}{10} = 86.5\\,\\text{m}", True))},
]

# ── Save ──────────────────────────────────────────────────────────
with open(path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Batch 1 done: 8 topics updated, 10 examples each.")
