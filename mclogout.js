document.addEventListener("DOMContentLoaded", function() {
    deleteCookie('login');
});
function deleteCookie(cookieName) {
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "mclogin.html";
}