jQuery.noConflict();
(function($){
    
    $(function(){
        var $wrp = $('<div>').addClass('kittycheck-wrp');
        var $close = $('<a>')
            .attr('href', 'javascript:void(0)')
            .attr('title', 'Закрыть')
            .addClass('kittycheck-close')
            .text('×');
        var $title = $('<div>')
            .addClass('kittycheck-title')
            .html('Kittycheck');
        var $iframe = $('<iframe>')
            .addClass('kittycheck-iframe');
        var $cat = $('<div>')
            .addClass('kittycheck-cat');
            
        $('body').append($cat).append($wrp);
        $wrp.append($title).append($iframe);
        $title.append($close);
        
        $cat.checkin($wrp, function () {
            $wrp.show();
            $iframe.attr('src', 'index.html'); // @todo: заменить на абсолютный путь
        });
        
        $close.click(function(){
            $wrp.hide();
            return false;
        });
    });
    
    $.fn.checkin = function($wrp, callback){
        var pressTimer,
            milkTimer,
            timeout = 1400;
            
        $(this).mousedown(function(e){
            if (!$wrp.is(':visible')) {
                addracker('#kitty', e);
                pressTimer = window.setTimeout(function() {
                    callback();
                }, timeout);
            }
            return false; 
        });
        
        $('body').mouseup(function() {
            clearTimeout(pressTimer)
            delracker();
        });
        
        function draw( color, size ) {
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
        
        function addracker(sel, ev) {
            $('body').append(
                "<canvas id='kittychek-milk' "+
                " width=75 height=75 " +
                "style='position: absolute; " +
                "left: " + (ev.clientX-35) + "px; " +
                "top: "  + (ev.clientY-35) +  "px;' value='0'/>");
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
                draw('#87CEEB', 75);
                milkTimer = setTimeout(timer, 20);
            } else {
                YouHooo();
            };
        }
    };
    
}(jQuery));