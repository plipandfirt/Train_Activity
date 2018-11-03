// 1.Initialize Firebase
var config = {
  apiKey: "AIzaSyDdwmu16La63gG81Qq2vTNOvsXQBVZvxuI",
  authDomain: "train-activity-d7515.firebaseapp.com",
  databaseURL: "https://train-activity-d7515.firebaseio.com",
  projectId: "train-activity-d7515",
  storageBucket: "train-activity-d7515.appspot.com",
  messagingSenderId: "812613202491"
};

firebase.initializeApp(config);

// var destination="";
// var name="";
// var start="";
// var frequency="";

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val();
  var trainDestination = $("#destination-input").val();
  var firstTime = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: firstTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log('train name:', newTrain.name);
  console.log('destination:', newTrain.destination);
  console.log('start:', newTrain.start);
  console.log('frequency:', newTrain.frequency);

  // alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTime);
  console.log(trainFrequency);

  // Time is 3:30 AM


  // First Time (pushed back 1 year to make sure it comes before current time)
  var timeArr = firstTime.split(':');
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

  var minutesAway, arrival;

  var differenceInTimes = moment().diff(trainTime, "minutes");
  // remainder, which is the difference % frequency
  // reassign minutesAway to trainFrequency minus remainder

  //reassign arrival to moment object, chaining on add(minutesAway) and format(ex: hh:mm)

  console.log('time difference:', differenceInTimes);

  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log('first time converted', firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  var minAway = nextTrain.diff(moment(), "minutes");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrain.format("hh:mm")),
    $("<td>").text(minAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

