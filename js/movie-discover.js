jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})
jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

const baseUrl = "https://bingemon.azurewebsites.net/api"
const movieUrl = "/movie"
const mainMovieUrl = new URL(baseUrl + movieUrl + "/movie-multi-filter")
let newURLParams = new URLSearchParams(mainMovieUrl.search)

const searchMovies = document.getElementById("searchMovies")
const discoverMovieDiv = document.getElementById('discoverMovieDiv')
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')
const languageSelect = document.getElementById('movieLanguageChoice')

function fetchMovieGenres() {
  return fetch(baseUrl + movieUrl + "/genres/en")
    .then(data => data.json())
    .then(movieGenreData)
}

function movieGenreData(data) {
  let genres

  for (let i = 0; i < data.length; i++) {
    genres = data[i]

    const genreOption = document.createElement('option')
    genreOption.innerText = genres.name
    genreOption.setAttribute('value', genres.id)
    movieGenreDropDownSelect.appendChild(genreOption)
  }

  movieGenreDropDownSelect.addEventListener("change", async function (event) {
    const selectIndex = movieGenreDropDownSelect.selectedIndex
    let optionIndex = movieGenreDropDownSelect.options[selectIndex]
    genres.id = optionIndex.value

    newURLParams.set('genres', optionIndex.value)
    mainMovieUrl.search = newURLParams.toString()
    await fetchMoviesForSwipeList()
  })
}

function fetchMovieLanguage() {
  return fetch(baseUrl + movieUrl + "/languages")
    .then(data => data.json())
    .then(movieLanguageData)
}

function movieLanguageData(data) {
  let languageOption;

  for (let i = 0; i < data.length; i++) {
    let language = data[i]

    languageOption = document.createElement('option')
    languageOption.innerText = language.english_name
    languageOption.setAttribute('value', language.iso_639_1)
    languageSelect.appendChild(languageOption)
  }

  languageSelect.addEventListener("change", async function (event) {
    const selectIndex = languageSelect.selectedIndex
    let optionIndex = languageSelect.options[selectIndex]
    languageOption.value = optionIndex.value
    newURLParams.set('language', optionIndex.value)
    mainMovieUrl.search = newURLParams.toString()
    await fetchMoviesForSwipeList()
  })
}

document.getElementById('decadeDropDown').onchange = async function (event) {
  let selected = [];
  for (let option of document.getElementById('decadeDropDown').options) {
    if (option.selected) {
      selected.push(option.value)
    }
  }
  let decade = selected
  newURLParams.set("decade", decade.toString())
  mainMovieUrl.search = newURLParams.toString()
  await fetchMoviesForSwipeList()
}

function movieSortForSwipeList(data) {

  movieSort.addEventListener("change", async function (event) {
    const selectIndex = movieSort.selectedIndex
    let optionIndex = movieSort.options[selectIndex]

    newURLParams.set('sort_by', optionIndex.value)
    mainMovieUrl.search = newURLParams.toString()
    await fetchMoviesForSwipeList()
  })
}

function fetchMoviesForSwipeList() {
  return fetch(mainMovieUrl)
    .then(data => data.json())
    .then(movieDataBasedOnCriteria)
}

function movieDataBasedOnCriteria(data) {
  discoverMovieDiv.innerText = ""

  // ### Scroll Function with Auto-Fetch. Can be used for Show All Movies Page ###
  /*let pageNumbers = data.page
  window.onscroll = function(event) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  alert("you're at the bottom of the page");
  newURLParams.set('page', pageNumbers+1)
  url.search = newURLParams.toString()
}
}*/
  for (let i = 0; i < data.results.length; i++) {
    const movies = data.results[i]
    const singleMovieDiv = document.createElement('div')
    const discoverMovieATag = document.createElement("a")
    const discoverMoviePoster = document.createElement("img")
    let discoverMoviePosterData = movies.poster_path

    if (!discoverMoviePosterData) {

    } else {
      discoverMoviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverMoviePosterData}`)
      singleMovieDiv.classList.add("movie-container")
      discoverMovieATag.append(discoverMoviePoster)
      discoverMovieATag.classList.add("discover-movie-a")
      discoverMovieATag.href = "movie-details.html"
      singleMovieDiv.append(discoverMovieATag)
      discoverMovieDiv.append(singleMovieDiv)
    }

    discoverMovieATag.addEventListener("click", async function (event) {
      document.cookie = "Movie = " + data.results[i].id
    })
  }
}

async function fetchMoviesOnSearch(movieTitle) {
  return fetch(baseUrl + movieUrl + `/search/${movieTitle}` )
    .then(data => data.json())
    .then(await discoverMoviesOnSearch)
}

function discoverMoviesOnSearch(data) {
  discoverMovieDiv.innerText = ""

  for (let i = 0; i < data.results.length; i++) {
    let movies = data.results[i]
    const singleMovieDiv = document.createElement('div')
    const discoverMovieATag = document.createElement("a")
    const discoverMoviePoster = document.createElement("img")
    let discoverMoviePosterData = movies.poster_path

    if (!discoverMoviePosterData) {

    } else {
      discoverMoviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverMoviePosterData}`)
      singleMovieDiv.classList.add("movie-container")
      discoverMovieATag.append(discoverMoviePoster)
      discoverMovieATag.classList.add("discover-movie-a")
      discoverMovieATag.href = "movie-details.html"
      singleMovieDiv.append(discoverMovieATag)
      discoverMovieDiv.append(singleMovieDiv)
    }

    discoverMovieATag.addEventListener("click", async function (event) {
      document.cookie = "Movie = " + data.results[i].id
    })
  }
}

function searchListener() {
  searchMovies.addEventListener("input", (event) => {
    fetchMoviesOnSearch(searchMovies.value)
  })
}


fetchMovieLanguage()
fetchMovieGenres()
movieSortForSwipeList()
