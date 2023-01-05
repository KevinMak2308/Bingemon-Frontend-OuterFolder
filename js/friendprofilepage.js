jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})
jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

const userCookie = document.cookie.split(";").find((row) =>
  row.startsWith("User="))?.split("=")[1]

const friendCookie = userCookie.split(';').find((row) =>
  row.startsWith(' Friend='))?.split('=')[1]

const baseUrl = "https://bingemon.azurewebsites.net/api"
const userUrl = "/user"
const movieUrl = "/movie"
const seriesUrl = "/series"

function fetchFriendProfile() {
  fetch(baseUrl + userUrl + `/${friendCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Login failed!")
    })
    .then(friendProfileData)
    .catch(error => console.log(error))
}

function friendProfileData(data) {
  $(".user-welcome").append(data.username)
}

function fetchJointMovieList() {
  fetch(baseUrl + userUrl + `/compare-movielists${userCookie}/${friendCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch joint movie list")
    })
    .then(jointMovieListData)
    .catch(error => console.log(error))
}

async function jointMovieListData(data) {
  for (let i = 0; i < data.length; i++) {
    let movieId = data[i]

    await fetch( baseUrl + movieUrl + `/${movieId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to retrieve movie!")
      })
      .then(function (data) {
        $(".movies-container").append("<div id='" + movieId + "' class='movie-container'></div>")
        $("#" + movieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error))
  }
}

function fetchJointSeriesList() {
  fetch(baseUrl + userUrl + `/compare-serieslists${userCookie}/${friendCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch joint series list")
    })
    .then(jointSeriesListData)
    .catch(error => console.log(error))
}

async function jointSeriesListData(data) {

  for (let i = 0; i < data.length; i++) {
    let seriesId = data[i]

    await fetch(baseUrl + seriesUrl + `/${seriesId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to retrieve series!")
      })
      .then(function (data) {
        $(".series-container").append("<div id='" + seriesId + "' class='serie-container'></div>")
        $("#" + seriesId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error))
  }
}

fetchJointMovieList()
fetchJointSeriesList()
fetchFriendProfile()
