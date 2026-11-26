
/*
  BJÖRK — CHROMATIC ARCHIVE
  V19 — FINAL REFINEMENT

  10 albums / 10 sonic sculptures
  Individual movement systems
  Variable musical choreography
  Animated gradients
  Helvetica Regular / 16 & 28 px
*/

(function () {
  "use strict";

  // =====================================
  // SETTINGS
  // =====================================

  const FONT = "Helvetica";
  const SMALL = 16;
  const LARGE = 28;

  const STEP = 0.24;
  const HOLD = 0.09;
  const GLITCH = 0.25;
  const GRADIENT_SPEED = 1.4;
  const ARTWORK_SCALE = 1.08;

  const LOOP = 180;
  const GRID = 6;

  // =====================================
  // ALBUM ARCHIVE
  // =====================================

  const albums = [
    {
      name: "Debut",
      year: 1993,
      release: "05.07.1993",
      duration: "~54 min",
      structure: "Displacement",
      track: "Crying",
      seconds: 290.9,
      colors: ["#E7D8C0", "#A79B86", "#514D42", "#151412"]
    },
    {
      name: "Post",
      year: 1995,
      release: "12.06.1995",
      duration: "~46 min",
      structure: "Collision",
      track: "Hyper-ballad",
      seconds: 321.5,
      colors: ["#F22D80", "#FF6A2D", "#F5A43C", "#2363AE"]
    },
    {
      name: "Homogenic",
      year: 1997,
      release: "22.09.1997",
      duration: "~43 min",
      structure: "Compression",
      track: "Bachelorette",
      seconds: 312.7,
      colors: ["#DCECF0", "#7196C5", "#E52C4C", "#242037"]
    },
    {
      name: "Vespertine",
      year: 2001,
      release: "27.08.2001",
      duration: "~55 min",
      structure: "Crystallization",
      track: "Hidden Place",
      seconds: 328.3,
      colors: ["#F4F7FA", "#C4DBEC", "#B0B9D7", "#E1C7DA"]
    },
    {
      name: "Medúlla",
      year: 2004,
      release: "30.08.2004",
      duration: "~46 min",
      structure: "Resonance",
      track: "Oceania",
      seconds: 204.2,
      colors: ["#D6BBA7", "#806456", "#3A3036", "#C9999C"]
    },
    {
      name: "Volta",
      year: 2007,
      release: "07.05.2007",
      duration: "~51 min",
      structure: "Eruption",
      track: "Wanderlust",
      seconds: 351.0,
      colors: ["#FF432D", "#FFAB27", "#EFD842", "#43C8A2"]
    },
    {
      name: "Biophilia",
      year: 2011,
      release: "05.10.2011",
      duration: "~49 min",
      structure: "Orbital system",
      track: "Moon",
      seconds: 340.9,
      colors: ["#A86FCE", "#E8A35C", "#D5B3E4", "#7C4EAD"]
    },
    {
      name: "Vulnicura",
      year: 2015,
      release: "20.01.2015",
      duration: "~58 min",
      structure: "Fracture",
      track: "Black Lake",
      seconds: 608.9,
      colors: ["#F5DF32", "#FF68AF", "#C55DE0", "#F8A3C8"]
    },
    {
      name: "Utopia",
      year: 2017,
      release: "24.11.2017",
      duration: "~72 min",
      structure: "Dispersion",
      track: "Arisen My Senses",
      seconds: 300.0,
      colors: ["#E5B7C9", "#B5D7D0", "#F4D5BD", "#9BADD5"]
    },
    {
      name: "Fossora",
      year: 2022,
      release: "30.09.2022",
      duration: "~55 min",
      structure: "Network",
      track: "Mycelia",
      seconds: 120.2,
      colors: ["#AD6B9D", "#DA91C5", "#A2B875", "#65517D"]
    }
  ];

  // =====================================
  // EMBEDDED MUSICAL DATA
  // Bass / Mid / High / Activity
  // =====================================

  const encodedAudio = [

    // 01 — Crying
    `
    06081215 20101824 37172936 41213139
    41323242 40253040 29212835 29212336
    30182133 37414849 40394950 35484448
    33172931 38173238 42183241 40243140
    41283444 38243440 41263542 37202839
    29222533 27192033 34283642 38394448
    37424948 36515658 36446161 42415862
    38385155 41374957 39384552 40404853
    37434249 41393147 42202133 42202133
    24363342 20413040 22413243 19383139
    21403242 25412737 22411625 09421520
    02281216 00261011 01291013 01030305
    `,

    // 02 — Hyper-ballad
    `
    30010102 72010102 75021010 79031212
    79111515 78181616 78181818 79252021
    78232121 77262424 19162322 76354236
    92335842 97394739 92397252 91234232
    76051816 79152321 78272726 77242723
    77262927 79293230 79333634 36263229
    55364139 99345850 99335649 99366056
    99367461 99417165 99368066 99316861
    99306557 98295548 99295648 94154740
    94144338 99225146 98234948 99202731
    91181819 56181815 07181814 04121406
    05121004 04111405 05110904 02050402
    `,

    // 03 — Bachelorette
    `
    06143016 56493449 44423449 46423450
    99584570 94575275 99665782 88769394
    95768291 90829999 85999999 88839999
    87859999 60684258 53594759 50754655
    53798779 61819283 63969999 95999499
    96979999 95839999 99849999 99759999
    95859999 91999999 90999999 88999999
    73804873 57624358 56995063 59997986
    61989993 72999997 93999999 99999999
    96999999 95999999 99999999 99999999
    98999999 89939999 71697682 31695355
    08292223 01080605 00020302 00000000
    `,

    // 04 — Hidden Place
    `
    47170222 46170221 45251429 49231227
    46312536 48322340 54352746 72513862
    94564368 91564166 95564368 48501536
    34491033 46392344 54423755 49554060
    52412548 50474060 53474162 50584771
    67756083 93626484 94626683 93596380
    58403958 39423250 41533256 41573354
    16454139 13474447 18583450 23515055
    39594160 42523355 43734668 60755779
    92666686 91646886 90727592 88776892
    94646685 87697491 93647188 55373758
    35332341 16271122 03210411 00040102
    `,

    // 05 — Oceania
    `
    12150711 47533650 43545248 37496254
    45402542 48272339 34675958 07616345
    34596461 52604163 48332739 34609669
    40655764 40564855 42322534 43774063
    29889371 01465427 29475653 38515061
    14141314 20232431 20442139 18323239
    22312939 40715572 39867491 37696568
    32556667 40273544 35486566 22885958
    00464230 31394243 40636170 42524856
    45555559 47506969 39598967 45483952
    45473649 44383241 16221921 09190907
    08150807 05110504 05140704 00010000
    `,

    // 06 — Wanderlust
    `
    06652022 04631522 10623536 09613637
    31575656 30665759 36655757 35605962
    49466262 63827882 63697279 62806580
    64828279 68729994 69817982 69706277
    60755369 41584052 42633751 42769179
    43779983 42666467 42719072 51598878
    63605768 75634563 64909390 65818990
    65826683 67807176 70748994 69798591
    68716480 77726880 98739699 95949399
    95807695 96686283 98486687 95806887
    96657596 85817491 07283122 04454435
    03604844 04594340 02261716 04100510
    `,

    // 07 — Moon
    `
    00100604 00110504 02120604 15511521
    15521820 16522323 11542227 12472124
    14452023 11581925 30150106 31200107
    32220107 31110106 46411221 33350615
    40592232 47421219 15572534 42602836
    15572528 47773045 40895357 35966156
    47995651 30060306 25541926 48652735
    26652535 47672938 36984559 50996968
    39995572 52602233 59773344 62431420
    29481417 27541826 28693836 41532326
    25975760 28996877 41632538 51331416
    53340514 46290211 41240109 00000000
    `,

    // 08 — Black Lake
    `
    06090302 08110303 01240606 01280707
    02250807 01270806 04090402 03070402
    01270808 04420912 02110604 01060503
    01371213 08300810 05070103 04050102
    02150405 04361012 07281314 06512121
    17592925 09231811 07221710 13393318
    02532922 12642425 18491916 02432117
    05481716 04060102 06120404 21714034
    26813736 20945038 23634526 21354411
    22424110 14473612 02593223 10492819
    09502417 08120805 03070603 00111004
    01080803 01070502 01070402 01020100
    `,

    // 09 — Arisen My Senses
    `
    11042417 11031712 63370928 32351923
    45525650 76997885 58829981 91868885
    69928989 85938492 99907486 68679075
    92757881 99877385 61958979 93827776
    85587970 71848979 99808188 70949595
    99887293 99927685 58999885 72513941
    88584743 22423831 10645635 61594839
    45523138 75898391 99979399 99859896
    92909693 39877174 63998483 99709991
    99649687 74909791 12955153 13845450
    30965956 58926868 81897384 67936578
    71858072 68915770 36733750 26060713
    `,

    // 10 — Mycelia
    `
    05150104 03170103 05420609 04370709
    18420713 36510722 25360415 13320412
    16320413 07200209 03170103 06290406
    04420609 04370709 11450717 96891555
    25240714 10240308 13240410 12420515
    27800924 38991443 31791029 41791432
    40931735 39991436 43991535 32791630
    33891128 33891231 34961436 34911332
    04340418 00330308 00390508 00520812
    00460811 09560916 83991862 40351024
    11450817 13430817 10330513 35711125
    58931948 37901674 05240314 00000000
    `
  ];

  const audioData = encodedAudio.map(track =>
    track.trim().split(/\s+/).map(row => [
      Number(row.slice(0, 2)) / 99,
      Number(row.slice(2, 4)) / 99,
      Number(row.slice(4, 6)) / 99,
      Number(row.slice(6, 8)) / 99
    ])
  );

  // =====================================
  // HELPERS
  // =====================================

  const sq = x => x * x;

  const clamp = (x, a, b) =>
    Math.max(a, Math.min(b, x));

  const mix = (a, b, t) =>
    a + (b - a) * t;

  function hash(n) {
    const v =
      Math.sin(n * 127.1 + 31.7) * 43758.5453;

    return v - Math.floor(v);
  }

  function gauss(x, y, cx, cy, sx, sy) {
    return Math.exp(
      -(sq(x - cx) / sx + sq(y - cy) / sy)
    );
  }

  function bell(x, width) {
    return Math.exp(-sq(x) / width);
  }

  function rgb(hex) {
    return [1, 3, 5].map(i =>
      parseInt(hex.slice(i, i + 2), 16)
    );
  }

  function timestamp(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return m + ":" + String(s).padStart(2, "0");
  }

  function inside(box, x, y) {
    return box &&
      x >= box.x &&
      x <= box.x + box.w &&
      y >= box.y &&
      y <= box.y + box.h;
  }

  // =====================================
  // P5 INSTANCE
  // =====================================

  const sketch = function (p) {

    let current = 0;
    let clock = 0;
    let trackClock = 0;
    let loopIndex = 0;
    let paused = false;

    let tiles = [];
    let palette = [];
    let textures = [];
    let swatches = [];

    let ratingBox = null;
    let trackBox = null;

    let artworkWidth = 12;
    let artworkHeight = 12;

    const ratings = Array(10).fill(null);

    const RES = 64;
    const TEXTURES = 16;

    const baseCounts = [
      28, 32, 40, 20, 29,
      35, 24, 40, 18, 27
    ];

    const glitchFactors = [
      0.7, 1.2, 0.8, 0.3, 0.4,
      1.3, 0.3, 0.25, 0.6, 0.7
    ];

    // ===================================
    // MUSICAL DATA
    // ===================================

    function audioAt(time) {
      const rows = audioData[current];

      const v = clamp(
        time / LOOP * (rows.length - 1),
        0,
        rows.length - 1
      );

      const a = Math.floor(v);
      const b = Math.min(a + 1, rows.length - 1);

      return rows[a].map((value, i) =>
        mix(value, rows[b][i], v - a)
      );
    }

    function averageAudio() {
      const rows = audioData[current];
      const avg = [0, 0, 0, 0];

      for (const row of rows) {
        for (let i = 0; i < 4; i++) {
          avg[i] += row[i] / rows.length;
        }
      }

      return avg;
    }

    // ===================================
    // TEN SPATIAL SYSTEMS
    // ===================================

    function shapeScore(x, y, avg, variation) {

      const bass = avg[0];
      const mid = avg[1];
      const high = avg[2];
      const rhythm = avg[3];

      const r = Math.hypot(x, y);
      const angle = Math.atan2(y, x);

      switch (current) {

        // 01 — DEBUT
        // Displacement

        case 0: {
          const slope = 0.75 + bass * 0.65;

          const diagonal = bell(
            x - y * slope,
            1.8 + mid * 4
          );

          const a = gauss(x, y, -3, -3, 7, 5);
          const b = gauss(x, y, 3, 3, 6, 7);

          const steps =
            Math.abs(x - Math.round(y / 2) * 2) <= 1
              ? 0.3 : 0;

          return diagonal * 0.75 +
            a * 0.45 +
            b * 0.45 +
            steps -
            r * 0.035;
        }

        // 02 — POST
        // Collision

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

          const d = gauss(x, y, -3, 3, 4, 4);

          return Math.max(a, b, c, d) * 0.9 +
            bell(x - y, 4) * 0.2 +
            variation * 0.22 -
            r * 0.02;
        }

        // 03 — HOMOGENIC
        // Compression

        case 2: {
          if (Math.abs(x) > 5 || Math.abs(y) > 5) {
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
            Math.abs(x) > 2 || Math.abs(y) > 3
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

        // 04 — VESPERTINE
        // Crystallization

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
            (x + y + 30) % 3 === 0 ? 0.18 : 0;

          return crystal * 0.9 +
            gauss(x, y, 0, 0, 14, 14) * 0.22 +
            variation * 0.16 -
            gap -
            r * 0.035;
        }

        // 05 — MEDÚLLA
        // Resonance

        case 4: {
          const width = 4.1 + bass * 2;
          const height = 2.7 + mid * 2;

          const ellipse = Math.sqrt(
            sq(x / width) + sq(y / height)
          );

          const shell = bell(
            ellipse - 1,
            0.035 + high * 0.07
          );

          const inner = bell(ellipse - 0.55, 0.02);

          return shell * 0.95 +
            inner * mid * 0.6 +
            variation * 0.15 -
            (ellipse < 0.4 ? 0.5 : 0);
        }

        // 06 — VOLTA
        // Eruption

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

        // 07 — BIOPHILIA
        // Orbital system

        case 6: {
          const radiusA = 2.0 + mid * 1.4;
          const radiusB = 4.4 + bass * 1.5;

          const ringA = bell(r - radiusA, 0.45);
          const ringB = bell(r - radiusB, 0.55);

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

        // 08 — VULNICURA
        // Fracture

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

          if (Math.abs(x - fracture) < gap) {
            return -Infinity;
          }

          return Math.max(left, right) +
            variation * 0.17 -
            r * 0.02;
        }

        // 09 — UTOPIA
        // Dispersion

        case 8: {
          const spread = 3.0 + high * 2;

          const a = gauss(x, y, -spread, -3, 4, 2);
          const b = gauss(x, y, spread, -2, 3, 4);
          const c = gauss(x, y, -2, 2, 5, 3);
          const d = gauss(x, y, 3, 4, 4, 2);
          const e = gauss(x, y, 0, -1, 2, 2);
          const f = gauss(x, y, -4, 4, 2, 2);

          return Math.max(a, b, c, d, e, f) +
            variation * 0.26;
        }

        // 10 — FOSSORA
        // Network

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

    // ===================================
    // BUILD SCULPTURE
    // ===================================

    function buildShape() {
      const avg = averageAudio();
      const rows = audioData[current];

      const energy =
        (avg[0] + avg[1] + avg[2]) / 3;

      const candidates = [];

      let count = Math.round(
        baseCounts[current] + energy * 45
      );

      if (current === 2) count = 72;

      for (let y = -GRID; y <= GRID; y++) {
        for (let x = -GRID; x <= GRID; x++) {

          const variation = hash(
            (x + 9) * 29 +
            (y + 9) * 13 +
            current * 103
          );

          const band =
            y > 1 ? 0 : y < -1 ? 2 : 1;

          const sample = Math.floor(
            (x + GRID) / (GRID * 2) *
            (rows.length - 1)
          );

          const local = rows[sample];

          let score = shapeScore(
            x, y, avg, variation
          );

          if (!Number.isFinite(score)) continue;

          score += local[band] * 0.14;
          score += local[3] * variation * 0.12;

          candidates.push({
            x, y, band, score
          });
        }
      }

      candidates.sort(
        (a, b) => b.score - a.score
      );

      tiles = candidates.slice(0, count).map((q, i) => {

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
          phase: hash(seed * 419) * 2,
          direction: seed > 0.5 ? 1 : -1,
          events: []
        };
      });

      if (tiles.length) {
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
        }
      }

      buildChoreography();
    }

    // ===================================
    // GRADIENT TEXTURES
    // ===================================

    function makeTextures() {
      textures = [];

      for (let i = 0; i < TEXTURES; i++) {
        const g = p.createGraphics(RES, RES);

        g.pixelDensity(1);
        textures.push(g);
      }
    }

    function updateTextures(audio) {

      const activity = audio[3];

      const directions = [
        [0, 0, 0, RES],
        [0, RES, 0, 0],
        [0, 0, RES, 0],
        [RES, 0, 0, 0]
      ];

      for (let i = 0; i < TEXTURES; i++) {

        const g = textures[i];
        const ctx = g.drawingContext;

        const a = palette[i % 4];

        const b = palette[
          (i + 1 + Math.floor(i / 8)) % 4
        ];

        const wave = (
          Math.sin(
            clock * GRADIENT_SPEED + i * 1.13
          ) * 0.75 +
          Math.sin(
            clock * 0.173 + i * 0.67
          ) * 0.25
        ) * (0.28 + activity * 0.18);

        const gradient = ctx.createLinearGradient(
          ...directions[i % 4]
        );

        for (let k = 0; k <= 16; k++) {

          const u = k / 16;

          let t = clamp(u + wave, 0, 1);

          t = t * t * (3 - 2 * t);

          const color = a.map((value, c) =>
            Math.round(mix(value, b[c], t))
          );

          gradient.addColorStop(
            u,
            "rgb(" + color.join(",") + ")"
          );
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, RES, RES);
      }
    }

    // ===================================
    // INDIVIDUAL MOVEMENT IDENTITIES
    // ===================================

    function movementProfile(tile) {

      const x = tile.x;
      const y = tile.y;
      const d = tile.direction;

      const sx = x >= 0 ? 1 : -1;
      const sy = y >= 0 ? 1 : -1;

      const radius = Math.hypot(x, y);

      let speed = 1;
      let offset = tile.phase;
      let intensity = 1;
      let groupSeed = tile.seed;

      let routes = [];

      switch (current) {

        // 01 — DEBUT
        // Cascading diagonal sequences.

        case 0: {

          speed = 1.05;
          offset = (x + y + 14) * 0.12;

          groupSeed = hash(
            Math.round(x + y) * 17
          );

          routes = [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0]
            ],
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [1, 0],
              [2, 0],
              [1, 0],
              [0, 0]
            ]
          ];

          break;
        }

        // 02 — POST
        // Contrasting horizontal collisions.

        case 1: {

          speed = 1.45;

          const row = Math.round(y);

          const direction =
            row % 2 === 0 ? 1 : -1;

          offset = (row + 8) * 0.07;
          groupSeed = hash(row * 29);

          routes = [
            [
              [0, 0],
              [direction, 0],
              [direction * 2, 0],
              [direction, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [-direction, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [direction, 0],
              [direction, 0],
              [0, 0]
            ]
          ];

          break;
        }

        // 03 — HOMOGENIC
        // Bachelorette signature.

        case 2: {

          speed = 1.15;
          offset = tile.phase;

          routes = [
            [
              [0, 0],
              [0, -1],
              [1, -1],
              [1, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [0, -1],
              [1, -1],
              [1, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [0, -1],
              [1, -1],
              [1, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [0, -1],
              [0, 0]
            ]
          ];

          break;
        }

        // 04 — VESPERTINE
        // Delicate, isolated movements.

        case 3: {

          speed = 1.3;
          intensity = 0.55;

          offset = tile.phase * 1.5;

          routes = [
            [
              [0, 0],
              [0, d],
              [0, d],
              [0, 0]
            ],
            [
              [0, 0],
              [d, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [0, -d],
              [0, 0]
            ]
          ];

          break;
        }

        // 05 — MEDÚLLA
        // Collective breathing.

        case 4: {

          speed = 0.65;
          offset = 0.1;
          groupSeed = 0.43;

          const horizontal =
            Math.abs(x) >= Math.abs(y);

          const dx = horizontal ? sx : 0;
          const dy = horizontal ? 0 : sy;

          routes = [
            [
              [0, 0],
              [dx, dy],
              [dx, dy],
              [0, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [-dx, -dy],
              [-dx, -dy],
              [0, 0]
            ],
            [
              [0, 0],
              [dx, dy],
              [dx, dy],
              [dx, dy],
              [0, 0]
            ]
          ];

          break;
        }

        // 06 — VOLTA
        // Outward eruptions.

        case 5: {

          speed = 1.5;
          offset = radius * 0.09;

          groupSeed = hash(
            Math.round(radius) * 41
          );

          const horizontal =
            Math.abs(x) >= Math.abs(y);

          const dx = horizontal ? sx : 0;
          const dy = horizontal ? 0 : sy;

          routes = [
            [
              [0, 0],
              [dx, dy],
              [dx * 2, dy * 2],
              [dx, dy],
              [0, 0]
            ],
            [
              [0, 0],
              [dx, dy],
              [0, 0]
            ],
            [
              [0, 0],
              [dx, dy],
              [dx * 2, dy * 2],
              [dx * 2, dy * 2],
              [dx, dy],
              [0, 0]
            ]
          ];

          break;
        }

        // 07 — BIOPHILIA
        // Mathematical orbital movements.

        case 6: {

          speed = 0.95;

          const angle = Math.atan2(y, x);

          offset =
            (angle + Math.PI) /
            (Math.PI * 2) * 1.1;

          const ring = Math.round(radius);

          const direction =
            ring % 2 === 0 ? 1 : -1;

          groupSeed = hash(ring * 61);

          let tx;
          let ty;

          if (Math.abs(x) > Math.abs(y)) {
            tx = 0;
            ty = sx * direction;
          } else {
            tx = -sy * direction;
            ty = 0;
          }

          const nx = -ty;
          const ny = tx;

          routes = [
            [
              [0, 0],
              [tx, ty],
              [tx + nx, ty + ny],
              [nx, ny],
              [0, 0]
            ],
            [
              [0, 0],
              [nx, ny],
              [tx + nx, ty + ny],
              [tx, ty],
              [0, 0]
            ],
            [
              [0, 0],
              [tx, ty],
              [tx, ty],
              [0, 0]
            ]
          ];

          break;
        }

        // 08 — VULNICURA
        // Separation and prolonged tension.

        case 7: {

          speed = 0.55;
          offset = 0.15;
          groupSeed = 0.35;

          routes = [
            [
              [0, 0],
              [sx, 0],
              [sx * 2, 0],
              [sx, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [sx, 0],
              [sx, 0],
              [sx, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [sx, 0],
              [sx * 2, 0],
              [sx * 2, 0],
              [sx * 2, 0],
              [sx, 0],
              [0, 0]
            ]
          ];

          break;
        }

        // 09 — UTOPIA
        // Independent floating clusters.

        case 8: {

          speed = 0.85;

          const clusterX =
            Math.floor((x + 8) / 4);

          const clusterY =
            Math.floor((y + 8) / 4);

          const cluster =
            clusterX * 11 + clusterY;

          groupSeed = hash(cluster * 71);

          offset = groupSeed * 1.8;

          const direction =
            cluster % 2 === 0 ? 1 : -1;

          routes = [
            [
              [0, 0],
              [0, -1],
              [0, -2],
              [direction, -2],
              [direction, -1],
              [direction, 0],
              [0, 0]
            ],
            [
              [0, 0],
              [direction, 0],
              [direction, -1],
              [0, -1],
              [0, 0]
            ],
            [
              [0, 0],
              [0, -1],
              [0, -1],
              [0, 0]
            ]
          ];

          break;
        }

        // 10 — FOSSORA
        // Branching root propagation.

        case 9: {

          speed = 1.1;

          offset =
            (y + 8) * 0.13 +
            Math.abs(x) * 0.08;

          groupSeed = hash(
            Math.round(y) * 37
          );

          routes = [
            [
              [0, 0],
              [0, 1],
              [sx, 1],
              [sx, 2],
              [sx, 1],
              [0, 1],
              [0, 0]
            ],
            [
              [0, 0],
              [sx, 0],
              [sx, 1],
              [0, 1],
              [0, 0]
            ],
            [
              [0, 0],
              [0, 1],
              [0, 2],
              [0, 1],
              [0, 0]
            ]
          ];

          break;
        }
      }

      return {
        speed,
        offset,
        intensity,
        groupSeed,
        routes
      };
    }

    // ===================================
    // MUSICAL RESPONSE
    // ===================================

    function musicalResponse(audio) {

      const bass = audio[0];
      const mid = audio[1];
      const high = audio[2];
      const activity = audio[3];

      switch (current) {

        case 0:
          return mid * 0.4 + activity * 0.6;

        case 1:
          return bass * 0.65 + activity * 0.35;

        case 2:
          return activity;

        case 3:
          return high * 0.75 + activity * 0.25;

        case 4:
          return mid * 0.8 + activity * 0.2;

        case 5:
          return bass * 0.5 + activity * 0.5;

        case 6:
          return mid * 0.65 + high * 0.35;

        case 7:
          return mid * 0.7 + activity * 0.3;

        case 8:
          return high * 0.65 + activity * 0.35;

        case 9:
          return bass * 0.3 + mid * 0.7;

        default:
          return activity;
      }
    }

    // ===================================
    // VARIABLE CHOREOGRAPHY
    //
    // Every module receives a sequence of
    // movements with changing speeds,
    // paths, holds and resting periods.
    //
    // Sequences change on each new pass
    // through the musical data.
    // ===================================

    function buildChoreography() {

      for (const tile of tiles) {

        const profile = movementProfile(tile);

        const events = [];

        let time = Math.max(0, profile.offset);
        let index = 0;

        const baseSeed =
          profile.groupSeed * 10000 +
          current * 179 +
          loopIndex * 971.3;

        while (time < LOOP) {

          const seed =
            baseSeed + index * 83.71;

          const audio = audioAt(time);

          const response = musicalResponse(audio);

          const earlier = audioAt(
            Math.max(0, time - 0.7)
          );

          const change = Math.abs(
            response - musicalResponse(earlier)
          );

          // Changing movement probability.

          const probability = clamp(
            (
              0.12 +
              response * 0.75 +
              change * 0.35
            ) * profile.intensity,
            0,
            0.95
          );

          const active =
            hash(seed + 13.7) < probability;

          // Quiet sections receive longer pauses.

          if (!active) {

            const rest =
              0.25 +
              hash(seed + 39.1) * 0.9 +
              (1 - response) * 0.85;

            time += rest;
            index++;

            continue;
          }

          // Select an alternative route.

          const routeIndex = Math.floor(
            hash(seed + 61.2) *
            profile.routes.length
          );

          const route =
            profile.routes[routeIndex];

          // Vary speed without losing the
          // mechanical character.

          const variation =
            0.85 + hash(seed + 92.3) * 0.3;

          const musicalSpeed =
            0.8 + response * 0.4;

          const speed =
            profile.speed *
            variation *
            musicalSpeed;

          const moveDuration = STEP / speed;

          const holdDuration =
            HOLD / speed *
            (0.5 + hash(seed + 21.4) * 1.6);

          const segment =
            moveDuration + holdDuration;

          const duration =
            segment * (route.length - 1);

          // Complete every movement before
          // starting another one.

          if (time + duration > LOOP) {
            break;
          }

          events.push({
            start: time,
            end: time + duration,
            route,
            segment,
            moveDuration
          });

          // Irregular pauses prevent a
          // constant repeating rhythm.

          const rest =
            hash(seed + 118.4) *
            (0.2 + (1 - response) * 1.3);

          time += duration + rest;
          index++;
        }

        tile.events = events;
      }
    }

    // ===================================
    // PLAY CHOREOGRAPHY
    // ===================================

    function movement(tile) {

      const events = tile.events;

      let low = 0;
      let high = events.length - 1;

      // Find the active movement event.

      while (low <= high) {

        const middle =
          Math.floor((low + high) / 2);

        const event = events[middle];

        if (trackClock < event.start) {

          high = middle - 1;

        } else if (trackClock >= event.end) {

          low = middle + 1;

        } else {

          const local =
            trackClock - event.start;

          const step = Math.min(
            event.route.length - 2,
            Math.floor(local / event.segment)
          );

          const progress = clamp(
            (local - step * event.segment) /
            event.moveDuration,
            0,
            1
          );

          const a = event.route[step];
          const b = event.route[step + 1];

          return [
            mix(a[0], b[0], progress),
            mix(a[1], b[1], progress)
          ];
        }
      }

      return [0, 0];
    }

    // ===================================
    // SUBTLE GLITCH SYSTEM
    // ===================================

    function glitch(tile, index, audio) {

      const tick = Math.floor(clock * 7);

      const activity = audio[3];

      const amount =
        GLITCH * glitchFactors[current];

      const chance =
        (0.015 + activity * 0.15) * amount;

      let dx = 0;
      let dy = 0;

      const trigger = hash(
        tick * 83.1 +
        tile.seed * 1291 +
        loopIndex * 31
      );

      if (trigger < chance) {

        const axis = hash(
          tick * 3 + tile.seed * 61
        );

        const direction = hash(
          tick * 19 + tile.seed * 81
        ) > 0.5 ? 1 : -1;

        if (axis > 0.5) {
          dx = direction;
        } else {
          dy = direction;
        }
      }

      const dropout = hash(
        tick * 41 + tile.seed * 117
      );

      return {
        dx,
        dy,
        visible:
          dropout >= activity * 0.015 * amount
      };
    }

    // ===================================
    // RESPONSIVE LAYOUT
    // ===================================

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

      const movementPadding = [
        6, 6, 4, 4, 4,
        6, 4, 6, 6, 6
      ];

      const padding = movementPadding[current];

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
        width: Math.max(1, p.width - margin * 2)
      };
    }

    // ===================================
    // DRAW SCULPTURE
    // ===================================

    function drawShape(audio) {

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

        const move = movement(tile);
        const error = glitch(tile, i, audio);

        if (!error.visible) continue;

        const visibility =
          0.90 + audio[tile.band] * 0.10;

        if (tile.seed > visibility) continue;

        const x = p.width / 2 +
          (tile.x + move[0] + error.dx) * L.unit;

        const y = L.centerY +
          (tile.y + move[1] + error.dy) * L.unit;

        const texture =
          (tile.color + (i % 4) * 4) % TEXTURES;

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

    // ===================================
    // TYPOGRAPHY
    // ===================================

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

    // Fit longer text without introducing
    // another font size.

    function fittedText(value, maxWidth) {

      let text = String(value);

      if (p.textWidth(text) <= maxWidth) {
        return text;
      }

      while (
        text.length > 0 &&
        p.textWidth(text + "…") > maxWidth
      ) {
        text = text.slice(0, -1);
      }

      return text + "…";
    }

    // ===================================
    // HEADER
    // ===================================

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
        String(current + 1).padStart(2, "0") + "/10",
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

    // ===================================
    // NAVIGATION ARROWS
    // ===================================

    function drawArrows() {

      const L = layout();

      if (L.bottom <= L.top) return;

      type(LARGE);

      p.textAlign(p.CENTER, p.CENTER);

      p.text(
        "←",
        Math.max(20, p.width * 0.045),
        L.centerY
      );

      p.text(
        "→",
        p.width - Math.max(20, p.width * 0.045),
        L.centerY
      );
    }

    // ===================================
    // ALBUM INFORMATION
    //
    // Personal note section removed.
    // ===================================

    function drawInformation() {

      const L = layout();
      const album = albums[current];

      const m = L.margin;
      const w = L.width;
      const top = L.infoTop;

      line(m, top, p.width - m, top);

      // Album title.

      type(LARGE);

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(album.name, w - 65),
        m,
        top + 24
      );

      // Release year.

      type();

      p.textAlign(p.RIGHT, p.CENTER);

      p.text(
        album.year,
        p.width - m,
        top + 24
      );

      // Structural identity.

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(
          album.structure + " / " + album.track,
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

        const x = m + i * cw + 7;

        p.text(
          fittedText(labels[i], cw - 14),
          x,
          gy + rh / 2
        );

        p.text(
          fittedText(values[i], cw - 14),
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

      // Musical timeline.

      const ty = top + 158;

      const seconds =
        trackClock / LOOP * album.seconds;

      const timeText =
        timestamp(seconds) +
        " / " +
        timestamp(album.seconds);

      type();

      const timeWidth = p.textWidth(timeText);

      p.textAlign(p.LEFT, p.CENTER);

      p.text(
        fittedText(
          album.track,
          Math.max(1, w - timeWidth - 20)
        ),
        m,
        ty - 14
      );

      p.textAlign(p.RIGHT, p.CENTER);

      p.text(
        timeText,
        p.width - m,
        ty - 14
      );

      p.noStroke();

      p.fill(65);
      p.rect(m, ty, w, 4);

      p.fill(255);

      p.rect(
        m,
        ty,
        w * trackClock / LOOP,
        4
      );

      trackBox = {
        x: m,
        y: ty - 7,
        w,
        h: 18
      };
    }

    // ===================================
    // BOTTOM ALBUM TIMELINE
    // ===================================

    function drawTimeline() {

      const m = layout().margin;

      const y = p.height - 39;

      const cell =
        (p.width - m * 2) / 10;

      swatches = [];

      for (let i = 0; i < 10; i++) {

        const x = m + i * cell;
        const w = Math.max(1, cell - 3);

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

        p.textAlign(p.CENTER, p.CENTER);

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

    // ===================================
    // ALBUM SWITCHING
    // ===================================

    function changeAlbum(index) {

      current = ((index % 10) + 10) % 10;

      clock = 0;
      trackClock = 0;
      loopIndex = 0;

      palette = albums[current].colors.map(rgb);

      buildShape();
    }

    // ===================================
    // SETUP
    // ===================================

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
      changeAlbum(0);
    };

    // ===================================
    // DRAW LOOP
    // ===================================

    p.draw = function () {

      p.background(0);

      if (!paused) {

        const dt =
          Math.min(p.deltaTime, 50) / 1000;

        clock += dt;
        trackClock += dt;

        // Each pass through the song data
        // generates a different choreography.

        if (trackClock >= LOOP) {

          trackClock = trackClock % LOOP;

          loopIndex++;

          buildChoreography();
        }
      }

      const audio = audioAt(trackClock);

      updateTextures(audio);
      drawShape(audio);

      drawHeader();
      drawArrows();
      drawInformation();
      drawTimeline();

      // Interactive cursor.

      const L = layout();

      const overNavigation =
        p.mouseY > L.headerHeight &&
        p.mouseY < L.infoTop &&
        (
          p.mouseX < p.width * 0.15 ||
          p.mouseX > p.width * 0.85
        );

      const overSwatch = swatches.some(box =>
        inside(box, p.mouseX, p.mouseY)
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

      p.cursor(
        overNavigation ||
        overSwatch ||
        overRating ||
        overTrack
          ? p.HAND
          : p.ARROW
      );
    };

    // ===================================
    // MOUSE INTERACTION
    // ===================================

    p.mousePressed = function () {

      const x = p.mouseX;
      const y = p.mouseY;

      // Select album.

      for (let i = 0; i < swatches.length; i++) {

        if (inside(swatches[i], x, y)) {

          changeAlbum(i);
          return;
        }
      }

      // Change personal rating.

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

      // Scrub musical timeline.

      if (inside(trackBox, x, y)) {

        trackClock = clamp(
          (x - trackBox.x) / trackBox.w,
          0,
          0.99999
        ) * LOOP;

        return;
      }

      // Side navigation.

      const L = layout();

      if (
        y > L.headerHeight &&
        y < L.infoTop
      ) {

        if (x < p.width * 0.15) {

          changeAlbum(current - 1);

        } else if (x > p.width * 0.85) {

          changeAlbum(current + 1);
        }
      }
    };

    // ===================================
    // KEYBOARD INTERACTION
    // ===================================

    p.keyPressed = function () {

      if (p.keyCode === p.RIGHT_ARROW) {

        changeAlbum(current + 1);
        return false;
      }

      if (p.keyCode === p.LEFT_ARROW) {

        changeAlbum(current - 1);
        return false;
      }

      if (p.key === " ") {

        paused = !paused;
        return false;
      }

      if (p.key === "r" || p.key === "R") {

        clock = 0;
        trackClock = 0;
        loopIndex = 0;

        buildChoreography();
      }

      if (p.key === "s" || p.key === "S") {

        p.saveCanvas(
          "bjork-" + albums[current].name.toLowerCase(),
          "png"
        );
      }
    };

    // ===================================
    // RESPONSIVE CANVAS
    // ===================================

    p.windowResized = function () {

      p.resizeCanvas(
        p.windowWidth,
        p.windowHeight
      );
    };

  };

  new p5(sketch);

})();
