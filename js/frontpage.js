/*
          $(".question-container").click(function() {
  console.log(this)
  $(".question-container").toggleClass("open")
})       
 */

/*===============================================
  =          Q&A collapsing           =
  ===============================================*/
$('.question-container').click(function(){
  $(this).toggleClass('active');
  $(this).find('.answer-container').slideToggle(800);
});

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
