"use client" 
import { useState } from "react";

export default function Button({ label }) {
  const [weather, setWeather] = useState("");

  const handleClick = () => {
    console.log("Weather Report");
    fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
      .then(response => response.json())
      // .then (data1 => console.log(data1.properties.periods[0].shortForecast, data1.properties.periods[0].temperature))
      .then (data => setWeather(data.properties.periods[0].shortForecast 
          + " with temperature at " + data.properties.periods[0].temperature + " degrees"));
  };


  return (
    <div> 
      <button onClick={handleClick}>{ label }</button>
      <p> { weather }</p>
    </div>
  );
};

