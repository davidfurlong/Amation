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
		svg.unpauseAnimations();
		updateSlider();
	});
	updateSlider();
};

function updateSlider() {
	setTimeout(function(){
		if (!svg.animationsPaused()) {
			time = (svg.getCurrentTime()/getDuration())*slider.attr('max');
			slider.val(time);
			updateSlider();
		}
	}, 200);
};

function getDuration() {
	durationField = $("#project-duration");
	return durationField.val();
}