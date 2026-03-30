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
  drag: { w: 150, h: 10 },        // 세로 길게
  swipe: { w: 90, h: 20 },        // 가로 느낌
  flick: { w: 90, h: 90 },         // compact
  nudge: { w: 80, h: 130 },         // 거의 점
  pinch: { w: 80, h: 80 },
  spread: { w: 200, h: 200 },
  single_tap: { w: 20, h: 20 },
  double_tap: { w: 30, h: 30 },
  short_hold: { w: 100, h: 100 }
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
  let cnv = createCanvas(1000, 2000);
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


/////////////////------/////////////--------------
//////no png///////

// // 배열 초기화
// let shapes = [];
// let lastTapTime = 0;
// let touchStartTime = 0;
// let touchStartPos;
// let isMoving = false;

// // 마지막 shape 정보 (간격 조절용)
// let lastShapePos;
// let lastShapeTime = 0;

// function setup() {
//   let cnv = createCanvas(3000, 2000);
//   cnv.position(0, 0);
//   cnv.style('z-index', '10');          
//   cnv.style('pointer-events', 'auto'); // 터치 가능
//   clear();
// }

// function draw() {
//   clear(); // 투명 배경

//   for (let s of shapes) {
//     fill(s.color);
//     noStroke();

//     switch(s.type){
//       case "circle":
//         ellipse(s.x, s.y, s.size);
//         break;
//       case "ellipse":
//         ellipse(s.x, s.y, s.size * 0.5, s.size);
//         break;
//       case "rect":
//        rect(s.x, s.y, s.size * 1, s.size * 1);
//         break;
//       case "triangle":
//         triangle(
//           s.x, s.y - s.size,
//           s.x - s.size, s.y + s.size,
//           s.x + s.size, s.y + s.size
//         );
//         break;
//     }
//   }
// }

// function touchStarted() {
//   touchStartTime = millis();
//   touchStartPos = createVector(mouseX, mouseY);
//   isMoving = false;
// }

// function touchMoved() {
//   isMoving = true;
//   let dx = mouseX - touchStartPos.x;
//   let dy = mouseY - touchStartPos.y;
//   let dt = millis() - touchStartTime;

//   let now = millis();
//   let distSinceLast = lastShapePos ? dist(mouseX, mouseY, lastShapePos.x, lastShapePos.y) : 1000;

//   // 일정 거리(20px)나 시간(50ms) 이상 지나야 shape 추가
//   if (distSinceLast > 20 || now - lastShapeTime > 50) {

//     // Drag / Slide Finger
//     if (abs(dx) > 5 || abs(dy) > 5) {
//       shapes.push({
//         type: "ellipse",
//         x: mouseX,
//         y: mouseY,
//         size: 25,
//         color: "#E2CE90" // Slide Finger (파랑)
//       });
//     }

//     // Flick: 빠른 스와이프
//     if ((abs(dx) > 50 || abs(dy) > 50) && dt < 150) {
//       shapes.push({
//         type: "ellipse",
//         x: mouseX,
//         y: mouseY,
//         size: 50,
//         color: "#0048FF"  // 주황
//       });
//     }

//     // Nudge: 살짝 움직임
//     if (abs(dx) < 10 && abs(dy) < 10) {
//       shapes.push({
//         type: "rect",
//         x: mouseX,
//         y: mouseY,
//         size: 10,
//         color: "#966E62" // 노랑
//       });
//     }

//     // Pinch / Spread
//     if (touches.length == 2) {
//       let d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
//       let centerX = (touches[0].x + touches[1].x) / 2;
//       let centerY = (touches[0].y + touches[1].y) / 2;

//       shapes.push({
//         type: "rect",
//         x: centerX,
//         y: centerY,
//         size: map(d, 0, 300, 20, 80),
//         color: d > 150 ? "#0048FF" : "#ECFF32" // Spread 보라 / Pinch 초록
//       });
//     }

//     lastShapePos = createVector(mouseX, mouseY);
//     lastShapeTime = now;
//   }
// }

// function touchEnded() {
//   let duration = millis() - touchStartTime;

//   // Tap and Hold (롱프레스)
//   if (duration > 600 && !isMoving) {
//     shapes.push({
//       type: "ellipse",
//       x: mouseX,
//       y: mouseY,
//       size: 25,
//       color: "#FF9600" // 오렌지
//     });
//     return;
//   }

//   // 손 멈춤 (short hold)
//   if (duration > 200 && duration < 600 && !isMoving) {
//     shapes.push({
//       type: "rect",
//       x: mouseX,
//       y: mouseY,
//       size: 10,
//       color: "#DBFF00" // 연두
//     });
//     return;
//   }

//   // 더블탭 체크
//   let now = millis();
//   if (now - lastTapTime < 300) {
//     shapes.push({
//       type: "ellipse",
//       x: mouseX,
//       y: mouseY,
//       size: 30,
//       color: "#E8FA39" // 핑크
//     });
//   } else {
//     // 일반 탭
//     shapes.push({
//       type: "rect",
//       x: mouseX,
//       y: mouseY,
//       size: 10,
//       color: "#E4E4E4" // 회색
//     });
//   }

//   lastTapTime = now;
// }

// // 화면 크기 바뀌어도 캔버스는 고정
// function windowResized() {
//   // resizeCanvas(windowWidth, windowHeight); // 제거
// }