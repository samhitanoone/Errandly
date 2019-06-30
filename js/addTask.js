const submitBtn = document.getElementById("submit-button");
const formControlUsername = document.getElementById("formControlUsername");
const formControlCity = document.getElementById("formControlCity");
const formControlTask = document.getElementById("formControlDropdownTask");
const formControlDate = document.getElementById("formControlDate");
const formControlTextareaTaskDescription = document.getElementById("formControlTextareaTask");
const output = document.getElementById("output");

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

submitBtn.addEventListener("click", function(e) {
  e.preventDefault();
  const db = firebase.firestore();
  db.collection("DigitalCrafts")
    .add({
      username: formControlUsername.value,
      city: formControlCity.value,
      task: formControlTask.value,
      taskDate: formControlDate.value,
      taskDescription: formControlTextareaTaskDescription.value,
      acceptedUsername: "NA",
      accepted: false
    })
    .then(function(docRef) {
      console.log(`Document written with ID: ${docRef.id}`);
    })
    .catch(function(error) {
      console.error(`Error adding document: ${error}`);
    });
});

// Example on displaying all records in DB

document.addEventListener("DOMContentLoaded", event => {
  displayAllDBRecords();
  displayFilteredDBRecords("washDishes");
  updateSpecificRecord("X7iIXeEjIQhVF8BYaqwM");
});

// Example on displaying all records in DB from Cloud Firestore
// Section: Get all documents in a collection
// https://firebase.google.com/docs/firestore/query-data/get-data

function displayAllDBRecords() {
  const db = firebase.firestore();
  db.collection("DigitalCrafts")
    .get()
    .then(function(querySnapshot) {
      console.log("Display all Records!");
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });
}

// Example on displaying filtered records from DB from Cloud Firestore
// Section: Get multiple documents from a collection
// https://firebase.google.com/docs/firestore/query-data/get-data

function displayFilteredDBRecords(filterTask) {
  const db = firebase.firestore();
  let query = db
    .collection("DigitalCrafts")
    .where("task", "==", filterTask)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log("Display Filtered Records");
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch(function(error) {
      console.log(`Error getting documents ${error}`);
    });
}

// Example of updating a Firestore Document
// Section: Update a document
// https://firebase.google.com/docs/firestore/manage-data/add-data

function updateSpecificRecord(documentID) {
  const db = firebase.firestore();
  let fireStoreCollection = db.collection("DigitalCrafts");
  let documentToUpdate = fireStoreCollection.doc(documentID);
  console.log(`Updating Record ID: ${documentID}`);
  // Update the "accepted" and "acceptedUsername" fields
  return documentToUpdate
    .update({
      accepted: true,
      acceptedUsername: "bsmith"
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}
