//Global state object
let fieldData;
let data;
let recents;
let animationSpeed = "";
//
let eye = "";
let head1 = "";
let head2 = "";
let neck = "";
let nose = "";
let wings = "";
let skin = "";

/*Canvas field */
let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = (canvas.width = 400);
let CANVAS_HEIGHT = (canvas.height = 400);
let spriteWidth = 400;
let spriteHeight = 400;
// Bunny Sprite
const bunnyDraw = new Image();
bunnyDraw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Bunny/White.png";
// Eye
const eyeDraw = new Image();
eyeDraw.src = "";
// Head1
const head1Draw = new Image();
head1Draw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Cap.png";
// Head2
const head2Draw = new Image();
head2Draw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Antlers.png";
// Neck
const neckDraw = new Image();
neckDraw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Babybluescarf.png";
// Nose
const noseDraw = new Image();
noseDraw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/Bandage.png";
// Wings
const wingsDraw = new Image();
wingsDraw.src =
  "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Wings/Angelwing.png";
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
  head1 = fieldData.head1;
  head2 = fieldData.head2;
  neck = fieldData.neck;
  nose = fieldData.nose;
  wings = fieldData.wings;
  skin = fieldData.skin;

  speed = animationSpeed;
  // Eye
  switch (eye) {
    case "Catmask":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Catmask.png";
      break;
    case "Eyepatch":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Eyepatch.png";
      break;
    case "Glasses":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Glasses.png";
      break;
    case "Heartglasses":
      eyeDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Eyes/Heartglasses.png";
      break;
  }
  switch (head1) {
    case "Cap":
      head1Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Cap.png";
      break;
    case "Crown":
      head1Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Crown.png";
      break;
    case "Flower":
      head1Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Flower.png";
      break;
    case "Hat":
      head1Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 1/Hat.png";
      break;
  }
  switch (head2) {
    case "Antlers":
      head2Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Antlers.png";
      break;
    case "Bandana":
      head2Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Bandana.png";
      break;
    case "Flower":
      head2Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Flower.png";
      break;
    case "Glasses":
      head2Draw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Head 2/Glasses.png";
      break;
  }
  switch (neck) {
    case "Babybluescarf":
      neckDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Babybluescarf.png";
      break;
    case "Bandage":
      neckDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Bandage.png";
      break;
    case "Bowtie":
      neckDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Bowtie.png";
      break;
    case "Scarf":
      neckDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Neck/Scarf.png";
      break;
  }
  switch (nose) {
    case "Bandage":
      noseDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/Bandage.png";
      break;
    case "Heart":
      noseDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/Heart.png";
      break;
    case "Nose":
      noseDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Nose/Nose.png";
      break;
  }
  switch (wings) {
    case "Angelwing":
      wingsDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Wings/Angelwing.png";
      break;
    case "Batwing":
      wingsDraw.src =
        "https://tiennguyen99.github.io/se-widgets/assets/custom-bunny/Wings/Batwing.png";
      break;
  }
  stopAnimation();
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
  animationId = requestAnimationFrame(animate);
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Bunny
    ctx.drawImage(
      bunnyDraw,
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
    //Head1
    ctx.drawImage(
      head1Draw,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    //Head2
    ctx.drawImage(
      head2Draw,
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
