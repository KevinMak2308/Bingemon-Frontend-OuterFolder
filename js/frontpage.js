// import header fragment // virker ikke nu
$(function() {
  $("#navigation").load("header.html");
});

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

const loginUrl = "http://localhost:8080/api/auth/signin";

function login() {
  let username = document.getElementById("login-input-username").value;
  let password = document.getElementById("login-input-password").value;

  let postLoginRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      "username": username,
      "password": password,
    })
  }

  console.log("im mister meseeks", postLoginRequest)

  return fetch(loginUrl, postLoginRequest)
    .then(response => response.json())
    .then(cookieMonster)
    .catch(error => console.log(error));
}

const signUpUrl = "http://localhost:8080/api/auth/signup";
function signUp() {
  let username = document.getElementById("sign-up-input-username").value;
  let password = document.getElementById("sign-up-input-password").value;

  let postSignUpRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      "username": username,
      "password": password,
    })
  }

  console.log("im mister meseeks", postSignUpRequest)

  return fetch(signUpUrl, postSignUpRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
}


function cookieMonster(data) {
  document.cookie = "User=" + data.jti
  window.location.href = "movie.html";
}

function redirect(){

}
