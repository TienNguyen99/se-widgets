// Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
let head1 = "";
let skin = "";

/* Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 192;
let spriteHeight = 192;

// 🆕 Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d", { willReadFrequently: true });
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const charDraw = new Image();
charDraw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/Zarsai/192x192.png";

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
  head1 = fieldData.head1;
  skin = fieldData.skin;
  speed = animationSpeed;
  if (fieldData.onoffText) {
    document.getElementById("text_box").classList.add("hidden");
    document.getElementById("frame").classList.add("hidden");
  } else {
    document.getElementById("text_box").classList.remove("hidden");
    document.getElementById("frame").classList.remove("hidden");
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
      setFrame(112, 129, animationSpeed);
      document.querySelector("#event").innerHTML = `New Donation`;
      setNameText(
        name +
          ` Donated $${
            (event.amount * 100) % 100 != 0
              ? event.amount.toFixed(2)
              : event.amount
          }`
      );
      // document.querySelector("#name").innerHTML = name +` Donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}`;
      playAnimation();
      break;
    case "follower-latest":
      setFrame(16, 33, animationSpeed);
      document.querySelector("#event").innerHTML = `New Follower`;
      setNameText(name + ` Followed`);
      // document.querySelector("#name").innerHTML = name+ ` Followed`;
      playAnimation();
      break;
    case "cheer-latest":
      setFrame(80, 97, animationSpeed);
      document.querySelector("#event").innerHTML = `New Cheer`;
      setNameText(
        name + ` Sent ${event.amount} Bit${event.amount == 1 ? "" : "s"}`
      );
      playAnimation();
      break;
    case "subscriber-latest":
      document.querySelector("#event").innerHTML = `New Sub`;
      if (event.bulkGifted) {
        setFrame(48, 65, animationSpeed);
        name = data.sender;

        setNameText(
          name + ` Gifted ${event.amount} Sub${event.amount == 1 ? "" : "s"}`
        );
        playAnimation();
      } else if (event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(48, 65, animationSpeed);
        name = event.sender;
        setNameText(name + ` Gifted 1 Sub`);
        playAnimation();
      } else {
        setNameText(name + ` Subscribed`);
        setFrame(48, 65, animationSpeed);
        playAnimation();
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
    bufferCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bufferCtx.drawImage(
      charDraw,
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
      currentFrame === 33 ||
      currentFrame === 65 ||
      currentFrame === 97 ||
      currentFrame === 129 ||
      currentFrame === 161
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
// function playAnimation(){
//       document.querySelector("#text_box").classList.remove('animate');
//       void document.querySelector("#text_box").offsetWidth; // 🧠 force reflow
//       document.querySelector("#text_box").classList.add('animate');
// }
function playAnimation() {
  const textBox = document.querySelector("#text_box");
  const frame = document.querySelector(".frame");

  // Reset animation
  textBox.classList.remove("animate");
  frame.style.animation = "none";

  // Force reflow
  void textBox.offsetWidth;
  void frame.offsetWidth;

  // Re-apply animation
  textBox.classList.add("animate");
  frame.style.animation = "frameAnim 3s steps(19) forwards";
}
function setNameText(nameText) {
  const nameElement = document.querySelector("#name");
  nameElement.innerHTML = nameText;
  nameElement.style.fontSize = nameText.length > 20 ? "19px" : "24px";
}
