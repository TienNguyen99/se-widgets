//Global state object
let goal_total;
let goal_amount;
let follower_name= '';
let fieldData;
let data;


window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
  	goal_total = fieldData.goal_total;
  	goal_amount = fieldData.goal_amount;
  	renderHTML(data);
});
window.addEventListener('onEventReceived', function (obj) {
	const listener = obj.detail.listener;
  	const event = obj["detail"]["event"];
  	

  // Listen to events based on user field settings
  switch(listener){
    case 'tip-latest':
      goal_amount+= event["amount"];
      renderHTML(data);
      break;
    case 'follower-latest':
      goal_amount+= event["amount"];
      follower_name = event["name"];
      renderHTML(data);
      break;
  }
});
//Function 
function changeStatus(percent){
  	const slimeImage = document.querySelector('.slime');
	if (percent >=50){
        slimeImage.src='https://tiennguyen99.github.io/se-widgets/assets/slime/jump-slime.jpg';
        }else{
        slimeImage.src='https://tiennguyen99.github.io/se-widgets/assets/slime/idle-slime.jpg';
        }
}


let renderHTML = (data) => {
	const chartCircle = document.querySelector('.chart-circle');
	const indicator = chartCircle.querySelector('.chart-indicator');
  	const circlevalue = document.querySelector('.circle_value');
  	const follower = document.querySelector('.follower_name');
  	follower.textContent = "Xin chào"+`${follower_name}`;
  	
  	let p = goal_amount / (goal_total) * 100;
  	changeStatus(p);
  	if(p<=100){
    circlevalue.textContent = `${p}%`;
  	chartCircle.style.setProperty('--p', `${p}%`);
 	indicator.style.setProperty('--p', `${p}%`);
    }
  	else{circlevalue.textContent = '100%';
  	chartCircle.style.setProperty('--p', '100%');
 	indicator.style.setProperty('--p', '100%');}
  	
  
};
