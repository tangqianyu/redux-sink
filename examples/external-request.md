---
description: 'Use effect to handle external effects, mostly handel async calls.'
---

# External Request

### Create sink with effect to handle external request

This is an example for using effect to handle http requests, using async function

{% code title="WeatherSink.js" %}
```javascript
import { sink, state, effect } from 'redux-sink';

@sink('weather')
export class WeatherSink {
  @state loading = false;
  @state weather = { 
    temperature: 0,
    humidity: 0
  };

  @effect
  async function loadWeather() {
    this.loading = true;
    // using async/await here, same for promise
    this.weather = await fetch('http://api/weather');
    this.loading = false; 
  }
}
```
{% endcode %}

### Call effect load data in component

{% code title="Weather.jsx" %}
```jsx
import * as React from 'react';
import { sinking } from 'redux-sink';
import { WeatherSink } from './WeatherSink';

export class Weather extends React.Component {
  componentWillMount() {
    // the prop name of sink will be `weather`, because @sink('weather')
    const { weather } = this.props;
    weather.loadWeather();
  }

  render() {
    const { weather } = this.props;
    return (
      <div>
        { !weather.loading &&
          <>
            <div>temperature: {weather.weather.temperature}</div>
            <div>humidity: {weather.weather.humidity}</div>
          </>
        }
      </div>
    );
  }
}

export default sinking(WeatherSink)(Weather);
```
{% endcode %}

