let canvas = document.getElementById("canvasSrc");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = canvas.width = 200;
let CANVAS_HEIGHT = canvas.height = 200;
let spriteWidth = 192;
let spriteHeight = 192;
const image = new Image();
image.src = 'https://se-widgets.s3.ap-southeast-2.amazonaws.com/assets/cat/full-cat.png';
//animation can play
let totalFrame = 7;
let currentFrame = 0;
//pos
let frameX = 0;
let frameY = 0;
//min, max frame
let minFrame = 0;
let maxFrame = 21;
//slowdown
let frameDown = 0;
// speed control
let speed = 8; // Adjust this value to control the animation speed

// Clear the canvas once before starting the animation
ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

function animate() {
    requestAnimationFrame(animate);

    frameDown++;
    if (frameDown % speed === 0) {
        currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
        frameX = currentFrame % totalFrame;
        frameY = Math.floor(currentFrame / totalFrame);

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(image, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    }
}

animate();
