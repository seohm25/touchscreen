let capture;
let tracker;
let positions;

let appleImg;
let prevEyeCenter = null;

let w, h;

function preload() {
  appleImg = loadImage("eye.png"); // 같은 폴더에 넣기
}

function setup() {
  w = windowWidth;
  h = windowHeight;

  createCanvas(w, h);

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  imageMode(CORNER);
  frameRate(30);
}

function draw() {
  background(255); // 흰 배경

  positions = tracker.getCurrentPosition();

  if (positions && positions.length > 0) {

    const eyeCenter = createVector(
      positions[27][0],
      positions[27][1]
    );

    let movement = 0;
    let directionX = 0;
    let directionY = 0;

    if (prevEyeCenter) {
      movement = eyeCenter.dist(prevEyeCenter);
      directionX = eyeCenter.x - prevEyeCenter.x;
      directionY = eyeCenter.y - prevEyeCenter.y;
    }

    const movementThreshold = 2;

    if (movement < movementThreshold) {
      drawNormalApple();
    } else {
      drawDistortedApple(movement, directionX, directionY);
    }

    prevEyeCenter = eyeCenter.copy();

  } else {
    drawNormalApple();
  }
}

function drawNormalApple() {


  image(
    appleImg,
    width / 2 - appleImg.width / 2,
    height / 2 - appleImg.height / 2
  );
  pop();
}

function drawDistortedApple(movement, dx, dy) {
  const sliceHeight = 4;
  const distortionStrength = movement * 10;

  push();
  translate(width, 0);
  scale(-1, 1); // 이미지 좌우 반전

  for (let y = 0; y < appleImg.height; y += sliceHeight) {
    const slice = appleImg.get(
      0,
      y,
      appleImg.width,
      sliceHeight
    );

    const offsetX =
      random(-distortionStrength, distortionStrength) +
      dx * 2;

    const offsetY =
      random(-distortionStrength * 2, distortionStrength * 2) +
      dy * 0.5;

    image(
      slice,
      width / 2 - appleImg.width / 2 + offsetX,
      height / 2 - appleImg.height / 2 + y + offsetY
    );
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


//카메라 배경//

// let capture;
// let tracker;
// let positions;

// let appleImg;
// let prevEyeCenter = null;

// let w, h;

// function preload() {
//   appleImg = loadImage("eye.png");
// }

// function setup() {
//   w = windowWidth;
//   h = windowHeight;

//   createCanvas(w, h);

//   capture = createCapture(VIDEO);
//   capture.size(w, h);
//   capture.hide();

//   tracker = new clm.tracker();
//   tracker.init();
//   tracker.start(capture.elt);

//   imageMode(CORNER);
//   frameRate(30);
// }

// function draw() {
//   if (!capture) return;

//   // ✅ 카메라만 좌우반전
//   push();
//   translate(width, 0);
//   scale(-1, 1);
//   image(capture, 0, 0, width, height);
//   pop();

//   positions = tracker.getCurrentPosition();

//   if (positions && positions.length > 0) {

//     const eyeCenter = createVector(
//       positions[27][0],
//       positions[27][1]
//     );

//     let movement = 0;
//     let directionX = 0;
//     let directionY = 0;

//     if (prevEyeCenter) {
//       movement = eyeCenter.dist(prevEyeCenter);
//       directionX = eyeCenter.x - prevEyeCenter.x;
//       directionY = eyeCenter.y - prevEyeCenter.y;
//     }

//     const movementThreshold = 2;

//     if (movement < movementThreshold) {
//       drawNormalApple();
//     } else {
//       drawDistortedApple(movement, directionX, directionY);
//     }

//     prevEyeCenter = eyeCenter.copy();

//   } else {
//     drawNormalApple();
//   }
// }

// function drawNormalApple() {
//   image(
//     appleImg,
//     width / 2 - appleImg.width / 2,
//     height / 2 - appleImg.height / 2
//   );
// }

// function drawDistortedApple(movement, dx, dy) {

//   const sliceHeight = 4;
//   const distortionStrength = movement * 10;

//   for (let y = 0; y < appleImg.height; y += sliceHeight) {

//     const slice = appleImg.get(
//       0,
//       y,
//       appleImg.width,
//       sliceHeight
//     );

//     const offsetX =
//       random(-distortionStrength, distortionStrength) +
//       dx * 2;

//     const offsetY =
//       random(-distortionStrength * 2, distortionStrength * 2) +
//       dy * 0.5;

//     image(
//       slice,
//       width / 2 - appleImg.width / 2 + offsetX,
//       height / 2 - appleImg.height / 2 + y + offsetY
//     );
//   }
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }