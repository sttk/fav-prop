'use strict';

var listFiles = require('./lib/list-files');
var truncFile = require('./lib/trunc-file');
var concatFile = require('./lib/concat-file');
var marked = require('marked');

var path = require('path');
var libdir = path.resolve(__dirname, '../node_modules/@fav');


var mdheadfile = path.resolve(__dirname, './tmpl/api-header.md');
var mdfootfile = path.resolve(__dirname, './tmpl/api-footer.md');
var mdfile = path.resolve(__dirname, '../docs/index.md');

truncFile(mdfile);

concatFile(mdheadfile, mdfile, converter);
listFiles(libdir).filter(includeDirs).forEach(concatSubPackage);
concatFile(mdfootfile, mdfile);

function converter(data) {
  var version = require('../package.json').version;
  return data.replace(/%%API_VERSION%%/, version);
}

function includeDirs(subpkgdir) {
  return /@fav\/prop\./.test(subpkgdir);
}

function concatSubPackage(subpkgdir) {
  var readmefile = path.join(subpkgdir, 'README.md');
  concatFile(readmefile, mdfile, function(data) {
    var lines = data.split(/\n/);
    var apisection = false;
    return lines.filter(function(line) {
      if (!apisection && line === '## API') {
        apisection = true;
        return false;
      }
      if (apisection && /^##[^#]/.test(line)) {
        apisection = false;
      }
      return apisection;
    }).concat('----').join('\n');
  });
}


var htmlfile = path.resolve(__dirname, '../docs/index.html');
var htmlheadfile = path.resolve(__dirname, './tmpl/api-header.html');
var htmlfootfile = path.resolve(__dirname, './tmpl/api-footer.html');

truncFile(htmlfile);
concatFile(htmlheadfile, htmlfile);
concatFile(mdfile, htmlfile, function(data) {
  return marked(data);
});
concatFile(htmlfootfile, htmlfile);
