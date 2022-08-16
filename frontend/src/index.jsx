import React from 'react';
import ReactDOM from 'react-dom';
import './public/style.css';
import { useState } from 'react';

const baseURL = process.env.ENDPOINT || 'http://localhost:9000/api';
const subHours = 3;
const geolocationAPI = navigator.geolocation;

var currentTime = currentTime = Date.now()/1000;
var newCurr = currentTime - subHours * 3 * 1000;
var latitude;
var longitude;

const getWeatherFromApi = async (city) => {
  try {
    const response = await fetch(`${baseURL}/weatherbycity?city=${city}&dt=${currentTime}` );
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const getCountryFromApi = async (lat, lon) => {
  try {
    const response = await fetch(`${baseURL}/locationbylatlon?lat=${lat}&lon=${lon}` );
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

class Weather extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      icon: '',
      timeStamp: currentTime,
      lat: '',
      lon: '',
      country: 'Finland',
      city: 'Helsinki',
      error: '',
    };
  }

  async componentDidMount() {
    this.getInformation();
  }


  async getInformation() {
    /*Get latitude and longitude */
    if (geolocationAPI) {
      geolocationAPI.getCurrentPosition((position) => {
        const { coords } = position;
        this.setState({lat: coords.latitude});
        
        this.setState({lon: coords.longitude});
        console.log('latitude: ', this.state.lat);
        console.log('longitude: ', this.state.lon);

        /*Get location by latitude and longitude */
        this.getLocationByCoordinates(coords.latitude, coords.longitude);
      })
    } else {
      this.setState({ error: 'Geolocation API is not available in your browser!' });
    }
  }

  /*Get location data */
  async getLocationByCoordinates(lat, lon) {
    const [locationData] = await Promise.all([getCountryFromApi(lat, lon)]);
    if (locationData) {
      console.log('Location data:', locationData);
      this.setState(
        {
          country: locationData.features[0].properties.country,
          city: locationData.features[0].properties.city,
        });
      } else {
        this.setState({ error: 'Unable to fetch from Geoapify.com API' });
      }
    /*Get weather meta information (if locationData null, then it should default to Helsinki)
      BUT "lat" and "lon" will not represent Helsinki as of now*/
    this.getWeather(this.state.city);
  }

  async getWeather(city) {
    const [weatherData] = await Promise.all([getWeatherFromApi(city)]);
    if (weatherData) {
      console.log('Weather data:', weatherData);
      console.log('Current time in unix:', currentTime);
      console.log('Time subtract 3 Hours:', newCurr);
      this.setState(
        {
          icon: weatherData.weather[0].icon.slice(0, -1),
          updatedAt: new Date().toISOString(),
          temperature: weatherData.main.temp + '°C',
          humidity: weatherData.main.humidity + '%',
          air_press: weatherData.main.pressure + ' mb',
          error: '',
        });
    } else {
      this.setState({ error: 'Unable to fetch weather' });
    }
  }
  
  render() {
    const { icon, updatedAt, temperature, humidity, air_press, lat, lon, country, city } = this.state;

    return (
      <div className="container">
        <div className="header">Curent weather in {country}, {city}</div>
        <div className="weather">
          {icon && <img className="icon" alt="weather_icon" src={require(`./public/img/${icon}.svg`)} />}
          <ul className="meta">
            {updatedAt && <li><b>Updated At</b>: {updatedAt}</li>}
            {<li><b>Temperature</b>: {temperature}</li>}
            {<li><b>Humidity</b>: {humidity}</li>}
            {<li><b>Air Pressure</b>: {air_press}</li>}
            {<li><b>Latitude</b>: {lat}</li>}
            {<li><b>Longitude</b>: {lon}</li>}
          </ul>
        </div>
        <div className="update">
          <button onClick={() => this.getWeather()}>Update</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);