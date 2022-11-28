const url = new URL("http://localhost:8080/api/auth/movie-multi-filter")
const mainMovieDiv = document.getElementById('mainMovieDiv')

//Placeholder for a Controller Method that will send a response to the frontend with all the movie genres
const genreUrl = "http://localhost:8080/api/auth/genres/en"
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')

const languageURL = "http://localhost:8080/api/auth/movie-language"
const languageSelect = document.getElementById('movieLanguageChoice')

const movieTrailerUrl = "http://localhost:8080/api/auth/credits/"
let newURLParams = new URLSearchParams(url.search)

function fetchMovieGenres() {
  return fetch(genreUrl)
    .then(data => data.json())
    .then(movieGenreData)
}

function movieGenreData(data) {

  for (let i = 0; i < data.length; i++) {
    const genres = data[i]

    const genreOption = document.createElement('option')
    genreOption.innerText = genres.name
    genreOption.setAttribute('value', genres.id)
    movieGenreDropDownSelect.appendChild(genreOption)

    movieGenreDropDownSelect.addEventListener("change",(event) => {
    const selectIndex = movieGenreDropDownSelect.selectedIndex;
    let optionIndex = movieGenreDropDownSelect.options[selectIndex]
    genres.id = optionIndex.value

    newURLParams.set('genres', optionIndex.value)
    url.search = newURLParams.toString()
    console.log(url.search);

    })
  }
}


function fetchMovieLanguage() {
return fetch(languageURL)
  .then(data => data.json())
  .then(movieLanguageData)
}

function movieLanguageData(data) {

  for (let i = 0; i < data.length ; i++) {
    let language = data[i]

    var languageOption = document.createElement('option')
    languageOption.innerText = language.english_name
    languageOption.setAttribute('value', language.iso_639_1)
    languageSelect.appendChild(languageOption)


  }
  languageSelect.addEventListener("change",(event) => {
    const selectIndex = languageSelect.selectedIndex;
    let optionIndex = languageSelect.options[selectIndex]
    languageOption.value = optionIndex.value

    newURLParams.set('language', optionIndex.value)
    url.search = newURLParams.toString()
    console.log(languageOption.value);

  })
}

document.getElementById('decadeDropDown').onchange = function() {
  let selected = [];
  for (let option of document.getElementById('decadeDropDown').options) {
    if (option.selected) {
      selected.push(option.value);
    }
  }
  let decade = selected;
  newURLParams.set("decade", decade.toString());
  url.search = newURLParams.toString();
  console.log(url.href);
}

function fetchMoviesForSwipeList() {
  return fetch(url)
    .then(data => data.json())
    .then(movieDataBasedOnCriteria)
}

function movieDataBasedOnCriteria(data) {
      let pageNumbers = data.page

      window.onscroll = function(event) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      alert("you're at the bottom of the page");
      newURLParams.set('page', pageNumbers+1)
      url.search = newURLParams.toString()
    }
  }

  for (let i = 0; i < data.results.length; i++) {

  const movies = data.results[i]
  const movieTable = document.createElement('table');
  const movietextTable = document.createElement('tbody')
  movieTable.innerText = "Movie ID/Title: " + movies.id + "/" + movies.title;
  movietextTable.innerText = "Movie Description: " + movies.overview;
  mainMovieDiv.appendChild(movieTable);
  mainMovieDiv.appendChild(movietextTable);
  }
  initMovieSwiper(data.results)
}

const movieTitle = document.getElementById('movieTitle');
const movieTrailer = document.getElementById('movieTrailer');
const movieLike = document.getElementById('btnLike');
const movieDislike = document.getElementById('btnDislike');

function initMovieSwiper(data) {
  mainMovieDiv.style.display = 'none';
  console.log("What movie element: ", data[0]);
  movieList = data;
}

function getMovieTrailerUrl(url) {
  return fetch(url)
    .then(data => data.json())
}


let movieList;
let currentIndex = 0;

function renderNextMovie(userLike) {
  movie = movieList[currentIndex]
  movieTitle.innerText = movie.title
  console.log(movie)
  let trailerResponse = getMovieTrailerUrl(movieTrailerUrl + movie.id).then(function(data) {
    console.log(data)
    movieTrailer.setAttribute('src', getMovieTrailerUrl(movieTrailerUrl + movie.id))
  })
  let movieTrailerURL = trailerResponse
  currentIndex++;
}


fetchMovieLanguage()
fetchMovieGenres()



