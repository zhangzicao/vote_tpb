const path = require('path');
const Datastore = require('nedb');

const dbPath=path.join(__dirname,'../databases/statistics.db');
const db = {};

db.statistics = new Datastore({
  filename: dbPath,
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