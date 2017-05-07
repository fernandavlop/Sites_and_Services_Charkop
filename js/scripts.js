// instantiate the map object
var map = L.map('mapContainer', {
  scrollWheelZoom: false
  }).setView([19.215342, 72.828487], 15);
//add a dark basemap from carto's free basemaps
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);
//assignn colors according to geojson values
var layer = L.geoJson(myData).addTo(map);

function getColor(d) {
    return d == 1  ? '#7a0177' :
           d == 2  ? '#fa9fb5' :
           d == 3  ? '#7a0177' :
           d == 4  ? '#7a0177' :
           d == 5  ? '#7a0177' :
           d == 6  ? '#fa9fb5' :
           d == 7  ? '#7a0177' :
                      '#FFEDA0';
}

function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 1,
            opacity: .9,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.45,

        };
    }
//Add highlight feature
var geojson = L.geoJson(myData, {style: style}).addTo(map);

function highlightFeature(e) {
    var layer= e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });


        info.update(layer.feature.properties);

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

//mousout
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

//zoom to feature on click of municipality
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//listen for the functions so that on these actions it highlights, zooms etc.
function onEachFeature(feature,layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        
    });
}
geojson = L.geoJson(myData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
//Add control with descriptions
var info = L.control({
  position: 'bottomleft',
  collapsed: false
});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// including a description for all sectors 
info.update = function (props) {
       this._div.innerHTML = '<h6>Description of visited sites</h6>' +  (props ?
        '<b>' + props.name + '</b><br />' +  '<b>Income</b><br />' + props.type +
        '</b><br />' +  '<b>Tenure</b><br />' + props.tenure+
        '</b><br />' +  '<b> Ownership/Renter ratio</b><br />' + props.ratio +
        '</b><br />' +  '<b> Number of people living at home</b><br />' + props.people +
        '</b><br />' +  '<b> Quote</b><br />' + '<h6>' + props.word + '</h6>'
        : 'Hover over a sector!');
};

info.addTo(map);

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');
//create legend and a loop that connects land use categories and colors
    grades = [1,2,3,4,5,6,7],
    visit = ['Sectors interviewed by the NYU team','Sectors visited by the NYU team'];

    for (var i = 0; i < visit.length; i++) {
        div.innerHTML +=
        '<i class="circle" style="background:' + getColor(grades[i]) + '"></i> ' +
         (visit[i] ? visit[i] + '<br>' : '+');
    }

    return div;


};

legend.addTo(map);
//Adding second map including ownershp details
var map2 = new L.Map('map', { 
      center: [19.215342, 72.828487],
      zoom: 16,
      scrollWheelZoom: false
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map2);

var layerUrl = 'https://nyu.carto.com/u/fernandavlop/builder/bfe05928-1dff-11e7-a883-0ecd1babdde5/embed'

    cartodb.createLayer(map2, layerUrl).addTo(map2);

//Below I tried to set interactivity without embeding the map. However, I could not initiate sql and my leyer did not show the desired data points. 

//var map = new L.Map('map', { 
//center: [19.215342, 72.828487],
//zoom: 15
//});

//L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
 // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//}).addTo(map);

//var layerUrl = 'https://fernandavlop.carto.com/api/v2/viz/bfe05928-1dff-11e7-a883-0ecd1babdde5/viz.json';

//cartodb.createLayer(map, layerUrl)
  //.addTo(map);





