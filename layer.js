// function updateAnimation(){
// 	var currentSlide = 0;
// 	var id = 400;

// 	var g = $('#'+id);
// 	var anim = g.children('animate, animateTransform, animateColor');
// 	anim.sort(function(a, b){
// 		return (parseInt(b.attr('dur').replace('s', ''))+parseInt(b.attr('begin').replace('s', '')))-(parseInt(a.attr('dur').replace('s', ''))+parseInt(a.attr('begin').replace('s', '')));
// 	});
// 	var initial = g;
	
// 	if(currentSlide = 0){
// 		initial.setAttribute('fill', $('#layer-fg').val());
// 		initial.setAttribute('stroke', $('#layer-bg').val());
// 		initial.setAttribute('width', $('#layer-w').val());
// 		initial.setAttribute('height', $('#layer-h').val());
// 		initial.setAttribute('opacity', $('#layer-opacity').val());
// 		initial.setAttribute('scale', $('#layer-scale').val());
// 		initial.setAttribute('stroke-width', $('#layer-weight').val());
// 		initial.setAttribute('transform', 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')');
// 	}
// }

// function updateTrackOffset(trackID, el){
// 	if($(el).find('.bar').position())
// 		var elq = $(el).find('.bar').position().left || 0;
// 	else
// 		var elq = 0;

// 	tracks[trackID].offset = elq;
// }

function createTrack(trackID,fileName){
	var bars = $(".bars");
	var bg = '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
	var newBarContainer = $('<div class="clearfix track new-bar" data-trackid="'+trackID+'"></div>');
	var bar = $('<div class="bar" style="background-color:'+bg+';" data-color="'+bg+'"><hr><div class="width-handle new-handle"></div></div><h3 class="layer-name">'+fileName.replace('.svg','')+'</h3>');
	newBarContainer.append(bar);
	bars.append(newBarContainer);
	$('.new-bar').draggable().removeClass('new-bar');
	$('.new-handle').dragWidth().removeClass('new-handle');
}

function editKeyFrame(trackID, pos){
	console.log(trackID);
	console.log(pos);
	console.log(tracks[trackID]);
	var kf = findKeyFrameByPos(tracks[trackID].keyframes, pos);
	console.log(kf);
	if(kf == -1){
		console.error('KeyFrame not found');
		return
	}
	kf.attr = {};
	kf.attr['fill'] = $('#layer-fg').val();
	kf.attr['stroke'] = $('#layer-bg').val();
	kf.attr['width'] = $('#layer-w').val();
	kf.attr['height'] = $('#layer-h').val();
	kf.attr['opacity'] = $('#layer-opacity').val();
	kf.attr['scale'] = $('#layer-scale').val();
	kf.attr['stroke-width'] = $('#layer-weight').val();
	kf.attr['x'] = $('#layer-x').val();
	kf.attr['y'] = $('#layer-y').val();
	kf.attr['rotate'] = $('#layer-rotation').val();
	// kf.attr['transform'] = 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')';
	
	recalculateAnimations(trackID);
}

function createKeyFrame(trackID, pos, el) {

	$('.selected').removeClass('selected');
	var newKeyFrame = $('<div class="keyframe selected" data-pos="' + pos + '" style="left:'+(pos-8)+'px;"></div>');
	tracks[trackID].keyframes.push(
		{
			"pos": pos, // acts like an id
			"el": newKeyFrame
		}
	);
	el = el || $('[data-trackid="'+trackID+'"] .bar');
	$(el).append(newKeyFrame);	
}

function deleteKeyFrame(trackID, pos) {
	if(pos == 0)
		return
	tracks[trackID].keyframes = tracks[trackID].keyframes.filter(function(el){
		return el.pos != pos;
	});
	$('[data-trackID="'+trackID+'"] .bar').remove();

	recalculateAnimations(trackID);
}


function populateDetails(trackID, pos) {
	console.log(tracks[trackID].keyframes);
	var kf = findKeyFrameByPos(tracks[trackID].keyframes, pos);
	console.log(trackID);
	console.log(pos);
	
	if(kf == -1){
		console.error('KeyFrame not found');
		return
	}
	if(kf.hasOwnProperty('attr')){
		$('#layer-fg').val(kf.attr['fill'] || "");
		$('#layer-bg').val(kf.attr['stroke']  || "");
		$('#layer-w').val(kf.attr['width'] || "");
		$('#layer-h').val(kf.attr['height']  || "");
		$('#layer-opacity').val(kf.attr['opacity'] || "");
		$('#layer-scale').val(kf.attr['scale'] || "");
		$('#layer-weight').val(kf.attr['stroke-width'] || "");
		$('#layer-x').val(kf.attr['x'] || "0");
		$('#layer-y').val(kf.attr['y'] || "0");
		$('#layer-rotation').val(kf.attr['rotate'] || "0");
	}
}

function removeKeyFrameByPos(ray, pos) {
	for(var i = 0; i < ray.length; ray++){
		if(ray[i].pos == pos){
			ray.splice(i, 1);
		}
	}
	return -1;
}

function findKeyFrameByPos(ray, pos) {
	console.log(typeof ray);
	console.log(ray.length);
	for(var k = 0; k < ray.length; k++){
		if(ray[k].pos == pos) {
			return ray[k];
		}
	}
	return -1;
}

function animationReset(elId, transform, value) {
	var el = document.getElementById(elId);
	switch (transform) {
		case 'rotate':
			// split up rotation data
			var to = value.split(" ");
			el.setAttribute('transform', 'rotate(' + to[0] + ', ' + to[1] + ', ' + to[2] + ')');
			break;
	}


}

function recalculateAnimations(trackID) {
	console.log('recalculating Animations');
	console.log(tracks);
	var keyFrames = tracks[trackID].keyframes;
	keyFrames = keyFrames.sort(function(a, b){
		return (parseInt(a.pos) - parseInt(b.pos));
	});
	var el = tracks[trackID].el;
	var totalDuration = $('#project-duration').val();
	var totalWidth = parseInt($('#ticker-container').width(),10);
	var trackWidth = parseInt($('.track[data-trackid="'+trackID+'"]').find('.bar').width(), 10);
	var trackOffset = parseInt($('.track[data-trackid="'+trackID+'"]').find('.bar').position().left, 10);
	
	var trackDuration = (trackWidth / totalWidth) * totalDuration;
	var trackStart = (trackOffset / totalWidth) * totalDuration;
	$(el).find('animate, animateTransform, animateColor').remove();

	function pTs(pos){
		return totalDuration * (pos / totalWidth);
	}

	console.log('Timing test');
	console.log('total:'+totalDuration);
	console.log('track:'+trackDuration);
	console.log('start:'+trackStart);
	// variable, previous value, previous time in seconds
	// todo may not be in seconds
	var fields = [['fill', null , -1], ['stroke', null , -1], ['width', null , -1], ['height', null , -1], ['opacity', null , -1], ['stroke-width', null , -1], ['scale', null , -1], ['x', null , -1], ['y', null , -1], ['rotate', null , -1]];
	for(var i = 0; i < keyFrames.length; i++){
		var kf = keyFrames[i];
		var kfa = kf.attr;
		console.log(kf);
		if(kfa != undefined){
			for(var j = 0; j < fields.length; j++){
				if(kfa.hasOwnProperty(fields[j][0])){
					if(fields[j][2] != -1){
						console.log('ANIMATION HAPPEN');
						console.log(fields[j][0]);
						// Create animation dawg.
						switch(fields[j][0]) { // something broken
						    case "rotate":
						    	console.log((fields[j][2]));
						    	console.log(pTs(kf['pos']));
						    	console.log(kfa["rotate"]);
						    	console.log(fields[j][1]);
						    	console.log(typeof (fields[j][2]-pTs(kf['pos'])));
						        var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
			        			anim.setAttribute('attributeName', 'transform');
			        			anim.setAttribute('begin', (fields[j][2]).toFixed(2)+'s');
			        			anim.setAttribute('dur', (pTs(kf['pos'])-fields[j][2]).toFixed(2)+"s");
			        			anim.setAttribute('type', 'rotate');
			        			anim.setAttribute('from', fields[j][1]+' 100 100'/*parseInt(fields[j][1])*/);
			        			anim.setAttribute('to', kfa["rotate"]+' 100 100'/*kfa["rotate"]*/);
			        			anim.setAttribute('onend', 'animationReset("' + el.getAttribute('id') + '", "' + anim.getAttribute('type') +  '", "'+ anim.getAttribute('to')+'")');
			        			el.appendChild(anim);
			        			console.log('appended animation');
						        break;
						}
					}
					console.log('Has happened once')
					fields[j][1] = kfa[fields[j][0]];
					fields[j][2] = pTs(kf['pos']);
				}
			}
		}
	}
}



// kf.setAttribute('fill', $('#layer-fg').val());
// kf.setAttribute('stroke', $('#layer-bg').val());
// kf.setAttribute('width', $('#layer-w').val());
// kf.setAttribute('height', $('#layer-h').val());
// kf.setAttribute('opacity', $('#layer-opacity').val());
// kf.setAttribute('scale', $('#layer-scale').val());
// kf.setAttribute('stroke-width', $('#layer-weight').val());
// kf.setAttribute('transform', 'translate('+$('#layer-x').val()+' '+$('#layer-y').val()+') rotate('+$('#layer-rotation').val()+')');
