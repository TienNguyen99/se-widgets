//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let textOrder="";


window.addEventListener("onWidgetLoad", function (obj) {
  fieldData = obj.detail.fieldData;
  goal_total = fieldData.goal_total;
  goal_amount = fieldData.goal_amount;
  textOrder=fieldData.textOrder;
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
      renderHTML();
      break;
    
    
  }
});
//Function
function changeStatus(percent) {
  const slimeImage = document.querySelector('.slime');
  let imageUrl;

  if (percent >= 75) {
    imageUrl = "https://tiennguyen99.github.io/se-widgets/assets/slime/jump-slime.jpg";
  } else if (percent >= 50) {
    imageUrl = "https://tiennguyen99.github.io/se-widgets/assets/slime/jump-slime.jpg";
  } else if (percent >= 25) {
    imageUrl = "https://tiennguyen99.github.io/se-widgets/assets/slime/jump-slime.jpg";
  } else {
    imageUrl = "https://tiennguyen99.github.io/se-widgets/assets/slime/idle-slime.jpg";
  }

  // Set the image source based on the condition
  slimeImage.src = imageUrl;

  // Reset the image source after 5 seconds
  setTimeout(() => {
    slimeImage.src = "https://tiennguyen99.github.io/se-widgets/assets/slime/idle-slime.jpg";
  }, 3000);
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
    changeStatus(val);
    document.querySelector(".percent_value").textContent = goal_amount +`/{goal_total}`;
  }}

