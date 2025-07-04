import "./styles.css";
import { getWeather } from "./api.js";

let currentTab = "today"; // Default tab

const cityInput = document.getElementById("city");
const condition = document.getElementById("condition");
const temperature = document.getElementById("temperature");
const icon = document.querySelector("#weather-icon img");
const currentCity = document.getElementById("current-location");
const sunrise = document.getElementById("sunrise-data");
const sunset = document.getElementById("sunset-data");

async function updateWeather(city) {
  try {
    const data = await getWeather(city);
    console.log(data); // Pour voir toute la structure dans la console

    // Exemple d'affichage :
    temperature.textContent = `${data.currentConditions.temp}°C`;
    condition.textContent = data.currentConditions.conditions;
    currentCity.textContent = data.resolvedAddress || city;
    sunrise.textContent = data.currentConditions.sunrise;
    sunset.textContent = data.currentConditions.sunset;
    icon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${data.currentConditions.icon}.png`;

    //Update the tab today

  } catch (error) {
    condition.textContent = "Unable to fetch weather.";
    temperature.textContent = "--";
    icon.src = "";
  }
}


// Appel initial
updateWeather("Lille");

document.getElementById("current-location").addEventListener("click", () => {
  const city = cityInput.value || "London";
  updateWeather(city);
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

function showTab(tabName, evt) {
  // Declare all variables
  var i, tabcontent, days;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="days" and remove the class "active"
  days = document.getElementsByClassName("days");
  for (i = 0; i < days.length; i++) {
    days[i].className = days[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

//Display the default tab
showTab(currentTab, { currentTarget: document.querySelector(`.days[data-id="${currentTab}"]`) });


document.querySelectorAll(".days").forEach((day) => {
day.addEventListener("click", function (evt) {
  showTab(evt.currentTarget.dataset.id, evt);
  currentTab = evt.currentTarget.dataset.id;
});
}
);