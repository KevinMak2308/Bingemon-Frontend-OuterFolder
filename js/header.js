const userCookieChecker = document.cookie.split(";").find((row) =>
  row.startsWith("User="))?.split("=")[1];

if (!userCookieChecker && !window.location.href === "frontpage.html") {
  window.location.href = "frontpage.html";
}

if (userCookieChecker) {
  $(".login-btn").hide()
  $(".sign-up-btn").hide()
  $(".logout-btn").show()
  $(".swipelist-btn").show()
  $(".profile-btn").show()
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++)
    deleteCookie(cookies[i].split("=")[0]);
}

function setCookie(name, value, expirydays) {
  var d = new Date();
  d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}

$(".logout-btn").click(function () {
  deleteCookie(document.cookie)
  deleteAllCookies()
})

// import header fragment // virker ikke nu
$(".home-nav").click(function () {
  $(".sign-up-modal").hide()
  $(".login-modal").hide()
})

// open login modal
  $(".header-right .login-btn").click(function () {
    $(".sign-up-modal").hide()
    $(".login-modal").toggle()
  })




$(".close-login").click(function () {
  $(".login-modal").toggle()
})

//open signup modal
$(".header-right .sign-up-btn").click(function () {
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
$(document).click(function (event) {
  if (!$(event.target).closest(".login-form, .login-btn").length) {
    $("body").find(".login-modal").hide();
  }
});

$(document).click(function (event) {
  if (!$(event.target).closest(".login-form, .sign-up-btn").length) {
    $("body").find(".sign-up-modal").hide();
  }
});


