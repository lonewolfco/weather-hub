// declare variables related to API call
var zipInputEl = document.querySelector('#zipcode');
var zipFormEl = document.querySelector('#zip-form');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.getElementById("#today-wind");
var todayHumidity = document.getElementById("#today-humidity");
var todayUV = document.getElementById("#today-uv");
var todaysDateEl = document.querySelector('#todays-date');

// moment in time for today's forecast
var today = moment();
todaysDateEl.textContent = (today.format("dddd, MMMM Do YYYY"));



var zipFormSubmit = function (event) {
    event.preventDefault();
  
    var zipcode = zipInputEl.value.trim();
  
    if (zipcode) {
      getWeatherData(zipcode);
  
      repoContainerEl.textContent = '';
      nameInputEl.value = '';
    } else {
      alert('Please enter a GitHub username');
    }
  };
  




var getWeatherData = function (weather) {
    var APIkey = "7bf5850a0af8a9b096b521ae4589d3bf";
    var zipcode = zipInputEl.value.trim();
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + '&appid=' + APIkey;
    
    fetch(requestUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // displayForecast(data, weather);
            todayTemp.textContent = "Temperature: " + Math.floor((data.main.temp - 273.15) * 1.8 + 32) + "°F";

            todayWind.textContent = 'Wind: ' + Math.floor(data.wind.speed * 2.237) + 'mph';
            todayHumidity = 'Humidity: ' + data.main.humidity + '%';
            // todayUV = 'UV Index: ' + data.;
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to recgonize zip code');
      });
  };

 
            // "Temperature: " + Math.floor(data.main.temp - kelvin * 1.8 + 32) + "°F";

zipFormEl.addEventListener("submit", getWeatherData);
