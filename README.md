
## overview

Get the weather related different details for city


## Prerequisites

  Get the yahoo application id for your app
  use following link to generate yahoo id :

  [yahoo](https://developer.yahoo.com/apps/)
  
  
## Example

```javascript

 var weatherToday = require('weather-today');

 //give yahoo app id as 'appid'
 weatherToday.weather({
        location: 'mumbai',
        appid: appid
      })
      .then(function(d) {
        //d-->> weather info for city
      })
      .catch(function(e) {
         console.log(e);
      });
```

 Example JSON result:

```javascript
{ text: 'Smoke',
  code: '22',
  temp: '28', //current temp
  date: 'Thu, 18 Feb 2016 5:30 pm IST',
  high: '31',
  low: '23',
  forecast:
   [ { day: 'Thu',
       date: '18 Feb 2016',
       low: '23',
       high: '31',
       text: 'Mostly Clear',
       code: '33' },
     { day: 'Fri',
       date: '19 Feb 2016',
       low: '23',
       high: '30',
       text: 'Mostly Sunny',
       code: '34' },
     { day: 'Sat',
       date: '20 Feb 2016',
       low: '24',
       high: '31',
       text: 'Mostly Sunny',
       code: '34' },
     { day: 'Sun',
       date: '21 Feb 2016',
       low: '23',
       high: '33',
       text: 'Partly Cloudy',
       code: '30' },
     { day: 'Mon',
       date: '22 Feb 2016',
       low: '23',
       high: '33',
       text: 'Sunny',
       code: '32' } ] }

```

## Other apis can be called similarly for the given city
 -  weatherToday.astronomy(options)   //get astronomy
 -  weatherToday.forecast(options)   //get next 5 days forecast only
 -  weatherToday.geopoints(options) //get geopoints[latitude,longitude]
 -  weatherToday.atmosphere(options) //get atmosphere details
 -  weatherToday.wind(options) //get wind deatils
 -  weatherToday.location(options) //get location deatils

## Licence
Licensed under the MIT License