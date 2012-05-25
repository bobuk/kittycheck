define(['jquery'], function () {
    // показывает текст "ура, ты зачекинился 123им"
    // и кнопку показать комментарии (позже это будет "авторизироваться")
    // возвращает элемент на который кликать для отображения каментов
    // типо return $('.show-comments');
    return function () {
      $.post("/api/checkin/"+window.site_uniq_id, function(data) {
        $('#kittycheck-container .checkin-count').text(data.checkins);
      });
    };
});