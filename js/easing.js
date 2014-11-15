// easing functions.

var frameRate = 0.05 // in seconds.

function constructKeyStripes(dur, func) {
	var numOfPoints = frameRate * dur + 1;
	var keySplines = "";
	for(var p = 0; p < numOfPoints; p ++){
		animation[func]
	}
}

var animation = function(dur) {
	/*\
	 * animation.linear
	 [ method ]
	 **
	 * Default linear easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.linear = function (n) {
	    return n;
	};
	/*\
	 * animation.easeout
	 [ method ]
	 **
	 * Easeout easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.easeout = function (n) {
	    return Math.pow(n, 1.7);
	};
	/*\
	 * animation.easein
	 [ method ]
	 **
	 * Easein easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.easein = function (n) {
	    return Math.pow(n, .48);
	};
	/*\
	 * animation.easeinout
	 [ method ]
	 **
	 * Easeinout easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.easeinout = function (n) {
	    if (n == 1) {
	        return 1;
	    }
	    if (n == 0) {
	        return 0;
	    }
	    var q = .48 - n / 1.04,
	        Q = Math.sqrt(.1734 + q * q),
	        x = Q - q,
	        X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
	        y = -Q - q,
	        Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
	        t = X + Y + .5;
	    return (1 - t) * 3 * t * t + t * t * t;
	};
	/*\
	 * animation.backin
	 [ method ]
	 **
	 * Backin easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.backin = function (n) {
	    if (n == 1) {
	        return 1;
	    }
	    var s = 1.70158;
	    return n * n * ((s + 1) * n - s);
	};
	/*\
	 * animation.backout
	 [ method ]
	 **
	 * Backout easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.backout = function (n) {
	    if (n == 0) {
	        return 0;
	    }
	    n = n - 1;
	    var s = 1.70158;
	    return n * n * ((s + 1) * n + s) + 1;
	};
	/*\
	 * animation.elastic
	 [ method ]
	 **
	 * Elastic easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.elastic = function (n) {
	    if (n == !!n) {
	        return n;
	    }
	    return Math.pow(2, -10 * n) * Math.sin((n - .075) *
	        (2 * Math.PI) / .3) + 1;
	};
	/*\
	 * animation.bounce
	 [ method ]
	 **
	 * Bounce easing
	 - n (number) input 0..1
	 = (number) output 0..1
	\*/
	animation.bounce = function (n) {
	    var s = 7.5625,
	        p = 2.75,
	        l;
	    if (n < (1 / p)) {
	        l = s * n * n;
	    } else {
	        if (n < (2 / p)) {
	            n -= (1.5 / p);
	            l = s * n * n + .75;
	        } else {
	            if (n < (2.5 / p)) {
	                n -= (2.25 / p);
	                l = s * n * n + .9375;
	            } else {
	                n -= (2.625 / p);
	                l = s * n * n + .984375;
	            }
	        }
	    }
	    return l;
	};
}