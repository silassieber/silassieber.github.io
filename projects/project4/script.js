
/*
  BJÖRK — CHROMATIC ARCHIVE
  V21 — DIRECT AUDIO RESPONSE

  Real-time spectral analysis
  Adaptive frequency normalization
  Transient detection
  Direct musical displacement
  Ten individual movement systems
  Orthogonal grid choreography
  Smooth animated gradients
  Helvetica Regular / 16 & 28 px
*/

(function () {
  "use strict";

  // ==========================================
  // 01 — SETTINGS
  // ==========================================

  const FONT = "Helvetica";
  const SMALL = 16;
  const LARGE = 28;

  // AUDIO SENSITIVITY
  const SENSITIVITY = 1.35;
  const BASS_RESPONSE = 1.40;
  const MID_RESPONSE = 1.20;
  const HIGH_RESPONSE = 1.50;
  const BEAT_RESPONSE = 1.65;

  // VISUAL SETTINGS
  const MOVEMENT = 1.0;
  const GLITCH = 0.10;
  const ARTWORK_SCALE = 1.08;
  const VOLUME = 0.75;

  const GRID = 6;
  const RES = 64;
  const TEXTURE_COUNT = 16;

  // ==========================================
  // 02 — ALBUM ARCHIVE
  // ==========================================

  const albums = [
    {
      name: "Debut",
      year: 1993,
      release: "05.07.1993",
      duration: "~54 min",
      structure: "Displacement",
      track: "Crying",
      file: "crying.mp3",
      seconds: 290.9,
      colors: [
        "#E7D8C0", "#A79B86",
        "#514D42", "#151412"
      ]
    },
    {
      name: "Post",
      year: 1995,
      release: "12.06.1995",
      duration: "~46 min",
      structure: "Collision",
      track: "Hyper-ballad",
      file: "hyper-ballad.mp3",
      seconds: 321.5,
      colors: [
        "#F22D80", "#FF6A2D",
        "#F5A43C", "#2363AE"
      ]
    },
    {
      name: "Homogenic",
      year: 1997,
      release: "22.09.1997",
      duration: "~43 min",
      structure: "Compression",
      track: "Bachelorette",
      file: "bachelorette.mp3",
      seconds: 312.7,
      colors: [
        "#DCECF0", "#7196C5",
        "#E52C4C", "#242037"
      ]
    },
    {
      name: "Vespertine",
      year: 2001,
      release: "27.08.2001",
      duration: "~55 min",
      structure: "Crystallization",
      track: "Hidden Place",
      file: "hidden-place.mp3",
      seconds: 328.3,
      colors: [
        "#F4F7FA", "#C4DBEC",
        "#B0B9D7", "#E1C7DA"
      ]
    },
    {
      name: "Medúlla",
      year: 2004,
      release: "30.08.2004",
      duration: "~46 min",
      structure: "Resonance",
      track: "Oceania",
      file: "oceania.mp3",
      seconds: 204.2,
      colors: [
        "#D6BBA7", "#806456",
        "#3A3036", "#C9999C"
      ]
    },
    {
      name: "Volta",
      year: 2007,
      release: "07.05.2007",
      duration: "~51 min",
      structure: "Eruption",
      track: "Wanderlust",
      file: "wanderlust.mp3",
      seconds: 351.0,
      colors: [
        "#FF432D", "#FFAB27",
        "#EFD842", "#43C8A2"
      ]
    },
    {
      name: "Biophilia",
      year: 2011,
      release: "05.10.2011",
      duration: "~49 min",
      structure: "Orbital system",
      track: "Moon",
      file: "moon.mp3",
      seconds: 340.9,
      colors: [
        "#A86FCE", "#E8A35C",
        "#D5B3E4", "#7C4EAD"
      ]
    },
    {
      name: "Vulnicura",
      year: 2015,
      release: "20.01.2015",
      duration: "~58 min",
      structure: "Fracture",
      track: "Black Lake",
      file: "black-lake.mp3",
      seconds: 608.9,
      colors: [
        "#F5DF32", "#FF68AF",
        "#C55DE0", "#F8A3C8"
      ]
    },
    {
      name: "Utopia",
      year: 2017,
      release: "24.11.2017",
      duration: "~72 min",
      structure: "Dispersion",
      track: "Arisen My Senses",
      file: "arisen-my-senses.mp3",
      seconds: 300.0,
      colors: [
        "#E5B7C9", "#B5D7D0",
        "#F4D5BD", "#9BADD5"
      ]
    },
    {
      name: "Fossora",
      year: 2022,
      release: "30.09.2022",
      duration: "~55 min",
      structure: "Network",
      track: "Mycelia",
      file: "mycelia.mp3",
      seconds: 120.2,
      colors: [
        "#AD6B9D", "#DA91C5",
        "#A2B875", "#65517D"
      ]
    }
  ];

  // Static design profiles for geometry.
  // All movement is driven by live audio.

  const profiles = [
    [0.30, 0.31, 0.35, 0.40],
    [0.70, 0.22, 0.34, 0.34],
    [0.72, 0.73, 0.76, 0.78],
    [0.54, 0.49, 0.41, 0.56],
    [0.30, 0.43, 0.40, 0.47],
    [0.52, 0.65, 0.61, 0.68],
    [0.31, 0.45, 0.26, 0.31],
    [0.08, 0.30, 0.14, 0.14],
    [0.67, 0.73, 0.65, 0.70],
    [0.22, 0.55, 0.12, 0.25]
  ];

  const baseCounts = [
    28, 32, 40, 20, 29,
    35, 24, 40, 18, 27
  ];

  // ==========================================
  // 03 — HELPERS
  // ==========================================

  const sq = x => x * x;

  const clamp = (x, a, b) =>
    Math.max(a, Math.min(b, x));

  const mix = (a, b, t) =>
    a + (b - a) * t;

  const saturate = x =>
    clamp(x, 0, 1);

  function hash(n) {
    const v =
      Math.sin(n * 127.1 + 31.7) * 43758.5453;

    return v - Math.floor(v);
  }

  function bell(x, width) {
    return Math.exp(-sq(x) / width);
  }

  function gauss(x, y, cx, cy, sx, sy) {
    return Math.exp(
      -(sq(x - cx) / sx + sq(y - cy) / sy)
    );
  }

  function rgb(hex) {
    return [1, 3, 5].map(i =>
      parseInt(hex.slice(i, i + 2), 16)
    );
  }

  function timestamp(seconds) {
    seconds = Number.isFinite(seconds)
      ? Math.max(0, seconds)
      : 0;

    return Math.floor(seconds / 60) +
      ":" +
      String(Math.floor(seconds % 60))
        .padStart(2, "0");
  }

  function inside(box, x, y) {
    return box &&
      x >= box.x &&
      x <= box.x + box.w &&
      y >= box.y &&
      y <= box.y + box.h;
  }

  function follow(value, target, dt, time) {
    return mix(
      value,
      target,
      1 - Math.exp(-dt / Math.max(0.001, time))
    );
  }

  function emptyAudio() {
    return {
      sub: 0,
      bass: 0,
      lowMid: 0,
      mid: 0,
      high: 0,
      air: 0,
      volume: 0,
      beat: 0,
      flux: 0,
      onset: false,
      beatIndex: 0,
      bands: Array(24).fill(0)
    };
  }

  // ==========================================
  // 04 — P5 INSTANCE
  // ==========================================

  const sketch = function (p) {

    let current = 0;
    let clock = 0;

    let tiles = [];
    let palette = [];
    let textures = [];
    let swatches = [];

    let ratingBox = null;
    let trackBox = null;
    let playBox = null;

    let artworkWidth = 12;
    let artworkHeight = 12;

    let scrubbing = false;

    const ratings = Array(10).fill(null);

    // ========================================
    // 05 — AUDIO ENGINE
    // ========================================

    const player = new Audio();

    player.preload = "metadata";
    player.loop = true;
    player.volume = VOLUME;

    let audioContext = null;
    let analyser = null;
    let source = null;

    let frequencyData = null;
    let waveformData = null;
    let previousSpectrum = null;

    let audioError = "";
    let loading = false;
    let playRequest = 0;

    let audio = emptyAudio();

    let lastOnset = -10;
    let beatIndex = 0;

    let fluxAverage = 0;
    let bassAverage = 0;
    let previousBass = 0;

    let beatEnvelope = 0;
    let fluxEnvelope = 0;

    const peaks = Array(31).fill(0.025);
    const smoothBands = Array(31).fill(0);

    player.addEventListener("error", () => {
      loading = false;
      audioError = "Audio file could not be loaded";
      console.error(player.src);
    });

    player.addEventListener("playing", () => {
      loading = false;
      audioError = "";
    });

    player.addEventListener("waiting", () => {
      if (!player.paused) loading = true;
    });

    player.addEventListener("canplay", () => {
      loading = false;
    });

    player.addEventListener("pause", () => {
      loading = false;
    });

    function initializeAudio() {

      if (audioContext) return;

      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error("Web Audio unavailable");
      }

      audioContext = new AudioContextClass();

      analyser = audioContext.createAnalyser();

      // Low smoothing for immediate reactions.
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.12;

      analyser.minDecibels = -95;
      analyser.maxDecibels = -10;

      source =
        audioContext.createMediaElementSource(player);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      frequencyData = new Float32Array(
        analyser.frequencyBinCount
      );

      waveformData = new Float32Array(
        analyser.fftSize
      );

      previousSpectrum = new Float32Array(
        analyser.frequencyBinCount
      );
    }

    async function playAudio() {

      const request = ++playRequest;

      try {

        audioError = "";
        loading = true;

        initializeAudio();

        const resume = audioContext.resume();
        const playback = player.play();

        await Promise.all([resume, playback]);

        if (request === playRequest) {
          loading = false;
        }

      } catch (error) {

        if (request !== playRequest) return;

        loading = false;

        if (error.name !== "AbortError") {
          audioError = "Unable to play audio";
          console.error(error);
        }
      }
    }

    function togglePlayback() {

      if (player.paused) {
        playAudio();
      } else {
        playRequest++;
        player.pause();
        loading = false;
      }
    }

    function getDuration() {

      return Number.isFinite(player.duration) &&
        player.duration > 0
          ? player.duration
          : albums[current].seconds;
    }

    function resetAnalysis() {

      audio = emptyAudio();

      peaks.fill(0.025);
      smoothBands.fill(0);

      fluxAverage = 0;
      bassAverage = 0;
      previousBass = 0;

      beatEnvelope = 0;
      fluxEnvelope = 0;

      lastOnset = -10;
      beatIndex = 0;

      if (previousSpectrum) {
        previousSpectrum.fill(0);
      }
    }

    // ========================================
    // 06 — REAL FREQUENCY ANALYSIS
    // ========================================

    function magnitude(db) {

      if (!Number.isFinite(db)) return 0;

      return Math.pow(10, db / 20);
    }

    function bandEnergy(minHz, maxHz) {

      if (!frequencyData) return 0;

      const binWidth =
        audioContext.sampleRate / analyser.fftSize;

      const start = clamp(
        Math.floor(minHz / binWidth),
        1,
        frequencyData.length - 1
      );

      const end = clamp(
        Math.ceil(maxHz / binWidth),
        start,
        frequencyData.length - 1
      );

      let sum = 0;
      let count = 0;

      for (let i = start; i <= end; i++) {

        const value = magnitude(
          frequencyData[i]
        );

        sum += value * value;
        count++;
      }

      return count
        ? Math.sqrt(sum / count)
        : 0;
    }

    // Adaptive normalization makes quieter
    // recordings and delicate sounds visible.

    function normalizeBand(
      value,
      index,
      dt,
      sensitivity
    ) {

      const floor = index === 6
        ? 0.025
        : 0.003;

      peaks[index] = Math.max(
        floor,
        value,
        peaks[index] * Math.exp(-dt / 7)
      );

      let normalized = saturate(
        value /
        Math.max(floor, peaks[index]) *
        sensitivity *
        SENSITIVITY
      );

      normalized *= saturate(
        value / (floor * 1.5)
      );

      const attack = 0.025;
      const release = 0.13;

      const time =
        normalized > smoothBands[index]
          ? attack
          : release;

      smoothBands[index] = follow(
        smoothBands[index],
        normalized,
        dt,
        time
      );

      return smoothBands[index];
    }

    // ========================================
    // 07 — TRANSIENT / BEAT DETECTION
    // ========================================

    function readAudio(dt) {

      if (!analyser || player.paused) {
        return audio;
      }

      analyser.getFloatFrequencyData(
        frequencyData
      );

      analyser.getFloatTimeDomainData(
        waveformData
      );

      // Broad musical frequency regions.

      const rawSub = bandEnergy(25, 65);
      const rawBass = bandEnergy(65, 220);
      const rawLowMid = bandEnergy(220, 500);
      const rawMid = bandEnergy(500, 2500);
      const rawHigh = bandEnergy(2500, 6500);
      const rawAir = bandEnergy(6500, 14000);

      // Actual waveform amplitude.

      let sum = 0;

      for (let i = 0; i < waveformData.length; i++) {
        sum += sq(waveformData[i]);
      }

      const rms = Math.sqrt(
        sum / waveformData.length
      );

      // Spectral flux:
      // detects sudden changes in the spectrum.

      let flux = 0;

      const binWidth =
        audioContext.sampleRate / analyser.fftSize;

      const limit = Math.min(
        frequencyData.length,
        Math.ceil(10000 / binWidth)
      );

      for (let i = 1; i < limit; i++) {

        const value = Math.log1p(
          magnitude(frequencyData[i]) * 100
        );

        const difference =
          value - previousSpectrum[i];

        flux += Math.max(0, difference);

        previousSpectrum[i] = value;
      }

      flux /= Math.max(1, limit - 1);

      const rawLow =
        rawSub * 0.55 + rawBass * 0.45;

      const bassRise = Math.max(
        0,
        rawLow - previousBass
      );

      const fluxThreshold = Math.max(
        0.012,
        fluxAverage * 1.65
      );

      const bassThreshold = Math.max(
        0.003,
        bassAverage * 0.12
      );

      const fluxHit =
        flux > fluxThreshold;

      const bassHit =
        bassRise > bassThreshold &&
        rawLow > bassAverage * 0.9;

      const onset =
        rms > 0.006 &&
        clock - lastOnset > 0.11 &&
        (fluxHit || bassHit);

      fluxAverage = follow(
        fluxAverage,
        flux,
        dt,
        0.8
      );

      bassAverage = follow(
        bassAverage,
        rawLow,
        dt,
        0.6
      );

      previousBass = rawLow;

      beatEnvelope *= Math.exp(-dt / 0.19);
      fluxEnvelope *= Math.exp(-dt / 0.10);

      if (onset) {

        lastOnset = clock;
        beatIndex++;

        beatEnvelope = saturate(
          Math.max(
            flux / (fluxThreshold * 1.8),
            bassRise / (bassThreshold * 2)
          ) * BEAT_RESPONSE
        );
      }

      fluxEnvelope = Math.max(
        fluxEnvelope,
        saturate(
          flux /
          Math.max(0.025, fluxAverage * 3)
        )
      );

      // Individual normalized frequency bands.

      const sub = normalizeBand(
        rawSub, 0, dt, BASS_RESPONSE
      );

      const bass = normalizeBand(
        rawBass, 1, dt, BASS_RESPONSE
      );

      const lowMid = normalizeBand(
        rawLowMid, 2, dt, MID_RESPONSE
      );

      const mid = normalizeBand(
        rawMid, 3, dt, MID_RESPONSE
      );

      const high = normalizeBand(
        rawHigh, 4, dt, HIGH_RESPONSE
      );

      const air = normalizeBand(
        rawAir, 5, dt, HIGH_RESPONSE
      );

      const volume = normalizeBand(
        rms, 6, dt, 1
      );

      // 24 logarithmic bands.
      // Different tiles listen to different
      // regions of the actual recording.

      const bands = [];

      const minFrequency = 35;
      const maxFrequency = 14000;

      for (let i = 0; i < 24; i++) {

        const low = minFrequency *
          Math.pow(
            maxFrequency / minFrequency,
            i / 24
          );

        const high = minFrequency *
          Math.pow(
            maxFrequency / minFrequency,
            (i + 1) / 24
          );

        bands.push(
          normalizeBand(
            bandEnergy(low, high),
            i + 7,
            dt,
            1
          )
        );
      }

      // Prevent adaptive amplification from
      // creating movement during silence.

      const gate = saturate(
        (rms - 0.0015) / 0.012
      );

      audio = {
        sub: sub * gate,
        bass: bass * gate,
        lowMid: lowMid * gate,
        mid: mid * gate,
        high: high * gate,
        air: air * gate,
        volume: volume * gate,
        beat: beatEnvelope * gate,
        flux: fluxEnvelope * gate,
        onset,
        beatIndex,
        bands: bands.map(v => v * gate)
      };

      return audio;
    }

    // ========================================
    // 08 — TEN SPATIAL SYSTEMS
    // ========================================

    function shapeScore(x, y, avg, variation) {

      const [bass, mid, high, rhythm] = avg;

      const r = Math.hypot(x, y);
      const angle = Math.atan2(y, x);

      switch (current) {

        // DEBUT — DISPLACEMENT

        case 0: {

          const slope = 0.75 + bass * 0.65;

          const diagonal = bell(
            x - y * slope,
            1.8 + mid * 4
          );

          const a = gauss(
            x, y, -3, -3, 7, 5
          );

          const b = gauss(
            x, y, 3, 3, 6, 7
          );

          const steps =
            Math.abs(
              x - Math.round(y / 2) * 2
            ) <= 1 ? 0.3 : 0;

          return diagonal * 0.75 +
            a * 0.45 +
            b * 0.45 +
            steps -
            r * 0.035;
        }

        // POST — COLLISION

        case 1: {

          const a = gauss(
            x, y, -3, -2,
            5 + bass * 6,
            4 + high * 6
          );

          const b = gauss(
            x, y, 3, 2,
            5 + mid * 6, 6
          );

          const c = gauss(
            x, y, 2, -3,
            4, 5 + bass * 5
          );

          const d = gauss(
            x, y, -3, 3, 4, 4
          );

          return Math.max(a, b, c, d) * 0.9 +
            bell(x - y, 4) * 0.2 +
            variation * 0.22 -
            r * 0.02;
        }

        // HOMOGENIC — COMPRESSION

        case 2: {

          if (
            Math.abs(x) > 5 ||
            Math.abs(y) > 5
          ) {
            return -Infinity;
          }

          const central = gauss(
            x, y, 0, 0, 15, 22
          );

          const lower = bass * gauss(
            x, y, 0, 2.3, 17, 9
          );

          const upper = high * gauss(
            x, y, 0, -2.4, 19, 10
          );

          const middle = mid * gauss(
            x, y, 0, 0, 10, 19
          );

          const edge = rhythm * (
            Math.abs(x) > 2 ||
            Math.abs(y) > 3
              ? 0.32 : 0
          );

          return central * 0.42 +
            lower * 0.42 +
            upper * 0.33 +
            middle * 0.40 +
            edge +
            variation * 0.24 -
            r * 0.018;
        }

        // VESPERTINE — CRYSTALLIZATION

        case 3: {

          const diagonal = bell(
            Math.abs(x) - Math.abs(y),
            0.6 + high * 2
          );

          const vertical = bell(x, 0.9);
          const horizontal = bell(y, 0.9);

          const crystal = Math.max(
            diagonal,
            vertical * 0.8,
            horizontal * 0.65
          );

          const gap =
            (x + y + 30) % 3 === 0
              ? 0.18 : 0;

          return crystal * 0.9 +
            gauss(x, y, 0, 0, 14, 14) * 0.22 +
            variation * 0.16 -
            gap -
            r * 0.035;
        }

        // MEDÚLLA — RESONANCE

        case 4: {

          const width = 4.1 + bass * 2;
          const height = 2.7 + mid * 2;

          const ellipse = Math.sqrt(
            sq(x / width) +
            sq(y / height)
          );

          const shell = bell(
            ellipse - 1,
            0.035 + high * 0.07
          );

          const inner = bell(
            ellipse - 0.55,
            0.02
          );

          return shell * 0.95 +
            inner * mid * 0.6 +
            variation * 0.15 -
            (ellipse < 0.4 ? 0.5 : 0);
        }

        // VOLTA — ERUPTION

        case 5: {

          const rays = Math.pow(
            Math.abs(Math.cos(angle * 4)),
            5
          );

          const reach = 3.6 + rhythm * 3;

          const envelope = bell(
            r - reach,
            7 + bass * 5
          );

          return rays * envelope * 1.1 +
            gauss(x, y, 0, 0, 5, 5) * 0.5 +
            variation * 0.25 -
            r * 0.012;
        }

        // BIOPHILIA — ORBITAL SYSTEM

        case 6: {

          const radiusA = 2.0 + mid * 1.4;
          const radiusB = 4.4 + bass * 1.5;

          const ringA = bell(
            r - radiusA, 0.45
          );

          const ringB = bell(
            r - radiusB, 0.55
          );

          const core = gauss(
            x, y, 0, 0, 1.4, 1.4
          );

          const gap =
            Math.sin(angle * 3 + high * 4) > 0.7
              ? 0.35 : 0;

          return ringA * 0.8 +
            ringB * 0.95 +
            core * 0.8 -
            gap +
            variation * 0.1;
        }

        // VULNICURA — FRACTURE

        case 7: {

          const left = gauss(
            x, y, -2.7, -0.7,
            5 + bass * 8,
            16 + mid * 8
          );

          const right = gauss(
            x, y, 2.7, 0.7,
            5 + bass * 8,
            16 + mid * 8
          );

          const fracture = Math.round(
            Math.sin(y * 0.7) * 1.1
          );

          const gap = 0.65 + mid * 0.8;

          if (
            Math.abs(x - fracture) < gap
          ) {
            return -Infinity;
          }

          return Math.max(left, right) +
            variation * 0.17 -
            r * 0.02;
        }

        // UTOPIA — DISPERSION

        case 8: {

          const spread = 3.0 + high * 2;

          const a = gauss(
            x, y, -spread, -3, 4, 2
          );

          const b = gauss(
            x, y, spread, -2, 3, 4
          );

          const c = gauss(
            x, y, -2, 2, 5, 3
          );

          const d = gauss(
            x, y, 3, 4, 4, 2
          );

          const e = gauss(
            x, y, 0, -1, 2, 2
          );

          const f = gauss(
            x, y, -4, 4, 2, 2
          );

          return Math.max(a, b, c, d, e, f) +
            variation * 0.26;
        }

        // FOSSORA — NETWORK

        case 9: {

          const stem =
            bell(x, 1.4) *
            bell(y + 1, 18);

          const rootY = Math.max(0, y + 1);

          const branchPosition =
            rootY * (0.65 + mid * 0.5);

          const roots = bell(
            Math.abs(x) - branchPosition,
            1.4
          );

          const branches =
            bell(y - 1, 0.7) * bell(x, 22) +
            bell(y - 4, 0.7) * bell(x, 22);

          const cap = gauss(
            x, y, 0, -4,
            7 + mid * 7, 2
          );

          return stem * 0.9 +
            roots * (y >= 0 ? 0.8 : 0.1) +
            branches * 0.55 +
            cap * 0.95 +
            variation * 0.12 -
            r * 0.02;
        }

        default:
          return 0;
      }
    }

    // ========================================
    // 09 — BUILD SCULPTURE
    // ========================================

    function buildShape() {

      const avg = profiles[current];

      const energy =
        (avg[0] + avg[1] + avg[2]) / 3;

      let count = Math.round(
        baseCounts[current] + energy * 45
      );

      if (current === 2) count = 72;

      const candidates = [];

      for (let y = -GRID; y <= GRID; y++) {

        for (let x = -GRID; x <= GRID; x++) {

          const variation = hash(
            (x + 9) * 29 +
            (y + 9) * 13 +
            current * 103
          );

          const band =
            y > 1 ? 0 : y < -1 ? 2 : 1;

          let score = shapeScore(
            x, y, avg, variation
          );

          if (!Number.isFinite(score)) {
            continue;
          }

          score += avg[band] * 0.14;
          score += avg[3] * variation * 0.12;

          candidates.push({
            x, y, band, score
          });
        }
      }

      candidates.sort(
        (a, b) => b.score - a.score
      );

      tiles = candidates
        .slice(0, count)
        .map((q, i) => {

          const seed = hash(
            (q.x + 20) * 17 +
            (q.y + 20) * 41 +
            current * 71
          );

          let color =
            (q.x + q.y * 2 + i + 40) % 4;

          if (current === 2) {

            color = Math.abs(q.y) > 2
              ? (q.y > 0 ? 1 : 0)
              : i % 4;
          }

          return {
            x: q.x,
            y: q.y,
            band: q.band,
            color: (color + 4) % 4,
            seed,
            direction: seed > 0.5 ? 1 : -1,

            frequency: 0,

            dx: 0,
            dy: 0,

            targetX: 0,
            targetY: 0,

            signal: 0,
            impulse: 0,
            impulseDirection: 1,

            pendingBeat: -1,
            beatTime: 0,
            lastBeat: -1,

            cluster: 0,
            axis: 0
          };
        });

      if (!tiles.length) return;

      const xs = tiles.map(t => t.x);
      const ys = tiles.map(t => t.y);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);

      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      artworkWidth = maxX - minX + 1;
      artworkHeight = maxY - minY + 1;

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      for (const tile of tiles) {

        tile.x -= cx;
        tile.y -= cy;

        // Lower tiles respond to bass.
        // Higher tiles respond to treble.

        tile.frequency = clamp(
          Math.floor(
            (6 - tile.y) / 12 * 23 +
            (tile.seed - 0.5) * 5
          ),
          0, 23
        );

        tile.cluster =
          Math.floor((tile.x + 8) / 4) * 11 +
          Math.floor((tile.y + 8) / 4);

        tile.axis =
          Math.abs(tile.x) >= Math.abs(tile.y)
            ? 0 : 1;
      }
    }

    // ========================================
    // 10 — MUSICAL IMPULSES
    // ========================================

    function beatDelay(tile) {

      const x = tile.x;
      const y = tile.y;
      const radius = Math.hypot(x, y);

      switch (current) {

        case 0:
          return (x + y + 14) * 0.008;

        case 1:
          return Math.abs(y) * 0.012;

        case 2:
          return tile.seed * 0.035;

        case 3:
          return tile.seed * 0.09;

        case 4:
          return 0;

        case 5:
          return radius * 0.018;

        case 6:
          return (
            Math.atan2(y, x) + Math.PI
          ) / (Math.PI * 2) * 0.13;

        case 7:
          return 0;

        case 8:
          return hash(tile.cluster) * 0.12;

        case 9:
          return (y + 7) * 0.018;

        default:
          return 0;
      }
    }

    function updateImpulse(tile, a, dt) {

      const local =
        a.bands[tile.frequency] || 0;

      if (
        a.onset &&
        tile.pendingBeat !== a.beatIndex
      ) {

        tile.pendingBeat = a.beatIndex;

        tile.beatTime =
          clock + Math.max(0, beatDelay(tile));
      }

      if (
        tile.pendingBeat >= 0 &&
        tile.pendingBeat !== tile.lastBeat &&
        clock >= tile.beatTime
      ) {

        tile.lastBeat = tile.pendingBeat;

        let strength = a.beat;

        // Different musical emphasis
        // for each sculpture.

        switch (current) {

          case 0:
            strength *= 0.5 + a.mid * 0.5;
            break;

          case 1:
            strength *= 0.5 + a.bass * 0.5;
            break;

          case 2:
            strength *= 0.8 + a.bass * 0.2;
            break;

          case 3:
            strength *= a.high * 0.75;
            break;

          case 4:
            strength *= a.mid * 0.45;
            break;

          case 5:
            strength *= 1.25;
            break;

          case 6:
            strength *= 0.6;
            break;

          case 7:
            strength *= 0.35;
            break;

          case 8:
            strength *= a.air * 0.8;
            break;

          case 9:
            strength *= 0.5 + a.lowMid * 0.5;
            break;
        }

        const threshold =
          hash(
            tile.seed * 1000 +
            a.beatIndex * 71.13
          ) * 0.6;

        if (
          strength + local * 0.3 > threshold
        ) {

          tile.impulse = Math.max(
            tile.impulse,
            strength
          );

          tile.impulseDirection =
            hash(
              tile.seed * 300 +
              a.beatIndex * 17.7
            ) > 0.5 ? 1 : -1;
        }
      }

      const decay = [
        0.22, 0.15, 0.20, 0.10, 0.35,
        0.23, 0.25, 0.45, 0.20, 0.24
      ][current];

      tile.impulse *= Math.exp(-dt / decay);
    }

    // ========================================
    // 11 — DIRECT AUDIO CHOREOGRAPHY
    // ========================================

    function updateMovement(tile, a, dt) {

      updateImpulse(tile, a, dt);

      const x = tile.x;
      const y = tile.y;

      const sx = x >= 0 ? 1 : -1;
      const sy = y >= 0 ? 1 : -1;

      const radius = Math.hypot(x, y);

      const local =
        a.bands[tile.frequency] || 0;

      const impulse = tile.impulse;

      let tx = 0;
      let ty = 0;

      let attack = 0.045;
      let release = 0.13;

      let signal = 0;

      switch (current) {

        // ----------------------------------
        // DEBUT
        // Cascading displacement
        // Midrange + rhythmic impulses
        // ----------------------------------

        case 0: {

          signal =
            local * 0.40 +
            a.mid * 0.35 +
            impulse * 0.65;

          const row =
            Math.round(x + y);

          const direction =
            row % 2 === 0 ? 1 : -1;

          const distance = signal * 2.0;

          if (row % 3 === 0) {
            ty = distance * direction;
          } else {
            tx = distance * direction;
          }

          attack = 0.045;
          release = 0.16;

          break;
        }

        // ----------------------------------
        // POST
        // Horizontal collisions
        // Strong bass and electronic beats
        // ----------------------------------

        case 1: {

          const row = Math.round(y);

          const direction =
            row % 2 === 0 ? 1 : -1;

          signal =
            a.sub * 0.35 +
            a.bass * 0.45 +
            impulse * 0.9;

          tx =
            direction *
            signal *
            2.5;

          if (
            a.flux > 0.65 &&
            tile.seed > 0.8
          ) {

            tx = 0;
            ty = tile.direction * a.flux;
          }

          attack = 0.025;
          release = 0.10;

          break;
        }

        // ----------------------------------
        // HOMOGENIC
        // Mechanical compression
        // Heavy synchronized beat response
        // ----------------------------------

        case 2: {

          signal =
            a.bass * 0.35 +
            local * 0.25 +
            impulse * 1.0;

          const direction =
            tile.seed > 0.35 ? 1 : -1;

          const phase =
            a.beatIndex % 4;

          const distance =
            signal * 2.15;

          if (phase === 0) {
            ty = -distance * direction;
          }

          if (phase === 1) {
            tx = distance * direction;
          }

          if (phase === 2) {
            ty = distance * direction;
          }

          if (phase === 3) {
            tx = -distance * direction;
          }

          attack = 0.022;
          release = 0.13;

          break;
        }

        // ----------------------------------
        // VESPERTINE
        // Delicate micro-percussion
        // Treble and individual frequencies
        // ----------------------------------

        case 3: {

          signal =
            a.high * 0.35 +
            a.air * 0.25 +
            local * 0.4 +
            impulse * 0.65;

          const distance =
            signal * 1.2;

          const direction =
            tile.impulseDirection;

          if (tile.seed > 0.5) {
            ty = direction * distance;
          } else {
            tx = direction * distance;
          }

          attack = 0.018;
          release = 0.085;

          break;
        }

        // ----------------------------------
        // MEDÚLLA
        // Vocal resonance
        // Expansion and contraction
        // ----------------------------------

        case 4: {

          signal =
            a.lowMid * 0.35 +
            a.mid * 0.45 +
            local * 0.2;

          const distance =
            signal * 2.0;

          if (tile.axis === 0) {
            tx = sx * distance;
          } else {
            ty = sy * distance;
          }

          attack = 0.075;
          release = 0.23;

          break;
        }

        // ----------------------------------
        // VOLTA
        // Percussive eruption
        // Outward impulses
        // ----------------------------------

        case 5: {

          signal =
            a.sub * 0.4 +
            a.bass * 0.35 +
            impulse * 1.1;

          const distance =
            signal *
            (1.6 + radius * 0.12);

          if (tile.axis === 0) {
            tx = sx * distance;
          } else {
            ty = sy * distance;
          }

          attack = 0.018;
          release = 0.16;

          break;
        }

        // ----------------------------------
        // BIOPHILIA
        // Tangential orbital displacement
        // Harmonic frequency response
        // ----------------------------------

        case 6: {

          const ring = Math.round(radius);

          const direction =
            ring % 2 === 0 ? 1 : -1;

          signal =
            local * 0.45 +
            a.mid * 0.35 +
            impulse * 0.45;

          const distance =
            signal * 1.9;

          if (tile.axis === 0) {
            ty = sx * direction * distance;
          } else {
            tx = -sy * direction * distance;
          }

          attack = 0.05;
          release = 0.20;

          break;
        }

        // ----------------------------------
        // VULNICURA
        // Fracture and separation
        // Sustained harmonic intensity
        // ----------------------------------

        case 7: {

          signal =
            a.volume * 0.35 +
            a.lowMid * 0.30 +
            a.mid * 0.35;

          const distance =
            Math.pow(signal, 1.5) * 2.7;

          tx =
            sx *
            (distance + impulse * 0.4);

          attack = 0.12;
          release = 0.40;

          break;
        }

        // ----------------------------------
        // UTOPIA
        // Floating frequency clusters
        // High-frequency dispersion
        // ----------------------------------

        case 8: {

          const clusterFrequency =
            12 + Math.abs(tile.cluster % 12);

          const clusterSignal =
            a.bands[clusterFrequency] || 0;

          signal =
            clusterSignal * 0.55 +
            a.air * 0.25 +
            impulse * 0.45;

          const direction =
            tile.cluster % 2 === 0 ? 1 : -1;

          const distance =
            signal * 2.1;

          if (tile.cluster % 3 === 0) {
            tx = direction * distance;
          } else {
            ty = -distance;
          }

          attack = 0.045;
          release = 0.22;

          break;
        }

        // ----------------------------------
        // FOSSORA
        // Root propagation
        // Low-mid frequencies and pulses
        // ----------------------------------

        case 9: {

          signal =
            a.bass * 0.3 +
            a.lowMid * 0.35 +
            local * 0.25 +
            impulse * 0.65;

          const distance =
            signal * 2.0;

          if (
            Math.abs(x) < 1.5 ||
            y < 0
          ) {

            ty = distance;

          } else {

            tx = sx * distance;
          }

          attack = 0.035;
          release = 0.18;

          break;
        }
      }

      tile.signal = follow(
        tile.signal,
        saturate(signal),
        dt,
        0.045
      );

      // Quantized targets preserve the
      // orthogonal square-grid aesthetic.

      tx = Math.round(
        clamp(tx * MOVEMENT, -3, 3)
      );

      ty = Math.round(
        clamp(ty * MOVEMENT, -3, 3)
      );

      // Ensure movement remains on one axis.

      if (Math.abs(tx) >= Math.abs(ty)) {
        ty = 0;
      } else {
        tx = 0;
      }

      tile.targetX = tx;
      tile.targetY = ty;

      // Return along the old axis before
      // beginning movement on a new axis.

      if (
        tile.targetY !== 0 &&
        Math.abs(tile.dx) > 0.025
      ) {

        tile.dx = follow(
          tile.dx, 0, dt, attack
        );

        tile.dy = 0;

      } else if (
        tile.targetX !== 0 &&
        Math.abs(tile.dy) > 0.025
      ) {

        tile.dy = follow(
          tile.dy, 0, dt, attack
        );

        tile.dx = 0;

      } else {

        const timeX =
          Math.abs(tile.targetX) >
          Math.abs(tile.dx)
            ? attack : release;

        const timeY =
          Math.abs(tile.targetY) >
          Math.abs(tile.dy)
            ? attack : release;

        tile.dx = follow(
          tile.dx,
          tile.targetX,
          dt,
          timeX
        );

        tile.dy = follow(
          tile.dy,
          tile.targetY,
          dt,
          timeY
        );
      }

      if (Math.abs(tile.dx) < 0.015) {
        tile.dx = 0;
      }

      if (Math.abs(tile.dy) < 0.015) {
        tile.dy = 0;
      }
    }

    // ========================================
    // 12 — AUDIO-REACTIVE GRADIENTS
    // ========================================

    function makeTextures() {

      textures = [];

      for (let i = 0; i < TEXTURE_COUNT; i++) {

        const g = p.createGraphics(RES, RES);

        g.pixelDensity(1);

        textures.push(g);
      }
    }

    function updateTextures(a) {

      const directions = [
        [0, 0, 0, RES],
        [0, RES, 0, 0],
        [0, 0, RES, 0],
        [RES, 0, 0, 0]
      ];

      const signals = [
        a.bass,
        a.mid,
        a.high,
        a.air
      ];

      for (let i = 0; i < TEXTURE_COUNT; i++) {

        const g = textures[i];
        const ctx = g.drawingContext;

        const colorA = palette[i % 4];

        const colorB = palette[
          (i + 1 + Math.floor(i / 8)) % 4
        ];

        const band = signals[
          Math.floor(i / 4)
        ];

        const direction =
          i % 2 === 0 ? 1 : -1;

        // The gradient follows the sound
        // rather than an independent sine loop.

        const shift =
          direction *
          (
            band * 0.32 +
            a.beat * 0.22
          );

        const brightness =
          0.83 +
          a.volume * 0.17 +
          a.beat * 0.08;

        const gradient =
          ctx.createLinearGradient(
            ...directions[i % 4]
          );

        for (let k = 0; k <= 16; k++) {

          const u = k / 16;

          let t = saturate(
            u + shift
          );

          t = t * t * (3 - 2 * t);

          const color = colorA.map(
            (value, channel) =>
              Math.round(
                clamp(
                  mix(
                    value,
                    colorB[channel],
                    t
                  ) * brightness,
                  0, 255
                )
              )
          );

          gradient.addColorStop(
            u,
            "rgb(" + color.join(",") + ")"
          );
        }

        ctx.fillStyle = gradient;

        ctx.fillRect(
          0, 0, RES, RES
        );
      }
    }

    // ========================================
    // 13 — SUBTLE PERCUSSIVE GLITCH
    // ========================================

    function glitch(tile, a) {

      let dx = 0;
      let dy = 0;

      const amount = [
        0.6, 1.0, 0.8, 0.25, 0.1,
        1.2, 0.25, 0.05, 0.4, 0.5
      ][current];

      const chance =
        a.beat *
        a.flux *
        GLITCH *
        amount;

      const seed = hash(
        a.beatIndex * 83.1 +
        tile.seed * 1291
      );

      if (
        a.beat > 0.6 &&
        seed < chance
      ) {

        if (tile.axis === 0) {
          dx = tile.direction;
        } else {
          dy = tile.direction;
        }
      }

      return { dx, dy };
    }

    // ========================================
    // 14 — RESPONSIVE LAYOUT
    // ========================================

    function layout() {

      const mobile = p.width < 650;

      const margin = mobile ? 12 : 20;

      const headerHeight = 44;
      const infoHeight = 172;
      const timelineHeight = 48;

      const infoTop =
        p.height - infoHeight - timelineHeight;

      const top = headerHeight + 4;
      const bottom = infoTop - 8;

      const available = Math.max(
        1,
        bottom - top
      );

      const padding = [
        6, 6, 6, 4, 6,
        7, 6, 7, 6, 6
      ][current];

      const fitWidth =
        p.width * 0.88 /
        (artworkWidth + padding);

      const fitHeight =
        available /
        (artworkHeight + padding);

      const unit = Math.max(
        1,
        Math.min(
          fitWidth,
          fitHeight,
          180
        ) * ARTWORK_SCALE
      );

      return {
        mobile,
        margin,
        headerHeight,
        infoTop,
        top,
        bottom,
        unit,
        centerY: (top + bottom) / 2,
        width: Math.max(
          1,
          p.width - margin * 2
        )
      };
    }

    // ========================================
    // 15 — DRAW SCULPTURE
    // ========================================

    function drawShape(a) {

      const L = layout();

      if (L.bottom <= L.top) return;

      const ctx = p.drawingContext;

      p.noStroke();

      ctx.save();
      ctx.beginPath();

      ctx.rect(
        0,
        L.top,
        p.width,
        L.bottom - L.top
      );

      ctx.clip();

      for (let i = 0; i < tiles.length; i++) {

        const tile = tiles[i];

        const error = glitch(tile, a);

        const x =
          p.width / 2 +
          (
            tile.x +
            tile.dx +
            error.dx
          ) * L.unit;

        const y =
          L.centerY +
          (
            tile.y +
            tile.dy +
            error.dy
          ) * L.unit;

        const texture =
          (
            tile.color +
            (i % 4) * 4
          ) % TEXTURE_COUNT;

        p.image(
          textures[texture],
          x,
          y,
          L.unit + 0.15,
          L.unit + 0.15
        );
      }

      ctx.restore();
    }

    // ========================================
    // 16 — TYPOGRAPHY
    // ========================================

    function type(size = SMALL) {

      p.noStroke();
      p.fill(255);

      p.textFont(FONT);
      p.textStyle(p.NORMAL);
      p.textSize(size);

      p.textLeading(
        size === LARGE ? 32 : 21
      );
    }

    function line(x1, y1, x2, y2) {

      p.stroke(255);
      p.strokeWeight(1.2);

      p.line(x1, y1, x2, y2);

      p.noStroke();
    }

    function fittedText(value, maxWidth) {

      let text = String(value);

      if (maxWidth <= 0) return "";

      if (p.textWidth(text) <= maxWidth) {
        return text;
      }

      while (
        text.length > 0 &&
        p.textWidth(text + "…") > maxWidth
      ) {

        text = text.slice(0, -1);
      }

      return text ? text + "…" : "";
    }

    // ========================================
    // 17 — HEADER
    // ========================================

    function drawHeader() {

      const L = layout();
      const m = L.margin;

      type();

      p.textAlign(p.LEFT, p.CENTER);
      p.text("Björk", m, 22);

      p.textAlign(p.CENTER, p.CENTER);

      p.text(
        p.width < 370
          ? "Archive"
          : "Chromatic Archive",
        p.width / 2,
        22
      );

      p.textAlign(p.RIGHT, p.CENTER);

      p.text(
        String(current + 1)
          .padStart(2, "0") + "/10",
        p.width - m,
        22
      );

      line(
        0,
        L.headerHeight,
        p.width,
        L.headerHeight
      );
    }

    // ========================================
    // 18 — NAVIGATION ARROWS
    // ========================================

    function drawArrows() {

      const L = layout();

      if (L.bottom <= L.top) return;

      type(LARGE);

      p.textAlign(p.CENTER, p.CENTER);

      p.text(
        "←",
        Math.max(
          20,
          p.width * 0.045
        ),
        L.centerY
      );

      p.text(
        "→",
        p.width - Math.max(
          20,
          p.width * 0.045
        ),
        L.centerY
      );
    }

    // ========================================
    // 19 — PLAY / PAUSE
    // ========================================

    function drawPlayIcon(x, y) {

      p.noStroke();
      p.fill(255);

      if (player.paused) {

        p.triangle(
          x - 5, y - 7,
          x - 5, y + 7,
          x + 6, y
        );

      } else {

        p.rect(
          x - 5,
          y - 7,
          3, 14
        );

        p.rect(
          x + 2,
          y - 7,
          3, 14
        );
      }
    }

    // ========================================
    // 20 — ALBUM INFORMATION
    // ========================================

    function drawInformation() {

      const L = layout();
      const album = albums[current];

      const m = L.margin;
      const w = L.width;
      const top = L.infoTop;

      line(
        m, top,
        p.width - m, top
      );

      type(LARGE);

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(
          album.name,
          w - 65
        ),
        m,
        top + 24
      );

      type();

      p.textAlign(p.RIGHT, p.CENTER);

      p.text(
        album.year,
        p.width - m,
        top + 24
      );

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(
          album.structure +
          " / " +
          album.track,
          w
        ),
        m,
        top + 49
      );

      // Metadata grid.

      const gy = top + 64;
      const rh = 31;
      const cw = w / 3;

      for (let i = 0; i < 3; i++) {

        line(
          m,
          gy + i * rh,
          p.width - m,
          gy + i * rh
        );
      }

      for (let i = 1; i < 3; i++) {

        line(
          m + i * cw,
          gy,
          m + i * cw,
          gy + rh * 2
        );
      }

      const labels = [
        "Release",
        "Duration",
        "My rating"
      ];

      const values = [
        album.release,
        album.duration,
        ratings[current] === null
          ? "—/10"
          : ratings[current] + "/10"
      ];

      type();

      p.textAlign(p.LEFT, p.CENTER);

      for (let i = 0; i < 3; i++) {

        const x =
          m + i * cw + 7;

        p.text(
          fittedText(
            labels[i],
            cw - 14
          ),
          x,
          gy + rh / 2
        );

        p.text(
          fittedText(
            values[i],
            cw - 14
          ),
          x,
          gy + rh * 1.5
        );
      }

      ratingBox = {
        x: m + cw * 2,
        y: gy,
        w: cw,
        h: rh * 2
      };

      // Audio timeline.

      const ty = top + 158;

      const duration = getDuration();
      const seconds = player.currentTime || 0;

      const timeText =
        timestamp(seconds) +
        " / " +
        timestamp(duration);

      drawPlayIcon(
        m + 8,
        ty - 14
      );

      type();

      const timeWidth =
        p.textWidth(timeText);

      let trackLabel = album.track;

      if (audioError) {

        trackLabel = audioError;

      } else if (loading) {

        trackLabel = "Loading…";
      }

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(
          trackLabel,
          Math.max(
            1,
            w - timeWidth - 45
          )
        ),
        m + 26,
        ty - 14
      );

      p.textAlign(p.RIGHT, p.CENTER);

      p.text(
        timeText,
        p.width - m,
        ty - 14
      );

      playBox = {
        x: m,
        y: ty - 28,
        w: Math.max(
          24,
          w - timeWidth - 10
        ),
        h: 22
      };

      p.noStroke();

      p.fill(65);
      p.rect(m, ty, w, 4);

      const progress = saturate(
        seconds / duration
      );

      p.fill(255);

      p.rect(
        m,
        ty,
        w * progress,
        4
      );

      trackBox = {
        x: m,
        y: ty - 5,
        w,
        h: 15
      };
    }

    // ========================================
    // 21 — ALBUM TIMELINE
    // ========================================

    function drawTimeline() {

      const m = layout().margin;
      const y = p.height - 39;

      const cell =
        (p.width - m * 2) / 10;

      swatches = [];

      for (let i = 0; i < 10; i++) {

        const x = m + i * cell;

        const w = Math.max(
          1,
          cell - 3
        );

        p.noStroke();

        p.fill(albums[i].colors[0]);
        p.rect(x, y, w, 16);

        if (i === current) {

          p.noFill();

          p.stroke(255);
          p.strokeWeight(1.4);

          p.rect(
            x - 1,
            y - 1,
            w + 2,
            18
          );

          p.noStroke();
        }

        type();

        p.textAlign(
          p.CENTER,
          p.CENTER
        );

        p.text(
          String(i + 1).padStart(2, "0"),
          x + w / 2,
          y + 28
        );

        swatches.push({
          x,
          y: y - 4,
          w,
          h: 43
        });
      }
    }

    // ========================================
    // 22 — RESET MOVEMENT
    // ========================================

    function resetMovement() {

      for (const tile of tiles) {

        tile.dx = 0;
        tile.dy = 0;

        tile.targetX = 0;
        tile.targetY = 0;

        tile.signal = 0;
        tile.impulse = 0;

        tile.pendingBeat = -1;
        tile.lastBeat = -1;
        tile.beatTime = 0;
      }
    }

    // ========================================
    // 23 — ALBUM SWITCHING
    // ========================================

    function changeAlbum(
      index,
      autoplay = false
    ) {

      playRequest++;

      player.pause();

      current =
        ((index % 10) + 10) % 10;

      clock = 0;

      audioError = "";
      loading = false;

      resetAnalysis();

      player.src =
        "./audio/" +
        albums[current].file;

      player.load();

      palette =
        albums[current].colors.map(rgb);

      buildShape();

      resetMovement();

      if (autoplay) {
        playAudio();
      }
    }

    // ========================================
    // 24 — AUDIO SEEKING
    // ========================================

    function seekAudio(x) {

      if (!trackBox) return;

      if (
        !Number.isFinite(player.duration) ||
        player.duration <= 0
      ) {
        return;
      }

      const progress = clamp(
        (x - trackBox.x) / trackBox.w,
        0,
        0.99999
      );

      player.currentTime =
        progress * player.duration;

      resetAnalysis();
      resetMovement();
    }

    // ========================================
    // 25 — SETUP
    // ========================================

    p.setup = function () {

      p.createCanvas(
        p.windowWidth,
        p.windowHeight
      );

      p.pixelDensity(1);
      p.frameRate(60);

      p.imageMode(p.CENTER);
      p.rectMode(p.CORNER);

      p.textFont(FONT);
      p.textStyle(p.NORMAL);

      p.noStroke();

      makeTextures();

      changeAlbum(0, false);
    };

    // ========================================
    // 26 — DRAW LOOP
    // ========================================

    p.draw = function () {

      p.background(0);

      const playing =
        !player.paused &&
        !player.ended &&
        !loading;

      if (playing) {

        const dt =
          Math.min(
            p.deltaTime,
            50
          ) / 1000;

        clock += dt;

        const a = readAudio(dt);

        for (const tile of tiles) {

          updateMovement(
            tile,
            a,
            dt
          );
        }
      }

      updateTextures(audio);

      drawShape(audio);

      drawHeader();
      drawArrows();
      drawInformation();
      drawTimeline();

      const L = layout();

      const overNavigation =
        p.mouseY > L.headerHeight &&
        p.mouseY < L.infoTop;

      const overSwatch = swatches.some(
        box =>
          inside(
            box,
            p.mouseX,
            p.mouseY
          )
      );

      const overRating = inside(
        ratingBox,
        p.mouseX,
        p.mouseY
      );

      const overTrack = inside(
        trackBox,
        p.mouseX,
        p.mouseY
      );

      const overPlay = inside(
        playBox,
        p.mouseX,
        p.mouseY
      );

      p.cursor(
        overNavigation ||
        overSwatch ||
        overRating ||
        overTrack ||
        overPlay
          ? p.HAND
          : p.ARROW
      );
    };

    // ========================================
    // 27 — MOUSE INTERACTION
    // ========================================

    p.mousePressed = function () {

      const x = p.mouseX;
      const y = p.mouseY;

      for (
        let i = 0;
        i < swatches.length;
        i++
      ) {

        if (inside(swatches[i], x, y)) {

          if (i === current) {

            togglePlayback();

          } else {

            changeAlbum(i, true);
          }

          return;
        }
      }

      // Rating.

      if (inside(ratingBox, x, y)) {

        const rating = ratings[current];

        ratings[current] =
          rating === null
            ? 0
            : rating === 10
              ? null
              : rating + 1;

        return;
      }

      // Timeline.

      if (inside(trackBox, x, y)) {

        scrubbing = true;

        seekAudio(x);

        return;
      }

      // Play button.

      if (inside(playBox, x, y)) {

        togglePlayback();

        return;
      }

      // Sculpture and navigation.

      const L = layout();

      if (
        y > L.headerHeight &&
        y < L.infoTop
      ) {

        if (x < p.width * 0.15) {

          changeAlbum(
            current - 1,
            true
          );

        } else if (
          x > p.width * 0.85
        ) {

          changeAlbum(
            current + 1,
            true
          );

        } else {

          togglePlayback();
        }
      }
    };

    p.mouseDragged = function () {

      if (scrubbing) {

        seekAudio(p.mouseX);

        return false;
      }
    };

    p.mouseReleased = function () {

      scrubbing = false;
    };

    // ========================================
    // 28 — KEYBOARD INTERACTION
    // ========================================

    p.keyPressed = function () {

      if (
        p.keyCode === p.RIGHT_ARROW
      ) {

        changeAlbum(
          current + 1,
          true
        );

        return false;
      }

      if (
        p.keyCode === p.LEFT_ARROW
      ) {

        changeAlbum(
          current - 1,
          true
        );

        return false;
      }

      if (p.key === " ") {

        togglePlayback();

        return false;
      }

      if (
        p.key === "r" ||
        p.key === "R"
      ) {

        if (player.readyState > 0) {

          player.currentTime = 0;
        }

        clock = 0;

        resetAnalysis();
        resetMovement();
      }

      if (
        p.key === "s" ||
        p.key === "S"
      ) {

        p.saveCanvas(
          "bjork-" +
          albums[current].name.toLowerCase(),
          "png"
        );
      }
    };

    // ========================================
    // 29 — RESPONSIVE CANVAS
    // ========================================

    p.windowResized = function () {

      p.resizeCanvas(
        p.windowWidth,
        p.windowHeight
      );
    };

  };

  new p5(sketch);

})();

