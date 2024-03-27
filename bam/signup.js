function create_user() {
    var username = document.getElementById('Cusername').value;
    var password = document.getElementById('Cpassword').value;
    var password2 = document.getElementById('CconfirmPassword').value;

    //button
    var button = document.getElementById('createAccount');
    button.disabled = true;

    if (password !== password2) {
        show_error('Passwords do not match');
        return;
    }

    let api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};

    paramsObject['username'] = username;
    paramsObject['password'] = password;
    paramsObject['action'] = 'create_bam_user_flow';

    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    var handleResponse = function(response) {
        console.log('Request successful. Response:', response);
        if (response.status === 'validuser') {
            console.log("Credentials are valid, creating cookie");
            // put in 'login' cookie
            document.cookie = "login=" + username + "," + password
            // redirect to manage.html
            window.location.replace("index.html");
            console.log("login cookie set");


            button.disabled = false;

        } else if (response.status === 'username_taken') {
            console.log("Credentials are invalid");
            show_error('User already exists, try something else.');
            button.disabled = false;
        } else {
            show_error('Unknown error');
            button.disabled = false;
        }
    };
    var handleEnterKey = function(event) {
        if (event.key === 'Enter') {
            create_user();
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
