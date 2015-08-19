var RollingSpider = require("rolling-spider");
var temporal = require("temporal");

var uuid = 'RS_W168783';

// If you are using steps, each step is roughly 50ms
var yourDrone = new RollingSpider(uuid);
// var yourDrone = new RollingSpider();

temporal.clear();

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
        delay: 5000,
        task: function () {
          yourDrone.forward({steps: 50});
        }
      },
      {
        delay: 5000,
        task: function() {
          yourDrone.turnRight({steps: 50});
        }
      },
      //  {
      //   delay: 1000,
      //   task: function () {
      //     yourDrone.forward();
      //   }
      // },
      // {
      //   delay: 3000,
      //   task: function() {
      //     yourDrone.turnRight({steps: 25});
      //   }
      // },
      {
        delay: 5000,
        task: function () {
          yourDrone.land();
        }
      }]);
    temporal.clear();
  });
});
