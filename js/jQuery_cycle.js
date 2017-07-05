(function(jQuery){if(jQuery.browser) return;     jQuery.browser = {};   jQuery.browser.mozilla = false;   jQuery.browser.webkit = false;   jQuery.browser.opera = false;   jQuery.browser.msie = false;     var nAgt = navigator.userAgent;   jQuery.browser.name = navigator.appName;   jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);   jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);   var nameOffset,verOffset,ix;     
// In Opera, the true version is after "Opera" or after "Version"  
 if ((verOffset=nAgt.indexOf("Opera"))!=-1) {   jQuery.browser.opera = true;   jQuery.browser.name = "Opera";   jQuery.browser.fullVersion = nAgt.substring(verOffset+6); 
   if ((verOffset=nAgt.indexOf("Version"))!=-1)   jQuery.browser.fullVersion = nAgt.substring(verOffset+8);   }   // In MSIE, the true version is after "MSIE"  in userAgent  
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {   jQuery.browser.msie = true;   jQuery.browser.name = "Microsoft Internet Explorer";   jQuery.browser.fullVersion = nAgt.substring(verOffset+5);   }   // In Chrome, the true version is after "Chrome"   
 else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {   jQuery.browser.webkit = true;   jQuery.browser.name = "Chrome";   jQuery.browser.fullVersion = nAgt.substring(verOffset+7);   }   // In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {   jQuery.browser.webkit = true;   jQuery.browser.name = "Safari";   jQuery.browser.fullVersion = nAgt.substring(verOffset+7);   if ((verOffset=nAgt.indexOf("Version"))!=-1)   jQuery.browser.fullVersion = nAgt.substring(verOffset+8);   } 
// In Firefox, the true version is after "Firefox"  
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {   jQuery.browser.mozilla = true;   jQuery.browser.name = "Firefox";   jQuery.browser.fullVersion = nAgt.substring(verOffset+8);   }  
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <   (verOffset=nAgt.lastIndexOf('/')) )   {   jQuery.browser.name = nAgt.substring(nameOffset,verOffset);   jQuery.browser.fullVersion = nAgt.substring(verOffset+1);   if (jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()) {   jQuery.browser.name = navigator.appName;   }   }// trim the fullVersion string at semicolon/space  if present 
if ((ix=jQuery.browser.fullVersion.indexOf(";"))!=-1)   jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);   if ((ix=jQuery.browser.fullVersion.indexOf(" "))!=-1)   jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);     jQuery.browser.majorVersion = parseInt(''+jQuery.browser.fullVersion,10);if (isNaN(jQuery.browser.majorVersion)) {   jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);   jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);   }   jQuery.browser.version = jQuery.browser.majorVersion;   })(jQuery);   


// jQuery Cycle Plugin for light-weight slideshows
;(function($) {
	var ver = '2.22';
	var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent);
	function log() {
		if (window.console && window.console.log)
			window.console.log('[cycle] ' + Array.prototype.join.call(arguments,''));
	};
	$.fn.cycle = function(options) {
		return this.each(function() {
			options = options || {};
			if (options.constructor == String) {
				switch(options) {
				case 'stop':if (this.cycleTimeout) clearTimeout(this.cycleTimeout);this.cycleTimeout = 0;return;
				case 'pause':this.cyclePause = 1;return;
				case 'resume':this.cyclePause = 0;return;
				default:options = { fx: options };
				};
			}
			if (this.cycleTimeout) clearTimeout(this.cycleTimeout);
			this.cycleTimeout = 0;
			this.cyclePause = 0;
			var $cont = $(this);
			var $slides = options.slideExpr ? $(options.slideExpr, this) : $cont.children();
			var els = $slides.get();
			if (els.length < 2) {log('terminating; too few slides: ' + els.length);return}
			var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
			if (opts.autostop)
				opts.countdown = opts.autostopCount || els.length;
			opts.before = opts.before ? [opts.before] : [];
			opts.after = opts.after ? [opts.after] : [];
			opts.after.unshift(function(){ opts.busy=0; });
			if (opts.continuous)
				opts.after.push(function() { go(els,opts,0,!opts.rev); });
			if (ie6 && opts.cleartype && !opts.cleartypeNoBg)
				clearTypeFix($slides);
			var cls = this.className;
			opts.width = parseInt((cls.match(/w:(\d+)/)||[])[1]) || opts.width;
			opts.height = parseInt((cls.match(/h:(\d+)/)||[])[1]) || opts.height;
			opts.timeout = parseInt((cls.match(/t:(\d+)/)||[])[1]) || opts.timeout;
			if ($cont.css('position') == 'static')
				$cont.css('position', 'relative');
			if (opts.width)
				$cont.width(opts.width);
			if (opts.height && opts.height != 'auto')
				$cont.height(opts.height);
			if (opts.random) {
				opts.randomMap = [];
				for (var i = 0; i < els.length; i++)
				opts.randomMap.push(i);
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
				opts.randomIndex = 0;
				opts.startingSlide = opts.randomMap[0];
			}
			else if (opts.startingSlide >= els.length)
				opts.startingSlide = 0;
			var first = opts.startingSlide || 0;
			$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
				var z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
				$(this).css('z-index', z)
			});
			$(els[first]).css('opacity',1).show(); 
			if ($.browser.msie) els[first].style.removeAttribute('filter');
			if (opts.fit && opts.width)
				$slides.width(opts.width);
			if (opts.fit && opts.height && opts.height != 'auto')
				$slides.height(opts.height);
			if (opts.pause)
				$cont.hover(function(){this.cyclePause=1;}, function(){this.cyclePause=0;});
			var init = $.fn.cycle.transitions[opts.fx];
			if ($.isFunction(init))
				init($cont, $slides, opts);
			else if (opts.fx != 'custom')
				log('unknown transition: ' + opts.fx);
			$slides.each(function() {
				var $el = $(this);
				this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
				this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();
			});
			opts.cssBefore = opts.cssBefore || {};
			opts.animIn = opts.animIn || {};
			opts.animOut = opts.animOut || {};
			$slides.not(':eq('+first+')').css(opts.cssBefore);
			if (opts.cssFirst)
				$($slides[first]).css(opts.cssFirst);
			if (opts.timeout) {
				if (opts.speed.constructor == String)
					opts.speed = {slow: 600, fast: 200}[opts.speed] || 400;
				if (!opts.sync)
					opts.speed = opts.speed / 2;
				while((opts.timeout - opts.speed) < 250)
					opts.timeout += opts.speed;
			}
			if (opts.easing)
				opts.easeIn = opts.easeOut = opts.easing;
			if (!opts.speedIn)
				opts.speedIn = opts.speed;
			if (!opts.speedOut)
				opts.speedOut = opts.speed;
			opts.slideCount = els.length;
			opts.currSlide = first;
			if (opts.random) {
				opts.nextSlide = opts.currSlide;
				if (++opts.randomIndex == els.length)
					opts.randomIndex = 0;
				opts.nextSlide = opts.randomMap[opts.randomIndex];
			}
			else
				opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;
			var e0 = $slides[first];
			if (opts.before.length)
				opts.before[0].apply(e0, [e0, e0, opts, true]);
			if (opts.after.length > 1)
				opts.after[1].apply(e0, [e0, e0, opts, true]);
			if (opts.click && !opts.next)
				opts.next = opts.click;
			if (opts.next)
				$(opts.next).bind('click', function(){return advance(els,opts,opts.rev?-1:1)});
			if (opts.prev)
				$(opts.prev).bind('click', function(){return advance(els,opts,opts.rev?1:-1)});
			if (opts.pager)
				buildPager(els,opts);
			opts.addSlide = function(newSlide) {
				var $s = $(newSlide), s = $s[0];
				if (!opts.autostopCount)
					opts.countdown++;
				els.push(s);
				if (opts.els)
					opts.els.push(s);
				opts.slideCount = els.length;
				$s.css('position','absolute').appendTo($cont);
				if (ie6 && opts.cleartype && !opts.cleartypeNoBg)
					clearTypeFix($s);
				if (opts.fit && opts.width)
					$s.width(opts.width);
				if (opts.fit && opts.height && opts.height != 'auto')
					$slides.height(opts.height);
				s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
				s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
				$s.css(opts.cssBefore);
				if (typeof opts.onAddSlide == 'function')
					opts.onAddSlide($s);
			};
			if (opts.timeout || opts.continuous)
				this.cycleTimeout = setTimeout(
					function(){go(els,opts,0,!opts.rev)},
					opts.continuous ? 10 : opts.timeout + (opts.delay||0));
		});
	};
	function go(els, opts, manual, fwd) {
		if (opts.busy) return;
		var p = els[0].parentNode, curr = els[opts.currSlide], next = els[opts.nextSlide];
		if (p.cycleTimeout === 0 && !manual)
			return;
		if (!manual && !p.cyclePause &&
			((opts.autostop && (--opts.countdown <= 0)) ||
			(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
			if (opts.end)opts.end(opts);return;
		}
		if (manual || !p.cyclePause) {
			if (opts.before.length)
				$.each(opts.before, function(i,o) { o.apply(next, [curr, next, opts, fwd]); });
			var after = function() {
				if ($.browser.msie && opts.cleartype)
					this.style.removeAttribute('filter');
				$.each(opts.after, function(i,o) { o.apply(next, [curr, next, opts, fwd]); });
			};
			if (opts.nextSlide != opts.currSlide) {
				opts.busy = 1;
				if (opts.fxFn)
					opts.fxFn(curr, next, opts, after, fwd);
				else if ($.isFunction($.fn.cycle[opts.fx]))
					$.fn.cycle[opts.fx](curr, next, opts, after);
				else
					$.fn.cycle.custom(curr, next, opts, after);
			}
			if (opts.random) {
				opts.currSlide = opts.nextSlide;
				if (++opts.randomIndex == els.length)
					opts.randomIndex = 0;
				opts.nextSlide = opts.randomMap[opts.randomIndex];
			}
			else { // sequence
				var roll = (opts.nextSlide + 1) == els.length;
				opts.nextSlide = roll ? 0 : opts.nextSlide+1;
				opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
			}
			if (opts.pager)
				$.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
		}
		if (opts.timeout && !opts.continuous)
			p.cycleTimeout = setTimeout(function() { go(els,opts,0,!opts.rev) }, opts.timeout);
		else if (opts.continuous && p.cyclePause)
			p.cycleTimeout = setTimeout(function() { go(els,opts,0,!opts.rev) }, 10);
	};
	
	$.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
		$(pager).find('a').removeClass('activeSlide').filter('a:eq('+currSlide+')').addClass('activeSlide');
	};
	
	
	// advance slide forward or back
	function advance(els, opts, val) {
		var p = els[0].parentNode, timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
		if (opts.prevNextClick && typeof opts.prevNextClick == 'function')
			opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
		go(els, opts, 1, val>=0);
		return false;
	};
	
	function buildPager(els, opts) {
		var $p = $(opts.pager);
		$.each(els, function(i,o) {
			
			if(opts.showSlideNum==true){
				var $a = (typeof opts.pagerAnchorBuilder == 'function')
				? $(opts.pagerAnchorBuilder(i,o))
				: $('<a href="javascript:;">'+(i+1)+'</a>');
			}
			else{
				var $a = (typeof opts.pagerAnchorBuilder == 'function')
				? $(opts.pagerAnchorBuilder(i,o))
				: $('<a href="javascript:;"></a>');
			};
			if ($a.parents('body').length == 0)
				$a.appendTo($p);
			$a.bind(opts.pagerEvent, function() {
				opts.nextSlide = i;
				var p = els[0].parentNode, timeout = p.cycleTimeout;
				if (timeout) {
					clearTimeout(timeout);
					p.cycleTimeout = 0;
				}
				if (typeof opts.pagerClick == 'function')
					opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
				go(els,opts,1,!opts.rev);
				return false;
			});
		});
	   $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
	};
	
	function clearTypeFix($slides) {
		function hex(s) {
			var s = parseInt(s).toString(16);
			return s.length < 2 ? '0'+s : s;
		};
		function getBg(e) {
			for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
				var v = $.css(e,'background-color');
				if (v.indexOf('rgb') >= 0 ) {
					var rgb = v.match(/\d+/g);
					return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
				}
				if (v && v != 'transparent')
					return v;
			}
			return '#ffffff';
		};
		$slides.each(function() { $(this).css('background-color', getBg(this)); });
	};
	
	
	$.fn.cycle.custom = function(curr, next, opts, cb) {
		var $l = $(curr), $n = $(next);
		$n.css(opts.cssBefore);
		var fn = function() {$n.animate(opts.animIn, opts.speedIn, opts.easeIn, cb)};
		$l.animate(opts.animOut, opts.speedOut, opts.easeOut, function() {
			if (opts.cssAfter) $l.css(opts.cssAfter);
			if (!opts.sync) fn();
		});
		if (opts.sync) fn();
	};
	
	$.fn.cycle.transitions = {
		fade: function($cont, $slides, opts) {
			$slides.not(':eq('+opts.startingSlide+')').css('opacity',0);
			opts.before.push(function() { $(this).show() });
			opts.animIn    = { opacity: 1 };
			opts.animOut   = { opacity: 0 };
			opts.cssBefore = { opacity: 0 };
			opts.cssAfter  = { display: 'none' };
		}
	};
	
	$.fn.cycle.ver = function() { return ver; };
	// override these globally if you like (they are all optional)
	$.fn.cycle.defaults = {
		fx:           'scollLeft', // fade, scrollLeft, scrollRight,scrollDown
		timeout:       4000,  // milliseconds between slide transitions (0 to disable auto advance)
		speed:         800,  // speed of the transition (any valid fx speed value)
		pause:         1,     // true to enable "pause on hover"
		next:          null,  // id of element to use as click trigger for next slide
		prev:          null,  // id of element to use as click trigger for previous slide
		pager:         null,  // id of element to use as pager container
		pagerEvent:   'click', // event which drives the pager navigation
		before:        null,  // transition callback (scope set to element to be shown)
		after:         null,  // transition callback (scope set to element that was shown)
		easing:        null,  // easing method for both in and out transitions
		height:       'auto', // container height
		showSlideNum:  false,  // show showSlidNum
		startingSlide: 0,     // zero-based index of the first slide to be displayed
		sync:          1,     // true if in/out transitions should occur simultaneously
	};
	
	// scrollLeft/Right/down
	$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push(function(curr, next, opts) {
			$(this).show();
			opts.cssBefore.left = next.offsetWidth;
			opts.animOut.left = 0-curr.offsetWidth;
		});
		opts.cssFirst = { left: 0 };
		opts.animIn   = { left: 0 };
	};
	$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push(function(curr, next, opts) {
			$(this).show();
			opts.cssBefore.left = 0-next.offsetWidth;
			opts.animOut.left = curr.offsetWidth;
		});
		opts.cssFirst = { left: 0 };
		opts.animIn   = { left: 0 };
	};
	
	$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push(function(curr, next, opts) {
			$(this).show();
			opts.cssBefore.top = 0-next.offsetHeight;
			opts.animOut.top = curr.offsetHeight;
		});
		opts.cssFirst = { top: 0 };
		opts.animIn   = { top: 0 };
	};
})(jQuery);

