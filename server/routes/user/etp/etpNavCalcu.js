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

        var f16012 = req.query.f16012;
            

        Promise.using(pool.connect(), conn => {

            async.waterfall([    
                function(callback) {
                    var params = {
                        basicData : {
                            "f16012" : f16012
                        }
                    };
                
                    var stmt = mapper.getStatement('etpDetail', 'getEtpBasic', params, {language:'sql', indent: '  '});
                    
                    util.log("getEtpBasic:", stmt);

                    conn.query(stmt, function( err, rows ) {
                        callback(null, rows);                                 
                    })              
                },

                function(etpBasic, callback) {
                    var params = {
                        basicData : {
                            "f16012" : f16012
                        }
                    };
                    var etpItem = etpBasic[0];

                    var query_id = "";
                    // ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN)

                    
                    if (etpItem.f16493 == '1' || etpItem.f16493 == '2') {
                        query_id = "getEtpOperPdfEtf";
                    } else if (etpItem.f16493 == '3' || etpItem.f16493 == '4') {
                        query_id = "getEtpOperPdfEtn";
                    }
                    var stmt = mapper.getStatement('etpOper', query_id, params, {language:'sql', indent: '  '});
                    
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

var getExchange = function (req, res) {
    try {
        console.log('indexSummary=>getExchange 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexAnalysisInfo', options, {language:'sql', indent: '  '});
        
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
*   환율 정보
*/

var getExchange = function (req, res) {
    try {
        console.log('indexSummary=>getExchange 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexAnalysisInfo', options, {language:'sql', indent: '  '});
        
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