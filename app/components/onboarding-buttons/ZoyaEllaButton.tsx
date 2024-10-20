"use client" 
import { useState } from "react";

export default function ZoyaEllaButton({ label }) {
  const [weather, setWeather] = useState("");
  const [temp, setTemp] = useState(""); 

  const handleClick = () => {
    console.log("Sending you the Weather Report");
    fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
        .then(response => response.json())
        // .then (data => console.log(data.properties.periods[0].shortForecast, data.properties.periods[0].temperature)); 
        .then (data => setWeather("Forecast: " + data.properties.periods[0].shortForecast ));

    fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
      .then(response => response.json())
      // .then (data => console.log(data.properties.periods[0].shortForecast, data.properties.periods[0].temperature)); 
      .then (data => setTemp("Temperature: " + data.properties.periods[0].temperature + " degrees Farenheit"));

    // Button.style.display = none;
    
  };


  return (
    <div> 
        <button onClick={handleClick}>{ label }
        </button>
      
      <p> { weather }</p>
      <p> { temp }</p>
    </div>
  );
};

