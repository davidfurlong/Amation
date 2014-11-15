$.fn.draggable = function(){
    var $this = this,
    ns = 'draggable_'+(Math.random()+'').replace('.',''),
    mm = 'mousemove.'+ns,
    mu = 'mouseup.'+ns,
    $w = $(window),
    isFixed = ($this.css('position') === 'fixed'),
    adjX = 0, adjY = 0;

    $this.mousedown(function(ev){
    	if(!$(ev.target).is('.width-handle')){
	        var pos = $this.offset();
	        if (isFixed) {
	            adjX = $w.scrollLeft(); adjY = $w.scrollTop();
	        }
	        var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
	        $this.data(ns,{ x : ox, y: oy });
	        $w.on(mm, function(ev){
	            ev.preventDefault();
	            ev.stopPropagation();
	            if (isFixed) {
	                adjX = $w.scrollLeft(); adjY = $w.scrollTop();
	            }
	            var offset = $this.data(ns);
	            // $this.css({left: ev.pageX - adjX - offset.x, top: ev.pageY - adjY - offset.y});
	            $this.css({left: ev.pageX - adjX - offset.x - $('.timeline').css('padding-left').replace('px','')});
	        });
	        $w.on(mu, function(){
	        	if($this.hasClass('track')){
	        		// track dragged, call handler
	        		// todo david
	        		// recalculateAnimations(currentTrack);
	        		// console.log(window.y = $this);
	        		// updateTrackOffset($(this).data('trackid'), this);
	        	}
	            $w.off(mm + ' ' + mu).removeData(ns);
	        });
	    }
    });

    return this;
};

$.fn.dragWidth = function(){
	var $this = this;
    ns = 'draggableWidth_'+(Math.random()+'').replace('.',''),
    mm = "mousemove."+ns,
    mu = "mouseup."+ns;
 	$this.mousedown(function(ev){
 		var pos = $this.offset();
 		var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
 		$this.data(ns,{ x: ox, y: oy});
 		$this.data('origWidth',$this.parent().width());
 		$(window).on(mm, function(ev){
 			ev.preventDefault();
 			ev.stopPropagation();
 			var offset = $this.data(ns);
 			var relPos = $this.parent().parent().css('left').replace('px','')!=='auto' ? $this.parent().parent().css('left').replace('px','') : 0;
 			$this.parent().width( ev.pageX - offset.x - $('.timeline').css('padding-left').replace('px','') - relPos);
 		});

        $(window).on(mu, function(){
            $(window).off(mm + ' ' + mu).removeData(ns);
        });
 	});
	return this;
};

// Default Values
var animationDuration = 40; // seconds
var animationWidth = 500; // px
var animationHeight = 400; // px

// Selection (View) States
var currentKeyFrame = null; // is a pos (example 23)
var currentTrack = null; // is trackID (example 434523453425)

// Canvas (View) States
var draggingKeyFrame = false;
var draggingTrack = false;

// Model States
var tracks = {};
var scale = 1; // unitless, scale of canvas


$(function(){

	// File Upload boxes definitions
	var holder = document.getElementById('holder'),
	    tests = {
	      filereader: typeof FileReader != 'undefined',
	      dnd: 'draggable' in document.createElement('span'),
	      formdata: !!window.FormData,
	      progress: "upload" in new XMLHttpRequest
	    }, 
	    acceptedTypes = {
	      'image/svg+xml': true,
	      'image/svg': true
	    },
	    progress = document.getElementById('uploadprogress'),
	    fileupload = document.getElementById('upload');

	if (tests.dnd) { 
	  holder.ondragover = function () { this.className = 'hover'; return false; };
	  holder.ondragend = function () { this.className = ''; return false; };
	  // holder.ondragleave = function () { this.className = ''; return false; };
	  holder.ondrop = function (e) {
	    this.className = '';
	    e.preventDefault();
	    readfiles(e.dataTransfer.files);
	  }
	} else {
	  fileupload.className = 'hidden';
	  fileupload.querySelector('input').onchange = function () {
	    readfiles(this.files);
	  };
	}

	// parses SVG
	function processSvg(s,fileName) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(s, "image/svg+xml");
		var svgParsed = $($(doc).find('svg')[0]).children();
		var newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
		var trackID = (new Date).getTime();
		newG.id = trackID;
		newG.className = "vector-group";
		var obj = {
			"el": newG,
			"keyframes": [],
			"trackName": fileName.replace('.svg','')
		}
		tracks[trackID] = obj;
		for(var i = 0; i < svgParsed.length; i ++){
			newG.appendChild(svgParsed[i])
		}
		$('#canvas').append(newG);

		createTrack(trackID,fileName);
		createKeyFrame(trackID, 0, null);
		editKeyFrame(trackID, 0);
	}

	function previewfile(file) {
	  if (tests.filereader === true && acceptedTypes[file.type] === true) {
	    var reader = new FileReader();
	    reader.onload = function (event) {
	      var base64Svg = event.target.result;
	      base64Svg = base64Svg.replace('data:image/svg+xml;base64,', '');
	      processSvg(decode_base64(base64Svg),file.name);
	    };

	    reader.readAsDataURL(file);
	  }  else {
	    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
	    console.log(file);
	  }
	}

	function readfiles(files) {
	    var formData = tests.formdata ? new FormData() : null;
	    for (var i = 0; i < files.length; i++) {
	      if (tests.formdata) formData.append('file', files[i]);
	      previewfile(files[i]);
	    }
	}

	function decode_base64(s) {
	    var e={},i,k,v=[],r='',w=String.fromCharCode;
	    var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

	    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
	    for(i=0;i<64;i++){e[v[i]]=i;}

	    for(i=0;i<s.length;i+=72){
	    var b=0,c,x,l=0,o=s.substring(i,i+72);
	         for(x=0;x<o.length;x++){
	                c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
	                while(l>=8){r+=w((b>>>(l-=8))%256);}
	         }
	    }
	    return r;
	}

	function allowDrag(){
		$('.keyframe').each(function(i,v){
			if(!$(v).hasClass('draggable')){
				$(v).addClass('draggable');//.draggable();
			}
		});
		return true;
	}

	function buildDropdowns(){
		$('.dropdown-menu').each(function(i,v){
			if($(v).find('.selected').length>0){
				$('#'+$(v).data('target')).val($(v).find('.selected').html()).attr('readonly','readonly').data('value',$(v).find('.selected').data('value'));
			}
		});
	}

	$('input[type="text"]').focus(function(e){
		$(e.target).parent().addClass('focus');
	});

	$('input[type="text"]').blur(function(e){
		$(e.target).parent().removeClass('focus');
	});

	$('#slider-container,#ticker-container').width($('body').width()-$('.layer-details').width());
	
	$(window).resize(function(){
		$('#slider-container,#ticker-container').width($('body').width()-$('.layer-details').width());
	});

	$('.layer-details input').keypress(function(e){
		if(e.which == 13){
			editKeyFrame(currentTrack, currentKeyFrame);
			$(e.target).blur();
		}
	});

	$('#save-btn').click(function(e){
		downloadSVG();
	});

	$('.play-btn').click(function(e){
		if($(e.target).hasClass('playing')){
			document.getElementById("canvas").pauseAnimations();
		}
		else{
			document.getElementById("canvas").unpauseAnimations();
			updateSlider();
		}
	});
	$('.stop-btn').click(function(e){
		document.getElementById("canvas").setCurrentTime(0);
		slider.val(0);
		document.getElementById("canvas").pauseAnimations();
	});

	$('.rewind-btn').click(function(e){
		document.getElementById("canvas").setCurrentTime(0);
		slider.val(0);
	});

	$('body').on('click', '.bar', function(e){
		console.log(e);
		console.log(e.isDefaultPrevented());
		console.log(draggingKeyFrame);
		if($(e.currentTarget).hasClass('.keyframe'))
			return;
		if(!e.isDefaultPrevented()){
			var relPosX = $(e.target).position().left;
			var posX = e.pageX - relPosX;
			currentKeyFrame = parseInt(posX-$(this).closest('.track').position().left);
			currentTrack = $(this).closest('.clearfix').data('trackid');
			createKeyFrame(currentTrack, currentKeyFrame, this);
		}
		allowDrag();
	});

	$('body').on('click', '.keyframe', function(e){
		e.preventDefault();
		if(!draggingKeyFrame) {		
			$('.keyframe').removeClass('selected');
			$(this).addClass('selected');
			currentKeyFrame = $(this).data('pos');
			currentTrack = $(this).closest('.clearfix').data('trackid');
			console.log(currentTrack);
			populateDetails(currentTrack, currentKeyFrame);
			$('.layer-title-container').html('<span style="background-color:' + $(e.target).parent().data('color') + ';"></span><span class="layer-title">' + $(e.target).parent().parent().find('.layer-name').html() + '</span>');
			$('.layer-details-inner').removeClass('hidden');
			alignStick(currentKeyFrame);
		}
	});

	// select all text on input field focus
	$("input[type='text']").click(function () {
	   $(this).select();
	});

	$('body').on('click', '.remove-layer-btn', function(e){
		if($('.layer-title').html()!='(empty)'){
			$.each(tracks,function(i,v){
				console.log(v.trackName,$('.layer-title').html());
				if(v.trackName == $('.layer-title').html()){
					delete tracks[i];
					document.getElementById(i).remove();
				}
			});
			$('.track').each(function(i,v){
				console.log($(v).find('.layer-name').html(),$('.layer-title').html());
				if($(v).find('.layer-name').html() == $('.layer-title').html()){
					$(v).remove();
				}
			});
			$('.layer-title-container').html('<span class="layer-title">(empty)</span>');
		}
	});
	$('body').on('click', '.dropdown', function(e){
		$('div[data-target="'+$(e.target).attr('id')+'"]').toggle();
	});
	$('body').on('click', '.dropdown-item', function(e){
		$(e.target).parent().children().removeClass('selected');
		$(e.target).addClass('selected');
		$('#'+$(e.target).parent().parent().data('target')).val($(e.target).html()).data('value',$(e.target).data('value')).addClass('modified').parent().addClass('modified-parent');
		$(e.target).parent().parent().hide();

		if($(e.target).parent().parent().data('target')=='project-frame'){
			updateCanvasDimensionsFromDropdown();
		}
	});

	$('body').on('click', '#loop-btn', function(e){
		$('#loop-btn').toggleClass('active');
	});

	$('#fit-btn').click(function(e){
		$('#fit-btn').toggleClass('active');
		if($('#fit-btn').hasClass('active'))
			fitCanvas();
	});

	$('body').on('click', '.zoom-in', function(e){
		$('#canvas-center').css('transform','scale(' + ( scale + (scale*.1) ) + ')');
		scale += scale*.1;
		$('#fit-btn').removeClass('active');
	});

	$('body').on('click', '.zoom-out', function(e){
		$('#canvas-center').css('transform','scale(' + ( scale + (scale*.1) ) + ')');
		scale += scale*.1;
		$('#fit-btn').removeClass('active');
	});

	$(document).keydown(function(e){
		if(!$(e.target).is('input:focus') && e.which == 32){
			e.preventDefault();
			if($('.play-btn').hasClass('playing')){
				document.getElementById("canvas").pauseAnimations();
			}
			else{
				document.getElementById("canvas").unpauseAnimations();
				updateSlider();
			}
			return false;
		}
		else if(e.which == 8 && !$(e.target).is('input:focus')){
			e.preventDefault();
			// delete key
			$('.selected.keyframe').remove();
			// todo david
			// remove a keyframe
			var el = findKeyFrameByPos(tracks[currentTrack].keyframes, currentKeyFrame)
			$(el['el']).remove();
			removeKeyFrameByPos(tracks[currentTrack].keyframes, currentKeyFrame);
			recalculateAnimations(currentTrack);
			return false;
		}
	});

	function updateCanvasDimensionsFromDropdown(){
		var dims = $('#project-frame').data('value').split(',');
		if(dims[0]>0 && dims[1]>0){
			$('#project-w').val(dims[0]);
			$('#project-h').val(dims[1]);
			$('#canvas,#canvas-center').width(dims[0]);
			$('#canvas').height(dims[1]);
		}
		if($('#fit-btn').hasClass('active'))
			fitCanvas();
	}

	function updateCanvasDimensions(){
		var dims = [$('#project-w').val(), $('#project-h').val()];
		if(dims[0]>0 && dims[1]>0){
			$('#project-frame').data('value',dims[0]+','+dims[1]).val('custom');
			$('#canvas,#canvas-center').width(dims[0]);
			$('#canvas').height(dims[1]);
		}
		if($('#fit-btn').hasClass('active'))
			fitCanvas();
	}

	$('#project-h,#project-w').on("keyup",function(e){
		updateCanvasDimensions();
	});

	$('body').on('drag', '.keyframe', function(e){
		draggingKeyFrame = true;
	});

	$('body').on('mouseup', '.keyframe', function(e){
		e.preventDefault();
		draggingKeyFrame = false;
	});

	// keyframe property watching
	$('body').on('change', '.layer-details input', function(e){
		$(e.target).addClass('modified').parent().addClass('modified-parent');
	});

	$('#project-width').blur(function(){
		var w = $(this).val()
		if(w == parseInt(w))
			$('#canvas').width(w);
		else 
			$(this).parent().addClass('error');
	});

	$('#project-height').blur(function(){
		var h = $(this).val()
		if(h == parseInt(h))
			$('#canvas').height(h);
		else 
			$(this).parent().addClass('error');
	});

	$('#project-duration').blur(function(){
		var h = $(this).val()
		if(h == parseInt(h))
			var x = null;
		else 
			$(this).parent().addClass('error');
	});

	$('#project-height, #project-width, #project-duration').keyup(function(e){
		var v = $(this).val()
		if(v == parseInt(v) || v == "")
			$(this).parent().removeClass('error');
		else 
			$(this).parent().addClass('error');
		if(e.which == 13)
			$(this).blur();
	});

	$('#project-title-input').click(function(){
		$(this).select();
	})

	$('#project-title-input').blur(function(){
		if($(this).val() == "")
			$(this).val("Project 1");
		document.title = $(this).val() + " - Amation";
	})

	setupScrub();
	allowDrag();
	buildDropdowns();

	document.getElementById("canvas").setCurrentTime(0);
	slider.val(0);
	document.getElementById("canvas").pauseAnimations();
});
