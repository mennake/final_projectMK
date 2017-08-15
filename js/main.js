    // Initialize Firebase

var config = {
    apiKey: "AIzaSyDhgbnhm3x8CvStik5r9rN-2Jqk2Nw3H_I",
    authDomain: "final-project-75da0.firebaseapp.com",
    databaseURL: "https://final-project-75da0.firebaseio.com",
    projectId: "final-project-75da0",
    storageBucket: "final-project-75da0.appspot.com",
    messagingSenderId: "985300721437"
  };
  firebase.initializeApp(config);
  
  var messageAppReference = firebase.database();
    
$(document).ready(function() {

  $(document).on('click','.findAllTheTacos',function(e){
  //function findAllTheTacos() {
    var output = document.getElementById("taco-trucks");

    if (!navigator.geolocation){
      output.innerHTML = "<p>Geolocation not supported</p>";
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;

      output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

      var img = new Image();
      img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

      output.appendChild(img);
    }

    function error() {
      output.innerHTML = "Unable to get your location :-(";
    }

    output.innerHTML = "<div id=\"popUp\" class=\"loader\"><p>Finding you deliciousness…</p></div>";

    navigator.geolocation.getCurrentPosition(success, error);
  //
  });

});

