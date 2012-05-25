define(['jquery', 'modules/api', 'modules/tmpl'], function ($, api, tmpl) {
    // показывает текст "ура, ты зачекинился 123им"
    // и кнопку показать комментарии (позже это будет "авторизироваться")
    // возвращает элемент на который кликать для отображения каментов
    // типо return $('.show-comments');
    return function () {
        api.checkIn(function(data) {
        $('#kittycheck-container').append(tmpl('checkin_message_tmpl', data));
        $('#kittycheck-container').append('<div class="show-comments">Показать комментарии</div>');

        return $('.show-comments');
      });
    };
});