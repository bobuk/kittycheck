require.config({
    paths: {
        "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
    }
});

require([
    'jquery', 
    'modules/checkin', 
    'modules/showComments', 
    'modules/twitterAuth'
], function($, checkIn, showComments, twitterAuth) {
    $(function() {
        twitterAuth.checkIdentity(function(){
            showComments(true);
        }, function(){
            checkIn(function(data){
                $('.sign-in').click(function(){
                    twitterAuth.signIn();
                    return false;
                });
            });
        });
    });
});
