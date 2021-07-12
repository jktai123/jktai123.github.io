//本篇重點//
/*

1.預設地點在台北市大安區,載入系統時會顯示在此區域,藥局資訊也是

2.嘗試製作整頁滾動

3.口罩的數量若為0,背景色將改成紅色


*/



/*

bootstrap的jQuery


*/

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

$(function () {
  $('[data-toggle="tooltip"]').tooltip('enable');
})


//讓左邊選單藥局資訊欄部分的高度隨螢幕高度變化

const cont = document.querySelector('.content');


document.querySelector('.l_menu').style.height=window.innerHeight-118+"px";

window.onresize=function(){
  document.querySelector('.l_menu').style.height=window.innerHeight-118+"px";
}

cont.style.height=window.innerHeight-378+"px";

window.onresize=function(){
  cont.style.height=window.innerHeight-378+"px";
}


//判斷時間,日期以及購買資格

let canbuy = document.querySelector('.whocanbuy');

function startTime(){
      let twnum = ["日","一","二","三","四","五","六"];
      let today = new Date();
      let mon = today.getMonth()+1;
      let date = today.getDate();
      let week = today.getDay();
      let hh = today.getHours();
      let mm = today.getMinutes();
      mm = checkTime(mm);
      hh = checkTime(hh);
      mon = checkTime(mon);
      date = checkTime(date); 
      document.querySelector('.jsdate').innerHTML = mon + "&nbsp/&nbsp" + date;
      document.querySelector('.jsweek').innerHTML = "星&nbsp期&nbsp" + twnum[week];
      document.querySelector('.jstime').innerHTML = hh + ":" + mm;
      let timeoutId = setTimeout(startTime, 500);
      
      switch (week) {
        case 1:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 3:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 5:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 0:
          document.querySelector('.whocanbuy').innerHTML = "大家都能買";
          canbuy.setAttribute('title', '大家都可以買喔');
          break;
        default:
          document.querySelector('.whocanbuy').innerHTML = "偶數號購買日";
          canbuy.setAttribute('title', '身分證尾數0,2,4,6,8的朋友');
          break;
      }
    }


function checkTime(i){

  if(i < 10) {
    i = "0" + i;
  }

  return i;
}


let load = document.querySelector('.load');

let load_cont = document.querySelector('.load-cont');


//抓取口罩資料


let zonedata=[];        //儲存藥局資訊
let zonelocaltion=[];   //儲存藥局座標

(function maskdata(){
  xhr=new XMLHttpRequest();
  xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
  xhr.onreadystatechange = function() {//利用onreadystatechange來監測readyState及status是否為正常(若讀取成功readyState會=4,status會=200)''本段用來擷取features資料''
      if (xhr.readyState === 4 && xhr.status === 200) {

        load.setAttribute('style', ' background-color: transparent');

        load_cont.setAttribute('style', ' opacity: 0');


        setTimeout(function(){ load.setAttribute('style', 'display: none'); },3200);
        

        L.control.zoom({

          position: 'topright'

        }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        

        const data = JSON.parse(xhr.responseText);
        const dataLen = data.features.length;        

        for (let i = 0; dataLen > i; i++) {
          zonedata.push(data.features[i].properties);
          zonelocaltion.push(data.features[i].geometry);

        }

        pointinfo(zonedata,'臺北市','中正區');       
        addMarker(zonedata);             

      }
          
    };
    xhr.send(null);


})(goto);

//製作點擊卡片之後的快速導覽功能


pointinfo.onload = cont.addEventListener('click',goto, true);


function goto(e){

  let cardnum = e.target.dataset.cards; 
  const maskAdult = zonedata[cardnum].mask_adult;
  const maskChild = zonedata[cardnum].mask_child;
  let localx = zonelocaltion[cardnum].coordinates[1];
  let localy = zonelocaltion[cardnum].coordinates[0];
  const adultalarm = (() => {
                   if (maskAdult > 500) {
                     return '#4ecdc4';
                   }
                   else if (maskAdult >= 500 && maskAdult > 100) {
                     return '#ffe66d';
                   }
                   else {
                     return '#ff6b6b';
                   }
                 })();

  const childalarm = (() => {
                   if (maskChild > 500) {
                     return '#4ecdc4';
                   }
                   else if (maskChild >= 500 && maskChild > 100) {
                     return '#ffe66d';
                   }
                   else {
                     return '#ff6b6b';
                   }
                 })();

  let icd = `
             <div class="card mb-3 infocards" style="max-width: 338px">

             <h5 class="title m-4 h3">${zonedata[cardnum].name}</h5>

             <ul class="list-group">
               <li class="list-group-item list-group-item-action">${zonedata[cardnum].phone}</li>
               <li class="list-group-item list-group-item-action">${zonedata[cardnum].address}</li>
               <li class="list-group-item list-group-item-action">${zonedata[cardnum].note}</li>
             </ul>

             <section class="d-flex justify-content-between flex-direction-row">

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${adultalarm};">
             成人
             <div class="font-weight-bold text-center">${maskAdult}</div>
             <div class="text-right">個</div>
             </div>

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${childalarm};">
             孩童
             <div class="font-weight-bold text-center">${maskChild}</div>
             <div class="text-right">個</div>
             </div>

             </section>
             </div>
             `;

  map.setView([localx, localy],30);
  L.marker([localx, localy]).addTo(map).bindPopup(icd).openPopup();  

}



//口罩地圖的json縣市地區有缺漏,所以額外尋找鄉鎮市區資料來抓取


const allcitys=[];

let loc;

(function addressdata(){
  loc=new XMLHttpRequest();
  loc.open('get','https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json');
  loc.send(null);

  loc.onreadystatechange = function() {//利用onreadystatechange來監測readyState及status是否為正常(若讀取成功readyState會=4,status會=200)''本段用來擷取features資料''
      if (loc.readyState === 4 && loc.status === 200) {

        const datas = JSON.parse(loc.responseText);
        const dataL = datas.length;             

        for (let i = 0; dataL > i; i++) {

          allcitys.push(datas[i].CityName);                

        }

        removeByValue(allcitys, '南海島');
        removeByValue(allcitys, '釣魚臺');
        selection_county(allcitys);        

      }
          
    };

})();

//把空資料的南海島跟釣魚台從列表中刪除
function removeByValue(array, value) {
  return array.forEach((item, index) => {
    if(item === value) {
      array.splice(index, 1);
    }
  })
}


//載入地圖資料


//let map = L.map('map').setView([25.033976, 121.5623502], 13, (zoomControl false);

let map = L.map('map', {
  center: [25.033976, 121.5623502], // 台北市區的經緯度（地圖中心）
  zoom: 13, // 地圖預設尺度
  zoomControl: false // 是否顯示預設的縮放按鈕（左上角）
}) 


//<!-- 1.定義 marker 顏色，把這一段放在 getData() 前面 -->
let mask;
//<!-- 2.我們取出綠、橘、紅三個顏色來代表口罩數量的不同狀態 -->
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    //<!-- 3.只要更改上面這一段的 green.png 成專案裡提供的顏色如：red.png，就可以更改 marker 的顏色-->
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});




function addMarker(){

  const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(map);


  for(let i = 0;i<zonedata.length;i++){

  //> <!-- 1.由於我們已能存取 zonedata 裡的資料，所以我們就按照 API 的使用說明來取用資料 -->

  const maskAdult = zonedata[i].mask_adult;
  const maskChild = zonedata[i].mask_child;
  const lat = zonelocaltion[i].coordinates[1];
  const lng = zonelocaltion[i].coordinates[0];

  const adultalarm = (() => {
                   if (maskAdult > 500) {
                     return '#4ecdc4';
                   }
                   else if (maskAdult >= 500 && maskAdult > 100) {
                     return '#ffe66d';
                   }
                   else {
                     return '#ff6b6b';
                   }
                 })();

  const childalarm = (() => {
                   if (maskChild > 500) {
                     return '#4ecdc4';
                   }
                   else if (maskChild >= 500 && maskChild > 100) {
                     return '#ffe66d';
                   }
                   else {
                     return '#ff6b6b';
                   }
                 })();

  const ic = `
             <div class="card mb-3 infocards" style="max-width: 338px">

             <h5 class="title m-4 h3">${zonedata[i].name}</h5>

             <ul class="list-group">
               <li class="list-group-item list-group-item-action">${zonedata[i].phone}</li>
               <li class="list-group-item list-group-item-action">${zonedata[i].address}</li>
               <li class="list-group-item list-group-item-action">${zonedata[i].note}</li>
             </ul>

             <section class="d-flex justify-content-between flex-direction-row">

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${adultalarm};">
             成人
             <div class="font-weight-bold text-center">${maskAdult}</div>
             <div class="text-right">個</div>
             </div>

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${childalarm};">
             孩童
             <div class="font-weight-bold text-center">${maskChild}</div>
             <div class="text-right">個</div>
             </div>

             </section>
             </div>
             `;

             let masks = document.querySelectorAll('.masks');             
             

             //<!-- 2.下判斷式，依據不同的口罩數量，來顯示不同的 marker 顏色 -->

             if(maskAdult > 500 || maskChild > 500){

              mask = greenIcon;              

            }

            else if (maskAdult <= 500 && maskAdult > 100 || maskChild <= 500 && maskChild > 100){

              mask = orangeIcon;
             
            }

            else{

              mask = redIcon;

            }

            //>  <!-- 3.最後，將 marker 標至地圖上 -->

            markers.addLayer(L.marker([lat,lng], {icon: mask}).bindPopup(ic));

          }

          map.addLayer(markers);

        }





//初始資料,開啟地圖時的預設顯示資料


function pointinfo(parameter,city,townss){

  let str = "";
  for (let i = 0; i < parameter.length; i++) {

    if(parameter[i].county == city && parameter[i].town == townss){
    
    str += `
      <div class="card mb-3 infocards" data-cards="${i}">

    <h5 class="title m-4 h1">${parameter[i].name}</h5> 

    <section class="d-flex justify-content-between flex-direction-row"> 

      <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
        成人
        <div class="font-weight-bold text-center textm">${parameter[i].mask_adult}</div>
        <div class="text-right">個</div>  
      </div>  

      
       <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
        孩童
        <div class="font-weight-bold text-center textm">${parameter[i].mask_child}</div>
        <div class="text-right">個</div>  
      </div>
     

      </section>

 
            
        <ul class="list-group">
          <li class="list-group-item list-group-item-action">${parameter[i].phone}</li>
          <li class="list-group-item list-group-item-action">${parameter[i].address}</li>
          <li class="list-group-item list-group-item-action">${parameter[i].note}</li>
        </ul>



    </div>

    `;




      let localx = zonelocaltion[i].coordinates[1];
      let localy = zonelocaltion[i].coordinates[0];  
     

      map.setView(new L.LatLng(localx, localy),15);



    }

  }

  cont.innerHTML = str;



//製作庫存狀態燈號

  let mask_a = document.querySelectorAll('.mask-a');  
  

  for(var i=0; i<mask_a.length; i++) {

    let adu=mask_a[i].dataset.adult;//用來捕捉資訊卡內的資料編號data-adult
    

      if(parameter[adu].mask_adult > 500)
      {
          mask_a[i].setAttribute('style', 'background-color: #4ecdc4');

      }
      else if (parameter[adu].mask_adult <= 500 && parameter[adu].mask_adult > 100)
      {
          mask_a[i].setAttribute('style', 'background-color: #ffe66d');
      }      
      else
      {
          mask_a[i].setAttribute('style', 'background-color: #ff6b6b');
      }
     
      
  }

  let mask_c = document.querySelectorAll('.mask-c');

  

  for(var i=0; i<mask_c.length; i++) {

     let chi=mask_c[i].dataset.child;

      if(parameter[chi].mask_child > 500)
      {
          mask_c[i].setAttribute('style', 'background-color: #4ecdc4');
      }
      else if (parameter[chi].mask_child <= 500 && parameter[chi].mask_child > 100)
      {
          mask_c[i].setAttribute('style', 'background-color: #ffe66d');
      }      
      else
      {
          mask_c[i].setAttribute('style', 'background-color: #ff6b6b');          
      }
     
      
  } 
     

}





//製作下拉式選單選項(縣市部分)


let area =document.querySelector('.jscounty');

function selection_county(parameter){

  // view
  for (let i = 0; i < parameter.length; i++) {


    const addoption = document.createElement('Option');
    addoption.textContent = parameter[i];
    addoption.setAttribute('value', parameter[i]);
    area.appendChild(addoption);

  }

}

area.addEventListener('change',gotocounty);

let parttown = [];

let cities = [];

let choosecounty;

function gotocounty(e){

  choosecounty = e.target.value;
  

  const datas = JSON.parse(loc.responseText);

  const dataL = datas.length;

  for(let i = 0; i < dataL;i++){

    if(choosecounty == datas[i].CityName){

      parttown.length=0;

      alladdress.length=0;

      cities.length=0;
      
      parttown.push(datas[i]);

      townlen = datas[i].AreaList;

      cities.push(townlen[0].AreaName);
   
    }  


  }

  pointinfo(zonedata,choosecounty,cities);

  selection_town(parttown);


}



//製作下拉式選單選項(鄉鎮區部分)

let alladdress = [];

let townlen;


let towns =document.querySelector('.jstown');


function selection_town(part){

  let str = `<option selected>鄉鎮區</option>`; 

  for(let i = 0; i < townlen.length; i++){


    alladdress.push(part[0].AreaList[i].AreaName);

    if(choosecounty!=='縣市'){    

    str+=`<option>${alladdress[i]}</option>`;

  }

  }

  towns.innerHTML = str;



}

towns.addEventListener('click', gototown);

let choosetown;

function gototown(e){

  choosetown = e.target.value;

  if(choosetown!=='鄉鎮區'){

  pointinfo(zonedata,choosecounty,choosetown);

  }
  

}

