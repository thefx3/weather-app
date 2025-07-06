import "./styles.css";
import { getWeather } from "./api.js";

let currentTab = "today"; // Default tab
let currentCityName = "Paris"; // Default city

const cityInput = document.getElementById("city");
const currentCity = document.getElementById("current-location");
const icon = document.querySelector("#weather-icon img");
const sunrise = document.getElementById("sunrise-data");
const sunset = document.getElementById("sunset-data");

const condition = document.querySelectorAll(".condition-data");
const temperature = document.querySelectorAll(".temp-data");
const humidity = document.querySelectorAll(".humidity-data");
const windspeed = document.querySelectorAll(".wind-data");

let weatherData = [condition, temperature, humidity, windspeed];


async function updateWeather(city = "Paris", tab = "today") {
  try {
    const data = await getWeather(city);
    console.log(data);

    let filterData; 

    switch (tab) {
      case "today":
        currentTab = "today";
        filterData = data.days[0];
        break;
      case "tomorrow":
        currentTab = "tomorrow";
        filterData = data.days[1];
        break
      case "after tomorrow":
        currentTab = "after tomorrow";
        filterData = data.days[2];
        break
      default:
        currentTab = "today";
        filterData = data.days[0];
    }

    weatherData.forEach((dataArray, index) => {
      dataArray.forEach((element) => {
        switch (index) {
          case 0: // condition
            element.textContent = filterData.conditions;
            break;
          case 1: // temperature
            element.textContent = `${filterData.temp}°C`;
            break;
          case 2: // humidity
            element.textContent = `${filterData.humidity}%`;
            break;
          case 3: // windspeed
            element.textContent = `${filterData.windspeed} km/h`;
            break;
        }
      });
    }
    );
    currentCity.textContent = data.resolvedAddress || city;
    sunrise.textContent = data.currentConditions.sunrise;
    sunset.textContent = data.currentConditions.sunset;
    icon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${data.currentConditions.icon}.png`;

  } catch (error) {
    condition.forEach(el => el.textContent = "Unvailable data");
    temperature.forEach(el => el.textContent = "--");
    humidity.forEach(el => el.textContent = "--");
    windspeed.forEach(el => el.textContent = "--");
    sunrise.textContent = "--";
    sunset.textContent = "--";
    icon.src = "";
  }
}

document.getElementById("current-location").addEventListener("click", () => {
  const currentCityName = cityInput.value || "Paris";
  updateWeather(currentCityName, currentTab);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // empêche le rechargement si dans un formulaire
    const city = cityInput.value.trim();
    if (city) {
      updateWeather(city);
    }
  }
});

//Update the weather for the default city 
updateWeather("Paris");

document.querySelectorAll(".days").forEach((day) => {
  day.addEventListener("click", function (evt) {
    currentTab = evt.currentTarget.dataset.id;
    //Add the active class to the clicked tab
    document.querySelectorAll(".days").forEach((d) => d.classList.remove("active"));
    evt.currentTarget.classList.add("active");
    updateWeather(currentCityName, currentTab);
  });
});
