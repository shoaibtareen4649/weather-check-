const apiKey = 'e1750e0ec352fa0a033fc738086e03e8'; // Weather API key
const geminiAPIKey = "AIzaSyCDBgE08ME_jyHJNE7jYPWBZqGDOFSlehA"; // Gemini API key
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to fetch the 5-day weather forecast
function getWeatherForecast(city) {
    const url = `${forecastUrl}?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                const forecastList = data.list;
                const tableBody = document.querySelector('tbody');
                tableBody.innerHTML = ''; // Clear existing data

                // Loop through forecast data
                for (let i = 0; i < forecastList.length; i += 8) { // Fetch daily forecast (3-hour intervals)
                    const day = forecastList[i];
                    const date = new Date(day.dt_txt).toDateString();
                    const temp = day.main.temp;
                    const condition = day.weather[0].main;

                    // Add rows to the table
                    const row = `
                        <tr>
                            <td>${date}</td>
                            <td>${temp}°C</td>
                            <td>${condition}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                }
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to handle general queries with Gemini API
async function fetchGeminiResponse(query) {
    const Gemini_API_KEY = "AIzaSyCDBgE08ME_jyHJNE7jYPWBZqGDOFSlehA";
    const { GoogleGenerativeAI } = await import("google-generative-ai");
    const genAI = new GoogleGenerativeAI(Gemini_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(query);
        const response = await result.response;

        if (response && response.text) {
            const botResponse = await response.text();
            displayChatbotResponse(botResponse);
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Error processing chatbot question:", error);
        displayChatbotResponse("Sorry, I couldn't process your request. Please try again later.");
    }
}

// Function to display chatbot responses
function displayChatbotResponse(answer) {
    const answerArea = document.querySelector('.answer-area');
    answerArea.innerHTML += `<p>${answer}</p>`;
    answerArea.scrollTop = answerArea.scrollHeight;
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Event listener for search button (weather queries)
document.querySelector('button').addEventListener('click', () => {
    const city = document.querySelector('.search-bar input').value;
    getWeatherForecast(city);
});

// Event listener for chatbot input (general queries)
const chatInput = document.querySelector('.chat-bar input');
chatInput.addEventListener('keypress', debounce((event) => {
    if (event.key === "Enter") {
        const userQuery = event.target.value.toLowerCase();
        if (userQuery.includes("weather")) {
            const city = userQuery.split("weather in ")[1] || "Karachi"; // Default city if not specified
            getWeatherForecast(city);
        } else {
            fetchGeminiResponse(userQuery);
        }
        event.target.value = ''; // Clear the input field after sending the query
    }
}, 300));
