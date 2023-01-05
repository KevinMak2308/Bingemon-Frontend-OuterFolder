jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})

jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

const seriesCookie = document.cookie.split(";").find((row) =>
  row.startsWith(" Series="))?.split("=")[1];

const userCookie = document.cookie.split(";").find((row) =>
  row.startsWith("User="))?.split("=")[1];

const baseUrl = "https://bingemon.azurewebsites.net/api"
const userUrl = "/user"
const seriesUrl = "/series"

const seriesBackdrop = document.getElementById('seriesBackdrop')
const seriesTitle = document.getElementById('seriesTitle')
const seriesRating = document.getElementById('seriesRating')
const seriesSeasons = document.getElementById('seriesSeasons')
const seriesEpisodes = document.getElementById('seriesEpisodes')
const seriesOverview = document.getElementById('seriesOverview')
const seriesCast = document.getElementById('seriesCast')

function fetchSingleSeries() {
  fetch(baseUrl + seriesUrl + `/credits/${seriesCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else
        throw new Error("Unable to find series id")
    })
    .then(seriesDetails)
}

function seriesDetails(data) {
  const seriesBackdropData = data.backdrop_path
  seriesBackdrop.setAttribute('src', `https://image.tmdb.org/t/p/original/${seriesBackdropData}`)
  seriesBackdrop.setAttribute('alt', `${data.title} backdrop`)

  if (!data.name) {
    seriesTitle.innerText = "N/A"
  } else {
    seriesTitle.innerText = data.name
  }

  if (!data.vote_average) {
    seriesRating.innerText = "N/A"
  } else {
    seriesRating.innerText = data.vote_average.toFixed(1)
  }

  let seriesRuntime = document.getElementById('seriesRuntime')
  if (!data.episode_run_time || data.episode_run_time.length == 0) {
    seriesRuntime.innerText = "N/A"
  } else {
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
      let seriesCastData = data.credits.cast[i].name
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
}

async function addSeriesToUserSeriesList(seriesID) {
  let postSeriesRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: seriesID
  }

  return fetch(baseUrl + userUrl + `/serieslist/${userCookie}`, postSeriesRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
}

fetchSingleSeries();
