// If you are confused, lmk
// https://github.com/MrBreakNFix/website
document.addEventListener("DOMContentLoaded", function() {
    // matrix
    var matrix = localStorage.getItem("matrix");
    if (matrix === "block") {
        document.getElementById("Matrix").style.display = "block";
    } else {
        document.getElementById("Matrix").style.display = "none";
    }
    document.querySelector('.login-box').style.display = 'block';
    document.querySelector(".login-box").classList.add("sliding-in");
});


// if the user has a url cookie, redirect them to the control page
if (document.cookie.indexOf("url") >= 0) {
    window.location.href = "control.html";
}
const canvas = document.getElementById('Matrix');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 15;
const columns = canvas.width/fontSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
    rainDrops[x] = Math.floor(Math.random() * 100);
}

const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#008100';

    for(let i = 0; i < rainDrops.length; i++)
    {
        const text = "10".charAt(Math.floor(Math.random() * "10".length));
        context.fillText(text, i*fontSize, rainDrops[i]*fontSize);

        if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};
setInterval(draw, 40);

function ImportKey(){
    // all this does is get the file from the fileInput class, read it, and then set the value of the accesskey input to the value of the file
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    //then we read the file
    if (file) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            document.getElementById("accesskey").value = e.target.result;
        };
        fileReader.readAsText(file);
    } else {
        console.error("No file selected for upload.");
        showResponse('No file selected for upload.', 'error');
    }
}

function validateLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var newUrlCookie = document.getElementById("accesskey").value;
    var audio = document.getElementById('errorSound');

    var accessDeniedMessage = document.getElementById("accessDenied");
    var loginBox = document.querySelector(".login-box");

    // all this login stuff is for show anyway
    // idc that everyone can see the username and pass as they are fake anyway

    if (username === "break26" && password === "ThisIs$$") {
        loginBox.classList.remove("sliding-in");
        loginBox.classList.add("sliding-out");


        setTimeout(function () {
            // make the login box disappear
            loginBox.style.display = "none";
            document.cookie = "url=" + newUrlCookie;
            window.location.href = "control.html";
        }, 1000);

        return false;
    } else {

        // more flashy stuff
        accessDeniedMessage.style.display = "block";

        audio.play();

        loginBox.classList.add("shake");

        setTimeout(function () {
            accessDeniedMessage.style.display = "none";

            loginBox.classList.remove("shake");
        }, 2130);
        return false;
    }
}
function toggleMatrix() {
    //store value in local storage
    var matrix = document.getElementById("Matrix");
    if (matrix.style.display === "none") {
        matrix.style.display = "block";
        localStorage.setItem("matrix", "block");
    } else {
        matrix.style.display = "none";
        localStorage.setItem("matrix", "none");
    }
}