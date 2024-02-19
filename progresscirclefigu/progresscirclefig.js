//Global state object
let goal_total;
let goal_amount;

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
      debugger;
      renderHTML(data);
      break;
  }
});
//runs code on event



let renderHTML = (data) => {
	const chartCircle = document.querySelector('.chart-circle');
	const indicator = chartCircle.querySelector('.chart-indicator');
  	const circlevalue = document.querySelector('.circle_value');
  	
  	
  	let p = goal_amount / (goal_total) * 100;
  	if(p<=100){
    circlevalue.textContent = `${p}%`;
  	chartCircle.style.setProperty('--p', `${p}%`);
 	indicator.style.setProperty('--p', `${p}%`);
    }
  	else{circlevalue.textContent = '100%';
  	chartCircle.style.setProperty('--p', '100%');
 	indicator.style.setProperty('--p', '100%');}
  	
  
};
