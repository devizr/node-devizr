/**
 * NODE-DEVIZR
*/

/* jshint node:true, esnext:true */
/* global devizrconf */

var fs = require('fs');
var path = require('path');
var os = require('os');
var colors = require('colors');

var devizr, config;
var breakpoints = {};
var output = [];
var objectKeys = [];

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

function getKeys(obj) {
  if (obj) {
    for (var key in obj) {
      if (Object.prototype.toString.call(obj) !== '[object Array]') {
        objectKeys.push(key);
      }
      if (typeof obj[key] == "object")
          getKeys(obj[key]);
     }
  }
  return objectKeys;
} 

function createKeyArray(){
  return getKeys(devizr).filter(function(value, index, self) { 
    return self.indexOf(value) === index;
  });
}

function writeContentFile() {
  var comment = '' + 
  '/*!' + os.EOL + 
  ' * Devizr Configuration (' + devizr.name + ' v' + devizr.version + ')' + os.EOL +
  ' * Dynamicaly generated with "node-devizr"' + os.EOL +
  ' * ' + new Date().toLocaleString() + os.EOL +
  '*/' + os.EOL;
 
  var content = comment + 'var ' + config.varname + ' = ' + JSON.stringify(output, null, '  ');

  objectKeys.forEach(function(item){
    content = content.replace(new RegExp('"' + item + '"', 'g'), item);
    if(true){
      content = content.replace(new RegExp('"' + item + '_test"', 'g'), item + '_test');      
    }
  });

  fs.writeFile(config.output, content, function(err) {
    if (err) {
      throw err;
    } else {      
      log("Browser config saved as '" + path.resolve(config.output).magenta);
    }
  });
}

function log(){
  var msg;
  if(config.verbose) {
    if(arguments.length === 2) {
      msg = "No '" + arguments[1] + "' for breakpoint '" + arguments[0] + "' defined!";    
    } else if(arguments.length === 1) {
      msg = arguments[0];    
    } 
    console.log('[' + 'devizr'.yellow + '] ' + msg);
  }
}

module.exports = function(opts){
  
  config = {
    input:   opts && opts.input   || './src',
    output:  opts && opts.output  || './breakpoints.js',
    varname: opts && opts.varname || 'breakpoints',
    verbose: opts && opts.verbose || false
  };
  
  log("Using config " + path.resolve(path.basename(config.input)).magenta);
  
  devizr = require(config.input);
  
  objectKeys = createKeyArray();
    
  devizr.breakpoints.forEach(function(breakpoint) {
  
    var addon, cache, dest, name, lastSlash;
  
    var width = breakpoint.width || 0;
    
    var bp = {
      width: width,
      addons: {}
    };
    
    var addons = breakpoint.addons;
    
    for(name in addons) {
      addon = addons[name];
      cache = {}; 

      breakpoint[name] = {};
        
      if(addon.script) {
        dest = addon.script.dest;
        lastSlash = dest.lastIndexOf('/');
        breakpoint[name].script = {
          src: addon.script.src,
          out: dest.substring(lastSlash + 1),
          dest: dest.substring(0, lastSlash)
        };
        cache.script = dest;
      }        

      if(addon.style) {
        dest = addon.style.dest;
        lastSlash = dest.lastIndexOf('/');
        breakpoint[name].style = {
          src: addon.style.src,
          out: dest.substring(lastSlash + 1),
          dest: dest.substring(0, lastSlash)    
        };
        cache.style = dest;
      }        

      if(addon.tests) {
        breakpoint[name].tests = addon.tests;
        cache.tests = addon.tests;
      }        

      if(addon.complete) {
        breakpoint[name].complete = addon.complete;
        cache.complete = addon.complete;
        objectKeys.push(addon.complete);
      }
          
      if(cache !== {}){
        bp.addons[name] = cache;    
      }      
        
    }
          
    output.push(bp);  
    
    // some cleanup
    delete breakpoint.width;
    delete breakpoint.addons;
    
    breakpoints[width] = breakpoint;  
  
  });

  writeContentFile();

  return breakpoints;

};
