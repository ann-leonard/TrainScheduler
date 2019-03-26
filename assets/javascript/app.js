var config = {
    apiKey: "AIzaSyCSYTlEuq82fvvcmLxH8qF1UdctoMY48JA",
    authDomain: "trainscheduler-bedaf.firebaseapp.com",
    databaseURL: "https://trainscheduler-bedaf.firebaseio.com",
    projectId: "trainscheduler-bedaf",
    storageBucket: "",
    messagingSenderId: "165751685212"
  };
  
firebase.initializeApp(config);
var arrivalTime;
var frequency="";

var database = firebase.database();
$(document).ready(function(){
    $(".btn").on("click", function (){
        var train = $(".trainInput").val().trim();
        var destination = $(".destinationInput").val().trim();
        arrivalTime = $(".arrivalInput").val().trim();
        frequency = $(".frequencyInput").val().trim();
    
        database.ref().push({
            train,
            destination,
            arrivalTime,
            frequency
        })
    })
    database.ref().on("child_added", function(snapshot){
        var snapVal = snapshot.val()
        var minAway;
        // Change year so first train comes before now
        var arrivalTimeFixed = moment(snapVal.arrivalTime, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(arrivalTimeFixed), "minutes");
        var remainder = diffTime % snapVal.frequency;
        // Minutes until next train
        var minAway = snapVal.frequency - remainder;

        var addedRow= $("<tr>")
            $(addedRow).append(`<td>${snapVal.train}`)
            $(addedRow).append(`<td>${snapVal.destination}`)
            $(addedRow).append(`<td>${snapVal.arrivalTime}`)
            $(addedRow).append(`<td>every ${snapVal.frequency} minutes`)
            $(addedRow).append(`<td>${minAway}`)
            $("tbody").append(addedRow)
    })
})
