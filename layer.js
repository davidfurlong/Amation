var count = 0;

function buildLayers() {
	var svg = $("#canvas");
	var bars = $(".bars");
	var children = svg.children();

	// create each layer
	children.each(function(i) {
		var group = children[i];
		var bar = buildAnimation($(group));

		var clearfix = $('<div class="clearfix"></div>');
		
		clearfix.append(bar);
		bars.append(clearfix);
	});
};

function buildAnimation(group) {
	var animation = group.children().filter('animate, animateColor, animateTransform');
	var bar = $('<div class="bar"></div>');
	bar.append('<hr>');
	animation.each(function(i) {
		var time = parseInt($(animation[i]).attr("begin"));
		bar.append('<div class="keyframe" data-time="' + time + '"></div>');
	});
	return bar;
};

