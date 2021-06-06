// move top
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("movetop").style.display = "block";
    } else {
        document.getElementById("movetop").style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
// /move top
// disable body scroll which navbar is in active and remove sign navs
$(function () {
    $('.navbar-toggler').click(function () {
        $('body').toggleClass('noscroll');
        $('.userbtns').toggleClass('userbtnshide');
    })
});
// disable body scroll which navbar is in active and remove sign navs
//search-bar
$(document).ready(function () {
    $('.popup-with-zoom-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    });

});
//search-bar
// cart-js 
transmitv.render();
transmitv.cart.on('transmitv_checkout', function (evt) {
    var items, len, i;
    if (this.subtotal() > 0) {
        items = this.items();
        for (i = 0, len = items.length; i < len; i++) { }
    }
});
//cart-js -->