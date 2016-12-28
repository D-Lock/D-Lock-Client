const path = require('path');
const Datastore = require('nedb');
const app = remote.app;

db = {};

db.settings = new Datastore({
  filename: path.join(app.getPath('userData'), 'clientSettings.db'), 
  autoload: true
});

window.db = db;