/**
 * Main component
 */

import React from 'react';

class Form extends React.Component {

    constructor(props){
        super(props);
        this.getLocation = this.getLocation.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.change = this.change.bind(this);

        // 0 milestone in Hungary
        this.defaultCoords = {
            latitude : '47.497788',
            longitude : '19.0403476'
        };
        // api settings
        this.url = {
            // template : 'http://localhost:3000/data.json',  // sample response for debug
            template : `http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&APPID={appid}`,
            appid : '6c2fbc91b73eb68c9cbb2f1f14db54e5',
            frequency : 10 * 60 * 1000  // minimal time between two requests
        };

        if (!localStorage.getItem('weatherForecastLastRequest')){
            localStorage.setItem('weatherForecastLastRequest', Date.now());
        }
        const lastRequest = localStorage.getItem('weatherForecastLastRequest');
        this.state = {
            coords : this.defaultCoords,
            lastRequest : lastRequest,
            message : ''
        };
    }

    getLocation(){
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    coords : {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    },
                    message : 'Your location determined as the above coordinates'
                });
            },
            error => {
                this.setState({
                    coords : this.defaultCoords,
                    message : 'The location cannot be determined'
                });
            }
        );
    }

    getForecast(){
        const now = Date.now();
        if (!this.props.hasForecast || now - this.state.lastRequest > this.url.frequency){
            const url = this.url.template
                .replace(/\{lat\}/g, this.state.coords.latitude)
                .replace(/\{lon\}/g, this.state.coords.longitude)
                .replace(/\{appid\}/g, this.url.appid);

            fetch(url, {
                mode : 'cors',
                credentials : 'omit'
            }).then(response => {
                return response.json();
            }).then(forecast => {
                localStorage.setItem('weatherForecastLastRequest', now);
                localStorage.setItem('weatherForecastData', JSON.stringify(forecast));
                this.setState({
                    lastRequest : now,
                    message : ''
                });
                this.props.setForecastFromStorage();
            }).catch(error => {
                this.setState({
                    lastRequest : now,
                    message : 'Error while request forecast data'
                });
            });
        }
        else if (now - this.state.lastRequest <= this.url.frequency){
            this.setState({
                message : 'You cannot request so frequently. Try again later.'
            });
        }
    }

    change(event){
        const dir = event.target.name;
        const val = {
            [dir] : event.target.value
        };
        if (!Number.isNaN(Number(event.target.value))){
            this.setState({
                coords : {
                    latitude : val.latitude || this.state.coords.latitude,
                    longitude : val.longitude || this.state.coords.longitude
                }
            });
        }
    }

    render(){
        return (
            <div className="form">
                <input type="text" name="latitude" placeholder="latitude"
                    value={this.state.coords.latitude} onChange={this.change} />
                <input type="text" name="longitude" placeholder="longitude"
                    value={this.state.coords.longitude} onChange={this.change} />
                <button type="button" onClick={this.getLocation}>Detect location</button>
                <div className="message">{this.state.message}</div>
                <hr />
                <button type="button" onClick={this.getForecast}>Get forecast</button>
            </div>
        );
    }

}

export default Form;
