let map;
let service;
let infowindow;
let currentLocation;

function initMap() {
    // Default location (for the initial map load)
    currentLocation = { lat: -33.866, lng: 151.196 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 15,
    });

    const request = {
        location: currentLocation,
        radius: '500',
        type: ['restaurant'],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        infowindow = new google.maps.InfoWindow();

        results.forEach((place) => {
            const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, 'click', () => {
                infowindow.setContent(place.name);
                infowindow.open(map, marker);
            });
        });
    }
}

function findTop5Foods() {
    const userLocation = map.getCenter();
    const request = {
        location: userLocation,
        radius: '500',
        type: ['restaurant'],
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            infowindow = new google.maps.InfoWindow();
            let counter = 0;

            results.forEach((place) => {
                if (counter < 5) {
                    const marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                    });

                    google.maps.event.addListener(marker, 'click', () => {
                        infowindow.setContent(place.name);
                        infowindow.open(map, marker);
                    });

                    counter++;
                }
            });
        }
    });
}

function findBestFoods() {
    const userLocation = map.getCenter();
    const request = {
        location: userLocation,
        radius: '1000',
        type: ['restaurant'],
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            infowindow = new google.maps.InfoWindow();
            results.sort((a, b) => b.rating - a.rating); // Sorting by rating for "best" places

            results.forEach((place, index) => {
                if (index < 5) {
                    const marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                    });

                    google.maps.event.addListener(marker, 'click', () => {
                        infowindow.setContent(place.name);
                        infowindow.open(map, marker);
                    });
                }
            });
        }
    });
}

function addAddress() {
    const geocoder = new google.maps.Geocoder();
    const address = prompt("Enter your address:");

    geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function getLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            map.setCenter(pos);

            new google.maps.Marker({
                position: pos,
                map: map,
                title: "Your Live Location",
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
