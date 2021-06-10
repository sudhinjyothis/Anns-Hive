var warntext1 = false
var warntext2 = false
var warntext3 = false
function viewImage(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgView").src = URL.createObjectURL(event.target.files[0])
        document.getElementById("imgwarningtext").classList.remove("imgwarningtext-show")
        if (warntext2 == false & warntext3 == false) {
            warntext1 = false
            document.getElementById("imgwarningbtn").classList.remove("disabled")
        }
    } else {
        warntext1 = true
        document.getElementById("imgwarningtext").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}
function viewImage1(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgView1").src = URL.createObjectURL(event.target.files[0])
        document.getElementById("imgwarningtext1").classList.remove("imgwarningtext-show")
        if (warntext1 == false & warntext3 == false) {
            warntext2 = false
            document.getElementById("imgwarningbtn").classList.remove("disabled")
        }
    } else {
        warntext2 = true
        document.getElementById("imgwarningtext1").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}
function viewImage2(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgView2").src = URL.createObjectURL(event.target.files[0])
        document.getElementById("imgwarningtext2").classList.remove("imgwarningtext-show")
        if (warntext1 == false & warntext3 == false) {
            warntext3 = false
            document.getElementById("imgwarningbtn").classList.remove("disabled")
        }

    } else {
        warntext3 = true
        document.getElementById("imgwarningtext2").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}
$(function () {
    $('#productTable').DataTable();
})
$(function () {
    $('#orderTable').DataTable();
})
function mailMessage() {
    document.getElementById('mailMessage').classList.toggle('showMailMessage')
}
function mailMessage1() {
    document.getElementById('mailMessage1').classList.toggle('showMailMessage')
}
