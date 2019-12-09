/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-05-14
 * @author pjk
 */

var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");
var async = require('async'); 
var util = require("util");

/* logging 추가함.  2019-06-10 */
var log = require('../../../util/logg');


/*
* ETP INav 기본 정보
*/
var getiNavData = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getiNavData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var F16012 = req.query.F16012;  /* 국제 표준 코드*/
            

        Promise.using(pool.connect(), conn => {

            async.waterfall([    
                function(callback) {
                    var params = {
                        "F16012" : F16012
                    };
                
                    var stmt = mapper.getStatement('etpDetail', 'getEtpBasic', params, {language:'sql', indent: '  '});
                    
                    log.debug("getEtpBasic:", stmt);

                    conn.query(stmt, function( err, rows ) {
                        callback(null, rows);                                 
                    })              
                },

                function(etpBasic, callback) {
                    var params = {
                        "F16012" : F16012
                    };
                    var etpItem = etpBasic[0];

                    var query_id = "";
                    // ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN)

                    
                    if (etpItem.F16493 == '1' || etpItem.F16493 == '2') {
                        query_id = "getEtpPdfEtf";
                    } else if (etpItem.F16493 == '3' || etpItem.F16493 == '4') {
                        query_id = "getEtpPdfEtn";
                    }

                    log.debug("query_id:" + query_id);
                    var stmt = mapper.getStatement('etpNav', query_id, params, {language:'sql', indent: '  '});
                    
                    log.debug("stmt:" + stmt);

                    conn.query(stmt, function( err, rows ) {
                        callback(null, etpItem, rows);                                 
                    });    
                }
            ], 
            function (err, etpBasic, pdfList) {
                    // result now equals 'done'
            
                    res.json({
                        success: true,
                        etpBasic: etpBasic,
                        pdfList: pdfList
                    });
                    res.end();
                }  
            );          
        });
    } catch (exception) {

        log.debug("Error while performing Query.", exception);
        res.json({
            success: false,
            message: exception
        });
        res.end();
    }      
};


/*
*   ETP INav 지수 수익률 기본 정보
*/

var getiNavIndexData = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getiNavIndexData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        var F16012 = req.query.F16012;  /* 국제 표준 코드*/

        var options = {
            "F16012" : F16012
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpDetail', 'getEtpBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        log.debug(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    etpBasic: rows[0]
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};


/*
*   환율 정보
*/

var getExchBasic = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getExchange 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        var F16012 = req.query.F16012;  /* 국제 표준 코드*/

        var options = {
            "F16012" : F16012
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getExchBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        log.debug(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};



/*
*   종목별 정보(자산 정보)
*/
var getKspjongBasic = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getAssetCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var F16012 = req.query.F16012;  /* 국제 표준 코드*/
        
        var options = {
            "F16012" : F16012
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getKspjongBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        log.debug(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};




/*
*   선물 옵션 정보
*/
var getFutureBasic = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getFutureCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var F16012 = req.query.F16012; /* 국제 표준 코드*/
/*
        호출하는 쪽에서 F34239 값을 넘겨주지 않아 주석 처리함.
        var F34239 = req.query.F34239;
*/  
        
        var options = {
            "F16012" : F16012,
/*
            호출하는 쪽에서 F34239 값을 넘겨주지 않아 주석 처리함.
            "F34239" : F34239,
*/
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getFutureBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        log.debug(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};



/*
*   채권정보
*/
var getBondBasic = function (req, res) {
    try {
        log.debug('etpNavCalcu=>getBondCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var F16012 = req.query.F16012;
        
        var options = {
            "F16012" : F16012
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getBondBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        log.debug(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};


module.exports.getiNavData = getiNavData;
module.exports.getiNavIndexData = getiNavIndexData;
module.exports.getExchBasic = getExchBasic;
module.exports.getKspjongBasic = getKspjongBasic;
module.exports.getFutureBasic = getFutureBasic;
module.exports.getBondBasic = getBondBasic;

