// Function to display a notification
function displayNotification() {
    self.registration.showNotification('Notification Title', {
        body: 'This is a notification sent by a service worker!'
    });
}

// Schedule notification
function scheduleNotification() {
    setInterval(() => {
        displayNotification();
    }, 15000);
}

self.addEventListener('install', event => {
    console.log('Service worker installed');
    scheduleNotification();
});

self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();
});
