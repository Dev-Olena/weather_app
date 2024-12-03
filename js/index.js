import { fetchWeatherData } from "./apiService.js";
import {createElement, createImgElement} from "./element.js";
import { getDate } from "./currentDate.js";
import {getWeatherIcon} from "./weatherIcons.js";

const form = document.querySelector('#form');
const userSearch = document.querySelector('#search');
const weatherCard = document.querySelector('#weather-card');
const intro = document.querySelector('#intro-text');

const API_KEY = '40729d35d1ef6dabfae8b47b80f4b017';
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}&units=metric&lang={uk}
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
let cityToRender = '';

form.addEventListener('submit', formSubmit);

function formSubmit (e) {
    e.preventDefault();
    const city = userSearch.value.trim();
    if(city != '') {
        cityToRender = city.toUpperCase();
        form.reset();
        displayWeatherAndForecast(city);
    } else {
        weatherCard.replaceChildren(intro);
    }
}

async function displayWeatherAndForecast(city) {
    try {
        const loader = createElement('p', ['loader'], 'завантаження...');
        weatherCard.replaceChildren(loader);
        // поточна погода
        const currentWeather = await fetchWeatherData('weather', city, API_KEY);
        console.log(currentWeather);
        updateWeatherInfo(currentWeather);
        //прогноз
        const forecastWeather = await fetchWeatherData('forecast', city, API_KEY);
        updateForecastInfo(forecastWeather);

        const blocks = document.querySelectorAll('.block');
        blocks.forEach(block => block.classList.add('visible'));
    } catch (error) {
        if(error.message === 'Nothing to geocode') {
            weatherCard.replaceChildren(intro);
        } else {
            const pError = createElement('p',  ['message'], error.message);
            const iconPath = 'assets/icons/error_icon.svg';
            const iconError = createImgElement(iconPath, 'error');
            const errorBlock = createElement('div', ['message-wrapper'], iconError, pError);
            weatherCard.replaceChildren(errorBlock);
        }
    }
 }

// Оновлення поточної погоди
function updateWeatherInfo(weatherObj) {
    const {
        weather: [{main: weatherDescription, id}], 
        main:{temp, feels_like, humidity}, 
        wind:{speed}} = weatherObj;

    const dateToRender = getDate();
    //create city + date block
    const iconPath = 'assets/icons/location_icon.svg';
    const locationIcon = createImgElement(iconPath, 'location');
    const cityName = createElement('h2', [], cityToRender);
    const divCity = createElement('div', ['city'], locationIcon, cityName);
    const date = createElement('h3', ['date'], dateToRender);
    const cityBlock = createElement('div', ['weather-card-row', 'city-block'], divCity, date);   

    //create temp block
    const imgWeather = createElement('img', ['weather-icon']);
    imgWeather.src = `assets/${getWeatherIcon(id)}`;
    imgWeather.setAttribute('alt', weatherDescription);
    const iconWrapper = createElement('div', ['icon-wrapper'], imgWeather);
    const tempValue = createElement('h1', ['temp'], Math.round(temp), ' ℃');
    const feels = createElement('p', ['feels'], 'відчувається як ', Math.round(feels_like), ' ℃');
    const tempWrapper = createElement('div', ['temp-wrapper'], tempValue,    feels);
    const tempBlock = createElement('div', ['weather-card-row', 'temp-block'], iconWrapper, tempWrapper);

    // create wind + humidy block
    const pHumidity = createElement('p', ['humidity'], `вологість ${humidity} %`);
    const pWind = createElement('p', ['wind'], `вітер ${Math.round(speed)} м/с`);
    const windHumidyBlock = createElement('div', ['weather-card-row'], pHumidity, pWind);

    const weatherBlock = createElement('div', ['weather-block', 'block'], cityBlock, tempBlock, windHumidyBlock);
    console.log(weatherBlock)
    weatherCard.replaceChildren(weatherBlock);
}

// Оновлення прогнозу погоди
function updateForecastInfo(forecastObj) {
    console.log(forecastObj);
    const timeBase = '12:00:00';
    const currentDate = new Date().toISOString().split('T')[0];
    const forecastDays = new Map();

    const forecastBlock = createElement('ul', ['forecast-block', 'block']);

    forecastObj.list.forEach(forecastWeather => {
        const [forecastDate, forecastTime] = forecastWeather.dt_txt.split(' ');
        if(forecastDate != currentDate && forecastTime === timeBase) {
            // зберігаємо унікальні дати та прогнози за допомогою Map
            forecastDays.set(forecastDate, forecastWeather);
        }
    });

    // додаємо останній запис прогнозу на 5 день у разі відсутності запису на 12:00
    if(forecastDays.size < 5) {
        const lastForecast = forecastObj.list[forecastObj.list.length-1];
        const lastForecastDate = lastForecast.dt_txt.split(' ')[0];
        if (!forecastDays.has(lastForecastDate)) {
            forecastDays.set(lastForecastDate, lastForecast);
        }
    }

    forecastDays.forEach(forecastWeather => {
        updateForecastItems(forecastWeather, forecastBlock);
    })
    weatherCard.insertAdjacentElement('beforeend', forecastBlock);
}

// Оновлення елементів прогнозу
function updateForecastItems(weatherData, forecastBlock) {
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData;

    const currentDate = new Date(date);
    const options = {
        month: 'short',
        day: 'numeric'
    }
    const dateToRender = currentDate.toLocaleDateString('uk', options);
    const forecastItem = `
            <li class="forecast-item">
                <p class="forecast-item-date">${dateToRender}</p>
                <img  src="assets/${getWeatherIcon(id)}"class="forecast-weather-icon"/>
                <p class="forecast-item-temp">${Math.round(temp)} ℃</p>
            </li>
    `
    forecastBlock.insertAdjacentHTML('beforeend', forecastItem);
}