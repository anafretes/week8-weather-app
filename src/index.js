function getApiUrl(city) {
  let apiKey = "1bfa1ab4e6b89407b8af3385at1eocb2";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  return apiUrl;
}

function searchCity(city) {
  axios.get(getApiUrl(city)).then(showCurrentWeather);
}

function receiveInput(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");

  let city = searchInputElement.value;

  searchCity(city);
}

function showCurrentWeather(response) {
  let temperature = Math.round(response.data.temperature.current);
  let humidity = Math.round(response.data.temperature.humidity);
  // Change wind speed currently at m/s to km/h
  let windSpeed = Math.round(response.data.wind.speed) * 3.6;
  let conditionDescription = response.data.condition.description;
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = response.data.city;

  let currentTempElement = document.querySelector(".current-temp-value");
  currentTempElement.innerHTML = temperature;

  let currentConditionElement = document.querySelector("#current-condition");
  currentConditionElement.innerHTML = conditionDescription;

  let currentHumidityElement = document.querySelector("#current-humidity");
  currentHumidityElement.innerHTML = `${humidity}%`;

  let currentWindSpeed = document.querySelector("#current-wind");
  currentWindSpeed.innerHTML = `${windSpeed}km/h`;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", receiveInput);
