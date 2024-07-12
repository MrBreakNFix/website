// FPA.js

(function() {
    var fpa = {};

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

    // Check number of visits
    if (isLocalStorageAvailable()) {
        if (!localStorage.getItem('fpa_visit_count')) {
            localStorage.setItem('fpa_visit_count', 1);
        } else {
            var visitCount = parseInt(localStorage.getItem('fpa_visit_count'));
            localStorage.setItem('fpa_visit_count', visitCount + 1);
        }
    } else {
        console.warn('Local storage not available. Cannot track visits.');
    }

    // Store visit count
    fpa.visitCount = localStorage.getItem('fpa_visit_count') || 'N/A';

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

    // Output fingerprinting information
    console.log(fpa);

    // Send fingerprinting information to server via AJAX or other means
})();
