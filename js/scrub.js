var svg, time, slider;

function setupScrub() {
	svg = document.getElementById("canvas");
	slider = $("#slider");
	time = 0;

	slider.on("mousedown", function() {
		svg.pauseAnimations();
		slider.on("mousemove mouseup", function() {
			time = ($(this).val()/slider.attr('max'))*getDuration();
			svg.setCurrentTime(time);
		});
	});

	slider.on("mouseup", function() {
		$(this).off("mousemove");
		if($('.play-btn').hasClass('playing')){
			svg.unpauseAnimations();
		}
		else{
			svg.pauseAnimations();
		}
		updateSlider();
	});


	buildTicker();
	updateSlider();
};

function buildTicker(){
	$('#ticker-container').html('');
	var width = $('#slider').width();
	var duration = parseInt($('#project-duration').val());
	for(var i=0; i<duration; i++){
		$('#ticker-container').append('<span style="width:' + Math.floor(width/(duration)) + 'px;">' + i + 's</span>');
	}
}

$('#project-duration').on("keyup",function(){
	buildTicker();
});

function alignStick(pos){	
	svg.setCurrentTime(pos);
	svg.pauseAnimations();
	slider.val((pos/11));
}

function updateSlider() {
	setTimeout(function(){
		if (!svg.animationsPaused()) {
			$('.play-btn').addClass('playing');
			time = (svg.getCurrentTime()/getDuration())*slider.attr('max');
			if(time >= slider.attr('max')){
				if($('#loop-btn').hasClass('active')){
					svg.setCurrentTime(0);
					slider.val(0);
				}
				else {
					
					svg.setCurrentTime(0);
					svg.pauseAnimations();
					slider.val(0);
				}
			}
			else{
				slider.val(time);
			}
			updateSlider();
		}
		else{
			$('.play-btn').removeClass('playing');
		}
	}, 1);
};

function getDuration() {
	return $("#project-duration").val();
}