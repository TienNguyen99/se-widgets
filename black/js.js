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

// Buffer Canvas
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
let totalFrame = 45;
let currentFrame = 0;
let frameX = 0;
let frameY = 0;
let minFrame = 0;
let maxFrame = 5;
let frameDown = 0;
let speed = 4;
let animationId;
let danceSpam = [];
let customSleepTime = false;
// Sleep animation control
let sleepTimeout;
let isSleeping = false;
const SLEEP_DELAY = 10000; // Default sleep delay: 10 seconds
let pendingEvent = null;
let pendingListener = null;
let pendingEventData = null;
let isCommandPlaying = false; // Track if command animation is playing

// Load assets
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  head1 = fieldData.head1;
  skin = fieldData.skin;
  customSleepTime = fieldData.customSleepTime;
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
  resetSleepTimer();
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
    wakeUpFromSleep(listener, event);
    return;
  }
  
  switch (listener) {
    case "tip-latest":
      setFrame(225, 236, animationSpeed);
      stopAnimation();
      animate();
      
      break;
    case "follower-latest":
      setFrame(90, 101, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "cheer-latest":
      setFrame(225, 236, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "raid-latest":
      setFrame(135, 152, animationSpeed);
            stopAnimation();
      animate();
      break;
    case "subscriber-latest":
      if (event.bulkGifted){
        setFrame(225, 236, animationSpeed);
              stopAnimation();
      animate();
      }
      else if(event.isCommunityGift) return false;
      else if (event.gifted) {
        setFrame(225, 236, animationSpeed);
              stopAnimation();
      animate();
      } else {
        setFrame(180, 199, animationSpeed);
              stopAnimation();
      animate();
      }
      break;
    case "message":
      if (event.data.text.includes("!sleep")) {
        setFrame(45, 77, animationSpeed);
        isCommandPlaying = true;
      } else if (event.data.text.includes("!pat")) {
        setFrame(270, 296, animationSpeed);
        isCommandPlaying = true;
      } else if (event.data.text.includes("!feed")) {
        setFrame(315, 331, animationSpeed);
        isCommandPlaying = true;
      } else if (event.data.text.includes("!explode")) {
        setFrame(360, 404, animationSpeed);
        isCommandPlaying = true;
      }
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
    // Only draw head1Draw if it has a source
    if (head1Draw.src && head1Draw.src !== "") {
      bufferCtx.drawImage(head1Draw, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bufferCanvas, 0, 0);

    if (
      currentFrame === 77 ||
      currentFrame === 101 ||
      currentFrame === 152 ||
      currentFrame === 199 ||
      currentFrame === 236 ||
      currentFrame === 296 ||
      currentFrame === 331 ||
      currentFrame === 404 ||
      currentFrame === 408 ||
      currentFrame === 473 ||
      currentFrame === 499
    ) {
      // If command animation finished, return to idle and delay sleep
      if (isCommandPlaying && (currentFrame === 77 || currentFrame === 296 || currentFrame === 331 || currentFrame === 404)) {
        isCommandPlaying = false;
        setFrame(0, 5, animationSpeed);
        resetSleepTimer(); // Reset timer to delay sleep by 5s
        return;
      }
      
      // If was sleeping and woke up, continue with pending event
      if (!isSleeping && currentFrame === 499) {
        if (pendingEvent) {
          // Handle pending event based on type
          handlePendingEvent(pendingEvent, pendingEventData);
          pendingEvent = null;
          pendingEventData = null;
        } else {
          setFrame(0, 5, animationSpeed);
        }
      } 
      // Continuous sleep animation
      else if (isSleeping && currentFrame === 408) {
        setFrame(450, 473, animationSpeed);
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
  
  // Set new timer to trigger sleep animation after customSleepTime seconds (converted to ms)
  const sleepTimeMs = (customSleepTime || 10) * 1000;
  sleepTimeout = setTimeout(() => {
    triggerSleep();
  }, sleepTimeMs);
}

// Trigger sleep animation sequence
function triggerSleep() {
  isSleeping = true;
  // setFrame(405, 408) - sit down animation
  setFrame(405, 408, animationSpeed);
  stopAnimation();
  animate();
}

// Wake up and handle event
function wakeUpFromSleep(eventType, eventData) {
  if (!isSleeping) return;
  
  isSleeping = false;
  clearTimeout(sleepTimeout);
  
  // setFrame(495, 499) - wake up animation
  setFrame(495, 499, animationSpeed);
  stopAnimation();
  animate();
  
  // Store the event to be processed after wake up
  pendingEvent = eventType;
  pendingEventData = eventData;
}

// Handle pending event after waking up
function handlePendingEvent(eventType, eventData) {
  switch(eventType) {
    case "tip-latest":
      setFrame(225, 236, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "follower-latest":
      setFrame(90, 101, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "cheer-latest":
      setFrame(225, 236, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "raid-latest":
      setFrame(135, 152, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "subscriber-latest":
      setFrame(180, 199, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "message":
      // Handle message commands
      if (eventData && eventData.data && eventData.data.text) {
        if (eventData.data.text.includes("!sleep")) {
          setFrame(45, 77, animationSpeed);
          isCommandPlaying = true;
        } else if (eventData.data.text.includes("!pat")) {
          setFrame(270, 296, animationSpeed);
          isCommandPlaying = true;
        } else if (eventData.data.text.includes("!feed")) {
          setFrame(315, 331, animationSpeed);
          isCommandPlaying = true;
        } else if (eventData.data.text.includes("!explode")) {
          setFrame(360, 404, animationSpeed);
          isCommandPlaying = true;
        } else {
          setFrame(0, 5, animationSpeed);
          stopAnimation();
          animate();
        }
        // Don't call stopAnimation/animate for commands - let animation loop continue
        return;
      } else {
        setFrame(0, 5, animationSpeed);
        stopAnimation();
        animate();
      }
      break;
    default:
      setFrame(0, 5, animationSpeed);
      stopAnimation();
      animate();
  }
}
