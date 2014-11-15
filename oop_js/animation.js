function recalculateAnimations(){
	removeAllAnimationsFromSVG();
	var m = new Movie();
}

// A "document" or movie object. Is a collection of tracks & their svgs
var Movie = (function(){
	function Movie(){

		// *** pixels
		this.totalWidth = parseInt($('#ticker-container').width(),10);

		// *** seconds
		this.totalDuration = $('#project-duration').val();

		this.trackAnimations = [];

		// creates all the animations
		m.addAllTrackAnimations();
	}

	Movie.prototype.addAllTrackAnimations = function() {
		for(track in tracks){
			var ani = new TrackAnimation(track);
			this.trackAnimations.push(ani);
		}
	}

	return Movie;
})();

// A single track's animation object
var TrackAnimation = (function(trackID){

	function TrackAnimation(trackID){
		// keyframes for this track
		this.keyFrames = (tracks[trackID || currentTrack].keyframes).sort(function(a, b){
			return (parseInt(a.pos) - parseInt(b.pos));
		});

		this.trackID = trackID;

		// Movie Length
		// *** pixels
		this.totalWidth = parseInt($('#ticker-container').width(),10);
		// *** seconds
		this.totalDuration = $('#project-duration').val();

		// Track Length
		// *** pixels
		this.trackWidth = parseInt($('.track[data-trackid="'+this.trackID+'"]').find('.bar').width(), 10);
		// *** seconds
		this.trackDuration = (this.trackWidth / this.totalWidth) * this.totalDuration;
		
		// Track Start time
		// *** pixels
		this.trackOffset = parseInt($('.track[data-trackid="'+this.trackID+'"]').find('.bar').position().left, 10);
		// *** seconds
		this.trackStart = (this.trackOffset / this.totalWidth) * this.totalDuration;

		// SVG <g> element corresponding to track
		// *** DOM Node
		this.el = tracks[this.trackID].el;

		// *** DOM Node Half width
		this.elX = this.el.getBBox().width/2;
		// *** DOM Node Half height
		this.elY = this.el.getBBox().height/2;

		// Storing last attributes
		this.fieldsPrev = {
			fill: {
				previousValue: null,
				previousPos: -1
			},
			stroke: {
				previousValue: null,
				previousPos: -1
			},
			width: {
				previousValue: null,
				previousPos: -1
			},
			height: {
				previousValue: null,
				previousPos: -1
			},
			opacity: {
				previousValue: null,
				previousPos: -1
			},
			scale: {
				previousValue: null,
				previousPos: -1
			},
			x: {
				previousValue: null,
				previousPos: -1
			},
			y: {
				previousValue: null,
				previousPos: -1
			},
			rotate: {
				previousValue: null,
				previousPos: -1
			},
			easing: {
				previousValue: null,
				previousPos: -1
			}
		}

		this.animation = this.redraw()
	}

	TrackAnimation.prototype.redraw = function() {
		this.animation = recalculateAnimations(this.keyFrames, this.fieldsPrev)
	};

	return TrackAnimation;
})();

// Removes all animations from the DOM
function removeAllAnimationsFromSVG(){
	$(el).find('animate, animateTransform, animateColor').remove();
}

// TODO
function recalculateAnimations(keyFrames, fields) {
	// for each Keyframe
	for(var i = 0; i < keyFrames.length; i++){ // this needs to be rewritten
		var currentFrame = keyFrames[i].attr;
		if(currentFrame != undefined){
			// for each field in a Keyframe
			for(field in fields){
				var currentField = fields[field]
				if(currentFrame.hasOwnProperty(currentField)){
					if(currentField.previousPos != -1){
						// there is an animation to consider

						// Create animation.
						switch(field) { // something broken
							case "width":
								var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
								anim.setAttribute('attributeName', 'transform');
								anim.setAttribute('begin', (currentField.previousPos).toFixed(2)+'s');
								anim.setAttribute('dur', (pTs(kf['pos'])-currentField.previousPos).toFixed(2)+"s");
								anim.setAttribute('type', 'skewX');
								anim.setAttribute('from', currentField.previousValue+' '+elX+' '+elY);
								anim.setAttribute('to', currentFrame["rotate"]+' '+elX+' '+elY);
								anim.setAttribute('onend', 'animationReset("' + el.getAttribute('id') + '", "' + anim.getAttribute('type') +  '", "'+ anim.getAttribute('to')+'")');
								anim.setAttribute('fill', 'freeze');
								el.appendChild(anim);
								break;
							case "rotate":
								var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
								anim.setAttribute('attributeName', 'transform');
								anim.setAttribute('begin', (currentField.previousPos).toFixed(2)+'s');
								anim.setAttribute('dur', (pTs(kf['pos'])-currentField.previousPos).toFixed(2)+"s");
								anim.setAttribute('type', 'rotate');
								anim.setAttribute('from', currentField.previousValue+' '+elX+' '+elY);
								anim.setAttribute('to', currentFrame["rotate"]+' '+elX+' '+elY);
								anim.setAttribute('onend', 'animationReset("' + el.getAttribute('id') + '", "' + anim.getAttribute('type') +  '", "'+ anim.getAttribute('to')+'")');
								anim.setAttribute('fill', 'freeze');
								if(currentFrame['easing'] == "ease")
									anim.setAttribute('calcMode', 'spline');
									anim.setAttribute('keySplines', '1 0 0 1');
									anim.setAttribute('values', currentField.previousValue+' '+elX+' '+elY+';'+currentFrame["rotate"]+' '+elX+' '+elY);
								el.appendChild(anim);
								break;
							case "x":
								var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
								anim.setAttribute('begin', (currentField.previousPos).toFixed(2)+'s');
								anim.setAttribute('dur', (pTs(kf['pos'])-currentField.previousPos).toFixed(2)+"s");
								anim.setAttribute('from', fields["x"].previousValue +","+fields["y"].previousValue);
								anim.setAttribute('to', currentFrame["x"] +","+currentFrame["y"]);
								anim.setAttribute('fill', 'freeze');
								el.appendChild(anim);
								break;
							case "opacity":
								var anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
								anim.setAttribute('attributeName', 'opacity');
								anim.setAttribute('attributeType', 'css');
								anim.setAttribute('begin', (currentField.previousPos).toFixed(2)+'s');
								anim.setAttribute('dur', (pTs(kf['pos'])-currentField.previousPos).toFixed(2)+"s");
								anim.setAttribute('from', currentField.previousValue);
								anim.setAttribute('to', currentFrame["opacity"]);
								anim.setAttribute('fill', 'freeze');
								el.appendChild(anim);
								break;
							case "scale":
								var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
								anim.setAttribute('attributeName', 'transform');
								anim.setAttribute('begin', (currentField.previousPos).toFixed(2)+'s');
								anim.setAttribute('dur', (pTs(kf['pos'])-currentField.previousPos).toFixed(2)+"s");
								anim.setAttribute('additive', 'sum');
								anim.setAttribute('type', 'scale');
								anim.setAttribute('from', (currentField.previousValue/100).toFixed(2));
								anim.setAttribute('to', (currentFrame["scale"]/100).toFixed(2));
								anim.setAttribute('fill', 'freeze');
								el.appendChild(anim);
								break;
						}
					}
					currentField.previousValue = currentFrame[currentField[0]];
					currentField.previousPos = pTs(kf['pos']);
				}
			}
		}
	}
}