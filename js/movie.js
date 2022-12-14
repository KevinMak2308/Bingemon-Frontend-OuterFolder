jQuery(document).ready(function () {
    jQuery("#navigation").load("header.html");
});

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
    }
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

const movieReviewUrl = basicUrl + "api/auth/reviews/"

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
}

function movieSortForSwipeList(data) {

    movieSort.addEventListener("change", (event) => {
        const selectIndex = movieSort.selectedIndex;
        let optionIndex = movieSort.options[selectIndex]

        newURLParams.set('sort_by', optionIndex.value)
        url.search = newURLParams.toString()
    })
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
const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieButtonsLikeDislike = document.getElementById('movieCardBtnLikeDislike');

function initMovieSwiper(data) {
    mainMovieDiv.style.display = 'none';
    movieButtonsLikeDislike.style.display = 'block';
    movieList = data;
}

function moviePageData(data) {
    pageNumbers = data;
}

let pageNumbers = 1;
let movieList;
let currentIndex = 0;


const addMovieUrl = basicUrl + "api/auth/userMovieList/" + cookieSplitter()

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
                movieTrailer.setAttribute("src", "");
                $("#movieTrailer").show()
                $(".trailer-div").remove();
                if (data.videos.length == 0) {
                    $("#movieTrailer").hide()
                    $(".movie-card-trailer").prepend("<div class='trailer-div'>" +
                        "<p class='trailer-not-found'> " + movie.title + "</p>" +
                        "<img class='trailer-unavailable' src='/img/trailer-not-found-image.jpg' alt='Default YouTube video unavailable image'></div>")
                } else {
                    let movieTrailerData = data.videos[data.videos.length - 1].key;
                    movieTrailer.setAttribute("src", "https://www.youtube.com/embed/" + movieTrailerData)
                }

                let moviePosterData = data.poster_path
                if (!moviePosterData) {
                    movieTitle.innerText = data.title;
                    moviePoster.setAttribute("src", "/img/default-poster.png")
                    moviePoster.classList.add("")
                    console.log(moviePoster, moviePosterData);
                } else {
                    moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${moviePosterData}`)
                }

                let movieOverviewData = document.getElementById('movieOverview')
                movieOverviewData.innerText = data.overview

                let movieCast = document.getElementById('movieCast')
                movieCast.innerText = ""

                if (data.credits.cast.length < 6) {
                    for (let i = 0; i < data.credits.cast.length; i++) {
                        let movieCastData = data.credits.cast[i].name;
                        if (i == 0) {
                            movieCast.innerText = movieCast.innerText + movieCastData
                        } else {
                            movieCast.innerText = movieCast.innerText + ", " + movieCastData
                        }
                    }
                } else {
                    for (let i = 0; i < 6; i++) {
                        let movieCastData = data.credits.cast[i].name;
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
                    movieRating.innerText = "N/A";
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
    currentIndex++;

    if (currentIndex > movieList.length - 1) {
        currentIndex = 0
        newURLParams.set('page', pageNumbers + 1)
        url.search = newURLParams.toString()
        fetchMoviesForSwipeList()
    }
}

fetchMovieLanguage()
fetchMovieGenres()
movieSortForSwipeList()

