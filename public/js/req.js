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
// Jquery
$(document).ready(() => {
    // fbsetup
    $('#fbsetupbtn').click((e) => {
        e.preventDefault()
        $.ajax({
            url: "/api/createfb",
            method: "POST",
            success: () => {
                location.href = '/'
            },
            error: () => {
                location.href = '/signup'
            }
        })

    })
    // signUp
    // signup button err handling
    $('#signupbtn').click((e) => {
        e.preventDefault()
        // checking if fields are empty 
        var captcha = $('#g-recaptcha-response').val()
        if ($('#name').val() === undefined || $('#name').val() === null || $('#name').val().length == 0) {
            $('#errlab1').css('display', 'inline-block')
        } else if ($('#signupemail').val() === undefined || $('#signupemail').val() === null || $('#signupemail').val().length === 0) {
            $('#errlab2').css('display', 'inline-block')
        } else if ($('#Password').val() === undefined || $('#Password').val() === null || $('#Password').val().length === 0) {
            $('#errlab3').css('display', 'inline-block')
        } else if ($('#Password').val().length < 6) {
            $('#passreq1').css('display', 'inline-block')
        } else if (!/([A-Z])/.test($('#Password').val())) {
            $('#passreq3').css('display', 'inline-block')
        } else if (!/([0-9])/.test($('#Password').val())) {
            $('#passreq2').css('display', 'inline-block')
        } else if ($.trim($('#name').val()) == '') {
            $('#errlab1').css('display', 'inline-block')
        } else if ($('#confirmPassword').val() != $('#Password').val()) {
            $('#passwordcheck').css('display', "inline-block")
        }
        else {
            if (captcha) {
                $('#captchacheck').css('display', 'none')
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
                        location.href = '/verificationsend'
                    },
                    error: (response) => {
                        location.href = "/signup"
                    }
                })
            } else {
                $('#captchacheck').css('display', 'inline-block')
            }
        }
    })
    // on blur error handling
    $('#name').blur(() => {
        if ($('#name').val() === undefined || $('#name').val() === null || $('#name').val().length === 0) {
            $('#name').addClass('is-invalid')
            $('#errlab1').css('display', 'inline-block')
        } else {
            if ($.trim($('#name').val()) == '') {
                $('#name').addClass('is-invalid')
                $('#errlab1').css('display', 'inline-block')
            } else {
                $('#name').removeClass('is-invalid')
                $('#errlab1').css('display', 'none')
            }
        }
    })
    $('#signupemail').blur(() => {
        if ($('#signupemail').val() === undefined || $('#signupemail').val() === null || $('#signupemail').val().length == 0) {
            $("#emailCheckStatus").css('display', 'none')
            $('#invalidEmail').css('display', 'none')
            $('#errlab2').css('display', 'inline-block')
            $('#signupemail').addClass('is-invalid')
        } else {
            $('#signupemail').removeClass('is-invalid')
            $('#errlab2').css('display', 'none')
            $("#emailLoad").addClass('loadingshow')
            $.ajax({
                url: "/api/checkemail",
                data: {
                    email: $('#signupemail').val()
                },
                method: "GET",
                success: (response) => {
                    if (response.status == true) {
                        $('#signupemail').addClass('is-invalid')
                        $('#invalidEmail').css('display', 'none')
                        $("#emailCheckStatus").css('display', 'inline-block')
                        $('#signupbtn').addClass('disabled')
                    } else if (response.status === 'invalidEmail') {
                        $('#signupemail').addClass('is-invalid')
                        $("#emailCheckStatus").css('display', 'none')
                        $('#invalidEmail').css('display', 'inline-block')
                    }
                    else {
                        $('#signupemail').removeClass('is-invalid')
                        $('#signupemail').addClass('is-valid')
                        $("#emailCheckStatus").css('display', 'none')
                        $('#signupbtn').removeClass('disabled')
                        $('#invalidEmail').css('display', 'none')
                    }
                }
            })
        }
    })
    $('#Password').blur(() => {
        if ($('#Password').val() === undefined || $('#Password').val() === null || $('#Password').val().length === 0) {
            $('#Password').addClass('is-invalid')
            $('#errlab3').css('display', 'inline-block')
        } else {
            $('#errlab3').css('display', 'none')
            if ($('#Password').val().length < 6) {
                $('#Password').addClass('is-invalid')
                $('#passreq1').css('display', 'inline-block')
                $('#passreq2').css('display', 'none')
                $('#passreq3').css('display', 'none')
            } else if (!/([A-Z])/.test($('#Password').val())) {
                $('#Password').addClass('is-invalid')
                $('#passreq3').css('display', 'inline-block')
                $('#passreq1').css('display', 'none')
                $('#passreq2').css('display', 'none')
            } else if (!/([0-9])/.test($('#Password').val())) {
                $('#Password').addClass('is-invalid')
                $('#passreq2').css('display', 'inline-block')
                $('#passreq1').css('display', 'none')
                $('#passreq3').css('display', 'none')
            } else {
                $('#Password').removeClass('is-invalid')
                $('#passreq1').css('display', 'none')
                $('#passreq2').css('display', 'none')
                $('#passreq3').css('display', 'none')
            }
        }
    })
    $('#confirmPassword').blur((e) => {
        if ($('#confirmPassword').val() != $('#Password').val()) {
            $('#confirmPassword').addClass('is-invalid')
            $('#errlab4').css('display', 'none')
            $('#passwordcheck').css('display', "inline-block")
        } else {
            $('#confirmPassword').removeClass('is-invalid')
            $('#passwordcheck').css('display', "none")
        }
    })

    // signIn
    $('#signinBtn').click((e) => {
        $('#signinErrMsg').css('display', 'none')
        e.preventDefault()
        if ($.trim($('#signinEmail').val()) == '') {
            $('#signinErrMsg').css('display', 'inline-block')
        } else {
            $.ajax({
                url: '/api/signin',
                method: "POST",
                data: {
                    email: $('#signinEmail').val(),
                    password: $('#signinPassword').val(),
                    rememberMe: $('#rememberMeCheck').is(":checked")
                },
                success: (response) => {
                    if (response.status === true) {
                        location.href = '/'
                    } else if (response.status === "notVerified") {
                        location.href = '/notverified'
                    }
                    else {
                        $('#signinErrMsg').css('display', 'inline-block')
                    }
                }
            })
        }
    })
    // add address btn 
    $('#addaddressbtn').click((e) => {
        e.preventDefault()
        $.ajax({
            url: '/api/checkaddressemail',
            method: 'POST',
            data: {
                email: $('#addressemail').val()
            },
            success: (response) => {
                if (response.status) {
                    $('#addressemail').addClass('is-invalid')
                    $('#emailExists').css('display', 'inline-block')
                } else {
                    $('#addressemail').removeClass('is-invalid')
                    $('#addressemail').addClass('is-valid')
                    $('#emailExists').css('display', 'none')
                    $.ajax({
                        url: '/api/addaddress',
                        method: 'POST',
                        data: {
                            addressname: $('#addressname').val(),
                            addressemail: $('#addressemail').val(),
                            addressmobile: $('#addressmobile').val(),
                            addressmobile2: $('#addressmobile2').val(),
                            addressline1: $('#addressline1').val(),
                            addressline2: $('#addressline2').val(),
                            addressstate: $("#addressstate option:selected").text(),
                            addresscity: $('#addresscity').val(),
                            addresspin: $('#addresspin').val()
                        },
                        success: (response) => {
                            if (response.status === "added") {
                                location.href = '/profile'
                            }
                        }

                    })
                }
            }

        })
    })
    // existing email
    $('#addressemail').blur(() => {
        $.ajax({
            url: '/api/checkaddressemail',
            method: 'POST',
            data: {
                email: $('#addressemail').val()
            },
            success: (response) => {
                if (response.status) {
                    $('#addressemail').addClass('is-invalid')
                    $('#emailExists').css('display', 'inline-block')
                    $('#addaddressbtn').addClass('disabled')
                } else {
                    $('#addressemail').removeClass('is-invalid')
                    $('#addressemail').addClass('is-valid')
                    $('#emailExists').css('display', 'none')
                    $('#addaddressbtn').removeClass('disabled')
                }
            }

        })
    })
    // edit address 
    $('#editaddressbtn').click((e) => {
        e.preventDefault()
        $.ajax({
            url: '/api/editaddress',
            method: 'POST',
            data: {
                addressname: $('#addressname').val(),
                addressemail: $('#addressemail').val(),
                addressmobile: $('#addressmobile').val(),
                addressmobile2: $('#addressmobile2').val(),
                addressline1: $('#addressline1').val(),
                addressline2: $('#addressline2').val(),
                addressstate: $("#addressstate option:selected").text(),
                addresscity: $('#addresscity').val(),
                addresspin: $('#addresspin').val(),
                position: $('#position').val()
            },
            success: (response) => {
                if (response.status === "added") {
                    location.href = '/profile'
                }
            }

        })
    })
    // showing hiding password
    $('#passwordeye').click(function () {
        $('#signinPassword').attr('type', $('#signinPassword').is(':password') ? 'text' : 'password');
        if ($('#signinPassword').attr('type') === 'password') {
            $('#passwordeye').removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $('#passwordeye').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
})
function cartDeleteProduct(cartId, proId) {
    $.ajax({
        url: '/api/deletecartproduct',
        method: 'POST',
        data: {
            cartId: cartId,
            proId: proId
        },
        success: (response) => {
            location.href = '/mycart'
        }
        // location.href = '/mycart'


    })
}
function addToCart(proId) {
    $.ajax({
        url: '/api/addtocart',
        method: 'POST',
        data: {
            id: proId
        },
        success: (response) => {
            if (response) {
                location.href = `/addedtocat?id=${proId}`
            }
        }

    })
}
function changeQuantity(cartId, proId, qty) {
    if (qty <= 0) {
        cartDeleteProduct(cartId, proId)
    } else {
        $.ajax({
            url: '/api/changeproductquantity',
            method: "POST",
            data: {
                cartId: cartId,
                proId: proId,
                qty: qty
            },
            success: (total) => {
                $('#cartTotallabel').text(`₹${total.total}`)

            }
        })

    }
}