// Function to display a notification with clipboard contents
function displayClipboardNotification(content) {
    // Check if notification permission is granted
    if (Notification.permission === 'granted') {
        self.registration.showNotification('Clipboard Notification', {
            body: content,
        });
    }
}

// Listen for messages from the main page
self.addEventListener('message', event => {
    const clipboardText = event.data.clipboardText;
    if (clipboardText) {
        displayClipboardNotification(clipboardText);
    }
});

// Add event listener for notification click
self.addEventListener('notificationclick', event => {
    // Handle notification click event here
    console.log('Notification clicked');
    // Close the notification
    event.notification.close();
});
