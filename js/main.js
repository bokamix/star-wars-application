const InfoTable = document.createElement("div");
InfoTable.setAttribute("id", `InfoTable`);

window.addEventListener("load", () => {
    creatAppView();
    console.log("page is fully loaded");
});

const creatAppView = () => {
    PersonCard.appendChild(InfoTable);
};

const MainTitle = document.querySelector("#MainTitle");
const MainSlogan = document.querySelector("#MainSlogan");
let persons = [];
let personsWithData = [];
let ApiSrc = "https://swapi.co/api/";
const SearchForm = document.querySelector("#FindPerson");
const SearchResults = document.querySelector("#SearchResults");
const PersonItemList = document.querySelector("#PersonItemList");
let SearchListResults = [];

let PersonCardInfo = document.createElement("div");

let ChoosenPersonData = [];
const AllPersonsButton = document.querySelector("#AllPersonsButton");
let AllPersonWrapper = document.createElement("div");
AllPersonWrapper.setAttribute("class", `DisplayNone`);
AllPersonWrapper.setAttribute("id", `AllPersonWrapper`);
const CancelToken = axios.CancelToken;
let cancel;

const PersonalInfoButton = document.createElement("div");
const SpeciesInfoButton = document.createElement("div");
const VehiclesInfoButton = document.createElement("div");

InfoTable.appendChild(PersonCardInfo);

///////////////User Actions///////////////////////////////////////

MainTitle.addEventListener("click", e => {
    if (!AllPersonWrapper.classList.contains("DisplayNone")) {
        AllPersonWrapper.classList.add("DisplayNone");
    }
    CharacterFinder.classList.remove("DisplayNone");
});

PersonalInfoButton.addEventListener("click", e => {
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
});
SpeciesInfoButton.addEventListener("click", e => {
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
    );
});
VehiclesInfoButton.addEventListener("click", e => {
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
            "max_atmosphering_speed",
            "model",
            "passengers",
            "vehicle_class"
        ],
        0
    );
});

let lodash = 0;
AllPersonsButton.addEventListener("click", e => {
    
    if (persons.length == 0 && lodash == 0) {
        lodash = lodash+1;
        AllPersonWrapper.classList.toggle("DisplayNone");
        CharacterFinder.classList.toggle("DisplayNone");
        getAllPersons().then(respone => {
            persons.forEach(function(person) {
                let personP = document.createElement("p");
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


//////////Chect person from list of all characters
AllPersonWrapper.addEventListener("click", e => {
   
   console.log(persons)
    getAllDataAboutPerson(persons, e.target.innerHTML)

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
    VehiclesInfoButton.innerHTML = "Vehicles Info";
    VehiclesInfoButton.setAttribute("class", `PersonCardMenu`);
    PersonCard.prepend(VehiclesInfoButton);
    SpeciesInfoButton.innerHTML = "Species Info";
    SpeciesInfoButton.setAttribute("class", `PersonCardMenu`);
    PersonCard.prepend(SpeciesInfoButton);    
    PersonalInfoButton.innerHTML = "Personal Info";
    PersonalInfoButton.setAttribute("class", `PersonCardMenu`);
    PersonCard.prepend(PersonalInfoButton);  
    AllPersonWrapper.classList.toggle("DisplayNone");
    CharacterFinder.classList.toggle("DisplayNone");


});

//////////END   Chect person from list of all characters

///////////////////////////////////////////////////////////////
///////////////////       End User Actions
///////////////////////////////////////////////////////////////


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

            console.log(persons)
        });
}

////////////////END Get all persons from API and Create ID's for all persons ///////////////////////









////////////////////////// Find Person ////////////////////////////////
//////////////opóźnienie przy wyszukiwaniu
let timeout = null;
SearchForm.onkeyup = function(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        letsSearch(SearchForm.value);
     
    }, 1000);
};
////////////// End opóźnienie przy wyszukiwaniu

async function letsSearch(SearchItem) {
    if(SearchItem==undefined || SearchItem==""){}
    else{
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
        response.data.results.forEach(function(person, number) {
            let ElementList = document.createElement("p");
            ElementList.innerHTML = `${person.name}`;
            ElementList.setAttribute("class", `ElementList`);
            person.id = number;
            SearchResults.appendChild(ElementList);
            SearchListResults.push(person);
        });
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("post Request canceled");
        }
        console.error(error);
        console.log("Istanieje pewien prolbem z API");
    }
}}

////////////////////////// END Find Person //////////////////////////////
////////////////////////// Select person from SearchResults //////////////////////////////
SearchResults.addEventListener("click", e => {
  e.target.innerHTML;
 
  getAllDataAboutPerson(SearchListResults, e.target.innerHTML)


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

                VehiclesInfoButton.innerHTML = "Vehicles Info";
                VehiclesInfoButton.setAttribute("class", `PersonCardMenu`);
                PersonCard.prepend(VehiclesInfoButton);
                SpeciesInfoButton.innerHTML = "Species Info";
                SpeciesInfoButton.setAttribute("class", `PersonCardMenu`);
                PersonCard.prepend(SpeciesInfoButton);    
                PersonalInfoButton.innerHTML = "Personal Info";
                PersonalInfoButton.setAttribute("class", `PersonCardMenu`);
                PersonCard.prepend(PersonalInfoButton);
              
           
    SearchResults.innerHTML = "";
    SearchForm.value = "";


});

////////////////////////// END Show SearchResults //////////////////////////////


/////////////////////Table Generator ///////////
const TableGenerator = (object, parmArr, ObjNumber) => {
    let NewTableParameters = document.createElement("ul");
    let NewTableParametersValue = document.createElement("ul");
    InfoTable.innerHTML = "";



    ///////////////////Array object
    if (Array.isArray(object)) {
        object.forEach(function(obj, num) {
            if (num == ObjNumber) {
                let arreyOfParam = Object.keys(obj);
                parmArr.forEach(function(param) {
                    arreyOfParam.forEach(function(item, number) {
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
        let arreyOfParam = Object.keys(object);

        parmArr.forEach(function(param) {
            arreyOfParam.forEach(function(item, number) {
                if (item.includes(param)) {
                    ///create parameters item
                    let ParamElementList = document.createElement("li");
                    ParamElementList.innerHTML = `${arreyOfParam[number]}`;
                    ParamElementList.setAttribute("class", `ListHeader`);

                    NewTableParameters.appendChild(ParamElementList);
                    ///create parameters value item

                    let ParamValueElementList = document.createElement("li");
                    ParamValueElementList.innerHTML = `${
                        object[arreyOfParam[number]]
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




/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const GetFromApi = (x, y, z) => {
    
    
    if (Array.isArray(x)) {
        y[z] = [];
        x.forEach(function(item) {
            const ApiRequest = axios.get(item);
            ApiRequest.then(
                response => {
                    y[z].push(response.data);
                },
                reason => console.log(reason)
            );
        });
    } else {
        const ApiRequest = axios.get(x);
        ApiRequest.then(
            response => {
                if (z) {
                    y[z] = response.data;
                } else {
                    y.push(response.data);
                }
            },
            reason => console.log(reason)
        );
    }
};







function getAllDataAboutPerson(dataList, personName){

   
if(!personsWithData.includes(personName)){

personsWithData.push(personName);
dataList.forEach(function(person){         
    if(person.name == personName){        //////////find person        
    
        ChoosenPersonData = person;
     
        GetFromApi(
            ChoosenPersonData.homeworld,
            ChoosenPersonData,
            "homeworld"
        )
        GetFromApi(
            ChoosenPersonData.starships,
            ChoosenPersonData,
            "starships"
        )
        GetFromApi(ChoosenPersonData.films,
             ChoosenPersonData, 
             "films")
        GetFromApi(
            ChoosenPersonData.vehicles,
            ChoosenPersonData,
            "vehicles"
        )
        GetFromApi(
            ChoosenPersonData.species,
            ChoosenPersonData,
            "species"
        )
    }
})}


}