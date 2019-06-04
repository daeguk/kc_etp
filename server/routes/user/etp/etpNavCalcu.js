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
/*
* ETP INav 기본 정보
*/
var getiNavData = function (req, res) {
    try {
        console.log('etpNavCalcu=>getiNavData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var f16012 = req.query.f16012;  /* 국제 표준 코드*/
            

        Promise.using(pool.connect(), conn => {

            async.waterfall([    
                function(callback) {
                    var params = {
                        "f16012" : f16012
                    };
                
                    var stmt = mapper.getStatement('etpDetail', 'getEtpBasic', params, {language:'sql', indent: '  '});
                    
                    util.log("getEtpBasic:", stmt);

                    conn.query(stmt, function( err, rows ) {
                        callback(null, rows);                                 
                    })              
                },

                function(etpBasic, callback) {
                    var params = {
                        "f16012" : f16012
                    };
                    var etpItem = etpBasic[0];

                    var query_id = "";
                    // ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN)

                    
                    if (etpItem.f16493 == '1' || etpItem.f16493 == '2') {
                        query_id = "getEtpPdfEtf";
                    } else if (etpItem.f16493 == '3' || etpItem.f16493 == '4') {
                        query_id = "getEtpPdfEtn";
                    }

                    console.log("query_id:" + query_id);
                    var stmt = mapper.getStatement('etpNav', query_id, params, {language:'sql', indent: '  '});
                    
                    console.log("stmt:" + stmt);

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

        util.log("Error while performing Query.", exception);
        res.json({
            success: false,
            message: exception
        });
        res.end();
    }      
};


/*
*   환율 정보
*/

var getExchBasic = function (req, res) {
    try {
        console.log('etpNavCalcu=>getExchange 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        var f16012 = req.query.f16012;  /* 국제 표준 코드*/

        var options = {
            "f16012" : f16012
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getExchBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                util.log("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        util.log("err=>", exception);
    }
};



/*
*   종목별 정보(자산 정보)
*/
var getKspjongBasic = function (req, res) {
    try {
        console.log('etpNavCalcu=>getAssetCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var f16012 = req.query.f16012;  /* 국제 표준 코드*/
        
        var options = {
            "f16012" : f16012
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getKspjongBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                util.log("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        util.log("err=>", exception);
    }
};




/*
*   선물 옵션 정보
*/
var getFutureBasic = function (req, res) {
    try {
        console.log('etpNavCalcu=>getFutureCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var f16012 = req.query.f16012; /* 국제 표준 코드*/
/*
        호출하는 쪽에서 f34239 값을 넘겨주지 않아 주석 처리함.
        var f34239 = req.query.f34239;
*/  
        
        var options = {
            "f16012" : f16012,
/*
            호출하는 쪽에서 f34239 값을 넘겨주지 않아 주석 처리함.
            "f34239" : f34239,
*/
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getFutureBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                util.log("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        util.log("err=>", exception);
    }
};



/*
*   채권정보
*/
var getBondBasic = function (req, res) {
    try {
        console.log('etpNavCalcu=>getBondCurrent 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var f16012 = req.query.f16012;
        
        var options = {
            "f16012" : f16012
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('etpOper', 'getBondBasic', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                util.log("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        util.log("err=>", exception);
    }
};


module.exports.getiNavData = getiNavData;
module.exports.getExchBasic = getExchBasic;
module.exports.getKspjongBasic = getKspjongBasic;
module.exports.getFutureBasic = getFutureBasic;
module.exports.getBondBasic = getBondBasic;

