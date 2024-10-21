/*var button = document.createElement('button');
button.textContent = "click me";*/

"use client";

import { useState } from "react";

export default function TheButton({ label }) {

    const [currentTemp, setCurrentTemp] = useState("");

    const [forecast, setForecast] = useState("");

    async function getInfo() {
        let weather = await fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
        .then(response => response.json())

        /*.then(data=> {
            let t = data.properties.periods.map(day => day.temperature);
            return t;
        })*/
        //alert(temps);
        setCurrentTemp(weather.properties.periods[0].temperature);
        document.getElementById("temp").style.visibility = "visible";

        setForecast(weather.properties.periods[0].shortForecast);
        document.getElementById("shortForecast").style.visibility = "visible";
    }

    return (
      <>
        {/* button */}
        <div id = "introText" className = "flex flex-col h-screen w-screen justify-center items-center gap-2"> 
        <button onClick={getInfo} className = "border-2 rounded p-2 bg-[#71aaf5]" > {label} </button>

        {/* print the weather */}
        <div id = "temp" className = "invisible" > Today's weather is {currentTemp} degrees Fahrenheit! </div>
        <div id = "shortForecast" className = "invisible" > {forecast}</div>
        </div>

      </>
    )

  }