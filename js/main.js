var infoTable = document.createElement("div");
var personCard = document.querySelector("#PersonCard");
infoTable.setAttribute("id", "InfoTable");
window.addEventListener("load", function() {
  creatAppView();
});

var creatAppView = function creatAppView() {
  personCard.appendChild(infoTable);
}; /////////////////////////////////////////////////////////
////////// Varible and elements
/////////////////////////////////////////////////////////

var apiSrc = "https://swapi.co/api/";
var mainTitle = document.querySelector("#MainTitle");
var searchForm = document.querySelector("#FindPerson");
var searchResults = document.querySelector("#SearchResults");
var personItemList = document.querySelector("#PersonItemList");
var loadingInfo = document.querySelector("#LoadingInfo");
var contentContainer = document.querySelector("#ContentContainer");
var errorInfo = document.querySelector("#ErrorInfo");
var searchData = document.querySelector("#SearchData");
var allPersonsButton = document.querySelector("#AllPersonsButton");
var allPersonWrapper = document.createElement("div");
var personCardInfo = document.createElement("div");
var personalInfoButton = document.createElement("div");
var speciesInfoButton = document.createElement("div");
var vehiclesInfoButton = document.createElement("div");
var starshipsInfoButton = document.createElement("div");
var characterFinder = document.querySelector("#CharacterFinder");
var persons = [];
var personsWithData = [];
var searchListResults = [];
var choosenPersonData = [];
var CancelToken = axios.CancelToken;
var cancel;
var lodash = 0;
allPersonWrapper.setAttribute("class", "DisplayNone");
allPersonWrapper.setAttribute("id", "AllPersonWrapper");
infoTable.appendChild(personCardInfo); /////////////////////////////////////////////////////////
//////////////END Varible and elements
/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
///////////////User Actions
//////////////////////////////////////////////////////

mainTitle.addEventListener("click", function(e) {
  location.reload();
});
personalInfoButton.addEventListener("click", function(e) {
  infoTable.classList.add("ShowInfoTable");
  toggleCard(e.target);
  showPersonTable();
});
speciesInfoButton.addEventListener("click", function(e) {
  infoTable.classList.add("ShowInfoTable");
  toggleCard(e.target);
  showSpeciesTable();
});
vehiclesInfoButton.addEventListener("click", function(e) {
  infoTable.classList.add("ShowInfoTable");
  toggleCard(e.target);
  showVehicles(1);
});
starshipsInfoButton.addEventListener("click", function(e) {
  infoTable.classList.add("ShowInfoTable");
  toggleCard(e.target);
  showStarships(1);
});
allPersonsButton.addEventListener("click", function(e) {
  if (persons.length == 0 && lodash == 0) {
    lodash = lodash + 1;
    allPersonWrapper.classList.toggle("DisplayNone");
    characterFinder.classList.toggle("DisplayNone");
    getAllPersons().then(function(respone) {
      persons.forEach(function(person) {
        var personP = document.createElement("p");
        personP.setAttribute("class", "PersonItem");
        personP.innerHTML = "" + person.name;
        allPersonWrapper.appendChild(personP);
      });
      contentContainer.appendChild(allPersonWrapper);
    });
  } else {
    if (!characterFinder.classList.contains("DisplayNone")) {
      characterFinder.classList.add("DisplayNone");
    }

    allPersonWrapper.classList.remove("DisplayNone");
  }
}); //////////Choose person from list of all characters

allPersonWrapper.addEventListener("click", function(e) {
  persons = JSON.parse(window.localStorage.getItem("persons"));
  getAllDataAboutPerson(persons, e.target.innerHTML);
  infoTable.classList.add("ShowInfoTable");
  showPersonTable();
  generatePersonCardMenu();
  allPersonWrapper.classList.toggle("DisplayNone");
  characterFinder.classList.toggle("DisplayNone");
}); //////////END Choose person from list of all characters
////////////////////////// Select person from SearchResults //////////////////////////////

searchResults.addEventListener("click", function(e) {
  getAllDataAboutPerson(searchListResults, e.target.innerHTML);
  infoTable.classList.add("ShowInfoTable");
  toggleCard(e.target);
  showPersonTable();
  generatePersonCardMenu();
  searchResults.innerHTML = "";
  searchForm.value = "";
}); ////////////////////////// END elect person from SearchResults //////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////       End User Actions
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////       API Interaction
///////////////////////////////////////////////////////////////
////////////////Get all persons from API or Localstorage ///////////////////////

async function getAllPersons() {
  if (window.localStorage.getItem("persons")) {
    persons = JSON.parse(window.localStorage.getItem("persons"));
  } else {
    loadingInfo.classList.remove("DisplayNone");
    await axios
      .all([
        axios.get(apiSrc + "people/?page=1"),
        axios.get(apiSrc + "people/?page=2"),
        axios.get(apiSrc + "people/?page=3"),
        axios.get(apiSrc + "people/?page=4"),
        axios.get(apiSrc + "people/?page=5"),
        axios.get(apiSrc + "people/?page=6"),
        axios.get(apiSrc + "people/?page=7"),
        axios.get(apiSrc + "people/?page=8"),
        axios.get(apiSrc + "people/?page=9")
      ])
      .then(function(responseArr) {
        loadingInfo.classList.add("DisplayNone");
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
        window.localStorage.setItem("persons", JSON.stringify(persons));
      });
  }
} ////////////////END Get all persons from API or Localstorage ///////////////////////
////////////////////////// Find Person /////////////////////////////

var timeout = null;

searchForm.onkeyup = function(e) {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    letsSearch(searchForm.value);
  }, 700);
};

async function letsSearch(searchItem) {
  if (searchItem == undefined || searchItem == "") {
  } else {
    searchData.classList.remove("DisplayNone");
    errorInfo.classList.add("DisplayNone");
    var searchUrl = "https://swapi.co/api/people/?search=" + searchItem;

    try {
      var response = await axios.get(searchUrl, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      });
      cancel();
      searchListResults = [];
      searchResults.innerHTML = "";
      response.data.results.forEach(function(person, number) {
        var elementList = document.createElement("p");
        elementList.innerHTML = "" + person.name;
        elementList.setAttribute("class", "ElementList");
        person.id = number;
        searchResults.appendChild(elementList);
        searchListResults.push(person);
      });
      return searchData.classList.add("DisplayNone");
    } catch (error) {
      if (axios.isCancel(error)) {
      }

      errorInfo.classList.remove("DisplayNone");
      setTimeout(function() {
        letsSearch(searchItem);
      }, 8000);
    }
  }
} ////////////////////////// END Find Person //////////////////////////////
/////////////////////////////   Get all info about person    /////////////////////////////////////////

var getAllDataAboutPerson = function getAllDataAboutPerson(
  dataList,
  personName
) {
  personCard.classList.add("DisplayNone");
  allPersonsButton.classList.add("DisplayEvent");
  dataList.forEach(function(person) {
    if (person.name == personName) {
      var countingItems = function countingItems(x) {
        if (Array.isArray(x)) {
          x.itemNumber = x.length;
        } else {
          x = ["" + x];
          x.itemNumber = x.length;
          return x;
        }
      };

      //////////find person
      choosenPersonData = person;
      var axiosRequestObjects = []; /////// array of request object

      axiosRequestObjects = axiosRequestObjects.concat(
        choosenPersonData.homeworld,
        choosenPersonData.starships,
        choosenPersonData.vehicles,
        choosenPersonData.films,
        choosenPersonData.species
      );
      countingItems(choosenPersonData.homeworld);
      countingItems(choosenPersonData.starships);
      countingItems(choosenPersonData.vehicles);
      countingItems(choosenPersonData.films);
      countingItems(choosenPersonData.species);
      var responseArr = [];

      var makeRequestsFromArray = function makeRequestsFromArray(arr) {
        loadingInfo.classList.remove("DisplayNone");
        var index = 0;

        var request = function request() {
          return axios.get(arr[index]).then(function(response) {
            index++;
            responseArr.push(response);

            if (index >= arr.length) {
              return responseArr;
            }

            return request();
          });
        };

        return request();
      };

      makeRequestsFromArray(axiosRequestObjects).then(
        function(responseArr) {
          ///////Request
          loadingInfo.classList.add("DisplayNone");
          choosenPersonData.homeworld = [];
          var numberOfStarships = choosenPersonData.starships.itemNumber;
          choosenPersonData.starships = [];
          var numberOfVehicles = choosenPersonData.vehicles.itemNumber;
          choosenPersonData.vehicles = [];
          var numberOfFilms = choosenPersonData.films.itemNumber;
          choosenPersonData.films = [];
          var numberOfSpecies = choosenPersonData.species.itemNumber;
          choosenPersonData.species = [];
          responseArr.forEach(function(item, num) {
            if (num < 1) {
              choosenPersonData.homeworld.push(item.data);
            } else if (num >= 1 && num < 1 + numberOfStarships) {
              choosenPersonData.starships.push(item.data);
            } else if (
              num >= 1 + numberOfStarships &&
              num < 1 + numberOfStarships + numberOfVehicles
            ) {
              choosenPersonData.vehicles.push(item.data);
            } else if (
              num >= 1 + numberOfStarships + numberOfVehicles &&
              num < 1 + numberOfStarships + numberOfVehicles + numberOfFilms
            ) {
              choosenPersonData.films.push(item.data);
            } else {
              choosenPersonData.species.push(item.data);
            }
          });
          personCard.classList.remove("DisplayNone");
          allPersonsButton.classList.remove("DisplayEvent");
        },
        function(error) {
          loadingInfo.classList.toggle("DisplayNone");
          errorInfo.classList.toggle("DisplayNone");
          setTimeout(function() {
            getAllDataAboutPerson(dataList, personName);
          }, 8000);
        }
      );
    }
  });
}; /////////////////////////////END   Get all info about person    /////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////     END  API interaction
///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/////////////////////Table Generator
/////////////////////////////////////////////////////////////

var tableGenerator = function tableGenerator(person, parmArr, objNumber) {
  var newTableParameters = document.createElement("ul");
  var newTableParametersValue = document.createElement("ul");
  infoTable.innerHTML = ""; ///////////////////Array object

  if (Array.isArray(person)) {
    person.forEach(function(obj, num) {
      if (num == objNumber) {
        var arreyOfParam = Object.keys(obj);
        parmArr.forEach(function(param) {
          arreyOfParam.forEach(function(item, number) {
            if (item.includes(param)) {
              ///create parameters item
              var paramElementList = document.createElement("li");
              paramElementList.innerHTML = "" + arreyOfParam[number];
              paramElementList.setAttribute("class", "ListHeader");
              newTableParameters.appendChild(paramElementList); ///create parameters value item

              var paramValueElementList = document.createElement("li");
              paramValueElementList.innerHTML = "" + obj[arreyOfParam[number]];
              paramValueElementList.setAttribute("class", "ListItem");
              newTableParametersValue.appendChild(paramValueElementList);
            }
          });
        });
      }
    });
  } else {
    /////////////////////// Single Object
    var arreyOfParam = Object.keys(person);
    parmArr.forEach(function(param) {
      arreyOfParam.forEach(function(item, number) {
        if (item.includes(param)) {
          ///create parameters item
          var paramElementList = document.createElement("li");
          paramElementList.innerHTML = "" + arreyOfParam[number];
          paramElementList.setAttribute("class", "ListHeader");
          newTableParameters.appendChild(paramElementList); ///create parameters value item

          var paramValueElementList = document.createElement("li");
          paramValueElementList.innerHTML = "" + person[arreyOfParam[number]];
          paramValueElementList.setAttribute("class", "ListItem");
          newTableParametersValue.appendChild(paramValueElementList);
        }
      });
    });
  }

  newTableParameters.setAttribute("id", "PersonHeaderList");
  infoTable.appendChild(newTableParameters);
  newTableParametersValue.setAttribute("id", "PersonItemList");
  infoTable.appendChild(newTableParametersValue);
}; //////////////////////////////////////////////////////////////
/////////////////////END Table Generator
/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////////// Additional functions
/////////////////////////////////////////////////////////////

var showVehicles = function showVehicles(e) {
  tableGenerator(
    choosenPersonData.vehicles,
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
  generateCardNumbers(choosenPersonData.vehicles, showVehicles);
};

var showStarships = function showStarships(e) {
  tableGenerator(
    choosenPersonData.starships,
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
  generateCardNumbers(choosenPersonData.starships, showStarships);
};

var showPersonTable = function showPersonTable() {
  tableGenerator(choosenPersonData, [
    "name",
    "height",
    "mass",
    "hair_color",
    "skin_color",
    "eye_color",
    "birth_year",
    "gender"
  ]);
};

var showSpeciesTable = function showSpeciesTable() {
  tableGenerator(
    choosenPersonData.species,
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
};

var generatePersonCardMenu = function generatePersonCardMenu() {
  starshipsInfoButton.innerHTML = "Starships Info";
  starshipsInfoButton.setAttribute("class", "PersonCardMenu");
  personCard.prepend(starshipsInfoButton);
  vehiclesInfoButton.innerHTML = "Vehicles Info";
  vehiclesInfoButton.setAttribute("class", "PersonCardMenu");
  personCard.prepend(vehiclesInfoButton);
  speciesInfoButton.innerHTML = "Species Info";
  speciesInfoButton.setAttribute("class", "PersonCardMenu");
  personCard.prepend(speciesInfoButton);
  personalInfoButton.innerHTML = "Personal Info";
  personalInfoButton.setAttribute("class", "PersonCardMenu");
  personCard.prepend(personalInfoButton);
};

var toggleCard = function toggleCard(e) {
  if (e.className == "NumberCard") {
    var numberHaveActiveClass = document.querySelector(".ActiveNumber");

    if (numberHaveActiveClass) {
      numberHaveActiveClass.classList.remove("ActiveNumber");
    }

    var clickElement = e;
    clickElement.classList.add("ActiveNumber");
  } else if (e.className == "PersonCardMenu") {
    var haveActiveClass = document.querySelector(".ActiveElement");

    if (haveActiveClass) {
      haveActiveClass.classList.remove("ActiveElement");
    }

    var _clickElement = e;

    _clickElement.classList.add("ActiveElement");
  }
};

var generateCardNumbers = function generateCardNumbers(param, showFunction) {
  if (param.length == 0) {
    var emptyTable = document.createElement("p");
    emptyTable.setAttribute("class", "emptyTableInfo");
    emptyTable.innerHTML = "That table is empty";
    infoTable.prepend(emptyTable);
  }

  var cardsNumberWrapper = document.createElement("div");
  cardsNumberWrapper.setAttribute("class", "CardsNumberWrapper");
  infoTable.prepend(cardsNumberWrapper);

  if (!(param.length == 1)) {
    for (var i = 0; i < param.length; i++) {
      var numberOfCard = document.createElement("p");
      numberOfCard.setAttribute("class", "NumberCard");
      numberOfCard.innerHTML = "" + (i + 1);
      cardsNumberWrapper.appendChild(numberOfCard);
      numberOfCard.addEventListener("click", function(e) {
        showFunction(e.target.innerHTML);
      });
    }
  }
}; //////////////////////////////////////////////////////////////
///////////////////// END Additional functions
/////////////////////////////////////////////////////////////
