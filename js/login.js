window.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
  
    var firebaseConfig = {
      apiKey: "AIzaSyCTwkgXKLeiPztENJqsqE0dosOZMx74DkE",
      authDomain: "samhitanoone-dc-pjt1-errandly.firebaseapp.com",
      databaseURL: "https://samhitanoone-dc-pjt1-errandly.firebaseio.com",
      projectId: "samhitanoone-dc-pjt1-errandly",
      storageBucket: "samhitanoone-dc-pjt1-errandly.appspot.com",
      messagingSenderId: "496530300183",
      appId: "1:496530300183:web:4cc570d2bdfd9293"
    };

    firebase.initializeApp(firebaseConfig);

   
      // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());

        var uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
              },
              uiShown: function() {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
              }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: 'dashboard.html',
            signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID            ],
            // Terms of service url.
            tosUrl: '<your-tos-url>',
            // Privacy policy url.
            privacyPolicyUrl: '<your-privacy-policy-url>'
          };

          // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);
    // // this log-in function redirects you to login via Google if you're not logged in, else it calls the app function
    //   function login() {
    //     function newLoginHappened(user) {
    //       if (user) {
    //         //user is signed in
    //         app(user);
    //       } else {
    //         var provider = new firebase.auth.GoogleAuthProvider();
    //         firebase.auth().signInWithRedirect(provider);
    //       }
    //     };
  
    //     firebase.auth().onAuthStateChanged(newLoginHappened);
  
    //     //if you're logged in, this app function is called. It displays your google display name
    //     function app(user) {
    //       document.getElementById("clientName").innerHTML = user.displayName;
    //     };
  
    //   };
  
    //   window.onload = login;
  });


  