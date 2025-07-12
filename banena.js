// Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
let skin = "";

/* Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 200;
let spriteHeight = 200;

//  Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const bodyDraw = new Image();
bodyDraw.src = "";

// animation control
let totalFrame = 16;
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
  skin = fieldData.skin;
  speed = animationSpeed;

  if (skin === "none" || !skin) {
    bodyDraw.src = ``;
  } else {
    bodyDraw.src = `https://tiennguyen99.github.io/se-widgets/assets/banena/{skin}.png`;
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
  let name = event.name;

  switch (listener) {
    case "tip-latest":
      setFrame(80, 95, animationSpeed);
      document.querySelector("#name").innerHTML =
        name +
        `<br>` +
        ` Just Donated $${
          (event.amount * 100) % 100 != 0
            ? event.amount.toFixed(2)
            : event.amount
        }`;
      playAnimation();
      break;
    case "follower-latest":
      setFrame(16, 31, animationSpeed);
      document.querySelector("#name").innerHTML = name + `<br>Just Followed`;
      playAnimation();
      break;
    case "cheer-latest":
      setFrame(96, 111, animationSpeed);
      document.querySelector("#name").innerHTML =
        name +
        `<br>Just Sent ${event.amount} Bit${event.amount == 1 ? "" : "s"}`;
      playAnimation();
      break;
    case "raid-latest":
      setFrame(112, 127, animationSpeed);
      document.querySelector("#name").innerHTML = name + `<br>Just Raided`;
      playAnimation();
      break;
    case "subscriber-latest":
      if (event.bulkGifted) {
        setFrame(48, 69, animationSpeed);
        name = data.sender;
        document.querySelector("#name").innerHTML =
          name +
          `<br>Just Gifted ${event.amount} Sub${event.amount == 1 ? "" : "s"}`;
        playAnimation();
      } else if (event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(48, 69, animationSpeed);
        name = event.sender;
        document.querySelector("#name").innerHTML =
          name + `<br>Just Gifted 1 Sub`;
        playAnimation();
      } else {
        document.querySelector("#name").innerHTML =
          name + `<br>Just Subscribed`;
        setFrame(32, 43, animationSpeed);
        playAnimation();
      }
      break;
    case "message":
      if (event.data.text.includes("!pat")) setFrame(128, 150, animationSpeed);
      if (event.data.text.includes("!feed")) setFrame(160, 199, animationSpeed);
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
    bufferCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bufferCtx.drawImage(
      bodyDraw,
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

    if (
      currentFrame === 15 ||
      currentFrame === 31 ||
      currentFrame === 43 ||
      currentFrame === 69 ||
      currentFrame === 95 ||
      currentFrame === 111 ||
      currentFrame === 127 ||
      currentFrame === 150 ||
      currentFrame === 199
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
function playAnimation() {
  document.querySelector("#text_box").classList.remove("animate");
  void document.querySelector("#text_box").offsetWidth;
  document.querySelector("#text_box").classList.add("animate");
}
