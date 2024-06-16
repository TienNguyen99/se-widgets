//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let data;
let recents;
let animationSpeed = "";
let frameCount = 0;
let textLabel = "";
let lastVal = -1;
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 128;
let spriteHeight = 128;
const image = new Image();
image.src = "https://tiennguyen99.github.io/se-widgets/assets/auri/subgoal.png";
//animation can play
let totalFrame = 4;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
//step each frame
let idleStep = 0;
let tranStep = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 3;
//slowdown
let frameDown = 0;
// speed control
let speed = 4;
//up = dec down = inc
let animationId;
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  goal_total = fieldData.goal_total;
  textLabel = fieldData.textLabel;
  animationSpeed = fieldData.animationSpeed;
  speed = animationSpeed;
  //
  goal_amount = data["subscriber-total"]["count"];

  //
  if (fieldData.transparent) {
    $("#red-fill").attr("fill", "transparent");
  }
  animate();
  renderHTML();
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
    case "subscriber-latest":
      if (event.bulkGifted) return;
      goal_amount += 1;
      //All Function
      currentFrame = 4 + idleStep;
      setFrame(4 + idleStep, 13 + idleStep, animationSpeed);
      stopAnimation();
      renderHTML();
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
    ctx.drawImage(
      image,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    //Neu cham 20 40 60
    if (
      currentFrame === 13 + idleStep ||
      currentFrame === 20 ||
      currentFrame === 44 ||
      currentFrame === 68 ||
      currentFrame === 115
    ) {
      currentFrame = 0 + idleStep;
      setFrame(0 + idleStep, 3 + idleStep, animationSpeed);
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
//Render circle
function renderHTML() {
  let val = (goal_amount / goal_total) * 100;
  let circle = document.querySelector("#svg #bar");
  if (isNaN(val)) {
    val = 100;
  } else {
    let r = circle.getAttribute("r");
    let c = Math.PI * (r * 2);
    if (val < 0) {
      val = 0;
    }
    if (val > 100) {
      val = 100;
    }

    switch (true) {
      case val >= 25 && lastVal < 25:
        idleStep = 24 * 1;
        tranStep = 16 * 1;
        currentFrame = 16;
        setFrame(16, 20, animationSpeed);
        break;
      case val >= 50 && lastVal < 50:
        idleStep = 24 * 2;
        tranStep = 16 * 2;
        currentFrame = 40;
        setFrame(40, 44, animationSpeed);
        break;
      case val >= 75 && lastVal < 75:
        idleStep = 24 * 3;
        tranStep = 16 * 3;
        currentFrame = 64;
        setFrame(64, 68, animationSpeed);
        break;
      case val == 100 && lastVal < 100:
        idleStep = 24 * 4;
        tranStep = 16 * 5;
        currentFrame = 88;
        setFrame(88, 115, animationSpeed);
        break;
      default:
        // Handle any other cases here
        break;
    }
    // Update last processed value
    lastVal = val;

    //currentFrame = tranStep;
    //setFrame(tranStep, 20, animationSpeed);
    //debug
    console.log(idleStep);
    console.log(tranStep);
    let pct = ((100 - val) / 100) * c;
    circle.style.strokeDashoffset = pct + "px";
    document.querySelector(".percent_value").textContent =
      goal_amount.toFixed(0) + `/{goal_total}`;
    document.querySelector(".goal_text").textContent = textLabel;
  }
}
