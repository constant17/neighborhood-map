 // Create a styles array to use with the map
var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

// These are the locations listings that will be shown to the user.
var neigborhood_locations = [
    {
        title: 'Bentley Road South East',
        position: { lat: 33.9177763, lng:  -84.47558609999999 },
        type: 'Ghetto neighborhood'
    },
    {
        title: 'Cosmopolitan Live',
        position: { lat: 33.9231882, lng: -84.47979409999999 },
        type: 'Bar & Restaurant'
    },
    {
        title: 'Reliable',
        position:{ lat: 33.923889, lng: -84.47273469999999 },
        type:  'Limousine service and Transit'
    },
	{
        title: 'Minks Package',
        position:{ lat: 33.9226044, lng:-84.4770456 },
        type:  'Liquor store'
    },
    {
        title: 'Rainbow Shops',
        position: { lat: 33.9229048, lng: -84.46666499999998 },
        type:  'Shopping'
    },
    {
        title: 'Bowlero Marietta',
        position:{ lat: 33.92401280000001, lng: -84.4739472 },
        type: 'Entertainment'
    },
    {
        title: 'Stratford Ridge',
        position: { lat: 33.9217291, lng: -84.47867559999997 },
        type: 'Appartment Building'
    },
    {
        title: 'Church of Christ',
        position: { lat: 33.9314198, lng: -84.47572600000001 },
        type: 'Church'
    },
    {
        title: 'Dollar General',
        position: { lat: 33.928505, lng: -84.493155 },
        type: 'Home Goods Store'
    },
    {
        title: 'Rio and Lounge',
        position: { lat: 33.9393016, lng: -84.50614769999999 },
        type: 'Club'
    },
    {
        title: 'Pappasito\'s Cantina',
        position: { lat: 33.90198880000001, lng: -84.47106329999997 },
        type: 'Restaurant'
    },
    {
        title: 'Kroger',
        position: {lat: 33.9230133, lng: -84.46993789999999 },
        type: 'Grocery Store'
    },
	{
        title: 'Kennesaw State University',
        position: {lat: 33.9390885, lng: -84.51916260000002 },
        type: 'School'
    },
	{
        title: 'Covered Bridge Condonium',
        position: {lat: 33.9295541, lng: -84.48087220000002 },
        type: 'Complex'
    },
	{
        title: 'Cracker Barrel Old Country Store',
        position: {lat: 33.9218911, lng: -84.49152989999999 },
        type: 'Restaurant'
    },
	{
        title: 'Dave & Buster\'s',
        position: {lat: 33.919681, lng: -84.4852 },
        type: 'Sport Bar'
    }
]
// Global Variables
var map, clientID, clientSecret;

function myView() {
    var self = this;
    this.markers = [];
	this.suggestPlaces = ko.observable("");
    // Populates the info window when the user clicks on the marker. 
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Foursquare API Credentials
            clientID = "N2HWZ4T045IGR5GP0IGPAGHQANWSFEOFNNXGPJ0Y5QJQT5KO";
            clientSecret = "IAOHJVEX5O0SFG3ALG3Z4LNILBX0AYCQHRVMXZ3WX5DKJ22K";
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API copied
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;
				self.htmlContentFoursquare =
                    '<i><h5 class="fs_stitle">' + self.category +
                    '</h5></i>' + '<div>' +
                    '<h6 class="fs_atitle"> Address: </h6>' +
                    '<p class="fs_address">' + self.street + '</p>' +
                    '<p class="fs_address">' + self.city + '</p>' +
                    '<p class="fs_address">' + self.country +
                    '</p>' + '</div>' + '</div>';
					infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                 alert(
                    "An error occured while loading Foursquare API. Please try again by refreshing your page."
                );
            }); 
			this.htmlContent = '<div>' + '<h3 class="fs_title">' + marker.title + '</h3>';
			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            });
        }
    };

    this.populateMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        var mapSpot = document.getElementById('map');
        var mapSuggestions = {
            center: new google.maps.LatLng(33.9226792, -84.48401539999998),
            zoom: 15,
            styles: styles
        };
        map = new google.maps.Map(mapSpot, mapSuggestions);

        // Setting InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < neigborhood_locations.length; i++) {
            this.markerTitle = neigborhood_locations[i].title;
            this.l_position = neigborhood_locations[i].position;
			
            // Google Maps marker setup
            this.marker = new google.maps.Marker({
                map: map,
                position: this.l_position,
                title: this.markerTitle,
                lat: this.l_position.lat,
                lng: this.l_position.lng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateMarker);
        }
    };

    this.initMap();

    // Adding locations to a list with data-bind
    this.locations = ko.computed(function() {
        var list_made = [];
        for (var i = 0; i < this.markers.length; i++) {
            var getLocations = this.markers[i];
            if (getLocations.title.toLowerCase().includes(this.suggestPlaces()
                    .toLowerCase())) {
                list_made.push(getLocations);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return list_made;
    }, this);
}

googleError = function googleError() {
    alert(
        'An error occured while loading Google maps. Please try again by refreshing the page!'
    );
};

$(document).ready(function() {
  function setWindowSize() {
    screenHeight = $(window).innerHeight();
    $('#map').css('min-height', screenHeight);
    $('#sidebar').css('min-height', screenHeight);
  };
  setWindowSize();

  $(window).resize(function() {
    setWindowSize();
  });
});

function launch() {
    ko.applyBindings(new myView());
}