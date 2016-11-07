const remote = require('electron').remote;

function electronMinimize() {
  var window = remote.getCurrentWindow();
  window.minimize();  
}

function electronClose() {
  console.log('Closing window');
  var window = remote.getCurrentWindow();
  window.close();  
}