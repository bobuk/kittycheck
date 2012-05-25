define(['jquery', 'modules/api'], function ($, api) {
    // показывает текст "ура, ты зачекинился 123им"
    // и кнопку показать комментарии (позже это будет "авторизироваться")
    // возвращает элемент на который кликать для отображения каментов
    // типо return $('.show-comments');
    return function () {
        api.checkIn(function(data) {
        /*
        markup example:
        <div id="kittycheck-container">
          <div class="checkin-message">
            Ура! Ты зачекинился тут
            <span class="checkin-count">0</span>
            -м!
          </div>
          <div class="show-comments">Показать комментарии</div>
        </div>
        */
        $('#kittycheck-container .checkin-count').text(data.checkins);

        return $('.show-comments');
      });
    };
});