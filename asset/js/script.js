
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
                self.country = response.location.formattedAddress[4] || " Country name not provided";
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
  }
  setWindowSize();

  $(window).resize(function() {
    setWindowSize();
  });
});

function launch() {
    ko.applyBindings(new myView());
}
