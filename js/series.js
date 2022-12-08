jQuery(document).ready(function(){
    jQuery("#navigation").load("header.html");
});

if (!document.cookie) {
    window.location.href = "frontpage.html"
}

$(".toggle-swipe").click(function () {
    $(".movie-swiper").show()
});

let cards = document.querySelectorAll('.movie-card');

function flipCard() {
    [...cards].forEach((card) => {
        card.classList.toggle('is-flipped');
    });
};

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

const basicUrl = "http://localhost:8080/"
const url = new URL(basicUrl + "api/auth/series/series-multi-filter")
const mainSeriesDiv = document.getElementById('mainSeriesDiv')


const genreUrl = basicUrl + "api/auth/series/genres"
const seriesGenreDropDownSelect = document.getElementById('seriesGenreDropDownList')

const seriesLanguageChoice = document.getElementById('seriesLanguageChoice')

const seriesSort = document.getElementById('seriesSort')

const seriesTrailerUrl = basicUrl + "api/auth/series/credits/"
let newURLParams = new URLSearchParams(url.search)

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

const addSeriesUrl = basicUrl + "api/auth/user-series-list/" + cookieSplitter()

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
                for (let i = 0; i < data.videos.length; i++) {
                    let seriesTrailerData = data.videos[data.videos.length - 1].key;
                    seriesTrailer.setAttribute("src", "https://www.youtube.com/embed/" + seriesTrailerData)
                    console.log("Series trailer key: " + seriesTrailerData);
                    console.log("innertext: " + seriesTrailer.innerText);
                }
                let seriesPosterData = data.poster_path
                seriesPoster.setAttribute("src", "https://image.tmdb.org/t/p/w500" + seriesPosterData)
                let seriesOverviewData = document.getElementById('seriesOverview')
                seriesOverviewData.innerText = data.overview
            })
    }

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
