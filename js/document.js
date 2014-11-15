function saveDocument(){
	var serializer = new XMLSerializer();
	var svg = $('#canvas').get(0);
	var serializedSvg = serializer.serializeToString(svg);

	var x = $.extend(true, {}, tracks);
	console.log(x);
	for(track in x){
		x[track].el = x[track].el.id;
		x[track].keyframes = x[track].keyframes.map(function(keyframe, i, ray){
			delete keyframe.el
			return keyframe
		})
	}
	return {'model':x, 'svg':serializedSvg};
}

function loadDocument(model, svg){
	// parses SVG string to SVG Dom and appends each child
	var parser = new DOMParser();
	var doc = parser.parseFromString(s, "image/svg+xml");
	var svgParsed = $($(doc).find('svg')[0]).children();
	svgParsed.forEach(function(el){
		$('#canvas').append(el);
	});

	// sets the model and creates appropriate objects
	tracks = $.extend(true, {}, model);
	for(track in tracks){
		createTrack(track,tracks[track].trackName);
		tracks[track].el = $('#'+track).get(0);
		tracks[track].keyframes.forEach(function(keyframe){
			keyframe[el] = createKeyFrame(track, keyframe[pos], null);
		});
	}
}

function downloadSVG(){
	var s = new XMLSerializer();
	var d = $('#canvas').get(0);
	var str = s.serializeToString(d);
	var projectTitle = $('#project-title-input').val()
	var blob = new Blob([str], {type: "image/svg+xml"});
	saveAs(blob, projectTitle+".svg");
}
