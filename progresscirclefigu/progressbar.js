//Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
let eye = "";
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 200;
let spriteHeight = 200;
const image = new Image();
image.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/bunny.png";
const overlayImage = new Image();
overlayImage.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Glasses.png";
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
  speed = animationSpeed;
  switch (eye) {
    case "none":
      overlayImage.src = "";
      break;
    case "glasses":
      overlayImage.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Glasses.png";
      break;
    case "heart":
      overlayImage.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Heart.png";
      break;
    case "star":
      overlayImage.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Star.png";
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
        currentFrame = 110;
        setFrame(110, 123, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "follower-latest":
        currentFrame = 110;
        setFrame(110, 123, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "cheer-latest":
        currentFrame = 110;
        setFrame(110, 123, animationSpeed);
        stopAnimation();
        animate();
      break;
    case "subscriber-latest":
        if (event.bulkGifted) return;
        currentFrame = 110;
        setFrame(110, 123, animationSpeed);
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
    ctx.drawImage(overlayImage,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    //
    if (currentFrame === 123) {
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

