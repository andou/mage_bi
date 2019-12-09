function Dater() {
}

Dater.prototype.getDate = function(dateString) {
    return new Date(dateString);
};

Dater.prototype.getDateDay = function(date) {
    var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return year + ' ' + monthNames[monthIndex] + ' ' + day;
};

Dater.prototype.getHourFromX = function(x, size, punch_tick = 4) {
    var _x = parseInt((x - (punch_tick / 2)) / punch_tick);
    var s = String(_x);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};