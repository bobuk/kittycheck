define(['jquery', 'modules/api'], function ($, api) {
    // показывает текст "ура, ты зачекинился 123им"
    // и кнопку показать комментарии (позже это будет "авторизироваться")
    // возвращает элемент на который кликать для отображения каментов
    // типо return $('.show-comments');
    return function () {
        api.checkIn(function(data) {
        $('#kittycheck-container .checkin-count').text(data.checkins);

        return $('.show-comments');
      });
    };
});