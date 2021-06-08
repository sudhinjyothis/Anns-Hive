function viewImage(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgwarningtext").classList.remove("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.remove("disabled")
        document.getElementById("imgView").src = URL.createObjectURL(event.target.files[0])

    } else {
        document.getElementById("imgwarningtext").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}
function viewImage1(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgwarningtext1").classList.remove("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.remove("disabled")
        document.getElementById("imgView1").src = URL.createObjectURL(event.target.files[0])
    } else {
        document.getElementById("imgwarningtext1").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}
function viewImage2(event) {
    if (event.target.files[0].type === "image/jpeg") {
        document.getElementById("imgwarningtext2").classList.remove("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.remove("disabled")
        document.getElementById("imgView2").src = URL.createObjectURL(event.target.files[0])

    } else {
        document.getElementById("imgwarningtext2").classList.add("imgwarningtext-show")
        document.getElementById("imgwarningbtn").classList.add("disabled")
    }
}