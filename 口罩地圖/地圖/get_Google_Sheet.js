(async function(){
  try{
    let rawData =await getData()
    const result = rawData.map(d=>{
      const newObject = {
       
        name:undefined,
        hp:undefined,
        addr:undefined,
        tel:undefined,
        
        geometry:{
          coordinates:{
          	 lat:undefined,
        	 lng:undefined
          }
         
        }
        
      }
      const filledKey = ["name",	"tel",	"hp",	"addr",	"geolng"	,"geolat"]
      filledKey.forEach(key=>{
      	 key.includes('geo')
          ? newObject.geometry.coordinates[`${key.slice(3,key.length)}`] = d[`gsx$${key}`].$t
         :newObject[`${key}`] = d[`gsx$${key}`].$t
      })
      return newObject
    })
    
    console.log(result)
  }catch(err){
    console.log(err)
  }
}())
	
	function getData(){
    return new Promise(resolve=>{
      fetch('https://spreadsheets.google.com/feeds/list/19poyY7deDjxwYXhQArrSNm4xK7L0ZIsCT-ieLw-CI5c/1/public/values?alt=json')
        .then(res=>res.json())
        .then(json=>resolve(json.feed.entry))
        .catch(err=>console.log(err))
    })
  }