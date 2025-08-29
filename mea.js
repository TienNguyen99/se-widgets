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
let spriteWidth = 200;
let spriteHeight = 200;

// 🆕 Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const charDraw = new Image();
charDraw.src = "";
// Head1
const head1Draw = new Image();
head1Draw.src = "";

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

  if (head1 === "none" || !head1) {
    head1Draw.src = ``;
  } else {
    head1Draw.src = `https://tiennguyen99.github.io/se-widgets/assets/maephira/{head1}.png`;
  }

  if (skin === "none" || !skin) {
    charDraw.src = ``;
  } else {
    charDraw.src = `https://tiennguyen99.github.io/se-widgets/assets/maephira/{skin}.png`;
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
      setFrame(119, 148, animationSpeed);
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
      setFrame(17, 32, animationSpeed);
      document.querySelector("#event").innerHTML = `New Follower`;
      setNameText(name + ` Followed`);
      // document.querySelector("#name").innerHTML = name+ ` Followed`;
      playAnimation();
      break;
    case "cheer-latest":
      setFrame(153, 182, animationSpeed);
      document.querySelector("#event").innerHTML = `New Cheer`;
      setNameText(
        name + ` Sent ${event.amount} Bit${event.amount == 1 ? "" : "s"}`
      );
      playAnimation();
      break;
    case "raid-latest":
      setFrame(85, 111, animationSpeed);
      document.querySelector("#event").innerHTML = `New Raid`;
      setNameText(name + ` Raided`);
      playAnimation();
      break;
    case "subscriber-latest":
      document.querySelector("#event").innerHTML = `New Sub`;
      if (event.bulkGifted) {
        setFrame(51, 76, animationSpeed);
        name = data.sender;

        setNameText(
          name + ` Gifted ${event.amount} Sub${event.amount == 1 ? "" : "s"}`
        );
        playAnimation();
      } else if (event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(51, 76, animationSpeed);
        name = event.sender;
        setNameText(name + ` Gifted 1 Sub`);
        playAnimation();
      } else {
        setNameText(name + ` Subscribed`);
        setFrame(34, 50, animationSpeed);
        playAnimation();
      }
      break;
    case "message":
      if (event.data.text.includes("!sad")) setFrame(187, 220, animationSpeed);
      if (event.data.text.includes("!pat")) setFrame(221, 237, animationSpeed);
      if (event.data.text.includes("!sleep"))
        setFrame(238, 278, animationSpeed);
      if (event.data.text.includes("!dance"))
        setFrame(289, 313, animationSpeed);
      // if (event.data.text.includes("!dance")) {
      //   const now = Date.now();
      //   danceSpam = danceSpam.filter((t) => now - t < 5000);
      //   danceSpam.push(now);
      //   if (danceSpam.length > 3) {
      //     setFrame(50, 74, animationSpeed);
      //   } else {
      //     setFrame(140, 167, animationSpeed);
      //   }
      // }
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
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bufferCanvas, 0, 0);

    if (
      currentFrame === 32 ||
      currentFrame === 50 ||
      currentFrame === 76 ||
      currentFrame === 111 ||
      currentFrame === 148 ||
      currentFrame === 182 ||
      currentFrame === 220 ||
      currentFrame === 237 ||
      currentFrame === 278 ||
      currentFrame === 313
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
