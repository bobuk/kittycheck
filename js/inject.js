/*
 * Dynamic script loading helper
 * Normalizes good browser onload() vs. IE readyState weirdness
 */


function loadScript(sURL, onLoad) {

  function loadScriptHandler() {
    var rs = this.readyState;
    if (rs == 'loaded' || rs == 'complete') {
      this.onreadystatechange = null;
      this.onload = null;
      if (onLoad) {
        onLoad();
      }
    }
  }

  function scriptOnload() {
    this.onreadystatechange = null;
    this.onload = null;
    window.setTimeout(onLoad,20);
  }

  var oS = document.createElement('script');
  oS.type = 'text/javascript';
  if (onLoad) {
    oS.onreadystatechange = loadScriptHandler;
    oS.onload = scriptOnload;
  }
  oS.src = sURL;
  document.getElementsByTagName('head')[0].appendChild(oS);

}

loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(){
    jQuery.noConflict();
    (function($){

        var rumble = function(){
            soundManager.url = '../../swf/';

            soundManager.onready(function() {
                soundManager.createSound({
                  id:'rumble',
                  url:'../../rumble.mp3'
                }).play();
            });

            soundManager.beginDelayedInit(); // ensure start-up in case document.readyState and/or DOMContentLoaded are unavailable
        }

        var IFRAME_URL = 'http://kittycheck.com/iframe';
        var CSS_URL = 'http://kittycheck.com/css/inject.css'
    //                var IFRAME_URL = 'index.html';
    //                var CSS_URL = 'css/inject.css'

        $.fn.checkin = function($wrp, color, should_rumble, callback){
            var pressTimer,
                milkTimer,
                timeout = 1400;

            $(this).mousedown(function(e){
                if (!$wrp.is(':visible')) {
                    if (should_rumble)
                    {
                        typeof soundManager === 'undefined' ? loadScript('js/libs/soundmanager2-nodebug-jsmin.js', rumble) : rumble();
                    }
                    addracker(e);
                    pressTimer = setTimeout(function() {
                        callback();
                    }, timeout);
                }
                return false;
            });

            $(document).mouseup(function() {
                clearTimeout(pressTimer);
                delracker();
                if(typeof soundManager !== 'undefined' && !$wrp.is(':visible'))
                {
                    soundManager.stopAll();
                }
            });

            function draw(size ) {
                var milk = $('#kittychek-milk');
                var a = 1.0 * milk.attr('value')

                var sa = 1.5*Math.PI, ea = sa+a, r = size/2, lw = r* 0.3;

                ctx = milk[0].getContext("2d")
                ctx.clearRect(0, 0, size, size);

                ctx.lineWidth = lw;

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.arc( r, r, r-lw, sa, ea, false);
                ctx.stroke();

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.arc( r, r, r-lw+1+lw*2/3, 0, 2*Math.PI, false);
                ctx.stroke();
            }

            function raker() {
                $('#kittychek-milk').value();
            }

            function addracker(e) {
                $('body').append(
                    "<canvas id='kittychek-milk' "+
                    " width=75 height=75 " +
                    "style='position: absolute; " +
                    "left: " + (e.clientX-35) + "px; " +
                    "top: "  + (e.clientY-35) +  "px;' value='0'/>");
                timer();
            }

            function delracker() {
                $('#kittychek-milk').remove();
                clearTimeout(milkTimer);
            }

            function YouHooo() {
                delracker();
            }

            var timer = function () {
                var milk = $('#kittychek-milk');
                var a = 1.0 * milk.attr('value');
                if (a < 6.2) {
                    a = a + 0.1;
                    milk.attr('value', '' + a);
                    draw(75);
                    milkTimer = setTimeout(timer, 20);
                } else {
                    YouHooo();
                };
            }
        };

        $.fn.draggable = function(options) {
            var defaults = {
                    handle: false,
                    start: function(){},
                    stop: function(){}
                },
                options = $.extend({}, defaults, options),
                $document = $(document),
                mouse = {
                    update: function(e) {
                        this.x = e.pageX;
                        this.y = e.pageY;
                }
            };

            return this.each(function(){
                var $elem = $(this),
                    $handle = options.handle || $elem;
                $handle.bind('mousedown.drag', function(e) {
                    mouse.update(e);
                    if (typeof options.start == 'function') {
                        options.start(e);
                    }
                    $document.bind('mousemove.drag', function(e) {
                        $elem.css({
                            left: (parseInt($elem.css('left'))||0) + (e.pageX - mouse.x) + 'px',
                            top: (parseInt($elem.css('top'))||0) +  (e.pageY - mouse.y) + 'px'
                        });
                        mouse.update(e);
                        e.preventDefault();
                    });
                    $document.one('mouseup.drag', function(e) {
                        if (typeof options.stop == 'function') {
                            options.stop(e);
                        }
                        $document.unbind('mousemove.drag');
                    });
                    e.preventDefault();
                });
            });
        }

        $(function(){
            $('head').append('<link rel="stylesheet" type="text/css" href="'+CSS_URL+'">');

            // example: <meta name="kittycheck_site_uniq_id" content="72f06eedb2fd5971d8fa9df1918793fe" />
            var $suid_meta = $('meta[name="kittycheck_site_uniq_id"]');
            if ($suid_meta.length) {
                IFRAME_URL += '?site_uniq_id=' + encodeURIComponent($suid_meta.attr('content'));
            }

            // example: <meta name="kittycheck_position" content="top=10,left=10" />
            var $position = $('meta[name="kittycheck_position"]'),
                catCss = $position.length && (function(){
                    var params = {}, length = 0;
                    $.each($position.attr('content').split(','), function(i, param){
                        param = param.split('=');
                        if (param.length == 2) {
                            params[param[0]] = /^\d+$/.test(param[1]) ? parseInt(param[1]) : param[1];
                            length += 1;
                        }
                    });
                    return length ? params : false;
                }()) || {top: 30, right: 30};
                
            // example: <meta name="kittycheck_checkin_color" content="rgba(0,0,0,0.2)" />
            // allowed format: hex, rgb(a)
            var $checkinColor = $('meta[name="kittycheck_checkin_color"]'),
                checkinColor = $checkinColor.length && $checkinColor.attr('content')
                               || "rgba(0,0,0,0.2)";
                           
            // example: <meta name="kittycheck_parent" content="h1" />
            // format: any css/jQuery selector
            var $parent = $('meta[name="kittycheck_parent"]'),
                parent = $parent.length && $parent.attr('content') || "body";

            var $should_rumble = $('meta[name="kittycheck_rumble"]'),
                should_rumble = $should_rumble.length && $parent.attr('content') || false;
                
            var docHeight = $(document).height(),
                docWidth = $(document).width(),
                offset = 40,
                $wrp = $('<div>')
                .css({
                    left: (function(){
                        var left = catCss['left'] && parseInt(catCss['left']) 
                                || catCss['right'] && docWidth - parseInt(catCss['right']) || 0;
                        if (left + offset + 500 > docWidth) {
                            left = docWidth - offset - 500 - 32;
                        } else {
                            left += offset;
                        }
                        return left;
                    }()),
                    top: (function(){
                        var top = catCss['top'] && parseInt(catCss['top']) 
                                || catCss['bottom'] && docHeight - parseInt(catCss['bottom']) || 0;
                        if (top + 400 > docHeight) {
                            top = docHeight - 400;
                        }
                        return top;
                    }())
                })
                .addClass('kittycheck-wrp');
            var $close = $('<a>')
                .attr('href', 'javascript:void(0)')
                .attr('title', 'Закрыть')
                .addClass('kittycheck-close')
                .text('×');
            var $title = $('<div>')
                .addClass('kittycheck-title')
                .html('Kittycheck');
            var $iframeWrp = $('<div>')
                .addClass('kittycheck-iframe-wrp');
            var $iframe = $('<iframe>')
                .addClass('kittycheck-iframe');
            var $iframeFix = $('<div>')
                .addClass('kittycheck-iframefix');
            var $cat = $('<div>')
                .css(catCss)
                .addClass('kittycheck-cat');

            $(parent).append($cat, $wrp);
            $wrp.append($title, $iframeWrp);
            $iframeWrp.append($iframe, $iframeFix);
            $title.append($close);

            $cat.checkin($wrp, checkinColor, should_rumble, function () {
                $iframe.hide().attr('src', IFRAME_URL);
                $wrp.show();
                $iframe.load(function(){
                    $iframe.show();
                });
            });

            $close.click(function(){
                $wrp.hide();
                return false;
            });

            $wrp.draggable({
                handle: $title,
                start: function () {
                    $iframeFix.show();
                },
                stop: function () {
                    $iframeFix.hide();
                }
            });
        });
    }(jQuery));
});