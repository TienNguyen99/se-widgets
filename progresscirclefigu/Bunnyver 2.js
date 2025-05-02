// Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
let eye = "";
let head1 = "";
let head2 = "";
let neck = "";
let nose = "";
let wings = "";
let skin = "";

/* Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 200);
let CANVAS_HEIGHT = (canvas.height = 200);
let spriteWidth = 200;
let spriteHeight = 200;

// 🆕 Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const bunnyDraw = new Image();
bunnyDraw.src = "";
// Eye
const eyeDraw = new Image();
eyeDraw.src = "";
// Head1
const head1Draw = new Image();
head1Draw.src = "";
// Head2
const head2Draw = new Image();
head2Draw.src = "";
// Neck
const neckDraw = new Image();
neckDraw.src = "";
// Nose
const noseDraw = new Image();
noseDraw.src = "";
// Wings
const wingsDraw = new Image();
wingsDraw.src = "";

// animation control
let totalFrame = 10;
let currentFrame = 0;
let frameX = 0;
let frameY = 0;
let minFrame = 0;
let maxFrame = 15;
let frameDown = 0;
let speed = 4;
let animationId;
let danceSpam = [];

// Load assets
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  eye = fieldData.eye;
  head1 = fieldData.head1;
  head2 = fieldData.head2;
  neck = fieldData.neck;
  nose = fieldData.nose;
  wings = fieldData.wings;
  skin = fieldData.skin;
  speed = animationSpeed;

// Eye
if (eye ==="none" || !eye){
  eyeDraw.src=``;
}else {
  eyeDraw.src = `https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/{eye}.png`;
}
  // Head1
  if (head1 ==="none" || !head1){
    head1Draw.src=``;
  }

  stopAnimation();
  animate();
});

// Event Received
window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;
  if (typeof obj.detail.event.itemId !== "undefined") {
    obj.detail.listener = "redemption-latest";
  }

  const listener = obj.detail.listener;
  const event = obj.detail.event;
  let name = data.name;  

  switch (listener) {
    case "tip-latest":
      setFrame(250, 267, animationSpeed);
      break;
    case "follower-latest":
      setFrame(170, 187, animationSpeed);
      
      break;
    case "cheer-latest":
      setFrame(270, 287, animationSpeed);
      break;
    case "raid-latest":
      setFrame(290, 325, animationSpeed);
      break;
    case "subscriber-latest":
      if (event.bulkGifted) return;
      if (event.gifted) {
        setFrame(220, 241, animationSpeed);
      } else {
        setFrame(190, 214, animationSpeed);
      }
      break;
    case "message":
      if (event.data.text.includes("!sleep")) setFrame(20, 48, animationSpeed);
      if (event.data.text.includes("!angry")) setFrame(50, 74, animationSpeed);
      if (event.data.text.includes("!pet")) setFrame(80, 101, animationSpeed);
      if (event.data.text.includes("!feed")) setFrame(110, 132, animationSpeed);
      if (event.data.text.includes("!dance")) {
        const now = Date.now();
        danceSpam = danceSpam.filter((t) => now - t < 5000);
        danceSpam.push(now);
        if (danceSpam.length > 3) {
          setFrame(50, 74, animationSpeed);
        } else {
          setFrame(140, 167, animationSpeed);
        }
      }
      break;
  }

  stopAnimation();
  animate();
});

// Animate function
function animate() {
  animationId = requestAnimationFrame(animate);
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);

    // 🎯 Vẽ vào buffer trước
    bufferCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    bufferCtx.drawImage(bunnyDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(eyeDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(head1Draw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(head2Draw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(neckDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(noseDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(wingsDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

    // 🎯 Sau cùng copy buffer lên canvas chính
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bufferCanvas, 0, 0);

    if (
      currentFrame === 48 ||
      currentFrame === 74 ||
      currentFrame === 101 ||
      currentFrame === 132 ||
      currentFrame === 167 ||
      currentFrame === 187 ||
      currentFrame === 214 ||
      currentFrame === 241 ||
      currentFrame === 267 ||
      currentFrame === 287 ||
      currentFrame === 325
    ) {
      setFrame(0, 15, animationSpeed);
    }
  }
}

// Stop animation
function stopAnimation() {
  cancelAnimationFrame(animationId);
}

// Set range of action
function setFrame(min, max, spd) {
  minFrame = min;
  maxFrame = max;
  speed = spd;
  frameDown = 0;
  currentFrame = min;
}
function addEvent(){
  const event = {
    name: data.name,
    message: data.message,
    amount: data.amount,
    currency: data.currency,
    type: data.type,
  };
  
}
