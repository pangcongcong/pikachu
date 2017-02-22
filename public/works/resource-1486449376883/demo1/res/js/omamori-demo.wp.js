window.requestAnimationFrame = 
	window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame;
var originWidth = 174;
var stopped = false;

var preX, preY;
var dx,dy;
var angle=90, r=0, stepAngle = 5, stepR = 2;
var ctx;
function anim(){
	if(stopped) return;
	angle += stepAngle;
	r += stepR;
	if(angle>810){
		setTimeout(stop, 2000);

		return;
	}

	var x = Math.cos(angle/180*Math.PI)*r/100;
	var y = Math.sin(angle/180*Math.PI)*r/100;
	x = x.toFixed(2);
	y = y.toFixed(2);
	
	$('.hand').css('transform','translate('+x+'rem,'+y+'rem)');
	
	var offset = $('.hand').offset();
	var curX = offset.left + dx;
	var curY = offset.top + dy;
	ctx.beginPath();
	ctx.moveTo(preX, preY);
	ctx.lineTo(curX, curY);
	ctx.closePath();

	ctx.stroke();
	preX = curX;
	preY = curY;

	requestAnimationFrame(anim);
}
function play(){
	var w = $('.hand').width();
	dx = w/originWidth*10;
	dy = w/originWidth*15;


	$('.hand').addClass('hand-ease').css({
		left: '50%',
		top: '50%'
	});

	setTimeout(function(){
		if(stopped) return;
		var canvas = $('#demoCanvas');
		canvas.show();
		canvas[0].width = canvas.width();
		canvas[0].height = canvas.height();
		ctx = canvas[0].getContext('2d');
		ctx.lineJoin = "round";
		ctx.lineWidth = 8;
		ctx.strokeStyle = '#ffffff';
		var offset = $('.hand').offset();
		preX = offset.left + dx;
		preY = offset.top + dy;
		$('.hand').removeClass('hand-ease');
		requestAnimationFrame(anim);
	}, 1500);;
}

function stop(){
	stopped = true;
	$('.hand').hide();
	$('#demoCanvas').hide();
}
module.exports = {
	play: play,
	stop: stop
};