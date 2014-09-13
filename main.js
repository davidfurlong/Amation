var animationDuration = 40; // seconds
var animationWidth = 500; // px
var animationHeight = 400; // px

$(document).ready(function(){

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

	"filereader formdata progress".split(' ').forEach(function (api) {
	  if (tests[api] === false) {
	    support[api].className = 'fail';
	  } else {
	    // FFS. I could have done el.hidden = true, but IE doesn't support
	    // hidden, so I tried to create a polyfill that would extend the
	    // Element.prototype, but then IE10 doesn't even give me access
	    // to the Element object. Brilliant.
	    support[api].className = 'hidden';
	  }
	});

	function processSvg(s) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(s, "image/svg+xml");
		var svgParsed = $($(doc).find('svg')[0]).children();
		var newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
		for(var i = 0; i < svgParsed.length; i ++){
			newG.appendChild(svgParsed[i])
		}
		$('#canvas').append(newG);	
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
	  holder.ondragover = function () { this.className = 'hover'; return false; };
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

});

