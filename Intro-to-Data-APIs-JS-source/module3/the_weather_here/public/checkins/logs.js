const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here at ${item.lat}&deg;,
    ${item.lon}&deg; is ${item.weather.condition.text} with
    a temperature of ${item.weather.temp_c}&deg; C.`;

    /*if (item.air.value < 0) {
      txt += '  No air quality reading.';
    } else */
     {
    		
      		
      txt += ` 	<br/> The concentration of
      CO is  (${item.weather.air_quality.co}) and  pm2.5: (${item.weather.air_quality.pm2_5}) pm10:(
    ${item.weather.air_quality.pm10})<br/> last read on ${item.weather.last_updated}`;
    }
    marker.bindPopup(txt);
  }
  console.log(data);
}
