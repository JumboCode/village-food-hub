"use client";
import { useState } from "react";

export default function Button({label} : {label: string}) {

  const [temp, setTemp] = useState(0);
  const [forecast, setForecast] = useState("");

  // Function to fetch weather data
  const getWeather = () => {
    fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
      .then((response) => response.json())
      .then((data) => {
        setTemp(data.properties.periods[0].temperature);
        setForecast(data.properties.periods[0].shortForecast);
        console.log(temp + " " + forecast);
      })
  };
  
  return (
    <div>
      <button
        onClick={getWeather} 
      >
        {label} 
        <hr/>
      </button>
      {/* Display the weather data */}
      {(temp != 0 && forecast != "") ? (
        <div>
          <div>{"Temperature: " + temp}</div>
          <div>{"Forecast: " + forecast}</div>
        </div>
      ) : null }
    </div>
  );
};
