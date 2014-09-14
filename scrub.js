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
	var width = $('#ticker-container').width();
	var duration = $('#project-duration').val();
	for(var i=0; i<duration; i++){
		$('#ticker-container').append('<span style="width:' + Math.floor(width/duration) + 'px;">' + (i+1) + 's</span>');
	}
}

$('#project-duration').on("keyup",function(){
	buildTicker();
});

function updateSlider() {
	setTimeout(function(){
		if (!svg.animationsPaused()) {
			$('.play-btn').addClass('playing');
			time = (svg.getCurrentTime()/getDuration())*slider.attr('max');
			if(time >= slider.attr('max')){
				svg.setCurrentTime(0);
				slider.val(0);
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