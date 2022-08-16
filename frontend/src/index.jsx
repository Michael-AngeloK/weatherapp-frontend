import React from 'react';
import ReactDOM from 'react-dom';
import './public/style.css';
import { useState } from 'react';

const baseURL = process.env.ENDPOINT || 'http://localhost:9000/api';
const subHours = 3;
const geolocationAPI = navigator.geolocation;

var currentTime = currentTime = Date.now()/1000;
var newCurr = currentTime - subHours * 3 * 1000;

const getWeatherFromApi = async (city) => {
  try {
    const response = await fetch(`${baseURL}/weatherbycity?city=${city}&dt=${currentTime}` );
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      icon: '',
      timeStamp: currentTime,
      location: 'Helsinki',
      lat: '',
      long: '',
      error: '',
    };
  }

  async componentWillMount() {
    this.getWeather();
    this.getUserCoordinates();
  }

  async getWeather() {
    const [weatherData] = await Promise.all([getWeatherFromApi(this.state.location)]);
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

  async getUserCoordinates() {
    if (!geolocationAPI) {
      setError('Geolocation API is not available in your browser!')
    } else {
      geolocationAPI.getCurrentPosition((position) => {
        const { coords } = position;
        this.setState({lat: coords.latitude});
        this.setState({long: coords.longitude});
      }, (error) => {
        setError('Something went wrong getting your position!')
      })
    }
  }
  
  render() {
    const { icon, location, updatedAt, temperature, humidity, air_press, lat, long } = this.state;

    return (
      <div className="container">
        <div className="header">Curent weather in {location}</div>
        <div className="weather">
          {icon && <img className="icon" alt="weather_icon" src={require(`./public/img/${icon}.svg`)} />}
          <ul className="meta">
            {updatedAt && <li><b>Updated At</b>: {updatedAt}</li>}
            {<li><b>Temperature</b>: {temperature}</li>}
            {<li><b>Humidity</b>: {humidity}</li>}
            {<li><b>Air Pressure</b>: {air_press}</li>}
            {<li><b>Latitude</b>: {lat}</li>}
            {<li><b>Longitude</b>: {long}</li>}
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
