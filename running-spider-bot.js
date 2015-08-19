var RollingSpider = require("rolling-spider");
var temporal = require("temporal");

// UUID for white drone
// var white_uuid = 'RS_W168783'
// var yourDrone = new RollingSpider(white_uuid);
var yourDrone = new RollingSpider();

yourDrone.connect(function() {
  console.log("Connected!");
  yourDrone.setup(function() {
    console.log("Running queue!");
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
        delay: 5000,
        task: function () {
          yourDrone.frontFlip();
        }
      },
      {
        delay: 5000,
        task: function () {
          yourDrone.land();
        }
      }]);
  });
});
