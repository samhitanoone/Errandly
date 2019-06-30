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

document.addEventListener("DOMContentLoaded", event => {
  const db = firebase.firestore();
  db.collection("DigitalCrafts")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });
});
