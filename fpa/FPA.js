// FPA.js

(function() {
    var fpa = {};

    // Function to generate a unique ID
    function generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); // Use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    }

    // Check if localStorage is available
    function isLocalStorageAvailable() {
        try {
            var testKey = 'test';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Check number of visits and assign ID
    if (isLocalStorageAvailable()) {
        if (!localStorage.getItem('fpa_visit_count')) {
            localStorage.setItem('fpa_visit_count', 1);
            localStorage.setItem('fpa_user_id', generateUUID());
        } else {
            var visitCount = parseInt(localStorage.getItem('fpa_visit_count'));
            localStorage.setItem('fpa_visit_count', visitCount + 1);
        }
    } else {
        console.warn('Local storage not available. Cannot track visits.');
    }

    // Store visit count and user ID
    fpa.visitCount = localStorage.getItem('fpa_visit_count') || 'N/A';
    fpa.userId = localStorage.getItem('fpa_user_id') || 'N/A';

    // Detect incognito mode
    function detectIncognito(callback) {
        var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) {
            callback(false);
        } else {
            fs(window.TEMPORARY, 1, function() {
                callback(false);
            }, function() {
                callback(true);
            });
        }
    }

    detectIncognito(function(isIncognito) {
        fpa.incognito = isIncognito ? 'Yes' : 'No';
        console.log('Incognito mode:', fpa.incognito);
    });

    // User Agent
    fpa.userAgent = navigator.userAgent;

    // Language
    fpa.language = navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage || '';

    // Screen Resolution
    fpa.screenResolution = window.screen.width + "x" + window.screen.height;

    // Timezone
    fpa.timezone = new Date().getTimezoneOffset() / -60;

    // Plugins
    fpa.plugins = [];
    if (navigator.plugins && navigator.plugins.length) {
        for (var i = 0; i < navigator.plugins.length; i++) {
            fpa.plugins.push(navigator.plugins[i].name);
        }
    }

    // Platform
    fpa.platform = navigator.platform;

    // Do Not Track
    fpa.doNotTrack = navigator.doNotTrack || 'Not available';

    // Cookies Enabled
    fpa.cookiesEnabled = navigator.cookieEnabled;

    // WebRTC IP Leakage (not fully reliable)
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPeerConnection) {
        var rtc = new RTCPeerConnection({iceServers: []});
        rtc.createDataChannel('', {reliable: false});
        rtc.onicecandidate = function(evt) {
            if (evt.candidate) {
                fpa.localIP = evt.candidate.candidate.split(' ')[4];
                rtc.onicecandidate = function() {};
                console.log('Local IP:', fpa.localIP);
            }
        };
        rtc.createOffer(function(offerDesc) {
            rtc.setLocalDescription(offerDesc);
        }, function(e) {
            console.warn("Couldn't create offer", e);
        });
    }

    // Output fingerprinting information
    console.log(fpa);

    // Send fingerprinting information to server via AJAX or other means
})();
