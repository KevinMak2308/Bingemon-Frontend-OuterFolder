const movieCookie = document.cookie.split(";").find((row) =>
    row.startsWith(" Movie="))?.split("=")[1];

const url = "http://localhost:8080/api/auth/credits/";

const singleMovieUrl = url + movieCookie;

const movieBackdrop = document.getElementById('movieBackdrop')
const movieRating = document.getElementById('movieRating')
const movieRuntime = document.getElementById('movieRuntime')
const movieRelease = document.getElementById('movieRelease')
const movieOverview = document.getElementById('movieOverview')
const movieCast = document.getElementById('movieCast')

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

function movieDetails(data) {
    console.log(data);
    const movieBackdropData = data.backdrop_path
    movieBackdrop.setAttribute('src', `https://image.tmdb.org/t/p/original/${movieBackdropData}`)
    movieBackdrop.setAttribute('alt', `${data.title} backdrop`)
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
    console.log(movieCookie);
}

fetchSingleMovie();
