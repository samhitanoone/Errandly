

//global variables 
var formattedAddress;
var lat;
var lng;
var locationArray = [];
var address = '3423 Peidmont Rd Atlanta GA';
var map;

document.getElementById('addressform').addEventListener('submit', (e) => {  //form submit event that will set submitted address to address to be fetched in goecode API
    e.preventDefault();
    address = document.getElementById('location').value;
    
    geocode(address)
        .then(function(response){
            formattedAddress = response.data.results[0].geometry.location; //
            lat = formattedAddress.lat;
            lng = formattedAddress.lng
            
            var type = document.getElementById('type').value; //drop down in form will equals type here, will render a different marker for each type
            if (type == 'user') {
                addUserMarker({lat, lng});
            } else {
                addJobMarker({lat, lng});
            }
        })
        .catch(function(error){
            console.error(error);
        })
})

function addJobMarker(details) {    //different types of markers for types of job or task
    addMarker({
        coords: {
            lat: details.lat,
            lng: details.lng,
        },
        // iconImage: './job.png',
        content: `<h6>Job Details: ${details.title}</h6>
        `
    })
}

function addUserMarker(details) {  //different types of markers for types of job or task
    addMarker({
        coords: {
            lat: details.lat,
            lng: details.lng,
        },
        // iconImage: './user.png',
    })
}

//geocode function
function geocode(location){
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json',{ 
        params: {
            address: location,
            key: 'AIzaSyBymnxB6YX3rXtc5GXONriPRZD57jqt9Ww'
        }
    })
}

// google maps
function initMap() {
    var options = {
        zoom: 8,
        center: {
            lat:33.8437699,
            lng:-84.3680624
        }
    }
    //set up map
    map = new google.maps.Map(document.getElementById('map'), options);

    // var markers = [{
    //     coords:{lat:locationArray[0], lng:locationArray[1]},
    //     iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    //     content: '<h1>Dont like boston</h1>'    
    // }, {coords:{lat:42.8587,lng:-70.9308}}, {coords:{lat:42.7765,lng:-71.0765}}]

    geocode(address)
        .then(function(response){
            formattedAddress = response.data.results[0].geometry.location;
            lat = formattedAddress.lat;
            lng = formattedAddress.lng

            addMarker({
                coords: {
                    lat: lat,
                    lng: lng,
                },
                // iconImage: './iconimage.png',
                content: '<h4>example</h4>'
            })
        })
        .catch(function(error){
            console.log(error);
        })
}

function addMarker(props){
    // props = {
    //     coords: {
    //         lat: 30,
    //         lng: 30,
    //     },
    //     iconImage: './imagefile.png',
    //     content: '<div>some html content as a string</div>'
    // }
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
    })
    if(props.iconImage){
        marker.setIcon(props.iconImage);
    }
    if(props.content){
        var infoWindow = new google.maps.InfoWindow({
            content: props.content
        });
        marker.addListener('click',function(){
            infoWindow.open(map, marker);
        });
    }
};
