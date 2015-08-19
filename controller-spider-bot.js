var HID = require('node-hid');
var RollingSpider = require('rolling-spider');

 // var devices = HID.devices()

// apple trackpad
// var device = new HID.HID(1452, 627);
// logitech usb controller?
var device = new HID.HID(1133, 49686);

var flying = false;

var uuid = 'RS_W168783';
var yourDrone = new RollingSpider(uuid);

yourDrone.connect(function() {
  console.log("Connected");
  yourDrone.setup(function() {
    console.log("In Setup");

    yourDrone.flatTrim();
    yourDrone.startPing();

    device.on("data", function(data) { 
      var leftX = data.readUInt8(0, 0);
      var leftY = data.readUInt8(1,0);
      var rightX = data.readUInt8(2, 0);
      var rightY = data.readUInt8(3,0);
      var buttons = data.readUInt8(4,0);
      var triggers = data.readUInt8(5,0);

      // console.log("leftX: "+leftX+", leftY: "+leftY);
      // console.log("rightX: "+rightX+", rightY: "+rightY);
      // console.log("Buttons: "+buttons);
      // console.log("Triggers: "+triggers);

      if (triggers === 16) {
        yourDrone.emergency();
      }

      // Not flying and start was pushed
      if (triggers === 32 && flying === false) {
        yourDrone.takeOff();
        flying = true;

      } else if (triggers === 32 && flying === true) {
        yourDrone.land();
        flying = false;
      }

      
      if (flying) {
        if (leftY < 100) {
          // left stick up
          console.log('up');
          yourDrone.forward();
        } else if (leftY > 150) {
        // left stick down
        console.log('down');
          yourDrone.backward();
        } else if (shouldHover(leftX, leftY)) {
          console.log('hover');
          yourDrone.hover();
        }

        if (leftX < 100) {
          // left stick left
          console.log('left');
          yourDrone.left();
        } else if (leftX > 150) {
          // left stick right
          console.log('right');
          yourDrone.right();
        }

        if (triggers === 4) {
          console.log("going up!");
          yourDrone.up();
        } else if (triggers === 8) {
          console.log("going down!");
          yourDrone.down();
        } else if (shouldHover(leftX, leftY)) {
          yourDrone.hover();
        }

        if (buttons === 24) {
          yourDrone.leftFlip();
        } else if (buttons === 136) {
          yourDrone.frontFlip();
        }
      }
    });
  });
});
  function shouldHover(x, y) {
    if (x < 135 && x > 110 && y < 135 && y > 110) {
      return true;
    }
    return false;

  }



  // do app specific cleaning before exiting
  process.on('exit', function () {
    console.log("Exit");
    device.close();
    process.emit('cleanup');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    console.log('Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });

