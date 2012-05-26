define([], function() {

    var month = function(n){
        switch (n) {
            case 1: return 'Янв';
            case 2: return 'Фев';
            case 3: return 'Мар';
            case 4: return 'Апр';
            case 5: return 'Май';
            case 6: return 'Июн';
            case 7: return 'Июл';
            case 8: return 'Авг';
            case 9: return 'Сен';
            case 10: return 'Окт';
            case 11: return 'Нов';
            case 12: return 'Дек';
        }
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
            if (new Date().getYear() != date.getYear()) {
                year = ', ' + date.getYear();
            }
            return date.getDate() + ' ' + month(date.getMonth() + 1) + year;
        }
    };
});
