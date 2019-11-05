const InfoTable = document.createElement("div");
let personCard = document.querySelector('#PersonCard')
InfoTable.setAttribute("id", `InfoTable`);

window.addEventListener("load", () => {
    creatAppView(); 
});

const creatAppView = () => {
    personCard.appendChild(InfoTable);
};


/////////////////////////////////////////////////////////
////////// Varible and elements
/////////////////////////////////////////////////////////
let ApiSrc = "https://swapi.co/api/";
const MainTitle = document.querySelector("#MainTitle");
const MainSlogan = document.querySelector("#MainSlogan");
const SearchForm = document.querySelector("#FindPerson");
const SearchResults = document.querySelector("#SearchResults");
const PersonItemList = document.querySelector("#PersonItemList");
const loadingInfo = document.querySelector('#LoadingInfo')
const errorInfo = document.querySelector("#ErrorInfo")
const searchData = document.querySelector('#SearchData');
const AllPersonsButton = document.querySelector("#AllPersonsButton");
let AllPersonWrapper = document.createElement("div");
let PersonCardInfo = document.createElement("div");
const PersonalInfoButton = document.createElement("div");
const SpeciesInfoButton = document.createElement("div");
const VehiclesInfoButton = document.createElement("div");
const StarshipsInfoButton = document.createElement("div");
let persons = [];
let personsWithData = [];
let SearchListResults = [];
let ChoosenPersonData = [];
const CancelToken = axios.CancelToken;
let cancel;
let lodash = 0;
AllPersonWrapper.setAttribute("class", `DisplayNone`);
AllPersonWrapper.setAttribute("id", `AllPersonWrapper`);
InfoTable.appendChild(PersonCardInfo);

/////////////////////////////////////////////////////////
//////////////END Varible and elements
/////////////////////////////////////////////////////////


//////////////////////////////////////////////////////
///////////////User Actions
//////////////////////////////////////////////////////

MainTitle.addEventListener("click", e => {
    location.reload();
});

PersonalInfoButton.addEventListener("click", e => {
    InfoTable.classList.add("ShowInfoTable");
    showPersonTable()
});
SpeciesInfoButton.addEventListener("click", e => {
    InfoTable.classList.add("ShowInfoTable");
    showSpeciesTable()   
});
VehiclesInfoButton.addEventListener("click", e => {
    InfoTable.classList.add("ShowInfoTable");
    showVehicles(1)
});
StarshipsInfoButton.addEventListener("click", e => {
    InfoTable.classList.add("ShowInfoTable");
    showStarships(1)
});
AllPersonsButton.addEventListener("click", e => {
    if (persons.length == 0 && lodash == 0) {
        lodash = lodash + 1;
        AllPersonWrapper.classList.toggle("DisplayNone");
        CharacterFinder.classList.toggle("DisplayNone");
        getAllPersons().then(respone => {
            persons.forEach(function (person) {
                let personP = document.createElement("p");
                personP.setAttribute("class", `PersonItem`);
                personP.innerHTML = `${person.name}`;
                AllPersonWrapper.appendChild(personP);
            });

            ContentContainer.appendChild(AllPersonWrapper);
        });

    } else {
        if (!CharacterFinder.classList.contains("DisplayNone")) {
            CharacterFinder.classList.add("DisplayNone");
        }
        AllPersonWrapper.classList.remove("DisplayNone");
    }
});

//////////Choose person from list of all characters
AllPersonWrapper.addEventListener("click", e => {
    persons = JSON.parse(window.localStorage.getItem('persons'))
    getAllDataAboutPerson(persons, e.target.innerHTML)    
    InfoTable.classList.add("ShowInfoTable");
    showPersonTable()

    StarshipsInfoButton.innerHTML = "Starships Info";
    StarshipsInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(StarshipsInfoButton);

    VehiclesInfoButton.innerHTML = "Vehicles Info";
    VehiclesInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(VehiclesInfoButton);

    SpeciesInfoButton.innerHTML = "Species Info";
    SpeciesInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(SpeciesInfoButton);

    PersonalInfoButton.innerHTML = "Personal Info";
    PersonalInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(PersonalInfoButton);

    AllPersonWrapper.classList.toggle("DisplayNone");
    CharacterFinder.classList.toggle("DisplayNone");
});

//////////END Choose person from list of all characters

////////////////////////// Select person from SearchResults //////////////////////////////
SearchResults.addEventListener("click", e => {


    getAllDataAboutPerson(SearchListResults, e.target.innerHTML)
    InfoTable.classList.add("ShowInfoTable");
    showPersonTable()


    StarshipsInfoButton.innerHTML = "Starships Info";
    StarshipsInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(StarshipsInfoButton);

    VehiclesInfoButton.innerHTML = "Vehicles Info";
    VehiclesInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(VehiclesInfoButton);

    SpeciesInfoButton.innerHTML = "Species Info";
    SpeciesInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(SpeciesInfoButton);

    PersonalInfoButton.innerHTML = "Personal Info";
    PersonalInfoButton.setAttribute("class", `PersonCardMenu`);
    personCard.prepend(PersonalInfoButton);

    SearchResults.innerHTML = "";
    SearchForm.value = "";


});
////////////////////////// END elect person from SearchResults //////////////////////////////


///////////////////////////////////////////////////////////////
///////////////////       End User Actions
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
///////////////////       API Interaction
///////////////////////////////////////////////////////////////

////////////////Get all persons from API or Localstorage ///////////////////////

async function getAllPersons() {

    if (window.localStorage.getItem('persons')) {
        persons = JSON.parse(window.localStorage.getItem('persons'))

    }
    else {
        loadingInfo.classList.remove('DisplayNone')
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
                loadingInfo.classList.add('DisplayNone')
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

                window.localStorage.setItem('persons', JSON.stringify(persons));

            });
    }
}

////////////////END Get all persons from API or Localstorage ///////////////////////

////////////////////////// Find Person /////////////////////////////
let timeout = null;
SearchForm.onkeyup = function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        letsSearch(SearchForm.value);

    }, 700);
};
async function letsSearch(SearchItem) {
    if (SearchItem == undefined || SearchItem == "") { }
    else {
        searchData.classList.remove("DisplayNone")
        errorInfo.classList.add('DisplayNone')
        const SearchUrl = `https://swapi.co/api/people/?search=${SearchItem}`;
        try {
            const response = await axios.get(SearchUrl, {
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                })
            });
            cancel();
            SearchListResults = [];
            SearchResults.innerHTML = "";
            response.data.results.forEach(function (person, number) {
                let ElementList = document.createElement("p");
                ElementList.innerHTML = `${person.name}`;
                ElementList.setAttribute("class", `ElementList`);
                person.id = number;
                SearchResults.appendChild(ElementList);
                SearchListResults.push(person);
            });
            return searchData.classList.add("DisplayNone")
        } catch (error) {
            if (axios.isCancel(error)) {
               
            }          
            errorInfo.classList.remove('DisplayNone')
            setTimeout(function () { letsSearch(SearchItem) }, 8000);
        }
    }
}





////////////////////////// END Find Person //////////////////////////////

/////////////////////////////   Get all info about person    /////////////////////////////////////////

function getAllDataAboutPerson(dataList, personName) {
    personCard.classList.add('DisplayNone')
    AllPersonsButton.classList.add('DisplayEvent')    
    dataList.forEach(function (person) {
        if (person.name == personName) {        //////////find person  

            ChoosenPersonData = person;
            let axiosRequestObjects = [];       /////// array of request object  
            axiosRequestObjects = axiosRequestObjects.concat(
                ChoosenPersonData.homeworld,
                ChoosenPersonData.starships,
                ChoosenPersonData.vehicles,
                ChoosenPersonData.films,
                ChoosenPersonData.species
            );

            function countingItems(x) {
                if (Array.isArray(x)) {
                    x.itemNumber = x.length
                }
                else {
                    x = [`${x}`]
                    x.itemNumber = x.length
                    return x
                }
            }

            countingItems(ChoosenPersonData.homeworld)
            countingItems(ChoosenPersonData.starships)
            countingItems(ChoosenPersonData.vehicles)
            countingItems(ChoosenPersonData.films)
            countingItems(ChoosenPersonData.species)

            let ResponseArr = [];
            function makeRequestsFromArray(arr) {
                loadingInfo.classList.remove('DisplayNone')
                let index = 0;
                function request() {
                    return axios.get(arr[index]).then((response) => {
                        index++;
                        ResponseArr.push(response)
                        if (index >= arr.length) {
                            return ResponseArr
                        }
                        return request();
                    });

                }
                return request();
            }
            makeRequestsFromArray(axiosRequestObjects).then((ResponseArr) => {   ///////Request
                loadingInfo.classList.add('DisplayNone')
                ChoosenPersonData.homeworld = []
                let numberOfStarships = ChoosenPersonData.starships.itemNumber;
                ChoosenPersonData.starships = []
                let numberOfVehicles = ChoosenPersonData.vehicles.itemNumber;
                ChoosenPersonData.vehicles = []
                let numberOfFilms = ChoosenPersonData.films.itemNumber;
                ChoosenPersonData.films = []
                let numberOfSpecies = ChoosenPersonData.species.itemNumber;
                ChoosenPersonData.species = []
                ResponseArr.forEach(function (item, num) {

                    if (num < 1) {
                        ChoosenPersonData.homeworld.push(item.data)
                    }
                    else if (num >= 1 && num < (1 + numberOfStarships)) {
                        ChoosenPersonData.starships.push(item.data)
                    }

                    else if (num >= (1 + numberOfStarships) && num < (1 + numberOfStarships + numberOfVehicles)) {
                        ChoosenPersonData.vehicles.push(item.data)
                    }

                    else if (num >= (1 + numberOfStarships + numberOfVehicles) && num < (1 + numberOfStarships + numberOfVehicles + numberOfFilms)) {
                        ChoosenPersonData.films.push(item.data)
                    }

                    else {
                        ChoosenPersonData.species.push(item.data)
                    }
                })
                personCard.classList.remove('DisplayNone')
                AllPersonsButton.classList.remove('DisplayEvent')    




            }, (error) => {
                console.log(error);
                loadingInfo.classList.toggle('DisplayNone')
                errorInfo.classList.toggle('DisplayNone')
                setTimeout(function () { getAllDataAboutPerson(dataList, personName) }, 8000);
            });





        }
    })


}
/////////////////////////////END   Get all info about person    /////////////////////////////////////////


///////////////////////////////////////////////////////////////
///////////////////     END  API interaction
///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
/////////////////////Table Generator 
/////////////////////////////////////////////////////////////
const TableGenerator = (person, parmArr, ObjNumber) => {
    let NewTableParameters = document.createElement("ul");
    let NewTableParametersValue = document.createElement("ul");
    InfoTable.innerHTML = "";
    ///////////////////Array object
    if (Array.isArray(person)) {
        person.forEach(function (obj, num) {
            if (num == ObjNumber) {

                let arreyOfParam = Object.keys(obj);
                parmArr.forEach(function (param) {
                    arreyOfParam.forEach(function (item, number) {
                        if (item.includes(param)) {
                            ///create parameters item

                            let ParamElementList = document.createElement("li");
                            ParamElementList.innerHTML = `${arreyOfParam[number]}`;
                            ParamElementList.setAttribute(
                                "class",
                                `ListHeader`
                            );

                            NewTableParameters.appendChild(ParamElementList);
                            ///create parameters value item
                            let ParamValueElementList = document.createElement(
                                "li"
                            );
                            ParamValueElementList.innerHTML = `${
                                obj[arreyOfParam[number]]
                                }`;
                            ParamValueElementList.setAttribute(
                                "class",
                                `ListItem`
                            );
                            NewTableParametersValue.appendChild(
                                ParamValueElementList
                            );


                        }
                    });
                });
            }


        });
    } else {
        /////////////////////// Single Object
        let arreyOfParam = Object.keys(person);
        parmArr.forEach(function (param) {
            arreyOfParam.forEach(function (item, number) {
                if (item.includes(param)) {
                    ///create parameters item
                    let ParamElementList = document.createElement("li");
                    ParamElementList.innerHTML = `${arreyOfParam[number]}`;
                    ParamElementList.setAttribute("class", `ListHeader`);

                    NewTableParameters.appendChild(ParamElementList);
                    ///create parameters value item

                    let ParamValueElementList = document.createElement("li");
                    ParamValueElementList.innerHTML = `${
                        person[arreyOfParam[number]]
                        }`;
                    ParamValueElementList.setAttribute("class", `ListItem`);
                    NewTableParametersValue.appendChild(ParamValueElementList);
                }
            });
        });
    }

    NewTableParameters.setAttribute("id", `PersonHeaderList`);
    InfoTable.appendChild(NewTableParameters);
    NewTableParametersValue.setAttribute("id", `PersonItemList`);
    InfoTable.appendChild(NewTableParametersValue);
};


//////////////////////////////////////////////////////////////
/////////////////////END Table Generator 
/////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
///////////////////// Additional functions
/////////////////////////////////////////////////////////////

const showVehicles = (e) => {

    TableGenerator(
        ChoosenPersonData.vehicles,
        [
            "name",
            "cargo_capacity",
            "consumables",
            "cost_in_credits",
            "crew",
            "length",
            "manufacturer",
            "max_at",
            "sphering_speed",
            "model",
            "passengers",
            "vehicle_class"
        ],
        e - 1
    );
    if (ChoosenPersonData.vehicles.length == 0) {
        let emptyTable = document.createElement('p');
        emptyTable.innerHTML = "That table is empty";
        InfoTable.appendChild(emptyTable);
    }
    let cardsNumberWrapper = document.createElement("div");
    cardsNumberWrapper.setAttribute("class", `CardsNumberWrapper`);
    InfoTable.prepend(cardsNumberWrapper)
    for (let i = 0; i < ChoosenPersonData.vehicles.length; i++) {

        let numberOfCard = document.createElement("p");
        numberOfCard.innerHTML = `${i + 1}`
        cardsNumberWrapper.appendChild(numberOfCard)
        numberOfCard.addEventListener("click", e => { showVehicles(e.target.innerHTML) })
    }
}
const showStarships = (e) => {
    TableGenerator(
        ChoosenPersonData.starships,
        [
            "name",
            "model",
            "cost_in_credits",
            "crew",
            "starship_class",
            "length",
            "hyperdrive_rating",
            "MGLT",
            "cargo_capacity",
            "consumables",
            "manufacturer",
            "max_atmosphering_speed"
        ],
        e - 1
    );
    if (ChoosenPersonData.starships.length == 0) {
        let emptyTable = document.createElement('p');
        emptyTable.innerHTML = "That table is empty";
        InfoTable.appendChild(emptyTable);
    }
    let cardsNumberWrapper = document.createElement("div");
    cardsNumberWrapper.setAttribute("class", `CardsNumberWrapper`);
    InfoTable.prepend(cardsNumberWrapper)
    for (let i = 0; i < ChoosenPersonData.starships.length; i++) {

        let numberOfCard = document.createElement("p");
        numberOfCard.innerHTML = `${i + 1}`
        cardsNumberWrapper.appendChild(numberOfCard)
        numberOfCard.addEventListener("click", e => { showStarships(e.target.innerHTML) })
    }
}


const showPersonTable = () => {
    TableGenerator(ChoosenPersonData, [
        "name",
        "height",
        "mass",
        "hair_color",
        "skin_color",
        "eye_color",
        "birth_year",
        "gender"
    ]);

}
const showSpeciesTable = () => {
TableGenerator(
    ChoosenPersonData.species,
    [
        "average_height",
        "average_lifespan",
        "classification",
        "designation",
        "eye_colors",
        "hair_colors",
        "language",
        "name,skin_colors"
    ],
    0
);}


//////////////////////////////////////////////////////////////
///////////////////// END Additional functions
/////////////////////////////////////////////////////////////