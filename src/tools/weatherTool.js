export async function getWeather(city) {
    try {
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Failed to fetch location");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return {
                error: `City "${city}" not found`
            };
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather");
        }

        const weatherData = await weatherResponse.json();

        return {
            city: location.name,
            country: location.country,
            temperature: weatherData.current.temperature_2m,
            apparentTemperature:
                weatherData.current.apparent_temperature,
            humidity:
                weatherData.current.relative_humidity_2m,
            precipitation:
                weatherData.current.precipitation,
            rain:
                weatherData.current.rain,
            weatherCode:
                weatherData.current.weather_code,
            windSpeed:
                weatherData.current.wind_speed_10m
        };

    } catch (error) {
        console.error("Weather Tool Error:", error);

        return {
            error: error.message
        };
    }
}
