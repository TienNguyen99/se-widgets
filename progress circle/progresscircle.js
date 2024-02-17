let circleprogress = document.querySelector(".circle"),
    circlevalue = document.querySelector(".circle_value");
    let start = 0,
    step = 0,
    end = 100,
    speed = 20;
    // function render(){
    // let progress = setInterval(() => {
    //   start = start + 1;
    //   circlevalue.textContent = `${start}%`;
    //   circleprogress.style.background = `conic-gradient(#FF9494 ${start *3.6}deg, #ededed 0deg`;
    //   if (start == step){
    //     clearInterval(progress);
    //   }

    // }, speed);
    //   if (start >=end || start < 0){
    //     clearInterval(progress);
    //   }
    // }
function render(){
      circlevalue.textContent = `${start}%`;
      circleprogress.style.background = `conic-gradient(#FF9494 ${start *3.6}deg, #ededed 0deg`;
}
    

function updatebar(change){
  start= start +change;
  render();
  
}
