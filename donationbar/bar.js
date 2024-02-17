document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  // Bán kính và tâm của đường tròn
  var radius = 80;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  // Góc bắt đầu và kết thúc của khoảng cần khoét (30 độ phía dưới)
  var startAngle = 0;
  var endAngle = (30 * Math.PI) / 180;

  // Vẽ đường tròn với đường viền (stroke)
  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, 2 * Math.PI);
  context.lineWidth = 5; // Độ rộng của đường viền
  context.strokeStyle = "#000"; // Màu sắc của đường viền
  context.stroke();
});
