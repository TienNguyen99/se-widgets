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
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 256;
let spriteHeight = 256;
const image = new Image();
image.src =
  "https://tiennguyen99.github.io/se-widgets/assets/bee-lychibe/256x256.png";
//animation can play
let totalFrame = 27;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 11;
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
  goal_amount = data["subscriber-session"]["count"];
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
      // if (event.bulkGifted) return;
      // if (event.isCommunityGift) return;
      // goal_amount += 1;
      // currentFrame = 27;
      // setFrame(27, 53, animationSpeed);
      // stopAnimation();
      // animate();
      // renderHTML();
      // break;

      if (event.bulkGifted) {
        goal_amount += 1;
        currentFrame = 27;
        setFrame(27, 53, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      } else if (event.isCommunityGift) return false;
      else if (event.gifted) {
        goal_amount += 1;
        currentFrame = 27;
        setFrame(27, 53, animationSpeed);
        stopAnimation();
        animate();
        renderHTML();
      } else {
        goal_amount += 1;
        currentFrame = 27;
        setFrame(27, 53, animationSpeed);
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

    if (currentFrame === 53) {
      currentFrame = 0;
      setFrame(0, 11, animationSpeed);
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

    let pct = ((100 - val) / 100) * c;

    circle.style.strokeDashoffset = pct + "px";
    document.querySelector(".percent_value").textContent =
      goal_amount.toFixed(0) + `/{goal_total}`;
    document.querySelector(".goal_text").textContent = textLabel;
  }
}
