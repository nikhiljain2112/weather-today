var xml2js = require('xml2js'),
  Promise = require('bluebird'),
  request = require('request'),
  printf = require('util').format;


//app object which holds all the weather methods 
var app = {};

/**
 * Get the weather based on geolocation.
 */
app.weather = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            var weather = {},
              high = /(?:High:\s)(-?\d+)/g,
              low = /(?:Low:\s)(-?\d+)/g;

            try {
              // Get the current temp
              var condition = result.channel.item['yweather:condition']['@'];
              weather = condition;

              // Get the high/low currently stored in app widget.
              var description = result.channel.item['description'];
              weather.high = high.exec(description)[1];
              weather.low = low.exec(description)[1];

              weather.forecast = [];

              result.channel.item['yweather:forecast'].forEach(function(item) {
                weather.forecast.push(item['@']);
              });


              resolve(weather);
            } catch (e) {
              var err = new Error('Failed to find weather');

              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });

  });
};

/**
 * Get the atmosphere details for the city
 */
app.atmosphere = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            try {
              var atmosphere = result.channel['yweather:atmosphere']['@'];

              resolve(atmosphere);
            } catch (e) {
              var err = new Error('Failed to find atmosphere');
              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });
  });
};

/**
 * Get the forecast of next 5 days for the city
 */
app.forecast = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {

        getData(woeid)
          .then(function(result) {
            var weather = {};

            try {
              weather.forecast = [];

              result.channel.item['yweather:forecast'].forEach(function(item) {
                weather.forecast.push(item['@']);
              });
              resolve(weather);
            } catch (e) {
              var err = new Error('Failed to find forecast');

              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });

  });
};

/**
 * Get the location details for the city
 */
app.location = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            try {
              var location = result.channel['yweather:location']['@'];

              resolve(location);
            } catch (e) {
              var err = new Error('Failed to find location');
              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });
  });
};

/**
 * Get the geopints details for the city
 */
app.geopoints = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            var geopoint = {};

            try {
              // Get the current temp
              geopoint['lat'] = result.channel.item['geo:lat'];
              geopoint['long'] = result.channel.item['geo:long'];


              resolve(geopoint);
            } catch (e) {
              var err = new Error('Failed to find geopoints');
              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });
  });
};


/**
 * Get the wind details for the city
 */
app.wind = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            try {
              var wind = result.channel['yweather:wind']['@'];
              resolve(wind);
            } catch (e) {
              var err = new Error('Failed to find wind details');
              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });

  });
};

/**
 * Get the astronomy details for the city
 */
app.astronomy = function(options) {
  return new Promise(function(resolve, reject) {
    app.where(options)
      .then(function(woeid) {
        getData(woeid)
          .then(function(result) {
            try {
              // Get the current temp
              var astronomy = result.channel['yweather:astronomy']['@'];
              resolve(astronomy);
            } catch (e) {
              var err = new Error('Failed to find astronomy details');
              reject(err);
            }
          }).catch(function(e) {
            reject(e);
          })
      }).catch(function(e) {
        reject(e);
      });

  });
};



/**
 * Get app location base on geolocation.
 */
app.where = function(options) {
  return new Promise(function(resolve, reject) {

    var url = printf(
      'http://where.yahooapis.com/v1/places.q(\'%s\')?appid=%s',
      options.location,
      options.appid
    );

    request(url, function(error, res, body) {
      var parser = new xml2js.Parser();

      if (body) {
        parser.parseString(body, function(err, result) {

          try {
            var woeid = result.place.woeid;
            resolve(woeid);
          } catch (e) {
            var err = 'Failed to find woeid details';
            reject(e);
          }
        });
      } else {
        reject(err);
      }
    });

  });
};

/**
 * Get the data for the given api call
 */
function getData(woeid) {
  var url = 'http://weather.yahooapis.com/forecastrss?w=' + woeid + '&u=c';

  return new Promise(function(resolve, reject) {

    request(url, function(error, res, body) {
      var parser = new xml2js.Parser();

      if (body) {
        parser.parseString(body, function(err, result) {

          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }

        });
      } else {
        reject(err);
      }
    });

  });
}

module.exports = app;