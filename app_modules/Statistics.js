const path = require('path');
const Datastore = require('nedb');
const {app} = require('electron');
const dbPath = app.getAppPath();

let sttDbPath;
if(global.DEV){
  sttDbPath=path.resolve(dbPath,'./databases/statistics.db');
}else{
  sttDbPath=path.resolve(dbPath,'../databases/statistics.db');
}
const db = {};

db.statistics = new Datastore({
  filename: sttDbPath,
  autoload: true
});

module.exports.add=function (data, callback) {
  db.statistics.insert(data, function (err, newData) {
    callback && callback(err, newData)
  });
}

module.exports.get=function (filters, callback) {
  if(typeof filters==="function"){
    callback=filters
    filters=null;
  }
  if(!filters)
    db.statistics.find({}, function (err, data) {
      callback && callback(data)
    });
}

module.exports.clear=function (callback) {
  db.statistics.remove({}, {multi: true}, function (err, numRemoved) {
    callback && callback(numRemoved)
  });
}