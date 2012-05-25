require.config({
    paths: {
        "jquery": "libs/jquery-1.7.2.min"
    }
});

require(["jquery", 'modules/checkin'], function($, checkIn) {
    $(function() {
        var $commentsBtn = checkIn();
    });
});
