'use strict';

var listFiles = require('./lib/list-files');
var truncFile = require('./lib/trunc-file');
var concatFile = require('./lib/concat-file');
var path = require('path');

var srcdir = path.resolve(__dirname, '../test/orig');
var outdir = path.resolve(__dirname, '../test');

listFiles(srcdir).forEach(revise);

function revise(fp) {
  if (path.extname(fp) === '.js') {
    var outFp = path.join(outdir, path.basename(fp));
    truncFile(outFp);
    concatFile(fp, outFp, function(data) {
      data = data.replace(/[\r\n]var fav = {};[^\r\n]*/g,
        "\nvar fav = {}; fav.prop = require('..');");
      return data;
    });
  }
}

