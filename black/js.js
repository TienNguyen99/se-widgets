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
let spriteWidth = 400;
let spriteHeight = 400;

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
let totalFrame = 33;
let currentFrame = 0;
let frameX = 0;
let frameY = 0;
let minFrame = 0;
let maxFrame = 5;
let frameDown = 0;
let speed = 4;
let animationId;
let danceSpam = [];

// Sleep animation control
let sleepTimeout;
let isSleeping = false;
const SLEEP_DELAY = 30000; // 30 seconds
let pendingEvent = null;
let pendingListener = null;

// Load assets
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  head1 = fieldData.head1;
  skin = fieldData.skin;
  speed = animationSpeed;


if (head1 === "none" || !head1) {
  head1Draw.src = ``;
} else {
  head1Draw.src = `https://tiennguyen99.github.io/se-widgets/assets/blk/{head1}.png`;
}

if (skin === "none" || !skin) {
  charDraw.src = ``;
} else {
  charDraw.src = `https://tiennguyen99.github.io/se-widgets/assets/blk/{skin}.png`;
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
  
  // If sleeping, wake up first
  if (isSleeping) {
    wakeUpFromSleep(listener);
    return;
  }
  
  switch (listener) {
    case "tip-latest":
      setFrame(165, 176, animationSpeed);
      stopAnimation();
      animate();
      
      break;
    case "follower-latest":
      setFrame(66, 77, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "cheer-latest":
      setFrame(165, 176, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "raid-latest":
      setFrame(99, 116, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "subscriber-latest":
      if (event.bulkGifted){
        setFrame(165, 176, animationSpeed);
              stopAnimation();
      animate();
      }
      else if(event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(165, 176, animationSpeed);
              stopAnimation();
      animate();
      } else {
        setFrame(132, 151, animationSpeed);
              stopAnimation();
      animate();
      }
      break;
    case "message":
      if (event.data.text.includes("!sleep")) setFrame(33, 65, animationSpeed);
            stopAnimation();
      animate();
      if (event.data.text.includes("!pat")) setFrame(198, 224, animationSpeed);
            stopAnimation();
      animate();
      if (event.data.text.includes("!feed")) setFrame(231, 247, animationSpeed);
            stopAnimation();
      animate();
      if (event.data.text.includes("!explosion")) setFrame(264, 289, animationSpeed);
            stopAnimation();
      animate();
      break;
  }

  stopAnimation();
  animate();
  resetSleepTimer();
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
    bufferCtx.drawImage(charDraw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    bufferCtx.drawImage(head1Draw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bufferCanvas, 0, 0);

    if (
      currentFrame === 65 ||
      currentFrame === 77 ||
      currentFrame === 116 ||
      currentFrame === 151 ||
      currentFrame === 176 ||
      currentFrame === 224 ||
      currentFrame === 247 ||
      currentFrame === 289 ||
      currentFrame === 305 ||
      currentFrame === 310 ||
      currentFrame === 315
    ) {
      // If was sleeping and woke up, continue with tip animation
      if (!isSleeping && currentFrame === 315) {
        if (pendingEvent) {
          // Process the pending event - show tip-latest
          setFrame(165, 176, animationSpeed);
          pendingEvent = null;
        } else {
          setFrame(0, 5, animationSpeed);
        }
      } 
      // Continuous sleep animation
      else if (isSleeping && currentFrame === 305) {
        setFrame(305, 310, animationSpeed);
      }
      // Return to idle
      else if (!isSleeping && pendingEvent === null) {
        setFrame(0, 5, animationSpeed);
      }
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

// Reset sleep timer - called when activity happens
function resetSleepTimer() {
  clearTimeout(sleepTimeout);
  isSleeping = false;
  
  // Set new timer to trigger sleep animation after 30 seconds
  sleepTimeout = setTimeout(() => {
    triggerSleep();
  }, SLEEP_DELAY);
}

// Trigger sleep animation sequence
function triggerSleep() {
  isSleeping = true;
  // setFrame(300, 305) - sit down animation
  setFrame(300, 305, animationSpeed);
  stopAnimation();
  animate();
}

// Wake up and handle event
function wakeUpFromSleep(eventType) {
  if (!isSleeping) return;
  
  isSleeping = false;
  clearTimeout(sleepTimeout);
  
  // setFrame(311, 315) - wake up animation
  setFrame(311, 315, animationSpeed);
  stopAnimation();
  animate();
  
  // Store the event to be processed after wake up
  pendingEvent = eventType;
}
