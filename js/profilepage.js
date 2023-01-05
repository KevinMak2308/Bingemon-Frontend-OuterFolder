jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html")
})
jQuery(document).ready(function () {
  jQuery("#footer").load("footer.html")
})

$(".add-friends").click(function () {
  $(".friends-modal").toggle()
})

const userCookie = document.cookie.split(";").find((row) =>
  row.startsWith("User="))?.split("=")[1]

const baseUrl = "https://bingemon.azurewebsites.net/api"
const userUrl = "/user"
const movieUrl = "/movie"
const seriesUrl = "/series"
const friendRequestUrl = "/friendrequest"

function fetchUserProfile() {
  fetch(baseUrl + userUrl + `/${userCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Login failed!")
    })
    .then(userProfileData)
    .catch(error => console.log(error))
}

function userProfileData(data) {
  $(".user-welcome").append("Welcome ", data.username)
}

function fetchUserMovieList() {
  fetch(baseUrl + userUrl + `/movielist/${userCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user movies id list")
    })
    .then(userMovieList)
    .catch(error => console.log(error))
}

async function userMovieList(data) {

  for (let i = 0; i < data.length; i++) {
    let userMovieId = data[i]

    await fetch(baseUrl + movieUrl + `/${userMovieId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to retrieve movie!")
      })
      .then(function (data) {
        $(".movies-container").append("<div id='" + userMovieId + "' class='movie-container'></div>")
        $("#" + userMovieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error))
  }
}

function fetchUserSeriesList() {
  fetch(baseUrl + seriesUrl + `/serieslist/${userCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user series id list")
    })
    .then(userSeriesList)
    .catch(error => console.log(error))
}

async function userSeriesList(data) {

  for (let i = 0; i < data.length; i++) {
    let userSeriesId = data[i]

    await fetch(baseUrl + seriesUrl + `/${userSeriesId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to retrieve series!")
      })
      .then(function (data) {
        console.log("Does it fetch a single serie? ", data)
        $(".series-container").append("<div id='" + userSeriesId + "' class='serie-container'></div>")
        $("#" + userSeriesId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error))
  }
}

function fetchFriendList() {
  fetch(baseUrl + userUrl + `/friends/${userCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user friend list")
    })
    .then(userFriendListData)
    .catch(error => console.log(error))
}

function userFriendListData(data) {

  for (let i = 0; i < data.length; i++) {
    let friend = data[i]
    $(".friends-container").append("<div id='" + friend.id + "' class='friend-container'></div>")
    $("#" + friend.id).append("<a href='friendprofilepage.html'>" + friend.username + "</a>")
  }

  $(".friend-container").click(function () {
    let friendId = $(this).attr("id")
    document.cookie = "Friend=" + friendId
  })
}

function fetchAddFriend() {
  let searchInput = $('.friend-search-input').val()
  fetch(baseUrl + userUrl + `/${searchInput}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to find user")
    })
    .then(fetchAddFriendData)
}

function fetchAddFriendData(data) {
  let searchedUser = data

  let friendRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      "status": "false",
      "sender": {
        "id": userCookie
      },
      "recipient": {
        "id": searchedUser.id
      }
    })
  }

  return fetch(baseUrl + friendRequestUrl + "/", friendRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
    .then(window.location.reload())
}

function fetchFriendRequestsReceived() {
  fetch(baseUrl + userUrl + `/friendrequests-received/${userCookie}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to find user")
    })
    .then(friendRequestReceivedData)
}

function friendRequestReceivedData(data) {

  for (let i = 0; i < data.length; i++) {
    let friendRequest = data[i]
    $(".received-friend-request-content").append("<div id='" + friendRequest.sender.username + "' class='friendrequest-container'></div>")
    $("#" + friendRequest.sender.username).append("<p>" + friendRequest.sender.username + "</p>" + "<button class='accept' id='" + friendRequest.id + "' data-sender='" + friendRequest.sender.id + "' data-recipient='" + friendRequest.recipient.id + "' type='button'>" + "yes" + "</button>" + "<button class='decline' type='button' data-friendRequestId='" + friendRequest.id + "'>" + "no" + "</button>")
  }

  $(".accept").click(function () {
    let friendRequestId = $(this).attr("id")
    let senderId = $(this).attr("data-sender")
    let recipientId = $(this).attr("data-recipient")

    let putFriendRequest = {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify
      ({
        "id": friendRequestId,
        "status": true,
        "sender": {
          "id": senderId
        },
        "recipient": {
          "id": recipientId
        }
      })
    }

    return fetch(baseUrl + friendRequestUrl + `/${friendRequestId}`, putFriendRequest)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
      .then(window.location.reload())
  })

  $(".decline").click(function () {
    const friendRequestId = $(".decline").attr("data-friendRequestId")
    let deleteFriendRequest = {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    }

    console.log(deleteFriendRequest)
    return fetch(baseUrl + friendRequestUrl + `/${friendRequestId}`, deleteFriendRequest)
      .catch(error => console.log(error))
      .then(window.location.reload())
  })
}

function fetchFriendRequestsSent() {

  fetch(baseUrl + userUrl + `/friendrequests-sent/${userCookie}` )
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to find friend requests sent")
    })
    .then(friendRequestSentData)
}

function friendRequestSentData(data) {

  for (let i = 0; i < data.length; i++) {
    let friendRequest = data[i]
    $(".received-friend-sended-content").append("<div id='" + friendRequest.sender.username + "' class='friendrequest-container'></div>")
    $("#" + friendRequest.sender.username).append("<p>" + friendRequest.recipient.username + "</p>" + "<button class='regret' id='" + friendRequest.id + "' data-sender='" + friendRequest.sender.id + "' data-recipient='" + friendRequest.recipient.id + "' type='button'>" + "X" + "</button>")
  }

  $(".regret").click(function () {
    let friendRequestId = $(this).attr("id")

    let deleteFriendRequest = {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    }

    return fetch(baseUrl + friendRequestUrl + `${friendRequestId}`, deleteFriendRequest)
      .catch(error => console.log(error))
      .then(window.location.reload())
  })
}

fetchUserProfile()
fetchUserMovieList()
fetchUserSeriesList()
fetchFriendList()
fetchFriendRequestsReceived()
fetchFriendRequestsSent()
