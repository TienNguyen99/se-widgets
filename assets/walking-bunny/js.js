// Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
let eye = "";
let head1 = "";
let head2 = "";
let neck = "";
let nose = "";
let wings = "";
let skin = "";

/* Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let spriteWidth = 64;
let spriteHeight = 64;
let CANVAS_WIDTH = (canvas.width = spriteWidth);
let CANVAS_HEIGHT = (canvas.height = spriteHeight);
const WALK_MIN_FRAME = 13;
const WALK_MAX_FRAME = 20;
const BUNNY_MARGIN = 8;
const BUNNY_STEP = 0.35;

// 🆕 Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const bunnyDraw = new Image();
bunnyDraw.src = "https://tiennguyen99.github.io/se-widgets/assets/walking-bunny/bunny.png";


// animation control
let totalFrame = 13;
let currentFrame = 0;
let frameX = 0;
let frameY = 0;
let minFrame = 0;
let maxFrame = 5;
let frameDown = 0;
let speed = 4;
let animationId;
let danceSpam = [];
let bunnyX = BUNNY_MARGIN;
let bunnyDirection = 1;

// Load assets
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  eye = fieldData.eye;
  head1 = fieldData.head1;
  head2 = fieldData.head2;
  neck = fieldData.neck;
  nose = fieldData.nose;
  wings = fieldData.wings;
  skin = fieldData.skin;
  speed = animationSpeed;
  if (fieldData.onoffText) {
    document.getElementById("text_box").classList.add("hidden");
    document.getElementById("frame").classList.add("hidden");
  } else {
    document.getElementById("text_box").classList.remove("hidden");
    document.getElementById("frame").classList.remove("hidden");
  }



  setWalkingFrame();
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
      setFrame(91, 103, animationSpeed);
      document.querySelector("#event").innerHTML = `New Donation`;
      setNameText(name +` Donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}`);
      // document.querySelector("#name").innerHTML = name +` Donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}`;
      playAnimation();
      break;
    case "follower-latest":
      setFrame(26, 38, animationSpeed);
      document.querySelector("#event").innerHTML = `New Follower`;
      setNameText(name + ` Followed`);
      // document.querySelector("#name").innerHTML = name+ ` Followed`;
      playAnimation();
      break;
    case "cheer-latest":
      setFrame(78, 88, animationSpeed);
      document.querySelector("#event").innerHTML = `New Cheer`;
      setNameText(name+ ` Sent ${event.amount} Bit${event.amount == 1 ? '' : 's'}`);
      playAnimation();
      break;
    case "raid-latest":
      setFrame(65, 70, animationSpeed);
      document.querySelector("#event").innerHTML = `New Raid`;
      setNameText( name+ ` Raided`);
      playAnimation();
      break;
    case "subscriber-latest":
      document.querySelector("#event").innerHTML = `New Sub`;
      if (event.bulkGifted){
        setFrame(39, 48, animationSpeed);
         name = data.sender;
         
        setNameText(name+ ` Gifted ${event.amount} Sub${event.amount == 1 ? '' : 's'}`);
        playAnimation();
      }
      else if(event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(52, 64, animationSpeed);
        name = event.sender;
        setNameText(name+ ` Gifted 1 Sub`);
        playAnimation();
      } else {
        setNameText(name+ ` Subscribed`);
        setFrame(39, 48, animationSpeed);
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
  moveBunny();
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);
    bufferCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    bufferCtx.save();
    if (bunnyDirection < 0) {
      bufferCtx.translate(spriteWidth, 0);
      bufferCtx.scale(-1, 1);
    }
    bufferCtx.drawImage(bunnyDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.restore();

    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bufferCanvas, 0, 0);

    if (
      currentFrame === 5 ||
      currentFrame === 20 ||
      currentFrame === 38 ||
      currentFrame === 48 ||
      currentFrame === 64 ||  
      currentFrame === 70 ||
      currentFrame === 88 ||
      currentFrame === 103

    ) {
      setWalkingFrame();
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
  speed = Number(spd) || 4;
  frameDown = 0;
  currentFrame = min;
}

function setWalkingFrame() {
  setFrame(WALK_MIN_FRAME, WALK_MAX_FRAME, animationSpeed);
}

function moveBunny() {
  const bunnyBox = canvas.parentElement;
  const trackWidth = document.getElementById("cont").clientWidth || window.innerWidth;
  const maxX = Math.max(BUNNY_MARGIN, trackWidth - spriteWidth - BUNNY_MARGIN);

  bunnyX += BUNNY_STEP * bunnyDirection;
  if (bunnyX >= maxX) {
    bunnyX = maxX;
    bunnyDirection = -1;
  } else if (bunnyX <= BUNNY_MARGIN) {
    bunnyX = BUNNY_MARGIN;
    bunnyDirection = 1;
  }

  bunnyBox.style.transform = `translate3d(${bunnyX}px, 0, 0)`;
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
  textBox.classList.remove('animate');
  frame.style.animation = "none";

  // Force reflow
  void textBox.offsetWidth;
  void frame.offsetWidth;

  // Re-apply animation
  textBox.classList.add('animate');
  frame.style.animation = "frameAnim 3s steps(19) forwards";
}
function setNameText(nameText) {
  const nameElement = document.querySelector("#name");
  nameElement.innerHTML = nameText;
  nameElement.style.fontSize = nameText.length > 20 ? "19px" : "24px";
}

