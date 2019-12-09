
/*
 * 시뮬레이션 분석정보를 파이선을 통해 조회 한다. 
 *
 * @date 2019-09-02
 * @author daeguk
 */


var config = require('../../../config/config');
var util = require('util');
var log = require('../../../util/logg');
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

    var fileName = "timeserise_"+curDate+".json";
    
    return await new Promise(function(resolve, reject) {

        /* 파일에 write 한다. */
        
        fs.writeFile(dir+"/"+fileName, JSON.stringify(analyzeList), 'utf8', function(error) {
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
                    args: [dir+"/"+fileName]
                };
                    
                log.debug("[PYTHON] 시작");

                PythonShell.run('./python/analyze_timeseries.py', options, function (err, results) {
                    if (err) {
                        log.debug( "파이선 호출 중 오류가 발생되었습니다.", err );
                        resolve1( { result : false
                            ,   jsonFileName : fileName
                            ,   inputData : JSON.stringify(analyzeList)
                        } );
                    }else{                                     
                        resolve1( { 
                                result : true
                            ,   jsonFileName : fileName
                            ,   inputData : JSON.stringify(analyzeList)
                            ,   results : results 
                        });                        
                        log.debug("[PYTHON] 완료");
                    }
                    fs.unlinkSync(dir+"/"+fileName);
                });
                
            }else{
                log.debug( "파일 write 중 오류가 발생되었습니다.", e );
                resolve1( { result : false } );
            }
        });
    });
}

/*
 * arr_daily (일자별 지수) 를 파일 생성한다.
 * 2019-05-20  bkLove(촤병국)
 */
var writeFileArrDaily   =   async function(arr_daily, bench_mark_cd) {

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

                resolve( { 
                        result : false
                    ,   jsonFileName : jsonFileName
                    ,   inputData : JSON.stringify(analyzeList)
                });
            } else {                
                resolve( { 
                        result : true 
                    ,   jsonFileName : jsonFileName
                    ,   inputData : ""
                });
            }
        });
    })
}

/*
 * 파이선 호출을 통해 분석정보를 조회한다.
 * 2019-05-20  bkLove(촤병국)
 */
var getAnalyzeByPython   =   async function( paramData ) {

    return  await new Promise( function(resolve, reject) {

        var dir = config.uploadFolder+"/analyze";

        if( typeof paramData.jsonFileName == "undefined" || paramData.jsonFileName == "" ) {        
            resolve( { 
                    result : false
                ,   msg : "파일정보가 존재하지 않습니다."
                ,   err : ""
                ,   jsonData : []
            });
        }        

        var options = {
            mode: 'text',
            pythonPath: config.python_path,
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [ dir + "/" + paramData.jsonFileName ]
        };
            
        log.debug("[PYTHON] 시작");

        PythonShell.run('./python/analyze_timeseries.py', options, function (err, results) {
            if (err) {
                log.debug( "파이선 호출 중 오류가 발생되었습니다.", err );
                resolve( { 
                        result : false
                    ,   results : []
                } );

                log.debug("[PYTHON] error 완료");
            }else{
                //console.log('results: %j', results);
                //console.log("####### 4) 파이선 호출 END");
                //fs.unlinkSync(fileName);
                resolve( { 
                        result : true
                    ,   results : results 
                });    
                    
                log.debug("[PYTHON] success 완료");
            }
        });

    });

}


module.exports.getAnalyze_timeseries = getAnalyze_timeseries;
module.exports.writeFileArrDaily = writeFileArrDaily;
module.exports.getAnalyzeByPython = getAnalyzeByPython;
