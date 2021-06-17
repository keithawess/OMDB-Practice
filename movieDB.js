const titleSearch = document.getElementById("searchBox");
const typeSelect = document.getElementById("selectBox");
const yearSearch = document.getElementById("yearBox");
const submit = document.getElementById("submitBox");
const errorBox = document.getElementById('errorBox');
const seasonSearch = document.getElementById('seasonBox');
const episodeSearch = document.getElementById('episodeBox');
const seasonLabel = document.getElementById('seasonLabel');
const episodeLabel = document.getElementById('episodeLabel');

let title;
let type;
let year;
let season = "";
let episode = "";
let result;

typeSelect.addEventListener("input", () => {
    if (typeSelect.value === "Episode" && seasonSearch.classList.contains('hide')) {
        seasonSearch.classList.remove('hide');
        episodeSearch.classList.remove('hide');
        seasonLabel.classList.remove('hide');
        episodeLabel.classList.remove('hide');
    }
    else if (typeSelect.value !== "Episode" && !seasonSearch.classList.contains('hide')) {
        seasonSearch.classList.add('hide');
        episodeSearch.classList.add('hide');
        seasonLabel.classList.add('hide');
        episodeLabel.classList.add('hide');
    }
})

submit.addEventListener("click", (e) => {
    if (!errorBox.classList.contains("hide")) {
        errorBox.classList.add("hide");
        errorBox.classList.add('bgRed');
        errorBox.classList.add('textWhite');
    }
    errorBox.innerText = "";
    clearResults();


    if (valueCheck()) {
        getTitle();
        getType();
        getYear();

        if (type !== "Episode") {
            fetch(
                `http://www.omdbapi.com/?apikey=6180748a&s=${title}&type=${type}&y=${year}`
            )
                .then(function (response) {
                    if (!response.ok) {
                        console.log(response.status);
                    }
                    return response.json();
                })
                .then(function (res) {
                    if (res.Response == "True") {
                        displayResults(res.Search);
                        errorBox.innerText = `Displaying ${res.Search.length} of ${res.totalResults} results`;
                        errorBox.classList.remove('bgRed');
                        errorBox.classList.remove('hide');
                        errorBox.classList.remove('textWhite');
                    }
                    else {
                        errorBox.innerText = `${res.Error}`;
                        errorBox.classList.remove('hide');
                    }
                });
        }
        else {
            getSeason();
            getEpisode();

            fetch(
                `http://www.omdbapi.com/?apikey=6180748a&t=${title}${season}${episode}`
            )
                .then(function (response) {
                    if (!response.ok) {
                        console.log(response.status);
                    }
                    return response.json();
                })
                .then(function (res) {
                    if (res.Response == "True") {
                        displayResults(res);
                    }
                    else {
                        errorBox.innerText = `${res.Error}`;
                        errorBox.classList.remove('hide');
                    }
                });
        }
    }
});

function getTitle() {
    title = titleSearch.value;
}

function getType() {
    type = typeSelect.value;
}

function getYear() {
    year = yearSearch.value;
}

function getEpisode() {
    if (episodeSearch.value > 0)
        episode = `&Episode=${episodeSearch.value}`;
}

function getSeason() {
    if(seasonSearch.value > 0)
        season = `&Season=${seasonSearch.value}`;
}

function addToList(item) {
    let listing = document.createElement('div');
    listing.innerText = `Title: ${item.Title}\n
    Year: ${item.Year}`

    listing.classList.add('result');
    listing.classList.add('border');
    document.querySelector(".resultContainer").append(listing);

    if (item.Poster !== "N/A") {
        let poster = document.createElement("img");
        poster.src = `${item.Poster}`;
        poster.alt = `${item.Title} poster`;
        poster.className = ("marginAuto poster")
        listing.append(poster);
    }
}

function addEpisode(item) {
    if (season && episode) {
        let listing = document.createElement('div');
        listing.innerText = `Title: ${item.Title}\n
        Year: ${item.Year}\n
        Rating: ${item.Rated}\n
        Released: ${item.Released}\n
        Season: ${item.Season}\n
        Episode: ${item.Episode}\n
        Runtime: ${item.Runtime}\n
        Genre: ${item.Genre}\n
        Director: ${item.Director}\n
        Writer: ${item.Writer}\n
        Actors: ${item.Actors}\n
        Plot: ${item.Plot}\n`

        listing.classList.add('episode');
        listing.classList.add('border');
        document.querySelector(".resultContainer").append(listing);

        if (item.Poster !== "N/A") {
            let poster = document.createElement("img");
            poster.src = `${item.Poster}`;
            poster.alt = `${item.Title} poster`;
            poster.className = ("marginAuto poster")
            listing.append(poster);
        }
    }



    else if (episode && !season) {
        let listing = document.createElement('div');
        listing.innerText = `Title: ${item.Title}\n
    Year: ${item.Year}\n
    Rating: ${item.Rated}\n
    Released: ${item.Released}\n
    Runtime: ${item.Runtime}\n
    Genre: ${item.Genre}\n
    Director: ${item.Director}\n
    Writer: ${item.Writer}\n
    Actors: ${item.Actors}\n
    Plot: ${item.Plot}\n`

        listing.classList.add('episode');
        listing.classList.add('border');
        document.querySelector(".resultContainer").append(listing);

        if (item.Poster !== "N/A") {
            let poster = document.createElement("img");
            poster.src = `${item.Poster}`;
            poster.alt = `${item.Title} poster`;
            poster.className = ("marginAuto poster")
            listing.append(poster);
        }
    }
}

function addSeasonEpisode(item)
{
    let listing = document.createElement('div');
    listing.innerText = `Title: ${item.Title}\n
    Released: ${item.Released}\n
    Episode: ${item.Episode}\n
    Rating: ${item.imdbRating}`

    listing.classList.add('result');
    listing.classList.add('border');
    document.querySelector(".resultContainer").append(listing);
}

function addSeason(item)
{
    let listing = document.createElement('div');
        listing.innerText = `Title: ${item.Title}\n
        Season: ${item.Season}\n
        Total Seasons: ${item.totalSeasons}`
    
        listing.classList.add('episode');
        listing.classList.add('border');
        document.querySelector(".resultContainer").append(listing);

        console.log(item)
        for (let i = 0; i < item.Episodes.length; i++) {
            addSeasonEpisode(item.Episodes[i]);
        }
}

function displayResults(arr) {
    if (type == "Episode" && episode) {
        addEpisode(arr);
    }
    else if (type == "Episode" && !episode) {
        addSeason(arr);
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            addToList(arr[i]);
        }
    }
}

function clearResults() {
    document.getElementById('resultContainer').innerHTML = '';
}

function valueCheck() {
    let check = true;

    if (titleSearch.value) {
        if (titleSearch.value.length < 3) {
            errorBox.innerText += "Please enter a longer title. ";
            errorBox.classList.remove('hide');
            check = false;
        }
        if (isNaN(yearSearch.value)) {
            errorBox.innerText = "Please inserta valid year (YYYY)";
            errorBox.classList.remove('hide');
            check = false;
        }
    }
    else {
        errorBox.innerText = "Please fill all fields.";
        errorBox.classList.remove('hide');
        check = false;
    }
    return check;
}

// displayEpisode