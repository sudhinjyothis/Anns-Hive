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
        } else if (xhr.responseText === "regtrue") {
            signOut()
            location.href = "/gmailwelcome"
        }
    };
    xhr.send('idtoken=' + id_token);
}
function emailcheck(value) {
    document.getElementById("emailLoad").classList.add('loadingshow')
    $.ajax({
        url: "/checkemail",
        data: {
            email: value
        },
        method: "get",
        success: (response) => {
            if (response.status) {
                document.getElementById("emailCheckStatus").classList.add("emailExists")
                document.getElementById("signupbtn").classList.add('disabled')
                document.getElementById("emailLoad").classList.remove('loadingshow')
            } else {
                document.getElementById("emailCheckStatus").classList.remove("emailExists")
                document.getElementById("emailLoad").classList.remove('loadingshow')
                document.getElementById("signupbtn").classList.remove('disabled')
            }
        }
    })
}