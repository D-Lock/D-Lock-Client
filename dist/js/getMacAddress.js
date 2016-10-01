require('getmac').getMac(function(err,macAddress){
    if (err) throw err;
    window.mac = macAddress;
});