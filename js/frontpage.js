$(".login-btn").click(function () {
  $(".login-modal").toggle()
})

const userUrl = "http://localhost:8080/api/auth/signin";

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

  return fetch(userUrl, postLoginRequest)
    .then(response => response.json())
    .then(cookieMonster)
    .catch(error => console.log(error));

}

function cookieMonster(data) {
  document.cookie = "User=" + data.jti
  console.log(data)
}
