if (!document.cookie) {
    window.location.href = "frontpage.html"
}

$(".toggle-swipe").click(function () {
    $(".movie-swiper").show()
});

let cards = document.querySelectorAll('.movie-card');

function flipCard() {
    [...cards].forEach((card) => {
        card.classList.toggle('is-flipped');
    });
};

function cookieSplitter() {
    let userCookie = document.cookie;
    let cookiearray = userCookie.split(';');
    let key = "";
    let value = "";

    for (let i = 0; i < cookiearray.length; i++) {
        key = cookiearray[i].split('=')[0];
        value = cookiearray[i].split('=')[1];

        console.log("Cookie Key", key)
        console.log("Cookie Value", value)
    }
    console.log("What is in value? ", value)
    return value;
}

const basicUrl = "http://localhost:8080/"
const url = new URL(basicUrl + "api/auth/movie-multi-filter")
const mainMovieDiv = document.getElementById('mainMovieDiv')

//Placeholder for a Controller Method that will send a response to the frontend with all the movie genres
const genreUrl = basicUrl + "api/auth/genres/en"
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')

const languageURL = basicUrl + "api/auth/movie-language"
const languageSelect = document.getElementById('movieLanguageChoice')

const movieTrailerUrl = basicUrl + "api/auth/credits/"
let newURLParams = new URLSearchParams(url.search)

function fetchMovieGenres() {
    return fetch(genreUrl)
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
            const selectIndex = movieGenreDropDownSelect.selectedIndex;
            let optionIndex = movieGenreDropDownSelect.options[selectIndex]
            genres.id = optionIndex.value

            newURLParams.set('genres', optionIndex.value)
            url.search = newURLParams.toString()
            console.log(url.search);

        })
    }
}

function fetchMovieLanguage() {
    return fetch(languageURL)
        .then(data => data.json())
        .then(movieLanguageData)
}

function movieLanguageData(data) {

    for (let i = 0; i < data.length; i++) {
        let language = data[i]

        var languageOption = document.createElement('option')
        languageOption.innerText = language.english_name
        languageOption.setAttribute('value', language.iso_639_1)
        languageSelect.appendChild(languageOption)


    }
    languageSelect.addEventListener("change", (event) => {
        const selectIndex = languageSelect.selectedIndex;
        let optionIndex = languageSelect.options[selectIndex]
        languageOption.value = optionIndex.value

        newURLParams.set('language', optionIndex.value)
        url.search = newURLParams.toString()
        console.log(languageOption.value);

    })
}

document.getElementById('decadeDropDown').onchange = function () {
    let selected = [];
    for (let option of document.getElementById('decadeDropDown').options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }
    let decade = selected;
    newURLParams.set("decade", decade.toString());
    url.search = newURLParams.toString();
    console.log(url.href);
}

function fetchMoviesForSwipeList() {
    return fetch(url)
        .then(data => data.json())
        .then(movieDataBasedOnCriteria)
}

function movieDataBasedOnCriteria(data) {
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
        const movieTable = document.createElement('table');
        const movietextTable = document.createElement('tbody')
        movieTable.innerText = "Movie ID/Title: " + movies.id + "/" + movies.title;
        movietextTable.innerText = "Movie Description: " + movies.overview;
        mainMovieDiv.appendChild(movieTable);
        mainMovieDiv.appendChild(movietextTable);
    }

    initMovieSwiper(data.results)
    moviePageData(data.page)
}


// ### Used Async Function to fetch the swipe list before we render the first movie element - No longer skips the last movie element on each page ###
async function getSwipeListAndThenRenderMovie() {
    await fetchMoviesForSwipeList()
    renderNextMovie()
}

const movieTrailer = document.getElementById('movieTrailer');
const movieLike = document.getElementById('btnLike');
const movieDislike = document.getElementById('btnDislike');
const moviePoster = document.getElementById('moviePoster');
const movieButtonsLikeDislike = document.getElementById('movieCardBtnLikeDislike');

function initMovieSwiper(data) {
    mainMovieDiv.style.display = 'none';
    movieButtonsLikeDislike.style.display = 'block';
    movieList = data;
    console.log("What movie element: ", movieList);
}

function moviePageData(data) {
    pageNumbers = data;
    console.log("Page Numbers? ", pageNumbers);
}

let pageNumbers = 1;
let movieList;
let currentIndex = 0;

console.log("this is user id " + cookieSplitter())

const addMovieUrl = basicUrl + "api/auth/userMovieList/" + cookieSplitter()

async function addMovie(movieID) {
    console.log(movieID)
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


async function renderNextMovie(added) {
    movie = movieList[currentIndex]
    console.log("Movie element on currentIndex; ", movieList.length - 1)
    console.log("What is currentIndex right now? ", currentIndex)
    movieAdd = movieList[currentIndex - 1]
    if (added) await addMovie(movieAdd.id)
    console.log(added)

    function getMovieTrailerUrl() {
        return fetch(movieTrailerUrl + movie.id)
            .then(data => data.json())
            .then(function (data) {
                console.log("What comes out in movieTrailerURL? ", data.videos)

                for (let i = 0; i < data.videos.length; i++) {
                    let movieTrailerData = data.videos[data.videos.length - 1].key;
                    console.log("movieTrailerData", movieTrailerData)
                    movieTrailer.setAttribute('src', `https://www.youtube.com/embed/${movieTrailerData}`)

                }
                let moviePosterData = data.poster_path
                moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${moviePosterData}`)

                let movieOverviewData = document.getElementById('movieOverview')
                movieOverviewData.innerText = data.overview

            })
    }

    getMovieTrailerUrl()
    currentIndex++;

    if (currentIndex > movieList.length - 1) {
        currentIndex = 0
        console.log("Does currentIndex reset here? ", currentIndex)
        newURLParams.set('page', pageNumbers + 1)
        url.search = newURLParams.toString()
        fetchMoviesForSwipeList()
    }

}

fetchMovieLanguage()
fetchMovieGenres()

