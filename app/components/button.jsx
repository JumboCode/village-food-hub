//import ____ from 'react';

export default function WeatherButton({ label }) {
    fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
        .then(response => response.json())
        .then(data => console)
    return(
        <div>
            <button>I return the weather!</button>
        </div>
    )
}