jQuery(document).ready(function(){
  jQuery("#navigation").load("header.html");
});

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

function fetchUserProfile() {
  fetch(url)
    .then((response) => {
      if(response.ok) {
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
      if(response.ok) {
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
        if(response.ok) {
          return response.json()
        }
        throw new Error("Failed to Retrieve Movie!")
      })
      .then(function(data) {
        $(".movies-container").append("<div id='"+userMovieId+"' class='movie-container'></div>")
        $("#" + userMovieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' +data.poster_path+ '\"/>')
        })
      .catch(error => console.log(error));
  }
}


function fetchUserSeriesId() {
  fetch(userSeriesListUrl)
    .then((response) => {
      if(response.ok) {
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
        if(response.ok) {
          return response.json()
        }
        throw new Error("Failed to Retrieve serie!")
      })
      .then(function(data) {
        console.log("Does it fetch a single serie? ", data)
        $(".series-container").append("<div id='"+userSeriesId+"' class='serie-container'></div>")
        $("#" + userSeriesId).append('<img src=\"https://image.tmdb.org/t/p/w500/' +data.poster_path+ '\"/>')
      })
      .catch(error => console.log(error));
  }
}



function fetchFriendList(){
  fetch(friendListUrl)
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch user friend list")
    })
    .then(userfriendlistData)
    .catch(error => console.log(error));
}

function  userfriendlistData(data){
  console.log("this is data: " , data)
  for (let i = 0; i < data.length; i++) {
    let friend = data[i]
    console.log(friend)
    $(".friends-container").append("<div id='"+friend.id+"' class='friend-container'></div>")
    $("#" + friend.id).append("<a href='friendprofilepage.html'>" +friend.username+ "</a>")

  }

  $(".friend-container").click( function () {
    let friendId = $(this).attr("id")
    document.cookie = "Friend=" + friendId
  });

}


fetchUserProfile()
fetchUserMovieId()
fetchUserSeriesId()
fetchFriendList()
