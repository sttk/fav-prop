'use strict';

var listFiles = require('./lib/list-files');
var truncFile = require('./lib/trunc-file');
var concatFile = require('./lib/concat-file');
var path = require('path');
var fs = require('fs');

var srcdir = path.resolve(__dirname, '../test/orig');
var outdir = path.resolve(__dirname, '../test');
var prjdir = path.resolve(__dirname, '..');


listFiles(outdir, '.test.js').forEach(function(file) {
  fs.unlinkSync(file);
});
fs.mkdirSync(srcdir);


listFiles(path.resolve(__dirname, '../..')).forEach(function(dir) {
  if (dir === prjdir) {
    return;
  }
  listFiles(path.join(dir, 'test'), '.test.js').forEach(function(testfile) {
    var basename = path.basename(testfile);
    fs.copyFileSync(testfile, path.resolve(srcdir, basename));
  });
});


listFiles(srcdir).forEach(function replace(fp) {
  if (path.extname(fp) === '.js') {
    var outFp = path.join(outdir, path.basename(fp));
    truncFile(outFp);
    concatFile(fp, outFp, function(data) {
      data = data.replace(/[\r\n]var fav = {};[^\r\n]*/g,
        "\nvar fav = {}; fav.prop = require('..');");
      data = data.replace(/[\r\n][^\r\n]*require\('@fav\/prop[^\r\n]*/g, '\n');
      return data;
    });
  }
});


listFiles(srcdir, '.test.js').forEach(function(file) {
  fs.unlinkSync(file);
});
fs.rmdirSync(srcdir);
