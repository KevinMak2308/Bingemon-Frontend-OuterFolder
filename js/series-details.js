const seriesCookie = document.cookie.split(";").find((row) =>
    row.startsWith(" Series="))?.split("=")[1];
console.log(seriesCookie);
const userCookie = document.cookie.split(";").find((row) =>
    row.startsWith("User="))?.split("=")[1];

const url = "http://localhost:8080/api/auth/series/credits/";

const singleSeriesUrl = url + seriesCookie;

const seriesBackdrop = document.getElementById('seriesBackdrop')
const seriesTitle = document.getElementById('seriesTitle')
const seriesRating = document.getElementById('seriesRating')
const seriesRuntime = document.getElementById('seriesRuntime')
const seriesSeasons = document.getElementById('seriesSeasons')
const seriesEpisodes = document.getElementById('seriesEpisodes')
const seriesRelease = document.getElementById('seriesRelease')
const seriesOverview = document.getElementById('seriesOverview')
const seriesCast = document.getElementById('seriesCast')

function fetchSingleSeries() {
    fetch(singleSeriesUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else
                throw new Error("unable to find series id")
        })
        .then(seriesDetails)
}

function seriesDetails(data) {
    console.log(data);
    const seriesBackdropData = data.backdrop_path
    seriesBackdrop.setAttribute('src', `https://image.tmdb.org/t/p/original/${seriesBackdropData}`)
    seriesBackdrop.setAttribute('alt', `${data.title} backdrop`)

    if (!data.name) {
        seriesTitle.innerText = "N/A";
    } else {
        seriesTitle.innerText = data.name
    }

    if (!data.vote_average) {
        seriesRating.innerText = "N/A";
    } else {
        seriesRating.innerText = data.vote_average.toFixed(1)
    }

    let seriesRuntime = document.getElementById('seriesRuntime')
    if (!data.episode_run_time || data.episode_run_time.length == 0) {
        seriesRuntime.innerText = "N/A"
    } else {
        console.log(data.episode_run_time);
        seriesRuntime.innerText = data.episode_run_time + " min."
    }

    let seriesReleaseYear = document.getElementById('seriesRelease')
    if (!data.first_air_date) {
        seriesReleaseYear.innerText = "N/A"
    } else {
        seriesReleaseYear.innerText = new Date(data.first_air_date).getFullYear()
    }
    seriesOverview.innerText = data.overview
    if (data.credits.cast.length < 6) {
        for (let i = 0; i < data.credits.cast.length; i++) {
            let seriesCastData = data.credits.cast[i].name;
            if (i == 0) {
                seriesCast.innerText = seriesCast.innerText + seriesCastData
            } else {
                seriesCast.innerText = seriesCast.innerText + ", " + seriesCastData
            }
        }
    } else {
        for (let i = 0; i < 6; i++) {
            let seriesCastData = data.credits.cast[i].name;
            if (i == 0) {
                seriesCast.innerText = seriesCast.innerText + seriesCastData
            } else {
                seriesCast.innerText = seriesCast.innerText + ", " + seriesCastData
            }
        }
    }

    if (!data.number_of_episodes) {
        seriesEpisodes.innerText = "N/A"
    } else {
        seriesEpisodes.innerText = data.number_of_episodes
    }

    if (!data.number_of_seasons) {
        seriesSeasons.innerText = "N/A"
    } else {
        seriesSeasons.innerText = data.number_of_seasons
    }
    console.log(seriesCookie);
}

const addSeriesUrl = "http://localhost:8080/api/auth/user-series-list/" + userCookie;

async function addSeriesToUserSeriesList(seriesID) {
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

fetchSingleSeries();
