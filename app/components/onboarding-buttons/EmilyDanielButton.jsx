"use client";
import { useState } from "react";

export default function WeatherButton({ label }) {
    const [weatherData, setWeatherData] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [shortForecastData, setShortForecastData] = useState(null);
    const [temperatureUnit, setTempUnitData] = useState(null);
    const handleClick = () => {
    fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setWeatherData(data);
          setTempData(data.properties.periods[0].temperature);
          setShortForecastData(data.properties.periods[0].shortForecast);
          setTempUnitData(data.properties.periods[0].temperatureUnit);
        });
    };
    return(  
        <div className="bg-gradient-to-r from-slate-300 to-slate-500 flex 
        flex-col justify-center items-center min-h-screen w-full">
            <button className="text-gray-900 bg-white border border-gray-300 
            focus:outline-none hover:bg-gray-100 focus:ring-4 
            focus:ring-gray-100 font-medium rounded-lg text-sm px-5 
            py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 
            dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={handleClick}>I return the weather!</button>
            {weatherData && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <p>Temperature: {tempData} {temperatureUnit}</p>
                    <p>Weather: {shortForecastData}</p>
                </div>
            )}
        
        </div>
    );
}

