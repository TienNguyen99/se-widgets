//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let data;
let recents;
let textOrder = "";
let subType = "";
let animationSpeed = "";
let frameCount = 0;
let textLabel = "";
let lastVal = -1;
let idleStep = 0;
let colorChosen = "";

/* ===== Canvas 1 ===== */
let canvas1 = document.getElementById("canvasSprite1");
let ctx1 = canvas1.getContext("2d");
canvas1.width = 256;
canvas1.height = 256;

const image1 = new Image();
image1.src = "https://tiennguyen99.github.io/se-widgets/assets/thea/char.png";

let spriteWidth1 = 256;
let spriteHeight1 = 256;
let totalFrame1 = 11;
let currentFrame1 = 0;
let minFrame1 = 0;
let maxFrame1 = 7;
let frameDown1 = 0;
let speed1 = 4;
let animationId1;

function animate1() {
  animationId1 = requestAnimationFrame(animate1);
  frameDown1++;
  if (frameDown1 % speed1 === 0) {
    currentFrame1 = currentFrame1 < maxFrame1 ? currentFrame1 + 1 : minFrame1;
    let frameX = currentFrame1 % totalFrame1;
    let frameY = Math.floor(currentFrame1 / totalFrame1);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.drawImage(
      image1,
      frameX * spriteWidth1,
      frameY * spriteHeight1,
      spriteWidth1,
      spriteHeight1,
      0,
      0,
      spriteWidth1,
      spriteHeight1
    );
    if (currentFrame1 === 7 || currentFrame1 === 29) {
      currentFrame1 = 0;
      setFrame1(0, 7, animationSpeed);
    }
  }
}

function stopAnimation1() {
  cancelAnimationFrame(animationId1);
}

function setFrame1(min, max, spd) {
  minFrame1 = min;
  maxFrame1 = max;
  speed1 = spd;
  frameDown1 = 0;
}

/* ===== Canvas 2 (sprite khác) ===== */
let canvas2 = document.getElementById("canvasSprite2");
let ctx2 = canvas2.getContext("2d");
canvas2.width = 360;
canvas2.height = 360;

const image2 = new Image();
// Thay bằng sprite khác
image2.src = "https://tiennguyen99.github.io/se-widgets/assets/thea/vol.png"

let spriteWidth2 = 360;
let spriteHeight2 = 360;
let totalFrame2 = 8;
let currentFrame2 = 0;
let minFrame2 = 0;
let maxFrame2 = 3;
let frameDown2 = 0;
let speed2 = 4;
let animationId2;

function animate2() {
  animationId2 = requestAnimationFrame(animate2);
  frameDown2++;
  if (frameDown2 % speed2 === 0) {
    currentFrame2 = currentFrame2 < maxFrame2 ? currentFrame2 + 1 : minFrame2;
    let frameX = currentFrame2 % totalFrame2;
    let frameY = Math.floor(currentFrame2 / totalFrame2);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(
      image2,
      frameX * spriteWidth2,
      frameY * spriteHeight2,
      spriteWidth2,
      spriteHeight2,
      0,
      0,
      spriteWidth2,
      spriteHeight2
    );
        if (currentFrame2 === 15 ) {
      currentFrame2 = 16;
      setFrame2(16, 19, 4);
    }
  }
}

function stopAnimation2() {
  cancelAnimationFrame(animationId2);
}

function setFrame2(min, max, spd) {
  minFrame2 = min;
  maxFrame2 = max;
  speed2 = spd;
  frameDown2 = 0;
}

/* ===== Widget Events ===== */
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  goal_total = fieldData.goal_total;
  textOrder = fieldData.textOrder;
  textLabel = fieldData.textLabel;
  animationSpeed = fieldData.animationSpeed;
  subType = fieldData.subType;
  speed1 = animationSpeed;

  switch (textOrder) {
    case "follower":
      goal_amount = data["follower-session"]["count"];
      break;
    case "donation":
      goal_amount = data["tip-goal"]["amount"];
      break;
    case "bit":
      goal_amount = data["cheer-goal"]["amount"];
      break;
    case "sub":
      if (subType === "total") {
        goal_amount = data["subscriber-total"]["count"];
      } else if (subType === "goal") {
        goal_amount = data["subscriber-session"]["count"];
      } else if (subType === "week") {
        goal_amount = data["subscriber-week"]["count"];
      } else if (subType === "month") {
        goal_amount = data["subscriber-month"]["count"];
      }
      break;
  }
  colorChosen = fieldData.colorChosen;

  animate1();
  animate2();
  renderHTML();
});

window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;
  if (typeof obj.detail.event.itemId !== "undefined") {
    obj.detail.listener = "redemption-latest";
  }
  const listener = obj.detail.listener;
  const event = obj.detail.event;

  switch (listener) {
    case "tip-latest":
      if (textOrder === "donation") {
        goal_amount += event["amount"];
        currentFrame1 = 19;
        setFrame1(19, 29, animationSpeed);
        stopAnimation1();
        animate1();
        renderHTML();
      }
      break;
    case "follower-latest":
      if (textOrder === "follower") {
        goal_amount = goal_amount + 1;
        currentFrame1 = 22;
        setFrame1(22, 36, animationSpeed);
        stopAnimation1();
        animate1();
        renderHTML();
      }
      break;
    case "cheer-latest":
      if (textOrder === "bit") {
        goal_amount += event["amount"];
        stopAnimation1();
        animate1();
        renderHTML();
      }
      break;
    case "subscriber-latest":
      if (textOrder === "sub") {
        if (event.bulkGifted) return;
        goal_amount += 1;
        stopAnimation1();
        animate1();
        renderHTML();
      }
      break;
  }
});

/* ===== Progress Bar ===== */
function renderHTML() {
  let val = (goal_amount / goal_total) * 100;
  val = isNaN(val) ? 100 : Math.max(0, Math.min(100, val));
  const path = document.querySelector(".filled-bar");
  const dasharray = path.getAttribute("stroke-dasharray");

  let pct = (100 - val) / 100;
  path.style.strokeDashoffset = pct * dasharray;
  document.querySelector(".percent_value").textContent =
    goal_amount.toFixed(0) + `/{goal_total}`;
  document.querySelector(".goal_text").textContent = textLabel;
  if (val == 100){
    setFrame2(9,15,4);
    stopAnimation2();
    animate2();
  }

  const progressWidth = 400;
  const startX = 0;
  const posX = startX + (progressWidth * val) / 100;
  canvas1.style.left = posX + "px";
  canvas2.style.left = posX + "px"; // cả 2 canvas cùng di chuyển theo progress
}
