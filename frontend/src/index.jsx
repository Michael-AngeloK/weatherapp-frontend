import React from 'react';
import ReactDOM from 'react-dom';
import './public/style.css';

const baseURL = process.env.ENDPOINT || 'http://localhost:9000/api';

const getWeatherFromApi = async (city) => {
  try {
    const response = await fetch(`${baseURL}/weatherbycity?city=${city}`);
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
      timeStamp: '',
      location: 'Helsinki',
      error: '',
    };
  }

  async componentWillMount() {
    this.getWeather();
  }

  async getWeather() {
    const [weatherData] = await Promise.all([getWeatherFromApi(this.state.location)]);
    if (weatherData) {
      console.log('Weather data:', weatherData);
      this.setState(
        {
          icon: weatherData.weather[0].icon.slice(0, -1),
          updatedAt: new Date().toISOString(),
          temperature: '29o',
          humidity: '50%',
          air_press: '1000mb',
          error: '',
        });
    } else {
      this.setState({ error: 'Unable to fetch weather' });
    }
  }

  render() {
    const { icon, location, updatedAt, temperature, humidity, air_press } = this.state;

    return (
      <div>
        <div className="header">Curent weather in {location}</div>
        <div className="weather">
          {icon && <img className="icon" alt="weather_icon" src={require(`./public/img/${icon}.svg`)} />}
          <div className="meta">
            {updatedAt && <p>{updatedAt}</p>}
            {<p className="temperature">{temperature}</p>}
            {<p className="humidity">{humidity}</p>}
            {<p className="air_press">{air_press}</p>}
          </div>
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
