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
            .attr('src', 'index.html') // @todo: заменить на абсолютный путь
            .addClass('kittycheck-iframe');
        var $cat = $('<div>')
            .addClass('kittycheck-cat');
            
        $('body').append($cat).append($wrp);
        $wrp.append($title).append($iframe);
        $title.append($close);
        
        $cat.click(function(){
            $wrp.show();
            return false; 
        });
        
        $close.click(function(){
            $wrp.hide();
            return false;
        });
    });
}(jQuery));