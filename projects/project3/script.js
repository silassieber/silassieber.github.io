
/*
  SUSPENDED MATTER
  MINIMAL EDITION

  Experimental kinetic typography
  OpenProcessing / p5.js 2.0

  CONTROLS
  ─────────────────────────────
  Mouse       Disturb sculpture
  Click       Next letter
  Alphabet    Select any letter
  A–Z         Select any letter
  Space       Next letter
  Arrows      Previous / next letter

  Shift + T   Toggle threads
  Shift + H   Toggle shadows
  Shift + I   Toggle alphabet
  Shift + S   Save PNG
  Shift + R   Reset

  No automatic letter changes.
*/

// =====================================
// SETTINGS
// =====================================

const fontFile = "Stanley-RegularIta.otf";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const config = {

  // Typography
  letterFill: 0.76,

  // Geometry
  spacing: 27,
  moduleWidth: 23,
  moduleHeight: 25,
  longHeight: 43,
  longChance: 0.28,

  // Motion
  duration: 2800,
  stagger: 0.32,
  swing: 45,
  idleSwing: 2.8,

  // Physics
  mouseRadius: 145,
  mouseForce: 2.8,
  spring: 0.045,
  damping: 0.89,

  // Appearance
  background: "#FFFFFF",
  ink: "#202020",
  thread: "#777570",

  // Navigation typography
  interfaceFont: "Helvetica, Arial, sans-serif",
  navigationSize: 22,
  navigationMargin: 32,
  navigationHeight: 58,

  // Visibility
  showThreads: true,
  showShadows: true,
  showInterface: true

};

// =====================================
// GLOBALS
// =====================================

let customFont;

let modules = [];
let letterIndex = 0;

let ready = false;
let transitioning = false;
let transitionStart = 0;

let lightX = 0;
let lightY = 0;

let glyphCache = new Map();

let canvasElement;

// =====================================
// SETUP
// =====================================

async function setup() {

  let canvas = createCanvas(
    windowWidth,
    windowHeight
  );

  canvasElement = canvas.elt;

  pixelDensity(1);
  frameRate(60);

  background(config.background);

  // Unified mouse and touch interaction.
  // Prevents duplicate click events.

  canvasElement.style.touchAction = "none";

  canvasElement.addEventListener(
    "pointerdown",
    handlePointerEvent
  );

  try {

    customFont = await loadFont(fontFile);

  } catch (error) {

    customFont = "Georgia";

    console.warn(
      "Stanley font could not be loaded.",
      error
    );

  }

  prepareAlphabet();

  buildInitialLetter();

  ready = true;

}

// =====================================
// PREPARE ALL 26 LETTERS
// =====================================

function prepareAlphabet() {

  glyphCache.clear();

  for (let letter of letters) {

    let points = createLetterPoints(letter);

    if (points.length === 0) {

      console.warn(
        "No points generated for:",
        letter
      );

    }

  }

}

// =====================================
// BUILD INITIAL LETTER
// =====================================

function buildInitialLetter() {

  modules = [];

  transitioning = false;

  let points = createLetterPoints(
    letters[letterIndex]
  );

  for (let p of points) {

    modules.push(createModule(p));

  }

}

// =====================================
// CREATE INDIVIDUAL MODULE
// =====================================

function createModule(p) {

  let isLong = random() < config.longChance;

  return {

    x: p.x,
    y: p.y,

    baseX: p.x,
    baseY: p.y,

    startX: p.x,
    startY: p.y,

    targetX: p.x,
    targetY: p.y,

    offsetX: 0,
    offsetY: 0,

    vx: 0,
    vy: 0,

    w: config.moduleWidth *
      random(0.8, 1.05),

    h: isLong

      ? config.longHeight *
        random(0.85, 1.1)

      : config.moduleHeight *
        random(0.85, 1.1),

    angle: 0,

    phase: random(TWO_PI),

    frequency: random(0.7, 1.4),

    direction: random() < 0.5
      ? -1
      : 1,

    delay: random(),

    anchorX: p.x,

    startAnchorX: p.x,
    targetAnchorX: p.x,

    anchorY: height * 0.075,

    hollow: p.edge && random() < 0.65,

    split: random() < 0.12,

    opacity: 1,

    startOpacity: 1,
    targetOpacity: 1,

    depth: random(0.65, 1.4),

    lift: random(35, 110),

    dead: false

  };

}

// =====================================
// RASTERIZE GLYPH
// =====================================

function rasterizeGlyph(letter, font) {

  const refSize = 1000;

  let pg = createGraphics(
    refSize,
    refSize
  );

  pg.pixelDensity(1);

  pg.background(255);

  pg.fill(0);
  pg.noStroke();

  pg.textFont(font);

  pg.textStyle(NORMAL);

  pg.textAlign(CENTER, CENTER);

  let fontSize = 680;

  pg.textSize(fontSize);

  // Ensure wide letters fit inside
  // the sampling buffer.

  while (

    pg.textWidth(letter) >
    refSize * 0.72 &&

    fontSize > 50

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

  // Pixel test.

  function isInk(x, y) {

    x = floor(x);
    y = floor(y);

    if (

      x < 0 ||
      y < 0 ||

      x >= refSize ||
      y >= refSize

    ) {

      return false;

    }

    let index =

      4 * (x + y * refSize);

    return pg.pixels[index] < 160;

  }

  // Find visible glyph bounds.

  let minX = refSize;
  let minY = refSize;

  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < refSize; y += 2) {

    for (let x = 0; x < refSize; x += 2) {

      if (isInk(x, y)) {

        minX = min(minX, x);
        maxX = max(maxX, x);

        minY = min(minY, y);
        maxY = max(maxY, y);

      }

    }

  }

  return {

    pg: pg,

    isInk: isInk,

    minX: minX,
    minY: minY,

    maxX: maxX,
    maxY: maxY,

    valid:

      maxX > minX &&

      maxY > minY

  };

}

// =====================================
// SAMPLE TYPOGRAPHY
// =====================================

function createLetterPoints(letter) {

  if (glyphCache.has(letter)) {

    return glyphCache.get(letter).map(

      p => ({ ...p })

    );

  }

  let raster = rasterizeGlyph(

    letter,

    customFont

  );

  // Fallback font if the glyph
  // cannot be rendered.

  if (!raster.valid) {

    raster.pg.remove();

    raster = rasterizeGlyph(

      letter,

      "Georgia"

    );

  }

  if (!raster.valid) {

    raster.pg.remove();

    return [];

  }

  let isInk = raster.isInk;

  let inkWidth =

    raster.maxX - raster.minX;

  let inkHeight =

    raster.maxY - raster.minY;

  let scaleFactor = min(

    width * config.letterFill / inkWidth,

    height * config.letterFill / inkHeight

  );

  let centerX =

    (raster.minX + raster.maxX) / 2;

  let centerY =

    (raster.minY + raster.maxY) / 2;

  let drawWidth =

    inkWidth * scaleFactor;

  let drawHeight =

    inkHeight * scaleFactor;

  let compositionX = width / 2;

  let compositionY = height * 0.52;

  // Adaptive sampling for narrow glyphs.

  let spacing = min(

    config.spacing,

    max(8, drawWidth / 5)

  );

  let points = [];

  // Retry with a denser grid if needed.

  for (let attempt = 0; attempt < 4; attempt++) {

    points = sampleGlyphGrid(

      isInk,

      centerX,
      centerY,

      compositionX,
      compositionY,

      drawWidth,
      drawHeight,

      scaleFactor,

      spacing

    );

    if (points.length >= 8) {

      break;

    }

    spacing *= 0.7;

  }

  // Additional fallback for thin strokes.

  if (points.length === 0) {

    let sourceStep = max(

      2,

      config.spacing / scaleFactor * 0.5

    );

    for (

      let sy = raster.minY;

      sy <= raster.maxY;

      sy += sourceStep

    ) {

      for (

        let sx = raster.minX;

        sx <= raster.maxX;

        sx += sourceStep

      ) {

        if (isInk(sx, sy)) {

          points.push({

            x:

              compositionX +

              (sx - centerX) *
              scaleFactor,

            y:

              compositionY +

              (sy - centerY) *
              scaleFactor,

            edge: true

          });

        }

      }

    }

  }

  raster.pg.remove();

  glyphCache.set(letter, points);

  return points.map(

    p => ({ ...p })

  );

}

// =====================================
// HONEYCOMB SAMPLING GRID
// =====================================

function sampleGlyphGrid(

  isInk,

  centerX,
  centerY,

  compositionX,
  compositionY,

  drawWidth,
  drawHeight,

  scaleFactor,

  spacing

) {

  let points = [];

  let row = 0;

  let left =

    compositionX - drawWidth / 2;

  let top =

    compositionY - drawHeight / 2;

  for (

    let y = top + spacing * 0.25;

    y <= top + drawHeight;

    y += spacing * 0.87

  ) {

    let rowOffset = row % 2 === 0

      ? 0

      : spacing / 2;

    for (

      let x = left + rowOffset;

      x <= left + drawWidth;

      x += spacing

    ) {

      let sx =

        centerX +

        (x - compositionX) /
        scaleFactor;

      let sy =

        centerY +

        (y - compositionY) /
        scaleFactor;

      let probe =

        spacing * 0.22 /
        scaleFactor;

      // Multiple sampling positions
      // preserve thin strokes.

      let covered =

        isInk(sx, sy) ||

        isInk(sx + probe, sy) ||

        isInk(sx - probe, sy) ||

        isInk(sx, sy + probe) ||

        isInk(sx, sy - probe);

      if (covered) {

        let edgeProbe =

          spacing * 0.55 /
          scaleFactor;

        let edge =

          !isInk(sx + edgeProbe, sy) ||

          !isInk(sx - edgeProbe, sy) ||

          !isInk(sx, sy + edgeProbe) ||

          !isInk(sx, sy - edgeProbe);

        points.push({

          x: x,

          y: y,

          edge: edge

        });

      }

    }

    row++;

  }

  return points;

}

// =====================================
// NEXT LETTER
// =====================================

function nextLetter() {

  if (!ready) return;

  let nextIndex =

    (letterIndex + 1) %

    letters.length;

  transformTo(nextIndex);

}

// =====================================
// DIRECT LETTER SELECTION
// =====================================

function selectLetter(index) {

  if (!ready) return;

  if (

    index < 0 ||

    index >= letters.length

  ) {

    return;

  }

  transformTo(index);

}

// =====================================
// INTERRUPTIBLE TRANSITIONS
// =====================================

function transformTo(index) {

  if (!ready) return;

  if (

    index < 0 ||

    index >= letters.length

  ) {

    return;

  }

  if (index === letterIndex) return;

  let targets = createLetterPoints(

    letters[index]

  );

  if (targets.length === 0) {

    console.warn(

      "Could not construct glyph:",

      letters[index]

    );

    return;

  }

  // Capture current animation state.

  if (transitioning) {

    updateTransition();

  }

  // Remove nearly invisible modules
  // from interrupted transitions.

  modules = modules.filter(

    m => m.opacity > 0.02

  );

  letterIndex = index;

  let available = targets.slice();

  let sortedModules = [...modules].sort(

    (a, b) =>

      a.baseY - b.baseY

  );

  for (let m of sortedModules) {

    m.startX = m.baseX;

    m.startY = m.baseY;

    m.startAnchorX = m.anchorX;

    m.startOpacity = m.opacity;

    m.delay = constrain(

      m.baseY / height +

      random(-0.2, 0.2),

      0,

      1

    );

    m.direction = random() < 0.5

      ? -1

      : 1;

    m.lift = random(35, 120);

    if (available.length > 0) {

      let nearestIndex = findNearestPoint(

        m.baseX,

        m.baseY,

        available

      );

      let p = available.splice(

        nearestIndex,

        1

      )[0];

      m.targetX = p.x;

      m.targetY = p.y;

      m.targetAnchorX = p.x;

      m.targetOpacity = 1;

      m.dead = false;

    } else {

      // Surplus modules retract upwards.

      m.targetX = m.anchorX;

      m.targetY = -80;

      m.targetAnchorX = m.anchorX;

      m.targetOpacity = 0;

      m.dead = true;

    }

  }

  // Additional modules descend from above.

  for (let p of available) {

    let m = createModule(p);

    m.startX =

      p.x + random(-70, 70);

    m.startY =

      -random(40, 180);

    m.baseX = m.startX;

    m.baseY = m.startY;

    m.x = m.startX;

    m.y = m.startY;

    m.opacity = 0;

    m.startOpacity = 0;

    m.targetOpacity = 1;

    m.delay = random(0.1, 0.9);

    modules.push(m);

  }

  transitionStart = millis();

  transitioning = true;

}

// =====================================
// NEAREST DESTINATION
// =====================================

function findNearestPoint(x, y, points) {

  let nearestIndex = 0;

  let nearestDistance = Infinity;

  for (let i = 0; i < points.length; i++) {

    let dx = points[i].x - x;

    let dy = points[i].y - y;

    let distance =

      dx * dx + dy * dy;

    if (distance < nearestDistance) {

      nearestDistance = distance;

      nearestIndex = i;

    }

  }

  return nearestIndex;

}

// =====================================
// EASING FUNCTIONS
// =====================================

function easeInOutSine(t) {

  return -(cos(PI * t) - 1) / 2;

}

function easeInOutCubic(t) {

  return t < 0.5

    ? 4 * t * t * t

    : 1 - pow(-2 * t + 2, 3) / 2;

}

// =====================================
// CHOREOGRAPHED TRANSITION
// =====================================

function updateTransition() {

  if (!transitioning) return;

  let progress = constrain(

    (millis() - transitionStart) /

    config.duration,

    0,

    1

  );

  for (let m of modules) {

    let delay =

      m.delay * config.stagger;

    let localT = constrain(

      (progress - delay) /

      (1 - config.stagger),

      0,

      1

    );

    let t = easeInOutCubic(localT);

    let arc = sin(localT * PI);

    let swing =

      sin(localT * TWO_PI * 1.25) *

      arc *

      config.swing *

      m.direction;

    let lift = arc * m.lift;

    m.baseX =

      lerp(

        m.startX,

        m.targetX,

        t

      ) + swing;

    m.baseY =

      lerp(

        m.startY,

        m.targetY,

        t

      ) - lift;

    m.anchorX = lerp(

      m.startAnchorX,

      m.targetAnchorX,

      easeInOutSine(localT)

    );

    m.opacity = lerp(

      m.startOpacity,

      m.targetOpacity,

      t

    );

  }

  if (progress >= 1) {

    transitioning = false;

    modules = modules.filter(

      m => !m.dead

    );

    for (let m of modules) {

      m.baseX = m.targetX;

      m.baseY = m.targetY;

      m.anchorX = m.targetAnchorX;

      m.opacity = 1;

    }

  }

}

// =====================================
// LIVING SCULPTURE / PHYSICS
// =====================================

function updatePhysics() {

  let time = millis() * 0.001;

  // Exclude navigation from
  // sculpture interaction.

  let interactionBottom =

    config.showInterface

      ? getAlphabetLayout().top

      : height;

  let mouseInside =

    mouseX > 0 &&

    mouseX < width &&

    mouseY > 0 &&

    mouseY < interactionBottom;

  let mouseSpeed = constrain(

    dist(

      mouseX,

      mouseY,

      pmouseX,

      pmouseY

    ),

    0,

    40

  );

  for (let m of modules) {

    // Continuous pendulum motion.

    let idleX =

      sin(

        time * m.frequency +

        m.phase

      ) *

      config.idleSwing *

      m.depth;

    let idleY =

      cos(

        time * m.frequency * 0.7 +

        m.phase

      ) * 0.8;

    // Spring restoring force.

    m.vx +=

      -m.offsetX * config.spring;

    m.vy +=

      -m.offsetY * config.spring;

    // Mouse repulsion.

    if (mouseInside) {

      let dx = m.x - mouseX;

      let dy = m.y - mouseY;

      let distance = sqrt(

        dx * dx + dy * dy

      );

      if (

        distance < config.mouseRadius &&

        distance > 0.01

      ) {

        let influence =

          1 -

          distance / config.mouseRadius;

        let force =

          pow(influence, 2) *

          config.mouseForce *

          (0.5 + mouseSpeed * 0.055);

        m.vx +=

          dx / distance * force;

        m.vy +=

          dy / distance * force;

      }

    }

    // Damping and inertia.

    m.vx *= config.damping;

    m.vy *= config.damping;

    m.offsetX += m.vx;

    m.offsetY += m.vy;

    m.offsetX = constrain(

      m.offsetX,

      -100,

      100

    );

    m.offsetY = constrain(

      m.offsetY,

      -100,

      100

    );

    m.x =

      m.baseX +

      m.offsetX +

      idleX;

    m.y =

      m.baseY +

      m.offsetY +

      idleY;

    // Rotation follows swinging movement.

    let targetAngle = constrain(

      m.offsetX * 0.012 +

      m.vx * 0.025 +

      idleX * 0.015,

      -0.8,

      0.8

    );

    m.angle = lerp(

      m.angle,

      targetAngle,

      0.12

    );

  }

}

// =====================================
// HEXAGON GEOMETRY
// =====================================

function hexagonVertices(w, h) {

  let cut = min(

    w * 0.25,

    h * 0.22

  );

  return [

    [-w / 2 + cut, -h / 2],

    [w / 2 - cut, -h / 2],

    [w / 2, 0],

    [w / 2 - cut, h / 2],

    [-w / 2 + cut, h / 2],

    [-w / 2, 0]

  ];

}

function drawHexagon(w, h) {

  let vertices = hexagonVertices(w, h);

  beginShape();

  for (let v of vertices) {

    vertex(v[0], v[1]);

  }

  endShape(CLOSE);

}

// =====================================
// SUSPENSION THREADS
// =====================================

function drawThreads() {

  if (!config.showThreads) return;

  noFill();

  strokeWeight(0.65);

  for (let m of modules) {

    if (m.opacity < 0.01) continue;

    let c = color(config.thread);

    c.setAlpha(

      42 * m.opacity

    );

    stroke(c);

    let attachmentX =

      m.x +

      sin(m.angle) * m.h / 2;

    let attachmentY =

      m.y -

      cos(m.angle) * m.h / 2;

    let tension =

      (attachmentX - m.anchorX) * 0.18;

    // Slightly curved suspension wire.

    bezier(

      m.anchorX,

      m.anchorY,

      m.anchorX,

      lerp(

        m.anchorY,

        attachmentY,

        0.35

      ),

      attachmentX - tension,

      lerp(

        m.anchorY,

        attachmentY,

        0.75

      ),

      attachmentX,

      attachmentY

    );

  }

  // Small suspension points.

  noStroke();

  for (let m of modules) {

    fill(50, 45 * m.opacity);

    circle(

      m.anchorX,

      m.anchorY,

      1.8

    );

  }

}

// =====================================
// DYNAMIC LIGHTING
// =====================================

function updateLight() {

  let targetX = map(

    constrain(mouseX, 0, width),

    0,

    width,

    22,

    -22

  );

  let targetY = map(

    constrain(mouseY, 0, height),

    0,

    height,

    24,

    5

  );

  lightX = lerp(

    lightX,

    targetX,

    0.045

  );

  lightY = lerp(

    lightY,

    targetY,

    0.045

  );

}

// =====================================
// PROJECTED SHADOWS
// =====================================

function drawShadows() {

  if (!config.showShadows) return;

  for (let m of modules) {

    if (m.opacity < 0.01) continue;

    push();

    translate(

      m.x + lightX * m.depth,

      m.y + lightY * m.depth

    );

    rotate(m.angle * 0.8);

    noStroke();

    fill(

      35,

      32,

      28,

      12 * m.opacity

    );

    drawHexagon(

      m.w + 5,

      m.h + 5

    );

    fill(

      35,

      32,

      28,

      28 * m.opacity

    );

    drawHexagon(

      m.w,

      m.h

    );

    pop();

  }

}

// =====================================
// DRAW INDIVIDUAL MODULE
// =====================================

function drawModule(m) {

  if (m.opacity < 0.01) return;

  push();

  translate(m.x, m.y);

  rotate(m.angle);

  let ink = color(config.ink);

  ink.setAlpha(

    255 * m.opacity

  );

  if (m.hollow) {

    // Outline-only modules.

    noFill();

    stroke(ink);

    strokeWeight(1.6);

    drawHexagon(m.w, m.h);

    // Internal structural detail.

    strokeWeight(0.65);

    line(

      0,

      -m.h / 2,

      0,

      m.h / 2

    );

  } else if (m.split) {

    // Split geometric modules.

    noStroke();

    fill(ink);

    push();

    translate(

      0,

      -m.h * 0.26

    );

    drawHexagon(

      m.w,

      m.h * 0.44

    );

    pop();

    push();

    translate(

      0,

      m.h * 0.26

    );

    drawHexagon(

      m.w,

      m.h * 0.44

    );

    pop();

  } else {

    // Solid modules.

    noStroke();

    fill(ink);

    drawHexagon(m.w, m.h);

    // Subtle faceted surface.

    fill(

      255,

      255,

      255,

      13 * m.opacity

    );

    beginShape();

    vertex(

      0,

      -m.h / 2

    );

    vertex(

      m.w * 0.25,

      -m.h / 2

    );

    vertex(

      m.w / 2,

      0

    );

    vertex(

      m.w * 0.25,

      m.h / 2

    );

    vertex(

      0,

      m.h / 2

    );

    endShape(CLOSE);

  }

  pop();

}

// =====================================
// DRAW ALL MODULES
// =====================================

function drawModules() {

  let sorted = [...modules].sort(

    (a, b) => a.depth - b.depth

  );

  for (let m of sorted) {

    drawModule(m);

  }

}

// =====================================
// ALPHABET NAVIGATION GEOMETRY
// =====================================

function getAlphabetLayout() {

  let compact = width < 700;

  let margin = compact

    ? 20

    : config.navigationMargin;

  let alphabetWidth =

    width - margin * 2;

  let step =

    alphabetWidth / letters.length;

  return {

    margin: margin,

    width: alphabetWidth,

    step: step,

    top:

      height - config.navigationHeight,

    bottom: height,

    y:

      height - config.navigationHeight / 2,

    fontSize: min(

      config.navigationSize,

      step * 0.72

    )

  };

}

// =====================================
// FIND CLICKED LETTER
// =====================================

function getAlphabetIndex(x, y) {

  if (!config.showInterface) {

    return -1;

  }

  let menu = getAlphabetLayout();

  if (

    x < menu.margin ||

    x >= menu.margin + menu.width ||

    y < menu.top ||

    y >= menu.bottom

  ) {

    return -1;

  }

  let index = floor(

    (x - menu.margin) /

    menu.step

  );

  return constrain(

    index,

    0,

    letters.length - 1

  );

}

// =====================================
// MINIMAL ALPHABET NAVIGATION
// =====================================

function drawInterface() {

  if (!config.showInterface) return;

  push();

  let menu = getAlphabetLayout();

  textFont(config.interfaceFont);

  // Clean white navigation background.

  noStroke();

  fill(config.background);

  rect(

    0,

    menu.top,

    width,

    height - menu.top

  );

  // Detect hovered letter.

  let hoveredIndex = getAlphabetIndex(

    mouseX,

    mouseY

  );

  // Alphabet typography.

  textAlign(CENTER, CENTER);

  textSize(menu.fontSize);

  for (let i = 0; i < letters.length; i++) {

    let x =

      menu.margin +

      menu.step * (i + 0.5);

    let y = menu.y;

    let active = i === letterIndex;

    let hovered = i === hoveredIndex;

    noStroke();

    if (active) {

      // Selected letter.

      fill(config.ink);

      textStyle(BOLD);

      text(

        letters[i],

        x,

        y

      );

      // Minimal underline.

      stroke(config.ink);

      strokeWeight(1.5);

      line(

        x - menu.fontSize * 0.35,

        y + menu.fontSize * 0.75,

        x + menu.fontSize * 0.35,

        y + menu.fontSize * 0.75

      );

    } else if (hovered) {

      // Hovered letter.

      fill(config.ink);

      textStyle(BOLD);

      text(

        letters[i],

        x,

        y

      );

    } else {

      // Inactive letters.

      fill(150);

      textStyle(NORMAL);

      text(

        letters[i],

        x,

        y

      );

    }

  }

  // Interactive cursor.

  if (hoveredIndex >= 0) {

    cursor(HAND);

  } else {

    cursor(ARROW);

  }

  pop();

}

// =====================================
// MAIN DRAW LOOP
// =====================================

function draw() {

  // Pure white background.

  background(config.background);

  // No loading typography.

  if (!ready) return;

  // Update animation.

  updateTransition();

  updatePhysics();

  updateLight();

  // Render sculpture.

  drawThreads();

  drawShadows();

  drawModules();

  // Render alphabet navigation only.

  drawInterface();

}

// =====================================
// UNIFIED POINTER EVENT
// =====================================

function handlePointerEvent(event) {

  if (!ready) return;

  if (event.isPrimary === false) return;

  if (event.button !== 0) return;

  event.preventDefault();

  // Convert browser coordinates into
  // actual canvas coordinates.

  let bounds =

    canvasElement.getBoundingClientRect();

  if (

    bounds.width === 0 ||

    bounds.height === 0

  ) {

    return;

  }

  let x =

    (event.clientX - bounds.left) *

    width / bounds.width;

  let y =

    (event.clientY - bounds.top) *

    height / bounds.height;

  handlePointer(x, y);

}

// =====================================
// POINTER INTERACTION
// =====================================

function handlePointer(x, y) {

  if (!ready) return;

  // Alphabet navigation always
  // takes priority.

  let index = getAlphabetIndex(x, y);

  if (index >= 0) {

    selectLetter(index);

    return;

  }

  // Ignore clicks in navigation margins.

  if (

    config.showInterface &&

    y >= getAlphabetLayout().top

  ) {

    return;

  }

  // Ignore clicks outside the canvas.

  if (

    x < 0 ||

    x >= width ||

    y < 0 ||

    y >= height

  ) {

    return;

  }

  // Click sculpture to advance.

  nextLetter();

}

// =====================================
// KEYBOARD INTERACTION
// =====================================

function keyPressed(event) {

  if (!ready) return;

  // Prevent repeated key triggers.

  if (event && event.repeat) {

    return false;

  }

  let pressed = String(key).toUpperCase();

  if (keyIsDown(SHIFT)) {

    // Toggle suspension threads.

    if (pressed === "T") {

      config.showThreads =

        !config.showThreads;

    }

    // Toggle shadows.

    if (pressed === "H") {

      config.showShadows =

        !config.showShadows;

    }

    // Toggle alphabet navigation.

    if (pressed === "I") {

      config.showInterface =

        !config.showInterface;

      cursor(ARROW);

    }

    // Export PNG.

    if (pressed === "S") {

      saveCanvas(

        "SUSPENDED_MATTER_" +

        letters[letterIndex],

        "png"

      );

    }

    // Reset.

    if (pressed === "R") {

      letterIndex = 0;

      buildInitialLetter();

    }

    return false;

  }

  // Spacebar: next letter.

  if (key === " ") {

    nextLetter();

    return false;

  }

  // Right arrow: next letter.

  if (keyCode === RIGHT_ARROW) {

    nextLetter();

    return false;

  }

  // Left arrow: previous letter.

  if (keyCode === LEFT_ARROW) {

    let previousIndex =

      (letterIndex - 1 + letters.length) %

      letters.length;

    selectLetter(previousIndex);

    return false;

  }

  // A–Z: direct letter selection.

  if (/^[A-Z]$/.test(pressed)) {

    let index = letters.indexOf(pressed);

    if (index !== -1) {

      selectLetter(index);

    }

    return false;

  }

}

// =====================================
// RESPONSIVE CANVAS
// =====================================

function windowResized() {

  resizeCanvas(

    windowWidth,

    windowHeight

  );

  glyphCache.clear();

  if (ready) {

    prepareAlphabet();

    buildInitialLetter();

  }

}

// =====================================
// END — SUSPENDED MATTER
// =====================================
