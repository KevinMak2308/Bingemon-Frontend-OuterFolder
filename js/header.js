// import header fragment // virker ikke nu
$(".home-nav").click(function () {
  $(".sign-up-modal").hide()
  $(".login-modal").hide()
})

// open login modal
$(".login-btn").click(function () {
  $(".sign-up-modal").hide()
  $(".login-modal").toggle()
})

$(".close-login").click(function () {
  $(".login-modal").toggle()
})

//open signup modal
$(".sign-up-btn").click(function () {
  $(".login-modal").hide()
  $(".sign-up-modal").toggle()
})

$(".close-sign-up").click(function () {
  $(".sign-up-modal").toggle()
})
$(".close-sign-up").click(function () {
  $(".friends-modal").toggle()
})

//closes login modal and open sign up modal

$(".sign-up-redirect").click(function () {
  $(".login-modal").toggle()
  $(".sign-up-modal").toggle()
})

//closes sign up modal and open login modal

$(".login-redirect").click(function () {
  $(".login-modal").toggle()
  $(".sign-up-modal").toggle()
})

// close modal on click outside at anywhere
$(document).click(function(event) {
  if (!$(event.target).closest(".login-form, .login-btn").length) {
    $("body").find(".login-modal").hide();
  }
});

$(document).click(function(event) {
  if (!$(event.target).closest(".login-form, .sign-up-btn").length) {
    $("body").find(".sign-up-modal").hide();
  }
});

if(document.cookie) {
  $(".login-btn").hide()
  $(".sign-up-btn").hide()
  $(".swipelist-btn").show()
}
