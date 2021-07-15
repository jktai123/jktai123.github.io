(async function(){
  const container = document.querySelector('.side_nav_container')
  const returnBtn = document.querySelector('.return_position')
  const searchInput = document.getElementById('searchInput')
  const searchBtn = document.getElementById('search')
  const selShtOption = document.getElementById('select_sh')
  const options = [...document.querySelectorAll('.side_nav_option li')]
  const infiniteOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
  }
  const observerInfinite = new IntersectionObserver(infiniteData, infiniteOptions)
  let [latitude, longitude] = await getPosition()
  // let infoData = await getMaskInfo()
  // let infoData = getData(await getData0())

  const map = L.map('map').setView([latitude, longitude], 16).on('dragend', getAroundStore).on('zoomend', getAroundStore);
  const userIcon = L.icon({
    iconUrl: './img/dot.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
  })
  L.marker([latitude, longitude], {icon: userIcon}).addTo(map);
  let markers = [], locationInfo = {data: []}, sideInfo, range, maskType, markerCluster, dataCount = 0
  let sheet;
  const locationInfoProxy = new Proxy(locationInfo, {
    get(target, key){
      return target[key]
    },
    set(target, key, val){
      getSildInfo(val)
      getMarkers(val)
      target[key] = val
      return true
    }
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  selShtOption.addEventListener('change', Render_new)
  returnBtn.addEventListener('click', resetPosition)
  searchInput.addEventListener('keydown', searchCustomStore)
  searchBtn.addEventListener('click', searchCustomStore)
  const optionMap = {
    distance: optionDistance,
    maskType: optionMaskType
  }
  const optionStatus = options.reduce((prev, dom) => {
    let type = dom.parentNode.dataset.type
    if(!prev[type]) prev[type] = []
    prev[type].push(false)
    dom.addEventListener('click', setOptions)
    return prev
  }, {})
  const optionProxyHandler = {
    get(target, key){
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], optionProxyHandler)
      } else {
        return target[key];
      }
    },
    set(target, key, {status, dom}){
      target[key] = status
      if(status){
        let type = dom.parentNode.dataset.type
        dom.classList.add('active')
        optionMap[type](dom.dataset.option)
        getAroundStore()
      }else {
        dom.classList.remove('active')
      }
    }
  }
  const optionProxy = new Proxy(optionStatus, optionProxyHandler)
  function setOptions(){
    let type = this.parentNode ? this.parentNode.dataset.type : 'distance'
    let dom = [...document.querySelectorAll(`[data-type='${type}'] > li`)]
    let index = dom.indexOf(this) === -1 ? 0 : dom.indexOf(this)
    for(let i in optionProxy[type])optionProxy[type][i] = {status: false, dom: dom[i]}
    optionProxy[type][index] = {status: true, dom: dom[index]}
  }
  function optionDistance(info){range = info}
  function optionMaskType(info){maskType = info}
  function getPosition(){
    return new Promise(resolve=>{
      navigator.geolocation.getCurrentPosition(position => {
        resolve([position.coords.latitude, position.coords.longitude])
      });
    })
  }
   function getData(rawData){
    // let rawData =await getData0()
    const result = rawData.map(d=>{
      const newObject = {
        properties:{
            name:undefined,
            tel:undefined,
            address:undefined,
            phone:undefined},
        geometry:{
          coordinates:{
           lat:undefined,
        	 lng:undefined
          }
        } 
        
      }
      const filledKey = ["name",	"phone",	"tel",	"address",	"geolng"	,"geolat"]
      filledKey.forEach(key=>{
      	 key.includes('geo')
          ? newObject.geometry.coordinates[`${key.slice(3,key.length)}`] = d[`gsx$${key}`].$t
         :newObject.properties[`${key}`] = d[`gsx$${key}`].$t
      })
      return newObject
    })
    return result
  }


  	function getData0(sht){
    return new Promise(resolve=>{
      fetch('https://spreadsheets.google.com/feeds/list/19poyY7deDjxwYXhQArrSNm4xK7L0ZIsCT-ieLw-CI5c/'+sht+'/public/values?alt=json')
        .then(res=>res.json())
        .then(json=>resolve(json.feed.entry))
        .catch(err=>console.log(err))
      })
    }
  function getData1(sht){
    return new Promise(resolve=>{
      fetch('https://spreadsheets.google.com/feeds/list/19poyY7deDjxwYXhQArrSNm4xK7L0ZIsCT-ieLw-CI5c/'+sht+'/public/values?alt=json')
        .then(res=>res.json())
        .then(json=>json.feed.entry)
        .then(json=>{
          const result = json.map(d=>{
          const newObject = {
              properties:{
                  name:undefined,
                  tel:undefined,
                  address:undefined,
                  phone:undefined},
              geometry:{
                coordinates:{
                lat:undefined,
                lng:undefined
                }
              } 
              
          }
          const filledKey = ["name",	"phone",	"tel",	"address",	"geolng"	,"geolat"]
          filledKey.forEach(key=>{
            key.includes('geo')
              ? newObject.geometry.coordinates[`${key.slice(3,key.length)}`] = d[`gsx$${key}`].$t
            :newObject.properties[`${key}`] = d[`gsx$${key}`].$t
          })
          return newObject
        })
        // console.log(result);
        return resolve(result);
        })
        .catch(err=>console.log(err))
      })
    }

  function getMaskInfo(){
    return new Promise(resolve=>{
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
        .then(res=>res.json())
        .then(json=>resolve(Object.freeze(json.features)))
        .catch(err=>console.log(err))
    })
  }
  function getDateInfo(){
    const dayInfo = ['日', '一', '二', '三', '四', '五', '六']
    let day = new Date().getDay()
    document.getElementById('day').innerText = dayInfo[day]
    document.getElementById('buyInfo').innerHTML = day === 0 
    ? '全部<span>皆</span>可購買' 
    : day % 2 === 0 
    ? '身分證末碼為<span>偶數</span>可購買'
    : '身分證末碼為<span>基數</span>可購買'
  }
  
  function getSildInfo(maskInfo){
    dataCount = 0
    sideInfo = document.querySelectorAll('.side_nav_info')
    if(sideInfo.length){
      sideInfo.forEach(child => container.removeChild(child))
      container.scrollTop = 0
    }
    let info = maskInfo.sort(({geometry: {coordinates: a}}, {geometry: {coordinates: b}}) =>
      getDistance(latitude, longitude, a['lat'], a['lng']) - getDistance(latitude, longitude, b['lat'], b['lng'])
    )
    addSlidInfo(info)
  }
  function addSlidInfo(maskInfo){
    maskInfo.slice(dataCount, dataCount + 20).forEach(({properties, geometry: {coordinates}})=>{
      let distance = getDistance(latitude, longitude, coordinates['lat'], coordinates['lng'])
      let div = document.createElement('div')
      div.className = 'side_nav_info'
      div.innerHTML = `
      <div class="info_title">
        <h2>${properties.name}</h2>
        <p>約 ${distance >= 1 ? distance.toFixed(1) + 'km' : (distance * 1000 >>0) + 'm'}</p>
      </div>
      <div class="info">
        <img src="./img/place-24px.svg" alt="place">
        <p>${properties.address}</p>
      </div>
      <div class="info">
        <img src="./img/cell-phone.svg" height="24" alt="cellphone">
        <p>${properties.phone}</p>
      </div>
      <div class="info">
        <img src="./img/local_phone-24px.svg" alt="phone">
        <p>${properties.tel ? properties.tel : '暫無資料'}</p>
      </div>
      <div class="mask_status">
        <div class="adult ${properties.mask_adult ? '' : 'no_mask'}">成人口罩 : <span>${properties.mask_adult}</span></div>
        <div class="child ${properties.mask_child ? '' : 'no_mask'}">兒童口罩 : <span>${properties.mask_child}</span></div>
      </div>
      `
      container.appendChild(div)
    })
    sideInfo = [...document.querySelectorAll('.side_nav_info')]
    sideInfo.forEach(dom => dom.addEventListener('click', getStore))
    if(sideInfo.length) observerInfinite.observe(sideInfo[sideInfo.length - 1])
  }
  function infiniteData(e){
    let entry = e[0]
    if(entry.isIntersecting){
      dataCount += 20
      observerInfinite.unobserve(entry.target);
      addSlidInfo(locationInfoProxy.data)
    }
  }
  function getMarkers(maskInfo){
    markers = []
    maskInfo.forEach(({properties, geometry: {coordinates}})=>{
      markers.push(L.marker([coordinates['lat'], coordinates['lng']])
      .bindPopup(`
        <h2>${properties.name}</h2>
        <p><a href="https://www.google.com.tw/maps/place/${properties.address}" target="_blank">${properties.address}</a></p>
        
        <p>手機 | ${properties.phone}</p>
        <p>電話 | ${properties.tel ? properties.tel : '暫無資料'}</p>
        <div class='mask_status'>
          <div class="adult ${properties.mask_adult ? '' : 'no_mask'}">成人口罩 : <span>${properties.mask_adult}</span></div>
          <div class="child ${properties.mask_child ? '' : 'no_mask'}">兒童口罩 : <span>${properties.mask_child}</span></div>
        </div>
        
      `, {
        className: 'marker',
        autoPan: false
      }))
    })
    if(markerCluster) markerCluster.clearLayers()
    markerCluster = L.markerClusterGroup({
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    })
    markerCluster.addLayer(L.layerGroup(markers))
    map.addLayer(markerCluster);
  }
  function getStore(){
    if(!markers[sideInfo.indexOf(this)].isPopupOpen()){
      sideNav.classList.remove('active')
      let marker = markers[sideInfo.indexOf(this)]
      map.off('zoomend', getAroundStore);
      markerCluster.zoomToShowLayer(marker, () => {
        marker.openPopup()
        map.on('zoomend', getAroundStore);
      })
    }
  }
  function getDistance(lat1, lng1, lat2, lng2){
    return 2 * 6378.137 * Math.asin(Math.sqrt(Math.pow(Math.sin(Math.PI * (lat1-lat2)/360), 2)+Math.cos(Math.PI * lat1/180) * Math.cos(Math.PI * lat2/180)*Math.pow(Math.sin(Math.PI*(lng1-lng2)/360), 2)))
  }
  function getAroundStore(){
    locationInfoProxy.data = filterMaskType(filterRangeStore(infoData))
  }
  function searchCustomStore(e){
    if(e.keyCode === 13 || e.type === "click"){
      let value = searchInput.value.trim()
      if(value){
        setOptions()
        locationInfoProxy.data = filterMaskType(infoData).filter(({properties: {address, name}}) => {
          return address.indexOf(value) !== -1 || name.indexOf(value) !== -1
        })
        let location = locationInfoProxy.data[0].geometry.coordinates
        map.panTo([location['lat'], location['lng']], 16)
      }    
    }
  }
  function filterRangeStore(info){
    return info.filter(({geometry: {coordinates}})=>{
      if(range){
        return getDistance(latitude, longitude, coordinates['lat'], coordinates['lng']) < range
      }else {
        let bounds = {
          W: map.getBounds().getNorthWest().lng,
          E: map.getBounds().getNorthEast().lng,
          N: map.getBounds().getNorthWest().lat,
          S: map.getBounds().getSouthEast().lat
        }
        return (coordinates['lng'] < bounds.E && coordinates['lng'] > bounds.W)
        && (coordinates['lat'] < bounds.N && coordinates['lat'] > bounds.S)
      }
    })
  }
  function filterMaskType(info){
    return info.filter( info => maskType ? info.properties[maskType] !== 0 : info)
  }
  function resetPosition(){
    searchInput.value = ''
    map.panTo([latitude, longitude], 16)
    getAroundStore()
  }
  function getSname(){
    const api='https://script.google.com/macros/s/AKfycby2wc_EZaX2pcqBgCApZz5C2ZfYX09GNGJ6IFygOaxsTtYeBgnKmkpJqeNhAo8-A-pVnQ/exec';
    const fname='https://docs.google.com/spreadsheets/d/19poyY7deDjxwYXhQArrSNm4xK7L0ZIsCT-ieLw-CI5c/edit?usp=sharing'//https://docs.google.com/spreadsheets/d/1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo/edit?usp=sharing';
    const para_key='sheetUrl';
    let url=api+'?'+para_key+'='+fname;
    fetch( url )
      .then( response => response.json() )
      .then( response => {
          // console.log(response);
          $("#select_sh").empty();
          // $('#select_sh').append($('<option>', { 
          //       value: '',
          //       text : "---請選擇----"
          //          }));
            response.forEach((item)=>{
            console.log(item.id,item.Sname);
            $('#select_sh').append($('<option>', { 
                      value: item.id,
                      text : item.Sname 
            }))
            } );
          })
    

        }
  //getDateInfo()
  
  async function Render_new(){
    console.log(     $('#select_sh').val());
    // console.log(infoData);   
    infoData = await getData1($('#select_sh').val()); 
    // console.log(infoData);   
     getAroundStore();
  }

  getSname();

  // let infoData = getData(await getData0(1))
  let infoData = await getData1(1);
  // console.log(infoData);
  getAroundStore()
  //getDateInfo()
})()