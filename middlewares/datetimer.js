module.exports.getDate = function () {
    var dateUTC = new Date();
    var dateUTC = dateUTC.getTime()
    var dateIST = new Date(dateUTC);
    //date shifting for IST timezone (+5 hours and 30 minutes)
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST.toISOString().substr(0,10)
}
