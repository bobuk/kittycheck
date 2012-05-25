Проект для протокола работы с сервером
======================================
для всех JSON ручек, если указана переменная cb = всё оборачивается в вызов callback функции

1. Точка чекина:
    POST /api/checkin/:md5(site_uniq_id):/
пост чего угодно в эту ручку возвращает
<code>
["error": errcode or 0,
    "checkins": numbers of checkins,
    "comments_url": url for comments ]
</code>

