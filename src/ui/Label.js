var blessed = require('blessed');
var _ = require('lodash');

var util = require('../utils');

var {BaseWidget} = require('../editor');
var Slap = require('./Slap');

function Label (opts) {
  var self = this;

  if (!(self instanceof Label)) return new Label(opts);

  opts = _.merge({
    height: 1
  }, Slap.global.options.label, opts);

  BaseWidget.blessed.Text.call(self, opts);
  BaseWidget.call(self, opts);
}

Label.prototype.__proto__ = BaseWidget.blessed.Text.prototype;

module.exports = Label;
