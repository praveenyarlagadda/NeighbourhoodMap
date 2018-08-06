var ClickedLocation = "";
var Temperature = "";
var MapBounds;
var MapPopup;

var SelectedPlaces = [{
    Place: 'DFW Airport',
    location: {
        lat: 32.8998,
        lng: -97.0403
    },
    MoreInfo: '',
    show: true,
},
    {
        Place: 'Dallas Zoo',
        location: {
            lat: 32.7405,
            lng: -96.8162
        },
        MoreInfo: '',
        show: true,
    },
    {
        Place: 'Dallas Arboretum',
        location: {
            lat: 32.8234,
            lng: -96.7169
        },
        MoreInfo: '',
        show: true,
    },
   {
       Place: 'Dallas Downtown',
       location: {
           lat: 32.7791,
           lng: -96.8003
       },
       MoreInfo: '',
       show: true,
   },
   {
       Place: 'Klyde Warren Park',
       location: {
           lat: 32.789364,
           lng: -96.801781
       },
       MoreInfo: '',
       show: true,
   }
];



function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.412308, lng: -121.902329 },
        zoom: 13,
        mapTypeControl: false
    });

    MapPopup = new google.maps.InfoWindow();
    MapBounds = new google.maps.LatLngBounds();
    ko.applyBindings(new AddLocations());
}



var mySelectedPlaces = function (data) {
    var self = this;
    this.location = data.location;
    this.visible = ko.observable(true);
  
    this.marker = new google.maps.Marker({
        position: this.location,
        animation: google.maps.Animation.DROP

    });


    this.highlightMarker = ko.computed(function () {
        var markerShow = this.visible() ? this.marker.setMap(map) : this.marker.setMap(null);
        if (this.visible()) {
            MapBounds.extend(this.marker.position);
            map.fitBounds(MapBounds);
        }
        return markerShow;
    }, this);

    this.marker.addListener('click', function () {
        PopulateMarkerData(this, data.location, data.Place, MapPopup);

    });



};

var AddLocations = function () {
    var self = this;
    this.locationsList = ko.observableArray([]);
    SelectedPlaces.forEach(function (locationItem) {
        self.locationsList.push(new mySelectedPlaces(locationItem));
    });

   
};

function PopulateMarkerData(marker, location, title, infoPopup) {
    if (infoPopup.marker != marker) {
        infoPopup.marker = marker;
        infoPopup.addListener('closeclick', function () {
            infoPopup.marker = null;
        });

        getLocationInfo(location.lat, location.lng);
        getWeaterInfo(location.lat, location.lng);
        var tmpLocation = "";
        var tmpTemperature = "";
        if (ClickedLocation != "Error") {
            tmpLocation = ClickedLocation;
        }
        else {
            tmpLocation = "Error getting location details.";
        }
        if (Temperature != "Error") {
            tmpTemperature = Temperature + "F";;
        }
        else {
            tmpTemperature = "Error getting weather info.";
        }
        var dv = '<div style="padding:5px"><div><b>' + title + '</b></div><div>' + tmpLocation + '</div><div>Temperature: ' + tmpTemperature + '</div>' + '</div>';


        infoPopup.setContent(dv);

    };
    infoPopup.open(map, marker);


}
function getLocationInfo(lat, lon) {

    var ret = "";
    var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "";

    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        cache: false,
        timeout: 30000,
        success: function (dataReturn) {
            ClickedLocation = dataReturn.results[0].formatted_address;
        },
        error: function (dataReturn) {
            Temperature = "Error";
        }
    });
    return ret;
}
function mapError() {
    $('#map').text('Error loading Map, Please refresh the browser!!!');
}
function getWeaterInfo(lat, lon) {

    var ret = "";
    var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon + "";
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        cache: false,
        timeout: 30000,
        error: function () {
            return true;
        },
        success: function (dataReturn) {

            var currentTempInCelsius = Math.round(dataReturn.main.temp * 10) / 10;
            Temperature = currentTempInCelsius;

        },
        error: function (dataReturn) {
            Temperature = "Error";
        }
    });
}

