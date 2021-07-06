const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);
  //const api_key = process.env.API_KEY;
  const api_key =  '381a74ebd122450289a72323210607'
 // const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
  console.log(api_key);
  //https://api.weatherapi.com/v1/current.json?key=381a74ebd122450289a72323210607&q=25.03, 121.51&aqi=no
  const weather_url=`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=yes`;
  console.log('weather_url--->'+weather_url);
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;
  console.log('aq_url--->'+aq_url);
 // const aq_response = await fetch(aq_url);
  
  //const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    //air_quality: aq_data
  };
  response.json(data);
});
