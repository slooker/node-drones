var RollingSpider = require("rolling-spider");
var temporal = require("temporal");

var uuid = 'RS_W168783';
// tyler's 
var yourDrone = new RollingSpider(uuid);

yourDrone.connect(function() {
  console.log("Connected");
  yourDrone.setup(function() {
    console.log("In Setup");
    // NEW CODE
    temporal.queue([
      {
        delay: 0,
        task: function () {
          yourDrone.flatTrim();
          yourDrone.startPing();
          yourDrone.takeOff();
        }
      },
      {
        delay: 3000,
        task: function () {
          yourDrone.forward();
        }
      },
      {
        delay: 500,
        task: function () {
          yourDrone.land();
        }
      }]);
  });
});
