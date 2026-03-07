"""Fix all identified issues across challenge hints (and two descriptions)."""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

fixes = {}

# ── 1. free-fall ─────────────────────────────────────────────────────────────
# Problem: part (d) asks when both stones have the same speed — physically
# impossible (thrown stone is always faster at every height). Fix: replace (d)
# with a solvable question about separation between the two stones.
fixes['free-fall'] = {
    'description': (
        "A stone is dropped from a bridge and hits water 3.2 s later. "
        "(a) Find the height of the bridge (ignore air resistance). "
        "(b) Find the speed just before impact. "
        "(c) A second stone is thrown downward at 5.0 m/s from the same bridge — "
        "find its speed on hitting water and its time to fall. "
        "(d) Find the vertical separation between the two stones at t = 2.0 s after "
        "both are released. Show algebraically that separation = u×t, independent of g. "
        "(e) How would air resistance affect the results — which stone is more affected and why?"
    ),
    'hint': (
        "Dropped stone: h = ½gt², v = gt. "
        "Thrown stone: h = ut + ½gt², v² = u² + 2gh. "
        "For (d): both stones share the same g, so their positions differ only by the ut term. "
        "Separation = (ut + ½gt²) − ½gt² = ut — it grows linearly and does not depend on g. "
        "At t = 2 s: separation = 5 × 2 = 10 m."
    ),
}

# ── 2. time-dilation ─────────────────────────────────────────────────────────
# Problem: description says "satellite clocks run faster ... moving clocks run
# slow via SR" — internally contradictory. For SR alone, moving clocks run SLOW.
# Fix: rewrite description to be internally consistent and educationally clear.
fixes['time-dilation'] = {
    'description': (
        "GPS satellites orbit at 20,200 km altitude, moving at 3.87 km/s. "
        "Special relativity predicts that moving clocks run slow (time dilation). "
        "General relativity predicts that clocks at altitude run fast (weaker gravity). "
        "This challenge examines the SR effect alone. "
        "(a) Find γ = 1/√(1 − v²/c²) for the satellite. "
        "(b) Using γ ≈ 1 + ½(v/c)², find how many microseconds per day the satellite "
        "clock runs slow relative to a ground clock (time lost ≈ ½(v/c)² × 86400 × 10⁶ μs). "
        "(c) GPS requires timing accuracy of ~30 ns. Find the GPS position error (in metres) "
        "per day if the SR clock drift is uncorrected. "
        "(d) The GR effect causes the satellite clock to run fast by +45.9 μs/day. "
        "Find the net daily clock error combining SR and GR effects — does the satellite "
        "clock run fast or slow overall?"
    ),
    'hint': (
        "v/c = 3870 / (3×10⁸) ≈ 1.29 × 10⁻⁵. "
        "Binomial approximation: γ ≈ 1 + ½(v/c)². "
        "SR time lost per day ≈ ½(v/c)² × 86400 s — convert to μs. "
        "Position error = speed of light × time error (in seconds). "
        "For (d): net error = GR gain − SR loss = 45.9 − 7.2 = +38.7 μs/day "
        "(net gain means satellite clock runs fast — GPS clocks are pre-adjusted to compensate)."
    ),
}

# ── 3. 2d-collisions ─────────────────────────────────────────────────────────
# Problem: hint states "equal-mass elastic collisions always move at 90°" but
# the collision in the question is NOT elastic (only ~73% KE conserved).
# Stating 90° misleads students doing part (d).
fixes['2d-collisions'] = {
    'hint': (
        "Initial momentum is purely eastward (x-direction). "
        "Set up x and y component equations separately: "
        "x: m×3.0 = m×1.5cos40° + m×v_x, "
        "y: 0 = m×1.5sin40° + m×v_y. "
        "Solve for the struck ball's velocity components, then find magnitude and angle. "
        "For the KE check: calculate total KE before and after — "
        "elastic means KE is fully conserved. "
        "Note: the 90° rule (post-collision vectors are perpendicular) applies only to "
        "perfectly elastic equal-mass collisions, so check KE first before assuming it here."
    ),
}

# ── 4. electromagnets ─────────────────────────────────────────────────────────
# Problem: hint says "to double the force, NI must increase by √2" but then says
# "doubling N or I quadruples force — far more than needed." These are consistent
# facts (both true) but the wording of the description question asks simply
# "should you double N or double I?" — implying both are equivalent. The hint
# needs to clearly state that BOTH options quadruple (not double) the force,
# and that to double the force you would need to multiply NI by only √2.
fixes['electromagnets'] = {
    'hint': (
        "H = NI/L. B = μ₀μᵣH. Lifting force F = (B²/2μ₀) × A. "
        "Since B ∝ NI, Force ∝ (NI)². "
        "Doubling N alone multiplies NI by 2, so Force increases by 2² = 4 (quadruples). "
        "Doubling I alone has the same effect — also quadruples the force. "
        "Both options are equivalent in terms of force increase. "
        "To achieve exactly double the force, you would need NI to increase by only √2 ≈ 1.41. "
        "The practical limit on increasing current is resistive heating (I²R) in the coil."
    ),
}

# ── 5. lenses ─────────────────────────────────────────────────────────────────
# Problem: two conflicting sign conventions given with no guidance on which to use.
# Fix: use a single clear convention (real-is-positive).
fixes['lenses'] = {
    'hint': (
        "Use the real-is-positive lens formula: 1/f = 1/v + 1/u, "
        "where u is object distance (positive for real object) and v is image distance "
        "(positive for real image on the far side, negative for virtual image on same side as object). "
        "Magnification m = v/u. "
        "For long-sight correction: the lens must form a virtual image at 60 cm "
        "(the person's near point) when the object is at 25 cm, so v = −60 cm (virtual, same side). "
        "Power P = 1/f (metres). Long-sighted → converging lens → positive power."
    ),
}

# ── 6. power-efficiency ───────────────────────────────────────────────────────
# Problem: "speed in km/s" should be "speed in km/h".
# (kWh/km) × (km/h) = kWh/h = kW — only works with km/h.
fixes['power-efficiency'] = {
    'hint': (
        "KE = ½mv². Power = Work/time. Electrical energy = useful output / efficiency. "
        "Highway power: energy consumption is 15 kWh per 100 km. "
        "At 100 km/h, the car covers 100 km in 1 hour, so power = 15 kWh/h = 15 kW. "
        "More generally: power = (kWh per km) × (speed in km/h). "
        "To compare: convert acceleration power to kW and compare to the 15 kW highway figure."
    ),
}

# ── 7. angular-momentum ───────────────────────────────────────────────────────
# Problem: "τ×t = ΔL = 0 − L_final" — L_final is ambiguous (sounds like the end state = 0).
# Fix: use clear naming.
fixes['angular-momentum'] = {
    'hint': (
        "Angular momentum L = Iω is conserved when there is no external torque. "
        "Convert rev/s to rad/s: multiply by 2π. "
        "Rotational KE = ½Iω². The extra KE after pulling arms in comes from "
        "internal muscular work done against centrifugal tendency. "
        "For stopping: angular impulse = torque × time = change in angular momentum. "
        "τ × t = ΔL = 0 − L_spinning (final L = 0, initial L = value after pulling arms in). "
        "For angle rotated while stopping: use θ = ω_average × t = (ω_initial/2) × t."
    ),
}

# ── 8. gyroscopes ─────────────────────────────────────────────────────────────
# Problem: symbol r used for both wheel radius (0.35 m) and pivot arm length (0.15 m).
# Fix: use distinct labels.
fixes['gyroscopes'] = {
    'hint': (
        "Moment of inertia for a thin ring: I = mR² (R = wheel radius = 0.35 m). "
        "Angular velocity: ω = 2π × rev/s. Angular momentum: L = Iω. "
        "Precession: the gravitational torque τ = mg × d_arm (where d_arm = 0.15 m is the "
        "axle pivot distance). Precession rate: ω_p = τ/L = mg × d_arm / (Iω). "
        "Faster spin → larger L → smaller ω_p (slower precession). "
        "This gyroscopic effect is what keeps a moving bicycle upright — "
        "the spinning wheels resist changes to their orientation."
    ),
}

# ── 9. superposition ──────────────────────────────────────────────────────────
# Problem: gives away the complete answer to part (b) (calculates PD and states result).
# Fix: give method only.
fixes['superposition'] = {
    'hint': (
        "Wavelength: λ = v/f. "
        "Constructive interference: path difference = nλ (n = 0, 1, 2, …). "
        "Destructive interference: path difference = (n + ½)λ. "
        "For (b): calculate the path difference from the given distances, "
        "then divide by λ to see if it is a whole number (constructive) or half-integer (destructive). "
        "For (c): find positions along the line where path difference equals ½λ, 1½λ, 2½λ "
        "by setting up geometry with the two speaker positions."
    ),
}

# ── 10. work-kinetic-energy ───────────────────────────────────────────────────
# Problem: hint for (e) references "0.25" without explaining it is the embedding depth from (b).
fixes['work-kinetic-energy'] = {
    'hint': (
        "KE at impact = mgh (all GPE converts to KE). "
        "Work-energy theorem during embedding: net work = ΔKE = 0 − ½mv². "
        "Net force = gravity − resistance force, applied over embedding depth d = 0.25 m. "
        "Total work by gravity over full fall = mg × (h + d). "
        "For (e): the pile still embeds 0.25 m (same soil resistance). "
        "Set mgh_new = F_resistance × 0.25 m and solve for the new drop height h_new."
    ),
}

# ── 11. transistors ───────────────────────────────────────────────────────────
# Problem: description uses I_C for emitter resistor drop (approximation);
# hint uses I_E (exact). Both are presented without labelling, causing confusion.
# Fix: align hint with description (use I_C for R_E, noting it is a valid
# approximation for high β), and explain the relationship.
fixes['transistors'] = {
    'hint': (
        "I_C = βI_B. I_E = I_B + I_C (exact). "
        "For large β (β = 120 here), I_E ≈ I_C since I_B is only ~0.8% of I_C. "
        "The description uses the approximation V_CE = V_CC − I_C(R_C + R_E), "
        "which is accurate to well within 1% for β = 120. "
        "When I_B increases, I_C increases, the voltage drop across R_C increases, "
        "so V_CE decreases — the output is phase-inverted relative to the input. "
        "Gain A_v = ΔV_CE / ΔV_BE."
    ),
}

# ── 12. faradays-law ─────────────────────────────────────────────────────────
# Problem: "width_of_strip" is undefined; replace with the actual dimension.
fixes['faradays-law'] = {
    'hint': (
        "Induced EMF: ε = dΦ/dt ≈ B × A_plate × 2πf (peak values, sinusoidal field). "
        "For eddy current resistance, model a circular current loop of radius r_loop = 6 cm: "
        "path length = 2π × 0.06 m, cross-sectional area = thickness × loop_width "
        "= 0.003 m × 0.06 m. R = ρ × path_length / cross-section area. "
        "Braking force: F = BIL where I = ε/R and L = 0.2 m (plate edge length). "
        "A thicker plate has larger cross-section → lower R → higher I → stronger braking force."
    ),
}

# ── 13. orbital-mechanics ────────────────────────────────────────────────────
# Problem: T = 24 h is a school-level simplification (correct period is sidereal
# day = 23 h 56 min). Add a note so students understand the approximation.
fixes['orbital-mechanics'] = {
    'hint': (
        "A geostationary satellite stays fixed over one ground point, "
        "so its period equals Earth's rotation period. "
        "Use T = 24 h = 86,400 s (school-level approximation; "
        "exact value uses the sidereal day of 23 h 56 min). "
        "Rearrange Kepler's 3rd law: r = (GMT²/4π²)^(1/3). "
        "Altitude = r − R_Earth. "
        "Lower orbits have shorter periods and faster speeds (Kepler's 3rd law). "
        "Geostationary orbit must be equatorial — a polar orbit cannot remain fixed above one point."
    ),
}

# ── 14. wave-particle-duality ────────────────────────────────────────────────
# Problem: non-relativistic formula applied at v ≈ 0.6c. Add a note that this
# is an approximation valid for school-level and state the approximate result.
fixes['wave-particle-duality'] = {
    'hint': (
        "Classical (non-relativistic) approximation: KE = eV = ½mv² → v = √(2eV/m). "
        "Note: at 100 kV, v ≈ 0.6c, so this slightly overestimates speed "
        "and underestimates wavelength — but is the standard school-level approach. "
        "De Broglie wavelength: λ = h/(mv). "
        "Compare λ to the 500 nm resolution limit of optical microscopes — "
        "the electron wavelength is roughly 10⁵ times shorter, "
        "giving electron microscopes atomic-scale resolution (~0.1 nm or better)."
    ),
}

# ─────────────────────────────────────────────────────────────────────────────
# Apply all fixes
# ─────────────────────────────────────────────────────────────────────────────
for slug, fields in fixes.items():
    if slug not in data:
        print(f'WARNING: slug not found: {slug}')
        continue
    ch = data[slug].get('challenge', {})
    for field, value in fields.items():
        ch[field] = value
    data[slug]['challenge'] = ch

p.write_text(json.dumps(data, indent=2, ensure_ascii=False))
loaded = json.loads(p.read_text())

print('All fixes applied. Verification:')
for slug in fixes:
    ch = loaded.get(slug, {}).get('challenge', {})
    print(f'\n  [{slug}]')
    print(f'    hint: {ch.get("hint","MISSING")[:80]}...')
print(f'\nTotal topics: {len(loaded)}')
print('JSON valid: OK')
