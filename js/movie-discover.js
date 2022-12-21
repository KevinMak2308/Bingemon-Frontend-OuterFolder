jQuery(document).ready(function () {
    jQuery("#navigation").load("header.html");
});

const userCookie = document.cookie.split(";").find((row) =>
    row.startsWith("User="))?.split("=")[1];

const basicUrl = "http://localhost:8080/"
const url = new URL(basicUrl + "api/auth/movie-multi-filter")
const mainMovieDiv = document.getElementById('mainMovieDiv')
const discoverMovieDiv = document.getElementById('discoverMovieDiv')


//Placeholder for a Controller Method that will send a response to the frontend with all the movie genres
const genreUrl = basicUrl + "api/auth/genres/en"
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')

const languageURL = basicUrl + "api/auth/movie-language"
const languageSelect = document.getElementById('movieLanguageChoice')

const movieTrailerUrl = basicUrl + "api/auth/credits/"
let newURLParams = new URLSearchParams(url.search)

const movieReviewUrl = basicUrl + "api/auth/reviews/"

function fetchMovieGenres() {
    return fetch(genreUrl)
        .then(data => data.json())
        .then(movieGenreData)
}

function movieGenreData(data) {
    let genres;

    for (let i = 0; i < data.length; i++) {
        genres = data[i]

        const genreOption = document.createElement('option')
        genreOption.innerText = genres.name
        genreOption.setAttribute('value', genres.id)
        movieGenreDropDownSelect.appendChild(genreOption)
    }

    movieGenreDropDownSelect.addEventListener("change", async function(event) {
        const selectIndex = movieGenreDropDownSelect.selectedIndex;
        let optionIndex = movieGenreDropDownSelect.options[selectIndex]
        genres.id = optionIndex.value

        newURLParams.set('genres', optionIndex.value)
        url.search = newURLParams.toString()
        await fetchMoviesForSwipeList()
    })
}

function fetchMovieLanguage() {
    return fetch(languageURL)
        .then(data => data.json())
        .then(movieLanguageData)
}

function movieLanguageData(data) {
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
        await fetchMoviesForSwipeList()
    })
}

document.getElementById('decadeDropDown').onchange = async function(event) {
    let selected = [];
    for (let option of document.getElementById('decadeDropDown').options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }
    let decade = selected;
    newURLParams.set("decade", decade.toString());
    url.search = newURLParams.toString();
    await fetchMoviesForSwipeList()
}

function movieSortForSwipeList(data) {

    movieSort.addEventListener("change", async function(event) {
        const selectIndex = movieSort.selectedIndex;
        let optionIndex = movieSort.options[selectIndex]

        newURLParams.set('sort_by', optionIndex.value)
        url.search = newURLParams.toString()
        await fetchMoviesForSwipeList()
    })
}

function fetchMoviesForSwipeList() {
    return fetch(url)
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
    const movies = data.results[i];
    const singleMovieDiv = document.createElement('div');
    const discoverMovieATag = document.createElement("a");
    const discoverMoviePoster = document.createElement("img");
    let discoverMoviePosterData = movies.poster_path;
    if (!discoverMoviePosterData) {

    } else {
      discoverMoviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverMoviePosterData}`)
      singleMovieDiv.classList.add("movie-container");
      discoverMovieATag.append(discoverMoviePoster);
      discoverMovieATag.classList.add("discover-movie-a");
      discoverMovieATag.href = "movie-details.html";
      singleMovieDiv.append(discoverMovieATag);
      discoverMovieDiv.append(singleMovieDiv);
    }
    discoverMovieATag.addEventListener("click", async function(event) {
      document.cookie = "Movie = " + data.results[i].id;
      console.log("a tag clickity clicked", data.results[i].title);
    })
  }
}

const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');

const addMovieUrl = basicUrl + "api/auth/userMovieList/" + userCookie;

async function addMovie(movieID) {
    let postMovieRequest = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: movieID
    }

    return fetch(addMovieUrl, postMovieRequest)
        .then(response => response.json())
        .catch(error => console.log(error))
}

const searchUrl = basicUrl + "api/auth/search/"

const searchMovies = document.getElementById("searchMovies")

async function fetchMoviesOnSearch(movieTitle) {
    return fetch(searchUrl + movieTitle)
        .then(data => data.json())
        .then(await discoverMoviesOnSearch)
}

function discoverMoviesOnSearch(data) {
    discoverMovieDiv.innerText = ""
    console.log(data);
    for (let i = 0; i < data.results.length; i++) {
        const movies = data.results[i];
        const discoverMovieATag = document.createElement("a");
        const discoverMoviePoster = document.createElement("img");
        let discoverMoviePosterData = movies.poster_path;
        if (!discoverMoviePosterData) {

        } else {
            discoverMoviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${discoverMoviePosterData}`)
            discoverMovieATag.append(discoverMoviePoster);
            discoverMovieATag.classList.add("discover-movie-a");
            discoverMovieATag.href = "movie-details.html";
            discoverMovieDiv.append(discoverMovieATag);
        }
        discoverMovieATag.addEventListener("click", async function(event) {
            document.cookie = "Movie = " + data.results[i].id;
            console.log("a tag clickity clicked", data.results[i].title);
        })
    }

}

function searchListener() {
    searchMovies.addEventListener("input", (event) => {
        fetchMoviesOnSearch(searchMovies.value);
    });
}



fetchMovieLanguage()
fetchMovieGenres()
movieSortForSwipeList()
