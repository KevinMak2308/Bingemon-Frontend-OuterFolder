const url = new URL("http://localhost:8080/api/auth/movies")
const mainMovieDiv = document.getElementById('mainMovieDiv')

//Placeholder for a Controller Method that will send a response to the frontend with all the movie genres
const genreUrl = "http://localhost:8080/api/auth/genres/en"
const movieGenreDropDownSelect = document.getElementById('genreDropDownList')


const languageURL = "https://api.themoviedb.org/3/configuration/languages?api_key=3a2720206555a0807cc5c2d72aa65b9a"
const languageSelect = document.getElementById('movieLanguageChoice')


function fetchMovieGenres() {
  return fetch(genreUrl)
    .then(data => data.json())
    .then(movieGenreData)
}

function movieGenreData(data) {
  console.log("Movie Genre Json Data ", data)

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
    console.log("Movie Genre ID ", genres.id)

    let newURLParams = new URLSearchParams(url.search)
    newURLParams.set('genres', optionIndex.value)
    url.search = newURLParams.toString()
    console.log("New URL after change ", url)

    })
  }
}

function fetchMovieLanguage() {
return fetch(languageURL)
  .then(data => data.json())
  .then(movieLanguageData)
}

function movieLanguageData(data) {
  console.log("Language data ", data)

  for (let i = 0; i < data.length ; i++) {

    const language = data[i]

    const languageOptions = document.createElement('option')
    languageOptions.innerText = language.english_name
    languageOptions.setAttribute('value', language.iso_639_1)


    languageSelect.appendChild(languageOptions)


    languageSelect.addEventListener("change",(event) => {
      const selectIndex = languageSelect.selectedIndex;
      let optionIndex = languageSelect.options[selectIndex]
      languageOptions.value = optionIndex.value

      let newURLParams = new URLSearchParams(url.search)
      newURLParams.set('with_original_language', optionIndex.value)
      url.search = newURLParams.toString()
      console.log("New URL after change ", url)

    })

  }
}


/*function selectMultipleElements() {
  document.getElementById('submit').onclick = function() {
    let selected = [];
    for (let option of document.getElementById('genres').options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    console.log(selected);
  }
}*/

console.log("Default URL ", url)
function fetchMoviesForSwipeList() {
  return fetch(url)
    .then(data => data.json())
    .then(movieDataBasedOnCriteria)
}

function movieDataBasedOnCriteria(data) {
  console.log("Every Movie Json Data", data)

      let pageNumbers = data.page

      window.onscroll = function(event) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      alert("you're at the bottom of the page");
      let newURLParams = new URLSearchParams(url.search)
      newURLParams.set('page', pageNumbers+1)
      url.search = newURLParams.toString()
      console.log("NEW URL PAGE NUMBER ", url)
      fetchMoviesForSwipeList()
    }
  }

  for (let i = 0; i < data.results.length; i++) {

  const movies = data.results[i]
  const movieTable = document.createElement('table');
  movieTable.innerText = "Movies: " + movies.title;
  mainMovieDiv.appendChild(movieTable);
  }
}

fetchMovieLanguage()
fetchMovieGenres()


