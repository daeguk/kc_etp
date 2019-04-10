/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var util = require("util");
var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs'); 


var getIndexSummaryInfo = function (req, res) {
    try {
        console.log('indexSummary=>getInfoOpenReqList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var stmt1 = mapper.getStatement('index', 'indexSummaryLately', req.body.params, {language:'sql', indent: '  '});
        var stmt2 = mapper.getStatement('index', 'indexSummaryResult', req.body.params, {language:'sql', indent: '  '});

        console.log(stmt1);
        console.log(stmt2);

        Promise.using(pool.connect(), conn => {

            Promise.all([
                conn.queryAsync(stmt1),
                conn.queryAsync(stmt2)
            ]).then( rows => {
                res.json({
                    success: true,
                    results1: rows[0],
                    results2: rows[1],
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


            /*conn.queryAsync(stmt).then(rows => {
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
            });*/


        });
    } catch (exception) {
        util.log("err==>", exception);
    }    
};

var getInfoOpenReqList = function (req, res) {
    console.log('indexSummary=>getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");

    var stmt = mapper.getStatement('index', 'indexReqList', req.query.params, {language:'sql', indent: '  '});

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
};



var updateIndexOpenYn = function(req, res) {
    
    try {
        console.log('indexSummary=>updateIndexOpenYn 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var params = {
            JISU_ID : req.body.params.JISU_ID,
            INST_CD : req.body.params.INST_CD
        }

        // 세션 로그인키 바인딩
        if (req.session.loginkey) {
            params.UPD_ID = req.session.loginkey;
        } else {
            params.UPD_ID = 'system';
        }

        // 공개 처리 플래그
        if (req.body.params.reqFlag == true) {
            params.FLAG = '2';
        } else {
            params.FLAG = '0';
        }

        util.log("req.body.params.reqFlag", JSON.stringify(params));
        
        
        var stmt = mapper.getStatement('index', 'updateIndexOpenYn', params, {language:'sql', indent: '  '});
    
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
    } catch(err) {
        util.log("err=>", err);
    }    
}


/*
* 관리지 목록
*/
var getInfoIndexList = function (req, res) {
    console.log('indexSummary=>getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");

    var stmt = mapper.getStatement('index', 'getIndexList', req.query.params, {language:'sql', indent: '  '});

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
};

/*
* 지수 요약정보 그래프 데이터
*/
var getIndexSummaryHist = function (req, res) {
    try {
        console.log('indexSummary=>getindexsummaryhist 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        console.log("req.query");
        console.log(req.query);
        var options = {
            JISU_ID: req.query.jisu_id
        };

        var stmt = mapper.getStatement('index', 'selectIndexSummaryHist', options, {language:'sql', indent: '  '});
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
* 지수 기본 정보 
*/
var getIndexBaseInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexBaseInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexBaseInfo', options, {language:'sql', indent: '  '});
     

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
* 지수 기본 정보 그래프 데이터
*/
var getIndexEtpHistoryData = function (req, res) {
    try {
        console.log('indexSummary=>getIndexEtpHistoryData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexEtpHistoryData', options, {language:'sql', indent: '  '});
     

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
* 지수에 속한 ETP 정보
*/
var getIndexInEtpInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexInEtpInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexInEtpInfo', options, {language:'sql', indent: '  '});
     

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


 

module.exports.getIndexSummaryInfo = getIndexSummaryInfo;
module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.updateIndexOpenYn = updateIndexOpenYn;
module.exports.getInfoIndexList = getInfoIndexList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;
module.exports.getIndexBaseInfo = getIndexBaseInfo;
module.exports.getIndexEtpHistoryData = getIndexEtpHistoryData;
module.exports.getIndexInEtpInfo = getIndexInEtpInfo;
