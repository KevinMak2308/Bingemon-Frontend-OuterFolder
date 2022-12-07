/*
          $(".question-container").click(function() {
  console.log(this)
  $(".question-container").toggleClass("open")
})
 */
jQuery(document).ready(function(){
  jQuery("#navigation").load("header.html");
});

/*===============================================
  =          Q&A collapsing           =
  ===============================================*/
$('.question-container').click(function(){
  $(this).toggleClass('active');
  $(this).find('.answer-container').slideToggle(800);
});

const loginUrl = "http://localhost:8080/api/auth/signin";
const moviePosterUrl = new URL("http://localhost:8080/api/auth/movie-multi-filter")
const popularMoviePoster = document.getElementById("mostPopularMoviePoster")


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

  console.log("Login Request", postLoginRequest)

  fetch(loginUrl, postLoginRequest)
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      throw new Error("Login Failed!")
    })
    .then(userLoginCookie)
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

function userLoginCookie(data) {
  document.cookie = "User=" + data.jti
  window.location.reload()

}

function mostPopularMovie(data) {
    for (let i = 0; i < 1; i++) {
        var movies = data.results[i]
    }
    mostPopularMoviePoster(movies)
}

function mostPopularMoviePoster(movie) {
    const posterUrl = "https://image.tmdb.org/t/p/original/"
    const moviePosterUrl = movie.poster_path
    console.log(moviePosterUrl)
    popularMoviePoster.setAttribute('src', posterUrl + moviePosterUrl)
}

function fetchMovieForPopularMoviePoster() {
    return fetch(moviePosterUrl)
        .then(data => data.json())
        .then(mostPopularMovie)
}

fetchMovieForPopularMoviePoster()
