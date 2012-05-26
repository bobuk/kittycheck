define(function() {
    
    /**
     * потом здесь будет относительный путь
     * чтобы сейчас тестировать, нужно отключить SOP
     * например так для хромиума
     * $ chromium-browser --disable-web-security &
     */
    var absUrl = 'http://ec2-79-125-81-156.eu-west-1.compute.amazonaws.com:5000/api/v1/',
        siteId = window.site_uniq_id;
        
    return {
        checkIn: function(callback){
            $.ajax({
                url: absUrl + 'checkin/' + siteId + '/',
                type: 'post',
                dataType: 'json',
                success: callback
            });
        }
    };
});