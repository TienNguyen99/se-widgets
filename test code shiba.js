/* -----------------------------
   CANVAS 1 — SKIN
----------------------------- */
const canvasSkin = document.getElementById("canvasSkin");
const ctxSkin = canvasSkin.getContext("2d");

let skinImg = new Image();
let spriteWidth = 256;
let spriteHeight = 256;

let currentFrame1 = 0;
let minFrame1 = 0;
let maxFrame1 = 7;
let frameDown1 = 0;
let speed1 = 4;
let totalFrame = 8;
let aniId1 = null;

function animate1() {
    aniId1 = requestAnimationFrame(animate1);
    frameDown1++;

    if (frameDown1 % speed1 === 0) {
        currentFrame1 = currentFrame1 < maxFrame1 ? currentFrame1 + 1 : minFrame1;

        let fx = currentFrame1 % totalFrame;
        let fy = Math.floor(currentFrame1 / totalFrame);

        ctxSkin.clearRect(0, 0, 400, 400);

        if (skinImg.src)
            ctxSkin.drawImage(
                skinImg,
                fx * spriteWidth, fy * spriteHeight,
                spriteWidth, spriteHeight,
                0, 0,
                spriteWidth, spriteHeight
            );
    }
}

function stop1() { cancelAnimationFrame(aniId1); }

function setFrame1(min, max, spd) {
    minFrame1 = min;
    maxFrame1 = max;
    speed1 = spd;
    currentFrame1 = min;
    frameDown1 = 0;
}


/* -----------------------------
   CANVAS 2 — WINGS
----------------------------- */
const canvasWings = document.getElementById("canvasWings");
const ctxWings = canvasWings.getContext("2d");

let wingsImg = new Image();

let currentFrame2 = 0;
let minFrame2 = 0;
let maxFrame2 = 0;
let frameDown2 = 0;
let totalFrame2 = 10;
let speed2 = 4;
let aniId2 = null;

function animate2() {
    aniId2 = requestAnimationFrame(animate2);
    frameDown2++;

    if (frameDown2 % speed2 === 0) {
        currentFrame2 = currentFrame2 < maxFrame2 ? currentFrame2 + 1 : minFrame2;

        let fx = currentFrame2 % totalFrame2;
        let fy = Math.floor(currentFrame2 / totalFrame2);

        ctxWings.clearRect(0, 0, 400, 400);

        if (wingsImg.src)
            ctxWings.drawImage(
                wingsImg,
                fx * spriteWidth, fy * spriteHeight,
                spriteWidth, spriteHeight,
                0, 0,
                spriteWidth, spriteHeight
            );
    }
}

function stop2() { cancelAnimationFrame(aniId2); }

function setFrame2(min, max, spd) {
    minFrame2 = min;
    maxFrame2 = max;
    speed2 = spd;
    currentFrame2 = min;
    frameDown2 = 0;
}


/* -----------------------------
   ON WIDGET LOAD
----------------------------- */
window.addEventListener("onWidgetLoad", function (obj) {
    let fieldData = obj.detail.fieldData;

    speed1 = speed2 = Number(fieldData.animationSpeed) || 4;

    skinImg.src =
        fieldData.skin && fieldData.skin !== "none"
            ? `https://tiennguyen99.github.io/se-widgets/assets/shiba-christmas/${fieldData.skin}.png`
            : "";

    wingsImg.src =`https://tiennguyen99.github.io/se-widgets/assets/shiba-christmas/tree.png`;

    stop1(); stop2();
    animate1();
    animate2();
});


/* -----------------------------
   EVENT RECEIVED (Random)
----------------------------- */
window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;

  const listener = obj.detail.listener;
  const event = obj.detail.event;

  if (listener === "message") {
    const text = event.data.text || "";

    if (text.includes("!shiba")) {
      const r = Math.random();

      if (r < 0.05) { setFrame1(72,79,speed1);  }
      else if (r < 0.20) { setFrame1(64,71,speed1); }
      else if (r < 0.35) { setFrame1(56,63,speed1);  }
      else if (r < 0.40) { setFrame1(48,55,speed1);  }
      else if (r < 0.50) { setFrame1(40,47,speed1);  }
      else if (r < 0.60) { setFrame1(32,39,speed1);  }
      else if (r < 0.70) { setFrame1(24,31,speed1);  }
      else if (r < 0.80) { setFrame1(16,23,speed1);  }
      else { setFrame1(8,15,speed1);  }
    }
     if (text.includes("!tree")) {
      // 5% setFrame2(0,0,speed2)
      const r = Math.random();
      if (r < 0.1) { setFrame2(0,0,speed2); }
      else if (r < 0.1) { setFrame2(1,1,speed2); }
      else if (r < 0.1) { setFrame2(2,2,speed2); }
      else if (r < 0.1) { setFrame2(3,3,speed2); }
      else if (r < 0.1) { setFrame2(4,4,speed2); }
      else if (r < 0.1) { setFrame2(5,5,speed2); }
      else if (r < 0.1) { setFrame2(6,6,speed2); }
      else if (r < 0.1) { setFrame2(7,7,speed2); }
      else if (r < 0.1) { setFrame2(8,8,speed2); }
      else { setFrame2(9,9,speed2);
    }

     }
  }

  stop1(); stop2();
  animate1();
  animate2();
});
