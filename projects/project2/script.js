
/*
  TRIBAL / TYPE — VERSION 04
  Experimental kinetic typography
  OpenProcessing / p5.js 2.0

  NEW:
  - Smooth choreographed Bézier movement
  - Wave-based timing
  - No bouncing / overshooting
  - Different square sizes
  - Letter -> Shape -> New Letter
  - Full-screen symmetrical tribal forms
  - One click = one transformation
  - No idle animation
*/

// =====================================
// TYPOGRAPHY
// =====================================

let fontFile = "Stanley-RegularIta.otf";

let letterSequence = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let startingLetterIndex = 0;

let letterFill = 0.88;

// =====================================
// SQUARE DESIGN
// =====================================

// Average square size
let squareSize = 12;

// Minimum and maximum size multipliers
let minSquareScale = 0.65;
let maxSquareScale = 1.45;

// Distance between squares
let squareSpacing = 15;

// Stroke thickness
let squareStroke = 1.1;

// =====================================
// ANIMATION
// =====================================

// Duration of one morph
let morphDuration = 2400;

// How much the movement is staggered
let waveDelay = 0.22;

// Amount of curve in the trajectories
let curveStrength = 0.26;

// Small variation between trajectories
let curveVariation = 0.25;

// =====================================
// TRIBAL SHAPES
// =====================================

let shapeFillX = 0.96;
let shapeFillY = 0.94;

// =====================================
// COLORS
// =====================================

let backgroundColor = "#F5F5F3";
let squareFill = "#FFFFFF";
let squareOutline = "#111111";

// =====================================
// GLOBALS
// =====================================

let customFont;
let tiles = [];

let ready = false;
let morphing = false;

let morphStart = 0;

let currentLetterIndex = 0;
let currentShapeIndex = 0;

// 0 = letter, 1 = tribal shape
let currentMode = 0;
let targetMode = 0;

let shapeNames = [
  "THORN",
  "WINGS",
  "SIGIL",
  "BLADE",
  "SPIDER",
  "FLAME"
];

// =====================================
// SETUP
// =====================================

async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(60);

  rectMode(CENTER);

  try {
    customFont = await loadFont(fontFile);
    console.log("Stanley font loaded");
  } catch (error) {
    customFont = "Georgia";
    console.warn("Using fallback font", error);
  }

  resetSketch();
  ready = true;
}

// =====================================
// RESET
// =====================================

function resetSketch() {
  tiles = [];

  morphing = false;
  currentMode = 0;
  targetMode = 0;

  currentLetterIndex =
    startingLetterIndex % letterSequence.length;

  currentShapeIndex = 0;

  let letter =
    letterSequence[currentLetterIndex];

  let points = createLetterPoints(letter);

  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Mostly medium-sized squares,
    // with occasional larger/smaller ones.
    let sizeScale = random(
      minSquareScale,
      maxSquareScale
    );

    // Make extremes less frequent
    sizeScale = lerp(
      1,
      sizeScale,
      0.75
    );

    tiles.push({
      x: p.x,
      y: p.y,

      startX: p.x,
      startY: p.y,

      targetX: p.x,
      targetY: p.y,

      size: squareSize * sizeScale,

      rotation: 0,

      // Timing depends partly on position
      // to create a spatial wave.
      delay: 0,

      curveSide: random() < 0.5 ? -1 : 1,

      curveFactor: random(
        1 - curveVariation,
        1 + curveVariation
      ),

      index: i
    });
  }
}

// =====================================
// CREATE LETTER POINTS
// =====================================

function createLetterPoints(letter) {
  let points = [];

  const refSize = 900;

  let pg = createGraphics(refSize, refSize);

  pg.pixelDensity(1);
  pg.background(255);
  pg.fill(0);
  pg.noStroke();

  pg.textFont(customFont);
  pg.textStyle(NORMAL);
  pg.textAlign(CENTER, CENTER);

  let fontSize = 620;
  pg.textSize(fontSize);

  while (
    pg.textWidth(letter) > refSize * 0.82
  ) {
    fontSize *= 0.92;
    pg.textSize(fontSize);
  }

  pg.text(
    letter,
    refSize / 2,
    refSize / 2
  );

  pg.loadPixels();

  let minX = refSize;
  let minY = refSize;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < refSize; y += 2) {
    for (let x = 0; x < refSize; x += 2) {
      let index = 4 * (x + y * refSize);

      if (pg.pixels[index] < 128) {
        minX = min(minX, x);
        maxX = max(maxX, x);
        minY = min(minY, y);
        maxY = max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    pg.remove();
    return points;
  }

  let inkWidth = maxX - minX;
  let inkHeight = maxY - minY;

  let scaleFactor = min(
    width * letterFill / inkWidth,
    height * letterFill / inkHeight
  );

  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;

  let drawWidth = inkWidth * scaleFactor;
  let drawHeight = inkHeight * scaleFactor;

  let left = width / 2 - drawWidth / 2;
  let top = height / 2 - drawHeight / 2;

  for (
    let y = top;
    y <= top + drawHeight;
    y += squareSpacing
  ) {
    for (
      let x = left;
      x <= left + drawWidth;
      x += squareSpacing
    ) {
      let sx = floor(
        centerX +
        (x - width / 2) / scaleFactor
      );

      let sy = floor(
        centerY +
        (y - height / 2) / scaleFactor
      );

      if (
        sx < 0 ||
        sy < 0 ||
        sx >= refSize ||
        sy >= refSize
      ) {
        continue;
      }

      let index = 4 * (sx + sy * refSize);

      if (pg.pixels[index] < 128) {
        points.push({ x, y });
      }
    }
  }

  pg.remove();

  return points;
}

// =====================================
// EXPERIMENTAL TRIBAL PATHS
// =====================================

function getTribalPaths(type) {

  // THORN
  if (type === 0) {
    return [
      [[0,0],[0.18,0.04],[0.62,0],[1,0]],
      [[0.08,0.08],[0.4,0.1],[0.78,0.32],[1,0.58]],
      [[1,0.58],[0.58,0.28],[0.3,0.42],[0.06,0.12]],
      [[0.06,0.12],[0.08,0.42],[0.04,0.78],[0,1]],
      [[0,0],[0.26,0.26],[0.66,0.66],[1,1]]
    ];
  }

  // WINGS
  if (type === 1) {
    return [
      [[0,0],[0.32,0.02],[0.76,0.04],[1,0.08]],
      [[1,0.08],[0.68,0.18],[0.56,0.44],[0.82,0.72]],
      [[0.82,0.72],[0.54,0.54],[0.2,0.28],[0.06,0.04]],
      [[0.06,0.04],[0.24,0.38],[0.54,0.8],[0.92,1]],
      [[0.92,1],[0.42,0.8],[0.16,0.42],[0,0]]
    ];
  }

  // SIGIL
  if (type === 2) {
    return [
      [[0,0],[0.24,0.3],[0.58,0.48],[0.88,0.1]],
      [[0.88,0.1],[1,0.02],[0.94,0.42],[0.66,0.66]],
      [[0.66,0.66],[0.36,0.92],[0.1,0.72],[0,0]],
      [[0,0],[0.38,0.1],[0.7,0.62],[1,1]],
      [[0.08,0.88],[0.32,0.98],[0.72,0.98],[1,0.86]]
    ];
  }

  // BLADE
  if (type === 3) {
    return [
      [[0,0],[0.2,0.02],[0.74,0.02],[1,0]],
      [[0,0],[0.26,0.18],[0.7,0.46],[1,0.96]],
      [[1,0.96],[0.66,0.6],[0.36,0.5],[0.12,0.12]],
      [[0.12,0.12],[0.22,0.46],[0.16,0.78],[0,1]],
      [[0.3,0.18],[0.6,0.1],[0.82,0.28],[1,0.5]]
    ];
  }

  // SPIDER
  if (type === 4) {
    return [
      [[0,0],[0.16,0.08],[0.66,0.02],[1,0]],
      [[0.06,0.1],[0.32,0.2],[0.74,0.24],[1,0.44]],
      [[0.08,0.12],[0.38,0.4],[0.76,0.54],[1,0.78]],
      [[0.08,0.12],[0.18,0.46],[0.46,0.76],[0.7,1]],
      [[0,0],[0.08,0.38],[0.04,0.72],[0,1]]
    ];
  }

  // FLAME
  return [
    [[0,0],[0.08,0.24],[0.22,0.74],[0.06,1]],
    [[0.06,1],[0.38,0.64],[0.42,0.32],[0.12,0.08]],
    [[0.12,0.08],[0.48,0.16],[0.7,0.7],[1,0.92]],
    [[1,0.92],[0.9,0.38],[0.62,0.08],[0,0]],
    [[0,0],[0.32,0.02],[0.72,0.02],[1,0]]
  ];
}

// =====================================
// CUBIC BÉZIER
// =====================================

function cubicPoint(path, t) {
  let a = path[0];
  let b = path[1];
  let c = path[2];
  let d = path[3];

  let u = 1 - t;

  return {
    x:
      u*u*u*a[0] +
      3*u*u*t*b[0] +
      3*u*t*t*c[0] +
      t*t*t*d[0],

    y:
      u*u*u*a[1] +
      3*u*u*t*b[1] +
      3*u*t*t*c[1] +
      t*t*t*d[1]
  };
}

// =====================================
// CREATE FULL-SCREEN TRIBAL SHAPE
// =====================================

function createTribalShape(type, count) {
  let result = [];

  let paths = getTribalPaths(type);

  let radiusX = width * shapeFillX / 2;
  let radiusY = height * shapeFillY / 2;

  let lengths = [];
  let totalLength = 0;

  for (let path of paths) {
    let length = 0;
    let prev = cubicPoint(path, 0);

    for (let j = 1; j <= 100; j++) {
      let p = cubicPoint(path, j / 100);

      length += dist(
        prev.x * radiusX,
        prev.y * radiusY,
        p.x * radiusX,
        p.y * radiusY
      );

      prev = p;
    }

    lengths.push(length);
    totalLength += length;
  }

  let perQuadrant = ceil(count / 4);
  let quadrantPoints = [];

  for (let i = 0; i < perQuadrant; i++) {
    let targetDistance =
      (i + 0.5) /
      perQuadrant *
      totalLength;

    let accumulated = 0;
    let chosenPath = paths.length - 1;
    let localT = 1;

    for (let j = 0; j < paths.length; j++) {
      if (
        targetDistance <=
        accumulated + lengths[j]
      ) {
        chosenPath = j;
        localT =
          (targetDistance - accumulated) /
          lengths[j];
        break;
      }

      accumulated += lengths[j];
    }

    quadrantPoints.push(
      cubicPoint(
        paths[chosenPath],
        localT
      )
    );
  }

  for (let p of quadrantPoints) {
    let variants = [
      { x: p.x, y: -p.y },
      { x: -p.x, y: -p.y },
      { x: -p.x, y: p.y },
      { x: p.x, y: p.y }
    ];

    for (let v of variants) {
      result.push({
        x: width / 2 + v.x * radiusX,
        y: height / 2 + v.y * radiusY
      });
    }
  }

  result = result.slice(0, count);

  // Reorder targets to create
  // crossing, choreographed paths.
  let reordered = [];

  let left = 0;
  let right = result.length - 1;

  while (left <= right) {
    reordered.push(result[left]);
    left++;

    if (left <= right) {
      reordered.push(result[right]);
      right--;
    }
  }

  return reordered;
}

// =====================================
// RESAMPLE LETTER POINTS
// =====================================

function resamplePoints(points, count) {
  let result = [];

  if (points.length === 0) return result;

  for (let i = 0; i < count; i++) {
    let index = floor(
      i / count * points.length
    );

    index = constrain(
      index,
      0,
      points.length - 1
    );

    result.push({
      x: points[index].x,
      y: points[index].y
    });
  }

  return result;
}

// =====================================
// CLICK TO MORPH
// =====================================

function startMorph() {
  if (!ready || morphing || tiles.length === 0) {
    return;
  }

  let targetPoints;

  if (currentMode === 0) {
    // LETTER -> TRIBAL
    targetMode = 1;

    targetPoints = createTribalShape(
      currentShapeIndex,
      tiles.length
    );

  } else {
    // TRIBAL -> NEXT LETTER
    targetMode = 0;

    currentLetterIndex =
      (currentLetterIndex + 1) %
      letterSequence.length;

    let nextLetter =
      letterSequence[currentLetterIndex];

    targetPoints = resamplePoints(
      createLetterPoints(nextLetter),
      tiles.length
    );

    currentShapeIndex =
      (currentShapeIndex + 1) %
      shapeNames.length;
  }

  if (targetPoints.length !== tiles.length) {
    return;
  }

  // ---------------------------------
  // SPATIAL WAVE TIMING
  // ---------------------------------

  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let target = targetPoints[i];

    tile.startX = tile.x;
    tile.startY = tile.y;

    tile.targetX = target.x;
    tile.targetY = target.y;

    // Wave moves diagonally across
    // the starting composition.
    let normalizedX =
      tile.x / max(1, width);

    let normalizedY =
      tile.y / max(1, height);

    let wavePosition =
      (normalizedX + normalizedY) / 2;

    tile.delay = constrain(
      wavePosition * 0.85 +
      random(0, 0.15),
      0,
      1
    );

    tile.curveSide =
      random() < 0.5 ? -1 : 1;

    tile.curveFactor = random(
      1 - curveVariation,
      1 + curveVariation
    );
  }

  morphStart = millis();
  morphing = true;
}

// =====================================
// NEW EASING
// =====================================

// Smooth acceleration / deceleration.
// No bounce or overshoot.
function smoothEase(t) {
  t = constrain(t, 0, 1);

  return t * t * (3 - 2 * t);
}

// =====================================
// UPDATE MORPH
// =====================================

function updateMorph() {
  if (!morphing) return;

  let progress = constrain(
    (millis() - morphStart) / morphDuration,
    0,
    1
  );

  for (let tile of tiles) {
    // Wave-based delay
    let delay = tile.delay * waveDelay;

    let localProgress = constrain(
      (progress - delay) /
      (1 - waveDelay),
      0,
      1
    );

    let t = smoothEase(localProgress);

    // ---------------------------------
    // BÉZIER TRAJECTORY
    // ---------------------------------

    let x0 = tile.startX;
    let y0 = tile.startY;

    let x3 = tile.targetX;
    let y3 = tile.targetY;

    let dx = x3 - x0;
    let dy = y3 - y0;

    let distance = sqrt(
      dx * dx + dy * dy
    );

    let nx = 0;
    let ny = 0;

    if (distance > 0.001) {
      nx = -dy / distance;
      ny = dx / distance;
    }

    // Curve control points
    let bend =
      min(
        distance * curveStrength,
        150
      ) *
      tile.curveSide *
      tile.curveFactor;

    let x1 =
      x0 + dx * 0.28 + nx * bend;

    let y1 =
      y0 + dy * 0.28 + ny * bend;

    let x2 =
      x0 + dx * 0.72 + nx * bend;

    let y2 =
      y0 + dy * 0.72 + ny * bend;

    let u = 1 - t;

    tile.x =
      u*u*u*x0 +
      3*u*u*t*x1 +
      3*u*t*t*x2 +
      t*t*t*x3;

    tile.y =
      u*u*u*y0 +
      3*u*u*t*y1 +
      3*u*t*t*y2 +
      t*t*t*y3;

    // Gentle rotation, zero at ends
    tile.rotation =
      sin(t * PI) *
      tile.curveSide *
      0.18;
  }

  // Finish exactly at destination
  if (progress >= 1) {
    morphing = false;
    currentMode = targetMode;

    for (let tile of tiles) {
      tile.x = tile.targetX;
      tile.y = tile.targetY;
      tile.rotation = 0;
    }
  }
}

// =====================================
// DRAW SQUARES
// =====================================

function drawTiles() {
  rectMode(CENTER);

  fill(squareFill);
  stroke(squareOutline);
  strokeWeight(squareStroke);

  for (let tile of tiles) {
    push();

    translate(tile.x, tile.y);
    rotate(tile.rotation);

    rect(
      0,
      0,
      tile.size,
      tile.size
    );

    pop();
  }
}

// =====================================
// DRAW LOOP
// =====================================

function draw() {
  background(0,0,255);

  if (!ready) return;

  updateMorph();
  drawTiles();
}

// =====================================
// INTERACTION
// =====================================

function mousePressed() {
  startMorph();
  return false;
}

function touchStarted() {
  startMorph();
  return false;
}

// =====================================
// KEYBOARD
// =====================================

function keyPressed() {
  if (key === "r" || key === "R") {
    resetSketch();
  }

  if (key === "s" || key === "S") {
    saveCanvas("TRIBAL_TYPE_04", "png");
  }

  if (key === "a" || key === "A") {
    startingLetterIndex = 0;
    resetSketch();
  }

  if (key === "b" || key === "B") {
    startingLetterIndex = 1;
    resetSketch();
  }

  if (key === "c" || key === "C") {
    startingLetterIndex = 2;
    resetSketch();
  }
}

// =====================================
// RESPONSIVE
// =====================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (ready) {
    resetSketch();
  }
}
