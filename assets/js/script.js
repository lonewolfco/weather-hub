// declare variables related to API call
var cityInputEl = document.querySelector('#cityName');
var cityFormEl = document.querySelector('#city-form');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.querySelector("#today-wind");
var todayHumidity = document.querySelector("#today-humidity");
var todayUV = document.querySelector("#today-uv");
var todaysDateEl = document.querySelector('#todays-date');
var icon = document.querySelector("#icon");
var btnContainer = document.querySelector("#btn-div");
let history = JSON.parse(localStorage.getItem("search-history")) || [];
var clearBtn = document.querySelector("#clear-btn");
console.log(history)

// var cityName = cityInputEl.value.trim();

// moment in time for today's forecast
var today = moment();
todaysDateEl.textContent = (today.format("dddd, MMMM Do YYYY"));

var fiveDayData =  [
  {
    card: "0",
  },
  {
    card: "1",
  },
  {
    card: "2",
  },
  {
    card: "3",
  },
  {
    card: "4",
  }
]
  

// function to do the various api call outs to bring in weather data
function getWeather (cityName) {
  var APIkey = "256e015175e41b85d6b79c9fecee47d5";
  // var cityName = cityInputEl.value.trim();
  console.log(cityName);


  // first api call to find the lat and lon from the city name entered in the search field
  var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIkey;
  console.log(requestUrl);
  // event.preventDefault();
 
  fetch(requestUrl)
  .then(function (response) {
      console.log(response);
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);

        // declare lat & lon variables from data received
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log(lat);
        console.log(lon);

        // append values of today's forecast
        todaysDateEl.textContent = today.format("dddd, MMMM Do YYYY") + " in " + data.name;
        todayTemp.textContent = "Temperature: " + Math.floor((data.main.temp - 273.15) * 1.8 + 32) + "°F";
        var icon1 = data.weather[0].icon;
        icon.innerHTML = `<img src="./assets/images/${icon1}.png" style= 'height:10rem'/>`;
        todayWind.textContent = "Wind: " + Math.floor(data.wind.speed * 2.237) + "mph";
        todayHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';
      

        // make another api call using the lat and lon information to bring in UV Data & 5 day Forecast from onecall portion of openweathermap api
        var uvAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&appid=" + APIkey + "&cnt=1";

        fetch(uvAPI)
        .then(function (response) {
          console.log(response);
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);

            // Fill in UV Index Data
            todayUV.textContent = "UV Index: " + data.daily[0].uvi;
              if (data.daily[0].uvi < 2 ) {
                todayUV.classList.add("bg-success");
              } else if (data.daily[0].uvi >= 3 && data.current.uvi < 7) {
                todayUV.classList.add("bg-warning");
              } else if (data.daily[0].uvi >= 8) {
                todayUV.classList.add("bg-danger");
              }


              // Bring in 5 Day Forecast Data
              fiveDayData.forEach(function(fiveDayEl, index) {

                var cardContainer = document.querySelector("#card-container");

                // Card Column Div
                // var cardCol = document.createElement('div');
                //   cardCol.className = "col-sm-12 col-md-5 col-lg-2 forecast";
                //   cardCol.id = fiveDayEl.card;
                //   cardContainer.append(cardCol);

                // Card Element Div
                var cardEl = document.createElement('div');
                  cardEl.className = "col bg-primary text-white rounded mx-2 mb-3";
                  cardContainer.append(cardEl);

                // Card Body Div
                // var cardBody = document.createElement('div');
                //   cardBody.classList.add("card-body");
                //   cardEl.append(cardBody);

                // Card Date Title
                var cardDate = document.createElement('h5');
                  cardDate.className = "mt-3 mb-0";
                  let tomorrow  = moment().add([index],'days');
                  cardDate.textContent = (tomorrow.format("L"));
                 
                // Card Icon
                var cardIcon = document.createElement('div');
                  cardIcon.classList.add("m-2")
                  var forecastIcon = data.daily[index].weather[0].icon;
                  console.log(forecastIcon);
                  cardIcon.innerHTML = `<img src="./assets/images/${forecastIcon}.png" style= 'height:4rem'/>`;
                

                // Card Temp Text
                var cardTemp = document.createElement('p');
                  cardTemp.classList.add("card-text");
                  cardTemp.textContent = "Temp: " + Math.floor((data.daily[index].temp.day - 273.15) * 1.8 + 32) + "°F";
                 

                // Card Wind Text
                var cardWind = document.createElement('p');
                  cardWind.classList.add("card-text");
                  cardWind.textContent = "Wind: " + Math.floor(data.daily[index].wind_speed * 2.237) + "mph";
                

                  // Card Humidity Text
                  var cardHumidity = document.createElement('p');
                    cardHumidity.classList.add("card-text");
                    cardHumidity.textContent = "Wind: " + data.daily[index].humidity+ "%";
                  

                  cardEl.append(cardDate, cardIcon, cardTemp, cardWind, cardHumidity);

                  console.log(index);
              })

            // saveHistory ();
          }) } })  }) } })

};

// set search history to local storage based on what was entered in the user input search
// function saveHistory () {
//   var cityName = cityInputEl.value;
//   history.push(cityName);
//   localStorage.setItem("search-history", JSON.stringify(history));
//   renderSearchHistBtns ();
// }



// function to create the history buttons and set off the getWeather function with the values once they are pressed
function renderSearchHistBtns () {
  btnContainer.innerHTML = "";
// for loop to create the search history buttons
// ---> might need to change button to an input since on button click, it is not refreshing to the city on the history button
    for(let i=0; i<history.length; i++) {
        var histBtn = document.createElement("button");
        histBtn.setAttribute("type", "submit");
        // histBtn.setAttribute("readonly", true);
        histBtn.setAttribute("class", "btn btn-primary");
        histBtn.setAttribute("id", "history-btn");
        histBtn.textContent = history[i];
        histBtn.addEventListener("click", function () {
          getWeather(histBtn.value);
        })
        btnContainer.append(histBtn);
    }
}

// keeps the search history buttons in view on refresh
// ---->bug going on where an extra button is there even though subtracting 1
renderSearchHistBtns();
if (history.length > 0) {
    getWeather(history[history.length - 1]);
}

// when the clear history button is pressed, remove data from local storage and clear out the history array
clearBtn.addEventListener("click",function() {
  localStorage.removeItem("search-history");
  history = [];
  // todayUV.classList.remove("bg-success");
  // todayUV.classList.remove("bg-warning");
  // todayUV.classList.remove("bg-danger");
  console.log(history);
  renderSearchHistBtns();
})



// prevent reload when submit button is pressed
function handleForm(event) {event.preventDefault();};

// event listener for when the search button is pressed to run the function that saves the var cityname
cityFormEl.addEventListener("submit", cityFunction);

// function to set the cityName variable after the search button is pressed

function cityFunction () {
  var searchedCity = cityInputEl.value.trim();
  todayUV.classList.remove("bg-success");
  todayUV.classList.remove("bg-warning");
  todayUV.classList.remove("bg-danger");
  getWeather(searchedCity);
  history.push(searchedCity);
  localStorage.setItem("search-history", JSON.stringify(history));
  renderSearchHistBtns ();

}
