/**
 * on load:
 *  user sees: input for searching by city name
 *             button at end of input for submitting search
 *             list of previous searches: when clicked submits that query again
 * 
 * 
 *  when user clicks submit:
 *      the city name is retrieved from input.
 *          input is validated as alphabetical characters
 *      the city name is saved in history if not already saved
 *      city name is passed to fetch function
 * 
 * fetch function:
 *  - get lat & lon
 *  - get all weather data for city
 *  - extract required data from response data
 *  - update dom with data: updateDOM();
 * 
 * updateDOM:
 *  - clear out any previous elements in containers: current-weather-container, forecast-container
 *  
 */
$(document).ready(() => {

    const domRefs = {
        cityNameInput: $(".search-input"),
    };

    const SCHEDULE_DATA = "SCHEDULE_DATA";
    const API_KEY = "8fa0090fd319eb6475948e3790aed3fd";


    addListeners()



    function getCityNameFromInput() {
        return domRefs.cityNameInput.val();
    }

    function saveCityName(cityName) {
        const scheduleData = loadScheduleData();
        if (!scheduleData.includes(cityName)) {
            scheduleData.push(cityName);
            saveScheduleData(scheduleData);
        }
    }

    function loadScheduleData() {
        let data = localStorage.getItem(SCHEDULE_DATA);

        // If Else Example
        // if (data) {
        //     data = JSON.parse(data);
        // } else {
        //     data = [];
        // }
        // return data;

        // Ternary Example
        return data ? JSON.parse(data) : []
    }

    function saveScheduleData(scheduleData) {
        localStorage
            .setItem(SCHEDULE_DATA, JSON.stringify(scheduleData))
    }

    function generateCurrentWeatherCard(weatherData) {
        const $card = $("<div class='current-weather-card'>")

        const $date = generateCardRow("", weatherData.date);
        const $temp = generateCardRow("Temperature: ", weatherData.temp);
        const $humidity = generateCardRow("Humidity: ", weatherData.humidity);
        const $windspeed = generateCardRow("Wind Speed: ", weatherData.windspeed);
        const $uvIndex = generateCardRow("UV Index: ", weatherData.uvIndex);

        $card.append($date, $temp, $humidity, $windspeed, $uvIndex);

        return $card;
    }

    function generateCardRow(label, row) {
        const $row = $("<div>").text(label);
        const $value = $("<span>").text(value);
        $row.append($value);
    }

    function generateForecastCard(data) {
        const $img = $("<img>").attr("src", data.iconURL);
        const $temp = $("<div>").text(data.temp);
        const $humidity = $("<div>").text(data.humidity);

        const $card = $("<div class='forecast-card'>");
        $card.append($img, $temp, $humidity);
        return $card;
    }

    function generateForecastCards(forecastArray) {
        const $container = $("<div class='forecast-container'>");
        const $cards = forecastArray.map(day => generateForecastCard(day));
        $container.append(...$cards);
        return $container;
    }

    function addListeners() {
        $(".search-btn").on("click", handleClickSearch);

    }

    function handleClickSearch(event) {
        event.preventDefault();
        console.log("Click")
        const cityName = getCityNameFromInput();
        console.log(cityName)
        saveCityName(cityName);

        getWeatherData(cityName);
    }

    function getWeatherData(cityName) {
        // get lon lat, get weather data, create cards, append cards
        console.log('get weather data')

        fetchLatAndLon(cityName)
            // .then( fetchWeatherData )
            // .then( response => {
            //     console.log(response)
            // })
    }

    function fetchLatAndLon( cityName ) {
        console.log('fetching lat and lon for ', cityName)
        const url = latAndLonURL( cityName )
        console.log( url );
        return $.ajax({
            url: url,
            method: "GET",
        })
        .then( resp => console.log( resp ) )
        .catch( error => console.error( error ))
    }

    function fetchWeatherData({ coords }) {
        console.log('weather data fetch')
        console.log(coords)
        return $.ajax({
            url: weatherDataURL( coords ),
            method: "GET",
        })
    }

    function latAndLonURL(cityName) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${cityName}&appid=${API_KEY}`
    }

    function weatherDataURL({ lat, lon }) {
        return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}appid=${ API_KEY } `;
}
})
