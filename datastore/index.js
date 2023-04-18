const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((error, id) => {
    fs.writeFile(path.join(__dirname, 'data', `${id}.txt`), text, (err) => {
      if (err) {
        console.log('Could not write data to its own file!');
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.readAll = (callback) => {
  todosArray = [];

  fs.readdir('./datastore/data', (err, files) => {
    let c = 0;

    const cb = (error, data, file) => {
      todosArray.push({id: Number(file.slice(0, -4)), text: data});
      if (c === (files.length - 1)) {
        callback(null, todosArray);
      }
      c++;
    };

    files.forEach(file => {
      fs.readFile(path.join(__dirname, 'data', file), 'utf8', (error, data) => {
        if (error) {
          console.log(error);
        } if (data) {
          cb(null, data, file);
        }
      });
    });
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
