jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html");
});
jQuery(document).ready(function(){
  jQuery("#footer").load("footer.html");
});

const userCookie = document.cookie.split(";").find((row) =>
    row.startsWith("User="))?.split("=")[1];

const basicUrl = "http://localhost:8080/api/auth/series/"
const url = new URL(basicUrl + "series-multi-filter")
const mainSeriesDiv = document.getElementById('mainSeriesDiv')
const discoverSeriesDiv = document.getElementById('discoverSeriesDiv')


//Placeholder for a Controller Method that will send a response to the frontend with all the series genres
const genreUrl = basicUrl + "genres"
const seriesGenreDropDownSelect = document.getElementById('genreDropDownList')

const languageSelect = document.getElementById('seriesLanguageChoice')

const seriesTrailerUrl = basicUrl + "credits/"
let newURLParams = new URLSearchParams(url.search)

const seriesReviewUrl = basicUrl + "reviews/"

function fetchSeriesGenres() {
    return fetch(genreUrl)
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

  seriesGenreDropDownSelect.addEventListener("change", async function(event) {
    const selectIndex = seriesGenreDropDownSelect.selectedIndex;
    let optionIndex = seriesGenreDropDownSelect.options[selectIndex]
    genres.id = optionIndex.value

    newURLParams.set('genres', optionIndex.value)
    url.search = newURLParams.toString()
    await fetchSeriesForSwipeList()
  })
}

function seriesLanguageData(data) {
    let language;
    for (let i = 0; i < data.length; i++) {
        language = data[i]

        var languageOption = document.createElement('option')
        languageOption.innerText = language.english_name
        languageOption.setAttribute('value', language.iso_639_1)
        languageSelect.appendChild(languageOption)
    }

    languageSelect.addEventListener("change", async function(event) {
        const selectIndex = languageSelect.selectedIndex;
        let optionIndex = languageSelect.options[selectIndex]
        languageOption.value = optionIndex.value

        newURLParams.set('language', optionIndex.value)
        url.search = newURLParams.toString()
        await fetchSeriesForSwipeList()
    })
}

function seriesSortForSwipeList(data) {

    seriesSort.addEventListener("change", async function(event) {
        const selectIndex = seriesSort.selectedIndex;
        let optionIndex = seriesSort.options[selectIndex]

        newURLParams.set('sort_by', optionIndex.value)
        url.search = newURLParams.toString()
        await fetchSeriesForSwipeList()
    })
}

function fetchSeriesForSwipeList() {
    return fetch(url)
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
    const series = data.results[i];
    const singleSerieDiv = document.createElement('div');
    const discoverSeriesATag = document.createElement("a");
    const discoverSeriesPoster = document.createElement("img");
    let discoverSeriesPosterData = series.poster_path;
    let discoverSeriesBackdropData = series.backdrop_path;
    if (!discoverSeriesPosterData || !discoverSeriesBackdropData) {

    } else {
      discoverSeriesPoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverSeriesPosterData}`)
      singleSerieDiv.classList.add("movie-container");
      discoverSeriesATag.append(discoverSeriesPoster);
      discoverSeriesATag.classList.add("discover-movie-a");
      discoverSeriesATag.href = "series-details.html";
      discoverSeriesDiv.append(singleSerieDiv);
      singleSerieDiv.append(discoverSeriesATag);

    }
    discoverSeriesATag.addEventListener("click", async function(event) {
      document.cookie = "Series = " + data.results[i].id;
      console.log("a tag clickity clicked", data.results[i].title);
    })
  }
}

const seriesPoster = document.getElementById('seriesPoster');
const seriesTitle = document.getElementById('seriesTitle');

const addSeriesUrl = basicUrl + "api/auth/series/user-series-list/" + userCookie;

async function addSeries(seriesID) {
    let postSeriesRequest = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: seriesID
    }

    return fetch(addSeriesUrl, postSeriesRequest)
        .then(response => response.json())
        .catch(error => console.log(error))
}

const searchUrl = basicUrl + "search/"

const searchSeries = document.getElementById("searchSeries")

async function fetchSeriesOnSearch(seriesTitle) {
    return fetch(searchUrl + seriesTitle)
        .then(data => data.json())
        .then(await discoverSeriesOnSearch)
}

function discoverSeriesOnSearch(data) {
    discoverSeriesDiv.innerText = ""
    console.log(data);
  for (let i = 0; i < data.results.length; i++) {
    const series = data.results[i];
    const singleSerieDiv = document.createElement('div');
    const discoverSeriesATag = document.createElement("a");
    const discoverSeriesPoster = document.createElement("img");
    let discoverSeriesPosterData = series.poster_path;
    let discoverSeriesBackdropData = series.backdrop_path;
    if (!discoverSeriesPosterData || !discoverSeriesBackdropData) {

    } else {
      discoverSeriesPoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverSeriesPosterData}`)
      singleSerieDiv.classList.add("movie-container");
      discoverSeriesATag.append(discoverSeriesPoster);
      discoverSeriesATag.classList.add("discover-movie-a");
      discoverSeriesATag.href = "series-details.html";
      discoverSeriesDiv.append(singleSerieDiv);
      singleSerieDiv.append(discoverSeriesATag);

    }
    discoverSeriesATag.addEventListener("click", async function(event) {
      document.cookie = "Series = " + data.results[i].id;
      console.log("a tag clickity clicked", data.results[i].title);
    })
  }

}

function searchListener() {
    searchSeries.addEventListener("input", (event) => {
        fetchSeriesOnSearch(searchSeries.value);
    });
}



fetchSeriesGenres()
seriesSortForSwipeList()
