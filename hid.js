var HID = require('node-hid');

 var devices = HID.devices()

// apple trackpad
// var device = new HID.HID(1452, 627);
// logitech usb controller?
var device = new HID.HID(1133, 49686);

device.on("data", function(data) { 
  var leftX = data.readUInt8(0, 0);
  var leftY = data.readUInt8(1,0);
  var rightX = data.readUInt8(2, 0);
  var rightY = data.readUInt8(3,0);
  var buttons = data.readUInt8(4,0);
  var triggers = data.readUInt8(5,0);

console.log("leftX: "+leftX+", leftY: "+leftY);
console.log("rightX: "+rightX+", rightY: "+rightY);
console.log("Buttons: "+buttons);
console.log("Triggers: "+triggers);

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

