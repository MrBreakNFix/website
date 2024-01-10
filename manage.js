document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded");
    // check if login cookie exists, if not redirect to mclogin.html
    if (document.cookie.indexOf("login") === -1) {
        window.location.replace("mclogin.html");
        // check
    }
    // get username from cookie
    var username = document.cookie.split("=")[1].split(",")[0];
    var password = document.cookie.split("=")[1].split(",")[1];
    // get accounts
    // get_accs(username, password);

    //enter key
    document.getElementById("inviteCode").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("acceptinvite").click();
        }
    });

    document.getElementById('username').innerHTML = username;

    var refreshButton = document.getElementById("refresh_account_list");
    var inviteButton = document.getElementById("acceptinvite");
    inviteButton.addEventListener("click", function() {
        acceptinvite();
    });

    refreshButton.addEventListener("click", function() {
        get_accs(username, password);
    });
});

function login(account) {
    // disable button
    var loginButtons = document.getElementsByClassName("login-button")
    for (var i = 0; i < loginButtons.length; i++) {
        loginButtons[i].disabled = true;
    }
    // get username from cookie
    var username = document.cookie.split("=")[1].split(",")[0];
    var password = document.cookie.split("=")[1].split(",")[1];

    var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};

    paramsObject['bamusername'] = username;
    paramsObject['bampassword'] = password;
    paramsObject['account'] = account;
    paramsObject['action'] = 'login';

    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    function handleResponse(response) {
        console.log('Request successful. Response:', response);
        if (response.status === 'success') {

            var sessionId = response.sessionID;
            var mcAccountName = account;
            var mcUuid = response.mcUuid;

            console.log("Session ID: " + sessionId);
            console.log("Minecraft Account Name: " + mcAccountName);
            console.log("Minecraft UUID: " + mcUuid);

            for (var i = 0; i < loginButtons.length; i++) {
                loginButtons[i].disabled = false;
            }
        }
        for (var i = 0; i < loginButtons.length; i++) {
            loginButtons[i].disabled = false;
        }
    }
    window[callbackName] = handleResponse;
    document.body.appendChild(script);
}

function invite(account) {
    // disable button
    var loginButtons = document.getElementsByClassName("login-button")
    for (var i = 0; i < loginButtons.length; i++) {
        loginButtons[i].disabled = true;
    }

    // get username from cookie
    var username = document.cookie.split("=")[1].split(",")[0];
    var password = document.cookie.split("=")[1].split(",")[1];

    var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};
    var inviteCode = document.getElementById("inviteCode").value;


    paramsObject['bamusername'] = username;
    paramsObject['bampassword'] = password;
    paramsObject['account'] = account;
    paramsObject['action'] = 'login';
    paramsObject['invite'] = 'true';
    paramsObject['invitecode'] = inviteCode;

    console.log("Invite Code: " + inviteCode);
    if (inviteCode === "") {
        show_error("Please enter an invite code.");
        for (var i = 0; i < loginButtons.length; i++) {
            loginButtons[i].disabled = false;
        }
        return;
    }


    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    function handleResponse(response) {
        console.log('Request successful. Response:', response);
        if (response.status === 'success') {

            var sessionId = response.sessionID;
            var mcAccountName = account;
            var mcUuid = response.mcUuid;

            console.log("Session ID: " + sessionId);
            console.log("Minecraft Account Name: " + mcAccountName);
            console.log("Minecraft UUID: " + mcUuid);

            for (var i = 0; i < loginButtons.length; i++) {
                loginButtons[i].disabled = false;
            }
        }
        for (var i = 0; i < loginButtons.length; i++) {
            loginButtons[i].disabled = false;
        }
    }
    window[callbackName] = handleResponse;
    document.body.appendChild(script);
}




function get_accs(username, password) {
    // save to local storage
    var refreshButton = document.getElementById("refresh_account_list");
    refreshButton.disabled = true;

    var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};

    paramsObject['bamusername'] = username;
    paramsObject['bampassword'] = password;
    // paramsObject['username'] = "BAM: " + username;
    paramsObject['action'] = 'get_account_list';

    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    function handleResponse(response) {
        console.log('Request successful. Response:', response);

        // Check the response status
        if (response.status === 'success') {
            // Access the owned accounts from the response
            var accountListElement = document.getElementById('accountList');

            var ownedAccounts = response.ownedAccounts;

            if (ownedAccounts.length > 0) {
                var accountsHTML = '<ul>';
                ownedAccounts.forEach(function(account) {
                    var accountName = account.padEnd(20);
                    accountsHTML += `<div class="account-container"><p3>${accountName}</p3> 
                    <button id="login" class="login-button" onclick="invite('${account}')">Invite</button>
                    <button id="loginlogin" class="login-button" onclick="login('${account}')">Login</button>

                </div>`;
                });
                accountsHTML += '</ul>';

                accountListElement.innerHTML = accountsHTML;
                refreshButton.disabled = false;
            } else {
                accountListElement.innerHTML = 'No owned accounts found. Please link an account.';
                refreshButton.disabled = false;
            }


        } else if (response.status === 'invaliduser') {
            // Handle invalid user response
            show_error('Invalid user. Please relog.');
            refreshButton.disabled = false;
        } else {
            // Handle other error cases
            refreshButton.disabled = false;
            show_error('An error occurred while retrieving account list.');
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


function acceptinvite() {
    var inviteCode = document.getElementById("inviteCode").value;
    var button = document.getElementById("acceptinvite");
    button.disabled = true;

    // Add an event listener to disable the Enter key
    window.addEventListener('keydown', handleEnterKey);

    var api = 'https://script.google.com/macros/s/AKfycbyELpW9nBFh8nvBJhOAX3Lgxrv9CwOXG0ifvzds6mw4H1luaZvNtRx7zH-o2FuSfj4H5A/exec';
    var paramsObject = {};

    paramsObject['inviteCode'] = inviteCode;
    paramsObject['action'] = 'getinvite';

    var callbackName = 'handleResponse';
    var script = document.createElement('script');
    script.src = api + '?callback=' + callbackName + '&jsonData=' + JSON.stringify(paramsObject);

    function handleResponse(response) {
        console.log('Request successful. Response:', response);
        if (response.status === 'success') {

            var sessionId = response.inviteDetails.sessionID;
            var mcAccountName = response.inviteDetails.username;
            var mcUuid = response.inviteDetails.uuid;

            console.log("Session ID: " + sessionId);
            console.log("Minecraft Account Name: " + mcAccountName);
            console.log("Minecraft UUID: " + mcUuid);
            button.disabled = false;
        }
        if (response.status === 'invite_not_found') {
            show_error("Invalid invite.");
            button.disabled = false;
        }

        window.removeEventListener('keydown', handleEnterKey);
    }

    window[callbackName] = handleResponse;
    document.body.appendChild(script);
}

var handleEnterKey = function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}
// todo: remove useless comments, simplify code, and replace unnecessary variables with constants