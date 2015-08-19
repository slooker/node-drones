
var HID = require('node-hid');
var keypress = require('keypress');
var temporal = require('temporal');
var RollingSpider = require('rolling-spider');


// apple trackpad
var device = new HID.HID(1452, 627);
console.log(device);

// Connect to drone
// Shawn's
var uuid = 'RS_W168783';
// tyler's 
uuid = 'tyler_drone'
var client = new RollingSpider(uuid);

client.connect(function() {
  console.log("connected");
    client.setup(function() {
      client.calibrate();
      console.log("setup");
      // track pad controls
      device.on("data", function(data) { 
        var click = data.readInt8(1, 0);
        var x = data.readInt8(2, 0);
        var y = data.readInt8(3,0);
//        console.log("X: "+x+", Y: "+y+", click: "+click);

        // No movement.
        if (x === 0 && y === 0) {
          client.hover(); 
        }

        if (x < 0) {
          // trackpad left
          console.log('left');
          client.left(0.5);

        } else if (x > 0) {
          // trackpad right 
          console.log('right');
          client.right(0.5);

        }

        if (y < 0) {
          //trackpad up
          console.log('forward');
          client.forward();
        } else if (y > 0) {
          //trackpad down
          console.log('backward');
          client.backward();

        }
      });

      // keyboard controls
      process.stdin.resume(); 
      process.stdin.setEncoding('utf8'); 
      process.stdin.setRawMode(true); 
      process.stdin.on('data', function(char) { 
          console.log("recieved " + char)

          if (char == '\3') { 
          client.land();
          console.log('\nExiting on Ctrl-C...'); 

          process.exit(); 
          } else if (char === 'p') {
          console.log("Disabling emergency flag");
          client.disableEmergency();
          } else if (char === 'l') {
          console.log("Landing.");
          client.land();
          } else if (char === 't') {
          console.log("Taking off.");
          client.takeoff();
          } else if (char === 'w') {
            console.log("up");
            temporal.delay(500, function() {
              client.up();
            });
            temporal.delay(500, function() {
              client.hover();
            });
          } else if (char === 's') {
            temporal.delay(500, function() {
              client.down();
            });
            temporal.delay(500, function() {
              client.hover();
            });
          } else if (char === 'a') {
            console.log("left flip");
            client.leftFlip();
          } else if (char === 'd') {
            console.log("right flip");
            client.rightFlip();
          } else if (char === 'e') {
            console.log('back flip');
            client.backFlip();
          } else if (char === 'q') {
            console.log('front flip');
            client.frontFlip();
          } else if  (key.which == 'right') {

            console.log('right');
          } else { 
            process.stdout.write(char); 
          } 
      }); 
    });
});

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
