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

2. Пост камента
    POST /api/v1/comments/:md5(site_uniq_id):/
пост поля формы text в эту ручку постит камент из text.
Возвращает:
<code>
["sitehash": ":md5(site_uniq_id)",
    "checkins": numbers of checkins,
    "comments": [
        {"text": "text of comments", "author": "author name", "datetime": "2012-05-25 23:21:53.118626"},    {"text": "", "datetime": "2012-05-25 23:22:01.488500", "author": "nobody"}],
 "error": 0 or text of error]
</code>

    GET /api/v1/comments/:md5(site_uniq_id):/
гет возвращает от же самое, но не постит текст камента

