/*
 * 설정
 */
var config = require('../config/config');

module.exports = {
  error: function(msg) {
    console.log('[' + new Date().toString() + ']');
    console.log(msg);
  },
  error1: function(msg) {
    console.log(msg);
  },
  info: function(msg) {
    if(config.log_level == 'DEBUG' || config.log_level == 'INFO') {
      console.log('[' + new Date().toString() + ']');
      console.log(msg);
    }
  },
  info1: function(msg) {
    if(config.log_level == 'DEBUG' || config.log_level == 'INFO') {
      console.log(msg);
    }
  },
  debug: function(msg) {
    if(config.log_level == 'DEBUG') {
      console.log('[' + new Date().toString() + ']');
      console.log(msg);
    }
  },
  // LOG TIME NOT DISPLAY
  debug1: function(msg) {
    if(config.log_level == 'DEBUG') {
      console.log(msg);
    }
  },
}