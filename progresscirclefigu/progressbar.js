//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let data;
let recents;
let textOrder = "";
let animationSpeed = "";
let frameCount = 0;
let textLabel = "";
			let subType = "";
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 128;
let spriteHeight = 128;
const image = new Image();
image.src ="https://tiennguyen99.github.io/se-widgets/assets/coinbag/160x160.png";
//animation can play
let totalFrame = 8;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
let idleStep = 0;
let lastVal = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 0;
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
  subType = fieldData.subType;	
  textOrder = fieldData.textOrder;
  textLabel = fieldData.textLabel;
  animationSpeed = fieldData.animationSpeed;
  speed = animationSpeed;
  switch (textOrder) {
    case "follower":
      goal_amount = data["follower-session"]["count"]
      break;
    case "donation":
      goal_amount = data["tip-session"]["amount"];
      break;
    case "bit":
      goal_amount = data["cheer-session"]["amount"];
      break;
            case "sub":
			goal_amount = data["subscriber-session"]["count"];

                
              break;
  }
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
    case "tip-latest":
      if (textOrder === "donation") {
        goal_amount += event["amount"];
        //All Function
        currentFrame = 1 + idleStep;
        setFrame(1 + idleStep, 7 + idleStep, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
      break;
    case "follower-latest":
      if (textOrder === "follower") {
        goal_amount = goal_amount + 1;
        //All Function
        currentFrame = 6;
        setFrame(6, 25, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
      break;
    case "cheer-latest":
      if (textOrder === "bit") {
        goal_amount += event["amount"];
        //All Function
        currentFrame = 6;
        setFrame(6, 25, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
      break;
    case "subscriber-latest":
      if (textOrder === "sub") {
        if (event.bulkGifted) return;
        goal_amount += 1;

        //All Function
        currentFrame = 6;
        setFrame(6, 25, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
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
    ctx.drawImage(image,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);

    //Reset Animation to Idle
        if (
      currentFrame === 7 ||
      currentFrame === 23 ||
      currentFrame === 39 ||
      currentFrame === 55||
      currentFrame === 71

    ) {
      currentFrame = 0 + idleStep;
      setFrame(0 + idleStep, 0+ idleStep, animationSpeed);
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
    //IF 100% here
	    switch (true) {
      case val >= 25 && lastVal < 25:
        idleStep = 16 * 1;
        currentFrame = 8;
        setFrame(8, 14, animationSpeed);
        break;
      case val >= 50 && lastVal < 50:
        idleStep = 16 * 2;
        currentFrame = 24;
        setFrame(24, 30, animationSpeed);
        break;
      case val >= 75 && lastVal < 75:
        idleStep = 16 * 3;
        currentFrame = 40;
        setFrame(40, 46, animationSpeed);
        break;
      case val == 100 && lastVal < 100:
        idleStep = 16 * 4;
        currentFrame = 56;
        setFrame(56, 62, animationSpeed);
        break;
      default:
        // Handle any other cases here
        break;
    }
    // Update last processed value
    lastVal = val;

    //debug
    console.log(val);
   
    //
    let pct = ((100 - val) / 100) * c;
    circle.style.strokeDashoffset = pct + "px";
    document.querySelector(".percent_value").textContent =
    goal_amount.toFixed(0) + `/{goal_total}`;
    document.querySelector(".goal_text").textContent = textLabel;
  }
}
