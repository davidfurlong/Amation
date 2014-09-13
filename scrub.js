var svg, time, slider;

function setupScrub() {
	svg = document.getElementById("canvas");
	slider = $("#slider");
	time = 0;

	$("#slider").on("mousedown", function() {
		svg.pauseAnimations();
		slider.on("mousemove mouseup", function() {
			time = ($(this).val()/100)*getDuration();
			svg.setCurrentTime(time);
		});
	});

	$("#slider").on("mouseup", function() {
		$(this).off("mousemove");
		svg.unpauseAnimations();
		updateSlider();
	});
	updateSlider();
};

function updateSlider() {
	setTimeout(function(){
		if (!svg.animationsPaused()) {
			time = svg.getCurrentTime()/getDuration()*100;
			slider.val(time);
			updateSlider();
		}
	}, 200);
};

function getDuration() {
	durationField = $("#project-duration");
	return durationField.val();
}


