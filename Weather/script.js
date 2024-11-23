// List of Major Indian Cities to Show by Default
const majorCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur'
];

// Function to fetch and display weather for major cities by default
async function fetchWeatherForCities() {
    const weatherContainer = document.getElementById('city-weather');
    for (let city of majorCities) {
        const weather = await fetchWeatherData(city);
        if (weather) {
            const cityElement = document.createElement('div');
            cityElement.classList.add('col-12', 'col-md-4', 'city-weather');
            cityElement.innerHTML = `
                <h3>${city}</h3>
                <div class="weather-icon">${getWeatherIcon(weather.description).emoji}</div>
                <p>${getWeatherIcon(weather.description).description}</p>
                <p>Temp: ${weather.temp}°C</p>
            `;
            weatherContainer.appendChild(cityElement);
        }
    }
}

// Function to fetch weather data from Open Meteo API
async function fetchWeatherData(city) {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en`;
    try {
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.results && geocodeData.results.length > 0) {
            const lat = geocodeData.results[0].latitude;
            const lon = geocodeData.results[0].longitude;
            
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            
            // Now using the correct weather code returned from Open Meteo API
            const weatherCode = weatherData.current_weather.weathercode;
            
            return {
                temp: weatherData.current_weather.temperature,
                description: weatherCode,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to handle searching for smaller cities
async function getWeatherFromSearch() {
    const cityInput = document.getElementById('city').value.trim();
    if (cityInput) {
        const weather = await fetchWeatherData(cityInput);
        if (weather) {
            document.getElementById('city-name').textContent = `Weather for ${cityInput}`;
            document.getElementById('temperature').textContent = `Temperature: ${weather.temp}°C`;
            document.getElementById('description').textContent = `Condition: ${getWeatherIcon(weather.description).description}`;
            document.getElementById('weather-info').style.display = 'block';
        } else {
            alert('City not found!');
        }
    }
}

// Function to handle suggestions for smaller cities
const cityInput = document.getElementById('city');
const suggestionsBox = document.getElementById('suggestions');

cityInput.addEventListener('input', async function () {
    const query = cityInput.value.toLowerCase();
    if (query.length < 3) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // Fetch city name suggestions
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Display city name suggestions
        suggestionsBox.innerHTML = '';
        if (data.results && data.results.length > 0) {
            suggestionsBox.style.display = 'block';
            data.results.forEach((result) => {
                const li = document.createElement('li');
                li.textContent = result.name;
                li.onclick = () => selectCity(result.name);
                suggestionsBox.appendChild(li);
            });
        } else {
            suggestionsBox.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
    }
});

// Function to handle selecting a city from suggestions
function selectCity(cityName) {
    cityInput.value = cityName;
    suggestionsBox.style.display = 'none';
}

// Function to get weather icon based on weather condition
function getWeatherIcon(code) {
    const weatherDescriptions = {
        0: { emoji: '☀️', description: 'Clear sky' },
        1: { emoji: '🌤️', description: 'Partly cloudy' },
        2: { emoji: '⛅', description: 'Cloudy' },
        3: { emoji: '🌧️', description: 'Rain' },
        4: { emoji: '🌩️', description: 'Thunderstorm' },
        5: { emoji: '❄️', description: 'Snow' },
        6: { emoji: '🌬️', description: 'Windy' },
    };

    return weatherDescriptions[code] || { emoji: '❓', description: 'Unknown' };
}

// Fetch weather data for major cities on initial page load
fetchWeatherForCities();
