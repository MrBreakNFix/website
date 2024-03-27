// on dom load storage
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded");
    // try to get username from local storage
    var username = localStorage.getItem('Busername');
    if (username) {
        document.getElementById('Busername').value = username;
    }
});

function mc_login() {
    // get username and password, store in cookie
    var username = document.getElementById("Busername").value;
    var password = document.getElementById("Bpassword").value;

    // check credentials on server
    check_creds(username, password);
}

function check_creds(username, password) {
    // save to local storage
    localStorage.setItem('Busername', username);
    localStorage.setItem('Bpassword', password);

    var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};

    paramsObject['username'] = username;
    paramsObject['password'] = password;
    paramsObject['action'] = 'check_creds';

    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    var handleResponse = function(response) {
        console.log('Request successful. Response:', response);
        if (response.status === 'validuser') {
            console.log("Credentials are valid, creating cookie");
            // put in 'login' cookie
            document.cookie = "login=" + username + "," + password
            window.location.replace("index.html");
            console.log("login cookie set");

        } else if (response.status === 'invaliduser') {
            console.log("Credentials are invalid");
            show_error('Invalid username or password');
        } else {
            show_error('Unknown error');
        }
    };
    var handleEnterKey = function(event) {
        if (event.key === 'Enter') {
            mc_login();
        }
    }
    window[callbackName] = handleResponse;
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
