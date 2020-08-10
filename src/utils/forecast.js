const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=1089e865de979df4888d101361e57947&query=${latitude},${longitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connevt to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      const weather_descriptions = body.current.weather_descriptions;
      const temperature = body.current.temperature;
      const feelsLike = body.current.feelslike;
      callback(
        undefined,
        `${weather_descriptions}. It is currently ${temperature} degress out. It feels like ${feelsLike} degress out.`
      );
    }
  });
};

module.exports = forecast;
