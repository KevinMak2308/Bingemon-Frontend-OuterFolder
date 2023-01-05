jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})

jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

const baseUrl = "https://bingemon.azurewebsites.net/api"
const movieUrl = "/movie"
const seriesUrl = "/series"
const mainSeriesUrl = new URL(baseUrl + seriesUrl + "/series-multi-filter")
let newURLParams = new URLSearchParams(mainSeriesUrl.search)

const discoverSeriesDiv = document.getElementById('discoverSeriesDiv')
const seriesGenreDropDownSelect = document.getElementById('genreDropDownList')
const languageSelect = document.getElementById('seriesLanguageChoice')
const searchSeries = document.getElementById("searchSeries")

function fetchSeriesGenres() {
  return fetch(baseUrl + seriesUrl + "/genres")
    .then(response => response.json())
    .then(seriesGenreData)
}

function seriesGenreData(data) {
  let genres;

  for (let i = 0; i < data.genres.length; i++) {
    genres = data.genres[i]

    const genreOption = document.createElement('option')
    genreOption.innerText = genres.name
    genreOption.setAttribute('value', genres.id)
    seriesGenreDropDownSelect.appendChild(genreOption)
  }

  seriesGenreDropDownSelect.addEventListener("change", async function (event) {
    const selectIndex = seriesGenreDropDownSelect.selectedIndex
    let optionIndex = seriesGenreDropDownSelect.options[selectIndex]
    genres.id = optionIndex.value
    newURLParams.set('genres', optionIndex.value)
    mainSeriesUrl.search = newURLParams.toString()
    await fetchSeriesForSwipeList()
  })
}

function fetchSeriesLanguage() {
  return fetch(baseUrl + movieUrl + "/languages")
    .then(data => data.json())
    .then(seriesLanguageData)
}

function seriesLanguageData(data) {
  let languageOption
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
    mainSeriesUrl.search = newURLParams.toString()
    await fetchSeriesForSwipeList()
  })
}

function seriesSortForSwipeList(data) {

  seriesSort.addEventListener("change", async function (event) {
    const selectIndex = seriesSort.selectedIndex;
    let optionIndex = seriesSort.options[selectIndex]

    newURLParams.set('sort_by', optionIndex.value)
    mainSeriesUrl.search = newURLParams.toString()
    await fetchSeriesForSwipeList()
  })
}

function fetchSeriesForSwipeList() {
  return fetch(mainSeriesUrl)
    .then(data => data.json())
    .then(seriesDataBasedOnCriteria)
}

function seriesDataBasedOnCriteria(data) {
  discoverSeriesDiv.innerText = "";

  // ### Scroll Function with Auto-Fetch. Can be used for Show All Series Page ###
  /*let pageNumbers = data.page
  window.onscroll = function(event) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  alert("you're at the bottom of the page");
  newURLParams.set('page', pageNumbers+1)
  url.search = newURLParams.toString()
}
}*/

  for (let i = 0; i < data.results.length; i++) {
    const series = data.results[i]
    const singleSerieDiv = document.createElement('div')
    const discoverSeriesATag = document.createElement("a")
    const discoverSeriesPoster = document.createElement("img")
    let discoverSeriesPosterData = series.poster_path
    let discoverSeriesBackdropData = series.backdrop_path
    if (!discoverSeriesPosterData || !discoverSeriesBackdropData) {

    } else {
      discoverSeriesPoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverSeriesPosterData}`)
      singleSerieDiv.classList.add("movie-container")
      discoverSeriesATag.append(discoverSeriesPoster)
      discoverSeriesATag.classList.add("discover-movie-a")
      discoverSeriesATag.href = "series-details.html"
      discoverSeriesDiv.append(singleSerieDiv)
      singleSerieDiv.append(discoverSeriesATag)
    }

    discoverSeriesATag.addEventListener("click", async function (event) {
      document.cookie = "Series = " + data.results[i].id
    })
  }
}

async function fetchSeriesOnSearch(seriesTitle) {
  return fetch(baseUrl + seriesUrl + `/search/${seriesTitle}`)
    .then(data => data.json())
    .then(await discoverSeriesOnSearch)
}

function discoverSeriesOnSearch(data) {
  discoverSeriesDiv.innerText = ""

  for (let i = 0; i < data.results.length; i++) {
    const series = data.results[i]
    const singleSerieDiv = document.createElement('div')
    const discoverSeriesATag = document.createElement("a")
    const discoverSeriesPoster = document.createElement("img")
    let discoverSeriesPosterData = series.poster_path
    let discoverSeriesBackdropData = series.backdrop_path

    if (!discoverSeriesPosterData || !discoverSeriesBackdropData) {

    } else {
      discoverSeriesPoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverSeriesPosterData}`)
      singleSerieDiv.classList.add("movie-container")
      discoverSeriesATag.append(discoverSeriesPoster)
      discoverSeriesATag.classList.add("discover-movie-a")
      discoverSeriesATag.href = "series-details.html"
      discoverSeriesDiv.append(singleSerieDiv)
      singleSerieDiv.append(discoverSeriesATag)
    }

    discoverSeriesATag.addEventListener("click", async function (event) {
      document.cookie = "Series = " + data.results[i].id
    })
  }
}

function searchListener() {
  searchSeries.addEventListener("input", (event) => {
    fetchSeriesOnSearch(searchSeries.value)
  })
}

fetchSeriesGenres()
fetchSeriesLanguage()
seriesSortForSwipeList()
