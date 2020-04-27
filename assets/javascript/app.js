/*initialize firebase: new project creds,
set initial values for trian name, destination, time of first train,
*/

var config = {
    apiKey: "AIzaSyD0jYszxpS5weVLLYzd5tepDiOPI2o0xdM",
    authDomain: "trainscheduler2-86a55.firebaseapp.com",
    databaseURL: "https://trainscheduler2-86a55.firebaseio.com",
    projectId: "trainscheduler2-86a55",
    storageBucket: "trainscheduler2-86a55.appspot.com",
  };
  firebase.initializeApp(config);

    var database = firebase.database();

    // Starting values
    /*var trainName = "";
    var destination = "";
    var firstTime = "";
    var frequency = "";
    */

    //train submit button
    $('#addtrain').on("click", function(event){
        event.preventDefault();
        //in coding the values from the submitted input fields
        trainName = $('#trainNameinput').val().trim();
        console.log(trainName);
        destination = $('#destinationInput').val().trim();
        firstTime = $('#firstTimeinput').val().trim();
        frequency = $('#frequencyInput').val().trim();
        //Pushing that data into my firebase database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });
        // clearing the input fields.
        $('#trainNameinput').val("")
        $('#destinationInput').val("")
        $('#firstTimeinput').val("")
        $('#frequencyInput').val("")

    });

    //initial loader from Firebase
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        //retreiving train data from firebase
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        firstTime = childSnapshot.val().firstTime;
        frequency = childSnapshot.val().frequency;

        //convert submitted time to HH:mm using moment.js
        var firstTimeMoment = moment(firstTime, "HH:mm")

        //current time variable
        var currentTime = moment();

        //Setting up variables to calculate arrival times
        var minToarrival = currentTime.diff(firstTimeMoment, 'minutes');
        var timeAway = minToarrival % frequency;
        var trainAway = frequency - timeAway;

        var nextTrain = currentTime.add(trainAway, 'minutes');
        var arrivaltime = nextTrain.format("HH:mm");

        $("#toSchedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrivaltime + "</td><td>" + trainAway + "</td>");
    }); 

