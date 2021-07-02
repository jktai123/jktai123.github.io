// 設定全域變數
let data = [];
let allList = [];
let areaList = {};
let countyList = {};
let totalData = {};

function init() {
    const xhr = new XMLHttpRequest();
    xhr.open(`get`, `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`, true);
    xhr.send(null);
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText).features;
        allList = getList(data);
        areaList = allList[0];
        countyList = allList[1];
        let countyArr = Object.keys(countyList);
        getInfo();
        renderCountyList(countyArr);

        // 渲染藥局地標於地圖
        const dataLen = data.length;
        for (let i = 0; i < dataLen; i++) {
            let icon;
            if (data[i].properties.mask_adult > 0) {
                icon = greenIcon;
            } else if (data[i].properties.mask_adult === 0 && data[i].properties.mask_child > 0) {
                icon = redIcon;
            } else {
                icon = greyIcon;
            };
            // 加入群組圖層
            icons.addLayer(
                L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: icon })
                    .bindPopup
                    (
                        `
                            <h1>${data[i].properties.name}</h1>
                            <p>地址：${data[i].properties.address}</p>
                            <p>成人口罩：${data[i].properties.mask_adult}</p>
                            <p>兒童口罩：${data[i].properties.mask_child}</p>
                        `
                    )
            );
        };
        map.addLayer(icons);
        loadingImg.classList.add(`hidden`);
    };

};

init();

// 過濾data
function getList(data) {
    const dataLen = data.length;
    // 撈出縣市資料
    let counties = {};
    for (let i = 0; i < dataLen; i++) {
        if (data[i].properties.county in counties !== true && data[i].properties.county !== "") {
            counties[data[i].properties.county] =
                [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
        };
    };
    const countyLen = Object.keys(counties).length;

    // 撈出行政區資料
    let areas = {};
    for (let j = 0; j < countyLen; j++) {
        let county = Object.keys(counties)[j];
        for (let i = 0; i < dataLen; i++) {
            if (data[i].properties.county === county && data[i].properties.town in areas === false) {
                areas[data[i].properties.town] =
                {
                    county: data[i].properties.county,
                    xy: [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]
                }
            }
        }
    }
    return [areas, counties];
};

// 設定DOM元素
const county = document.querySelector(`.county`);
const town = document.querySelector(`.town`);
const listMenu = document.querySelector(`.listMenu`);
const loadingImg = document.querySelector(`.loadingImg`);


/* ==================== 地圖設定 ==================== */
// 設定地圖資訊
let map = L.map(`map`, {
    center: [23.7375594, 120.456458],
    zoom: 7
});

// 設定圖資 (OSM)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 設定icon
// 建立icon群組圖層
const icons = new L.MarkerClusterGroup().addTo(map);

// 成人、兒童口罩都還有剩餘
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 成人、兒童口罩皆售完
const greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 僅剩兒童口罩
const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


/* ==================== 左側欄位 ==================== */
// 取得並渲染leftBar資訊
function getInfo() {
    const todayDay = document.querySelector(`.todayDay`);
    const todayDate = document.querySelector(`.todayDate`);
    const buyId = document.querySelector(`.buyId`);
    todayDay.textContent = getTodayDay();
    todayDate.textContent = getTodayDate();
    const odd = [1, 3, 5, 7, 9];
    const even = [2, 4, 6, 8, 0];
    if (todayDay.textContent === `星期一` || todayDay.textContent === `星期三` || todayDay.textContent === `星期五`) {
        buyId.textContent = `1,3,5,7,9`;
    } else if (todayDay.textContent === `星期二` || todayDay.textContent === `星期四` || todayDay.textContent === `星期六`) {
        buyId.textContent = `2,4,6,8,0`;
    } else {
        buyId.textContent = `無限制`;
    };

    // 藥局資料
    const dataLen = data.length;
    let str = ``;
    for (let i = 0; i < dataLen; i++) {
        const listEl = document.createElement(`li`);
        listEl.innerHTML =
            `
        <h6 class="name">${data[i].properties.name}</h6>
        <img src="../image/marker_blue.png" alt="marker" class="marker_icon" data-locate="${[data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]}" 
        data-name="${data[i].properties.name}" data-adult="${data[i].properties.mask_adult}" data-child="${data[i].properties.mask_child}" data-address="${data[i].properties.address}">
        <p class="address" title="${data[i].properties.address}">${data[i].properties.address}</p>
        <p class="phone">${data[i].properties.phone}</p>
        <p class="openTime" title="${data[i].properties.note}">${data[i].properties.note}</p>
        <div class="adultMask">成人口罩<span class="adultMaskNumber">${data[i].properties.mask_adult}</span></div>
        <div class="kidMask">兒童口罩<span class="kidMaskNumber">${data[i].properties.mask_child}</span></div>
        `

        listMenu.appendChild(listEl);
    }
};

// 縣市、行政區選單
// 取得縣市資料
function renderCountyList(list) {
    // 取得縣市列表
    let str = ``;
    const listLen = list.length;
    const defaultOption = `<option value="default" disabled selected>-- 請選擇縣市 --</option>`;
    for (let i = 0; i < listLen; i++) {
        str += `<option value="${list[i]}">${list[i]}</option>`
    };

    county.innerHTML = defaultOption + str;
    town.innerHTML = `<option value="default" disabled selected>- 請選擇行政區 -</option>`;

}

// 選擇縣市
county.addEventListener(`change`, function (e) {

    // 設定地圖拉近到該縣市
    map.setView([countyList[e.target.value][0], countyList[e.target.value][1]], 11);

    // 渲染行政區選單
    const defaultOption = `<option value="default" disabled selected>- 請選擇行政區 -</option>`;
    let str = "";
    for (let a in areaList) {
        if (e.target.value === areaList[a][`county`]) {
            str += `<option value="${a}">${a}</option>`;
        };
    };

    town.innerHTML = defaultOption + str;

    // 渲染藥局列表
    let newListEl = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].properties.county === e.target.value) {
            newListEl += `<li>
            <h6 class="name">${data[i].properties.name}</h6>
            <img src="../image/marker_blue.png" alt="marker" class="marker_icon" data-locate="${[data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]}"
            data-name="${data[i].properties.name}" data-adult="${data[i].properties.mask_adult}" data-child="${data[i].properties.mask_child}" data-address="${data[i].properties.address}">
            <p class="address" title="${data[i].properties.address}">${data[i].properties.address}</p>
            <p class="phone">${data[i].properties.phone}</p>
            <p class="openTime" title="${data[i].properties.note}">${data[i].properties.note}</p>
            <div class="adultMask">成人口罩<span class="adultMaskNumber">${data[i].properties.mask_adult}</span></div>
            <div class="kidMask">兒童口罩<span class="kidMaskNumber">${data[i].properties.mask_child}</span></div>
            </li>`;
        };
    };

    listMenu.innerHTML = newListEl;

}, false);

// 選擇行政區
town.addEventListener(`change`, function (e) {

    // 取得選擇行政區座標
    let areaSelected = e.target.value;
    let location = [areaList[areaSelected].xy[0], areaList[areaSelected].xy[1]];

    // 設定地圖拉近到該縣市
    map.setView(location, 15);

    // 渲染藥局列表
    let newListEl = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].properties.town === e.target.value) {
            newListEl += `<li>
            <h6 class="name">${data[i].properties.name}</h6>
            <img src="../image/marker_blue.png" alt="marker" class="marker_icon" data-locate="${[data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]}"
            data-name="${data[i].properties.name}" data-adult="${data[i].properties.mask_adult}" data-child="${data[i].properties.mask_child}" data-address="${data[i].properties.address}">
            <p class="address" title="${data[i].properties.address}">${data[i].properties.address}</p>
            <p class="phone">${data[i].properties.phone}</p>
            <p class="openTime" title="${data[i].properties.note}">${data[i].properties.note}</p>
            <div class="adultMask">成人口罩<span class="adultMaskNumber">${data[i].properties.mask_adult}</span></div>
            <div class="kidMask">兒童口罩<span class="kidMaskNumber">${data[i].properties.mask_child}</span></div>
            </li>`;
        };
    };

    listMenu.innerHTML = newListEl;

}, false);

// icon點擊事件
$(listMenu).delegate(`.marker_icon`, `click`, function (e) {
    let tempdata = e.target.dataset.locate;
    let tempName = e.target.dataset.name;
    let tempAdultNum = e.target.dataset.adult;
    let tempChildNum = e.target.dataset.child;
    let tempAddress = e.target.dataset.address;
    let str = tempdata.split(`,`);
    let numA = parseFloat(str[0]);
    let numB = parseFloat(str[1]);
    let location = [numA, numB];
    map.setView(location, 20);
    L.marker(location)
        .addTo(map)
        .bindPopup
        (
            `
            <h1>${tempName}</h1>
            <p>地址：${tempAddress}</p>
            <p>成人口罩：${tempAdultNum}</p>
            <p>兒童口罩：${tempChildNum}</p>
            
            `
        )
        .openPopup();
});


/* ==================== 日期資訊 ==================== */
// 取得星期資訊
function getTodayDay() {
    const calender = new Date();
    let day = calender.getDay();
    switch (day) {
        case 0:
            return `星期日`;
        case 1:
            return `星期一`;
        case 2:
            return `星期二`;
        case 3:
            return `星期三`;
        case 4:
            return `星期四`;
        case 5:
            return `星期五`;
        case 6:
            return `星期六`;
        default:
            return `星期日`;
    }
}
// 取得日期資訊
function getTodayDate() {
    const testDate = new Date();
    let yr = testDate.getFullYear();
    let month = testDate.getMonth();
    let date = testDate.getDate();
    let todayDate = `${yr} - ${month + 1} - ${date}`;
    return todayDate;
}