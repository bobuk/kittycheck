define(['modules/api', 'modules/showComments'], function(api, showComments) {
    var win;
    
    var checkIdentity = function(authenticated, newuser){
        api.getIdentity(function(resp){
                if (resp.authenticated) {
                    if (typeof authenticated == 'function') {
                        authenticated();
                    }
                } else {
                    if (typeof newuser == 'function') {
                        newuser();
                    }
                }
        });
    }
    
    return {
        checkIdentity: checkIdentity,
        signIn: function(){
            win = window.open(api.getLoginUrl(), '', 
                'left=100,top=100,height=500,width=700,menubar=0,status=0,toolbar=0');
            var oauthInterval = setInterval(function(){
                if (win.closed) {
                    clearInterval(oauthInterval);
                    checkIdentity(showComments);
                }
            }, 1000);
        }
    };
});
