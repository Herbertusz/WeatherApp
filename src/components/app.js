/**
 * Main component
 */

import React from 'react';

import Form from './form';
import Forecast from './forecast';

class App extends React.Component {

    constructor(props){
        super(props);
        this.setForecastFromStorage = this.setForecastFromStorage.bind(this);

        const forecast = localStorage.getItem('weatherForecastData');
        this.state = {
            hasForecast : !!forecast,
            forecast : forecast ? JSON.parse(forecast) : null
        };
    }

    setForecastFromStorage(){
        const forecast = localStorage.getItem('weatherForecastData');
        this.setState({
            hasForecast : !!forecast,
            forecast : forecast ? JSON.parse(forecast) : null
        });
    }

    render(){
        return (
            <section className="main">
                <h1>Weather forecast</h1>
                <Form hasForecast={this.state.hasForecast} setForecastFromStorage={this.setForecastFromStorage} />
                <Forecast data={this.state.forecast} />
            </section>
        );
    }

}

export default App;
