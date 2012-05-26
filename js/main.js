require.config({
    paths: {
        "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
    }
});

require([
    'jquery', 
    'modules/checkin', 
    'modules/showComments'
], function($, checkIn, showComments) {
    $(function() {
        checkIn(function(params){
            params.commentsBtn.click(function(){
                showComments();
            });
        });
    });
});
