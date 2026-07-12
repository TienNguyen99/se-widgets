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
let channelPointReward = "";
let guestBunnyDuration = 45;

/* Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let spriteWidth = 64;
let spriteHeight = 64;
let CANVAS_WIDTH = (canvas.width = spriteWidth);
let CANVAS_HEIGHT = (canvas.height = spriteHeight);
const WALK_MIN_FRAME = 18;
const WALK_MAX_FRAME = 25;

const BUNNY_MARGIN = 8;
const BUNNY_STEP = 0.35;
const ALERT_WIDTH = 400;
const MIN_IDLE_DISTANCE = 160;
const MAX_IDLE_DISTANCE = 360;
const GUEST_BUNNY_STEP = BUNNY_STEP;

// 🆕 Buffer Canvas
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = CANVAS_WIDTH;
bufferCanvas.height = CANVAS_HEIGHT;

// Bunny Sprite
const bunnyDraw = new Image();
bunnyDraw.src = "https://tiennguyen99.github.io/se-widgets/assets/walking-bunny/bunny.png";


// animation control
let totalFrame = 18;
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
let isLatestAnimationPlaying = false;
let isIdlePaused = false;
let idleTimeoutId;
let distanceUntilIdle = randomIdleDistance();
let walkedDistance = 0;
let guestBunnies = [];

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
  channelPointReward = fieldData.channelPointReward || "";
  guestBunnyDuration = Number(fieldData.guestBunnyDuration ?? 45) || 0;
  speed = animationSpeed;
  if (fieldData.onoffText) {
    document.getElementById("text_box").classList.add("hidden");
    document.getElementById("frame").classList.add("hidden");
  } else {
    document.getElementById("text_box").classList.remove("hidden");
    document.getElementById("frame").classList.remove("hidden");
  }



  setWalkingFrame();
  updateFollowerPositions();
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
  let name = getViewerName(event);

  if (isChannelPointEvent(event) && isChannelPointReward(event)) {
    createGuestBunny(name);
    return;
  }

  switch (listener) {
    case "tip-latest":
      setDirectionalFrame(126, 138, 234, 246, animationSpeed);
      document.querySelector("#event").innerHTML = `New Donation`;
      setNameText(name +` Donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}`);
      // document.querySelector("#name").innerHTML = name +` Donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}`;
      playAnimation();
      break;
    case "follower-latest":
      setDirectionalFrame(36, 48, 144, 156, animationSpeed);
      document.querySelector("#event").innerHTML = `New Follower`;
      setNameText(name + ` Followed`);
      // document.querySelector("#name").innerHTML = name+ ` Followed`;
      playAnimation();
      break;
    case "cheer-latest":
      setDirectionalFrame(108, 118, 216, 226, animationSpeed);
      document.querySelector("#event").innerHTML = `New Cheer`;
      setNameText(name+ ` Sent ${event.amount} Bit${event.amount == 1 ? '' : 's'}`);
      playAnimation();
      break;
    case "raid-latest":
      setDirectionalFrame(90, 107, 198, 215, animationSpeed);
      document.querySelector("#event").innerHTML = `New Raid`;
      setNameText( name+ ` Raided`);
      playAnimation();
      break;
    case "subscriber-latest":
      document.querySelector("#event").innerHTML = `New Sub`;
      if (event.bulkGifted){
        setDirectionalFrame(54, 63, 162, 171, animationSpeed);
         name = data.sender;
         
        setNameText(name+ ` Gifted ${event.amount} Sub${event.amount == 1 ? '' : 's'}`);
        playAnimation();
      }
      else if(event.isCommunityGift) return false;
      else if (event.gifted) {
        setDirectionalFrame(72, 86, 180, 194, animationSpeed);
        name = event.sender;
        setNameText(name+ ` Gifted 1 Sub`);
        playAnimation();
      } else {
        setNameText(name+ ` Subscribed`);
        setDirectionalFrame(54, 63, 162, 171, animationSpeed);
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
  if (!isLatestAnimationPlaying && !isIdlePaused) {
    moveBunny();
  }
  animateGuestBunnies();
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

    if (isLatestAnimationPlaying && currentFrame === maxFrame) {
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
  currentFrame = minFrame - 1;
}

function setDirectionalFrame(forwardMin, forwardMax, reverseMin, reverseMax, spd) {
  clearTimeout(idleTimeoutId);
  isIdlePaused = false;
  isLatestAnimationPlaying = true;
  if (bunnyDirection < 0) {
    setFrame(reverseMin, reverseMax, spd);
  } else {
    setFrame(forwardMin, forwardMax, spd);
  }
}

function setWalkingFrame() {
  isLatestAnimationPlaying = false;
  setFrame(WALK_MIN_FRAME, WALK_MAX_FRAME, animationSpeed);
}

function startIdlePause() {
  isIdlePaused = true;
  clearTimeout(idleTimeoutId);
  setFrame(0, 5, animationSpeed);

  const idleDuration = 2000 + Math.random() * 1000;
  idleTimeoutId = setTimeout(function () {
    isIdlePaused = false;
    resetIdleDistance();
    setWalkingFrame();
  }, idleDuration);
}

function moveBunny() {
  const trackWidth = document.getElementById("cont").clientWidth || window.innerWidth;
  const maxX = Math.max(BUNNY_MARGIN, trackWidth - spriteWidth - BUNNY_MARGIN);

  bunnyX += BUNNY_STEP * bunnyDirection;
  walkedDistance += BUNNY_STEP;
  if (bunnyX >= maxX) {
    bunnyX = maxX;
    bunnyDirection = -1;
  } else if (bunnyX <= BUNNY_MARGIN) {
    bunnyX = BUNNY_MARGIN;
    bunnyDirection = 1;
  }

  updateFollowerPositions();

  if (walkedDistance >= distanceUntilIdle) {
    startIdlePause();
  }
}

function updateFollowerPositions() {
  const bunnyBox = canvas.parentElement;
  const trackWidth = document.getElementById("cont").clientWidth || window.innerWidth;
  const maxAlertX = Math.max(0, trackWidth - ALERT_WIDTH);
  const alertX = Math.min(Math.max(0, bunnyX + spriteWidth / 2 - ALERT_WIDTH / 2), maxAlertX);

  bunnyBox.style.transform = `translate3d(${bunnyX}px, 0, 0)`;
  document.getElementById("frame").style.transform = `translate3d(${alertX}px, 0, 0)`;
  document.getElementById("text_box").style.transform = `translate3d(${alertX}px, 0, 0)`;
}

function randomIdleDistance() {
  return MIN_IDLE_DISTANCE + Math.random() * (MAX_IDLE_DISTANCE - MIN_IDLE_DISTANCE);
}

function resetIdleDistance() {
  walkedDistance = 0;
  distanceUntilIdle = randomIdleDistance();
}

function getViewerName(event) {
  return event.name || event.displayName || event.username || event.userName || event.data?.username || event.data?.displayName || event.user?.name || event.user?.displayName || "Viewer";
}
function isChannelPointEvent(event) {
  return event.type === "channelPointsRedemption" || objListenerIsRedemption(event);
}

function objListenerIsRedemption(event) {
  return Boolean(
    event.itemId ||
    event.itemName ||
    event.rewardTitle ||
    event.rewardName ||
    event.data?.redemption ||
    event.reward?.title ||
    event.reward?.name
  );
}

function isChannelPointReward(event) {
  const targetReward = normalizeText(channelPointReward);
  if (!targetReward) return false;

  const rewardName = normalizeText(
    event.data?.redemption ||
    event.itemName ||
    event.title ||
    event.rewardTitle ||
    event.rewardName ||
    event.item?.name ||
    event.reward?.title ||
    event.reward?.name ||
    ""
  );

  return rewardName === targetReward;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function createGuestBunny(viewerName) {
  const guest = document.createElement("div");
  guest.className = "guest_bunny";

  const label = document.createElement("div");
  label.className = "guest_name";
  label.textContent = viewerName || "Viewer";

  const guestCanvas = document.createElement("canvas");
  guestCanvas.width = spriteWidth;
  guestCanvas.height = spriteHeight;

  guest.appendChild(label);
  guest.appendChild(guestCanvas);
  document.getElementById("cont").appendChild(guest);

  const trackWidth = document.getElementById("cont").clientWidth || window.innerWidth;
  const maxX = Math.max(BUNNY_MARGIN, trackWidth - spriteWidth - BUNNY_MARGIN);
  const guestState = {
    element: guest,
    canvas: guestCanvas,
    ctx: guestCanvas.getContext("2d"),
    x: Math.min(Math.max(BUNNY_MARGIN, bunnyX + 76), maxX),
    direction: bunnyDirection,
    currentFrame: WALK_MIN_FRAME - 1,
    frameDown: 0,
    removeAt: getGuestBunnyRemoveAt()
  };

  guestBunnies.push(guestState);
  updateGuestBunnyPosition(guestState);
  drawGuestBunny(guestState);
}

function getGuestBunnyRemoveAt() {
  if (guestBunnyDuration <= 0) return Infinity;
  return Date.now() + guestBunnyDuration * 1000;
}
function animateGuestBunnies() {
  for (let i = guestBunnies.length - 1; i >= 0; i--) {
    const guest = guestBunnies[i];
    if (Date.now() >= guest.removeAt) {
      guest.element.remove();
      guestBunnies.splice(i, 1);
      continue;
    }

    moveGuestBunny(guest);
    guest.frameDown++;
    if (guest.frameDown % speed !== 0) continue;

    guest.currentFrame = guest.currentFrame < WALK_MAX_FRAME ? guest.currentFrame + 1 : WALK_MIN_FRAME;
    drawGuestBunny(guest);
  }
}

function moveGuestBunny(guest) {
  const trackWidth = document.getElementById("cont").clientWidth || window.innerWidth;
  const maxX = Math.max(BUNNY_MARGIN, trackWidth - spriteWidth - BUNNY_MARGIN);

  guest.x += GUEST_BUNNY_STEP * guest.direction;
  if (guest.x >= maxX) {
    guest.x = maxX;
    guest.direction = -1;
  } else if (guest.x <= BUNNY_MARGIN) {
    guest.x = BUNNY_MARGIN;
    guest.direction = 1;
  }

  updateGuestBunnyPosition(guest);
}

function updateGuestBunnyPosition(guest) {
  guest.element.style.transform = `translate3d(${guest.x}px, 0, 0)`;
}

function drawGuestBunny(guest) {
  const guestFrameX = guest.currentFrame % totalFrame;
  const guestFrameY = Math.floor(guest.currentFrame / totalFrame);

  guest.ctx.clearRect(0, 0, spriteWidth, spriteHeight);
  guest.ctx.save();
  if (guest.direction < 0) {
    guest.ctx.translate(spriteWidth, 0);
    guest.ctx.scale(-1, 1);
  }
  guest.ctx.drawImage(bunnyDraw, guestFrameX * spriteWidth, guestFrameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
  guest.ctx.restore();
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

