var userid = "";

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
      document.getElementById('signinButton').setAttribute('style', 'display: none');
      gapi.client.load('plus', 'v1', loaded);
      getAllAlarms(authResult);
      } else {
        console.log('Sign-in state: ' + authResult['error']);
        userid = "";
      }
}

function getTime() {
   var d = new Date();
   document.getElementById("clock").innerHTML = d.toLocaleTimeString();
   setTimeout(getTime, 1000);
}

function getTemp() {
   $.getJSON("https://api.forecast.io/forecast/0f883d4fdb43b0ffeddc78b8594f743c/35.300399,-120.662362?callback=?",
               function(data) {
      $("#forecastLabel").html(data.daily.summary);
      
      $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
      
      var className;
      var maxTemp = data.daily.data[0].temperatureMax;
      
      if(maxTemp < 60)
         className = "cold";
      else if(maxTemp >= 60 && maxTemp < 70)
         className = "chilly";
      else if(maxTemp >= 70 && maxTemp < 80)
         className = "nice";
      else if(maxTemp >= 80 && maxTemp < 90)
         className = "warm";
      else if(maxTemp >= 90)
         className = "hot";
      
      $("body").addClass(className);
   });
}

function showAlarmPopup() {
   $("#mask").removeClass("hide"); 
   $("#popup").removeClass("hide"); 
}

function hideAlarmPopup() {
   $("#mask").addClass("hide"); 
   $("#popup").addClass("hide"); 
}

function insertAlarm(time, alarmName) {
   var div = $("<div>").addClass("flexable");
   div.append($("<div>").addClass("name").html(alarmName + " "));
   div.append($("<div>").addClass("time").html(time + " "));
   div.append($('<input type="button" onClick="deleteAlarm(\'' + alarmName + '\')" value="Delete">'));
   div.attr("id", alarmName);
   $("#alarms").append(div);
}

function addAlarm() {
   var hours, mins, ampm, alarmName, time;
   hours = $("#hours option:selected").text();
   mins = $("#mins option:selected").text();
   ampm = $("#ampm option:selected").text();
   time = hours + ":" + mins + " " + ampm;
   alarmName = $("#alarmName").val();
   
   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();

   alarmObject.save({"time": time, "alarmName": alarmName, "userid": userid}, {
      success: function(object) {
      	insertAlarm(time, alarmName);
         hideAlarmPopup();
		}
   });
}

function getAllAlarms(userid) {
   Parse.initialize("yJIWV3DZFeQImNmtdoCnc5N9kOEMoJS2Va1uTPe1", "2UUu4iYATzGXDarp65nVSqKeHxKcmKYrsaiRClR5");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) { 
            if (userid == results[i]["attributes"]["userid"])
               insertAlarm(results[i].get("time"), results[i].get("alarmName"));
         }
      }
   });
}

function deleteAlarm(alarmName) {
   $('#' + alarmName).remove();
   var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for(var i = 0; i < results.length; i++) {
            if(results[i].attributes.alarmName === alarmName) {
               results[i].destroy({});
               break;
            }
         }
      }
   });
}