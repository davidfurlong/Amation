$.fn.draggable = function(){
    var $this = this,
    ns = 'draggable_'+(Math.random()+'').replace('.',''),
    mm = 'mousemove.'+ns,
    mu = 'mouseup.'+ns,
    $w = $(window),
    isFixed = ($this.css('position') === 'fixed'),
    adjX = 0, adjY = 0;

    $this.mousedown(function(ev){
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
        	if($this.hasClass('start')){
        		console.log($this.parent().css('margin-left').replace('px','')+ev.pageX - adjX - $this.data(ns).x - $('.timeline').css('padding-left').replace('px','')+'px');
        		$this.parent().css('background-color','green').css('margin-left',$this.parent().css('margin-left')+ev.pageX - adjX - $this.data(ns).x - $('.timeline').css('padding-left').replace('px','')+'px');
        	}
            $w.off(mm + ' ' + mu).removeData(ns);
        });
    });

    return this;
};




var animationDuration = 40; // seconds
var animationWidth = 500; // px
var animationHeight = 400; // px
var scale = 1; // unitless, scale of canvas


$(function(){

	var holder = document.getElementById('holder'),
	    tests = {
	      filereader: typeof FileReader != 'undefined',
	      dnd: 'draggable' in document.createElement('span'),
	      formdata: !!window.FormData,
	      progress: "upload" in new XMLHttpRequest
	    }, 
	    support = {
	      filereader: document.getElementById('filereader'),
	      formdata: document.getElementById('formdata'),
	      progress: document.getElementById('progress')
	    },
	    acceptedTypes = {
	      'image/svg+xml': true,
	      'image/svg': true
	    },
	    progress = document.getElementById('uploadprogress'),
	    fileupload = document.getElementById('upload');

	// "filereader formdata progress".split(' ').forEach(function (api) {
	//   if (tests[api] === false) {
	//     support[api].className = 'fail';
	//   } else {
	//     support[api].className = 'hidden';
	//   }
	// });

	function processSvg(s) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(s, "image/svg+xml");
		var svgParsed = $($(doc).find('svg')[0]).children();
		var newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
		newG.id = (new Date).getTime();
		newG.className = "unit"
		for(var i = 0; i < svgParsed.length; i ++){
			newG.appendChild(svgParsed[i])
		}
		$('#canvas').append(newG);	
		buildLayers();
	}

	function previewfile(file) {
	  if (tests.filereader === true && acceptedTypes[file.type] === true) {
	    var reader = new FileReader();
	    reader.onload = function (event) {
	      var base64Svg = event.target.result;
	      base64Svg = base64Svg.replace('data:image/svg+xml;base64,', '');
	      processSvg(decode_base64(base64Svg));
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

	if (tests.dnd) { 
	  holder.ondragover = function () { this.className = 'hover'; $('#drop-msg div').height($('body').height()-160); return false; };
	  holder.ondragend = function () { this.className = ''; return false; };
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
				$(v).addClass('draggable').draggable();
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
	$('body').click(function(e){
		if($(e.target).is('.play-btn')){
			if($(e.target).hasClass('playing')){
				document.getElementById("canvas").pauseAnimations();
			}
			else{
				document.getElementById("canvas").unpauseAnimations();
				updateSlider();
			}
		}
		else if($(e.target).is('.rewind-btn')){
			document.getElementById("canvas").setCurrentTime(0);
			slider.val(0);
		}
		else if($(e.target).is('.bar')){
			var relPosX = $(e.target).position().left;
			var posX = e.pageX - relPosX;
			$(e.target).append('<div class="keyframe" data-pos="' + posX + '" style="left:'+(posX-5)+'px;"></div>');
			allowDrag();
		}
		else if($(e.target).is('.dropdown')){
			$('div[data-target="'+$(e.target).attr('id')+'"]').toggle();
		}
		else if($(e.target).is('.dropdown-item')){
			$(e.target).parent().children().removeClass('selected');
			$(e.target).addClass('selected');
			$('#'+$(e.target).parent().parent().data('target')).val($(e.target).html()).data('value',$(e.target).data('value'));
			$(e.target).parent().parent().hide();

			if($(e.target).parent().parent().data('target')=='project-frame'){
				updateCanvasDimensionsFromDropdown();
			}
		}
		else if($(e.target).is('#loop-btn')){
			$('#loop-btn').toggleClass('active');
		}
		else if($(e.target).is('.zoom-in')){
			$('#canvas-center').css('transform','scale(' + ( scale + (scale*.1) ) + ')');
			scale += scale*.1;
		}
		else if($(e.target).is('.zoom-out')){
			$('#canvas-center').css('transform','scale(' + ( scale - (scale*.1) ) + ')');
			scale -= scale*.1;
		}
	});
	$(document).keypress(function(e){
		if(!$(e.target).is('input:focus') && e.which == 32){
			if($('.play-btn').hasClass('playing')){
				document.getElementById("canvas").pauseAnimations();
			}
			else{
				document.getElementById("canvas").unpauseAnimations();
				updateSlider();
			}
			return false;
		}
	});
	function updateCanvasDimensionsFromDropdown(){
		var dims = $('#project-frame').data('value').split(',');
		if(dims[0]>0 && dims[1]>0){
			$('#project-width').val(dims[0]);
			$('#project-height').val(dims[1]);
			$('#canvas,#canvas-center').width(dims[0]);
			$('#canvas').height(dims[1]);
		}
	}
	function updateCanvasDimensions(){
		var dims = [$('#project-width').val(), $('#project-height').val()];
		if(dims[0]>0 && dims[1]>0){
			$('#project-frame').data('value',dims[0]+','+dims[1]).val('custom');
			$('#canvas,#canvas-center').width(dims[0]);
			$('#canvas').height(dims[1]);
		}
	}
	$('#project-height,#project-width').on("keyup",function(e){
		updateCanvasDimensions();
	});

	$('#project-title-input').blur(function(){
		if($(this).val() == "")
			$(this).val("Project 1");
	})
	setupScrub();
	buildLayers(svg);
	allowDrag();
	buildDropdowns();
});
