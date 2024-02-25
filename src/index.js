function getApiUrl(city, forecast = false) {
  let apiKey = "1bfa1ab4e6b89407b8af3385at1eocb2";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  if (forecast === true) {
    apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  }
  return apiUrl;
}

function searchCity(city) {
  axios.get(getApiUrl(city)).then(showWeather);
}

function receiveInput(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");

  let city = searchInputElement.value;

  searchCity(city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (hours < 10) {
    hours = "0" + hours;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

function formatShortDay(timestamp) {
  let shortDate = new Date(timestamp * 1000);
  let shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return shortDays[shortDate.getDay()];
}

function showWeather(response) {
  let temperature = Math.round(response.data.temperature.current);
  let humidity = Math.round(response.data.temperature.humidity);
  // Change wind speed currently at m/s to km/h
  let windSpeed = Math.round(response.data.wind.speed) * 3.6;
  let conditionDescription = response.data.condition.description;
  let conditionSrc = response.data.condition.icon_url;
  let city = response.data.city;
  let currentDateElement = document.querySelector("#current-date");
  let time = response.data.time;
  let currentDate = new Date(time * 1000);

  currentDateElement.innerHTML = formatDate(currentDate);

  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = city;

  let currentConditionElement = document.querySelector("#current-condition");
  currentConditionElement.innerHTML = conditionDescription;

  let currentHumidityElement = document.querySelector("#current-humidity");
  currentHumidityElement.innerHTML = `${humidity}%`;

  let currentWindSpeed = document.querySelector("#current-wind");
  currentWindSpeed.innerHTML = `${windSpeed}km/h`;

  let currentConditionIcon = `<img
                                src="${conditionSrc}"
                                class="current-temp-icon"
                                id="current-temp-icon"
                              />
                            `;
  let iconElement = document.querySelector("#icon");
  iconElement.innerHTML = currentConditionIcon;

  let currentTempElement = document.querySelector("#current-temp-value");
  currentTempElement.innerHTML = temperature;

  let requestForecast = true;
  getForecast(city, requestForecast);
}

function getForecast(city, forecast) {
  axios.get(getApiUrl(city, forecast)).then(showForecast);
}

function showForecast(response) {
  let forecastDataInjection = "";

  let dailyForecastData = response.data.daily;

  dailyForecastData.forEach(function (day, index) {
    if (index < 5) {
      let max = Math.round(day.temperature.maximum);
      let min = Math.round(day.temperature.minimum);
      let date = day.time;

      forecastDataInjection += `
      <div class="row">
      <div class="col-2">
      <div class="forecast-date">${formatShortDay(date)}</div>
      <img
      src="${day.condition.icon_url}"
      alt=""
      width="40"
          class="forecast-icon" />
          <div class="forecast-temps">
          <span class="forecast-max">${max}°</span>
          <span class="forecast-min">${min}°</span>
          </div>
          </div>
          </div>`;
    }
  });

  let forecastData = document.querySelector("#forecast-data");
  forecastData.innerHTML = forecastDataInjection;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", receiveInput);

searchCity("Asuncion");
