//Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
//
let eye = "";
let head = "";
let neck = "";
/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 200;
let spriteHeight = 200;
// Bunny Sprite
const image = new Image();
// Eye
const eyeDraw = new Image();
// Head
const headDraw = new Image();
// Neck
const neckDraw = new Image();
// Nose
const noseDraw = new Image();
// Wings
const wingsDraw = new Image();
//animation can play
let totalFrame = 10;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 15;
//slowdown
let frameDown = 0;
// speed control
let speed = 4;
//up = dec down = inc
let animationId;
let danceSpam = [];

//
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;
  animationSpeed = fieldData.animationSpeed;
  eye = fieldData.eye;
  head = fieldData.head;
  neck = fieldData.neck;
  skin = fieldData.skin;
  nose = fieldData.nose;
  wings = fieldData.wings;
  speed = animationSpeed;
  switch (skin) {
    case "White":
    case "BlackWhite":
    case "Mocha":
    case "Pink":
      image.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/{{skin}}.png";
      break;
  }
  switch (eye) {
    case "none":
      eyeDraw.src = "";
      break;
    case "Glasses":
    case "Catmask":
    case "Heartglasses":
    case "Eyepatch":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/{{eye}}.png";
      break;
  }
  switch (head) {
    case "none":
      headDraw.src = "";
      break;
    case "Hat":
    case "Ribbon":
    case "Hat3":
      headDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head/{{head}}.png";
      break;
  }
  switch (neck) {
    case "none":
      neckDraw.src = "";
      break;
    case "Bow":
    case "Scalf":
      neckDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/{{neck}}.png";
      break;
  }
  switch (nose) {
    case "none":
      noseDraw.src = "";
      break;
    case "Bandage":
    case "Clownnose":
    case "Moustacles":
      noseDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/{{nose}}.png";
      break;
  }
  switch (wings) {
    case "none":
      wingsDraw.src = "";
      break;
    case "Angelwing":
    case "Demonwing":
    case "Wings3":
      wingsDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Wings/{{wings}}.png";
      break;
  }
  animate();
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
      currentFrame = 250;
      setFrame(250, 267, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "follower-latest":
      currentFrame = 170;
      setFrame(170, 187, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "cheer-latest":
      currentFrame = 270;
      setFrame(270, 287, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "raid-latest":
      currentFrame = 290;
      setFrame(290, 325, animationSpeed);
      stopAnimation();
      animate();
      break;
    case "subscriber-latest":
      if (event.bulkGifted) return;
      currentFrame = 190;
      setFrame(190, 214, animationSpeed);
      stopAnimation();
      animate();
      if (event.gifted) {
        currentFrame = 220;
        setFrame(220, 241, animationSpeed);
        stopAnimation();
        animate();
      }

      break;
    case "message":
      if (event.data.text.includes("!sleep")) {
        currentFrame = 20;
        setFrame(20, 48, animationSpeed);
        stopAnimation();
        animate();
      }
      if (event.data.text.includes("!angry")) {
        currentFrame = 50;
        setFrame(50, 74, animationSpeed);
        stopAnimation();
        animate();
      }
      if (event.data.text.includes("!pet")) {
        currentFrame = 80;
        setFrame(80, 101, animationSpeed);
        stopAnimation();
        animate();
      }
      if (event.data.text.includes("!feed")) {
        currentFrame = 110;
        setFrame(110, 132, animationSpeed);
        stopAnimation();
        animate();
      }

      if (event.data.text.includes("!dance")) {
        const now = Date.now();
        danceSpam = danceSpam.filter((t) => now - t < 5000);
        danceSpam.push(now);

        if (danceSpam.length > 3) {
          currentFrame = 50; // angry
          setFrame(50, 74, animationSpeed);
        } else {
          currentFrame = 140; // dance
          setFrame(140, 167, animationSpeed);
        }

        stopAnimation();
        animate();
      }
      break;
  }
});
//Function
function animate() {
  
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Bunny
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
    //Nose
    ctx.drawImage(
      noseDraw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    //Eye
    ctx.drawImage(
      eyeDraw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    //Head
    ctx.drawImage(
      headDraw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    //Neck
    ctx.drawImage(
      neckDraw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );

    //Wings
    ctx.drawImage(
      wingsDraw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );

    //Stop
    if (
      currentFrame === 48 ||
      currentFrame === 74 ||
      currentFrame === 101 ||
      currentFrame === 132 ||
      currentFrame === 167 ||
      currentFrame === 187 ||
      currentFrame === 214 ||
      currentFrame === 241 ||
      currentFrame === 267 ||
      currentFrame === 287 ||
      currentFrame === 325
    ) {
      currentFrame = 0;
      setFrame(0, 15, animationSpeed);
    }
  }
}


//Set range of action
function setFrame(min, max, spd) {
  minFrame = min;
  maxFrame = max;
  speed = spd;
  frameDown = 0;
}
