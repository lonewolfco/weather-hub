
// declare variables related to API call
var zipInputEl = document.querySelector('#zipcode');
var zipFormEl = document.querySelector('#zip-form');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.querySelector("#today-wind");
var todayHumidity = document.querySelector("#today-humidity");
var todayUV = document.querySelector("#today-uv");
var todaysDateEl = document.querySelector('#todays-date');
var icon = document.querySelector("#icon");

// moment in time for today's forecast
var today = moment();
todaysDateEl.textContent = (today.format("dddd, MMMM Do YYYY"));








var getWeatherData = function (weather) {
    var APIkey = "256e015175e41b85d6b79c9fecee47d5";
    var zipcode = zipInputEl.value.trim();
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + '&appid=' + APIkey;
    
    console.log(weather);

    fetch(requestUrl)
      .then(function (response) {
          console.log(response);
          return response.json();
      })
        // if (response.ok) {
        //   console.log(response);response.json().
        
        .then(function (data) {
            console.log(data);
            todayTemp.textContent = "Temperature: " + Math.floor((data.main.temp - 273.15) * 1.8 + 32) + "°F";
            var icon1 = data.weather[0].icon;
            icon.innerHTML = `<img src="./assets/icons/${icon1}.png" style= 'height:10rem'/>`;
            todayWind.textContent = "Wind: " + Math.floor(data.wind.speed * 2.237) + "mph";
            todayHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';
            // todayUV = 'UV Index: ' + data.;
          });
    //     } else {
    //       alert('Error: ' + response.statusText);
    //     }
    //   })
    //   .catch(function (error) {
    //     alert('Unable to recgonize zip code');
    //   });
  };

  zipFormEl.addEventListener("submit", getWeatherData);