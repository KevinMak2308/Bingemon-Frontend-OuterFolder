jQuery(document).ready(function(){
  jQuery("#navigation").load("header.html");
});

function cookieSplitter() {

  let userCookie = document.cookie;
  console.log(userCookie)
  let cookiearray = userCookie.split(';').find((row) => row.startsWith('User='))?.split('=')[1]
  console.log(cookiearray)
  return cookiearray

}

function cookieSplitterfriend() {
  let userCookie = document.cookie;
  console.log(userCookie)
  let cookiearray = userCookie.split(';').find((row) => row.startsWith('Friends='))?.split('=')[1]
  console.log(cookiearray)
  return cookiearray
  }


const loggedinUserUrl = `http://localhost:8080/api/auth/user/${cookieSplitter()}`
const loggedInUserMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitter()}`
const loggedInUseruserSeriesListUrl = `http://localhost:8080/api/auth/user-series-list/${cookieSplitter()}`


const friendUrl = `http://localhost:8080/api/auth/user/${cookieSplitterfriend()}`
const friendMovieListUrl = `http://localhost:8080/api/auth/userMovieList/${cookieSplitterfriend()}`
const friendSeriesListUrl = `http://localhost:8080/api/auth/user-series-list/${cookieSplitterfriend()}`


function fetchFriendProfile() {
  fetch(friendUrl)
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      throw new Error("Login Failed!")
    })
    .then(friendProfileData)
    .catch(error => console.log(error));
}

function friendProfileData(data) {
  $(".user-welcome").append("Welcome ", data.username)
}
