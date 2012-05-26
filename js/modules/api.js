define(function() {

    /**
     * потом здесь будет относительный путь
     * чтобы сейчас тестировать, нужно отключить SOP
     * например так для хромиума
     * $ chromium-browser --disable-web-security &
     */
    var absUrl = 'http://kittycheck.com/api/v1/',
        siteId = window.site_uniq_id;

    return {
        checkIn: function (callback) {
            $.ajax({
                url: absUrl + 'checkin/' + siteId + '/',
                type: 'post',
                dataType: 'json',
                success: callback
            });
        },
        getComments: function (callback) {
            $.ajax({
                url: absUrl + 'comments/' + siteId + '/',
                type: 'get',
                dataType: 'json',
                success: callback
            });
        }
    };
});
