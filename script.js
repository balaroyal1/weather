const API_KEY = '16d6bd877c81080309ddf407e4407bf6'; // Replace with your actual API key

async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherInfo(data);
        updateForecast(data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = "Failed to fetch weather data. Please try again later.";
    }
}

function updateWeatherInfo(data) {
    document.getElementById('location').textContent = data.timezone.split('/')[1].replace('_', ' ');
    document.getElementById('temperature').textContent = `${Math.round(data.current.temp)}°C`;
    document.getElementById('description').textContent = data.current.weather[0].description;

    // Update weather icon
    const weatherMain = data.current.weather[0].main.toLowerCase();
    document.querySelector('.sun-icon').style.display = weatherMain.includes('clear') ? 'block' : 'none';
    document.querySelector('.cloud-icon').style.display = weatherMain.includes('cloud') ? 'block' : 'none';
}

function updateForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = ''; // Clear existing forecast

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= 3; i++) {
        const forecastData = data.daily[i];
        const dayOfWeek = days[new Date(forecastData.dt * 1000).getDay()];
        const tempMax = Math.round(forecastData.temp.max);

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="day">${dayOfWeek}</div>
            <div class="temp">${tempMax}°C</div>
        `;
        forecastElement.appendChild(forecastItem);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => getWeatherData(position.coords.latitude, position.coords.longitude),
            error => {
                console.error("Error: ", error);
                document.getElementById('error-message').textContent = "Unable to retrieve location. Please enable location services and refresh the page.";
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        document.getElementById('error-message').textContent = "Geolocation is not supported by your browser. Please try a different browser.";
    }
}

window.onload = getLocation;
