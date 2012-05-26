define(['modules/api', 'modules/showComments'], function(api, showComments) {
    var win;
    
    var checkIdentity = function(){
        api.getIdentity(function(resp){
            if (resp.authenticated) {
                showComments();
            }
        });
    }
    
    return {
        signIn: function(){
            win = window.open(api.getLoginUrl(), '', 
            'left=100,top=100,height=500,width=700,menubar=0,status=0,toolbar=0');
            var oauthInterval = setInterval(function(){
                if (win.closed) {
                    clearInterval(oauthInterval);
                    checkIdentity();
                }
            }, 1000);
        }
    };
});
