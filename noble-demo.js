var noble = require('noble');


// On state change, we check the state of bluetooth.  
noble.on('stateChange', function(state) {
  // If it's powered on, we start scanning
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

// Once we find a peripheral, we grab the advertisemenet data which 
// tells us about the peripheral
noble.on('discover', function(peripheral) {
    console.log("Peripheral found with id "+peripheral.id);
    var advertisement = peripheral.advertisement;

    if (advertisement.localName) {
      console.log('  Local Name        = ' + advertisement.localName);
    }

    if (advertisement.txPowerLevel) {
      console.log('  TX Power Level    = ' + advertisement.txPowerLevel);
    }

    if (advertisement.manufacturerData) {
      console.log('  Manufacturer Data = ' + advertisement.manufacturerData.toString('hex'));
    }
    console.log();
});
