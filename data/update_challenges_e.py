"""Update Challenge Lab descriptions — Batch E: topics 59-73"""
import json
from pathlib import Path

p = Path('topic-extras.json')
data = json.loads(p.read_text())

challenges = {
    "time-dilation": {
        "title": "GPS Satellite Clock Correction",
        "description": "GPS satellites orbit at 20,200 km altitude, moving at 3.87 km/s. c = 3 × 10⁸ m/s. (a) Find γ = 1/√(1 − v²/c²) for the satellite. (b) Use the binomial approximation γ ≈ 1 + ½(v/c)² to find how many microseconds per day the satellite clock runs fast relative to a ground clock (time gained ≈ ½(v/c)² × 86400 s). (c) GPS relies on timing accuracy of ~30 ns. How many metres of position error per microsecond of clock error (error in m = error in s × c)? (d) Would GPS work if relativistic corrections were not applied? Justify quantitatively.",
        "hint": "v/c = 3870/(3×10⁸) ≈ 1.29 × 10⁻⁵. For the binomial approximation: Δt ≈ ½(v/c)² × 86400 s. Convert to μs. Position error = 3×10⁸ m/s × time error in seconds. SR effect makes satellite clocks run slow (moving clocks slow down).",
        "xpBonus": 75
    },
    "length-contraction": {
        "title": "Proton in the LHC",
        "description": "A proton travels at v = 0.9999c in the LHC, which has circumference 27 km as measured in the lab. (a) Calculate the Lorentz factor γ = 1/√(1 − v²/c²). (b) Find the circumference as seen from the proton's rest frame. (c) Find the time for one revolution in the lab frame. (d) Find the proper time experienced by the proton per revolution (proper time = lab time / γ). (e) How many revolutions per second does the proton complete? Compare to the speed of light travel around the same path.",
        "hint": "γ = 1/√(1 − 0.9999²) — use calculator carefully. Length seen by proton = L_lab/γ. Lab revolution time = 27,000 m / (0.9999 × 3×10⁸ m/s). Proper time = t_lab/γ. For comparison: light time = 27,000/(3×10⁸) s.",
        "xpBonus": 75
    },
    "emc-squared": {
        "title": "Nuclear vs Chemical Energy Density",
        "description": "Each U-235 fission releases 200 MeV with a mass defect of ~0.215 u. 1 u = 1.66 × 10⁻²⁷ kg. (a) Convert 200 MeV to joules (1 MeV = 1.6 × 10⁻¹³ J). (b) Verify using E = mc² with the mass defect. (c) Calculate energy released per kg of U-235 fuel. (d) Burning coal releases ~3 × 10⁷ J/kg. Find how many kg of coal produce the same energy as 1 kg of U-235. (e) A nuclear power station outputs 1 GW. Find daily U-235 consumption in grams.",
        "hint": "Per atom: 200 MeV = 3.2 × 10⁻¹¹ J. Mass of one U-235 atom = 235 × 1.66 × 10⁻²⁷ kg. Energy per kg = (J per atom) / (kg per atom). For (e): mass consumed per second = Power / (energy per kg × efficiency) — assume 33% efficiency.",
        "xpBonus": 75
    },
    "photoelectric-effect": {
        "title": "Determining Planck's Constant",
        "description": "A student shines UV light of different frequencies onto a sodium surface (work function φ = 2.28 eV) and measures stopping potential V_s. Data: f = 6.0×10¹⁴ Hz → V_s = 0.20 V; f = 7.0×10¹⁴ Hz → V_s = 0.62 V; f = 8.0×10¹⁴ Hz → V_s = 1.04 V. (a) Use any two data points to find Planck's constant h (from eV_s = hf − φ). (b) Find the threshold frequency for sodium. (c) Find maximum speed of electrons at 8.0×10¹⁴ Hz. (d) What is the threshold wavelength? Would red light (λ = 700 nm) eject electrons from sodium?",
        "hint": "From two points: h = eΔV_s/Δf (the gradient of V_s vs f graph, multiplied by e). Threshold: hf₀ = φ, so f₀ = φ/h. KE_max = eV_s = ½m_e v². Check: f of red light vs threshold frequency.",
        "xpBonus": 75
    },
    "wave-particle-duality": {
        "title": "Electron Microscope Resolution",
        "description": "An electron microscope accelerates electrons through 100 kV. m_e = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C, h = 6.63×10⁻³⁴ J·s. (a) Find the kinetic energy gained (in joules) and the speed of the electrons. (b) Calculate the de Broglie wavelength λ = h/(m_e v). (c) Compare to visible light (λ ≈ 500 nm) — how much better is the theoretical resolution? (d) Give a real-world example of a structure this small that electron microscopes can image. (e) Why can't we use an optical microscope to image a single atom?",
        "hint": "KE = eV = ½mv² → v = √(2eV/m). λ = h/(mv). Resolution ≈ wavelength. Visible light cannot resolve features smaller than ~250 nm (half a wavelength). Electron λ at 100 kV ≈ 3.88 pm — can resolve individual atoms.",
        "xpBonus": 75
    },
    "energy-levels": {
        "title": "Laser Light from Energy Transitions",
        "description": "A helium-neon laser uses neon transitions. The red laser (λ = 632 nm) arises from an energy transition. h = 6.63×10⁻³⁴ J·s, c = 3×10⁸ m/s, 1 eV = 1.6×10⁻¹⁹ J. (a) Find the energy of the transition in joules and eV. (b) A HeNe laser outputs 5 mW of power — find the number of photons emitted per second. (c) The laser also produces infrared at λ = 3.39 μm. Find the energy transition in eV. (d) A green HeNe line has transition energy 2.28 eV — find its wavelength. (e) Why do lasers produce a single pure wavelength while hot objects emit a broad spectrum?",
        "hint": "E = hc/λ. Photons per second = Power / E_per_photon. For (e): lasers rely on stimulated emission between two specific energy levels — the emitted photon energy is fixed. Hot objects have atoms with many energy states, producing a continuous range.",
        "xpBonus": 75
    },
    "radioactive-decay": {
        "title": "Medical Radioactive Tracer",
        "description": "Technetium-99m has half-life T½ = 6.0 hours. A patient receives 800 MBq (megabecquerels). N_A = 6.02×10²³, molar mass ≈ 99 g/mol. (a) Find the decay constant λ in s⁻¹. (b) Find the activity after 24 hours and after 48 hours. (c) Find the initial number of Tc-99m atoms (use A = λN). (d) Calculate the initial mass of Tc-99m — comment on how remarkably small it is. (e) The scan must be done when activity exceeds 100 MBq. What is the latest time after injection to perform the scan?",
        "hint": "λ = ln(2)/T½ (convert T½ to seconds). A(t) = A₀ × (½)^(t/T½). N = A/λ. Mass = N × M/N_A. For (e): 100 = 800 × (½)^(t/6 hours) — solve for t.",
        "xpBonus": 75
    },
    "fission-fusion": {
        "title": "D-T Fusion Energy Analysis",
        "description": "Deuterium-Tritium fusion: ²H + ³H → ⁴He + n. Masses: ²H = 2.01410 u, ³H = 3.01605 u, ⁴He = 4.00260 u, n = 1.00867 u. 1 u = 931.5 MeV. (a) Calculate the mass defect in u. (b) Find energy released per reaction in MeV and joules. (c) Find energy released per kg of D-T fuel (equal masses of D and T, average molar mass ≈ 2.5 g/mol for each). (d) Compare energy density (J/kg) to U-235 fission (~8.2×10¹³ J/kg) and coal (~3×10⁷ J/kg). (e) A fusion reactor outputs 1 GW — find daily fuel consumption in grams.",
        "hint": "Δm = (m_D + m_T) − (m_He + m_n). E = Δm × 931.5 MeV. Per kg: reactions per kg = N_A/M_molar × 1000 (since 1 kg = 1000 g). For (e): assume 33% efficiency. Mass consumed = Power/(efficiency × energy per kg).",
        "xpBonus": 75
    },
    "standard-model": {
        "title": "Particle Decay Conservation Laws",
        "description": "Check whether each process is allowed by conservation of charge (Q), baryon number (B), and lepton number (L). Show all quantum numbers before and after: (a) n → p + e⁻ + ν̄_e (beta-minus decay). (b) p → e⁺ + γ (proton decaying to positron and photon). (c) μ⁻ → e⁻ + ν̄_e + ν_μ (muon decay). (d) π⁰ → γ + γ (neutral pion decay). (e) For any forbidden process above, state which conservation law is violated. (f) Which fundamental force mediates beta decay?",
        "hint": "Q: proton=+1, neutron=0, electron=-1, positron=+1, photon=0, neutrino=0. Baryon number: proton=neutron=+1, leptons=photons=0. Lepton numbers (L_e, L_μ) are separate and must each be conserved. Electron L_e=+1, positron L_e=−1, ν_e L_e=+1, ν̄_e L_e=−1.",
        "xpBonus": 75
    },
    "semiconductors": {
        "title": "Doping a Solar Cell",
        "description": "Intrinsic silicon at 300 K: n_i = 1.5×10¹⁰ /cm³. Mobilities: μ_e = 1350 cm²/V·s, μ_h = 480 cm²/V·s. (a) Dope with boron at N_A = 10¹⁶ /cm³ (p-type). Find hole and electron concentrations (use np = n_i²). (b) Calculate conductivity ratio σ_doped/σ_intrinsic. (c) Now dope with phosphorus at N_D = 10¹⁶ /cm³ (n-type). Find carrier concentrations. (d) For a solar cell, which type of silicon should face the sunlight for better electron collection? Explain using carrier mobility values. (e) What happens if both boron and phosphorus are added equally?",
        "hint": "p-type: p = N_A = 10¹⁶, n = n_i²/p. σ ∝ nμ_e + pμ_h. Ratio = (n_doped×μ_e + p_doped×μ_h)/(n_i×μ_e + n_i×μ_h). Electrons have higher mobility → n-type on top captures more current from photogenerated pairs.",
        "xpBonus": 75
    },
    "pn-junction": {
        "title": "LED Wavelength from Bandgap",
        "description": "Semiconductor bandgap energies: GaAs = 1.42 eV, InGaN (blue) = 2.9 eV, GaP (green) ≈ 2.26 eV. h = 6.63×10⁻³⁴ J·s, c = 3×10⁸ m/s, 1 eV = 1.6×10⁻¹⁹ J. (a) Find the peak emission wavelength for each material — state if visible. (b) A white LED combines a blue chip (450 nm) with a yellow phosphor (570 nm). Find the bandgap energies. (c) A GaAs LED is forward-biased at 1.5 V carrying 30 mA. Find electrical power consumed. If light output is 20 mW, find efficiency. (d) Why can't silicon (indirect bandgap, 1.12 eV) be used for LEDs efficiently?",
        "hint": "λ = hc/E_g (convert eV to J first). 1.42 eV → λ = (6.63×10⁻³⁴ × 3×10⁸)/(1.42 × 1.6×10⁻¹⁹). Efficiency = P_light/P_electrical. Silicon has indirect bandgap → photon emission requires a phonon interaction → very inefficient.",
        "xpBonus": 75
    },
    "transistors": {
        "title": "BJT Amplifier Design",
        "description": "An NPN BJT has current gain β = 120. Amplifier: V_CC = 12 V, R_C = 1.5 kΩ, R_E = 500 Ω. (a) Base current I_B = 40 μA — find collector current I_C and emitter current I_E. (b) Find V_CE = V_CC − I_C(R_C + R_E). Is the transistor in the active region (V_CE > 0.2 V)? (c) The input signal varies I_B by ±10 μA. Find the peak-to-peak swing in V_CE (output voltage swing). (d) If ΔV_BE = 0.025 V for ΔI_B = 10 μA, find voltage gain A_v = ΔV_CE/ΔV_BE. (e) Why is the output voltage inverted compared to the input?",
        "hint": "I_C = βI_B. I_E = I_B + I_C. V_CE = V_CC − I_C × R_C − I_E × R_E. When I_B increases, I_C increases, voltage drop across R_C increases, so V_CE decreases — hence phase inversion. Gain = ΔV_CE/ΔV_BE.",
        "xpBonus": 75
    },
    "modulation": {
        "title": "AM vs FM Bandwidth Comparison",
        "description": "An AM station: carrier 900 kHz, carrier power 10 kW, modulation index m = 0.8, audio signal 5 kHz. An FM station: carrier 100 MHz, max frequency deviation Δf = 75 kHz, audio frequency 15 kHz. (a) For AM: find sideband frequencies, total bandwidth, and total power (P_total = P_c(1 + m²/2)) and power in each sideband. (b) For FM: find modulation index β = Δf/f_audio and bandwidth using Carson's rule: BW = 2(Δf + f_audio). (c) AM bandwidth vs FM bandwidth — which uses more spectrum? (d) Explain why FM has better audio quality and noise rejection than AM.",
        "hint": "AM sidebands: f_c ± f_audio. Total bandwidth = 2f_audio = 10 kHz. FM Carson bandwidth = 2(75+15) = 180 kHz. AM is susceptible to amplitude noise; FM encodes audio in frequency, so amplitude noise (lightning, interference) doesn't affect audio quality.",
        "xpBonus": 75
    },
    "wave-propagation": {
        "title": "5G vs 4G Signal Range",
        "description": "4G LTE operates at 1.8 GHz; 5G mmWave at 28 GHz. c = 3×10⁸ m/s. (a) Find wavelengths of both signals. (b) A brick wall absorbs 90% of signal power. A 4G signal passes through 3 walls — what fraction of original power remains? (c) Free-space path loss L ∝ (f/c × d)². At 100 m, how many dB worse is 5G compared to 4G? (10 × log₁₀(28/1.8)²). (d) 5G mmWave needs a base station every 100–300 m vs 4G's 1–2 km. Calculate the approximate number of base stations needed to cover 1 km² for each. (e) Explain the trade-off: speed vs coverage area.",
        "hint": "λ = c/f. After n walls: P = P₀ × 0.1^n. Path loss ratio in dB = 20 × log₁₀(f_5G/f_4G). For base station density: with radius r, one station covers π r². Number = 1 km²/(π r²). 5G mmWave has Gbps speeds but short range; 4G has less speed but wide coverage.",
        "xpBonus": 75
    },
    "digital-communication": {
        "title": "Audio Bitrate and Storage",
        "description": "CD audio: 44,100 Hz sampling rate, 16-bit depth, stereo (2 channels). (a) Calculate the bit rate. (b) Find storage for a 74-minute CD in megabytes (1 MB = 10⁶ bytes). (c) MP3 at 128 kbps compresses the same audio — find the compression ratio and storage for 74 minutes. (d) A phone call uses 8 kHz sampling, 8-bit, mono. Find bit rate and compare to CD. (e) A 2 Mbps internet connection carries voice calls — how many simultaneous calls can it support? Why is digital voice clearer than analogue over long distances?",
        "hint": "Bit rate = sampling rate × bit depth × channels. Storage = bit rate × duration (seconds) / 8 bits per byte, then convert to MB. Compression ratio = CD bit rate / MP3 bit rate. Digital signals can be regenerated perfectly; analogue noise accumulates over distance.",
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
print('Batch E done. Spot-check:')
for slug in challenges:
    title = loaded.get(slug, {}).get('challenge', {}).get('title', 'MISSING')
    print(f'  {slug}: {title}')

# Final verification
print('\nFinal count check:')
total = len([s for s, v in loaded.items() if v.get('challenge')])
print(f'Topics with challenges: {total}')
