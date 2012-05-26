define(['modules/api', 'modules/tmpl'], function (api, tmpl) {
    // показывает текст "ура, ты зачекинился 123-м"
    // и кнопку "показать комментарии" (позже это будет "авторизироваться")
    // После чекина вызывает callback
    return function (callback) {
        api.checkIn(function(data) {
            $('#kittycheck-container').html(tmpl('checkin_message_tmpl', data));
            if (typeof callback == 'function') {
                callback({
                    commentsBtn: $('.show-comments'),
                    data: data
                });
            }
        });
    };
});