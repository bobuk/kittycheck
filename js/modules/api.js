define(function() {

    var absUrl = 'http://kittycheck.com/',
        apiUrl = absUrl + 'api/v1/',
        siteId = window.site_uniq_id;

    return {
        checkIn: function (callback) {
            $.ajax({
                url: apiUrl + 'checkin/' + siteId + '/',
                type: 'post',
                dataType: 'json',
                success: callback
            });
        },
        getComments: function (callback) {
            $.ajax({
                url: apiUrl + 'comments/' + siteId + '/',
                type: 'get',
                dataType: 'json',
                success: callback
            });
        },
        sendComment: function (text, success, error) {
            $.ajax({
                url: apiUrl + 'comments/' + siteId + '/',
                type: 'post',
                dataType: 'json',
                data: {text: text},
                success: function(resp) {
                    resp.error ? error(resp) : success(resp);
                },
                error: function(e) {
                    error('Ошибка ' + e.statusCode);
                }
            });
        },
        getLoginUrl: function(){
            return absUrl + 'login';
        },
        getIdentity: function(callback){
            $.ajax({
                url: apiUrl + 'identity/',
                type: 'get',
                dataType: 'json',
                success: callback,
                error: function(){
                    callback({authenticated: false});
                }
            });
        }
    };
});
