jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})
jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

const userCookie = document.cookie.split(";").find((row) =>
  row.startsWith("User="))?.split("=")[1]

$(".toggle-swipe").click(function () {
  $(".movie-swiper").show()
})

let cards = document.querySelectorAll('.movie-card')
function flipCard() {
  [...cards].forEach((card) => {
    card.classList.toggle('is-flipped')
  })
}

const baseUrl = "https://bingemon.azurewebsites.net/api"
const userUrl = "/user"
const movieUrl = "/movie"

const mainMovieUrl = new URL(baseUrl + movieUrl + "/movie-multi-filter")
let newURLParams = new URLSearchParams(mainMovieUrl.search)


const mainMovieDiv = document.getElementById('mainMovieDiv')
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')
const languageSelect = document.getElementById('movieLanguageChoice')
const movieTrailer = document.getElementById('movieTrailer');
const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieButtonsLikeDislike = document.getElementById('movieCardBtnLikeDislike');


const movieTrailerUrl = baseUrl + movieUrl + "/credits"
const movieReviewUrl = baseUrl + movieUrl + "/reviews"

function fetchMovieGenres() {
  return fetch(baseUrl + movieUrl + "/genres/en")
    .then(data => data.json())
    .then(movieGenreData)
}

function movieGenreData(data) {

  for (let i = 0; i < data.length; i++) {
    const genres = data[i]

    const genreOption = document.createElement('option')
    genreOption.innerText = genres.name
    genreOption.setAttribute('value', genres.id)
    movieGenreDropDownSelect.appendChild(genreOption)

    movieGenreDropDownSelect.addEventListener("change", (event) => {
      const selectIndex = movieGenreDropDownSelect.selectedIndex
      let optionIndex = movieGenreDropDownSelect.options[selectIndex]
      genres.id = optionIndex.value

      newURLParams.set('genres', optionIndex.value)
      mainMovieUrl.search = newURLParams.toString()
    })
  }
}

function fetchMovieLanguage() {
  return fetch(baseUrl + movieUrl + "/languages")
    .then(data => data.json())
    .then(movieLanguageData)
}

function movieLanguageData(data) {
let languageOption

  for (let i = 0; i < data.length; i++) {
    let language = data[i]

    languageOption = document.createElement('option')
    languageOption.innerText = language.english_name
    languageOption.setAttribute('value', language.iso_639_1)
    languageSelect.appendChild(languageOption)
  }

  languageSelect.addEventListener("change", (event) => {
    const selectIndex = languageSelect.selectedIndex
    let optionIndex = languageSelect.options[selectIndex]
    languageOption.value = optionIndex.value
    newURLParams.set('language', optionIndex.value)
    mainMovieUrl.search = newURLParams.toString()
  })
}

document.getElementById('decadeDropDown').onchange = function () {
  let selected = []
  for (let option of document.getElementById('decadeDropDown').options) {
    if (option.selected) {
      selected.push(option.value)
    }
  }
  let decade = selected
  newURLParams.set("decade", decade.toString())
  mainMovieUrl.search = newURLParams.toString()
}

function movieSortForSwipeList(data) {
  movieSort.addEventListener("change", (event) => {
    const selectIndex = movieSort.selectedIndex
    let optionIndex = movieSort.options[selectIndex]
    newURLParams.set('sort_by', optionIndex.value)
    mainMovieUrl.search = newURLParams.toString()
  })
}

function fetchMoviesForSwipeList() {
  return fetch(mainMovieUrl)
    .then(data => data.json())
    .then(movieDataBasedOnCriteria)
}

function movieDataBasedOnCriteria(data) {
  initMovieSwiper(data.results)
  moviePageData(data.page)
}

// ### Used Async Function to fetch the swipe list before we render the first movie element - No longer skips the last movie element on each page ###
async function getSwipeListAndThenRenderMovie() {
  await fetchMoviesForSwipeList()
  renderNextMovie()
}

function initMovieSwiper(data) {
  mainMovieDiv.style.display = 'none'
  movieButtonsLikeDislike.style.display = 'block'
  movieList = data
}

function moviePageData(data) {
  pageNumbers = data
}

async function addMovie(movieId) {
  let postMovieRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: movieId
  }

  return fetch(baseUrl + userUrl + "/movielist/" + userCookie, postMovieRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
}

let pageNumbers = 1
let movieList
let currentIndex = 0
async function renderNextMovie(added) {
  movie = movieList[currentIndex]

  if (added && currentIndex == 0) {
    movieAdd = movieList[currentIndex]
    await addMovie(movieAdd.id)
  } else if (added) {
    movieAdd = movieList[currentIndex - 1]
    await addMovie(movieAdd.id)
  }

  function getMovieTrailerUrl() {
    return fetch(movieTrailerUrl + movie.id)
      .then(data => data.json())
      .then(function (data) {
        movieTrailer.setAttribute("src", "")
        $("#movieTrailer").show()
        $(".trailer-div").remove()
        if (data.videos.length == 0) {
          $("#movieTrailer").hide()
          $(".movie-card-trailer").prepend("<div class='trailer-div'>" +
            "<p class='trailer-not-found'> " + movie.title + "</p>" +
            "<img class='trailer-unavailable' src='/img/trailer-not-found-image.jpg' alt='Default YouTube video unavailable image'></div>")
        } else {
          let movieTrailerData = data.videos[data.videos.length - 1].key
          movieTrailer.setAttribute("src", "https://www.youtube.com/embed/" + movieTrailerData)
        }

        let moviePosterData = data.poster_path
        if (!moviePosterData) {
          movieTitle.innerText = data.title
          moviePoster.setAttribute("src", "/img/default-poster.png")
          moviePoster.classList.add("")
          console.log(moviePoster, moviePosterData)
        } else {
          moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${moviePosterData}`)
        }

        let movieOverviewData = document.getElementById('movieOverview')
        movieOverviewData.innerText = data.overview

        let movieCast = document.getElementById('movieCast')
        movieCast.innerText = ""

        if (data.credits.cast.length < 6) {
          for (let i = 0; i < data.credits.cast.length; i++) {
            let movieCastData = data.credits.cast[i].name
            if (i == 0) {
              movieCast.innerText = movieCast.innerText + movieCastData
            } else {
              movieCast.innerText = movieCast.innerText + ", " + movieCastData
            }
          }
        } else {
          for (let i = 0; i < 6; i++) {
            let movieCastData = data.credits.cast[i].name
            if (i == 0) {
              movieCast.innerText = movieCast.innerText + movieCastData
            } else {
              movieCast.innerText = movieCast.innerText + ", " + movieCastData
            }
          }
        }
      })
  }

  function getMovieReview() {
    return fetch(movieReviewUrl + movie.id)
      .then(data => data.json())
      .then(function (data) {
        let movieRating = document.getElementById('movieRating')
        if (!data.vote_average) {
          movieRating.innerText = "N/A"
        } else {
          movieRating.innerText = data.vote_average.toFixed(1)
        }

        let movieRuntime = document.getElementById('movieRuntime')
        if (!data.runtime) {
          movieRuntime.innerText = "N/A"
        } else {
          movieRuntime.innerText = data.runtime + " min."
        }

        let movieReleaseYear = document.getElementById('movieRelease')
        if (!data.primary_release_date) {
          movieReleaseYear.innerText = "N/A"
        } else {
          movieReleaseYear.innerText = new Date(data.primary_release_date).getFullYear()
        }
      })
  }

  getMovieReview()
  getMovieTrailerUrl()
  currentIndex++

  if (currentIndex > movieList.length - 1) {
    currentIndex = 0
    newURLParams.set('page', pageNumbers + 1)
    mainMovieUrl.search = newURLParams.toString()
    fetchMoviesForSwipeList()
  }
}

fetchMovieLanguage()
fetchMovieGenres()
movieSortForSwipeList()

