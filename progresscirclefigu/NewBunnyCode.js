// Global state
let fieldData, data, recents;
let animationSpeed = "";
let eye = "",
  head1 = "",
  head2 = "",
  neck = "",
  nose = "",
  wings = "",
  skin = "";

// Canvas setup
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 400;
let spriteHeight = 400;

// Buffer canvas
let bufferCanvas = document.createElement("canvas");
let bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Assets tracking
let assetsLoaded = false;
let loadedImages = 0;
const TOTAL_IMAGES = 7;

// Sprite layers
const bunnyDraw = new Image();
const eyeDraw = new Image();
const head1Draw = new Image();
const head2Draw = new Image();
const neckDraw = new Image();
const noseDraw = new Image();
const wingsDraw = new Image();

// Animation state
let totalFrame = 10;
let currentFrame = 0;
let frameX = 0;
let frameY = 0;
let minFrame = 0;
let maxFrame = 15;
let frameDown = 0;
let speed = 4;
let animationId = null;
let danceSpam = [];

// Frame cache
const frameCache = {};

// Asset load check
function checkAssetsLoaded() {
  loadedImages++;
  if (loadedImages >= TOTAL_IMAGES) {
    assetsLoaded = true;
    console.log("All assets loaded, starting animation");
    for (let i = 0; i <= 15; i++) {
      cacheFrame(i);
    }
    animate();
  }
}

// Load assets
function loadAssets() {
  bunnyDraw.onload = checkAssetsLoaded;
  eyeDraw.onload = checkAssetsLoaded;
  head1Draw.onload = checkAssetsLoaded;
  head2Draw.onload = checkAssetsLoaded;
  neckDraw.onload = checkAssetsLoaded;
  noseDraw.onload = checkAssetsLoaded;
  wingsDraw.onload = checkAssetsLoaded;

  bunnyDraw.onerror = checkAssetsLoaded;
  eyeDraw.onerror = checkAssetsLoaded;
  head1Draw.onerror = checkAssetsLoaded;
  head2Draw.onerror = checkAssetsLoaded;
  neckDraw.onerror = checkAssetsLoaded;
  noseDraw.onerror = checkAssetsLoaded;
  wingsDraw.onerror = checkAssetsLoaded;

  bunnyDraw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Bunny/White.png";
  head1Draw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Cap.png";
  head2Draw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Antlers.png";
  neckDraw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Babybluescarf.png";
  noseDraw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/Bandage.png";
  wingsDraw.src =
    "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Wings/Angelwing.png";
}

// Frame caching
function cacheFrame(frameNumber) {
  const fX = frameNumber % totalFrame;
  const fY = Math.floor(frameNumber / totalFrame);

  const cacheCanvas = document.createElement("canvas");
  cacheCanvas.width = CANVAS_WIDTH;
  cacheCanvas.height = CANVAS_HEIGHT;
  const cacheCtx = cacheCanvas.getContext("2d");

  cacheCtx.drawImage(
    bunnyDraw,
    fX * spriteWidth,
    fY * spriteHeight,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  if (eyeDraw.complete && eyeDraw.src)
    cacheCtx.drawImage(
      eyeDraw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  if (head1Draw.complete)
    cacheCtx.drawImage(
      head1Draw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  if (head2Draw.complete)
    cacheCtx.drawImage(
      head2Draw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  if (neckDraw.complete)
    cacheCtx.drawImage(
      neckDraw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  if (noseDraw.complete)
    cacheCtx.drawImage(
      noseDraw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  if (wingsDraw.complete)
    cacheCtx.drawImage(
      wingsDraw,
      fX * spriteWidth,
      fY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );

  frameCache[frameNumber] = cacheCanvas;
}

// Draw one frame immediately
function drawCurrentFrame() {
  if (frameCache[currentFrame]) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(frameCache[currentFrame], 0, 0);
  } else {
    cacheFrame(currentFrame);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(frameCache[currentFrame], 0, 0);
  }
}

// Animate loop
function animate() {
  if (!assetsLoaded) {
    animationId = requestAnimationFrame(animate);
    return;
  }

  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);

    if (frameCache[currentFrame]) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(frameCache[currentFrame], 0, 0);
    } else {
      bufferCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bufferCtx.drawImage(
        bunnyDraw,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        0,
        0,
        spriteWidth,
        spriteHeight
      );
      if (eyeDraw.complete && eyeDraw.src)
        bufferCtx.drawImage(
          eyeDraw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      if (head1Draw.complete)
        bufferCtx.drawImage(
          head1Draw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      if (head2Draw.complete)
        bufferCtx.drawImage(
          head2Draw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      if (neckDraw.complete)
        bufferCtx.drawImage(
          neckDraw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      if (noseDraw.complete)
        bufferCtx.drawImage(
          noseDraw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      if (wingsDraw.complete)
        bufferCtx.drawImage(
          wingsDraw,
          frameX * spriteWidth,
          frameY * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(bufferCanvas, 0, 0);
      cacheFrame(currentFrame);
    }

    const endFrames = [48, 74, 101, 132, 167, 187, 214, 241, 267, 287, 325];
    if (endFrames.includes(currentFrame)) {
      triggerAnimation(0, 15, animationSpeed);
    }
  }

  animationId = requestAnimationFrame(animate);
}

// Set frame range and speed
function triggerAnimation(min, max, spd) {
  minFrame = min;
  maxFrame = max;
  speed = spd;
  frameDown = 0;
  currentFrame = min;

  for (let i = min; i <= max; i++) {
    if (!frameCache[i]) cacheFrame(i);
  }

  drawCurrentFrame();

  if (!animationId) {
    animate();
  }
}

// Widget load
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  eye = fieldData.eye;
  speed = animationSpeed;

  switch (eye) {
    case "Catmask":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Catmask.png";
      break;
    case "Eyepatch":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Eyepatch.png";
      break;
    case "Glasses":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Glasses.png";
      break;
    case "Heartglasses":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Heartglasses.png";
      break;
    default:
      checkAssetsLoaded();
      break;
  }

  loadAssets();
});

// Event received
window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;

  const listener = obj.detail.listener;
  const event = obj.detail.event;

  switch (listener) {
    case "tip-latest":
      triggerAnimation(250, 267, animationSpeed);
      break;
    case "follower-latest":
      triggerAnimation(170, 187, animationSpeed);
      break;
    case "cheer-latest":
      triggerAnimation(270, 287, animationSpeed);
      break;
    case "raid-latest":
      triggerAnimation(290, 325, animationSpeed);
      break;
    case "subscriber-latest":
      if (event.bulkGifted) return;
      triggerAnimation(190, 214, animationSpeed);
      if (event.gifted) triggerAnimation(220, 241, animationSpeed);
      break;
    case "message":
      const text = event.data.text;
      if (text.includes("!sleep")) triggerAnimation(20, 48, animationSpeed);
      else if (text.includes("!angry"))
        triggerAnimation(50, 74, animationSpeed);
      else if (text.includes("!pet")) triggerAnimation(80, 101, animationSpeed);
      else if (text.includes("!feed"))
        triggerAnimation(110, 132, animationSpeed);
      else if (text.includes("!dance")) {
        const now = Date.now();
        danceSpam = danceSpam.filter((t) => now - t < 5000);
        danceSpam.push(now);
        if (danceSpam.length > 3) {
          triggerAnimation(50, 74, animationSpeed); // angry
        } else {
          triggerAnimation(140, 167, animationSpeed); // dance
        }
      }
      break;
  }
});
