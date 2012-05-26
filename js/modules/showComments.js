define(['modules/api', 'modules/tmpl'], function (api, tmpl) {
    // рендерит комментарии
    return function () {
        $('#kittycheck-container').html(tmpl('comments_tmpl'));
        var $loader = $('.loader');
        
        $loader.show();
        api.getComments(function(data){
            $loader.hide();
            
        });
    };
});