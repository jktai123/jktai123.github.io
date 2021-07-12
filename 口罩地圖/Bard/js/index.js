// 取得藥局資料
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
xhr.send();
xhr.onload = function () {
    let maskData = JSON.parse(xhr.responseText).features;
    let maskContent = document.querySelector('.sideBarContent');
    let countySelector = document.querySelector('.countySelector');
    let townSelector = document.querySelector('.townSelector');

    // 取得縣名
    let maskCountyAll = maskData.map(item => {
        return item.properties.county;
    })
    let maskCounty = maskCountyAll.filter((item, index, arr) => {
        return arr.indexOf(item) === index;
    })
    let spaceCounty = maskCounty.indexOf('');
    if (spaceCounty > -1) {
        maskCounty.splice(spaceCounty, 1);
    }
    let countyOptions = '';
    for(let i = 0; i < maskCounty.length; i++) {
        countyOptions += `
        <option value="${maskCounty[i]}">${ maskCounty[i] }</option>
        `
    }
    // 篩選出相同縣市
    countySelector.addEventListener('change', (item) => {
        let countyName = item.target.value; 
        let countyFilterMask = maskData.filter(item => {
            return item.properties.county === countyName;
        })

        // 取得行政區
        let maskTownAll = countyFilterMask.map(item => {
            return item.properties.town;
        })
        let maskTown = maskTownAll.filter((item, index, arr) => {
            return arr.indexOf(item) === index;
        })
        let spaceTown = maskTown.indexOf('');
        if (spaceTown > -1) {
            maskTown.splice(spaceTown, 1);
        }
        townSelector.addEventListener('change', (item) => {
            let townName = countyName + item.target.value;
            // 取得符合縣市+行政區的藥局
            let rightTown = maskData.filter(item => {
                return item.properties.address.match(townName);
            })
            
            // 取得 sideBarContent 樣板
            let str = '';
            for (let i = 0; i < rightTown.length; i++) {
                let maskDateName = rightTown[i].properties.name;
                let maskDateAddress = rightTown[i].properties.address;
                let maskDatePhone = rightTown[i].properties.phone;
                let maskDateNote = rightTown[i].properties.note;
                let maskDateAdult = rightTown[i].properties.mask_adult;
                let maskDateChild = rightTown[i].properties.mask_child;
                let maskGeometryLng = rightTown[i].geometry.coordinates[0]; // 經度
                let maskGeometryLat = rightTown[i].geometry.coordinates[1]; // 緯度
                
                str += `
                <div class="sideBarContentBox" data-lat="${ maskGeometryLat }" data-lng="${ maskGeometryLng }">
                    <strong class="sideBarContentBoxTitle">${ maskDateName }</strong>
                    <div class="sideBarContentBoxData">
                        <span>${ maskDateAddress }</span>
                        <span>${ maskDatePhone }</span>
                        <span>${ maskDateNote }</span>
                    </div>
                    <div class="sideBarContentBoxTitleCount">
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
                `
            }
            maskContent.innerHTML = str;
            moveMap();
        })

        let townOptions = '';
        for(let i = 0; i < maskTown.length; i++) {
            townOptions += `
            <option value="${maskTown[i]}">${ maskTown[i] }</option>
            `
        }
        townSelector.innerHTML = `<option value="">-- 請選擇行政區 --</option>` + townOptions;

        // 取得 sideBarContent 樣板
        let str = '';
        if (countyName === "") {
            for (let i = 0; i < maskData.length; i++) {
                let maskDateName = maskData[i].properties.name;
                let maskDateAddress = maskData[i].properties.address;
                let maskDatePhone = maskData[i].properties.phone;
                let maskDateNote = maskData[i].properties.note;
                let maskDateAdult = maskData[i].properties.mask_adult;
                let maskDateChild = maskData[i].properties.mask_child;
                let maskGeometryLng = maskData[i].geometry.coordinates[0]; // 經度
                let maskGeometryLat = maskData[i].geometry.coordinates[1]; // 緯度

                str += `
                <div class="sideBarContentBox" data-lat="${ maskGeometryLat }" data-lng="${ maskGeometryLng }">
                    <strong class="sideBarContentBoxTitle">${ maskDateName }</strong>
                    <div class="sideBarContentBoxData">
                        <span>${ maskDateAddress }</span>
                        <span>${ maskDatePhone }</span>
                        <span>${ maskDateNote }</span>
                    </div>
                    <div class="sideBarContentBoxTitleCount">
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
                `
            }
        }
        else {
            for (let i = 0; i < countyFilterMask.length; i++) {
                let maskDateName = countyFilterMask[i].properties.name;
                let maskDateAddress = countyFilterMask[i].properties.address;
                let maskDatePhone = countyFilterMask[i].properties.phone;
                let maskDateNote = countyFilterMask[i].properties.note;
                let maskDateAdult = countyFilterMask[i].properties.mask_adult;
                let maskDateChild = countyFilterMask[i].properties.mask_child;
                let maskGeometryLng = countyFilterMask[i].geometry.coordinates[0]; // 經度
                let maskGeometryLat = countyFilterMask[i].geometry.coordinates[1]; // 緯度

                str += `
                <div class="sideBarContentBox" data-lat="${ maskGeometryLat }" data-lng="${ maskGeometryLng }">
                    <strong class="sideBarContentBoxTitle">${ maskDateName }</strong>
                    <div class="sideBarContentBoxData">
                        <span>${ maskDateAddress }</span>
                        <span>${ maskDatePhone }</span>
                        <span>${ maskDateNote }</span>
                    </div>
                    <div class="sideBarContentBoxTitleCount">
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
                `
            }
        }
        
        maskContent.innerHTML = str;
        moveMap();
    })

    // 取得 sideBarContent 樣板
    let str = '';
    for (let i = 0; i < maskData.length; i++) {
        let maskDateName = maskData[i].properties.name;
        let maskDateAddress = maskData[i].properties.address;
        let maskDatePhone = maskData[i].properties.phone;
        let maskDateNote = maskData[i].properties.note;
        let maskDateAdult = maskData[i].properties.mask_adult;
        let maskDateChild = maskData[i].properties.mask_child;
        let maskGeometryLng = maskData[i].geometry.coordinates[0]; // 經度
        let maskGeometryLat = maskData[i].geometry.coordinates[1]; // 緯度
        
        str += `
        <div class="sideBarContentBox" data-lat="${ maskGeometryLat }" data-lng="${ maskGeometryLng }">
            <strong class="sideBarContentBoxTitle">${ maskDateName }</strong>
            <div class="sideBarContentBoxData">
                <span>${ maskDateAddress }</span>
                <span>${ maskDatePhone }</span>
                <span>${ maskDateNote }</span>
            </div>
            <div class="sideBarContentBoxTitleCount">
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
        `
    }
    maskContent.innerHTML = str;
    countySelector.innerHTML = `<option value="">-- 請選擇縣市 --</option>` + countyOptions;
    moveMap();
    
}

L.control.locate({showPopup: false}).addTo(map).start();

// 日期相關
function getDate () {
    let date = new Date();
    let day = date.getDay();
    let today = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let changeChinese = changeDayChinese(day);
    let maskNumber = getMaskNumber();


    document.querySelector('.sideBarHeadWeek > span').textContent = changeChinese;
    document.querySelector('.sideBarHeadDataDate').textContent = `${year}-${month}-${today}`;
    document.querySelector('.sideBarHeadDataId > span').textContent = maskNumber;

    // 數字轉中文字
    function changeDayChinese (day) {
        switch (day) {
            case 1:
                day = "一";
                break;
            case 2:
                day = "二";
                break;
            case 3:
                day = "三";
                break;
            case 4:
                day = "四";
                break;
            case 5:
                day = "五";
                break;
            case 6:
                day = "六";
                break;
            case 0:
                day = "日";
                break;
        }
        return day;
    }

    // 判斷為奇偶數
    function getMaskNumber () {
        if (day === 0) {
            return '不限'
        }
        else if (day%2 === 0) {
            return '2,4,6,8,0'
        }
        else {
            return '1,3,5,7,9'
        }
    }
}

// sideBar 開關
$('.fa-angle-right').hide();
$('.fa-angle-left').click(function () {
    $('.sideBar').animate({ left: "-25%"}, 100)
    $('.content').css({
        width: "100%"
    })
    $('.fa-angle-right').show();
    $('.fa-angle-left').hide();
})
$('.fa-angle-right').click(function () {
    $('.sideBar').animate({ left: "0"}, 100, function() {
        $('.content').css({
            width: "75%"
        })
    });
    $('.fa-angle-right').hide();
    $('.fa-angle-left').show();
})

// 移動地圖
function moveMap (){
    let allBox = document.querySelectorAll('.sideBarContentBox');
    allBox.forEach( (item) => {
        item.addEventListener('click', function () {
            const lat = this.dataset.lat;
            const lng = this.dataset.lng;
            map.setView([lat, lng], 1300)
        })
    })
}



getDate();




