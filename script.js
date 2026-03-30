let shapes = [];
let lastTapTime = 0;
let touchStartTime = 0;
let touchStartPos;
let isMoving = false;
let lastShapePos;
let lastShapeTime = 0;

// 이미지
let images = {};

// 👉 제스처별 사이즈 규칙
let shapeSettings = {
  drag: { w: 100, h: 10 },        // 세로 길게
  swipe: { w: 90, h: 20 },        // 가로 느낌
  flick: { w: 90, h: 90 },         // compact
  nudge: { w: 80, h: 80 },         // 거의 점
  pinch: { w: 80, h: 80 },
  spread: { w: 140, h: 140 },
  single_tap: { w: 40, h: 40 },
  double_tap: { w: 30, h: 30 },
  short_hold: { w: 70, h: 70 }
};

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
  let cnv = createCanvas(windowWidth, windowHeight);
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
      let setting = shapeSettings[s.type];

      let w = setting.w;
      let h = setting.h;

      image(img, s.x - w / 2, s.y - h / 2, w, h);
    } else {
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

    if (abs(dx) > 5 || abs(dy) > 5) {
      shapes.push({ type: "drag", x: mouseX, y: mouseY });
    }

    if (abs(dx) > 20 || abs(dy) > 20) {
      shapes.push({ type: "swipe", x: mouseX, y: mouseY });
    }

    if ((abs(dx) > 50 || abs(dy) > 50) && dt < 150) {
      shapes.push({ type: "flick", x: mouseX, y: mouseY });
    }

    if (abs(dx) < 10 && abs(dy) < 10) {
      shapes.push({ type: "nudge", x: mouseX, y: mouseY });
    }

    // pinch / spread
    if (touches.length == 2) {
      let d = dist(
        touches[0].x, touches[0].y,
        touches[1].x, touches[1].y
      );

      let centerX = (touches[0].x + touches[1].x) / 2;
      let centerY = (touches[0].y + touches[1].y) / 2;

      if (d > 150) {
        shapes.push({ type: "spread", x: centerX, y: centerY });
      } else {
        shapes.push({ type: "pinch", x: centerX, y: centerY });
      }
    }

    lastShapePos = createVector(mouseX, mouseY);
    lastShapeTime = now;
  }
}

function touchEnded() {
  let duration = millis() - touchStartTime;
  let now = millis();

  // 롱프레스
  if (duration > 600 && !isMoving) {
    shapes.push({
      type: "double_tap",
      x: mouseX,
      y: mouseY
    });
    return;
  }

  // short hold
  if (duration > 200 && duration < 600 && !isMoving) {
    shapes.push({
      type: "short_hold",
      x: mouseX,
      y: mouseY
    });
    return;
  }

  // double tap
  if (now - lastTapTime < 300) {
    shapes.push({
      type: "double_tap",
      x: mouseX,
      y: mouseY
    });
  } else {
    shapes.push({
      type: "single_tap",
      x: mouseX,
      y: mouseY
    });
  }

  lastTapTime = now;
}