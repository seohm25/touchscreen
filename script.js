let shapes = [];
let lastTapTime = 0;
let touchStartTime = 0;
let touchStartPos;
let isMoving = false;
let lastShapePos;
let lastShapeTime = 0;

// PNG 파일
let images = {};

function preload() {
  images = {
    drag: loadImage('assets/drag@4x.png'),
    swipe: loadImage('assets/swipe@4x.png'),
    flick: loadImage('assets/flick@4x.png'),
    nudge: loadImage('assets/nudge@4x.png'),
    pinch: loadImage('assets/pinch@4x.png'),
    spread: loadImage('assets/spread@4x.png'),
    single_tap: loadImage('assets/single_tap@4x.png'),
    double_tap: loadImage('assets/double_tap@4x.png'),
    short_hold: loadImage('assets/short_hold@4x.png'),
  };
}

function setup() {
  let cnv = createCanvas(3000, 2000);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'auto');
  clear();
}

function draw() {
  clear();

  for (let s of shapes) {
    if (s.type in images) {
      let img = images[s.type];
      image(img, s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
    } else {
      // 디버깅용
      console.log("missing image:", s.type);
    }
  }
}

function touchStarted() {
  touchStartTime = millis();
  touchStartPos = createVector(mouseX, mouseY);
  isMoving = false;
}

function touchMoved() {
  isMoving = true;

  let dx = mouseX - touchStartPos.x;
  let dy = mouseY - touchStartPos.y;
  let dt = millis() - touchStartTime;
  let now = millis();

  let distSinceLast = lastShapePos
    ? dist(mouseX, mouseY, lastShapePos.x, lastShapePos.y)
    : 1000;

  if (distSinceLast > 20 || now - lastShapeTime > 50) {

    // Drag / Slide
    if (abs(dx) > 5 || abs(dy) > 5) {
      shapes.push({ type: "drag", x: mouseX, y: mouseY, size: 60 });
    }

    // Swipe
    if (abs(dx) > 20 || abs(dy) > 20) {
      shapes.push({ type: "swipe", x: mouseX, y: mouseY, size: 60 });
    }

    // Flick (빠른 움직임)
    if ((abs(dx) > 50 || abs(dy) > 50) && dt < 150) {
      shapes.push({ type: "flick", x: mouseX, y: mouseY, size: 80 });
    }

    // Nudge (미세 움직임)
    if (abs(dx) < 10 && abs(dy) < 10) {
      shapes.push({ type: "nudge", x: mouseX, y: mouseY, size: 40 });
    }

    // Pinch / Spread
    if (touches.length == 2) {
      let d = dist(
        touches[0].x, touches[0].y,
        touches[1].x, touches[1].y
      );

      let centerX = (touches[0].x + touches[1].x) / 2;
      let centerY = (touches[0].y + touches[1].y) / 2;

      if (d > 150) {
        shapes.push({
          type: "spread",
          x: centerX,
          y: centerY,
          size: map(d, 150, 300, 60, 120)
        });
      } else {
        shapes.push({
          type: "pinch",
          x: centerX,
          y: centerY,
          size: map(d, 0, 150, 40, 80)
        });
      }
    }

    lastShapePos = createVector(mouseX, mouseY);
    lastShapeTime = now;
  }
}

function touchEnded() {
  let duration = millis() - touchStartTime;
  let now = millis();

  // Tap & Hold (롱프레스)
  if (duration > 600 && !isMoving) {
    shapes.push({
      type: "double_tap",
      x: mouseX,
      y: mouseY,
      size: 60
    });
    return;
  }

  // Short Hold
  if (duration > 200 && duration < 600 && !isMoving) {
    shapes.push({
      type: "short_hold",
      x: mouseX,
      y: mouseY,
      size: 50
    });
    return;
  }

  // Double Tap
  if (now - lastTapTime < 300) {
    shapes.push({
      type: "double_tap",
      x: mouseX,
      y: mouseY,
      size: 60
    });
  } else {
    // Single Tap
    shapes.push({
      type: "single_tap",
      x: mouseX,
      y: mouseY,
      size: 50
    });
  }

  lastTapTime = now;
}