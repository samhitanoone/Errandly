// Googlemap Object Instance
var map;
var markers = []; // keep track of markers, so we can clear them when needed!
let placeHolderUsername = "aklein"; // Since we don't currently know the logged in user. Once we do, we will use that.

var firebaseConfig = {
  apiKey: "AIzaSyCTwkgXKLeiPztENJqsqE0dosOZMx74DkE",
  authDomain: "samhitanoone-dc-pjt1-errandly.firebaseapp.com",
  databaseURL: "https://samhitanoone-dc-pjt1-errandly.firebaseio.com",
  projectId: "samhitanoone-dc-pjt1-errandly",
  storageBucket: "samhitanoone-dc-pjt1-errandly.appspot.com",
  messagingSenderId: "496530300183",
  appId: "1:496530300183:web:4cc570d2bdfd9293"
};

// Get handles on each of the drop down button choices
const allTasks = document.getElementById("allTasks");
const washDishesBtn = document.getElementById("washDishes");
const mowLawnBtn = document.getElementById("mowLawn");
const walkDogBtn = document.getElementById("walkDog");

// Get handle on Add Task Submit Button
const submitBtn = document.getElementById("submitButton");

// Get handles for Task Submit Form Fields
const formControlUsername = document.getElementById("formControlUsername");
const formControlAddress = document.getElementById("formControlAddress");
const formControlCity = document.getElementById("formControlCity");
const formControlTask = document.getElementById("formControlDropdownTask");
const formControlDate = document.getElementById("formControlDate");
const formControlTextareaTaskDescription = document.getElementById("formControlTextareaTask");

// Render Database Output here
const dbOutput = document.getElementById("dbOutput");

// Get handle on my tasks and new task button
const myTasksBtn = document.getElementById("myTasks");

// Add Button Event Handlers

allTasks.addEventListener("click", e => {
  console.log(`You Selected ${e.srcElement.id}`);
  displayAllUnacceptedDBRecords();
});

washDishesBtn.addEventListener("click", e => {
  console.log(`You Selected ${e.srcElement.id}`);
  displayFilteredUnacceptedDBRecords(e.srcElement.id);
});

mowLawnBtn.addEventListener("click", e => {
  console.log(`You Selected ${e.srcElement.id}`);
  displayFilteredUnacceptedDBRecords(e.srcElement.id);
});

walkDogBtn.addEventListener("click", e => {
  console.log(`You Selected ${e.srcElement.id}`);
  displayFilteredUnacceptedDBRecords(e.srcElement.id);
});

myTasksBtn.addEventListener("click", e => {
  console.log(`You Clicked the My Tasks Button!`);
  displayFilteredAcceptedDBRecords();
});

submitBtn.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("The Submit Button Was Clicked!");
});

// Init Google Map (Google Maps will call this function automatically via callback defined in script URL)
function initMap() {
  let legend = document.getElementById("legend");

  let options = {
    zoom: 9,
    center: {
      lat: 33.8437699,
      lng: -84.3680624
    },
    disableDefaultUI: true,
    zoomControl: true
  };

  //set up Google Map
  map = new google.maps.Map(document.getElementById("map"), options);

  // Icons for GoogleMaps Legend
  let iconBase = "./images/";
  let icons = {
    washDishes: {
      name: "Wash Dishes",
      icon: iconBase + "washDishes.png"
    },
    mowLawn: {
      name: "Mow Lawn",
      icon: iconBase + "mowLawn.png"
    },
    info: {
      name: "Walk Dog",
      icon: iconBase + "walkDog.png"
    }
  };

  for (let key in icons) {
    let type = icons[key];
    let name = type.name;
    let icon = type.icon;
    let div = document.createElement("div");
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

// Note: acceptedUsername and accepted are fixed values when first adding to DB
submitBtn.addEventListener("click", function(e) {
  e.preventDefault();
  geocode(formControlAddress.value, formControlCity.value).then(response => {
    const db = firebase.firestore();
    db.collection("DigitalCrafts")
      .add({
        username: formControlUsername.value,
        address: formControlAddress.value,
        city: formControlCity.value,
        lat: response.data.results[0].geometry.location.lat,
        lng: response.data.results[0].geometry.location.lng,
        task: formControlTask.value,
        taskDate: formControlDate.value,
        taskDescription: formControlTextareaTaskDescription.value,
        acceptedUsername: "NA",
        accepted: false
      })
      .then(function(docRef) {
        console.log(`Document written with ID: ${docRef.id}`);
        // console.log(`GPS Coordinates`, geocode(formControlAddress.value, formControlCity.value));
      })
      .catch(function(error) {
        console.error(`Error adding document: ${error}`);
      });
  });
});

// Function to derive the Geolocation coordinates from the address, for storage in the database
function geocode(address, city) {
  console.log(address, city);
  let normalizedAddress = address.split(" ").join("+") + "+" + city + "+Georgia";
  console.log(normalizedAddress);
  return axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      address: normalizedAddress,
      key: "AIzaSyDz4JxgFZ28TtTLW6wTzTssSMv5lqARKyQ"
    }
  });
}

function renderFunction(querySnapshot) {
  let renderHTML = `<ul class="list-group">`;
  deleteMarkers();
  querySnapshot.forEach(function(doc) {
    // doc.data() is never undefined for query doc snapshots
    let recordDetails = doc.data();
    renderHTML += `
    <li class="list-group-item" id="${doc.id}"><strong>Document ID</strong>: ${doc.id}</li>
    <li class="list-group-item"><strong>Username</strong>: ${recordDetails.username}</li>
    <li class="list-group-item"><strong>City</strong>: ${recordDetails.city}</li>
    <li class="list-group-item"><strong>Task</strong>: ${recordDetails.task}</li>
    <li class="list-group-item"><strong>Task Date</strong>: ${recordDetails.taskDate}</li>
    <li class="list-group-item"><strong>Task Description</strong>: ${recordDetails.taskDescription}</li>
    <button class="btn btn-primary" id="acceptTask" onClick="acceptTask('${doc.id}')">Accept Task!</button>
    <br>
  `;

    let props = {
      coords: { lat: recordDetails.lat, lng: recordDetails.lng },
      iconImage: "./images/" + recordDetails.task + ".png",
      content: recordDetails.taskDescription,
      dbID: doc.id
    };

    addMarkers(props);
  });
  console.log(renderHTML);
  dbOutput.innerHTML = renderHTML;
}

function addMarkers(props) {
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
    map: map
  });

  marker.setIcon(props.iconImage);
  marker.dbID = props.dbID;

  let infoWindow = new google.maps.InfoWindow({
    content: props.content
  });

  marker.addListener("click", function() {
    infoWindow.open(map, marker);
    document.getElementById(marker.dbID).scrollIntoView({
      behavior: "smooth"
    });
  });

  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function displayAllUnacceptedDBRecords() {
  const db = firebase.firestore();
  let query = db
    .collection("DigitalCrafts")
    .where("accepted", "==", false)
    .get()
    .then(function(querySnapshot) {
      console.log("Display Filtered Records");
      renderFunction(querySnapshot);
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

// Displays based on Task
function displayFilteredUnacceptedDBRecords(filterTask) {
  const db = firebase.firestore();
  let query = db
    .collection("DigitalCrafts")
    .where("task", "==", filterTask)
    .where("accepted", "==", false)
    .get()
    .then(function(querySnapshot) {
      console.log("Display Filtered Records");
      renderFunction(querySnapshot);
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

// Displays based on acceptedUsername
function displayFilteredAcceptedDBRecords(filterTask) {
  const db = firebase.firestore();
  let query = db
    .collection("DigitalCrafts")
    .where("acceptedUsername", "==", placeHolderUsername)
    .get()
    .then(function(querySnapshot) {
      console.log("Display Filtered Records");
      renderFunction(querySnapshot);
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

function updateSpecificRecord(documentID) {
  const db = firebase.firestore();
  let fireStoreCollection = db.collection("DigitalCrafts");
  let documentToUpdate = fireStoreCollection.doc(documentID);
  console.log(`Updating Record ID: ${documentID}`);
  // Update the "accepted" and "acceptedUsername" fields
  return documentToUpdate
    .update({
      accepted: true,
      acceptedUsername: placeHolderUsername
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

function acceptTask(dbID) {
  console.log("You clicked the accept task button!", dbID);
  updateSpecificRecord(dbID);
  displayAllUnacceptedDBRecords();
}

// Once DOM Fully Loaded and Parsed, Run Below
// Note Googlemaps automatically calls the initMap() when it is ready (no need to call it)
// I had to added firebase initilization below, otherwise getting errors
window.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  displayAllUnacceptedDBRecords();
});
