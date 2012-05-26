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
        
        var renderComments = function (data) {
            var comments = data.comments;
            if (comments && comments.length) {
                var html = [];
                $.each(comments, function(i, item){
                    item.datetime = prettyDate(new Date(item.datetime*1000));
                    html.push(tmpl('comment_tmpl', item));
                });
                $noComments.hide();
                $('#messages-container').html(html.join(''));
            } else {
                $noComments.show();
            }
            $('.checkin-count').text(data.checkins);
            $('.checkin-message-c').show();
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
                renderComments(resp);
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
            renderComments(data);
        });
        
        $form.submit(function(){
            var text = $.trim($text.val());
            if (text && !$submit.hasClass('disabled')) {
                toggleSendBtn(false);
                sendComment(text);
            }
            return false;
        });
        
        $text.focus(function(){
            $form.addClass('focused');
        }).blur(function(){
            if (!$text.val()) {
                $form.removeClass('focused');
            }
        }) .keydown(function(e){
            if((e.ctrlKey || e.metaKey) && e.keyCode==13) {
                $form.submit();
            }
        });
    };
});