(function() {
    var bindReady = function (callback){
        // @todo: replace with cross-browser function
        document.addEventListener("DOMContentLoaded", callback);
    }
    
    var init = function () {
        var element = document.createElement('div');
        element.innerHTML = '<img style="cursor: pointer; position: absolute; top: 10px; right: 10px;"'
        +' src="/img/cat.png" alt="kittycheck" width="32" height="32" />';
        document.getElementsByTagName('body')[0].appendChild(element);
    };

    bindReady(init);
}());