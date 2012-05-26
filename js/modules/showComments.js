define([
    'modules/api', 
    'modules/tmpl', 
    'modules/prettyDate'
], function (api, tmpl, prettyDate) {
    // рендерит комментарии
    return function () {
        $('#kittycheck-container').html(tmpl('comments_page_tmpl'));
        var $loader = $('.loader'),
            $form = $('#send-comment'),
            $text = $('form textarea'),
            $submit = $('form .send'),
            $sendLoader = $('.form .send-loader'),
            $noComments = $('.no-comments');
        
        var renderComments = function (comments) {
            if (comments && comments.length) {
                var html = [];
                $.each(comments, function(i, item){
                    item.datetime = prettyDate(new Date(item.datetime));
                    html.push(tmpl('comment_tmpl', item));
                });
                $noComments.hide();
                $('#messages-container').html(html.join(''));
            } else {
                $noComments.show();
            }
        };
        
        var showNotification = function (msg, isError) {
            var $alert = $('<div>').addClass('alert');
            if (isError) {
                $alert.html('<b>Ошибка</b>. ' + msg);
            } else {
                $alert.addClass('alert-success').html(msg);
            }
            $alert.appendTo($form).fadeIn('fast');
            setTimeout(function(){
                $alert.slideUp('fast', function(){
                    $alert.remove();
                });
            }, 2e3);
        };
        
        var toggleSendBtn = function(activate){
            if (activate) {
                $submit.removeClass('disabled');
                $sendLoader.hide();
            } else {
                $submit.addClass('disabled');
                $sendLoader.show();
            }
        };
        
        var sendComment = function (text) {
            api.sendComment(text, function(resp){
                showNotification('Сообщение отправлено');
                renderComments(resp.comments);
                $text.val('');
                toggleSendBtn(true);
            }, function(resp){
                showNotification(resp.error, true);
                toggleSendBtn(true);
            });
        };
        
        $loader.show();
        api.getComments(function(data){
            $loader.hide();
            renderComments(data.comments);
        });
        
        $form.submit(function(){
            var text = $.trim($text.val());
            if (text && !$submit.hasClass('disabled')) {
                toggleSendBtn(false);
                sendComment(text);
            }
            return false;
        });
    };
});