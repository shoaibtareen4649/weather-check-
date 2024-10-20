// Declare chart variables
let barChart;
let doughnutChart;
let lineChart;

// Get elements
const cityInput = document.querySelector('#cityInput');
const submitButton = document.querySelector('#submitButton');
const weatherDisplay = document.querySelector('#weatherDisplay');
const unitSelect = document.querySelector('#unitSelect');

// Add event listener
submitButton.addEventListener('click', getWeatherData);

// Function to get weather data
function getWeatherData() {
    const city = cityInput.value;
    const unit = unitSelect.value;
    const apiKey = 'e1750e0ec352fa0a033fc738086e03e8'; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const { name, main: { temp, humidity }, wind: { speed }, weather } = data;
            const weatherDescription = weather[0].description;
            const weatherIcon = weather[0].icon;
            const tempUnit = unit === 'metric' ? '°C' : '°F';

            // Display data
            weatherDisplay.innerHTML = `
                <h2>Weather in ${name}</h2>
                <p>Temperature: ${temp}${tempUnit}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${speed} m/s</p>
                <p>Weather: ${weatherDescription}</p>
                <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
            `;

            // Update background based on weather condition
            updateWeatherWidgetBackground(weatherDescription);

            // Initialize Chart.js instances
            const barChartCtx = document.getElementById('barChart').getContext('2d');
            const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
            const lineChartCtx = document.getElementById('lineChart').getContext('2d');

            // Clear previous charts
            if (barChart) barChart.destroy();
            if (doughnutChart) doughnutChart.destroy();
            if (lineChart) lineChart.destroy();

            // Data for the charts
            const temperatures = [temp]; // Add more data as needed
            const weatherConditions = [humidity]; // Example data
            const temperatureTrend = [temp, temp - 2, temp + 1]; // Example trend data

            // Create the bar chart
            barChart = new Chart(barChartCtx, {
                type: 'bar',
                data: {
                    labels: ['Temperature'],
                    datasets: [{
                        label: 'Temperature',
                        data: temperatures,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Create the doughnut chart
            doughnutChart = new Chart(doughnutChartCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Humidity'],
                    datasets: [{
                        label: 'Humidity',
                        data: weatherConditions,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1
                    }]
                }
            });

            // Create the line chart
            lineChart = new Chart(lineChartCtx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'], // Replace with actual days or timestamps
                    datasets: [{
                        label: 'Temperature Trend',
                        data: temperatureTrend,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }]
                }
            });
        })
        .catch(error => {
            weatherDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}

// Function to update widget background based on weather description
function updateWeatherWidgetBackground(weatherDescription) {
    const weatherLower = weatherDescription.toLowerCase();

    // Logic to change the background based on weather condition
    if (weatherLower.includes("clear")) {
        weatherDisplay.style.background = "url('https://example.com/clear_sky.jpg') no-repeat center center/cover";
    } else if (weatherLower.includes("clouds")) {
        weatherDisplay.style.background = "url('https://example.com/cloudy.jpg') no-repeat center center/cover";
    } else if (weatherLower.includes("rain")) {
        weatherDisplay.style.background = "url('https://example.com/rainy.jpg') no-repeat center center/cover";
    } else if (weatherLower.includes("snow")) {
        weatherDisplay.style.background = "url('https://example.com/snow.jpg') no-repeat center center/cover";
    } else if (weatherLower.includes("thunderstorm")) {
        weatherDisplay.style.background = "url('https://example.com/thunderstorm.jpg') no-repeat center center/cover";
    } else if (weatherLower.includes("mist") || weatherLower.includes("fog")) {
        weatherDisplay.style.background = "url('https://example.com/fog.jpg') no-repeat center center/cover";
    }
}
