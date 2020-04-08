
$( document ).ready( () => {

    const domRefs = {
        cityNameInput: $( ".search-input" ),
        currentWeather: $( ".current-weather-area" ),
        forecast: $( ".weather-forecast-area" ),
    };

    const SCHEDULE_DATA = "SCHEDULE_DATA";
    const API_KEY = "f41bacc17b33c9263b7d935d88070b40";
    const DATE_FORMAT = "MMM D"


    addListeners()



    function getCityNameFromInput() {
        return domRefs.cityNameInput.val();
    }

    function saveCityName( cityName ) {
        const scheduleData = loadScheduleData();
        if ( !scheduleData.includes( cityName ) ) {
            scheduleData.push( cityName );
            saveScheduleData( scheduleData );
        }
    }

    function loadScheduleData() {
        let data = localStorage.getItem( SCHEDULE_DATA );

        // If Else Example

        // if (data) {
        //     data = JSON.parse(data);
        // } else {
        //     data = [];
        // }
        // return data;

        // Ternary Example
        return data ? JSON.parse( data ) : []
    }

    function saveScheduleData( scheduleData ) {
        localStorage
            .setItem( SCHEDULE_DATA, JSON.stringify( scheduleData ) )
    }

    function generateCurrentWeatherCard( { date, temp, humidity, uvi, icon, windSpeed } ) {
        // taken out of play in favor of the template function templateCurrentWeatherCard

        const $card = $( "<div class='current-weather-card'>" )

        const $date = generateCardRow( "", date );
        const $temp = generateCardRow( "Temperature: ", temp );
        const $humidity = generateCardRow( "Humidity: ", humidity );
        const $windspeed = generateCardRow( "Wind Speed: ", windSpeed );
        const $uvIndex = generateCardRow( "UV Index: ", uvi );

        $card.append( $date, $temp, $humidity, $windspeed, $uvIndex );

        return $card1;
    }

    function templateCurrentWeatherCard( { date, temp, humidity, uvi, icon, windSpeed } ) {
        return `<div class="current-weather-card">
            <div> <h2>${ date }</h2></div>
            <div><h3>Temperature</h3><h5>${ temp } F</h5></div>
            <div><h3>Humidity</h3><h5>${ humidity }%</h5></div>
            <div><h3>Wind Speed</h3><h5>${ windSpeed } mph</h5></div>
            <div><h3>UV Index</h3><h5>${ uvi }</h5></div>
        </div>`
    }

    function generateCardRow( label, value ) {
        const $row = $( "<div>" ).append( `<h3>${ label }</h5>` );
        const $value = $( "<span>" ).text( value );
        $row.append( $value );
        return $row;
    }



    function generateForecastCard( data ) {
        const $img = $( "<img>" ).attr( "src", data.icon );
        const $temp = $( "<div>" ).text( `${ data.temp } F` ).prepend( "<span>Temp: </span>" );
        const $humidity = $( "<div>" ).text( data.humidity ).prepend( "<span>Humidity: </span>" );

        const $card = $( "<div class='forecast-card'>" );
        $card.append( $img, $temp, $humidity );
        return $card;
    }

    function generateForecastCards( forecastArray ) {
        const $container = $( "<div class='forecast-container'>" );
        const $cards = forecastArray.map( day => generateForecastCard( day ) );
        $container.append( ...$cards );
        return $container;
    }

    function addListeners() {
        $( ".search-btn" ).on( "click", handleClickSearch );

    }

    function handleClickSearch( event ) {
        event.preventDefault();
        const cityName = getCityNameFromInput();
        saveCityName( cityName );
        getWeatherData( cityName );
    }

    function getWeatherData( cityName ) {

        fetchLatAndLon( cityName )
            .then( fetchWeatherData )
            .then( ( { current, daily } ) => {
                const $currentWeatherCard = templateCurrentWeatherCard( extractCurrentWeatherData( current ) )
                updateCurrentWeather( $currentWeatherCard )

                console.log( daily )
                const $forecastCards = generateForecastCards( extractForecastData( daily ) );
                updateForecast( $forecastCards );
            } )
            .catch( err => console.error( err ) );
    }

    function extractForecastData( dailyData ) {
        const fiveDays = [];
        for ( let i = 0; i < 5; i++ ) {
            fiveDays.push( extractSingleDataForecastData( dailyData[ i ] ) );
        }
        return fiveDays;
    }

    function extractSingleDataForecastData( { dt, temp: { day }, humidity, weather: [ { icon } ] } ) {
        return { date: moment.unix( dt ).format( DATE_FORMAT ), temp: day, humidity, icon: iconURL( icon ) }
    }

    function updateForecast( container ) {
        domRefs.forecast.empty();
        domRefs.forecast.append( container );
    }

    function updateCurrentWeather( card ) {
        domRefs.currentWeather.empty();
        domRefs.currentWeather.append( card );
    }

    function fetchLatAndLon( cityName ) {
        return $.ajax( {
            url: latAndLonURL( cityName ),
            method: "GET",
        } )
    }

    function fetchWeatherData( { coord } ) {
        return $.ajax( {
            url: weatherDataURL( coord ),
            method: "GET",
        } )
    }

    function extractCurrentWeatherData( { dt, temp, humidity, uvi, weather: [ { icon } ], wind_speed: windSpeed } ) {
        return { date: moment.unix( dt ).format( DATE_FORMAT ), temp, humidity, uvi, icon: iconURL( icon ), windSpeed }
    }

    function latAndLonURL( cityName ) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${ cityName }&appid=${ API_KEY }`
    }

    function weatherDataURL( { lat, lon } ) {
        return `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&units=imperial&appid=${ API_KEY } `;
    }

    function iconURL( icon ) {
        return `http://openweathermap.org/img/wn/${ icon }@2x.png`;
    }
} )