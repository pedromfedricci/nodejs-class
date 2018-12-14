/*
 * Library for storing and editing data
 *
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
// Base directory of data folder
const dataDir = path.join(__dirname + '/.data/');
// Container for module (to be exported)
let lib = { };
// Lame error handler
const errorHandler = function(err) {
  console.log(err);
}
// Trying out my own promise wrappers
// v8.0.0 has ('util').promisify for that purpose, reliable
// async await is pretty cool too
//==============================================================================
// fs open promise-wrapper
const open = function(path, flag) {
  return new Promise((resolve, reject) => {
    fs.open(path, flag, (err, fd) => {
      (err) ? reject(err) : resolve(fd);
    });
  });
};
// fs write promise-wrapper
const write = function(fdesc, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fdesc, data, err => {
      (err) ? reject(err) : resolve(fdesc);
    });
  });
};
// fs close promise-wrapper
const close = function(fdesc) {
  return new Promise((resolve, reject) => {
    fs.close(fdesc, err => {
      (err) ? reject(err) : resolve();
    });
  });
};
// fs read promise-wrappers
const read = function(path, utf) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, utf, (err, data) => {
      (err) ? reject(err) : resolve(data);
    });
  });
};
// fs unlink promise-wrapper
const unlink = function(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      (err) ? reject(err) : resolve();
    });
  });
};
//==============================================================================
// Write data to a json file
lib.create = function(dirName, fileName, data) {
  return open(dataDir + dirName + '/' + fileName + '.json', 'wx')
  .then(fdesc => {
    write(fdesc, JSON.stringify(data, null, 2))
    .then(fdesc => close(fdesc));
  })
  .catch(errorHandler);
};
// Read data from json fileName
lib.read = function(dirName, fileName) {
 return read(dataDir + dirName + '/' + fileName + '.json', 'utf8')
 .catch(errorHandler);
};
// Update data in the json file
lib.update = function(dirName, fileName, data) {
  return open(dataDir + dirName + '/' + fileName + '.json', 'r+')
  .then(fdesc => {
    write(fdesc, JSON.stringify(data, null, 2))
    .then(fdesc => close(fdesc));
  })
  .catch(errorHandler);
};
// Delete a json file
lib.delete = function(dirName, fileName) {
  return unlink(dataDir + dirName + '/' + fileName + '.json')
  .catch(errorHandler);
};
// List all the items in a directory
lib.list = function(dirName) {
  return new Promise((resolve, reject) => {
    fs.readdir(dataDir + dirName + '/', (err, data) => {
      if (err) return reject(err);
      let items = [];
      data.forEach(fileName => {
        items.push(fileName.replace('.json', ''));
      });
      resolve(items);
    });
  })
  .catch(errorHandler);
};
// test
//lib.create('users', 'test', {'name': 'Joao'}).then(() => console.log('create'));
//lib.update('users', 'test', {'name': 'Joao'}).then(() => console.log('update'));
//lib.read('users', 'test').then(data => console.log(`read:\n${data}`));
//lib.delete('users', 'test').then(() => console.log('delete'));
//lib.list('users').then(items => console.log(items));

module.exports = lib;
