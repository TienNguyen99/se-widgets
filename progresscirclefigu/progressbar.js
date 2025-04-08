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
//Function
let lastVal = -1;
let idleStep = 0;
let colorChosen = "";
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 92;
let spriteHeight = 88;
const image = new Image();
image.src = "";
//animation can play
let totalFrame = 5;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
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

  textOrder = fieldData.textOrder;
  textLabel = fieldData.textLabel;
  animationSpeed = fieldData.animationSpeed;
  subType = fieldData.subType;
  speed = animationSpeed;
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
        currentFrame = 0 + idleStep;
        setFrame(0 + idleStep, 0 + idleStep, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
      break;
    case "follower-latest":
      if (textOrder === "follower") {
        goal_amount = goal_amount + 1;
        //All Function
        currentFrame = 15;
        setFrame(15, 61, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      }
      break;
    case "cheer-latest":
      if (textOrder === "bit") {
        goal_amount += event["amount"];
        //All Function
        currentFrame = 15;
        setFrame(15, 61, animationSpeed);
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
        currentFrame = 15;
        setFrame(15, 61, animationSpeed);
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
      currentFrame === 5 ||
      currentFrame === 10 ||
      currentFrame === 15 ||
      currentFrame === 20
    ) {
      currentFrame = 0 + idleStep;
      setFrame(0 + idleStep, 0 + idleStep, animationSpeed);
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
  let path = document.querySelector(".filled-bar");
  let dasharray = path.getAttribute("stroke-dasharray");

  const rect = document.getElementById("endRect");
  var barLength = path.getTotalLength();

  if (isNaN(val)) {
    val = 100;
  } else {
    if (val < 0) {
      val = 0;
    }
    if (val > 100) {
      val = 100;
    }
    switch (colorChosen) {
      case "aae3b0":
        image.src =
          "https://tiennguyen99.github.io/se-widgets/assets/heart-bar/{{colorChosen}}.png";
        //Condition
        switch (true) {
          case val >= 25 && lastVal < 25:
            idleStep = 5 * 1;
            //tranStep = 16 * 1;

            document.querySelector("#bar").style.stroke = "#aae3b0";
            currentFrame = 0;
            setFrame(0, 5, animationSpeed);
            break;
          case val >= 50 && lastVal < 50:
            idleStep = 5 * 2;
            //tranStep = 16 * 2;
            document.querySelector("#bar").style.stroke = "#88cf80";
            currentFrame = 5;
            setFrame(5, 10, animationSpeed);
            break;
          case val >= 75 && lastVal < 75:
            idleStep = 5 * 3;
            //tranStep = 16 * 3;
            document.querySelector("#bar").style.stroke = "#66b06d";
            currentFrame = 10;
            setFrame(10, 15, animationSpeed);
            break;
          case val == 100 && lastVal < 100:
            idleStep = 5 * 4;
            //tranStep = 16 * 5;
            document.querySelector("#bar").style.stroke = "#3b8f55";
            currentFrame = 15;
            setFrame(15, 20, animationSpeed);
            break;
          default:
            // Handle any other cases here
            break;
        }
        // Update last processed value
        lastVal = val;
        break;
      case "a6b6f5":
        image.src =
          "https://tiennguyen99.github.io/se-widgets/assets/heart-bar/a6b6f5.png";
        //Condition
        switch (true) {
          case val >= 25 && lastVal < 25:
            idleStep = 5 * 1;
            //tranStep = 16 * 1;
            document.querySelector("#bar").style.stroke = "#a6b6f5";
            currentFrame = 0;
            setFrame(0, 5, animationSpeed);
            break;
          case val >= 50 && lastVal < 50:
            idleStep = 5 * 2;
            //tranStep = 16 * 2;
            document.querySelector("#bar").style.stroke = "#869aeb";
            currentFrame = 5;
            setFrame(5, 10, animationSpeed);
            break;
          case val >= 75 && lastVal < 75:
            idleStep = 5 * 3;
            //tranStep = 16 * 3;
            document.querySelector("#bar").style.stroke = "#5d80f5";
            currentFrame = 10;
            setFrame(10, 15, animationSpeed);
            break;
          case val == 100 && lastVal < 100:
            idleStep = 5 * 4;
            //tranStep = 16 * 5;
            document.querySelector("#bar").style.stroke = "#3f5bcb";
            currentFrame = 15;
            setFrame(15, 20, animationSpeed);
            break;
          default:
            // Handle any other cases here
            break;
        }
        // Update last processed value
        lastVal = val;
        break;
      case "orange":
        break;
      case "white":
        break;
    }

    //Value
    //Value
    let pct = (100 - val) / 100;
    path.style.strokeDashoffset = pct * dasharray;
    document.querySelector(".percent_value").textContent = goal_amount.toFixed(0) + `/{goal_total}`;
    document.querySelector(".goal_text").textContent = textLabel;
  }
}
