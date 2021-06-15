function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/gmailsignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.responseText === "logintrue") {
            signOut()
            location.href = "/"
        } else if (xhr.responseText === "regtrue") {
            signOut()
            location.href = "/gmailsetup"
        } else if (xhr.responseText === "userExists") {
            signOut()
            location.href = "/gmailsignuserexists"
        }
    };
    xhr.send('idtoken=' + id_token);
}
function emailcheck(value) {
    document.getElementById("emailLoad").classList.add('loadingshow')
    $.ajax({
        url: "/api/checkemail",
        data: {
            email: value
        },
        method: "GET",
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
function createGmail() {
    $.ajax({
        url: "/api/creategmail",
        method: "POST",
        success: () => {
            location.href = '/'
        },
        error: () => {
            location.href = '/signup'
        }
    })
}

$(document).ready(() => {
    $('#confirmPassword').blur((e) => {
        if ($('#confirmPassword').val() != $('#Password').val()) {
            $('#passwordcheck').addClass('emailExists')
            $('#signupbtn').addClass('disabled')
        } else {
            $('#passwordcheck').removeClass('emailExists')
            $('#signupbtn').removeClass('disabled')
        }
    })
    $('#signupbtn').click((e) => {
        e.preventDefault()
        var captcha = $('#g-recaptcha-response').val()
        console.log(captcha);
        if (captcha) {
            $('#captchacheck').removeClass('emailExists')
            $.ajax({
                url: '/api/signup',
                method: 'POST',
                data: {
                    name: $('#name').val(),
                    email: $('#signupemail').val(),
                    password: $('#Password').val(),
                    confirmpassword: $('#confirmPassword').val(),
                    captcha: captcha
                },
                success: (response) => {
                    console.log(response);
                },
                error: (response) => {
                    console.log(response);
                    location.href = "/signup"
                }
            })
        } else {
            $('#captchacheck').addClass('emailExists')
        }
    })
})
