
/*
 * 시뮬레이션 분석정보를 파이선을 통해 조회 한다. 
 *
 * @date 2019-09-02
 * @author daeguk
 */


var config = require('../../../config/config');
var util = require('../../../util/util');
var log = config.logger;

// PYTHON SAMPLE
var {PythonShell} = require('python-shell')

var options = {
  mode: 'text',
  pythonPath: config.python_path,
  pythonOptions: ['-u'],
  scriptPath: '',
  args: ['value1', 'value2', 'value3']
};


var getAnalyze_timeseries = function(req, res) {
    PythonShell.run('./python/analyze_timeseries.py', options, function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);
    });
}


module.exports.getAnalyze_timeseries = getAnalyze_timeseries;