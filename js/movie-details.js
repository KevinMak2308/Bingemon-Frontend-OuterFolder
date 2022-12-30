jQuery(document).ready(function () {
    jQuery("#navigation").load("header.html");
});
jQuery(document).ready(function () {
    jQuery("#footer").load("footer.html");
});
const movieCookie = document.cookie.split(";").find((row) =>
    row.startsWith(" Movie="))?.split("=")[1];

const userCookie = document.cookie.split(";").find((row) =>
    row.startsWith("User="))?.split("=")[1];

const url = "http://localhost:8080/api/auth/credits/";

const singleMovieUrl = url + movieCookie;

const deleteMovieFromUserMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${userCookie}`
const userMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${userCookie}`

const movieWatchProvidersURL = `http://localhost:8080/api/auth/watch-providers/${movieCookie}`

const imageUrl = "https://image.tmdb.org/t/p/original"

const movieBackdrop = document.getElementById('movieBackdrop')
const movieTitle = document.getElementById('movieTitle')
const movieRating = document.getElementById('movieRating')
const movieOverview = document.getElementById('movieOverview')
const movieCast = document.getElementById('movieCast')
const watchProviders = document.getElementById('watchProviders')

function fetchSingleMovie() {
    fetch(singleMovieUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else
                throw new Error("unable to find movie id")
        })
        .then(movieDetails)
}

function fetchMovieWatchProviders() {
    fetch(movieWatchProvidersURL)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else
                throw new Error("unable to find watch provider on movie id")
        })
        .then(movieWatchProviders)
}

function movieDetails(data) {
    const movieBackdropData = data.backdrop_path
    movieBackdrop.setAttribute('src', `https://image.tmdb.org/t/p/original/${movieBackdropData}`)
    movieBackdrop.setAttribute('alt', `${data.title} backdrop`)

    if (!data.title) {
        movieTitle.innerText = "N/A";
    } else {
        movieTitle.innerText = data.title
    }

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
    if (!data.release_date) {
        movieReleaseYear.innerText = "N/A"
    } else {
        movieReleaseYear.innerText = new Date(data.release_date).getFullYear()
    }
    movieOverview.innerText = data.overview
    if (data.credits.cast.length < 6) {
        for (let i = 0; i < data.credits.cast.length; i++) {
            let movieCastData = data.credits.cast[i].name;
            if (i == 0) {
                movieCast.innerText = movieCast.innerText + movieCastData
            } else if (i === data.credits.cast.length - 1) {
                movieCast.innerText = movieCast.innerText + " & " + movieCastData
            }  else {
                movieCast.innerText = movieCast.innerText + ", " + movieCastData
            }
        }
    } else {
        for (let i = 0; i < 6; i++) {
            let movieCastData = data.credits.cast[i].name;
            if (i === 0) {
                movieCast.innerText = movieCast.innerText + movieCastData
            } else if (i === 5) {
                movieCast.innerText = movieCast.innerText + " & " + movieCastData
            } else {
                movieCast.innerText = movieCast.innerText + ", " + movieCastData
            }
        }
    }
}

function movieWatchProviders(data) {
    const movieWatchProvidersData = data.results.DK.flatrate
    if (!movieWatchProvidersData) {

    } else if (movieWatchProvidersData.length > 1) {
        for (let i = 0; i < movieWatchProvidersData.length; i++) {
            const providerImage = document.createElement("img")
            const providerImagePathURL = imageUrl + movieWatchProvidersData[i].logo_path
            providerImage.src = providerImagePathURL
            watchProviders.append(providerImage)
        }
    } else {
        const providerImage = document.createElement("img")
        providerImage.src = imageUrl + movieWatchProvidersData[0].logo_path
        watchProviders.append(providerImage)
    }
}

const addMovieUrl = "http://localhost:8080/api/auth/userMovieList/" + userCookie;

async function addMovieToUserMovieList() {
    let postMovieRequest = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: movieCookie
    }

    return fetch(addMovieUrl, postMovieRequest)
        .then(response => response.json())
        .then(window.location.reload())
        .catch(error => console.log(error))
}


function deleteMovieFromUserMovieList() {
    let deleteMovieFromUserMovieListRequest = {
        method: "DELETE",
        headers: {
            "content-type": "application/json"
        },
        body: movieCookie
    }

    fetch(deleteMovieFromUserMovieListUrl, deleteMovieFromUserMovieListRequest)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else
                throw new Error("Unable to delete movie from User List")
        })
        .then(window.location.reload())
}

function fetchUserMoviesId() {
    fetch(userMovieListUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Failed to fetch user movies id list")
        })
        .then(userMoviesIdData)
        .catch(error => console.log(error));
}

function userMoviesIdData(data) {
    let userMoviesId = data;

    if (userMoviesId.includes(Number(movieCookie))) {
        $(".movie-card-button").append("<button class='delete-movie-from-userlist' type='button'> ✔ </button>")
        $(".delete-movie-from-userlist").click(deleteMovieFromUserMovieList)
    } else {
        $(".movie-card-button").append("<button class='add-movie-from-userlist' type='button'> + </button>")
        $(".add-movie-from-userlist").click(addMovieToUserMovieList)
    }
}


fetchUserMoviesId();
fetchSingleMovie();
fetchMovieWatchProviders();
