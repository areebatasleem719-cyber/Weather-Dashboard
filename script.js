const apiKey = "e1ac0ad95bfdda79ddd757ff19615796"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weatherBox");
const forecastTitle = document.getElementById("forecastTitle");
const forecastGrid = document.getElementById("forecastGrid");
const extendedForecastGrid = document.getElementById("extendedForecastGrid");
const welcomeScreen = document.getElementById("welcomeScreen");
const forecastPrompt = document.getElementById("forecastPrompt");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

async function getWeatherData(city) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (weatherData.cod !== 200) {
            alert("Location data terminal not found. Please review spelling parameters.");
            return;
        }

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

    } catch (error) {
        console.error("Critical exceptions logged on weather fetching routines:", error);
    }
}

function displayCurrentWeather(data) {
    if(welcomeScreen) welcomeScreen.style.display = "none";
    if(weatherBox) weatherBox.style.display = "grid"; 
    
    document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString('en-US', options);
    
    document.getElementById("mainTemp").innerText = Math.round(data.main.temp);
    document.getElementById("weatherDesc").innerText = data.weather[0].description;
    
    // Feels like and Min parameters allocation
    document.getElementById("feelsLikeVal").innerText = Math.round(data.main.feels_like);
    document.getElementById("lowTempVal").innerText = Math.round(data.main.temp_min);
    
    // Core Matrix Binding matching today highlight requirements
    document.getElementById("humidityVal").innerText = `${data.main.humidity}%`;
    document.getElementById("windVal").innerText = `${Math.round(data.wind.speed * 3.6)} km/h`;
}

function displayForecast(data) {
    if(forecastPrompt) forecastPrompt.style.display = "none";
    if(forecastTitle) forecastTitle.style.display = "block";
    
    forecastGrid.innerHTML = "";
    if(extendedForecastGrid) extendedForecastGrid.innerHTML = "";

    // Set Chance of Rain from first dynamic node record safely fallback to 15% if 0
    const rainProbability = data.list[0].pop ? Math.round(data.list[0].pop * 100) : 15;
    document.getElementById("popVal").innerText = `${rainProbability}%`;

    // Filter points for dashboard timelines
    const hourlyData = data.list.slice(0, 5); 
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    // 1. Hourly Quick Row Pipeline Rendering
    hourlyData.forEach(item => {
        const time = new Date(item.dt * 1000);
        let hours = time.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const timeStr = `${hours}${ampm}`;
        
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;

        const hourlyCard = document.createElement("div");
        hourlyCard.className = "forecast-card";
        hourlyCard.innerHTML = `
            <div class="forecast-day">${timeStr}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="forecast-emoji floating-anim" alt="hourly-icon">
            <div class="forecast-temp">${temp}°C</div>
        `;
        forecastGrid.appendChild(hourlyCard);
    });

    // 2. Full 5-Day Extended View Component Grid Population
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        if (extendedForecastGrid) {
            const extendedCard = document.createElement("div");
            extendedCard.className = "forecast-card";
            extendedCard.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="forecast-emoji floating-anim" alt="daily-icon">
                <div class="forecast-temp">${temp}°C</div>
            `;
            extendedForecastGrid.appendChild(extendedCard);
        }
    });
}

function switchTab(tabId, element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active-panel'));
    
    if (tabId === 'overview') {
        document.getElementById('overview-content').classList.add('active-panel');
    } else {
        document.getElementById(`${tabId}-content`).classList.add('active-panel');
    }

    const topBar = document.getElementById('topBarControls');
    if (tabId === 'map-tab' || tabId === 'alerts-tab' || tabId === 'settings-tab') {
        if(topBar) {
            topBar.style.visibility = "hidden";
            topBar.style.height = "0px";
            topBar.style.marginBottom = "0px";
        }
    } else {
        if(topBar) {
            topBar.style.visibility = "visible";
            topBar.style.height = "auto";
            topBar.style.marginBottom = "24px";
        }
    }
}

function updateMockMap(cityName) {
    document.querySelectorAll('.city-map-item').forEach(item => item.classList.remove('active'));
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    const heading = document.getElementById('mapVisualCity');
    const cityNameFormatted = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    if(heading) heading.innerText = `${cityNameFormatted} Regional Radar Map`;
}