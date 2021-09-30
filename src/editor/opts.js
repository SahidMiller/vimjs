var path = require("path");
var rc = require("rc/index.js");
var util = require("../utils");

//var package = require("../package");
//var configFile = path.resolve(__dirname, "..", package.name + ".ini");
//module.exports = util.parseOpts(rc(package.name, configFile));

var configFile = path.resolve(__dirname, "../default-config.ini");
var pkgConfigName = "editor-widget";
module.exports = util.parseOpts(rc(pkgConfigName, configFile));
