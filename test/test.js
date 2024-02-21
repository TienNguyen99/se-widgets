//Global state object
let goal_total = 0;
let goal_amount = 0;
let follower_name = "";
let fieldData;
let data;

window.addEventListener("onWidgetLoad", function (obj) {
  fieldData = obj.detail.fieldData;
  goal_total = fieldData.goal_total;
  goal_amount = fieldData.goal_amount;
  renderHTML(data);
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
      renderHTML(data);
      break;
    case "follower-latest":
      goal_amount += event["amount"];
      follower_name = event["name"];
      renderHTML(data);
      break;
  }
});
//Function
function changeStatus(percent) {
  const slimeImage = document.querySelector(".slime");
  if (percent >= 50) {
    slimeImage.src =
      "https://tiennguyen99.github.io/se-widgets/assets/slime/jump-slime.jpg";
  } else {
    slimeImage.src =
      "https://tiennguyen99.github.io/se-widgets/assets/slime/idle-slime.jpg";
  }
}

let renderHTML = (data) => {
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

    document.querySelector(".percent_value").textContent = val;
  }
};
