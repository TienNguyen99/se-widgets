//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let textOrder="";
let frameCount = 0;

/*Canvas field */
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
let speed = 3; // Adjust this value to control the animation speed
let animationId;



window.addEventListener("onWidgetLoad", function (obj) {
  fieldData = obj.detail.fieldData;
  goal_total = fieldData.goal_total;
  goal_amount = fieldData.goal_amount;
  textOrder=fieldData.textOrder;
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
      goal_amount += event["amount"];
      follower_name = event["name"];
      setFrame(22, 36,3);
      stopAnimation();
      setTimeout(function() {
    // Set the second frame range (0 to 21 with speed 10)
    setFrame(0, 21, 3);  
      }, 3000);
      //Change pos active
      animateEvent();
      animate();
      renderHTML();
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
        ctx.drawImage(image, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
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
//Animate the event_text

function animateEvent() {
  // Wait for the DOM to be fully loaded
  var boxEvent = document.querySelector('.box_event');
  // Show the box_event after 5 seconds
  boxEvent.style.display = 'block';
  boxEvent.classList.add('animate');
  //Test field
	  setTimeout(function () {
    boxEvent.style.display = 'block';
       boxEvent.classList.remove('animate');
    boxEvent.classList.add('animate-hide');
  }, 8000);
  // Set a timeout to hide the box_event after 5 seconds
  setTimeout(function () {
    boxEvent.style.display = 'none';
   
  }, 10000);
}

  function renderHTML(){
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
    let pct = ((100 - val) / 100) * c;
    circle.style.strokeDashoffset = pct + "px";
    document.querySelector(".percent_value").textContent = goal_amount +`/{goal_total}`;
    
  }}



