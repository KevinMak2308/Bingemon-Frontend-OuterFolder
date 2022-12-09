jQuery(document).ready(function(){
  jQuery("#navigation").load("header.html");
});

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

const url = `http://localhost:8080/api/auth/user/${cookieSplitter()}`
const userMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitter()}`

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
      throw new Error("Login Failed!")
    })
    .then(userMovieListId)
    .catch(error => console.log(error));
}

 async function userMovieListId(data) {
  console.log("What data do we fetch in fetchUserMovieId ", data)

  for (let i = 0; i < data.length; i++) {
    let userMovieId = data[i]
    console.log("fetchUserMovieId for-loop ", userMovieId)

    await fetch(`http://localhost:8080/api/auth/${userMovieId}`)
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
        throw new Error("Failed to Retrieve Movie!")
      })
      .then(function(data) {
        console.log("Does it fetch a single movie? ", data)
        $(".movies-container").append("<div id='"+userMovieId+"' class='movie-div'></div>")
        $("#" + userMovieId).append('<img src=\"https://image.tmdb.org/t/p/w500/' +data.poster_path+ '\"/>')
        })
      .catch(error => console.log(error));
  }
}

fetchUserProfile()
fetchUserMovieId()
