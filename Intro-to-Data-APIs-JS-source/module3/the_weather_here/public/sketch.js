// Geo Locate
let lat, lon;
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try {
    //	console.log(position);
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      const api_url = `weather/${lat},${lon}`;
      const response = await fetch(api_url);
      const json = await response.json();
      weather = json.weather.current;
      //air = json.air_quality.results[0].measurements[0];
     //air=weather.air_quality;
      document.getElementById('summary').textContent = weather.condition.text;
      document.getElementById('temp').textContent = weather.temp_c;
      document.getElementById('aq_parameter').textContent = weather.air_quality.co.toFixed(2);
      document.getElementById('pm2_5').textContent = weather.air_quality.pm2_5.toFixed(2);
      document.getElementById('aq_units').textContent = weather.air_quality.pm10;
      document.getElementById('aq_date').textContent = weather.last_updated;
    } catch (error) {
      console.error(error);
      air = { value: -1 };
      document.getElementById('aq_value').textContent = 'NO READING';
    }

    const data = { lat, lon, weather };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log(db_json);
  });
} else {
  console.log('geolocation not available');
}
