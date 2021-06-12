function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.responseText === "logintrue") {
            signOut()
            location.href = "/"
        }
    };
    xhr.send('idtoken=' + id_token);
}