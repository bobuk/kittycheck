Проект для протокола работы с сервером
======================================
для всех JSON ручек, если указана переменная cb = всё оборачивается в вызов callback функции

1. Точка чекина:

    POST /api/v1/checkin/:md5(site_uniq_id):/
пост чего угодно в эту ручку возвращает
<code>
["error": errcode or 0,
    "checkins": numbers of checkins,
    "comments_url": url for comments ]
</code>

    GET /api/v1/checkin/:md5(site_uniq_id):/
гет отсюда возвращает то же, что и POST, но чекин не засчитывается
