//Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";

let eye = "";
let head ="";
let neck ="";
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 200;
let spriteHeight = 200;
// Bunny Sprite
const image = new Image();
image.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/bunny.png";
// Eye
const eyeDraw = new Image();
// Head
const headDraw = new Image();
// Neck
const neckDraw = new Image();
//animation can play
let totalFrame = 10;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 15;
//slowdown
let frameDown = 0;
// speed control
let speed = 4;
//up = dec down = inc
let animationId;

//
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  eye = fieldData.eye;
  head = fieldData.head;
  neck = fieldData.neck;
  speed = animationSpeed;
  
  switch (eye) {
    case "none":
      eyeDraw.src = "";
      break;
    case "Glasses":
    case "Glasses2":
    case "Glasses3":
      eyeDraw.src = "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/{{eye}}.png";
      break;
  }
  switch (head) {
    case "none":
      headDraw.src = "";
      break;
    case "Hat":
    case "Hat2":
    case "Hat3":
      headDraw.src = "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head/{{head}}.png";
      break;
  }
  switch (neck) {
    case "none":
      neckDraw.src = "";
      break;
    case "Scarf":
    case "Scarf2":
    case "Scarf3":
      neckDraw.src = "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/{{neck}}.png";
      break;
  }
  
  animate();
});
window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) {
    return;
  }
  if (typeof obj.detail.event.itemId !== "undefined") {
    obj.detail.listener = "redemption-latest";
  }
  const listener = obj.detail.listener;
  const event = obj.detail.event;
  // Listen to events based on user field settings
  switch (listener) {
    case "tip-latest":
        currentFrame = 180;
        setFrame(180, 198, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "follower-latest":
        currentFrame = 130;
        setFrame(130, 139, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "cheer-latest":
        currentFrame = 200;
        setFrame(200, 217, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "subscriber-latest":
        if (event.bulkGifted) return;
        currentFrame = 140;
        setFrame(140, 153, animationSpeed);
        stopAnimation();
        animate();
      break;
  }
});
//Function
function animate() {
  animationId = requestAnimationFrame(animate);
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Bunny
    ctx.drawImage(image,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    //Eye
    ctx.drawImage(eyeDraw,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    //Head
    ctx.drawImage(headDraw,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    //Neck
    ctx.drawImage(neckDraw,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    
    //Stop
if (currentFrame === 123 || currentFrame === 198 || currentFrame === 139 || currentFrame === 217 || currentFrame === 153) {
  currentFrame = 0;
  setFrame(0, 15, animationSpeed);
}  
  }
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
}
//Set range of action
function setFrame(min, max, spd) {
  minFrame = min;
  maxFrame = max;
  speed = spd;
  frameDown = 0;
}

