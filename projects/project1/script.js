
let particles = [];
let gradientLayer;
let trailLayer;
let customFont;

// =====================================
// TEXT & DESIGN
// =====================================

let letter = "a";

// CUSTOM FONT
let fontFile = "Stanley-RegularIta.otf";

// BACKGROUND
let gradientTop = "blue";
let gradientBottom = "white";

// TYPOGRAPHY
let textFill = 0.96;
let spacing = 5;

// PARTICLE SIZES
let particleSizeMin = 1.6;
let particleSizeMax = 3.4;

// PARTICLE COLORS
let particleColor1 = [255, 255, 255, 210];
let particleColor2 = [0, 0, 0, 150];
let particleColor3 = [0, 0, 0, 240];

// =====================================
// MOUSE INTERACTION
// =====================================

let influence = 300;
let force = 2.8;
let spring = 0.035;
let friction = 0.87;

let explosionStrength = 3.5;
let mouseSpeedInfluence = 0.045;

// =====================================
// ORGANIC NOISE
// =====================================

let noiseStrength = 1.5;
let noiseSpeed = 0.005;
let noiseScale = 0.012;

// =====================================
// BREATHING
// =====================================

let breathingEnabled = true;
let breathingAmount = 0.008;
let breathingSpeed = 0.001;

// =====================================
// GLITCH BURSTS
// =====================================

let glitchEnabled = true;
let glitchChance = 0.008;
let glitchStrength = 22;
let glitchDuration = 7;

// =====================================
// MOTION TRAILS
// =====================================

let trailsEnabled = true;
let trailFade = 38;
let trailOpacity = 65;

// =====================================
// INTERNAL STATE
// =====================================

let glitchTimer = 0;
let glitchOffset = 0;
let glitchY = 0;
let glitchBandHeight = 0;

let previousMouseX = 0;
let previousMouseY = 0;
let mouseVelocity = 0;
let pointerActive = false;

let fontReady = false;

// =====================================
// SETUP — P5.JS 2.0
// =====================================

async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(5);
  frameRate(60);

  createGradient();
  createTrailLayer();

  // Load custom font before creating particles
  try {
    customFont = await loadFont(fontFile);
    console.log("Custom font loaded!");
  } catch (error) {
    console.warn(
      "Font could not be loaded. Using Arial.",
      error
    );
    customFont = "Arial";
  }

  createParticles();

  previousMouseX = mouseX;
  previousMouseY = mouseY;

  fontReady = true;
}

// =====================================
// GRADIENT BACKGROUND
// =====================================

function createGradient() {
  if (gradientLayer) {
    gradientLayer.remove();
  }

  gradientLayer = createGraphics(width, height);
  gradientLayer.pixelDensity(1);
  gradientLayer.noFill();

  let topColor = color(gradientTop);
  let bottomColor = color(gradientBottom);

  for (let y = 0; y < height; y++) {
    let t = y / max(1, height - 1);

    gradientLayer.stroke(
      lerpColor(topColor, bottomColor, t)
    );

    gradientLayer.line(0, y, width, y);
  }
}

// =====================================
// MOTION TRAIL LAYER
// =====================================

function createTrailLayer() {
  if (trailLayer) {
    trailLayer.remove();
  }

  trailLayer = createGraphics(width, height);
  trailLayer.pixelDensity(1);
  trailLayer.clear();
}

function fadeTrails() {
  if (!trailsEnabled) return;

  let ctx = trailLayer.drawingContext;

  ctx.save();

  ctx.globalCompositeOperation =
    "destination-out";

  ctx.fillStyle =
    "rgba(0,0,0," + (trailFade / 255) + ")";

  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// =====================================
// CREATE CENTERED LETTER
// =====================================

function createParticles() {
  particles = [];

  // Use a reference canvas to measure the
  // actual visible shape of the custom font.
  let referenceSize = 1000;

  let pg = createGraphics(
    referenceSize,
    referenceSize
  );

  pg.pixelDensity(1);
  pg.background(255);
  pg.fill(0);
  pg.noStroke();

  pg.textFont(customFont);
  pg.textStyle(NORMAL);
  pg.textAlign(CENTER, CENTER);

  let fontSize = 650;
  pg.textSize(fontSize);

  // Fit the letter inside the reference canvas
  while (
    pg.textWidth(letter) > referenceSize * 0.8
  ) {
    fontSize *= 0.9;
    pg.textSize(fontSize);
  }

  pg.text(
    letter,
    referenceSize / 2,
    referenceSize / 2
  );

  pg.loadPixels();

  // ---------------------------------
  // FIND ACTUAL VISIBLE BOUNDS
  // ---------------------------------

  let minX = referenceSize;
  let maxX = -1;
  let minY = referenceSize;
  let maxY = -1;

  for (let y = 0; y < referenceSize; y += 2) {
    for (let x = 0; x < referenceSize; x += 2) {
      let index = 4 * (x + y * referenceSize);

      if (pg.pixels[index] < 120) {
        minX = min(minX, x);
        maxX = max(maxX, x);
        minY = min(minY, y);
        maxY = max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    console.warn("No visible letter pixels found.");
    pg.remove();
    return;
  }

  // ---------------------------------
  // SCALE LETTER TO FIT SCREEN
  // ---------------------------------

  let letterWidth = maxX - minX + 1;
  let letterHeight = maxY - minY + 1;

  let scaleFactor = min(
    (width * textFill) / letterWidth,
    (height * textFill) / letterHeight
  );

  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;

  // Sample on a regular screen-space grid.
  // This preserves particle density even
  // when the font changes.
  let drawWidth = letterWidth * scaleFactor;
  let drawHeight = letterHeight * scaleFactor;

  let left = width / 2 - drawWidth / 2;
  let top = height / 2 - drawHeight / 2;

  for (
    let y = top;
    y <= top + drawHeight;
    y += spacing
  ) {
    for (
      let x = left;
      x <= left + drawWidth;
      x += spacing
    ) {
      let sourceX = floor(
        centerX + (x - width / 2) / scaleFactor
      );

      let sourceY = floor(
        centerY + (y - height / 2) / scaleFactor
      );

      if (
        sourceX < 0 ||
        sourceX >= referenceSize ||
        sourceY < 0 ||
        sourceY >= referenceSize
      ) {
        continue;
      }

      let index =
        4 * (sourceX + sourceY * referenceSize);

      if (pg.pixels[index] < 120) {
        particles.push(
          new Particle(x, y)
        );
      }
    }
  }

  pg.remove();

  console.log(
    "Particles created:",
    particles.length
  );
}

// =====================================
// GLITCH BURSTS
// =====================================

function updateGlitch() {
  if (!glitchEnabled) {
    glitchTimer = 0;
    return;
  }

  if (glitchTimer > 0) {
    glitchTimer--;
    return;
  }

  glitchOffset = 0;

  if (random() < glitchChance) {
    glitchTimer = glitchDuration;

    glitchOffset = random(
      -glitchStrength,
      glitchStrength
    );

    glitchY = random(height);
    glitchBandHeight = random(30, 130);
  }
}

// =====================================
// MOUSE MOVEMENT
// =====================================

function updateMouseVelocity() {
  let dx = mouseX - previousMouseX;
  let dy = mouseY - previousMouseY;

  let inside =
    mouseX >= 0 &&
    mouseX <= width &&
    mouseY >= 0 &&
    mouseY <= height;

  let speed = min(
    sqrt(dx * dx + dy * dy),
    80
  );

  pointerActive =
    inside &&
    (mouseIsPressed || speed > 0.1);

  mouseVelocity = lerp(
    mouseVelocity,
    pointerActive ? speed : 0,
    0.25
  );

  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

// =====================================
// PARTICLE CLASS
// =====================================

class Particle {
  constructor(x, y) {
    this.homeX = x;
    this.homeY = y;

    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.size = random(
      particleSizeMin,
      particleSizeMax
    );
  }

  update(time, breath) {

    // ---------------------------------
    // BREATHING
    // ---------------------------------

    let targetX =
      width / 2 +
      (this.homeX - width / 2) * breath;

    let targetY =
      height / 2 +
      (this.homeY - height / 2) * breath;

    // ---------------------------------
    // ORGANIC NOISE
    // ---------------------------------

    let nx = noise(
      this.homeX * noiseScale,
      this.homeY * noiseScale,
      time
    );

    let ny = noise(
      this.homeX * noiseScale + 100,
      this.homeY * noiseScale + 100,
      time
    );

    targetX +=
      (nx - 0.5) * noiseStrength * 12;

    targetY +=
      (ny - 0.5) * noiseStrength * 12;

    // ---------------------------------
    // GLITCH
    // ---------------------------------

    if (
      glitchTimer > 0 &&
      this.homeY > glitchY &&
      this.homeY < glitchY + glitchBandHeight
    ) {
      targetX += glitchOffset;
    }

    // ---------------------------------
    // SPRING PHYSICS
    // ---------------------------------

    this.vx +=
      (targetX - this.x) * spring;

    this.vy +=
      (targetY - this.y) * spring;

    // ---------------------------------
    // MOUSE EXPLOSION
    // ---------------------------------

    if (pointerActive || mouseIsPressed) {
      let dx = this.x - mouseX;
      let dy = this.y - mouseY;

      let d2 = dx * dx + dy * dy;

      if (
        d2 < influence * influence &&
        d2 > 0.000001
      ) {
        let d = sqrt(d2);

        let strength = pow(
          1 - d / influence,
          3
        );

        let explosion =
          force +
          mouseVelocity *
          mouseSpeedInfluence *
          explosionStrength;

        this.vx +=
          (dx / d) * strength * explosion;

        this.vy +=
          (dy / d) * strength * explosion;
      }
    }

    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  // ---------------------------------
  // MOTION TRAILS
  // ---------------------------------

  drawTrail() {
    if (!trailsEnabled) return;

    let speed2 =
      this.vx * this.vx +
      this.vy * this.vy;

    if (speed2 < 1.5) return;

    trailLayer.stroke(
      0, 0, 0, trailOpacity
    );

    trailLayer.strokeWeight(
      this.size * 0.8
    );

    trailLayer.line(
      this.x,
      this.y,
      this.x - this.vx * 2,
      this.y - this.vy * 2
    );
  }

  // ---------------------------------
  // BLACK & WHITE PARTICLES
  // ---------------------------------

  show() {
    let x = this.x;
    let y = this.y;

    noStroke();

    // WHITE LAYER
    fill(...particleColor1);

    circle(
      x - 2.2,
      y - 1,
      this.size * 1.5
    );

    // BLACK OFFSET
    fill(...particleColor2);

    circle(
      x + 2,
      y + 1.3,
      this.size * 1.5
    );

    // DARK CENTER
    fill(...particleColor3);

    circle(
      x,
      y,
      this.size * 0.95
    );
  }
}

// =====================================
// DRAW LOOP
// =====================================

function draw() {
  image(gradientLayer, 0, 0);

  // Wait until the font and particles
  // have finished loading.
  if (!fontReady) return;

  updateGlitch();
  updateMouseVelocity();

  let time = millis() * noiseSpeed;

  let breath = 1;

  if (breathingEnabled) {
    breath =
      1 +
      sin(millis() * breathingSpeed) *
      breathingAmount;
  }

  if (trailsEnabled) {
    fadeTrails();
  }

  // Update particle positions
  for (let p of particles) {
    p.update(time, breath);
    p.drawTrail();
  }

  // Draw trails behind typography
  if (trailsEnabled) {
    image(trailLayer, 0, 0);
  }

  // Draw particles
  for (let p of particles) {
    p.show();
  }
}

// =====================================
// KEYBOARD CONTROLS
// =====================================

function keyPressed() {

  // GLITCH
  if (key === "g" || key === "G") {
    glitchEnabled = !glitchEnabled;
  }

  // TRAILS
  if (key === "t" || key === "T") {
    trailsEnabled = !trailsEnabled;
    trailLayer.clear();
  }

  // BREATHING
  if (key === "b" || key === "B") {
    breathingEnabled = !breathingEnabled;
  }

  // RESET
  if (key === "r" || key === "R") {
    for (let p of particles) {
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = 0;
      p.vy = 0;
    }

    trailLayer.clear();
  }
}

// =====================================
// RESPONSIVE CANVAS
// =====================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  createGradient();
  createTrailLayer();

  if (fontReady) {
    createParticles();
  }
}

// =====================================
// TOUCH
// =====================================

function touchMoved() {sss
  return false;
}


function keyPressed() {
  if (key === 's' || key === 's') {
    saveCanvas('kinetic-typography', 'png');
  }
}

