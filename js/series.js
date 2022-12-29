jQuery(document).ready(function () {
  jQuery("#navigation").load("header.html");
});
jQuery(document).ready(function(){
  jQuery("#footer").load("footer.html");
});
$(".toggle-swipe").click(function () {
    $(".movie-swiper").show()
});

let cards = document.querySelectorAll('.movie-card');

function flipCard() {
    [...cards].forEach((card) => {
        card.classList.toggle('is-flipped');
    });
};

const userCookie = document.cookie.split(";").find((row) =>
    row.startsWith("User="))?.split("=")[1];

const basicUrl = "http://localhost:8080/"
const url = new URL(basicUrl + "api/auth/series/series-multi-filter")
const mainSeriesDiv = document.getElementById('mainSeriesDiv')


const genreUrl = basicUrl + "api/auth/series/genres"
const seriesGenreDropDownSelect = document.getElementById('seriesGenreDropDownList')

const seriesLanguageChoice = document.getElementById('seriesLanguageChoice')

const seriesSort = document.getElementById('seriesSort')

const seriesTrailerUrl = basicUrl + "api/auth/series/credits/"
let newURLParams = new URLSearchParams(url.search)

const seriesReviewUrl = basicUrl + "api/auth/series/rating/"

function fetchSeriesGenres() {
    return fetch(genreUrl)
        .then(response => response.json())
        .then(seriesGenreData)
}

function seriesGenreData(data) {
    for (let i = 0; i < data.genres.length; i++) {
        const genres = data.genres[i]

        const genreOption = document.createElement('option')
        genreOption.innerText = genres.name
        genreOption.setAttribute('value', genres.id)
        seriesGenreDropDownSelect.appendChild(genreOption)

        seriesGenreDropDownSelect.addEventListener("change", (event) => {
            const selectIndex = seriesGenreDropDownSelect.selectedIndex;
            let optionIndex = seriesGenreDropDownSelect.options[selectIndex]
            genres.id = optionIndex.value

            newURLParams.set('genres', optionIndex.value)
            url.search = newURLParams.toString()
        })
    }
}

function seriesLanguageData(data) {

    seriesLanguageChoice.addEventListener("change", (event) => {
        const selectIndex = seriesLanguageChoice.selectedIndex;
        let optionIndex = seriesLanguageChoice.options[selectIndex]

        newURLParams.set('language', optionIndex.value)
        url.search = newURLParams.toString()
    })
}

function seriesSortForSwipeList(data) {

    seriesSort.addEventListener("change", (event) => {
        const selectIndex = seriesSort.selectedIndex;
        let optionIndex = seriesSort.options[selectIndex]

        newURLParams.set('sort_by', optionIndex.value)
        url.search = newURLParams.toString()
    })
}

function fetchSeriesForSwipeList() {
    return fetch(url)
        .then(data => data.json())
        .then(seriesDataBasedOnCriteria)
}

function seriesDataBasedOnCriteria(data) {

    for (let i = 0; i < data.results.length; i++) {

        const series = data.results[i]
        const seriesTable = document.createElement('table');
        const seriestextTable = document.createElement('tbody')
        seriesTable.innerText = "Series ID/Title: " + series.id + "/" + series.title;
        seriestextTable.innerText = "Series Description: " + series.overview;
        mainSeriesDiv.appendChild(seriesTable);
        mainSeriesDiv.appendChild(seriestextTable);
    }
    initSeriesSwiper(data.results)
    seriesPageData(data.page)
}

async function getSwipeListAndThenRenderSeries() {
    await fetchSeriesForSwipeList()
    renderNextSeries()
}

const seriesTrailer = document.getElementById('seriesTrailer');
const seriesPoster = document.getElementById('seriesPoster');
const seriesTitle = document.getElementById('seriesTitle');
const seriesButtonsLikeDislike = document.getElementById('seriesCardBtnLikeDislike');

function initSeriesSwiper(data) {
    mainSeriesDiv.style.display = 'none';
    seriesButtonsLikeDislike.style.display = 'block';
    seriesList = data;
}

function seriesPageData(data) {
    pageNumbers = data;
}

let pageNumbers = 1;
let seriesList;
let currentIndex = 0;

const addSeriesUrl = basicUrl + "api/auth/user-series-list/" + userCookie;

async function addSeries(seriesID) {
    let postSeriesRequest = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: seriesID
    }

    return fetch(addSeriesUrl, postSeriesRequest)
        .then(response => response.json())
        .catch(error => console.log(error))
}

async function renderNextSeries(added) {
    series = seriesList[currentIndex]
    console.log("Series title: " + series.original_name);
    if (added && currentIndex == 0) {
        seriesAdd = seriesList[currentIndex]
        await addSeries(seriesAdd.id)
    } else if (added) {
        seriesAdd = seriesList[currentIndex - 1]
        await addSeries(seriesAdd.id)
    }

    function getSeriesTrailerUrl() {
        return fetch(seriesTrailerUrl + series.id)
            .then(data => data.json())
            .then(function (data) {
                seriesTrailer.setAttribute("src", "");
                $("#seriesTrailer").show()
                $(".trailer-div").remove();
                if (data.videos.length == 0) {
                    $("#seriesTrailer").hide()
                    $(".movie-card-trailer").prepend("<div class='trailer-div'>" +
                        "<p class='trailer-not-found'> " + series.name + "</p>" +
                        "<img class='trailer-unavailable' src='/img/trailer-not-found-image.jpg' alt='Default YouTube video unavailable image'></div>")
                } else {
                    let seriesTrailerData = data.videos[data.videos.length - 1].key;
                    seriesTrailer.setAttribute("src", "https://www.youtube.com/embed/" + seriesTrailerData)
                }

                let seriesPosterData = data.poster_path
                if (!seriesPosterData) {
                    seriesTitle.innerText = data.name;
                    seriesPoster.setAttribute("src", "/img/default-poster.png")
                    console.log(seriesPoster, seriesPosterData);
                } else {
                    seriesPoster.setAttribute('src', `https://image.tmdb.org/t/p/w500/${seriesPosterData}`)
                }
                let seriesOverviewData = document.getElementById('seriesOverview')
                seriesOverviewData.innerText = data.overview

                let seriesCast = document.getElementById('seriesCast')
                seriesCast.innerText = ""

                if (data.credits.cast.length < 6) {
                    for (let i = 0; i < data.credits.cast.length; i++) {
                        let seriesCastData = data.credits.cast[i].name;
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

            })
    }

    function getSeriesReview() {
        return fetch(seriesReviewUrl + series.id)
            .then(data => data.json())
            .then(function (data) {

                let seriesRating = document.getElementById('seriesRating')
                if (!data.vote_average) {
                    seriesRating.innerText = "N/A";
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

                let episodes = document.getElementById('seriesEpisodes')
                if (!data.number_of_episodes) {
                    episodes.innerText = "N/A"
                } else {
                    episodes.innerText = data.number_of_episodes
                }

                let seasons = document.getElementById('seriesSeasons')
                if (!data.number_of_seasons) {
                    seasons.innerText = "N/A"
                } else {
                    seasons.innerText = data.number_of_seasons
                }
            })
    }

    getSeriesReview()
    getSeriesTrailerUrl()
    currentIndex++;

    if (currentIndex > seriesList.length - 1) {
        currentIndex = 0
        newURLParams.set('page', pageNumbers + 1)
        url.search = newURLParams.toString()
        fetchSeriesForSwipeList()
    }
}


fetchSeriesGenres()
seriesLanguageData()
seriesSortForSwipeList()
