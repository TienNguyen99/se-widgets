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
  const cont = document.getElementById('cont');
  // Listen to events based on user field settings
  switch (listener) {
    case "tip-latest":
      if (textOrder === "donation") {
        goal_amount += event["amount"];
        //All Function
        currentFrame = 1 + idleStep;
        setFrame(1 + idleStep, 7 + idleStep, animationSpeed);
            // Fade in
    cont.classList.add('fade-in');

    // Sau khi fade in xong (5s), thì fade out
    setTimeout(() => {
      cont.classList.remove('fade-in');
    }, 5000); // 5s = 5000ms
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
      currentFrame === 14 ||
      currentFrame === 23 ||
      currentFrame === 30||
      currentFrame === 39||
      currentFrame === 46||
      currentFrame === 55||
      currentFrame === 62||
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
  // IF 100% here
  if (val >= 100 && lastVal < 100) {
    idleStep = 16 * 4;
    currentFrame = 56;
    setFrame(56, 62, animationSpeed);
  } else if (val >= 75 && lastVal < 75) {
    idleStep = 16 * 3;
    currentFrame = 40;
    setFrame(40, 46, animationSpeed);
  } else if (val >= 50 && lastVal < 50) {
    idleStep = 16 * 2;
    currentFrame = 24;
    setFrame(24, 30, animationSpeed);
  } else if (val >= 25 && lastVal < 25) {
    idleStep = 16 * 1;
    currentFrame = 8;
    setFrame(8, 14, animationSpeed);
  }
    // Update last processed value
    lastVal = val;

    //
    let pct = ((100 - val) / 100) * c;
    circle.style.strokeDashoffset = pct + "px";
    // animate count percent_value
    let startValue = parseInt(document.querySelector(".percent_value").textContent) || 0;
    let endValue = Math.round(val);
    let duration = 1000; // Animation duration in milliseconds
    let startTime = null;

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = Math.min((timestamp - startTime) / duration, 1);
      let currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      document.querySelector(".percent_value").textContent = currentValue + "%";

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }
  
    requestAnimationFrame(animateCount);
    document.querySelector(".percent_value").textContent =
    goal_amount.toFixed(0) + `/{goal_total}`;
    document.querySelector(".goal_text").textContent = textLabel;
  }
}
