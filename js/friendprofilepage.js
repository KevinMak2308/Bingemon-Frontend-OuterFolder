jQuery(document).ready(function () {
    jQuery("#navigation").load("header.html");
});

function cookieSplitter() {
    let userCookie = document.cookie;
    console.log(userCookie)
    let cookiearray = userCookie.split(';').find((row) => row.startsWith('User='))?.split('=')[1]
    console.log(cookiearray)
    return cookiearray
}

function cookieSplitterFriend() {
    let userCookie = document.cookie;
    let cookiearray = userCookie.split(';').find((row) => row.startsWith(' Friend='))?.split('=')[1]
    console.log(cookiearray)
    return cookiearray
}

const jointMovieListUrl = `http://localhost:8080/api/auth/compareMoviesByUsers/${cookieSplitter()}/${cookieSplitterFriend()}`
const jointSeriesListUrl = `http://localhost:8080/api/auth/compareSeriesByUsers/${cookieSplitter()}/${cookieSplitterFriend()}`


const loggedinUserUrl = `http://localhost:8080/api/auth/user/${cookieSplitter()}`
const loggedInUserMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitter()}`
const loggedInUseruserSeriesListUrl = `http://localhost:8080/api/auth/user-series-list/${cookieSplitter()}`


const friendUrl = `http://localhost:8080/api/auth/user/${cookieSplitterFriend()}`
const friendMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitterFriend()}`
const friendSeriesListUrl = `http://localhost:8080/api/auth/user-series-list/${cookieSplitterFriend()}`


function fetchFriendProfile() {
    fetch(friendUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Login Failed!")
        })
        .then(friendProfileData)
        .catch(error => console.log(error));
}

function friendProfileData(data) {
    $(".user-welcome").append(data.username)
}

function fetchUserMovieId() {
    fetch(userMovieListUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Failed to fetch user movies id list")
        })
        .then(userMovieListId)
        .catch(error => console.log(error));
}


function fetchJointMovieList() {
    fetch(jointMovieListUrl)
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

        await fetch(`http://localhost:8080/api/auth/${movieId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("Failed to Retrieve Movie!")
            })
            .then(function (data) {
                $(".movies-container").append("<div id='" + movieId + "' class='movie-container'></div>")
                $("#" + movieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
            })
            .catch(error => console.log(error));
    }

}

function fetchJointSeriesList() {
    fetch(jointSeriesListUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Failed to fetch joint Series list")
        })
        .then(jointSeriesListData)
        .catch(error => console.log(error))
}

async function jointSeriesListData(data) {

    for (let i = 0; i < data.length; i++) {
        let seriesId = data[i]

        await fetch(`http://localhost:8080/api/auth/series/${seriesId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("Failed to Retrieve Series!")
            })
            .then(function (data) {
                $(".series-container").append("<div id='" + seriesId + "' class='serie-container'></div>")
                $("#" + seriesId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
            })
            .catch(error => console.log(error));
    }

}

fetchJointMovieList()
fetchJointSeriesList()
fetchFriendProfile()
