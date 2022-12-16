jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html");
});

$(".add-friends").click(function () {
  $(".friends-modal").toggle()
})

function cookieSplitter() {

  let userCookie = document.cookie;
  let cookiearray = userCookie.split(';').find((row) => row.startsWith('User='))?.split('=')[1]
  console.log(cookiearray)
  return cookiearray
}

const url = `http://localhost:8080/api/auth/user/${cookieSplitter()}`
const userMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitter()}`
const userSeriesListUrl = `http://localhost:8080/api/auth/user-series-list/${cookieSplitter()}`
const friendListUrl = `http://localhost:8080/api/auth/friends/${cookieSplitter()}`
const findFriendUrl = 'http://localhost:8080/api/auth/username/'
const friendRequestUrl = 'http://localhost:8080/api/auth/friendrequest/'
const friendRequestsRecivedUrl = `http://localhost:8080/api/auth/friendRequestsReceived/${cookieSplitter()}`
const friendRequestsSendedUrl = `http://localhost:8080/api/auth/friendRequestsSended/${cookieSplitter()}`
const acceptFriendRequestUrl = "http://localhost:8080/api/auth/friendrequest"
const regretFriendRequestUrl = "http://localhost:8080/api/auth/friendrequest/"

function fetchUserProfile() {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Login Failed!")
    })
    .then(userProfileData)
    .catch(error => console.log(error));
}

function userProfileData(data) {
  $(".user-welcome").append("Welcome ", data.username)
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

async function userMovieListId(data) {


  for (let i = 0; i < data.length; i++) {
    let userMovieId = data[i]


    await fetch(`http://localhost:8080/api/auth/${userMovieId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to Retrieve Movie!")
      })
      .then(function (data) {
        $(".movies-container").append("<div id='" + userMovieId + "' class='movie-container'></div>")
        $("#" + userMovieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error));
  }
}


function fetchUserSeriesId() {
  fetch(userSeriesListUrl)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user series id list")
    })
    .then(userSeriesListId)
    .catch(error => console.log(error));
}

async function userSeriesListId(data) {
  console.log("What data do we fetch in fetchUserSeriesId ", data)

  for (let i = 0; i < data.length; i++) {
    let userSeriesId = data[i]
    console.log("fetchUserseriesId for-loop ", userSeriesId)

    await fetch(`http://localhost:8080/api/auth/series/${userSeriesId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Failed to Retrieve serie!")
      })
      .then(function (data) {
        console.log("Does it fetch a single serie? ", data)
        $(".series-container").append("<div id='" + userSeriesId + "' class='serie-container'></div>")
        $("#" + userSeriesId).append('<img src=\"https://image.tmdb.org/t/p/w500/' + data.poster_path + '\"/>')
      })
      .catch(error => console.log(error));
  }
}

function fetchFriendList() {
  fetch(friendListUrl)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user friend list")
    })
    .then(userfriendlistData)
    .catch(error => console.log(error));
}

function userfriendlistData(data) {
  let friendID;
  console.log("this is data: ", data)
  for (let i = 0; i < data.length; i++) {
    friendID = data[i].id
    let friend = data[i]
    console.log(friend)
    $(".friends-container").append("<div id='" + friend.id + "' class='friend-container'></div>")
    $("#" + friend.id).append("<a href='friendprofilepage.html'>" + friend.username + "</a>")

  }

  $(".friend-container").click(function () {
    let friendId = $(this).attr("id")
    document.cookie = "Friend=" + friendId
  });

}

function fetchAddFriend() {
  let searchInput = $('.friend-search-input').val()
  fetch(findFriendUrl + searchInput)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("failed to find user")
    })
    .then(fetchAddFriendData)
}

function fetchAddFriendData(data) {
  let searchedUser = data

  console.log(searchedUser)
  let friendRequest = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      "status": "false",
      "sender": {
        "id": cookieSplitter()
      },
      "recipient": {
        "id": searchedUser.id
      }
    })
  }

  return fetch(friendRequestUrl, friendRequest)
    .then(response => response.json())
    .catch(error => console.log(error))
}


function fetchFriendrequestsRecived() {
  fetch(friendRequestsRecivedUrl)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("failed to find user")
    })
    .then(fetchFriendRequestRecievedData)
}


//metode virker ikke, venner bliver ikke tilføjet i databasen.hmmmmm
function fetchFriendRequestRecievedData(data) {
  for (let i = 0; i < data.length; i++) {
    friendRequest = data[i]
    console.log("single Friend request", friendRequest)
    console.log("username!!!!!!!!!!!", friendRequest.sender.username)
    $(".received-friend-request-content").append("<div id='" + friendRequest.sender.username + "' class='friendrequest-container'></div>")
    $("#" + friendRequest.sender.username).append("<p>" + friendRequest.sender.username + "</p>" + "<button class='accept' id='" + friendRequest.id + "' data-sender='"+friendRequest.sender.id+"' data-recipient='"+friendRequest.recipient.id+"' type='button'>" + "yes" + "</button>" + "<button class='decline' data-friendRequestId='"+friendRequest.id+"'>" + "no" + "</button>")

    console.log("this is friend requests recieved", data)
  }

  $(".accept").click(function () {
    window.location.reload()
    let friendRequestId = $(this).attr("id")
    console.log("freindrequestid", friendRequestId)
    let senderId = $(this).attr("data-sender")
    console.log("senderid", senderId)
    let recipientId = $(this).attr("data-recipient")
    console.log("recipientid", recipientId)


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

    console.log(putFriendRequest)
    return fetch(acceptFriendRequestUrl + "/" + friendRequestId, putFriendRequest)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  })

  $(".decline").click(function (){
    const friendRequestId = $(".decline").attr("data-friendRequestId")
    let deleteFriendRequest = {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    }

    console.log(deleteFriendRequest)
    return fetch(regretFriendRequestUrl + friendRequestId, deleteFriendRequest)
      // .then(response => response.json())
      //.then(data => console.log(data))
      .catch(error => console.log(error))
      .then(window.location.reload())
  })

}

function fetchFriendrequestsSended() {

  fetch(friendRequestsSendedUrl)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("failed to find friend Requets sendend")
    })
    .then(fetchFriendRequestSendedData)
}


function fetchFriendRequestSendedData(data) {
  for (let i = 0; i < data.length; i++) {
    friendRequest = data[i]
    $(".received-friend-sended-content").append("<div id='" + friendRequest.sender.username + "' class='friendrequest-container'></div>")
    $("#" + friendRequest.sender.username).append("<p>" + friendRequest.recipient.username + "</p>" + "<button class='regret' id='" + friendRequest.id + "' data-sender='"+friendRequest.sender.id+"' data-recipient='"+friendRequest.recipient.id+"' type='button'>" + "X" + "</button>")

    console.log("this is friend requests sended", data)

  }

  $(".regret").click(function () {
    window.location.reload()
    let friendRequestId = $(this).attr("id")
    console.log("freindrequestid", friendRequestId)
    let senderId = $(this).attr("data-sender")
    console.log("senderid", senderId)
    let recipientId = $(this).attr("data-recipient")
    console.log("recipientid", recipientId)


    let deleteFriendRequest = {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    }

    console.log(deleteFriendRequest)
    return fetch(regretFriendRequestUrl + friendRequestId, deleteFriendRequest)
     // .then(response => response.json())
      //.then(data => console.log(data))
      .catch(error => console.log(error))
  })

}


fetchUserProfile()
fetchUserMovieId()
fetchUserSeriesId()
fetchFriendList()
fetchFriendrequestsRecived()
fetchFriendrequestsSended()
