const map = L.map('map').setView([32.63188332081661, -115.4562838930214], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

const url = "https://spreadsheets.google.com/feeds/list/1RlYgkgQCWUYNnwwPTRN4qrrIzkZ_fv6zJYtOFoK-9f4/ocya9of/public/values?alt=json"
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
                // console.log(data)
                formatData(data)
        }
)

// map shows reports divded between events reported to any authorites and events not reported at all
let newReport = L.featureGroup();
let otherReport = L.featureGroup();

let dotsOptions = { //i think this will be deleted as we will display them by state
        radius: 7,
        fillColor: "#ff7800",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.6
    }

// for all records in data, get unique states 
// then each state has count of all events, reported events, not reported events
// color each state based on the count of the data



// this is for display
let countNewReports = 0
let countOtherReports = 0

function addMarker(data){
        console.log(data.reportedtowho)
        let reportType
        // this logic is for interactivity and the actual data
        if(data.reportedtowho == "I did not report this incident to any authorities"){
                //
                countFirstTimeReports += 1
                reportType = "new"
        }
        else{
                //
                countOfOtherReports += 1
                reportType = "other"
        }
        let thisMarker = {
                "lat":data.lat,
                "lng":data.lng,
                "report":reportType,
                "timestamp":data.timestamp,
                
        }
        if(data.reporter == "I am reporting an incident that happened to me."){
                dotsOptions.fillColor = "green"
                selfReport.addLayer(L.circleMarker([data.lat,data.lng],dotsOptions).bindPopup(`<h2>${"Location: " + data.cityortown}</h2>${data.timestamp}<br>${"Gender: " + data.gender}<br> ${"Age: " + data.age}`))
                createButtons(data.lat,data.lng,data.event,reportType)
                createButtons(thisMarker)
                createButtons2(data.lat,data.lng,data.authoritiesresponse)
                createButtons3(data.lat,data.lng,data.resources)
        }
        else{
                dotsOptions.fillColor = "purple"
                advocateReport.addLayer(L.circleMarker([data.lat,data.lng],dotsOptions).bindPopup(`<h2>${"Location: " + data.cityortown}</h2>${data.timestamp}<br>${"Gender: " + data.gender}<br> ${"Age: " + data.age}`))
                createButtons(data.lat,data.lng,data.event)
                createButtons2(data.lat,data.lng,data.authoritiesresponse)
                createButtons3(data.lat,data.lng,data.resources)
        }
        // console.log(data)
        return
}

// refer to this: https://github.com/rachan2023/21S-191A-Against-Asian-Hate/blob/main/Final%20project/js/init.js

function createButtons(data){
        const newButton = document.createElement("button"); // adds a new button
        newButton.id = "button"+title; // gives the button a unique id
        newButton.innerHTML = `<h2>${data.reportedtowho}</h2>`; // gives the button a title
        newButton.setAttribute("typeOfReport",data.reportedtowho); // sets the latitude 
        newButton.setAttribute("lat",data.lat); // sets the latitude 
        newButton.setAttribute("lng",data.lng); // sets the longitude 
        newButton.addEventListener('click', function(){
            map.flyTo([data.lat,data.lng],10); //this is the flyTo from Leaflet
        })
        const SpaceForButtons = document.getElementById('box1')
        SpaceForButtons.appendChild(newButton); //this adds the button to our page.
      }

function createButtons2(lat,lng,title){
        const newButton2 = document.createElement("button"); // adds a new button
        newButton2.id = "button"+title; // gives the button a unique id
        newButton2.innerHTML = title; // gives the button a title
        newButton2.setAttribute("lat",lat); // sets the latitude 
        newButton2.setAttribute("lng",lng); // sets the longitude 
        newButton2.addEventListener('click', function(){
                map.flyTo([lat,lng],10); //this is the flyTo from Leaflet
        })
        const SpaceForButtons = document.getElementById('box2')
        SpaceForButtons.appendChild(newButton2); //this adds the button to our page.
        }

function createButtons3(lat,lng,title){
const newButton3 = document.createElement("button"); // adds a new button
newButton3.id = "button"+title; // gives the button a unique id
newButton3.innerHTML = title; // gives the button a title
newButton3.setAttribute("lat",lat); // sets the latitude 
newButton3.setAttribute("lng",lng); // sets the longitude 
newButton3.addEventListener('click', function(){
        map.flyTo([lat,lng],10); //this is the flyTo from Leaflet
})
const SpaceForButtons = document.getElementById('box3')
SpaceForButtons.appendChild(newButton3); //this adds the button to our page.
}


function formatData(theData){
        const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
        const rows = theData.feed.entry
        for(const row of rows) {
          const formattedRow = {}
          for(const key in row) {
            if(key.startsWith("gsx$")) {
                  formattedRow[key.replace("gsx$", "")] = row[key].$t
            }
          }
          formattedData.push(formattedRow)
        }
        console.log(formattedData)
        let totalResults = formattedData.forEach(addMarker)
        let firstReports = totalResults[0]
        let otherReports = totalResults[1]
        selfReport.addTo(map)
        advocateReport.addTo(map)
        let allLayers = L.featureGroup([newReport,otherReport]);
        map.fitBounds(allLayers.getBounds());
}

let layers = {
	"Events not reported to any authorities": newReport,
	"Events reported to any authority": otherReport
}

L.control.layers(null,layers).addTo(map)