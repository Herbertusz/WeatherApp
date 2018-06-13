/**
 * Main component
 */

import React from 'react';

class Forecast extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        const data = this.props.data;
        if (!data) return null;

        const rows = data.list.map(item => (
            <tr key={item.dt}>
                <td>{item.dt_txt.substr(0, item.dt_txt.length - 3)}</td>
                <td className="align-right">{item.main.temp.toFixed(1)} &deg;C</td>
                <td className="align-right">{item.main.humidity}%</td>
                <td><img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="" /></td>
                <td>{item.weather[0].description}</td>
            </tr>
        ));

        return (
            <div>
                <h3>5 day forecast ({data.city.country}, {data.city.name})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th colSpan="2">Weather</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Forecast;
