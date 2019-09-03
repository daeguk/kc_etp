
/*
 * 시뮬레이션 분석정보를 파이선을 통해 조회 한다. 
 *
 * @date 2019-09-02
 * @author daeguk
 */


var config = require('../../../config/config');
var util = require('util');
var log = config.logger;
var fs = require('fs');

// PYTHON SAMPLE
var {PythonShell} = require('python-shell')


var getAnalyze_timeseries = function(arr_daily) {

    var analyzeList = [];

    arr_daily.forEach(function(item) {
        let analyzeObj = {};
        analyzeObj.date = util.format('%s-%s-%s', item.F12506.substr(0, 4), item.F12506.substr(4, 2), item.F12506.substr(6, 2));
        analyzeObj.backtest = item.INDEX_RATE;
        analyzeObj.riskfree   = item.F15175;
        analyzeObj.benchmark = item.bm_data01;
        analyzeObj.kospi = item.KOSPI_F15001;
        analyzeList.push(analyzeObj);
    });

    var curDate = new Date().getTime();
    var dir = config.uploadFolder+"/analyze";
    !fs.existsSync(dir) && fs.mkdirSync(dir);

    var fileName = dir+"/timeserise_"+curDate+".json";
    
    fs.writeFile(fileName, JSON.stringify(analyzeList), 'utf8', function(error) {
        if (error) {
            console.log(error)
        } else {
          var options = {
            mode: 'text',
            pythonPath: config.python_path,
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [fileName]
          };
              
          PythonShell.run('./python/analyze_timeseries.py', options, function (err, results) {
              if (err) throw err;
              console.log('results: %j', results);        
              return results;
          });
        }
    });

    

    
}


module.exports.getAnalyze_timeseries = getAnalyze_timeseries;