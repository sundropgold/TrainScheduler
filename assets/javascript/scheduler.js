$(document).ready(function(){

// 10:30 -> 12:00 -> 12:30
// 10:00 -> 12:00 -> 12:10

// 11:00 -> 12:00 -> 12:15
// 14:00 -> 14:00 -> 14:00
// 14:00 -> 14:00 -> 14:00

	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEReUQvmbKGNlfMJIuuxPWNTpbCSSjvoQ",
    authDomain: "train-scheduler-2fa1f.firebaseapp.com",
    databaseURL: "https://train-scheduler-2fa1f.firebaseio.com",
    projectId: "train-scheduler-2fa1f",
    storageBucket: "train-scheduler-2fa1f.appspot.com",
    messagingSenderId: "531965706098"
  };

  firebase.initializeApp(config);

	var database = firebase.database();

	// capture button click
	$('#addTrainBTN').on('click', function(){

		// don't refrest the page
		event.preventDefault();

		// provide initial data to firebase database
		var train = $('#trainName').val().trim();
		var destination = $('#trainDestination').val().trim();
		
		var time = $('#trainTime').val().trim();
		console.log("time: " + time);
	
		var frequency = $('#trainFrequency').val().trim();

		database.ref().push({
			train: train,
			destination: destination,
			frequency: frequency,
			time: time
		});

		// clear text boxes
		$('#trainName').val("");
		$('#trainDestination').val("");
		$('#trainTime').val("");
		$('#trainFrequency').val("");

		// determine when the next train arrives
		return false;

	});

	// firebase watcher & initial loader & table row adder
	database.ref().on("child_added", function(childSnapshot) {

		//log everything coming from snapshot
		console.log(childSnapshot.val());
		console.log(childSnapshot.val().train);
		console.log(childSnapshot.val().destination);
		console.log(childSnapshot.val().frequency);
		console.log(childSnapshot.val().time);

		// save in variables
		var trainName = childSnapshot.val().train;
		var trainDestination = childSnapshot.val().destination;	
		var trainFreq = childSnapshot.val().frequency;
		console.log("trainFreq: " + trainFreq);


		var nextTrain = moment((childSnapshot.val().time), "HH:mm");
		console.log("next train: " + nextTrain);

		// calculate the minutes until the next train
		var timeDiff = moment().diff(nextTrain, "minutes");
		console.log("timeDiff: " + timeDiff);

		var timeModulus = timeDiff % trainFreq;
		console.log("timeModulus: " + timeModulus);

		if (timeDiff < 0) {
			// future time

			var nextTrainArrival = moment(nextTrain).format("h:mm A");
			console.log("nextTrainArrival: " + nextTrainArrival);

			var minutesLeft = moment(nextTrain).diff(moment(), "minutes");
			console.log("minutesLeft (future): " + minutesLeft);
		}

		else {
			var minutesLeft = trainFreq - timeModulus;
			console.log("minutesLeft: " + minutesLeft);			

			var nextTrainArrival = moment().add(minutesLeft, "minutes").format("h:mm A");
			console.log("nextTrainArrival: " + nextTrainArrival);

		}


		addRow(trainName, trainDestination, trainFreq, nextTrainArrival, minutesLeft);

	});

	function addRow(name, destination, freq, arrival, minutes){

		$('#addRowsHere').append("<tr>" +
			"<td>" + name + "</td>" +
			"<td>" + destination + "</td>" +
			"<td>" + freq + "</td>" +
			"<td>" + arrival + "</td>" +
			"<td>" + minutes + "</td>");

	}

});