var canvas,el,context;
var flowers = [];
var img;

var COUNT = 100;
var ACC = 0.4;
var BASE_SPEED = 10;
var FLOAT_SPEED = 10;
var MAX_SPEED = -20;
var FLOWER_WIDTH = 20;
var FLOWER_HEIGHT = 19;

var canvasHeight = 0;

window.requestAnimationFrame = 
	window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame;
function init() {
	canvas = document.createElement('canvas');
	el = $(canvas).appendTo(document.body).addClass('bang');
	canvas.width = el.width();
	canvas.height = el.height();
	context = canvas.getContext('2d');

	for(var i=0;i<COUNT;i++){
		var angle = 2*Math.PI*Math.random();
		var speed = Math.random()*FLOAT_SPEED;
		var yspeed = Math.round(Math.sin(angle)*speed);
		if(yspeed>0){
			yspeed *= 2;
		}
		var xspeed = Math.round(Math.cos(angle)*speed);

		flowers.push([xspeed, yspeed, 0, 0]);
	}

	img = new Image();
	img.src = 'https://s5.wandougongzhu.cn/s/72/flower_a370d9.png';
}
function draw(){
	context.clearRect(0,0,canvas.width,canvas.height);
	for(var i=flowers.length-1;i>=0;i--){
		var item = flowers[i];
		var xspeed = item[0];
		var yspeed = item[1];
		item[2] = item[2]+xspeed;
		item[3] = item[3]-yspeed;
		if(yspeed>MAX_SPEED){
			item[1] = yspeed - ACC;
		}
		context.drawImage(img, item[2], item[3], FLOWER_WIDTH, FLOWER_HEIGHT);
		if(item[3]>canvasHeight){
			flowers.splice(i, 1);
		}

	}
	if(flowers.length>0)
		requestAnimationFrame(draw);
}
function bang(x, y){
	var offset = $(canvas).offset();
	var left = offset.width/2;
	var top = offset.height/2;
	canvasHeight = offset.height;
	for(var i=0;i<COUNT;i++){
		flowers[i][2] = left;
		flowers[i][3] = top;
	}
	requestAnimationFrame(draw);
}
module.exports = {
	init: init,
	bang: bang
}