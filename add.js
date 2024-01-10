document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded");
    if (document.cookie.indexOf("login") === -1) {
        window.location.replace("mclogin.html");
    }
    var username = document.cookie.split("=")[1].split(",")[0];
    var password = document.cookie.split("=")[1].split(",")[1]; // unused for now?
    document.getElementById('bamusername').innerHTML = username;

    var usr = localStorage.getItem('username');
    if (usr) {
        document.getElementById('username').value = usr;
    }
});

var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';

var urlParams = new URLSearchParams(window.location.search);

function updateCode() {
    var username = document.getElementById('username').value;
    var paramsObject = {};
    if (!urlParams.has('code')) {
        show_error("You must log in first, click <a href='https://login.live.com/oauth20_authorize.srf?client_id=c56ecfc5-eac9-439a-99ac-f8d7e29c07fa&response_type=code&redirect_uri=https://mrbreaknfix.com/mcauth&scope=XboxLive.signin%20offline_access'>here</a> to log in, then you may try again");
        return;
    }
    //save username box in local storage (buggy)
    localStorage.setItem('username', username);

    urlParams.forEach(function(value, key) {
        paramsObject[key] = value;
    });

    paramsObject['username'] = username;

    paramsObject['bamusername'] = document.cookie.split("=")[1].split(",")[0];
    paramsObject['bampassword'] = document.cookie.split("=")[1].split(",")[1];

    paramsObject['action'] = 'add_account';

    var callbackName = 'handleResponse';

    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    var button = document.getElementById('submitButton');

    var handleResponse = function(response) {
        console.log('Request successful. Response:', response);

        button.disabled = true;
        document.removeEventListener('keydown', handleEnterKey);

        if (response.status === 'success') {
            window.location.href = 'https://mrbreaknfix.com/success'; // comment out for debugging
            console.log('success');
        } else if (response.status === 'no_profile') {
            show_error('This account does not exist');
            // reset
            document.addEventListener('keydown', handleEnterKey);
            button.disabled = false;
        } else if (response.status === 'invalid_code') {
            show_error('Code expired or invalid, click <a href="https://mrbreaknfix.com/mcauth">here</a> to try again');
            // reset
            document.addEventListener('keydown', handleEnterKey);
            button.disabled = false;
        } else if (response.status === 'mismatch') {
            //    var missmatch = parameters.callback + '(' + JSON.stringify({ status: 'mismatch', got: sentUsername, expected: receivedUsername }) + ')';
            show_error('Did you mean ' + response.expected + '?' + ' Click <a href="https://login.live.com/oauth20_authorize.srf?client_id=c56ecfc5-eac9-439a-99ac-f8d7e29c07fa&response_type=code&redirect_uri=https://mrbreaknfix.com/mcauth&scope=XboxLive.signin%20offline_access">here</a> to add this account instead');
            //<input type="text" id="username" placeholder="Enter your Minecraft username" autocomplete="off" required="">
            // set local storage username to expected
            localStorage.setItem('username', response.expected);

        } else {
            window.location.href = 'https://mrbreaknfix.com/failed'; // comment out for debugging
            console.log('failed');
        }
    };

    var handleEnterKey = function(event) {
        if (event.key === 'Enter') {
            updateCode();
        }
    };

    window[callbackName] = handleResponse;

    button.disabled = true;

    document.addEventListener('keydown', handleEnterKey);

    document.body.appendChild(script);
}

function show_error(text) {
    var errorElement = document.getElementById('error');
    errorElement.innerHTML = text;
    errorElement.style.display = 'block';
    setTimeout(function() {
        errorElement.style.opacity = '1';
    }, 10);

    setTimeout(function() {
        errorElement.style.opacity = '0';
    }, 10000);

    setTimeout(function() {
        errorElement.style.display = 'none';
    }, 15000);
}
