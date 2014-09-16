function fitCanvas(){
	var cw = $('svg#canvas').width();
	var ch = $('svg#canvas').height();
	var containerw = $('.canvas-container').width();
	var containerh = $('.canvas-container').height()

	var scalew = containerw / cw;
	if ((scalew * ch) < containerh){
		$('#canvas-center').css('transform','scale(' + scalew + ')');
		scale = scalew;
	}
	else {
		var scaleh = containerh / ch;
		$('#canvas-center').css('transform','scale(' + scaleh + ')');
		scale = scaleh;
	}
}