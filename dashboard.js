
let map;
function initMap(){
    var options = {
        zoom: 8,
        center: {lat: 33.7490, lng:-84.3880}
    };
    map = new google.maps.Map(document.getElementById('map'),options);
}
