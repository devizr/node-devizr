var fs = require('fs');
var assert = require('assert');

if(!fs.existsSync("dest")){
	fs.mkdirSync("dest", function(err){
		if(err){ 
			throw err;
		}
	});   
}

function numKeys(obj) {
  return Object.keys(obj).length;
}

var options = {
  input: './test/node-devizr.json',
  output: './dest/breakpoints.js',
  varname: 'breakpoints33'
};

var devizr  = require('../index')(options);

describe('node-devizr tests', function(){
  
  describe('Breakpoint tests', function(){
    
    var breakpoints = devizr;

    it('should return number breakpoints', function(){
      assert.equal(numKeys(breakpoints), 2); 
    });

  });
  
  describe('Addon tests', function(){

    var addon = devizr[767].animation;

    it('should return script src', function(){
      assert.equal(addon.script.src, 'src/js/libs/*.js'); 
    });

    it('should return script out', function(){
      assert.equal(addon.script.out, 'animation.min.js'); 
    });

    it('should return script dest', function(){
      assert.equal(addon.script.dest, 'dest'); 
    });
    
    it('should return tests configuration as string', function(){
      assert.equal(addon.tests.join(' '), 'requestanimationframe !touch'); 
    });
     
    it('should read tests configuration ', function(){
      assert.equal(addon.complete, 'app.initAnimations'); 
    });
          
    describe('Output file tests', function(){
    
      it('should have equal data length', function(done){  
        var stream = fs.ReadStream(options.output);
        stream.on('data', function(data) {
           assert.equal(data.length, 597);
          done();
        });
      });
  
      it('should have correct variable name', function(done){  
        var stream = fs.ReadStream(options.output);
        stream.on('data', function(data) {
           assert.ok(
            new RegExp(options.varname, 'i').test(data)
          );
          done();
        });
      });

    });
  
    
  });

});