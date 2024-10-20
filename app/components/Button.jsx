// import React from "react";
"use client";
import { useState } from "react"; // just now


export default function Button({ label }) {
  const [weatherData, setWeatherData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [degrees, setDegrees] = useState("");
  
  const handleClick = () => {
    fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data.properties.periods[0].detailedForecast);
        setTemperatureData(data.properties.periods[0].temperature);
        setDegrees(data.properties.periods[0].temperatureUnit);
      });
    };
  
    return (
        <div>
                <button onClick={handleClick}> {label}</button>
        
                {/* {events.map((event) => ( */}
                  <div>
                    <p>Temperature: {temperatureData} {degrees}</p>
                    <p>Weather: {weatherData}</p>
                  </div>
                {/* ))} */}
        </div>
    );
  }