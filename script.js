const apiKey = "d21f2bcccb70d47cb8f658193d77c638"; 

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherBox = document.getElementById('weatherBox');
const forecastTitle = document.getElementById('forecastTitle');
const forecastGrid = document.getElementById('forecastGrid');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeatherData(city);
        }
    }
});

async function getWeatherData(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        // Fetch Current Real-time Data
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        
        // Fetch 5-Day Forecast Data Structure
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        displayCurrentWeather(data);
        displayForecast(forecastData);

    } catch (error) {
        alert("Shahr ka naam theek se likhein ya API activation ka wait karein!");
        console.error(error);
    }
}

function displayCurrentWeather(data) {
    weatherBox.style.display = "block";
    document.getElementById('cityName').innerText = data.name + `, ${data.sys.country}`;
    document.getElementById('mainTemp').innerText = Math.round(data.main.temp);
    document.getElementById('weatherDesc').innerText = data.weather[0].description;
    document.getElementById('humidityVal').innerText = data.main.humidity + "%";
    document.getElementById('windVal').innerText = Math.round(data.wind.speed * 3.6) + " km/h";
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-US', options);
}

function displayForecast(data) {
    forecastTitle.style.display = "block";
    forecastGrid.innerHTML = "";

    // OpenWeather 3-hourly entries (8 entries per day * 5 days)
    const filteredForecast = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    filteredForecast.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const mainCondition = day.weather[0].main.toLowerCase();
        
        let emoji = "☀️";
        if (mainCondition.includes('rain')) emoji = "🌧️";
        else if (mainCondition.includes('cloud')) emoji = "☁️";
        else if (mainCondition.includes('clear')) emoji = "☀️";
        else if (mainCondition.includes('snow')) emoji = "❄️";

        const cardHtml = `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-emoji">${emoji}</div>
                <div class="forecast-temp">${temp}°C</div>
            </div>
        `;
        forecastGrid.innerHTML += cardHtml;
    });
}