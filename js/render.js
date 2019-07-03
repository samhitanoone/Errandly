const dbOutput = document.getElementById("db-output");

var firebaseConfig = {
  apiKey: "AIzaSyCTwkgXKLeiPztENJqsqE0dosOZMx74DkE",
  authDomain: "samhitanoone-dc-pjt1-errandly.firebaseapp.com",
  databaseURL: "https://samhitanoone-dc-pjt1-errandly.firebaseio.com",
  projectId: "samhitanoone-dc-pjt1-errandly",
  storageBucket: "samhitanoone-dc-pjt1-errandly.appspot.com",
  messagingSenderId: "496530300183",
  appId: "1:496530300183:web:4cc570d2bdfd9293"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Example on displaying all records in DB from Cloud Firestore
// Section: Get all documents in a collection
// https://firebase.google.com/docs/firestore/query-data/get-data

function renderFunction(querySnapshot) {
  let renderHTML = `<ul class="list-group">`;
  querySnapshot.forEach(function(doc) {
    // doc.data() is never undefined for query doc snapshots
    let recordDetails = doc.data();
    renderHTML += `
    <li class="list-group-item"><strong>Document ID:</strong>: ${doc.id}</li>
    <li class="list-group-item"><strong>Username:</strong>: ${recordDetails.username}</li>
    <li class="list-group-item"><strong>Address:</strong>: ${recordDetails.address}</li>
    <li class="list-group-item"><strong>Latitude:</strong>: ${recordDetails.lat}</li>
    <li class="list-group-item"><strong>Longitude:</strong>: ${recordDetails.lng}</li>
    <li class="list-group-item"><strong>City:</strong>: ${recordDetails.city}</li>
    <li class="list-group-item"><strong>Task:</strong>: ${recordDetails.task}</li>
    <li class="list-group-item"><strong>Task Date:</strong>: ${recordDetails.taskDate}</li>
    <li class="list-group-item"><strong>Task Description:</strong>: ${recordDetails.taskDescription}</li>
    <br>
  `;
  });
  dbOutput.innerHTML = renderHTML;
}

function displayAllDBRecords() {
  const db = firebase.firestore();
  db.collection("DigitalCrafts")
    .get()
    .then(function(querySnapshot) {
      console.log("Displaying all Records!");
      renderFunction(querySnapshot);
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

function displayFilteredDBRecords(filterTask) {
  const db = firebase.firestore();
  let query = db
    .collection("DigitalCrafts")
    .where("task", "==", filterTask)
    .get()
    .then(function(querySnapshot) {
      console.log("Display Filtered Records");
      renderFunction(querySnapshot);
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

displayAllDBRecords();

let formControlDropdownTask = document.getElementById("formControlDropdownTask");
let submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", event => {
  event.preventDefault();
  displayFilteredDBRecords(formControlDropdownTask.value);
  console.log(formControlDropdownTask.value);
});
