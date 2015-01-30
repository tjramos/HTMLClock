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