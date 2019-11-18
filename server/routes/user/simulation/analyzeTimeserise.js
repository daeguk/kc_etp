
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


var getAnalyze_timeseries = async function(arr_daily, bench_mark_cd) {

    var analyzeList = [];

    arr_daily.forEach(function(item) {
        let analyzeObj = {};
        if (typeof item.F12506 != 'undefined') {
            analyzeObj.date = util.format('%s-%s-%s', item.F12506.substr(0, 4), item.F12506.substr(4, 2), item.F12506.substr(6, 2));
            analyzeObj.backtest = item.INDEX_RATE;
            analyzeObj.riskfree   = item.F15175;
            if (bench_mark_cd != '0') {
                analyzeObj.benchmark = item.bm_data01;
            }
            analyzeObj.kospi = item.KOSPI_F15001;
            analyzeObj.F15028_S = item.tot_F15028_S;
            analyzeObj.F15028_C = item.tot_F15028_C;
            analyzeList.push(analyzeObj);
        }
    });

    var curDate = new Date().getTime();
    var dir = config.uploadFolder+"/analyze";
    !fs.existsSync(dir) && fs.mkdirSync(dir);

    var fileName = dir+"/timeserise_"+curDate+".json";
    var jsonFileName = "timeserise_"+curDate+".json";
    
    return await new Promise(function(resolve, reject) {

        /* 파일에 write 한다. */
        
        fs.writeFile(fileName, JSON.stringify(analyzeList), 'utf8', function(error) {
            if (error) {
                log.debug( "파일 write 중 오류가 발생되었습니다.", error );
                resolve( { result : false } );
            } else {                
                resolve( { result : true } );
            }
        });

    }).then( async function(e) {

        return  await new Promise( function(resolve1, reject1) {

            /* 파일 write 후 파이선을 호출한다. */
            if( e && e.result ) {
                var options = {
                    mode: 'text',
                    pythonPath: config.python_path,
                    pythonOptions: ['-u'],
                    scriptPath: '',
                    args: [fileName]
                };
                    
                log.debug("[PYTHON] 시작");

                PythonShell.run('./python/analyze_timeseries.py', options, function (err, results) {
                    if (err) {
                        log.debug( "파이선 호출 중 오류가 발생되었습니다.", err );
                        resolve1( { result : false
                            ,   jsonFileName : jsonFileName
                            ,   inputData : JSON.stringify(analyzeList)
                        } );
                    }else{
                        //console.log('results: %j', results);
                        //console.log("####### 4) 파이선 호출 END");
                        //fs.unlinkSync(fileName);
                        resolve1( { 
                                result : true
                            ,   jsonFileName : jsonFileName
                            ,   inputData : JSON.stringify(analyzeList)
                            ,   results : results 
                        });                        
                        log.debug("[PYTHON] 완료");
                    }
                });
                
            }else{
                log.debug( "파일 write 중 오류가 발생되었습니다.", e );
                resolve1( { result : false } );
            }
        });
    });

    

    
}


module.exports.getAnalyze_timeseries = getAnalyze_timeseries;