/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");
/* 
 * etp 신청 현황  조회한다.
 * 
 *  *  */
var getEtpApplyList = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'selectEtpApplyList', options, {language:'sql', indent: '  '});
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
var getEtpApplyDistCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyDistCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
         };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyDistCnt', options, {language:'sql', indent: '  '});
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
var getEtpApplyIndexCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyIndexCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
         };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyIndexCnt', options, {language:'sql', indent: '  '});
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
var getEtpApplyCodeCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyCodeCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
         };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyCodeCnt', options, {language:'sql', indent: '  '});
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
var getEtpApplyInavCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyInavCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
         };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyInavCnt', options, {language:'sql', indent: '  '});
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
module.exports.getEtpApplyList = getEtpApplyList;
module.exports.getEtpApplyDistCnt = getEtpApplyDistCnt;
module.exports.getEtpApplyIndexCnt = getEtpApplyIndexCnt;
module.exports.getEtpApplyCodeCnt = getEtpApplyCodeCnt;
module.exports.getEtpApplyInavCnt = getEtpApplyInavCnt;