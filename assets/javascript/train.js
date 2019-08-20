// Steps to complete:

// 1. Initialize Firebase
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the train database.
// 5. Create a way to calculate the time. Using difference between start and current time.
//    Then use moment.js formatting to set difference in frequency.


// 1. Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCew1zgz4wVm-kH4AeWrgoLvIM1hr5JJpY",
  authDomain: "trainscheduler-29b20.firebaseapp.com",
  databaseURL: "https://trainscheduler-29b20.firebaseio.com",
  projectId: "trainscheduler-29b20",
  storageBucket: "trainscheduler-29b20.appspot.com",
  messagingSenderId: "1042075774557",
  appId: "1:1042075774557:web:7d733440a0d08735"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 3. Button for adding Train
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();


  // Grabs user input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#trainTime").val().trim();
  var frequency = $("#frequency").val().trim();

  
  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTimeTime);
  console.log(newTrain.frequency);

  alert("Train has been successfully added");

  // Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#trainTime").val("");
  $("#frequency").val("");
});

// 4. Create Firebase event for adding train to the database and a row in the html when a user adds an entry 
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrainTime;
  var tFrequency = childSnapshot.val().frequency;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }

  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(tName),
    $("<td>").text(tDestination),
    $("<td>").text(tFrequency),
    $("<td>").text(tArrival),
    $("<td>").text(tMinutes),

  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
})
