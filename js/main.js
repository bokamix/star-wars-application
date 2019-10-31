const MainTitle = document.querySelector("#MainTitle");
const MainSlogan = document.querySelector("#MainSlogan");
let persons = [];
let ApiSrc = "https://swapi.co/api/";
const SearchForm = document.querySelector("#FindPerson");
const SearchResults = document.querySelector("#SearchResults");
let SearchListResults = [];
const PersonCard = document.querySelector("#PersonCard");
let PersonCardInfo = document.createElement("div");
PersonCard.appendChild(PersonCardInfo);

window.addEventListener("load", () => {
    console.log("page is fully loaded");
    creatAppView();
});

const creatAppView = () => {
    MainTitle.innerHTML = "Bountyfy!";
    MainSlogan.innerHTML = "Catch or kill and earn money!";
    setTimeout(function() {
        MainSlogan.innerHTML = "Become Bountyfayer!";
    }, 2000);
    setTimeout(function() {
        getAllPersons();
    }, 2000);
};

////////////////Get all persons from API ///////////////////////
async function getAllPersons() {
    await axios
        .all([
            axios.get(`${ApiSrc}people/?page=1`),
            axios.get(`${ApiSrc}people/?page=2`),
            axios.get(`${ApiSrc}people/?page=3`),
            axios.get(`${ApiSrc}people/?page=4`),
            axios.get(`${ApiSrc}people/?page=5`),
            axios.get(`${ApiSrc}people/?page=6`),
            axios.get(`${ApiSrc}people/?page=7`),
            axios.get(`${ApiSrc}people/?page=8`),
            axios.get(`${ApiSrc}people/?page=9`)
        ])
        .then(responseArr => {
            persons = persons.concat(
                responseArr[0].data.results,
                responseArr[1].data.results,
                responseArr[2].data.results,
                responseArr[3].data.results,
                responseArr[4].data.results,
                responseArr[5].data.results,
                responseArr[6].data.results,
                responseArr[7].data.results,
                responseArr[8].data.results
            );

            ///////////// Create ID's for all persons /////////////////

            persons.forEach(function(person, number) {
                let personId = persons[number].url.replace(
                    "https://swapi.co/api/people/",
                    ""
                );
                personId = personId.replace("/", "");
                person.id = personId;
            });
        });
    createListView();
    console.log(persons);
}

////////////////END Get all persons from API and Create ID's for all persons ///////////////////////
////////////////Create person List     /////////////

const createListView = () => {
    console.log(`Synchroniczne zaputanie`);
};

////////////////////////// Find Person //////////////////////////////

let timeout = null;
SearchForm.onkeyup = function(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        letsSearch(SearchForm.value);
        SearchResults.innerHTML = ``;
    }, 200);
};

async function letsSearch(SearchItem) {
    const SearchUrl = `https://swapi.co/api/people/?search=${SearchItem}`;
    try {
        const response = await axios.get(SearchUrl);
        response.data.results.forEach(function(person) {
            let ElementList = document.createElement("p");
            ElementList.innerHTML = `${person.name}`;
            ElementList.setAttribute("id", `${person.name}`);
            ElementList.setAttribute("class", `ElementList`);
            SearchResults.appendChild(ElementList);
        });
    } catch (error) {
        console.error(error);
    }
}

////////////////////////// END Find Person //////////////////////////////

SearchResults.addEventListener("click", e => {
    console.log(e.target.id);

    persons.forEach(function(person) {
        if (person.name == e.target.id) {
            console.log(person);
            SearchResults.innerHTML = ``;
            SearchForm.value = "";

            PersonCardInfo.innerHTML = `
            <p>${person.name}</p>
            <p>${person.eye_color}</p>
            <p>${person.mass}</p>
            <p>${person.birth_year}</p>
            <p>${person.eye_color}</p>
            <p>Bounty: 0$</p>
            `;
        }
    });
});

//////////// Find Person //////////
