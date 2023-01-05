/*
          $(".question-container").click(function() {
  console.log(this)
  $(".question-container").toggleClass("open")
})
 */
jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})

jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

/*===============================================
  =          Q&A collapsing           =
  ===============================================*/
$('.question-container').click(function () {
  $(this).toggleClass('active')
  $(this).find('.answer-container').slideToggle(800)
})

const baseUrl = "https://bingemon.azurewebsites.net/api"
const movieUrl = "/movie"

const popularMoviePoster = document.getElementById("mostPopularMoviePoster")

function login() {
  let username = document.getElementById("login-input-username").value
  let password = document.getElementById("login-input-password").value

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

  fetch(baseUrl + "/auth/signin", postLoginRequest)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Login failed!")
    })
    .then(userLoginCookie)
    .catch(error => console.log(error))
}

function signUp() {
  let username = document.getElementById("sign-up-input-username").value
  let password = document.getElementById("sign-up-input-password").value

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

  return fetch(baseUrl + "/auth/signup", postSignUpRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
}

function userLoginCookie(data) {
  document.cookie = "User=" + data.jti
  window.location.reload()
}

function mostPopularMovie(data) {
  let movies;
  for (let i = 0; i < 1; i++) {
    movies = data.results[i]
  }
  mostPopularMoviePoster(movies)
}

function mostPopularMoviePoster(movie) {
  const posterUrl = "https://image.tmdb.org/t/p/original/"
  const moviePosterUrl = movie.poster_path
  popularMoviePoster.setAttribute('src', posterUrl + moviePosterUrl)
}

function fetchMovieForPopularMoviePoster() {
  return fetch(baseUrl + movieUrl + "/movie-multi-filter")
    .then(data => data.json())
    .then(mostPopularMovie)
}

fetchMovieForPopularMoviePoster()
