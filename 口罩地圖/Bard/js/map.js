var map = L.map('map', {
    center: [22.572124, 120.331474],
    zoom: 16
})


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 找出自己的位置
// navigator.geolocation.getCurrentPosition();

let xhrMap = new XMLHttpRequest();

xhrMap.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');

xhrMap.send();
xhrMap.onload = function () {
    let maskData = JSON.parse(xhrMap.responseText).features;

    // 新增地圖 icon
    var blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var greyIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // 取得地圖資料樣板
    let markers = new L.MarkerClusterGroup().addTo(map);
    
    for (let i = 0; i < maskData.length; i++) {
        let maskDateName = maskData[i].properties.name;
        let maskDateAddress = maskData[i].properties.address;
        let maskDatePhone = maskData[i].properties.phone;
        let maskDateNote = maskData[i].properties.note;
        let maskDateAdult = maskData[i].properties.mask_adult;
        let maskDateChild = maskData[i].properties.mask_child;
        let maskGeometryLon = maskData[i].geometry.coordinates[0]; // 經度
        let maskGeometryLat = maskData[i].geometry.coordinates[1]; // 緯度
        let mask;

        // 判斷口罩數量
        if (maskDateAdult === 0) {
            mask = greyIcon;
        }
        else {
            mask = blueIcon;
        }
        
        // 強化地圖效能
        markers.addLayer(L.marker([maskGeometryLat, maskGeometryLon], {icon: mask}).bindPopup(`
            <div class="placeDataBox">
                <strong class="placeDataBoxTitle">${ maskDateName }</strong>
                <div class="placeDataBoxData">
                    <span>${ maskDateAddress }</span>
                    <span>${ maskDatePhone }</span>
                    <span>${ maskDateNote }</span>
                </div>
                <div class="placeDataBoxCount">
                    <div class="countBox countAdult">
                        <span>成人口罩</span>
                        <span>${ maskDateAdult }</span>
                    </div>
                    <div class="countBox countKid">
                        <span>兒童口罩</span>
                        <span>${ maskDateChild }</span>
                    </div>
                </div>
            </div>
        `))
    };
}
