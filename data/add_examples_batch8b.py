#!/usr/bin/env python3
"""Batch 8b: fission-fusion, standard-model, semiconductors, pn-junction,
transistors, modulation, wave-propagation, digital-communication"""
import json, pathlib

p = pathlib.Path(__file__).parent / 'topic-extras.json'
data = json.loads(p.read_text())

examples = {

"fission-fusion": [
  {"title":"Energy from Uranium-235 Fission","steps":[
    {"text":"Fission of U-235 releases 200 MeV. Find the energy from 1 kg of U-235 (A=235, Avogadro = 6.022×10²³).","latex":"","isFinal":False},
    {"text":"Number of nuclei in 1 kg","latex":"N = \\frac{1000}{235} \\times 6.022\\times10^{23} = 2.563\\times10^{24}","isFinal":False},
    {"text":"Total energy","latex":"E = N \\times 200\\text{ MeV} = 2.563\\times10^{24} \\times 200 \\times 1.6\\times10^{-13} = 8.2\\times10^{13}\\text{ J} \\approx 82\\text{ TJ}","isFinal":True}
  ]},
  {"title":"Mass Defect in Fusion","steps":[
    {"text":"D-T fusion: ²H + ³H → ⁴He + n. Masses: D=2.01410 u, T=3.01605 u, He=4.00260 u, n=1.00867 u. Find energy released.","latex":"","isFinal":False},
    {"text":"Mass defect Δm = (2.01410 + 3.01605) − (4.00260 + 1.00867) = 0.01888 u","latex":"\\Delta m = 0.01888\\text{ u}","isFinal":False},
    {"text":"Energy Q = 0.01888 × 931.5 MeV/u = 17.6 MeV","latex":"Q = 0.01888 \\times 931.5 = 17.6\\text{ MeV}","isFinal":True}
  ]},
  {"title":"Binding Energy per Nucleon","steps":[
    {"text":"He-4 has binding energy 28.3 MeV. Find binding energy per nucleon.","latex":"","isFinal":False},
    {"text":"Binding energy per nucleon = B.E. / A","latex":"\\frac{BE}{A} = \\frac{28.3}{4} = 7.07\\text{ MeV/nucleon}","isFinal":True}
  ]},
  {"title":"Chain Reaction — Multiplication Factor","steps":[
    {"text":"In a fission chain reaction, each fission triggers k new fissions. If k = 1.05, how many fissions after 10 generations starting from 1?","latex":"","isFinal":False},
    {"text":"Geometric progression: N = k^n","latex":"N = (1.05)^{10} = 1.629","isFinal":False},
    {"text":"About 1.6 fissions per original — small k > 1 → supercritical → exponentially growing reaction (basis of nuclear weapon or uncontrolled reactor).","latex":"N_n = k^n\\quad k>1\\Rightarrow\\text{supercritical}","isFinal":True}
  ]},
  {"title":"Critical Mass Concept","steps":[
    {"text":"Explain why a critical mass is needed for a sustained chain reaction.","latex":"","isFinal":False},
    {"text":"Below critical mass, too many neutrons escape the surface without causing fission → k < 1 → reaction dies.","latex":"","isFinal":False},
    {"text":"At critical mass, surface-to-volume ratio is small enough that average neutron produces exactly 1 new fission → k = 1 → self-sustaining controlled reaction (nuclear reactor).","latex":"k = 1\\text{ (critical)}: \\text{each fission} \\to 1\\text{ new fission on average}","isFinal":True}
  ]},
  {"title":"Fusion Temperature Requirement","steps":[
    {"text":"Fusion requires nuclei to overcome Coulomb repulsion. Estimate the temperature needed for d-t fusion (r ≈ 10⁻¹⁵ m).","latex":"","isFinal":False},
    {"text":"PE at r = 10⁻¹⁵ m: U = ke²/r","latex":"U = \\frac{8.99\\times10^9 \\times (1.6\\times10^{-19})^2}{10^{-15}} = 2.3\\times10^{-13}\\text{ J} \\approx 1.44\\text{ MeV}","isFinal":False},
    {"text":"Set kT ≈ U: T ≈ U/k_B = 2.3×10⁻¹³/1.38×10⁻²³ ≈ 1.7×10¹⁰ K (actual ignition ~10⁸ K due to quantum tunnelling)","latex":"T \\approx \\frac{U}{k_B} \\approx 1.7\\times10^{10}\\text{ K}\\quad\\text{(tunnelling lowers this to }\\sim10^8\\text{ K)}","isFinal":True}
  ]},
  {"title":"Comparing Fission and Fusion Energy Density","steps":[
    {"text":"U-235 fission: 200 MeV/event. D-T fusion: 17.6 MeV/event. Compare energy per unit mass.","latex":"","isFinal":False},
    {"text":"Fission per kg U-235: ≈ 8.2×10¹³ J/kg","latex":"","isFinal":False},
    {"text":"Fusion per kg D+T (average A=2.5): N = 1000/(2.5×1.67×10⁻²⁷) = 2.4×10²⁹; E = 2.4×10²⁹ × 17.6×1.6×10⁻¹³ ≈ 6.7×10¹⁴ J/kg — ~8× more energy per kg than fission","latex":"E_{fusion/kg} \\approx 6.7\\times10^{14}\\text{ J/kg}\\quad(\\sim 8\\times\\text{fission})","isFinal":True}
  ]},
  {"title":"Radioactive Waste from Fission","steps":[
    {"text":"Explain why fission produces long-lived radioactive waste but fusion does not.","latex":"","isFinal":False},
    {"text":"Fission splits heavy nuclei into medium-mass daughter nuclei (e.g., Cs-137, Sr-90) with half-lives of years to thousands of years.","latex":"","isFinal":False},
    {"text":"D-T fusion produces He-4 (stable) and a neutron. Neutrons can activate reactor structures, but no long-lived high-level waste is produced directly. Fusion is fundamentally cleaner.","latex":"^2H + ^3H \\to ^4He + n\\quad\\text{(no long-lived waste)}","isFinal":True}
  ]},
  {"title":"Sun's Energy Source","steps":[
    {"text":"The Sun fuses about 6×10¹¹ kg of hydrogen per second into helium. Find the power output.","latex":"","isFinal":False},
    {"text":"About 0.7% of mass is converted to energy in pp chain","latex":"\\Delta m/s = 0.007 \\times 6\\times10^{11} = 4.2\\times10^9\\text{ kg/s}","isFinal":False},
    {"text":"Power = (Δm/s) × c²","latex":"P = 4.2\\times10^9 \\times (3\\times10^8)^2 = 3.78\\times10^{26}\\text{ W}\\approx L_{\\odot}\\checkmark","isFinal":True}
  ]},
  {"title":"Enrichment of Uranium","steps":[
    {"text":"Natural uranium is 0.72% U-235. Reactor fuel needs ~3%. By what factor must U-235 be enriched?","latex":"","isFinal":False},
    {"text":"Enrichment factor","latex":"\\frac{3\\%}{0.72\\%} \\approx 4.2\\times\\text{ enrichment}","isFinal":False},
    {"text":"Weapons-grade requires >90% enrichment — 125× enrichment factor (achieved via gas centrifuges).","latex":"\\text{Weapons-grade: } \\frac{90}{0.72} = 125\\times", "isFinal":True}
  ]}
],

"standard-model": [
  {"title":"Quarks in a Proton","steps":[
    {"text":"What are the quark content and charges of a proton?","latex":"","isFinal":False},
    {"text":"Proton = uud (two up quarks, one down quark)","latex":"","isFinal":False},
    {"text":"Charges: up quarks = +2/3 each, down quark = −1/3","latex":"q_p = +\\frac{2}{3} + \\frac{2}{3} - \\frac{1}{3} = +1e\\checkmark","isFinal":True}
  ]},
  {"title":"Quarks in a Neutron","steps":[
    {"text":"What are the quark content and charge of a neutron?","latex":"","isFinal":False},
    {"text":"Neutron = udd (one up, two down)","latex":"","isFinal":False},
    {"text":"","latex":"q_n = +\\frac{2}{3} - \\frac{1}{3} - \\frac{1}{3} = 0\\checkmark","isFinal":True}
  ]},
  {"title":"Fundamental Forces — Carrier Bosons","steps":[
    {"text":"List the four fundamental forces and their force-carrying bosons.","latex":"","isFinal":False},
    {"text":"Strong nuclear: gluons. Electromagnetic: photons. Weak nuclear: W±, Z⁰ bosons.","latex":"","isFinal":False},
    {"text":"Gravity: graviton (hypothetical, not yet discovered). Only first three are in the Standard Model.","latex":"F_{strong}: g;\\quad F_{EM}: \\gamma;\\quad F_{weak}: W^{\\pm}, Z^0", "isFinal":True}
  ]},
  {"title":"Lepton Number Conservation","steps":[
    {"text":"In beta-minus decay: n → p + e⁻ + X. What is X? Verify lepton number conservation.","latex":"","isFinal":False},
    {"text":"Lepton number before = 0 (n and p are not leptons). After: e⁻ has L = +1, so X must have L = −1.","latex":"L_{before} = 0,\\quad L_{after} = +1 + L_X = 0 \\Rightarrow L_X = -1", "isFinal":False},
    {"text":"X is the electron antineutrino: n → p + e⁻ + ν̄_e","latex":"n \\to p + e^- + \\bar{\\nu}_e","isFinal":True}
  ]},
  {"title":"Antiparticles","steps":[
    {"text":"What is the antiparticle of the electron? How do they differ and what happens when they meet?","latex":"","isFinal":False},
    {"text":"Antielectron = positron (e⁺). Same mass as electron but opposite charge (+e) and opposite lepton number.","latex":"","isFinal":False},
    {"text":"Electron + positron → annihilate → 2 photons (pair annihilation). Energy = 2m_e c² = 1.022 MeV.","latex":"e^- + e^+ \\to 2\\gamma\\quad(E = 2m_e c^2 = 1.022\\text{ MeV total})", "isFinal":True}
  ]},
  {"title":"Higgs Boson Role","steps":[
    {"text":"What is the role of the Higgs boson in the Standard Model?","latex":"","isFinal":False},
    {"text":"The Higgs field permeates all space. Particles that interact with this field acquire mass (rest mass proportional to coupling strength).","latex":"","isFinal":False},
    {"text":"The Higgs boson is the quantum excitation of this field, discovered at the LHC in 2012 at ~125 GeV/c². Photons and gluons don't interact with the Higgs field → they are massless.","latex":"m \\propto g_H\\text{ (Higgs coupling)}","isFinal":True}
  ]},
  {"title":"Baryon Number Conservation","steps":[
    {"text":"In the reaction p + p → p + p + p + p̄, verify baryon number conservation.","latex":"","isFinal":False},
    {"text":"Baryon number: p = +1, p̄ = −1","latex":"B_{before} = 1 + 1 = 2", "isFinal":False},
    {"text":"","latex":"B_{after} = 1 + 1 + 1 + (-1) = 2\\checkmark", "isFinal":True}
  ]},
  {"title":"Quark Confinement","steps":[
    {"text":"Why can quarks never be observed in isolation?","latex":"","isFinal":False},
    {"text":"The strong force (mediated by gluons) increases with distance — unlike gravity or electrostatics which decrease.","latex":"F_{strong} \\approx \\text{constant as } r\\to\\infty", "isFinal":False},
    {"text":"As quarks are pulled apart, the energy stored in the colour field grows until a quark-antiquark pair is created from the vacuum. Free quarks are never observed — only colour-neutral hadrons.","latex":"","isFinal":True}
  ]},
  {"title":"Generations of Particles","steps":[
    {"text":"The Standard Model has three generations. List the fermions of the first generation.","latex":"","isFinal":False},
    {"text":"Quarks: up (u), down (d). Leptons: electron (e⁻), electron neutrino (ν_e).","latex":"\\text{Gen 1: }u, d, e^-, \\nu_e\\text{ (and their antiparticles)}", "isFinal":False},
    {"text":"Generations 2 and 3 are heavier copies: (c,s,μ,ν_μ) and (t,b,τ,ν_τ). Ordinary matter is built from Generation 1 only.","latex":"","isFinal":True}
  ]},
  {"title":"W Boson in Beta Decay","steps":[
    {"text":"Describe the W boson's role in beta-minus decay.","latex":"","isFinal":False},
    {"text":"In beta decay, a down quark changes to an up quark by emitting a virtual W⁻ boson.","latex":"d \\to u + W^-","isFinal":False},
    {"text":"The W⁻ then decays to an electron and electron antineutrino. This is why the weak force has a short range — W bosons are massive (80 GeV/c²).","latex":"W^- \\to e^- + \\bar{\\nu}_e","isFinal":True}
  ]}
],

"semiconductors": [
  {"title":"Intrinsic vs Extrinsic Semiconductors","steps":[
    {"text":"Explain the difference between intrinsic and extrinsic (doped) semiconductors.","latex":"","isFinal":False},
    {"text":"Intrinsic: pure semiconductor (e.g., Si). At room temperature, some electrons thermally excited to conduction band, leaving holes. Carrier concentration low.","latex":"n_i = \\sqrt{N_c N_v}\\,e^{-E_g/2k_BT}", "isFinal":False},
    {"text":"Extrinsic: doped with donor (n-type, extra electrons) or acceptor (p-type, extra holes). Carrier concentration much higher → greater conductivity.","latex":"","isFinal":True}
  ]},
  {"title":"Band Gap Energy","steps":[
    {"text":"Silicon has band gap E_g = 1.12 eV. Find the maximum wavelength of light that can excite an electron across the gap.","latex":"","isFinal":False},
    {"text":"λ_max = hc/E_g = 1240 eV·nm / 1.12 eV","latex":"\\lambda_{max} = \\frac{1240}{1.12} \\approx 1107\\text{ nm (near-infrared)}","isFinal":True}
  ]},
  {"title":"n-type Doping","steps":[
    {"text":"Silicon is doped with phosphorus (donor density N_D = 10¹⁶ cm⁻³). Find majority carrier concentration (assume complete ionisation).","latex":"","isFinal":False},
    {"text":"For n-type: n ≈ N_D (majority electrons = donor density)","latex":"n \\approx N_D = 10^{16}\\text{ cm}^{-3}", "isFinal":False},
    {"text":"Minority carriers (holes): p = n_i²/n. For Si at 300 K, n_i ≈ 1.5×10¹⁰ cm⁻³","latex":"p = \\frac{(1.5\\times10^{10})^2}{10^{16}} = 2.25\\times10^4\\text{ cm}^{-3}\\text{ (very few holes)}", "isFinal":True}
  ]},
  {"title":"Resistivity of a Semiconductor","steps":[
    {"text":"A silicon sample (n = 10¹⁶ cm⁻³, μ_e = 1400 cm²/V·s, μ_h ≈ 0). Find resistivity.","latex":"","isFinal":False},
    {"text":"σ = q n μ_e (n-type, neglect holes)","latex":"\\sigma = 1.6\\times10^{-19} \\times 10^{16}\\times10^6 \\times 0.14 = 1.6\\times10^{-19} \\times 10^{22} \\times 0.14 = 0.224\\text{ S/m}", "isFinal":False},
    {"text":"ρ = 1/σ = 4.46 Ω·m (much higher than metals ~10⁻⁷ Ω·m)","latex":"\\rho = \\frac{1}{0.224} \\approx 4.46\\text{ Ω·m}", "isFinal":True}
  ]},
  {"title":"Temperature Effect on Semiconductor","steps":[
    {"text":"Explain why semiconductor resistance decreases with temperature (opposite to metals).","latex":"","isFinal":False},
    {"text":"In metals: carrier density constant, but scattering increases with T → resistance increases.","latex":"","isFinal":False},
    {"text":"In semiconductors: carrier density increases exponentially with T (more thermal excitations across band gap) → conductivity increases despite more scattering.","latex":"n_i \\propto e^{-E_g/2k_BT}\\text{ (exponential increase with T)}","isFinal":True}
  ]},
  {"title":"Fermi Level in n-type","steps":[
    {"text":"Describe where the Fermi level lies in an n-type semiconductor compared to intrinsic.","latex":"","isFinal":False},
    {"text":"In intrinsic Si: Fermi level near mid-gap.","latex":"E_F \\approx E_i\\text{ (mid-gap)}", "isFinal":False},
    {"text":"In n-type: Fermi level shifts toward conduction band (more electrons available). Heavier doping → E_F closer to conduction band edge.","latex":"E_F^{n-type} > E_i\\text{ (closer to conduction band)}", "isFinal":True}
  ]},
  {"title":"Photovoltaic Effect","steps":[
    {"text":"A silicon solar cell (E_g = 1.12 eV) is illuminated. Photons of what minimum energy can generate electron-hole pairs?","latex":"","isFinal":False},
    {"text":"Photon energy must exceed the band gap","latex":"E_{photon} \\geq E_g = 1.12\\text{ eV}", "isFinal":False},
    {"text":"Corresponding maximum wavelength λ = 1107 nm. Photons with λ < 1107 nm (visible and UV) generate carriers; longer-wavelength IR photons do not.","latex":"\\lambda < 1107\\text{ nm}\\Rightarrow\\text{ electron-hole pair generated}", "isFinal":True}
  ]},
  {"title":"Drift vs Diffusion Current","steps":[
    {"text":"Explain drift and diffusion currents in a semiconductor.","latex":"","isFinal":False},
    {"text":"Drift: carriers move under applied electric field E. J_drift = σE = q(nμ_e + pμ_h)E","latex":"J_{drift} = q(n\\mu_e + p\\mu_h)E", "isFinal":False},
    {"text":"Diffusion: carriers move from high to low concentration. J_diff = qD(dn/dx). At equilibrium these balance → no net current.","latex":"J_{diff} = qD_n\\frac{dn}{dx}\\text{ (electrons, opposite for holes)}", "isFinal":True}
  ]},
  {"title":"LED Emission Wavelength","steps":[
    {"text":"A GaAs LED has band gap E_g = 1.42 eV. Find the emitted photon wavelength.","latex":"","isFinal":False},
    {"text":"Photon energy ≈ E_g for direct band gap semiconductor","latex":"\\lambda = \\frac{hc}{E_g} = \\frac{1240}{1.42} \\approx 873\\text{ nm (near-infrared)}","isFinal":True}
  ]},
  {"title":"Hall Effect — Carrier Type","steps":[
    {"text":"A semiconductor in B = 0.3 T has current in +x direction. Measured Hall voltage is positive on the +y face. Identify carrier type.","latex":"","isFinal":False},
    {"text":"Positive Hall voltage on +y face means positive carriers accumulate there.","latex":"","isFinal":False},
    {"text":"Using F = qv × B: current in +x, B in +z, force on positive carriers is in −y → they accumulate on −y face → voltage positive on −y. Here it's positive on +y → NEGATIVE carriers (electrons) → n-type material.","latex":"V_H > 0\\text{ on +y} \\Rightarrow \\text{n-type (electrons)}","isFinal":True}
  ]}
],

"pn-junction": [
  {"title":"Built-in Potential","steps":[
    {"text":"Describe the formation of the depletion region in a p-n junction.","latex":"","isFinal":False},
    {"text":"Electrons diffuse from n to p; holes diffuse from p to n → recombine near junction → ionised donors/acceptors left behind → electric field (built-in potential V_bi).","latex":"","isFinal":False},
    {"text":"This field opposes further diffusion until equilibrium: drift current = diffusion current. V_bi ≈ 0.6–0.7 V for silicon.","latex":"V_{bi} = \\frac{k_BT}{q}\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)", "isFinal":True}
  ]},
  {"title":"Forward Bias — Diode Current","steps":[
    {"text":"A silicon diode (I_0 = 10⁻¹⁰ A) is forward-biased at V = 0.65 V (T = 300 K). Find the current.","latex":"","isFinal":False},
    {"text":"Shockley equation: I = I₀(e^{qV/kT} − 1). kT/q = 0.0259 V at 300 K","latex":"I = 10^{-10}(e^{0.65/0.0259} - 1) = 10^{-10} \\times e^{25.1}", "isFinal":False},
    {"text":"e^{25.1} ≈ 7.9×10¹⁰","latex":"I \\approx 10^{-10} \\times 7.9\\times10^{10} = 7.9\\text{ A}", "isFinal":True}
  ]},
  {"title":"Reverse Bias","steps":[
    {"text":"The same diode (I₀ = 10⁻¹⁰ A) is reverse-biased at V = −5 V. Find the current.","latex":"","isFinal":False},
    {"text":"For large reverse bias, e^{qV/kT} ≈ 0","latex":"I = I_0(e^{qV/kT} - 1) \\approx I_0(0 - 1) = -I_0 = -10^{-10}\\text{ A}", "isFinal":False},
    {"text":"Only the tiny leakage current I₀ = 10⁻¹⁰ A = 0.1 nA flows (reverse saturation current).","latex":"", "isFinal":True}
  ]},
  {"title":"Zener Breakdown","steps":[
    {"text":"A Zener diode has V_Z = 5.1 V and is reverse-biased at 6 V through R = 100 Ω. Find the current.","latex":"","isFinal":False},
    {"text":"Once breakdown occurs, diode voltage clamps at 5.1 V","latex":"V_R = 6 - 5.1 = 0.9\\text{ V}", "isFinal":False},
    {"text":"Current through resistor","latex":"I = \\frac{V_R}{R} = \\frac{0.9}{100} = 9\\text{ mA}", "isFinal":True}
  ]},
  {"title":"Diode Rectifier — Half-Wave","steps":[
    {"text":"A half-wave rectifier with peak AC voltage 170 V (V_rms ≈ 120 V). Find average DC output voltage. (V_d = 0.7 V diode drop)","latex":"","isFinal":False},
    {"text":"Half-wave rectifier average output (ideal): V_avg = V_peak/π","latex":"V_{avg} = \\frac{170 - 0.7}{\\pi} \\approx \\frac{169.3}{3.14} \\approx 53.9\\text{ V}", "isFinal":True}
  ]},
  {"title":"LED Forward Voltage","steps":[
    {"text":"A green LED (λ = 520 nm) emits photons. Estimate the minimum forward voltage.","latex":"","isFinal":False},
    {"text":"Photon energy E = hc/λ = 1240/520 = 2.38 eV","latex":"E = 2.38\\text{ eV}", "isFinal":False},
    {"text":"Minimum forward voltage ≈ E_g/e ≈ E_photon/e = 2.38 V (the energy gap drives the photon emission)","latex":"V_{forward} \\approx \\frac{E_g}{e} \\approx 2.38\\text{ V}", "isFinal":True}
  ]},
  {"title":"Depletion Width","steps":[
    {"text":"Explain qualitatively how reverse bias increases depletion width.","latex":"","isFinal":False},
    {"text":"Reverse bias widens the depletion region: the applied voltage adds to V_bi, sweeping more majority carriers away from the junction.","latex":"W \\propto \\sqrt{V_{bi} + V_{reverse}}", "isFinal":False},
    {"text":"Wider depletion → higher capacitance change with voltage → basis of varactor (variable capacitor) diodes.","latex":"C_j = \\frac{\\varepsilon A}{W} \\propto \\frac{1}{\\sqrt{V_{bi}+V_R}}", "isFinal":True}
  ]},
  {"title":"Solar Cell I-V Curve","steps":[
    {"text":"A solar cell has I_sc = 5 A (short-circuit current) and V_oc = 0.6 V (open-circuit voltage). Find maximum power output (fill factor = 0.75).","latex":"","isFinal":False},
    {"text":"Maximum power P_max = FF × I_sc × V_oc","latex":"P_{max} = 0.75 \\times 5 \\times 0.6 = 2.25\\text{ W}", "isFinal":True}
  ]},
  {"title":"Schottky Diode","steps":[
    {"text":"Compare a Schottky diode to a regular p-n junction diode.","latex":"","isFinal":False},
    {"text":"Schottky: metal-semiconductor junction. Forward voltage ~0.2–0.4 V (lower than Si p-n ~0.6–0.7 V) → less power loss. No minority carrier storage → faster switching.","latex":"V_{Schottky} \\approx 0.2-0.4\\text{ V vs }0.6-0.7\\text{ V for Si p-n}", "isFinal":False},
    {"text":"Used in high-speed circuits, RF, switching power supplies. Disadvantage: higher leakage current.","latex":"","isFinal":True}
  ]},
  {"title":"Tunnelling Diode","steps":[
    {"text":"In a tunnel diode, current decreases as forward voltage increases initially. Explain using quantum mechanics.","latex":"","isFinal":False},
    {"text":"At low forward voltage, electrons quantum-tunnel through the thin depletion barrier → high current. As V increases, energy band alignment changes — fewer states to tunnel into.","latex":"", "isFinal":False},
    {"text":"This produces a negative differential resistance region — useful for oscillators and high-speed switching.","latex":"\\frac{dI}{dV} < 0\\text{ (negative resistance region)}", "isFinal":True}
  ]}
],

"transistors": [
  {"title":"BJT Current Gain (β)","steps":[
    {"text":"A BJT has I_C = 4.8 mA and I_B = 60 μA. Find β (h_FE).","latex":"","isFinal":False},
    {"text":"β = I_C / I_B","latex":"\\beta = \\frac{4.8\\text{ mA}}{60\\text{ μA}} = \\frac{4.8\\times10^{-3}}{6\\times10^{-5}} = 80","isFinal":True}
  ]},
  {"title":"Finding Collector Current","steps":[
    {"text":"A BJT (β = 150) has I_B = 20 μA. Find I_C and I_E.","latex":"","isFinal":False},
    {"text":"I_C = β × I_B","latex":"I_C = 150 \\times 20\\times10^{-6} = 3\\text{ mA}", "isFinal":False},
    {"text":"I_E = I_C + I_B","latex":"I_E = 3 + 0.02 = 3.02\\text{ mA}", "isFinal":True}
  ]},
  {"title":"BJT Switch — Saturation","steps":[
    {"text":"A BJT switch (β = 100, V_CC = 5 V, R_C = 1 kΩ, V_CE(sat) = 0.2 V). Find the base current needed to saturate it.","latex":"","isFinal":False},
    {"text":"At saturation: I_C(sat) = (V_CC − V_CE(sat))/R_C","latex":"I_C = \\frac{5 - 0.2}{1000} = 4.8\\text{ mA}", "isFinal":False},
    {"text":"Minimum base current: I_B ≥ I_C/β = 4.8/100 = 48 μA","latex":"I_B \\geq \\frac{I_C}{\\beta} = 48\\text{ μA}", "isFinal":True}
  ]},
  {"title":"MOSFET Threshold Voltage","steps":[
    {"text":"An n-channel MOSFET has V_T = 2 V. It is biased at V_GS = 4 V, V_DS = 5 V. Is it in saturation or linear region?","latex":"","isFinal":False},
    {"text":"Check saturation condition: V_DS ≥ V_GS − V_T","latex":"V_{GS} - V_T = 4 - 2 = 2\\text{ V}", "isFinal":False},
    {"text":"V_DS = 5 V > 2 V → device is in saturation (active) region → acts as current source.","latex":"V_{DS} = 5 > V_{GS} - V_T = 2 \\Rightarrow\\text{saturation}", "isFinal":True}
  ]},
  {"title":"MOSFET Drain Current","steps":[
    {"text":"An n-MOSFET (K = 2 mA/V², V_T = 1.5 V) with V_GS = 4 V in saturation. Find I_D.","latex":"","isFinal":False},
    {"text":"I_D = (K/2)(V_GS − V_T)²","latex":"I_D = \\frac{2\\times10^{-3}}{2}(4 - 1.5)^2 = 10^{-3} \\times 6.25 = 6.25\\text{ mA}", "isFinal":True}
  ]},
  {"title":"Common-Emitter Amplifier Gain","steps":[
    {"text":"A CE amplifier has R_C = 4.7 kΩ, r_e = 25 mV/I_C = 25/2 mA = 12.5 Ω (I_C = 2 mA). Find voltage gain.","latex":"","isFinal":False},
    {"text":"A_v = −R_C / r_e","latex":"A_v = -\\frac{4700}{12.5} = -376\\text{ (inverting, gain of 376)}", "isFinal":True}
  ]},
  {"title":"Transistor as Digital NOT Gate","steps":[
    {"text":"An NPN BJT (β = 100) is configured as an inverter (NOT gate). V_CC = 5 V, R_C = 1 kΩ, R_B = 47 kΩ. Input = 5 V. Find V_out.","latex":"","isFinal":False},
    {"text":"I_B = (V_in − V_BE)/R_B = (5 − 0.7)/47000 = 91.5 μA","latex":"I_B = 91.5\\text{ μA}", "isFinal":False},
    {"text":"I_C = βI_B = 9.15 mA; but I_C(sat) = 5/1000 = 5 mA → saturated. V_out = V_CE(sat) ≈ 0.2 V ≈ logic LOW.","latex":"V_{out} \\approx 0.2\\text{ V (logic 0)} \\checkmark", "isFinal":True}
  ]},
  {"title":"FET vs BJT","steps":[
    {"text":"Compare FETs and BJTs in terms of control, input impedance, and application.","latex":"","isFinal":False},
    {"text":"BJT: current-controlled (I_B controls I_C), lower input impedance (~kΩ). Good for analog amplifiers.","latex":"\\text{BJT: }I_C = \\beta I_B", "isFinal":False},
    {"text":"FET (MOSFET): voltage-controlled (V_GS controls I_D), very high input impedance (~GΩ) since gate is insulated. Dominant in digital ICs (CMOS logic), low power.","latex":"\\text{MOSFET: }I_D = f(V_{GS}),\\quad Z_{in} \\sim G\\Omega", "isFinal":True}
  ]},
  {"title":"Darlington Pair","steps":[
    {"text":"Two identical BJTs (β = 100 each) are connected as a Darlington pair. Find the composite β.","latex":"","isFinal":False},
    {"text":"Darlington pair: β_total ≈ β₁ × β₂","latex":"\\beta_{total} \\approx 100 \\times 100 = 10\\,000", "isFinal":False},
    {"text":"High current gain makes Darlington pairs ideal for driving large currents from small control signals (e.g., motor drivers, relay switches).","latex":"","isFinal":True}
  ]},
  {"title":"CMOS Inverter","steps":[
    {"text":"In a CMOS inverter, one n-MOSFET and one p-MOSFET are used. Explain operation.","latex":"","isFinal":False},
    {"text":"Input HIGH (V_DD): n-MOSFET turns ON, p-MOSFET turns OFF → output connected to ground → LOW.","latex":"V_{in} = V_{DD} \\Rightarrow V_{out} = 0", "isFinal":False},
    {"text":"Input LOW (0V): n-MOSFET turns OFF, p-MOSFET turns ON → output connected to V_DD → HIGH. CMOS draws near-zero static power.","latex":"V_{in} = 0 \\Rightarrow V_{out} = V_{DD}", "isFinal":True}
  ]}
],

"modulation": [
  {"title":"AM Modulation — Carrier and Sidebands","steps":[
    {"text":"An AM carrier (f_c = 1 MHz) is modulated by a 5 kHz audio signal. Find the sideband frequencies.","latex":"","isFinal":False},
    {"text":"AM sidebands: f_c ± f_m","latex":"f_{USB} = 1000 + 5 = 1005\\text{ kHz};\\quad f_{LSB} = 1000 - 5 = 995\\text{ kHz}", "isFinal":True}
  ]},
  {"title":"AM Modulation Index","steps":[
    {"text":"An AM signal has carrier amplitude V_c = 10 V and message amplitude V_m = 4 V. Find the modulation index m.","latex":"","isFinal":False},
    {"text":"m = V_m/V_c","latex":"m = \\frac{4}{10} = 0.4\\text{ (40% modulation)}", "isFinal":True}
  ]},
  {"title":"AM Bandwidth","steps":[
    {"text":"A voice signal with bandwidth 3.4 kHz is used for AM. Find the total transmission bandwidth.","latex":"","isFinal":False},
    {"text":"AM bandwidth = 2 × f_message(max)","latex":"BW = 2 \\times 3.4 = 6.8\\text{ kHz}", "isFinal":True}
  ]},
  {"title":"FM Frequency Deviation","steps":[
    {"text":"An FM transmitter (carrier 100 MHz) has a 75 kHz frequency deviation for a 15 kHz audio signal. Find the modulation index β.","latex":"","isFinal":False},
    {"text":"β = Δf/f_m","latex":"\\beta = \\frac{75\\text{ kHz}}{15\\text{ kHz}} = 5", "isFinal":True}
  ]},
  {"title":"FM Bandwidth (Carson's Rule)","steps":[
    {"text":"FM: β = 5, message bandwidth f_m = 15 kHz. Find approximate transmission bandwidth.","latex":"","isFinal":False},
    {"text":"Carson's Rule: BW ≈ 2(β + 1) × f_m","latex":"BW = 2(5 + 1) \\times 15 = 2 \\times 6 \\times 15 = 180\\text{ kHz}", "isFinal":True}
  ]},
  {"title":"AM vs FM SNR","steps":[
    {"text":"Compare AM and FM in terms of noise immunity.","latex":"","isFinal":False},
    {"text":"AM: information in amplitude → amplitude noise (electrical interference) directly affects signal → poor SNR.","latex":"", "isFinal":False},
    {"text":"FM: information in frequency deviation → amplitude noise mostly ignored by FM receiver (limiter stage) → FM has ~20 dB better SNR above threshold. FM is preferred for high-quality audio.","latex":"SNR_{FM} \\approx 3\\beta^2(\\beta+1)\\cdot SNR_{AM}\\text{ (for wideband FM)}", "isFinal":True}
  ]},
  {"title":"PCM — Sampling Rate","steps":[
    {"text":"Audio with bandwidth 4 kHz is PCM-encoded. Find the minimum sampling rate (Nyquist theorem).","latex":"","isFinal":False},
    {"text":"Nyquist: f_s ≥ 2 × f_max","latex":"f_s \\geq 2 \\times 4000 = 8000\\text{ Hz} = 8\\text{ kSa/s}", "isFinal":True}
  ]},
  {"title":"Digital Bit Rate","steps":[
    {"text":"PCM audio: 8-bit samples at 8 kSa/s. Find the bit rate.","latex":"","isFinal":False},
    {"text":"Bit rate = samples/s × bits/sample","latex":"R = 8000 \\times 8 = 64\\,000\\text{ bps} = 64\\text{ kbps}", "isFinal":True}
  ]},
  {"title":"Quadrature Amplitude Modulation","steps":[
    {"text":"16-QAM encodes how many bits per symbol? What is the bandwidth efficiency compared to BPSK?","latex":"","isFinal":False},
    {"text":"16-QAM: 16 constellation points → log₂(16) = 4 bits per symbol","latex":"\\text{Bits/symbol} = \\log_2(16) = 4", "isFinal":False},
    {"text":"BPSK: 1 bit/symbol. 16-QAM is 4× more bandwidth-efficient (uses same bandwidth to carry 4× data).","latex":"\\eta_{16-QAM} = 4\\text{ bps/Hz vs }1\\text{ bps/Hz for BPSK}", "isFinal":True}
  ]},
  {"title":"Signal-to-Noise Ratio","steps":[
    {"text":"A receiver has signal power S = 10⁻⁶ W and noise power N = 10⁻⁹ W. Find SNR in dB.","latex":"","isFinal":False},
    {"text":"SNR = S/N = 10⁻⁶/10⁻⁹ = 1000","latex":"SNR = 1000", "isFinal":False},
    {"text":"SNR in dB","latex":"SNR_{dB} = 10\\log_{10}(1000) = 10 \\times 3 = 30\\text{ dB}", "isFinal":True}
  ]}
],

"wave-propagation": [
  {"title":"Ground Wave vs Sky Wave","steps":[
    {"text":"Explain ground wave and sky wave propagation.","latex":"","isFinal":False},
    {"text":"Ground wave: radio waves follow Earth's curvature by diffraction. Used by AM broadcasts (LF/MF), reliable up to ~1000 km.","latex":"", "isFinal":False},
    {"text":"Sky wave: HF (3–30 MHz) reflects off the ionosphere → can reach beyond the horizon, 100s–1000s km. Affected by ionospheric conditions (day/night, solar activity).","latex":"", "isFinal":True}
  ]},
  {"title":"Critical Frequency","steps":[
    {"text":"The ionosphere has electron density n_e = 3×10¹¹ m⁻³. Find the critical frequency f_c for vertical incidence reflection.","latex":"","isFinal":False},
    {"text":"f_c = (1/2π)√(n_e e²/ε₀ m_e) ≈ 9√(n_e) (in practical formula with n_e in m⁻³)","latex":"f_c = 9\\sqrt{n_e} = 9\\sqrt{3\\times10^{11}} = 9 \\times 5.477\\times10^5 = 4.93\\text{ MHz}", "isFinal":True}
  ]},
  {"title":"Maximum Usable Frequency","steps":[
    {"text":"The critical frequency is 5 MHz and the angle of incidence is 70°. Find the MUF.","latex":"","isFinal":False},
    {"text":"MUF = f_c / cos(θ_i)","latex":"MUF = \\frac{5}{\\cos 70°} = \\frac{5}{0.342} = 14.6\\text{ MHz}", "isFinal":True}
  ]},
  {"title":"Skip Distance","steps":[
    {"text":"Explain skip distance and why there is a dead zone between ground wave and sky wave coverage.","latex":"","isFinal":False},
    {"text":"Ground wave attenuates within ~1000 km. Sky wave returns to Earth beyond the skip distance (~typically 100–3000 km).","latex":"", "isFinal":False},
    {"text":"In between these zones — the 'dead zone' or 'skip zone' — neither ground wave nor sky wave reaches → no reception.","latex":"\\text{Dead zone} = \\text{skip distance} - \\text{ground wave range}", "isFinal":True}
  ]},
  {"title":"Line of Sight Range","steps":[
    {"text":"A VHF antenna is 100 m above ground. Find the line-of-sight range. (R_Earth = 6400 km)","latex":"","isFinal":False},
    {"text":"d = √(2Rh) for small h","latex":"d = \\sqrt{2 \\times 6400\\times10^3 \\times 100} = \\sqrt{1.28\\times10^9} = 35\\,778\\text{ m} \\approx 35.8\\text{ km}", "isFinal":True}
  ]},
  {"title":"Attenuation in dB","steps":[
    {"text":"A signal reduces from 1 W to 1 mW over a distance. Find the attenuation in dB.","latex":"","isFinal":False},
    {"text":"Attenuation = 10 log(P_out/P_in)","latex":"A = 10\\log\\!\\left(\\frac{10^{-3}}{1}\\right) = 10 \\times (-3) = -30\\text{ dB}", "isFinal":True}
  ]},
  {"title":"Satellite Communication — Uplink/Downlink","steps":[
    {"text":"A geostationary satellite is at 36 000 km altitude. Find the propagation delay for uplink + downlink.","latex":"","isFinal":False},
    {"text":"One-way delay = d/c = 36000 km / (3×10⁵ km/s)","latex":"t_{one-way} = \\frac{3.6\\times10^7}{3\\times10^8} = 0.12\\text{ s}", "isFinal":False},
    {"text":"Round-trip delay = 2 × 0.12 = 0.24 s (noticeable in voice calls — basis for satellite phone delay)","latex":"t_{RT} = 2 \\times 0.12 = 0.24\\text{ s}", "isFinal":True}
  ]},
  {"title":"Doppler Shift for Moving Satellite","steps":[
    {"text":"A LEO satellite moves at 7800 m/s toward a ground station transmitting at 1 GHz. Find the Doppler-shifted frequency.","latex":"","isFinal":False},
    {"text":"f' = f × (c + v)/c (approaching)","latex":"f' = 10^9 \\times \\frac{3\\times10^8 + 7800}{3\\times10^8} = 10^9 \\times (1 + 2.6\\times10^{-5}) \\approx 1.000026\\times10^9\\text{ Hz}", "isFinal":False},
    {"text":"Shift = 26 000 Hz = 26 kHz (must be tracked by receiver)","latex":"\\Delta f = 26\\text{ kHz}", "isFinal":True}
  ]},
  {"title":"Optical Fibre Bandwidth","steps":[
    {"text":"An optical fibre has bandwidth 50 GHz and uses 8 wavelength channels (WDM). Find total capacity.","latex":"","isFinal":False},
    {"text":"Total capacity = bandwidth per channel × number of channels","latex":"C_{total} = 50\\text{ GHz} \\times 8 = 400\\text{ GHz bandwidth}", "isFinal":False},
    {"text":"Using 100 Gbps per channel: total data rate = 800 Gbps = 0.8 Tbps","latex":"R_{total} = 8 \\times 100\\text{ Gbps} = 800\\text{ Gbps}", "isFinal":True}
  ]},
  {"title":"Free-Space Path Loss","steps":[
    {"text":"A 2.4 GHz Wi-Fi signal travels 20 m. Find the free-space path loss.","latex":"","isFinal":False},
    {"text":"FSPL = (4πd/λ)²; λ = c/f = 0.125 m","latex":"FSPL = \\left(\\frac{4\\pi \\times 20}{0.125}\\right)^2 = (2011)^2 = 4.04\\times10^6", "isFinal":False},
    {"text":"FSPL in dB = 10 log(4.04×10⁶) = 66.1 dB","latex":"FSPL_{dB} = 10\\log(4.04\\times10^6) \\approx 66.1\\text{ dB}", "isFinal":True}
  ]}
],

"digital-communication": [
  {"title":"Binary to Decimal","steps":[
    {"text":"Convert the 8-bit binary number 11010110 to decimal.","latex":"","isFinal":False},
    {"text":"Position values (128, 64, 32, 16, 8, 4, 2, 1) × bit value","latex":"1(128)+1(64)+0(32)+1(16)+0(8)+1(4)+1(2)+0(1)", "isFinal":False},
    {"text":"","latex":"= 128+64+16+4+2 = 214_{10}", "isFinal":True}
  ]},
  {"title":"Decimal to Binary","steps":[
    {"text":"Convert 173 to binary.","latex":"","isFinal":False},
    {"text":"Repeated division by 2: 173÷2=86r1, 86÷2=43r0, 43÷2=21r1, 21÷2=10r1, 10÷2=5r0, 5÷2=2r1, 2÷2=1r0, 1÷2=0r1","latex":"", "isFinal":False},
    {"text":"Read remainders from bottom up","latex":"173_{10} = 10101101_2", "isFinal":True}
  ]},
  {"title":"Nyquist Sampling Theorem","steps":[
    {"text":"A signal has maximum frequency 20 kHz (CD audio). Find the minimum sampling frequency.","latex":"","isFinal":False},
    {"text":"Nyquist theorem: f_s ≥ 2 f_max","latex":"f_s \\geq 2 \\times 20000 = 40\\,000\\text{ Hz} = 40\\text{ kSa/s}", "isFinal":False},
    {"text":"CDs use 44.1 kSa/s (slightly above Nyquist rate for margin).","latex":"f_s(CD) = 44.1\\text{ kSa/s} > 40\\text{ kSa/s}\\checkmark", "isFinal":True}
  ]},
  {"title":"Data Rate from Bandwidth — Shannon's Theorem","steps":[
    {"text":"A channel has bandwidth 3 kHz and SNR = 30 dB. Find the maximum data rate.","latex":"","isFinal":False},
    {"text":"SNR = 10^(30/10) = 1000; Shannon: C = B log₂(1 + SNR)","latex":"C = 3000 \\times \\log_2(1001) = 3000 \\times 9.97 \\approx 29.9\\text{ kbps}", "isFinal":True}
  ]},
  {"title":"Error Detection — Parity Bit","steps":[
    {"text":"Data byte: 1011010. Add an even parity bit and verify error detection.","latex":"","isFinal":False},
    {"text":"Count 1s: there are 4 ones (even). Even parity bit = 0 → transmitted word: 10110100","latex":"\\text{Transmitted: }10110100", "isFinal":False},
    {"text":"If one bit flips (e.g., → 10110110): now 5 ones — parity bit fails check → error detected.","latex":"\\text{One bit error: parity mismatch}\\Rightarrow\\text{error detected}", "isFinal":True}
  ]},
  {"title":"ASCII Encoding","steps":[
    {"text":"The letter 'A' has ASCII code 65. Convert to 8-bit binary.","latex":"","isFinal":False},
    {"text":"65 = 64 + 1 = 2⁶ + 2⁰","latex":"65_{10} = 01000001_2", "isFinal":True}
  ]},
  {"title":"Multiplexing — TDM","steps":[
    {"text":"Four 64 kbps channels are time-division multiplexed. Find the composite bit rate.","latex":"","isFinal":False},
    {"text":"TDM: composite rate = sum of individual rates","latex":"R_{total} = 4 \\times 64\\text{ kbps} = 256\\text{ kbps}", "isFinal":True}
  ]},
  {"title":"Bandwidth and Bit Rate Relationship","steps":[
    {"text":"Using BPSK (1 bit/symbol), what bandwidth is needed for 1 Mbps?","latex":"","isFinal":False},
    {"text":"Bandwidth = bit rate / spectral efficiency","latex":"BW = \\frac{1\\text{ Mbps}}{1\\text{ bps/Hz}} = 1\\text{ MHz}", "isFinal":False},
    {"text":"Using 16-QAM (4 bits/symbol): BW = 1 Mbps / 4 = 250 kHz (4× more efficient).","latex":"BW_{16-QAM} = \\frac{1\\text{ Mbps}}{4\\text{ bps/Hz}} = 250\\text{ kHz}", "isFinal":True}
  ]},
  {"title":"Optical Fibre vs Copper","steps":[
    {"text":"Compare optical fibre and copper cable for data transmission.","latex":"","isFinal":False},
    {"text":"Optical fibre: bandwidth ~THz (light), low attenuation (~0.2 dB/km), immune to EMI, lightweight. Disadvantage: costly connectors, fragile.","latex":"", "isFinal":False},
    {"text":"Copper cable: limited bandwidth (~GHz for Cat-8), higher attenuation (~10 dB/km), susceptible to interference. Cheaper, easier to connect. Fibre dominates long-distance; copper used for final metres.","latex":"f_{fibre} \\sim THz \\gg f_{copper} \\sim GHz", "isFinal":True}
  ]},
  {"title":"Bit Error Rate","steps":[
    {"text":"A channel transmits 10⁶ bits and 50 bit errors are detected. Find the bit error rate (BER).","latex":"","isFinal":False},
    {"text":"BER = number of errors / total bits transmitted","latex":"BER = \\frac{50}{10^6} = 5\\times10^{-5}", "isFinal":False},
    {"text":"This is 5 errors per 100 000 bits. Acceptable BER for voice is ~10⁻³; for data 10⁻⁹ is typical requirement.","latex":"BER = 5\\times10^{-5}\\text{ (needs forward error correction for data)}", "isFinal":True}
  ]}
]

}

for slug, exs in examples.items():
    if slug in data:
        data[slug]['workedExamples'] = exs
        print(f"{slug}: {len(exs)} examples")
    else:
        print(f"WARNING: slug '{slug}' not found")

p.write_text(json.dumps(data, indent=2, ensure_ascii=False))
print("Done. Validating...")
json.loads(p.read_text())
print("JSON valid.")
