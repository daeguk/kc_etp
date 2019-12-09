/*
 * 설정
 */
var config = require('../config/config');

module.exports = {
  error: function(msg) {
    console.log('[' + new Date().toString() + ']');
    console.log(msg);
  },
  info: function(msg) {
    if(config.log_level == 'DEBUG' || config.log_level == 'INFO') {
      console.log('[' + new Date().toString() + ']');
      console.log(msg);
    }
  },
  debug: function(msg) {
    if(config.log_level == 'DEBUG') {
      console.log('[' + new Date().toString() + ']');
      console.log(msg);
    }
  },
}