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

// moment in time for today's forecast
var today = moment();
todaysDateEl.textContent = (today.format("dddd, MMMM Do YYYY"));

  


function getWeather (event) {
  var APIkey = "256e015175e41b85d6b79c9fecee47d5";
  var cityName = cityInputEl.value.trim();
  console.log(cityName);
  var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIkey;
  console.log(requestUrl);
  event.preventDefault();
 
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
      

        // make another api call to pull in UV Data
        var uvAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&appid=" + APIkey + "&cnt=1";

        fetch(uvAPI)
        .then(function (response) {
          console.log(response);
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);

    
            todayUV.textContent = "UV Index: " + data.current.uvi;

            saveHistory ();
          }) } })  }) } })

};

// set search history to local storage based on what was entered in the user input search
function saveHistory () {
  var cityName = cityInputEl.value;
  history.push(cityName);
  localStorage.setItem("search-history", JSON.stringify(history));
  renderSearchHistBtns ();
}

function renderSearchHistBtns () {
  btnContainer.innerHTML = "";

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

clearBtn.addEventListener("click",function() {
  localStorage.removeItem("search-history");
  history = [];
  console.log(history);
  renderSearchHistBtns();
})


// // gets today's weather data and appends the data to the today's weather report accordion item
// function getWeatherData () {
//     var APIkey = "c9a9ed03a355403f4cb9a36e931c0b4a";
//     var cityName = cityInputEl.value.trim();
//     localStorage.setItem("history", JSON.stringify(cityName));
//     event.console.log(cityName);
//     var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=' + cityName + '&appid=' + APIkey;
    
//     fetch(requestUrl)
//       .then(function (response) {
//           console.log(response);
//         if (response.ok) {
//           console.log(response);
//           response.json().then(function (data) {
//             console.log(data);

//             // declare lat & lon variables from data received
//             var lat = response.data.coord.lat;
//             var lon = response.data.coord.lon;

//             // append values of today's forecast
//             todaysDateEl.textContent = today.format("dddd, MMMM Do YYYY") + " in " + response.data.name;
//             todayTemp.textContent = "Temperature: " + Math.floor((response.data.main.temp - 273.15) * 1.8 + 32) + "°F";
//             var icon1 = data.weather[0].icon;
//             icon.innerHTML = `<img src="./assets/icons/${icon1}.png" style= 'height:10rem'/>`;
//             todayWind.textContent = "Wind: " + Math.floor(response.data.wind.speed * 2.237) + "mph";
//             todayHumidity.textContent = 'Humidity: ' + response.data.main.humidity + '%';


//             // make another api call to pull in UV Data
//             var uvAPI = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";

//             fetch(uvAPI)
//               .then(function (response) {
//                 console.log(response);
//                 var uvIndex = document.createElement("span");
//                 uvIndex.setAttribute("class","badge badge-danger");
//                 uvIndex.textContent = response.data[0].value;
//                 todayUV.textContent = "UV Index: ";
//                 todayUV.append(uvIndex);
//               })

//             // todayUV = 'UV Index: ' + data.;
//           });
//         } else {
//           console.log(response);
//           preventDefault ();
//           alert('Error: ' + response.statusText);
//         }
//       })
//       .catch(function (error) {
//         preventDefault ();
//         console.log(error);
//         console.log(response);
//         alert('Unable to recgonize zip code');
//       });
//       // run search history function
//       // appendHistory();
//   };


  // function appendHistory () {
  //   // gets search history to local storage
  //     var history = (localStorage.getItem(history));
  //     console.log(history);

  //   array.forEach(history => {
  //     var newButton = document.createElement('button')
  //     newButton.classList.add("btn btn-primary");
  //     newButton.textContent = history;
  //     btnContainer.append(newButton);
  //   }); 
    
    // for(i = 0; i < history.length; i++) {
    //   var newButton = document.createElement(button, {is:SubmitEvent} )
    //   newButton.classList.add("btn btn-primary");
    //   newButton.textContent = history;
    //   btnContainer.append(newButton);
      
    // }
    
  
  

 
            // "Temperature: " + Math.floor(data.main.temp - kelvin * 1.8 + 32) + "°F";
function handleForm(event) {event.preventDefault();};
cityFormEl.addEventListener("submit", getWeather);
