
// declare variables related to API call
var cityInputEl = document.querySelector('#cityName');
var cityFormEl = document.querySelector('#city-form');
var todaySummary = document.querySelector ('#today-summary');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.querySelector("#today-wind");
var todayHumidity = document.querySelector("#today-humidity");
var todayUV = document.querySelector("#today-uv");
var todaysDateEl = document.querySelector('#todays-date');
var icon = document.querySelector("#icon");
var btnContainer = document.querySelector("#btn-div");
let history = JSON.parse(localStorage.getItem("search-history")) || [];
var clearBtn = document.querySelector("#clear-btn");
var cardContainer = document.querySelector("#card-container");
console.log(history)


// moment in time for today's forecast
var today = moment();
todaysDateEl.textContent = (today.format("dddd, MMMM Do YYYY"));


// function to do the various api call outs to bring in weather data
function getWeather (cityName) {
  cardContainer.innerHTML = "";
  var APIkey = "256e015175e41b85d6b79c9fecee47d5";
  console.log(cityName);


  // first api call to find the lat and lon from the city name entered in the search field
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIkey;
 
  fetch(requestUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        // declare lat & lon variables from data received
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log(lat);
        console.log(lon);

        // append values of today's forecast
        todaysDateEl.textContent = today.format("dddd, MMMM Do YYYY") + " in " + data.name;
        todaySummary.textContent = "Summary: Currently, " + data.name + " is experiencing " + data.weather[0].description + ".";
        todayTemp.textContent = "Temperature: " + Math.floor((data.main.temp - 273.15) * 1.8 + 32) + "°F";
        var icon1 = data.weather[0].icon;
        icon.innerHTML = `<img src="./assets/images/${icon1}.png" style= 'height:10rem'/>`;
        todayWind.textContent = "Wind: " + Math.floor(data.wind.speed * 2.237) + "mph";
        todayHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';
      

        // make another api call using the lat and lon information to bring in UV Data & 5 day Forecast from onecall portion of openweathermap api
        var uvAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&appid=" + APIkey + "&cnt=1";

        fetch(uvAPI)
        .then(function (response) {
        if (response.ok) {
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


              // For loop to create 5 Day Forecast Elements
              for (let index = 0; index < 5; index++) {


                // Card Element Div
                var cardEl = document.createElement('div');
                  cardEl.className = "col bg-primary text-white rounded mx-2 mb-3 pb-2";
                  cardContainer.append(cardEl);


                // Card Date Title
                var cardDate = document.createElement('h5');
                  cardDate.className = "mt-3 mb-0";
                  let tomorrow  = moment().add([index],'days');
                  cardDate.textContent = (tomorrow.format("L"));
                 
                // Card Icon
                var cardIcon = document.createElement('div');
                  cardIcon.classList.add("m-2")
                  var forecastIcon = data.daily[index].weather[0].icon;
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
              }

          }) } })  }) } })

};

var historyButtons = document.getElementsByClassName('hist-btn');
var numButtons = historyButtons.length;
console.log (numButtons);



function renderSearchHistBtns() {
  btnContainer.innerHTML = "";
  for (let i=0; i<history.length; i++) {
      const historytBtn = document.createElement("button");
      historytBtn.setAttribute("type","text");
      historytBtn.setAttribute("readonly",true);
      historytBtn.setAttribute("class", "btn text-white btn-primary");
      historytBtn.textContent = history[i];
      historytBtn.setAttribute("value", history[i]);
      historytBtn.addEventListener("click",function() {
          getWeather(historytBtn.value);
      })
      btnContainer.append(historytBtn);
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
  getWeather(searchedCity);
  history.push(searchedCity);
  localStorage.setItem("search-history", JSON.stringify(history));
  renderSearchHistBtns ();

}
