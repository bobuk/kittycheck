define(function() {

    var monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Нов', 'Дек'];
    var month = function(n){
        return monthNames[n - 1];
    };


    /*
     * JavaScript Pretty Date
     * Copyright (c) 2011 John Resig (ejohn.org)
     * Licensed under the MIT and GPL licenses.
     */
    return function (date) {
        var c = (((new Date()).getTime() - date.getTime()) / 1000);
        var eqDate = new Date().getDate() == date.getDate();
        if (c < 10) {
            return 'Только что';
        } else if (c < 60) { // seconds
            return Math.floor(c) + 'с';
        } else if (c >= 60 && c < 3600) { // minutes
            return Math.floor(c / 60) + 'м';
        } else if (c >= 3600 && c < 86400 && eqDate) { // hours
            return Math.floor(c / 3600) + 'ч';
        } else if (c >= 86400 || !eqDate) {
            var year = '';
            if (new Date().getFullYear() != date.getFullYear()) {
                year = ', ' + date.getFullYear();
            }
            return date.getDate() + ' ' + month(date.getMonth() + 1) + year;
        }
    };
});
