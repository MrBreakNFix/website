// api.js
// Not sure why I made this file, ill remove it when I feel like it.
var apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
// dang im here again, i still have no recollection of making this file lol :)
// bro what?? i never remember making this file

function makeApiCall(paramsObject, callbackName) {
    var script = document.createElement('script');
    script.src = apiBaseUrl + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    document.body.appendChild(script);
}
